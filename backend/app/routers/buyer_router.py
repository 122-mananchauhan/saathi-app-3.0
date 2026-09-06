from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.database import get_db
from backend.app import models, schemas, auth

router = APIRouter(prefix="/api/buyer", tags=["Buyer Requirements & Verification"])

@router.get("/requirements", response_model=List[schemas.BuyerRequirementResponse])
def get_buyer_requirements(db: Session = Depends(get_db)):
    return db.query(models.BuyerRequirement).all()

@router.post("/requirements", response_model=schemas.BuyerRequirementResponse)
def create_buyer_requirement(
    req_in: schemas.BuyerRequirementCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    buyer_id = current_user.id if current_user else 3
    req = models.BuyerRequirement(
        buyer_id=buyer_id,
        crop_name=req_in.crop_name,
        quantity_quintals=req_in.quantity_quintals,
        grade=req_in.grade,
        max_moisture_pct=req_in.max_moisture_pct,
        target_price=req_in.target_price,
        preferred_location=req_in.preferred_location,
        max_distance_km=req_in.max_distance_km,
        delivery_deadline=req_in.delivery_deadline,
        status="Open"
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return req

@router.get("/profile/{buyer_id}")
def get_buyer_profile(buyer_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == buyer_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Buyer profile not found")
        
    return {
        "id": user.id,
        "name": user.name,
        "company_type": "Institutional Processor & Exporter",
        "location": f"{user.district}, {user.state}",
        "verification_badge": user.verification_badge,
        "reliability_score": user.reliability_score,
        "completed_transactions": 48,
        "payment_reliability": "Excellent (100% On-time Escrow Payouts)",
        "typical_commodities": ["Wheat", "Paddy (Rice)", "Soybean"]
    }
