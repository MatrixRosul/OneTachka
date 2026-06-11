from typing import List

from fastapi import APIRouter, status

from app.deps import ClientUser, CurrentUser, DriverUser, SessionDep
from app.schemas.order import OrderCreate, OrderPublic, OrderPriceUpdate, OrderStatusUpdate
from app.services import order_service

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderPublic, status_code=status.HTTP_201_CREATED)
def create_order(data: OrderCreate, user: ClientUser, session: SessionDep) -> OrderPublic:
    order = order_service.create_order(session, user, data)
    return OrderPublic.model_validate(order)


@router.get("", response_model=List[OrderPublic])
def my_orders(user: CurrentUser, session: SessionDep) -> List[OrderPublic]:
    orders = order_service.list_orders_for(session, user)
    reviewed = order_service.reviewed_order_ids(session, user.id, [o.id for o in orders])
    result = []
    for o in orders:
        op = OrderPublic.model_validate(o)
        op.reviewed_by_me = o.id in reviewed
        result.append(op)
    return result


# ВАЖЛИВО: /available має бути оголошений ДО /{order_id},
# інакше "available" перехопиться як значення order_id.
@router.get("/available", response_model=List[OrderPublic])
def available_orders(user: DriverUser, session: SessionDep) -> List[OrderPublic]:
    orders = order_service.list_available_for(session, user)
    return [OrderPublic.model_validate(o) for o in orders]


@router.get("/{order_id}", response_model=OrderPublic)
def get_order(order_id: str, user: CurrentUser, session: SessionDep) -> OrderPublic:
    order = order_service.get_order_for(session, user, order_id)
    op = OrderPublic.model_validate(order)
    op.reviewed_by_me = bool(order_service.reviewed_order_ids(session, user.id, [order.id]))
    return op


@router.post("/{order_id}/accept", response_model=OrderPublic)
def accept_order(order_id: str, user: DriverUser, session: SessionDep) -> OrderPublic:
    order = order_service.accept_order(session, user, order_id)
    return OrderPublic.model_validate(order)


@router.post("/{order_id}/status", response_model=OrderPublic)
def update_status(
    order_id: str, data: OrderStatusUpdate, user: DriverUser, session: SessionDep
) -> OrderPublic:
    order = order_service.update_status(session, user, order_id, data.status)
    return OrderPublic.model_validate(order)


@router.post("/{order_id}/cancel", response_model=OrderPublic)
def cancel_order(order_id: str, user: CurrentUser, session: SessionDep) -> OrderPublic:
    order = order_service.cancel_order(session, user, order_id)
    return OrderPublic.model_validate(order)


@router.post("/{order_id}/price", response_model=OrderPublic)
def set_price(
    order_id: str, data: OrderPriceUpdate, user: DriverUser, session: SessionDep
) -> OrderPublic:
    order = order_service.set_price(session, user, order_id, data.price)
    return OrderPublic.model_validate(order)
