"""Бізнес-логіка автентифікації: реєстрація і вхід."""
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from app.errors import conflict, unauthorized
from app.models import User
from app.schemas.auth import RegisterRequest
from app.security import hash_password, verify_password


def _find_by_phone(session: Session, phone: str) -> User | None:
    return session.exec(select(User).where(User.phone == phone)).first()


def register_user(session: Session, data: RegisterRequest) -> User:
    phone = data.phone.strip()
    if _find_by_phone(session, phone) is not None:
        raise conflict("Phone already registered", code="phone_taken")

    user = User(
        role=data.role,
        full_name=data.full_name.strip(),
        phone=phone,
        password_hash=hash_password(data.password),
    )
    session.add(user)
    try:
        session.commit()
    except IntegrityError:
        # Гонка: хтось зайняв телефон між перевіркою і commit — захищає UNIQUE-констрейнт.
        session.rollback()
        raise conflict("Phone already registered", code="phone_taken")
    session.refresh(user)
    return user


def authenticate(session: Session, phone: str, password: str) -> User:
    user = _find_by_phone(session, phone.strip())
    # Однакова помилка для неіснуючого телефону і невірного пароля — без user enumeration.
    if user is None or not verify_password(password, user.password_hash):
        raise unauthorized("Invalid phone or password", code="invalid_credentials")
    return user
