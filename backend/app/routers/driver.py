from fastapi import APIRouter

from app.deps import DriverUser, SessionDep
from app.schemas.driver import AvailabilityUpdate, DriverProfileUpsert
from app.schemas.user import DriverProfilePublic
from app.services import driver_service

router = APIRouter(prefix="/driver", tags=["driver"])


@router.put("/profile", response_model=DriverProfilePublic)
def put_profile(
    data: DriverProfileUpsert, user: DriverUser, session: SessionDep
) -> DriverProfilePublic:
    profile = driver_service.upsert_profile(session, user, data)
    return DriverProfilePublic.model_validate(profile)


@router.patch("/availability", response_model=DriverProfilePublic)
def patch_availability(
    data: AvailabilityUpdate, user: DriverUser, session: SessionDep
) -> DriverProfilePublic:
    profile = driver_service.set_availability(session, user, data)
    return DriverProfilePublic.model_validate(profile)
