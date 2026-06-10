"""Бізнес-логіка профілю водія."""
from typing import Optional

from sqlmodel import Session, select

from app.errors import conflict
from app.models import DriverProfile, User
from app.schemas.driver import AvailabilityUpdate, DriverProfileUpsert


def get_profile(session: Session, user_id: str) -> Optional[DriverProfile]:
    return session.exec(
        select(DriverProfile).where(DriverProfile.user_id == user_id)
    ).first()


def upsert_profile(session: Session, user: User, data: DriverProfileUpsert) -> DriverProfile:
    """Створює або оновлює описові поля. Доступність/координати лишає без змін."""
    plate = data.license_plate.strip().upper()
    profile = get_profile(session, user.id)
    if profile is None:
        profile = DriverProfile(
            user_id=user.id,
            vehicle_type=data.vehicle_type,
            capacity_kg=data.capacity_kg,
            license_plate=plate,
        )
    else:
        profile.vehicle_type = data.vehicle_type
        profile.capacity_kg = data.capacity_kg
        profile.license_plate = plate

    session.add(profile)
    session.commit()
    session.refresh(profile)
    return profile


def set_availability(session: Session, user: User, data: AvailabilityUpdate) -> DriverProfile:
    profile = get_profile(session, user.id)
    if profile is None:
        raise conflict(
            "Create a driver profile before setting availability",
            code="profile_required",
        )

    profile.is_available = data.is_available
    # Координати оновлюємо лише коли передані (PATCH-семантика для MVP).
    if data.current_lat is not None:
        profile.current_lat = data.current_lat
    if data.current_lng is not None:
        profile.current_lng = data.current_lng

    session.add(profile)
    session.commit()
    session.refresh(profile)
    return profile
