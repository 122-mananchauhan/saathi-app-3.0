from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app import models, schemas, auth

router = APIRouter(prefix="/api/crops", tags=["Crops"])

@router.get("/lots", response_model=List[schemas.CropLotResponse])
def list_crop_lots(
    crop_name: Optional[str] = None,
    district: Optional[str] = None,
    min_qty: Optional[float] = None,
    is_bulk: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.CropLot)
    if crop_name:
        query = query.filter(models.CropLot.crop_name.ilike(f"%{crop_name}%"))
    if district:
        query = query.filter(models.CropLot.district.ilike(f"%{district}%"))
    if min_qty:
        query = query.filter(models.CropLot.quantity_quintals >= min_qty)
    if is_bulk is not None:
        query = query.filter(models.CropLot.is_bulk == is_bulk)
    return query.all()

@router.post("/lots", response_model=schemas.CropLotResponse)
def create_crop_lot(
    lot_in: schemas.CropLotCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else 1
    fpo_name = current_user.name if (current_user and current_user.role == "fpo") else lot_in.fpo_name
    
    lot = models.CropLot(
        seller_id=user_id,
        crop_name=lot_in.crop_name,
        quantity_quintals=lot_in.quantity_quintals,
        grade=lot_in.grade,
        moisture_pct=lot_in.moisture_pct,
        grain_size=lot_in.grain_size,
        variety=lot_in.variety,
        minimum_price=lot_in.minimum_price,
        location=lot_in.location,
        district=lot_in.district,
        state=lot_in.state,
        storage_available=lot_in.storage_available,
        storage_cost_per_quintal_month=lot_in.storage_cost_per_quintal_month,
        image_url=lot_in.image_url,
        is_bulk=lot_in.is_bulk,
        fpo_name=fpo_name,
        aggregated_farmer_count=lot_in.aggregated_farmer_count,
        status="Active"
    )
    db.add(lot)
    db.commit()
    db.refresh(lot)
    return lot

@router.get("/lots/{lot_id}", response_model=schemas.CropLotResponse)
def get_crop_lot(lot_id: int, db: Session = Depends(get_db)):
    lot = db.query(models.CropLot).filter(models.CropLot.id == lot_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Crop lot not found")
    return lot
