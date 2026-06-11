"""Бізнес-логіка відгуків і перерахунку рейтингу (Фаза 6)."""
from sqlalchemy import func
from sqlmodel import Session, select

from app.errors import conflict, forbidden, not_found
from app.models import Order, OrderStatus, Review, User
from app.schemas.review import ReviewCreate


def _recompute_rating(session: Session, target: User) -> None:
    """Перерахунок rating_avg/rating_count цілі агрегатом з нуля (без дрейфу)."""
    count, avg = session.exec(
        select(func.count(Review.id), func.avg(Review.score)).where(
            Review.to_user_id == target.id
        )
    ).one()
    target.rating_count = count or 0
    target.rating_avg = round(float(avg), 2) if avg is not None else 0.0
    session.add(target)


def create_review(session: Session, author: User, order_id: str, data: ReviewCreate) -> Review:
    order = session.get(Order, order_id)
    if order is None:
        raise not_found("Order not found", code="order_not_found")
    if author.id not in (order.client_id, order.driver_id):
        raise forbidden("You are not a participant of this order")
    if order.status != OrderStatus.COMPLETED:
        raise conflict("Order must be completed before reviewing", code="order_not_completed")

    # Ціль — інший учасник завершеного замовлення.
    target_id = order.driver_id if author.id == order.client_id else order.client_id

    # Лочимо рядок цілі: серіалізує конкурентні перерахунки рейтингу.
    target = session.exec(
        select(User).where(User.id == target_id).with_for_update()
    ).first()
    if target is None:  # захист; для COMPLETED обидва учасники існують
        raise not_found("Target user not found", code="user_not_found")

    existing = session.exec(
        select(Review).where(
            Review.order_id == order_id, Review.from_user_id == author.id
        )
    ).first()
    if existing is not None:
        raise conflict("You already reviewed this order", code="already_reviewed")

    review = Review(
        order_id=order_id,
        from_user_id=author.id,
        to_user_id=target_id,
        score=data.score,
        comment=data.comment,
    )
    session.add(review)
    session.flush()  # робимо відгук видимим для агрегату в межах цієї транзакції

    _recompute_rating(session, target)

    session.commit()
    session.refresh(review)
    return review
