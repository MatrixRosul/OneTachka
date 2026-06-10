from fastapi import APIRouter, status

from app.deps import CurrentUser, SessionDep
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserPublic
from app.security import create_access_token
from app.services import auth_service

router = APIRouter(tags=["auth"])


def _token_response(user) -> TokenResponse:
    token = create_access_token(user.id, user.role)
    return TokenResponse(token=token, user=UserPublic.model_validate(user))


@router.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(data: RegisterRequest, session: SessionDep) -> TokenResponse:
    user = auth_service.register_user(session, data)
    return _token_response(user)


@router.post("/auth/login", response_model=TokenResponse)
def login(data: LoginRequest, session: SessionDep) -> TokenResponse:
    user = auth_service.authenticate(session, data.phone, data.password)
    return _token_response(user)


@router.get("/me", response_model=UserPublic)
def me(user: CurrentUser) -> UserPublic:
    # driver_profile підвантажується ліниво в межах активної сесії запиту.
    return UserPublic.model_validate(user)
