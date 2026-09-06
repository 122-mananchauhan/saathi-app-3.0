import datetime
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal, engine, Base
from backend.app import models, auth

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    
    # Check if already seeded
    if db.query(models.User).first():
        print("Database already contains data.")
        db.close()
        return

    print("Seeding database with Kisan Market demo data...")

    # 1. Users & Roles
    hashed_pwd = auth.get_password_hash("password123")
    
    farmer_user = models.User(
        name="Ramesh Singh",
        email="farmer@kisanmarket.in",
        hashed_password=hashed_pwd,
        role="farmer",
        phone="+91 98765 43210",
        state="Punjab",
        district="Ludhiana",
        is_verified=True,
        verification_badge="VERIFIED",
        reliability_score=4.9
    )
    
    fpo_user = models.User(
        name="Ludhiana Progressive Kisan FPO",
        email="fpo@kisanmarket.in",
        hashed_password=hashed_pwd,
        role="fpo",
        phone="+91 98123 45678",
        state="Punjab",
        district="Ludhiana",
        is_verified=True,
        verification_badge="TRUSTED",
        reliability_score=4.8
    )

    buyer_user1 = models.User(
        name="AgroCorp Foods Pvt Ltd",
        email="buyer@kisanmarket.in",
        hashed_password=hashed_pwd,
        role="buyer",
        phone="+91 99887 76655",
        state="Haryana",
        district="Karnal",
        is_verified=True,
        verification_badge="TRUSTED",
        reliability_score=4.9
    )
    
    buyer_user2 = models.User(
        name="SunGrains Processing Industries",
        email="sungrains@kisanmarket.in",
        hashed_password=hashed_pwd,
        role="buyer",
        phone="+91 98711 22334",
        state="Delhi",
        district="New Delhi",
        is_verified=True,
        verification_badge="VERIFIED",
        reliability_score=4.6
    )

    admin_user = models.User(
        name="Agri Ministry Administrator",
        email="admin@kisanmarket.in",
        hashed_password=hashed_pwd,
        role="admin",
        phone="+91 11 2338 1234",
        state="Delhi",
        district="New Delhi",
        is_verified=True,
        verification_badge="TRUSTED",
        reliability_score=5.0
    )

    db.add_all([farmer_user, fpo_user, buyer_user1, buyer_user2, admin_user])
    db.commit()

    # 2. Crop Lots (Individual Farmer & Bulk FPO)
    lot1 = models.CropLot(
        seller_id=farmer_user.id,
        crop_name="Wheat",
        quantity_quintals=120.0, # 12 Tons
        grade="Grade A",
        moisture_pct=11.2,
        grain_size="Large Premium Sharbati",
        variety="HD-2967 Sharbati",
        minimum_price=2450.0,
        location="Samrala Village, Khanna",
        district="Ludhiana",
        state="Punjab",
        storage_available=True,
        storage_cost_per_quintal_month=45.0,
        status="Active",
        is_bulk=False,
        fpo_name=None,
        aggregated_farmer_count=1
    )

    lot2 = models.CropLot(
        seller_id=fpo_user.id,
        crop_name="Wheat",
        quantity_quintals=1850.0, # 185 Tons Bulk
        grade="Grade A",
        moisture_pct=11.0,
        grain_size="Standard Grade A",
        variety="PBW-725",
        minimum_price=2520.0,
        location="FPO Aggregation Center, Khanna Mandi",
        district="Ludhiana",
        state="Punjab",
        storage_available=True,
        storage_cost_per_quintal_month=40.0,
        status="Active",
        is_bulk=True,
        fpo_name="Ludhiana Progressive Kisan FPO",
        aggregated_farmer_count=28
    )

    lot3 = models.CropLot(
        seller_id=farmer_user.id,
        crop_name="Paddy (Rice)",
        quantity_quintals=250.0,
        grade="Grade A",
        moisture_pct=13.1,
        grain_size="Long Grain Basmati 1121",
        variety="Pusa Basmati 1121",
        minimum_price=3850.0,
        location="Jagraon Farms",
        district="Ludhiana",
        state="Punjab",
        storage_available=False,
        status="Active",
        is_bulk=False
    )

    lot4 = models.CropLot(
        seller_id=farmer_user.id,
        crop_name="Soybean",
        quantity_quintals=95.0,
        grade="Grade B",
        moisture_pct=10.8,
        grain_size="Medium",
        variety="JS-335",
        minimum_price=4650.0,
        location="Malwa Agri Hub",
        district="Bathinda",
        state="Punjab",
        storage_available=True,
        status="Active"
    )

    db.add_all([lot1, lot2, lot3, lot4])
    db.commit()

    # 3. Buyer Requirements
    req1 = models.BuyerRequirement(
        buyer_id=buyer_user1.id,
        crop_name="Wheat",
        quantity_quintals=1000.0,
        grade="Grade A",
        max_moisture_pct=12.0,
        target_price=2580.0,
        preferred_location="Karnal Processing Facility",
        max_distance_km=150.0,
        delivery_deadline="2026-09-20",
        status="Open"
    )

    req2 = models.BuyerRequirement(
        buyer_id=buyer_user2.id,
        crop_name="Paddy (Rice)",
        quantity_quintals=500.0,
        grade="Grade A",
        max_moisture_pct=13.5,
        target_price=3950.0,
        preferred_location="Kundli Industrial Area, Delhi NCR",
        max_distance_km=250.0,
        delivery_deadline="2026-09-25",
        status="Open"
    )

    db.add_all([req1, req2])
    db.commit()

    # 4. Market Prices (Nearby Mandis & Processing Hubs)
    mandi_data = [
        # Wheat
        {"commodity": "Wheat", "mandi_name": "Khanna Mandi", "district": "Ludhiana", "state": "Punjab", "modal_price": 2450.0, "min_price": 2400.0, "max_price": 2480.0, "arrivals_tons": 450.0, "demand_level": "High", "distance_km": 18.0},
        {"commodity": "Wheat", "mandi_name": "Jagraon Market", "district": "Ludhiana", "state": "Punjab", "modal_price": 2480.0, "min_price": 2420.0, "max_price": 2510.0, "arrivals_tons": 320.0, "demand_level": "High", "distance_km": 35.0},
        {"commodity": "Wheat", "mandi_name": "Karnal Agri Hub", "district": "Karnal", "state": "Haryana", "modal_price": 2600.0, "min_price": 2540.0, "max_price": 2650.0, "arrivals_tons": 680.0, "demand_level": "Very High", "distance_km": 115.0},
        {"commodity": "Wheat", "mandi_name": "Sirsa Mandi", "district": "Sirsa", "state": "Haryana", "modal_price": 2520.0, "min_price": 2460.0, "max_price": 2560.0, "arrivals_tons": 210.0, "demand_level": "Medium", "distance_km": 140.0},
        
        # Paddy
        {"commodity": "Paddy (Rice)", "mandi_name": "Khanna Mandi", "district": "Ludhiana", "state": "Punjab", "modal_price": 3820.0, "min_price": 3700.0, "max_price": 3900.0, "arrivals_tons": 540.0, "demand_level": "High", "distance_km": 18.0},
        {"commodity": "Paddy (Rice)", "mandi_name": "Tarn Taran Mandi", "district": "Tarn Taran", "state": "Punjab", "modal_price": 3940.0, "min_price": 3850.0, "max_price": 4020.0, "arrivals_tons": 890.0, "demand_level": "Very High", "distance_km": 95.0},
        
        # Cotton
        {"commodity": "Cotton", "mandi_name": "Abohar Mandi", "district": "Fazilka", "state": "Punjab", "modal_price": 6850.0, "min_price": 6600.0, "max_price": 7100.0, "arrivals_tons": 180.0, "demand_level": "High", "distance_km": 160.0},
        
        # Soybean
        {"commodity": "Soybean", "mandi_name": "Indore Mandi", "district": "Indore", "state": "Madhya Pradesh", "modal_price": 4720.0, "min_price": 4550.0, "max_price": 4850.0, "arrivals_tons": 1250.0, "demand_level": "Very High", "distance_km": 540.0},
        {"commodity": "Soybean", "mandi_name": "Bathinda Market", "district": "Bathinda", "state": "Punjab", "modal_price": 4650.0, "min_price": 4500.0, "max_price": 4750.0, "arrivals_tons": 140.0, "demand_level": "Medium", "distance_km": 85.0},

        # Maize
        {"commodity": "Maize", "mandi_name": "Hoshiarpur Mandi", "district": "Hoshiarpur", "state": "Punjab", "modal_price": 2180.0, "min_price": 2100.0, "max_price": 2240.0, "arrivals_tons": 380.0, "demand_level": "High", "distance_km": 72.0},

        # Vegetables
        {"commodity": "Tomato", "mandi_name": "Azadpur Mandi", "district": "Delhi", "state": "Delhi", "modal_price": 2850.0, "min_price": 2600.0, "max_price": 3200.0, "arrivals_tons": 1400.0, "demand_level": "Very High", "distance_km": 290.0},
        {"commodity": "Potato", "mandi_name": "Jalandhar Mandi", "district": "Jalandhar", "state": "Punjab", "modal_price": 1450.0, "min_price": 1350.0, "max_price": 1580.0, "arrivals_tons": 920.0, "demand_level": "High", "distance_km": 60.0},
        {"commodity": "Onion", "mandi_name": "Lasalgaon Mandi", "district": "Nashik", "state": "Maharashtra", "modal_price": 2650.0, "min_price": 2400.0, "max_price": 2900.0, "arrivals_tons": 3500.0, "demand_level": "Very High", "distance_km": 1200.0},
    ]

    today_str = datetime.date.today().isoformat()
    for m in mandi_data:
        m_obj = models.MarketPrice(
            commodity=m["commodity"],
            mandi_name=m["mandi_name"],
            district=m["district"],
            state=m["state"],
            modal_price=m["modal_price"],
            min_price=m["min_price"],
            max_price=m["max_price"],
            arrivals_tons=m["arrivals_tons"],
            demand_level=m["demand_level"],
            distance_km=m["distance_km"],
            date=today_str
        )
        db.add(m_obj)
    db.commit()

    # 5. Offers & Orders
    offer1 = models.Offer(
        lot_id=lot1.id,
        buyer_id=buyer_user1.id,
        seller_id=farmer_user.id,
        offered_price=2550.0, # ₹2,550/quintal
        offered_quantity=120.0,
        payment_terms="Instant Direct Bank Transfer upon Quality Check",
        pickup_date="2026-09-10",
        status="Accepted",
        notes="Premium Grade A wheat offer confirmed."
    )
    db.add(offer1)
    db.commit()

    order1 = models.Order(
        offer_id=offer1.id,
        lot_id=lot1.id,
        buyer_name="AgroCorp Foods Pvt Ltd",
        seller_name="Ramesh Singh",
        crop_name="Wheat",
        quantity_quintals=120.0,
        price_per_quintal=2550.0,
        gross_value=306000.0, # 120 * 2550
        transport_cost=4200.0,
        net_realization=301800.0,
        status="Picked Up",
        pickup_date="2026-09-10",
        delivery_date="2026-09-12"
    )
    db.add(order1)
    db.commit()

    payment1 = models.Payment(
        order_id=order1.id,
        transaction_value=306000.0,
        amount_paid=306000.0,
        remaining_amount=0.0,
        payment_method="Escrow / Direct NEFT",
        status="Paid",
        transaction_id="KM-TXN-20260910-8841",
        payment_date="2026-09-10"
    )

    logistics1 = models.LogisticsItem(
        order_id=order1.id,
        pickup_location="Samrala Village, Ludhiana",
        destination="Karnal AgroCorp Silos",
        distance_km=115.0,
        estimated_cost=4200.0,
        vehicle_type="10-Ton Multi-Axle Container",
        vehicle_status="En Route",
        pickup_date="2026-09-10",
        delivery_date="2026-09-12"
    )

    db.add_all([payment1, logistics1])
    db.commit()

    # 6. FPO Members
    fpo_m1 = models.FPOMember(fpo_id=fpo_user.id, farmer_name="Harpreet Singh", village="Samrala", crop_name="Wheat", quantity_quintals=65.0, harvest_date="2026-09-01", is_aggregated=True)
    fpo_m2 = models.FPOMember(fpo_id=fpo_user.id, farmer_name="Gurdeep Kaur", village="Khanna", crop_name="Wheat", quantity_quintals=80.0, harvest_date="2026-09-02", is_aggregated=True)
    fpo_m3 = models.FPOMember(fpo_id=fpo_user.id, farmer_name="Baljit Singh", village="Doraha", crop_name="Wheat", quantity_quintals=110.0, harvest_date="2026-09-03", is_aggregated=True)
    fpo_m4 = models.FPOMember(fpo_id=fpo_user.id, farmer_name="Sukhwinder Singh", village="Sahnewal", crop_name="Paddy", quantity_quintals=90.0, harvest_date="2026-09-15", is_aggregated=False)
    
    db.add_all([fpo_m1, fpo_m2, fpo_m3, fpo_m4])
    db.commit()

    print("Kisan Market database seeding complete!")
    db.close()

if __name__ == "__main__":
    seed_database()
