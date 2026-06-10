from pydantic import Field

from app.models import Role
from app.schemas.base import CamelModel
from app.schemas.user import UserPublic


class RegisterRequest(CamelModel):
    role: Role
    full_name: str = Field(min_length=1, max_length=120)
    phone: str = Field(min_length=5, max_length=32)
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(CamelModel):
    phone: str = Field(min_length=5, max_length=32)
    password: str = Field(min_length=1, max_length=128)


class TokenResponse(CamelModel):
    token: str
    user: UserPublic
