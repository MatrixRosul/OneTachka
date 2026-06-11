"""Бізнес-логіка замовлень.

Фаза 3 — створення/перегляд; Фаза 4 — матчинг/прийняття;
Фаза 5 — життєвий цикл (status/cancel) зі стан-машиною (план, Частина 6).
"""
from decimal import Decimal
from typing import List

from sqlmodel import Session, select

from app.errors import conflict, forbidden, not_found
from app.models import DriverProfile, Order, OrderStatus, Review, Role, User, VehicleType, utcnow
from app.schemas.order import OrderCreate

# Дозволені переходи "вперед", які робить призначений водій:
# ціль -> який поточний статус для неї обовʼязковий.
_REQUIRED_CURRENT = {
    OrderStatus.IN_PROGRESS: OrderStatus.ACCEPTED,
    OrderStatus.COMPLETED: OrderStatus.IN_PROGRESS,
}

# З яких статусів можна скасувати (решта — заборонено).
_CANCELLABLE = {OrderStatus.SEARCHING, OrderStatus.ACCEPTED}

# Базова (константна) ціна за типом авто — поки без розрахунку.
_BASE_PRICE = {
    VehicleType.CAR: Decimal("400"),
    VehicleType.VAN: Decimal("700"),
    VehicleType.TRUCK_SMALL: Decimal("1200"),
    VehicleType.TRUCK_LARGE: Decimal("1800"),
}

# Водій може коригувати ціну поки замовлення активне.
_PRICE_EDITABLE = {OrderStatus.ACCEPTED, OrderStatus.IN_PROGRESS}


def create_order(session: Session, client: User, data: OrderCreate) -> Order:
    payload = data.model_dump()
    if payload.get("price") is None:
        payload["price"] = _BASE_PRICE[data.vehicle_type]
    order = Order(client_id=client.id, **payload)
    session.add(order)
    session.commit()
    session.refresh(order)
    return order


def list_orders_for(session: Session, user: User) -> List[Order]:
    """CLIENT бачить свої створені, DRIVER — свої прийняті. Новіші — першими."""
    if user.role == Role.CLIENT:
        stmt = select(Order).where(Order.client_id == user.id)
    else:
        stmt = select(Order).where(Order.driver_id == user.id)
    stmt = stmt.order_by(Order.created_at.desc())
    return list(session.exec(stmt).all())


def reviewed_order_ids(session: Session, user_id: str, order_ids: List[str]) -> set:
    """ID замовлень, які цей користувач уже оцінив (для прапорця reviewedByMe)."""
    if not order_ids:
        return set()
    rows = session.exec(
        select(Review.order_id).where(
            Review.from_user_id == user_id, Review.order_id.in_(order_ids)
        )
    ).all()
    return set(rows)


def get_order_for(session: Session, user: User, order_id: str) -> Order:
    """Деталі замовлення лише для учасника (клієнт або призначений водій)."""
    order = session.get(Order, order_id)
    if order is None:
        raise not_found("Order not found", code="order_not_found")
    if user.id not in (order.client_id, order.driver_id):
        raise forbidden("You are not a participant of this order")
    return order


def _get_locked_order(session: Session, order_id: str) -> Order:
    """Дістати замовлення під рядковим блокуванням (SELECT ... FOR UPDATE).

    Серіалізує конкурентні accept/status/cancel на одному рядку: другий запит
    чекає на знятті блокування і перечитує найновіший стан.
    """
    order = session.exec(
        select(Order).where(Order.id == order_id).with_for_update()
    ).first()
    if order is None:
        raise not_found("Order not found", code="order_not_found")
    return order


def _require_profile(session: Session, driver: User) -> DriverProfile:
    profile = session.exec(
        select(DriverProfile).where(DriverProfile.user_id == driver.id)
    ).first()
    if profile is None:
        raise conflict(
            "Create a driver profile before browsing/accepting orders",
            code="profile_required",
        )
    return profile


def _vehicle_matches(profile: DriverProfile, order: Order) -> bool:
    return (
        order.vehicle_type == profile.vehicle_type
        and profile.capacity_kg >= order.weight_kg
    )


def list_available_for(session: Session, driver: User) -> List[Order]:
    """Відкриті (SEARCHING) замовлення під авто водія. Старіші — першими (FIFO)."""
    profile = _require_profile(session, driver)
    stmt = (
        select(Order)
        .where(
            Order.status == OrderStatus.SEARCHING,
            Order.vehicle_type == profile.vehicle_type,
            Order.weight_kg <= profile.capacity_kg,
        )
        .order_by(Order.created_at.asc())
    )
    return list(session.exec(stmt).all())


def accept_order(session: Session, driver: User, order_id: str) -> Order:
    """Атомарне прийняття: перший водій забирає, решта отримує 409."""
    profile = _require_profile(session, driver)
    order = _get_locked_order(session, order_id)

    if order.status != OrderStatus.SEARCHING:
        raise conflict("Order is no longer available", code="order_not_available")
    if not _vehicle_matches(profile, order):
        raise conflict("Your vehicle does not match this order", code="vehicle_mismatch")

    order.status = OrderStatus.ACCEPTED
    order.driver_id = driver.id
    order.accepted_at = utcnow()
    session.add(order)
    session.commit()
    session.refresh(order)
    return order


def update_status(session: Session, driver: User, order_id: str, target: OrderStatus) -> Order:
    """Призначений водій рухає замовлення ACCEPTED->IN_PROGRESS->COMPLETED."""
    order = _get_locked_order(session, order_id)

    if order.driver_id != driver.id:
        raise forbidden("Only the assigned driver can change this order's status")

    required = _REQUIRED_CURRENT.get(target)
    if required is None or order.status != required:
        raise conflict(
            f"Cannot move order to {target.value} from {order.status.value}",
            code="invalid_transition",
        )

    order.status = target
    if target == OrderStatus.COMPLETED:
        order.completed_at = utcnow()
    session.add(order)
    session.commit()
    session.refresh(order)
    return order


def cancel_order(session: Session, user: User, order_id: str) -> Order:
    """Скасування за стан-машиною: SEARCHING — лише клієнт; ACCEPTED — клієнт
    або призначений водій; з решти статусів — заборонено."""
    order = _get_locked_order(session, order_id)

    if order.status not in _CANCELLABLE:
        raise conflict(
            f"Order cannot be cancelled from {order.status.value}",
            code="cannot_cancel",
        )

    if order.status == OrderStatus.SEARCHING:
        allowed = user.id == order.client_id
    else:  # ACCEPTED
        allowed = user.id in (order.client_id, order.driver_id)
    if not allowed:
        raise forbidden("You are not allowed to cancel this order")

    order.status = OrderStatus.CANCELLED
    session.add(order)
    session.commit()
    session.refresh(order)
    return order


def set_price(session: Session, driver: User, order_id: str, price: Decimal) -> Order:
    """Призначений водій коригує ціну поки замовлення активне (ACCEPTED/IN_PROGRESS)."""
    order = _get_locked_order(session, order_id)
    if order.driver_id != driver.id:
        raise forbidden("Only the assigned driver can change the price")
    if order.status not in _PRICE_EDITABLE:
        raise conflict(
            f"Price cannot be changed from {order.status.value}",
            code="price_not_editable",
        )
    order.price = price
    session.add(order)
    session.commit()
    session.refresh(order)
    return order
