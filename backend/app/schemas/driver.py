from typing import Optional

from pydantic import Field

from app.models import VehicleType
from app.schemas.base import CamelModel


class DriverProfileUpsert(CamelModel):
    """Описові поля профілю. is_available/координати тут не чіпаємо (див. PATCH)."""

    vehicle_type: VehicleType
    capacity_kg: int = Field(gt=0, le=100_000)
    license_plate: str = Field(min_length=4, max_length=16)


class AvailabilityUpdate(CamelModel):
    is_available: bool
    current_lat: Optional[float] = Field(default=None, ge=-90, le=90)
    current_lng: Optional[float] = Field(default=None, ge=-180, le=180)
