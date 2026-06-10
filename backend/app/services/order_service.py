"""Бізнес-логіка замовлень: створення/перегляд (Фаза 3), матчинг/прийняття (Фаза 4)."""
from typing import List, Optional

from sqlmodel import Session, select

from app.errors import conflict, forbidden, not_found
from app.models import DriverProfile, Order, OrderStatus, Role, User, utcnow
from app.schemas.order import OrderCreate


def create_order(session: Session, client: User, data: OrderCreate) -> Order:
    order = Order(client_id=client.id, **data.model_dump())
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


def get_order_for(session: Session, user: User, order_id: str) -> Order:
    """Деталі замовлення лише для учасника (клієнт або призначений водій)."""
    order = session.get(Order, order_id)
    if order is None:
        raise not_found("Order not found", code="order_not_found")
    if user.id not in (order.client_id, order.driver_id):
        raise forbidden("You are not a participant of this order")
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
    """Атомарне прийняття: перший водій забирає, решта отримує 409.

    Блокуємо рядок через SELECT ... FOR UPDATE. Під READ COMMITTED другий
    конкурентний запит чекає на знятті блокування і перечитує найновішу
    версію рядка — бачить уже ACCEPTED і отримує order_not_available.
    """
    profile = _require_profile(session, driver)

    order = session.exec(
        select(Order).where(Order.id == order_id).with_for_update()
    ).first()
    if order is None:
        raise not_found("Order not found", code="order_not_found")
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
