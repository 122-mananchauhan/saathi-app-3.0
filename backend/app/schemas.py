from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    phone: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_verified: bool
    verification_badge: str
    reliability_score: float
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class CropLotBase(BaseModel):
    crop_name: str
    quantity_quintals: float
    grade: str
    moisture_pct: float = 11.5
    grain_size: str = "Medium"
    variety: str = "Standard"
    minimum_price: float
    location: str
    district: str
    state: str
    storage_available: bool = False
    storage_cost_per_quintal_month: float = 50.0
    image_url: Optional[str] = None
    is_bulk: bool = False
    fpo_name: Optional[str] = None
    aggregated_farmer_count: int = 1

class CropLotCreate(CropLotBase):
    pass

class CropLotResponse(CropLotBase):
    id: int
    seller_id: int
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class BuyerRequirementBase(BaseModel):
    crop_name: str
    quantity_quintals: float
    grade: str = "Grade A"
    max_moisture_pct: float = 12.0
    target_price: float
    preferred_location: str
    max_distance_km: float = 150.0
    delivery_deadline: str

class BuyerRequirementCreate(BuyerRequirementBase):
    pass

class BuyerRequirementResponse(BuyerRequirementBase):
    id: int
    buyer_id: int
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class OfferBase(BaseModel):
    lot_id: int
    offered_price: float
    offered_quantity: float
    payment_terms: str = "Instant Bank Transfer on Delivery"
    pickup_date: str
    notes: Optional[str] = None

class OfferCreate(OfferBase):
    pass

class OfferResponse(OfferBase):
    id: int
    buyer_id: int
    seller_id: int
    status: str
    counter_price: Optional[float] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class DisputeBase(BaseModel):
    order_id: int
    category: str
    title: str
    description: str
    evidence_url: Optional[str] = None

class DisputeCreate(DisputeBase):
    pass

class DisputeResponse(DisputeBase):
    id: int
    raised_by_name: str
    status: str
    resolution_notes: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True
