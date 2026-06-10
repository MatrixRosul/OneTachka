from typing import Generator

from sqlmodel import Session, create_engine

from app.config import settings

engine = create_engine(settings.database_url, echo=False, pool_pre_ping=True)


def get_session() -> Generator[Session, None, None]:
    """FastAPI-залежність: сесія БД на час запиту."""
    with Session(engine) as session:
        yield session
