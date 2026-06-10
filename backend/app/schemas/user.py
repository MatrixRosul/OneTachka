from datetime import datetime
from typing import Optional

from app.models import Role, VehicleType
from app.schemas.base import CamelModel


class DriverProfilePublic(CamelModel):
    vehicle_type: VehicleType
    capacity_kg: int
    license_plate: str
    is_available: bool
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None


class UserPublic(CamelModel):
    id: str
    role: Role
    full_name: str
    phone: str
    rating_avg: float
    rating_count: int
    created_at: datetime
    driver_profile: Optional[DriverProfilePublic] = None
