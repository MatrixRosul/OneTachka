"""Спільні FastAPI-залежності: сесія БД, поточний користувач, перевірка ролі."""
from typing import Annotated, Callable

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session

from app.db import get_session
from app.errors import forbidden, unauthorized
from app.models import Role, User
from app.security import JWTError, decode_token

SessionDep = Annotated[Session, Depends(get_session)]

# auto_error=False — самі формуємо помилку у нашому форматі {error:{code,message}}.
_bearer = HTTPBearer(auto_error=False)


def get_current_user(
    session: SessionDep,
    creds: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)] = None,
) -> User:
    if creds is None:
        raise unauthorized("Missing bearer token")
    try:
        payload = decode_token(creds.credentials)
    except JWTError:
        raise unauthorized("Invalid or expired token")

    user_id = payload.get("sub")
    if not user_id:
        raise unauthorized("Invalid token")

    user = session.get(User, user_id)
    if user is None:
        raise unauthorized("User not found")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_role(*roles: Role) -> Callable[..., User]:
    """Залежність, що пускає лише користувачів із дозволеною роллю."""

    def checker(user: CurrentUser) -> User:
        if user.role not in roles:
            raise forbidden("Insufficient role for this action")
        return user

    return checker
