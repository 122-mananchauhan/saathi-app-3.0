import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False) # farmer, fpo, buyer, admin
    phone = Column(String(20), nullable=True)
    state = Column(String(50), nullable=True)
    district = Column(String(50), nullable=True)
    is_verified = Column(Boolean, default=False)
    verification_badge = Column(String(20), default="NEW BUYER") # VERIFIED, TRUSTED, NEW BUYER
    reliability_score = Column(Float, default=4.5)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    lots = relationship("CropLot", back_populates="seller")
    buyer_requirements = relationship("BuyerRequirement", back_populates="buyer")
    offers_sent = relationship("Offer", foreign_keys="[Offer.buyer_id]", back_populates="buyer")
    offers_received = relationship("Offer", foreign_keys="[Offer.seller_id]", back_populates="seller")

class CropLot(Base):
    __tablename__ = "crop_lots"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_name = Column(String(50), nullable=False)
    quantity_quintals = Column(Float, nullable=False)
    grade = Column(String(20), nullable=False) # Grade A, Grade B, Grade C
    moisture_pct = Column(Float, default=11.5)
    grain_size = Column(String(30), default="Medium")
    variety = Column(String(50), default="Standard")
    minimum_price = Column(Float, nullable=False) # per quintal
    location = Column(String(100), nullable=False)
    district = Column(String(50), nullable=False)
    state = Column(String(50), nullable=False)
    storage_available = Column(Boolean, default=False)
    storage_cost_per_quintal_month = Column(Float, default=50.0)
    image_url = Column(String(255), nullable=True)
    status = Column(String(20), default="Active") # Active, Negotiating, Sold, Cancelled
    is_bulk = Column(Boolean, default=False)
    fpo_name = Column(String(100), nullable=True)
    aggregated_farmer_count = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    seller = relationship("User", back_populates="lots")
    offers = relationship("Offer", back_populates="lot")

class BuyerRequirement(Base):
    __tablename__ = "buyer_requirements"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_name = Column(String(50), nullable=False)
    quantity_quintals = Column(Float, nullable=False)
    grade = Column(String(20), default="Grade A")
    max_moisture_pct = Column(Float, default=12.0)
    target_price = Column(Float, nullable=False)
    preferred_location = Column(String(100), nullable=False)
    max_distance_km = Column(Float, default=150.0)
    delivery_deadline = Column(String(30), nullable=False)
    status = Column(String(20), default="Open")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    buyer = relationship("User", back_populates="buyer_requirements")

class MarketPrice(Base):
    __tablename__ = "market_prices"

    id = Column(Integer, primary_key=True, index=True)
    commodity = Column(String(50), nullable=False, index=True)
    mandi_name = Column(String(100), nullable=False)
    district = Column(String(50), nullable=False)
    state = Column(String(50), nullable=False)
    modal_price = Column(Float, nullable=False)
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    arrivals_tons = Column(Float, nullable=False)
    demand_level = Column(String(20), default="High") # Very High, High, Medium, Low
    distance_km = Column(Float, default=25.0)
    date = Column(String(20), nullable=False)

class ExternalEvent(Base):
    __tablename__ = "external_events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(50), nullable=False) # Heavy Rainfall, Flood, Drought, Heatwave, Pest Outbreak, Sudden Arrival Spike, Demand Spike, Transport Disruption
    crop_name = Column(String(50), nullable=False)
    region = Column(String(100), nullable=False)
    severity = Column(String(20), default="Medium") # Low, Medium, High, Critical
    impact_category = Column(String(50), default="Supply & Logistics") # Supply, Demand, Quality, Logistics
    headline = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    detected_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)

class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    lot_id = Column(Integer, ForeignKey("crop_lots.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    offered_price = Column(Float, nullable=False) # per quintal
    offered_quantity = Column(Float, nullable=False)
    payment_terms = Column(String(50), default="Instant Bank Transfer on Delivery")
    pickup_date = Column(String(30), nullable=False)
    status = Column(String(20), default="Pending") # Pending, Countered, Accepted, Rejected
    counter_price = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    lot = relationship("CropLot", back_populates="offers")
    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="offers_sent")
    seller = relationship("User", foreign_keys=[seller_id], back_populates="offers_received")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    offer_id = Column(Integer, nullable=False)
    lot_id = Column(Integer, nullable=False)
    buyer_name = Column(String(100), nullable=False)
    seller_name = Column(String(100), nullable=False)
    crop_name = Column(String(50), nullable=False)
    quantity_quintals = Column(Float, nullable=False)
    price_per_quintal = Column(Float, nullable=False)
    gross_value = Column(Float, nullable=False)
    transport_cost = Column(Float, default=0.0)
    net_realization = Column(Float, nullable=False)
    status = Column(String(30), default="Confirmed") # Confirmed, Picked Up, In Transit, Delivered, Completed
    pickup_date = Column(String(30), nullable=False)
    delivery_date = Column(String(30), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, nullable=False)
    transaction_value = Column(Float, nullable=False)
    amount_paid = Column(Float, nullable=False)
    remaining_amount = Column(Float, default=0.0)
    payment_method = Column(String(50), default="Simulated Escrow / Direct Bank")
    status = Column(String(20), default="Paid") # Pending, Processing, Paid, Disputed
    transaction_id = Column(String(50), nullable=False)
    payment_date = Column(String(30), nullable=False)

class LogisticsItem(Base):
    __tablename__ = "logistics_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, nullable=False)
    pickup_location = Column(String(100), nullable=False)
    destination = Column(String(100), nullable=False)
    distance_km = Column(Float, nullable=False)
    estimated_cost = Column(Float, nullable=False)
    vehicle_type = Column(String(50), default="10-Ton Container Truck")
    vehicle_status = Column(String(30), default="Scheduled") # Scheduled, En Route, Delivered
    pickup_date = Column(String(30), nullable=False)
    delivery_date = Column(String(30), nullable=False)

class Dispute(Base):
    __tablename__ = "disputes"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, nullable=False)
    raised_by_name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False) # Quality, Quantity, Payment, Delivery
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    evidence_url = Column(String(255), nullable=True)
    status = Column(String(20), default="Open") # Open, Under Review, Resolved, Rejected
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class FPOMember(Base):
    __tablename__ = "fpo_members"

    id = Column(Integer, primary_key=True, index=True)
    fpo_id = Column(Integer, nullable=False)
    farmer_name = Column(String(100), nullable=False)
    village = Column(String(100), nullable=False)
    crop_name = Column(String(50), nullable=False)
    quantity_quintals = Column(Float, nullable=False)
    harvest_date = Column(String(30), nullable=False)
    is_aggregated = Column(Boolean, default=False)
