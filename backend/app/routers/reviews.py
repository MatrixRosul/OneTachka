from fastapi import APIRouter, status

from app.deps import CurrentUser, SessionDep
from app.schemas.review import ReviewCreate, ReviewPublic
from app.services import review_service

router = APIRouter(prefix="/orders", tags=["reviews"])


@router.post(
    "/{order_id}/review",
    response_model=ReviewPublic,
    status_code=status.HTTP_201_CREATED,
)
def create_review(
    order_id: str, data: ReviewCreate, user: CurrentUser, session: SessionDep
) -> ReviewPublic:
    review = review_service.create_review(session, user, order_id, data)
    return ReviewPublic.model_validate(review)
