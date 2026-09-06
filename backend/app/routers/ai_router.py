from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.orm import Session
from typing import Optional, List
from backend.app.database import get_db
from backend.app import models, ai_engine

router = APIRouter(prefix="/api/ai", tags=["AI Engine & Upgraded Forecasting"])

@router.get("/upgraded-forecast")
def get_upgraded_price_forecast(
    crop_name: str = Query("Wheat"),
    current_price: float = Query(2450.0),
    horizon_days: int = Query(15),
    active_event_type: Optional[str] = Query(None),
    region: str = Query("Punjab - Ludhiana")
):
    return ai_engine.predict_crop_prices_upgraded(
        crop_name=crop_name,
        current_price=current_price,
        horizon_days=horizon_days,
        active_event_type=active_event_type,
        region=region
    )

@router.get("/events")
def get_external_events():
    return list(ai_engine.EVENT_PRESETS.values())

@router.post("/simulate-event")
def simulate_external_event(
    crop_name: str = Body("Wheat"),
    current_price: float = Body(2450.0),
    horizon_days: int = Body(15),
    event_type: str = Body("Heavy Rainfall"),
    region: str = Body("Punjab - Ludhiana")
):
    return ai_engine.predict_crop_prices_upgraded(
        crop_name=crop_name,
        current_price=current_price,
        horizon_days=horizon_days,
        active_event_type=event_type,
        region=region
    )

@router.get("/model-validation")
def get_model_validation():
    return ai_engine.get_model_validation_stats()

@router.get("/price-prediction")
def get_price_prediction(
    crop_name: str = Query("Wheat"),
    current_price: float = Query(2450.0)
):
    return ai_engine.predict_crop_prices(crop_name, current_price)

@router.get("/sale-window-recommendation")
def get_sale_window_advice(
    crop_name: str = Query("Wheat"),
    quantity_quintals: float = Query(100.0),
    current_price: float = Query(2450.0),
    storage_available: bool = Query(True),
    active_event_type: Optional[str] = Query(None)
):
    return ai_engine.get_sale_window_recommendation_upgraded(
        crop_name=crop_name,
        quantity_quintals=quantity_quintals,
        current_price=current_price,
        storage_available=storage_available,
        active_event_type=active_event_type
    )

@router.get("/buyer-matches")
def get_buyer_matches_for_lot(
    lot_id: int = Query(1),
    db: Session = Depends(get_db)
):
    lot = db.query(models.CropLot).filter(models.CropLot.id == lot_id).first()
    if not lot:
        lot_crop, lot_qty, lot_grade, lot_moisture, lot_price, lot_dist = "Wheat", 120.0, "Grade A", 11.2, 2450.0, 35.0
    else:
        lot_crop, lot_qty, lot_grade, lot_moisture, lot_price, lot_dist = lot.crop_name, lot.quantity_quintals, lot.grade, lot.moisture_pct, lot.minimum_price, 35.0

    requirements = db.query(models.BuyerRequirement).all()
    results = []
    
    for req in requirements:
        buyer = db.query(models.User).filter(models.User.id == req.buyer_id).first()
        buyer_name = buyer.name if buyer else "Institutional Agro Buyer"
        buyer_badge = buyer.verification_badge if buyer else "VERIFIED"
        buyer_rel = buyer.reliability_score if buyer else 4.7
        
        req_dict = {
            "crop_name": req.crop_name,
            "quantity_quintals": req.quantity_quintals,
            "grade": req.grade,
            "max_moisture_pct": req.max_moisture_pct,
            "target_price": req.target_price,
            "max_distance_km": req.max_distance_km
        }
        
        match_info = ai_engine.calculate_buyer_match_score(
            lot_crop=lot_crop,
            lot_qty=lot_qty,
            lot_grade=lot_grade,
            lot_moisture=lot_moisture,
            lot_price=lot_price,
            lot_distance=lot_dist,
            buyer_req=req_dict,
            buyer_reliability=buyer_rel,
            buyer_badge=buyer_badge
        )
        
        results.append({
            "requirement_id": req.id,
            "buyer_id": req.buyer_id,
            "buyer_name": buyer_name,
            "buyer_badge": buyer_badge,
            "buyer_reliability": buyer_rel,
            "crop_name": req.crop_name,
            "requested_qty": req.quantity_quintals,
            "target_price": req.target_price,
            "preferred_location": req.preferred_location,
            "delivery_deadline": req.delivery_deadline,
            "match": match_info
        })
        
    results.sort(key=lambda x: x["match"]["match_score"], reverse=True)
    return {
        "lot_id": lot_id,
        "crop_name": lot_crop,
        "matches": results
    }
