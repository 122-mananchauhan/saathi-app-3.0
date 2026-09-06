from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app import models, ai_engine

router = APIRouter(prefix="/api/market", tags=["Market Intelligence"])

@router.get("/prices")
def get_market_prices(
    commodity: Optional[str] = None,
    state: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.MarketPrice)
    if commodity:
        query = query.filter(models.MarketPrice.commodity.ilike(f"%{commodity}%"))
    if state:
        query = query.filter(models.MarketPrice.state.ilike(f"%{state}%"))
    return query.all()

@router.get("/net-realization")
def compare_net_realization(
    crop_name: str = Query("Wheat"),
    quantity_quintals: float = Query(100.0),
    storage_days: int = Query(0),
    db: Session = Depends(get_db)
):
    prices = db.query(models.MarketPrice).filter(
        models.MarketPrice.commodity.ilike(f"%{crop_name}%")
    ).all()
    
    comparisons = []
    for p in prices:
        nr = ai_engine.calculate_net_realization(
            selling_price_per_quintal=p.modal_price,
            quantity_quintals=quantity_quintals,
            distance_km=p.distance_km,
            storage_days=storage_days
        )
        comparisons.append({
            "mandi_name": p.mandi_name,
            "district": p.district,
            "state": p.state,
            "modal_price": p.modal_price,
            "distance_km": p.distance_km,
            "demand_level": p.demand_level,
            "arrivals_tons": p.arrivals_tons,
            "net_realization": nr
        })
        
    # Sort descending by net revenue
    comparisons.sort(key=lambda x: x["net_realization"]["net_revenue"], reverse=True)
    return {
        "crop_name": crop_name,
        "quantity_quintals": quantity_quintals,
        "markets": comparisons
    }
