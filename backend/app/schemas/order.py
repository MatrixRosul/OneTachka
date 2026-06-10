from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import Field

from app.models import OrderStatus, VehicleType
from app.schemas.base import CamelModel


class OrderCreate(CamelModel):
    pickup_address: str = Field(min_length=3, max_length=255)
    pickup_lat: float = Field(ge=-90, le=90)
    pickup_lng: float = Field(ge=-180, le=180)
    dropoff_address: str = Field(min_length=3, max_length=255)
    dropoff_lat: float = Field(ge=-90, le=90)
    dropoff_lng: float = Field(ge=-180, le=180)

    cargo_type: str = Field(min_length=1, max_length=120)
    weight_kg: int = Field(gt=0, le=100_000)
    vehicle_type: VehicleType
    description: Optional[str] = Field(default=None, max_length=1000)
    price: Optional[Decimal] = Field(default=None, gt=0, max_digits=10, decimal_places=2)


class OrderPublic(CamelModel):
    id: str
    status: OrderStatus
    client_id: str
    driver_id: Optional[str] = None

    pickup_address: str
    pickup_lat: float
    pickup_lng: float
    dropoff_address: str
    dropoff_lat: float
    dropoff_lng: float

    cargo_type: str
    weight_kg: int
    vehicle_type: VehicleType
    description: Optional[str] = None
    price: Optional[Decimal] = None

    created_at: datetime
    accepted_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
