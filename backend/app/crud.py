from sqlalchemy import func, select
from sqlalchemy.orm import Session

from . import models


def pending_balance(db: Session, client: models.Client) -> float:
    total_paid = db.scalar(
        select(func.coalesce(func.sum(models.Payment.amount), 0)).where(
            models.Payment.client_id == client.id
        )
    )
    package = float(client.total_package or 0)
    return package - float(total_paid or 0)


def client_to_out(db: Session, client: models.Client) -> dict:
    return {
        "id": client.id,
        "name": client.name,
        "phone": client.phone,
        "email": client.email,
        "instagram": client.instagram,
        "event_type": client.event_type,
        "event_date": client.event_date,
        "total_package": client.total_package,
        "stage": client.stage,
        "created_at": client.created_at,
        "pending_balance": pending_balance(db, client),
    }
