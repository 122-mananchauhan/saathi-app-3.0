from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import datetime
from backend.app.database import get_db
from backend.app import models, schemas, auth

router = APIRouter(prefix="/api/offers", tags=["Offers & Orders"])

@router.get("", response_model=List[schemas.OfferResponse])
def get_user_offers(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else 1
    return db.query(models.Offer).filter(
        (models.Offer.buyer_id == user_id) | (models.Offer.seller_id == user_id)
    ).all()

@router.post("", response_model=schemas.OfferResponse)
def create_offer(
    offer_in: schemas.OfferCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    buyer_id = current_user.id if (current_user and current_user.role == "buyer") else 3
    lot = db.query(models.CropLot).filter(models.CropLot.id == offer_in.lot_id).first()
    seller_id = lot.seller_id if lot else 1
    
    offer = models.Offer(
        lot_id=offer_in.lot_id,
        buyer_id=buyer_id,
        seller_id=seller_id,
        offered_price=offer_in.offered_price,
        offered_quantity=offer_in.offered_quantity,
        payment_terms=offer_in.payment_terms,
        pickup_date=offer_in.pickup_date,
        notes=offer_in.notes,
        status="Pending"
    )
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer

@router.post("/{offer_id}/respond")
def respond_to_offer(
    offer_id: int,
    action: str, # accept, reject, counter
    counter_price: float = None,
    db: Session = Depends(get_db)
):
    offer = db.query(models.Offer).filter(models.Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    if action == "accept":
        offer.status = "Accepted"
        lot = db.query(models.CropLot).filter(models.CropLot.id == offer.lot_id).first()
        if lot:
            lot.status = "Sold"
            
        buyer = db.query(models.User).filter(models.User.id == offer.buyer_id).first()
        seller = db.query(models.User).filter(models.User.id == offer.seller_id).first()
        
        gross = offer.offered_price * offer.offered_quantity
        transport = 3500.0
        net = gross - transport
        
        # Create Order
        order = models.Order(
            offer_id=offer.id,
            lot_id=offer.lot_id,
            buyer_name=buyer.name if buyer else "Agro Buyer",
            seller_name=seller.name if seller else "Farmer Seller",
            crop_name=lot.crop_name if lot else "Wheat",
            quantity_quintals=offer.offered_quantity,
            price_per_quintal=offer.offered_price,
            gross_value=gross,
            transport_cost=transport,
            net_realization=net,
            status="Confirmed",
            pickup_date=offer.pickup_date,
            delivery_date="2026-09-15"
        )
        db.add(order)
        db.commit()
        db.refresh(order)
        
        # Create Payment
        payment = models.Payment(
            order_id=order.id,
            transaction_value=gross,
            amount_paid=gross,
            remaining_amount=0.0,
            payment_method="Escrow NEFT",
            status="Paid",
            transaction_id=f"KM-TXN-{datetime.date.today().strftime('%Y%m%d')}-{order.id}",
            payment_date=datetime.date.today().isoformat()
        )
        db.add(payment)
        
        # Create Logistics
        logistics = models.LogisticsItem(
            order_id=order.id,
            pickup_location=lot.location if lot else "Seller Mandi",
            destination="Buyer Warehouse",
            distance_km=85.0,
            estimated_cost=transport,
            vehicle_type="10-Ton Container Truck",
            vehicle_status="Scheduled",
            pickup_date=offer.pickup_date,
            delivery_date="2026-09-15"
        )
        db.add(logistics)
        db.commit()
        
    elif action == "reject":
        offer.status = "Rejected"
        db.commit()
    elif action == "counter":
        offer.status = "Countered"
        offer.counter_price = counter_price
        db.commit()

    return {"status": offer.status, "offer_id": offer.id}

@router.get("/orders")
def get_user_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).all()
