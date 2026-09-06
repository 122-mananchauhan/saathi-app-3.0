from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.database import get_db
from backend.app import models, schemas, auth

router = APIRouter(prefix="/api/disputes", tags=["Disputes & Grievances"])

@router.get("", response_model=List[schemas.DisputeResponse])
def list_disputes(db: Session = Depends(get_db)):
    return db.query(models.Dispute).all()

@router.post("", response_model=schemas.DisputeResponse)
def create_dispute(
    dispute_in: schemas.DisputeCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    raised_by = current_user.name if current_user else "Farmer / Buyer"
    dispute = models.Dispute(
        order_id=dispute_in.order_id,
        raised_by_name=raised_by,
        category=dispute_in.category,
        title=dispute_in.title,
        description=dispute_in.description,
        evidence_url=dispute_in.evidence_url,
        status="Open"
    )
    db.add(dispute)
    db.commit()
    db.refresh(dispute)
    return dispute

@router.post("/{dispute_id}/resolve")
def resolve_dispute(
    dispute_id: int,
    resolution_notes: str,
    status: str = "Resolved",
    db: Session = Depends(get_db)
):
    dispute = db.query(models.Dispute).filter(models.Dispute.id == dispute_id).first()
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")
    dispute.status = status
    dispute.resolution_notes = resolution_notes
    db.commit()
    return dispute
