from typing import List

from fastapi import APIRouter, status

from app.deps import ClientUser, CurrentUser, DriverUser, SessionDep
from app.schemas.order import OrderCreate, OrderPublic
from app.services import order_service

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderPublic, status_code=status.HTTP_201_CREATED)
def create_order(data: OrderCreate, user: ClientUser, session: SessionDep) -> OrderPublic:
    order = order_service.create_order(session, user, data)
    return OrderPublic.model_validate(order)


@router.get("", response_model=List[OrderPublic])
def my_orders(user: CurrentUser, session: SessionDep) -> List[OrderPublic]:
    orders = order_service.list_orders_for(session, user)
    return [OrderPublic.model_validate(o) for o in orders]


# ВАЖЛИВО: /available має бути оголошений ДО /{order_id},
# інакше "available" перехопиться як значення order_id.
@router.get("/available", response_model=List[OrderPublic])
def available_orders(user: DriverUser, session: SessionDep) -> List[OrderPublic]:
    orders = order_service.list_available_for(session, user)
    return [OrderPublic.model_validate(o) for o in orders]


@router.get("/{order_id}", response_model=OrderPublic)
def get_order(order_id: str, user: CurrentUser, session: SessionDep) -> OrderPublic:
    order = order_service.get_order_for(session, user, order_id)
    return OrderPublic.model_validate(order)


@router.post("/{order_id}/accept", response_model=OrderPublic)
def accept_order(order_id: str, user: DriverUser, session: SessionDep) -> OrderPublic:
    order = order_service.accept_order(session, user, order_id)
    return OrderPublic.model_validate(order)
