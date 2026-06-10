"""Бізнес-логіка замовлень: створення і перегляд (Фаза 3)."""
from typing import List

from sqlmodel import Session, select

from app.errors import forbidden, not_found
from app.models import Order, Role, User
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
