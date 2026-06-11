from datetime import datetime
from typing import Optional

from pydantic import Field

from app.schemas.base import CamelModel


class ReviewCreate(CamelModel):
    score: int = Field(ge=1, le=5)
    comment: Optional[str] = Field(default=None, max_length=1000)


class ReviewPublic(CamelModel):
    id: str
    order_id: str
    from_user_id: str
    to_user_id: str
    score: int
    comment: Optional[str] = None
    created_at: datetime
