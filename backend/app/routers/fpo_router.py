from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.app.database import get_db
from backend.app import models, schemas, auth

router = APIRouter(prefix="/api/fpo", tags=["FPO Aggregation"])

@router.get("/members")
def get_fpo_members(db: Session = Depends(get_db)):
    return db.query(models.FPOMember).all()

@router.post("/members")
def add_fpo_member(
    farmer_name: str = Body(...),
    village: str = Body(...),
    crop_name: str = Body(...),
    quantity_quintals: float = Body(...),
    harvest_date: str = Body(...),
    db: Session = Depends(get_db)
):
    member = models.FPOMember(
        fpo_id=2, # Ludhiana Progressive FPO
        farmer_name=farmer_name,
        village=village,
        crop_name=crop_name,
        quantity_quintals=quantity_quintals,
        harvest_date=harvest_date,
        is_aggregated=False
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member

@router.post("/aggregate")
def aggregate_produce_to_bulk_lot(
    member_ids: List[int] = Body(...),
    bulk_crop_name: str = Body("Wheat"),
    minimum_price: float = Body(2520.0),
    grade: str = Body("Grade A"),
    db: Session = Depends(get_db)
):
    members = db.query(models.FPOMember).filter(models.FPOMember.id.in_(member_ids)).all()
    if not members:
        raise HTTPException(status_code=400, detail="No members selected for aggregation")
        
    total_qty = sum(m.quantity_quintals for m in members)
    
    # Mark members as aggregated
    for m in members:
        m.is_aggregated = True
    db.commit()

    bulk_lot = models.CropLot(
        seller_id=2, # FPO User
        crop_name=bulk_crop_name,
        quantity_quintals=total_qty,
        grade=grade,
        moisture_pct=11.2,
        grain_size="Aggregated Premium",
        variety="PBW-725 Collective",
        minimum_price=minimum_price,
        location="FPO Aggregation Center, Khanna Mandi",
        district="Ludhiana",
        state="Punjab",
        storage_available=True,
        storage_cost_per_quintal_month=40.0,
        status="Active",
        is_bulk=True,
        fpo_name="Ludhiana Progressive Kisan FPO",
        aggregated_farmer_count=len(members)
    )
    db.add(bulk_lot)
    db.commit()
    db.refresh(bulk_lot)
    
    return {
        "message": f"Successfully aggregated produce from {len(members)} farmers into a single bulk lot of {total_qty} quintals.",
        "bulk_lot": bulk_lot
    }
