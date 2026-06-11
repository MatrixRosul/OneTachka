import uuid
from enum import Enum
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional, List

from sqlalchemy import UniqueConstraint
from sqlmodel import SQLModel, Field, Relationship


def new_id() -> str:
    return uuid.uuid4().hex


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Role(str, Enum):
    CLIENT = "CLIENT"
    DRIVER = "DRIVER"


class VehicleType(str, Enum):
    CAR = "CAR"
    VAN = "VAN"
    TRUCK_SMALL = "TRUCK_SMALL"
    TRUCK_LARGE = "TRUCK_LARGE"


class OrderStatus(str, Enum):
    SEARCHING = "SEARCHING"      # створено, шукає водія
    ACCEPTED = "ACCEPTED"        # водій прийняв
    IN_PROGRESS = "IN_PROGRESS"  # вантаж забрано, в дорозі
    COMPLETED = "COMPLETED"      # доставлено
    CANCELLED = "CANCELLED"      # скасовано


class User(SQLModel, table=True):
    id: str = Field(default_factory=new_id, primary_key=True)
    role: Role
    full_name: str
    phone: str = Field(unique=True, index=True)
    password_hash: str
    rating_avg: float = 0
    rating_count: int = 0
    created_at: datetime = Field(default_factory=utcnow)

    driver_profile: Optional["DriverProfile"] = Relationship(back_populates="user")


class DriverProfile(SQLModel, table=True):
    id: str = Field(default_factory=new_id, primary_key=True)
    user_id: str = Field(foreign_key="user.id", unique=True)
    vehicle_type: VehicleType
    capacity_kg: int
    license_plate: str
    is_available: bool = False
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None

    user: User = Relationship(back_populates="driver_profile")


class Order(SQLModel, table=True):
    id: str = Field(default_factory=new_id, primary_key=True)
    status: OrderStatus = Field(default=OrderStatus.SEARCHING, index=True)

    client_id: str = Field(foreign_key="user.id", index=True)
    driver_id: Optional[str] = Field(default=None, foreign_key="user.id", index=True)

    pickup_address: str
    pickup_lat: float
    pickup_lng: float
    dropoff_address: str
    dropoff_lat: float
    dropoff_lng: float

    cargo_type: str
    weight_kg: int
    vehicle_type: VehicleType          # який тип авто потрібен
    description: Optional[str] = None
    price: Optional[Decimal] = None     # ціну вводить клієнт вручну (MVP)

    scheduled_at: Optional[datetime] = None  # None = подати зараз; інакше — заплановано

    created_at: datetime = Field(default_factory=utcnow)
    accepted_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    reviews: List["Review"] = Relationship(back_populates="order")


class Review(SQLModel, table=True):
    # Один відгук від автора на замовлення (ціль виводиться з учасників).
    __table_args__ = (
        UniqueConstraint("order_id", "from_user_id", name="uq_review_order_author"),
    )

    id: str = Field(default_factory=new_id, primary_key=True)
    order_id: str = Field(foreign_key="order.id", index=True)
    from_user_id: str = Field(foreign_key="user.id")
    to_user_id: str = Field(foreign_key="user.id")
    score: int                          # 1..5
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=utcnow)

    order: Order = Relationship(back_populates="reviews")
