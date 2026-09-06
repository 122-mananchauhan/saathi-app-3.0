import { User, CropLot, BuyerRequirement, MarketPrice, Offer, Order, Payment, LogisticsItem, Dispute, FPOMember } from '../types';

export const initialUsers: User[] = [
  {
    id: 1,
    name: 'Ramesh Singh',
    email: 'farmer@kisanmarket.in',
    role: 'farmer',
    phone: '+91 98765 43210',
    state: 'Punjab',
    district: 'Ludhiana',
    is_verified: true,
    verification_badge: 'VERIFIED',
    reliability_score: 4.9
  },
  {
    id: 2,
    name: 'Ludhiana Progressive Kisan FPO',
    email: 'fpo@kisanmarket.in',
    role: 'fpo',
    phone: '+91 98123 45678',
    state: 'Punjab',
    district: 'Ludhiana',
    is_verified: true,
    verification_badge: 'TRUSTED',
    reliability_score: 4.8
  },
  {
    id: 3,
    name: 'AgroCorp Foods Pvt Ltd',
    email: 'buyer@kisanmarket.in',
    role: 'buyer',
    phone: '+91 99887 76655',
    state: 'Haryana',
    district: 'Karnal',
    is_verified: true,
    verification_badge: 'TRUSTED',
    reliability_score: 4.9
  },
  {
    id: 4,
    name: 'Agri Ministry Administrator',
    email: 'admin@kisanmarket.in',
    role: 'admin',
    phone: '+91 11 2338 1234',
    state: 'Delhi',
    district: 'New Delhi',
    is_verified: true,
    verification_badge: 'TRUSTED',
    reliability_score: 5.0
  }
];

export const initialCropLots: CropLot[] = [
  {
    id: 1,
    seller_id: 1,
    seller_name: 'Ramesh Singh',
    crop_name: 'Wheat',
    quantity_quintals: 120,
    grade: 'Grade A',
    moisture_pct: 11.2,
    grain_size: 'Large Sharbati',
    variety: 'HD-2967 Sharbati',
    minimum_price: 2450,
    location: 'Samrala Village, Khanna',
    district: 'Ludhiana',
    state: 'Punjab',
    storage_available: true,
    storage_cost_per_quintal_month: 45,
    status: 'Active',
    is_bulk: false,
    aggregated_farmer_count: 1,
    created_at: '2026-09-01'
  },
  {
    id: 2,
    seller_id: 2,
    seller_name: 'Ludhiana Progressive Kisan FPO',
    crop_name: 'Wheat',
    quantity_quintals: 1850,
    grade: 'Grade A',
    moisture_pct: 11.0,
    grain_size: 'Standard Grade A',
    variety: 'PBW-725',
    minimum_price: 2520,
    location: 'Khanna Mandi Aggregation Hub',
    district: 'Ludhiana',
    state: 'Punjab',
    storage_available: true,
    storage_cost_per_quintal_month: 40,
    status: 'Active',
    is_bulk: true,
    fpo_name: 'Ludhiana Progressive Kisan FPO',
    aggregated_farmer_count: 28,
    created_at: '2026-09-02'
  },
  {
    id: 3,
    seller_id: 1,
    seller_name: 'Ramesh Singh',
    crop_name: 'Paddy (Rice)',
    quantity_quintals: 250,
    grade: 'Grade A',
    moisture_pct: 13.1,
    grain_size: 'Long Grain Basmati 1121',
    variety: 'Pusa Basmati 1121',
    minimum_price: 3850,
    location: 'Jagraon Farms',
    district: 'Ludhiana',
    state: 'Punjab',
    storage_available: false,
    storage_cost_per_quintal_month: 50,
    status: 'Active',
    is_bulk: false,
    aggregated_farmer_count: 1,
    created_at: '2026-09-02'
  },
  {
    id: 4,
    seller_id: 1,
    seller_name: 'Ramesh Singh',
    crop_name: 'Soybean',
    quantity_quintals: 95,
    grade: 'Grade B',
    moisture_pct: 10.8,
    grain_size: 'Medium',
    variety: 'JS-335',
    minimum_price: 4650,
    location: 'Malwa Agri Hub',
    district: 'Bathinda',
    state: 'Punjab',
    storage_available: true,
    storage_cost_per_quintal_month: 45,
    status: 'Active',
    is_bulk: false,
    aggregated_farmer_count: 1,
    created_at: '2026-08-28'
  }
];

export const initialBuyerRequirements: BuyerRequirement[] = [
  {
    id: 1,
    buyer_id: 3,
    buyer_name: 'AgroCorp Foods Pvt Ltd',
    crop_name: 'Wheat',
    quantity_quintals: 1000,
    grade: 'Grade A',
    max_moisture_pct: 12.0,
    target_price: 2580,
    preferred_location: 'Karnal Processing Facility',
    max_distance_km: 150,
    delivery_deadline: '2026-09-20',
    status: 'Open',
    created_at: '2026-09-01'
  },
  {
    id: 2,
    buyer_id: 3,
    buyer_name: 'SunGrains Processing Industries',
    crop_name: 'Paddy (Rice)',
    quantity_quintals: 500,
    grade: 'Grade A',
    max_moisture_pct: 13.5,
    target_price: 3950,
    preferred_location: 'Kundli Industrial Area, Delhi NCR',
    max_distance_km: 250,
    delivery_deadline: '2026-09-25',
    status: 'Open',
    created_at: '2026-09-02'
  }
];

export const initialMarketPrices: MarketPrice[] = [
  { id: 1, commodity: 'Wheat', mandi_name: 'Khanna Mandi', district: 'Ludhiana', state: 'Punjab', modal_price: 2450, min_price: 2400, max_price: 2480, arrivals_tons: 450, demand_level: 'High', distance_km: 18, date: '2026-09-02' },
  { id: 2, commodity: 'Wheat', mandi_name: 'Jagraon Market', district: 'Ludhiana', state: 'Punjab', modal_price: 2480, min_price: 2420, max_price: 2510, arrivals_tons: 320, demand_level: 'High', distance_km: 35, date: '2026-09-02' },
  { id: 3, commodity: 'Wheat', mandi_name: 'Karnal Agri Hub', district: 'Karnal', state: 'Haryana', modal_price: 2600, min_price: 2540, max_price: 2650, arrivals_tons: 680, demand_level: 'Very High', distance_km: 115, date: '2026-09-02' },
  { id: 4, commodity: 'Wheat', mandi_name: 'Sirsa Mandi', district: 'Sirsa', state: 'Haryana', modal_price: 2520, min_price: 2460, max_price: 2560, arrivals_tons: 210, demand_level: 'Medium', distance_km: 140, date: '2026-09-02' },
  { id: 5, commodity: 'Paddy (Rice)', mandi_name: 'Khanna Mandi', district: 'Ludhiana', state: 'Punjab', modal_price: 3820, min_price: 3700, max_price: 3900, arrivals_tons: 540, demand_level: 'High', distance_km: 18, date: '2026-09-02' },
  { id: 6, commodity: 'Paddy (Rice)', mandi_name: 'Tarn Taran Mandi', district: 'Tarn Taran', state: 'Punjab', modal_price: 3940, min_price: 3850, max_price: 4020, arrivals_tons: 890, demand_level: 'Very High', distance_km: 95, date: '2026-09-02' },
  { id: 7, commodity: 'Cotton', mandi_name: 'Abohar Mandi', district: 'Fazilka', state: 'Punjab', modal_price: 6850, min_price: 6600, max_price: 7100, arrivals_tons: 180, demand_level: 'High', distance_km: 160, date: '2026-09-02' },
  { id: 8, commodity: 'Soybean', mandi_name: 'Indore Mandi', district: 'Indore', state: 'Madhya Pradesh', modal_price: 4720, min_price: 4550, max_price: 4850, arrivals_tons: 1250, demand_level: 'Very High', distance_km: 540, date: '2026-09-02' },
  { id: 9, commodity: 'Soybean', mandi_name: 'Bathinda Market', district: 'Bathinda', state: 'Punjab', modal_price: 4650, min_price: 4500, max_price: 4750, arrivals_tons: 140, demand_level: 'Medium', distance_km: 85, date: '2026-09-02' },
  { id: 10, commodity: 'Maize', mandi_name: 'Hoshiarpur Mandi', district: 'Hoshiarpur', state: 'Punjab', modal_price: 2180, min_price: 2100, max_price: 2240, arrivals_tons: 380, demand_level: 'High', distance_km: 72, date: '2026-09-02' }
];

export const initialOffers: Offer[] = [
  {
    id: 1,
    lot_id: 1,
    buyer_id: 3,
    buyer_name: 'AgroCorp Foods Pvt Ltd',
    seller_id: 1,
    seller_name: 'Ramesh Singh',
    crop_name: 'Wheat',
    offered_price: 2550,
    offered_quantity: 120,
    payment_terms: 'Instant Direct Bank Transfer upon Quality Check',
    pickup_date: '2026-09-10',
    status: 'Accepted',
    notes: 'Premium Grade A wheat offer confirmed.',
    created_at: '2026-09-02'
  }
];

export const initialOrders: Order[] = [
  {
    id: 1,
    offer_id: 1,
    lot_id: 1,
    buyer_name: 'AgroCorp Foods Pvt Ltd',
    seller_name: 'Ramesh Singh',
    crop_name: 'Wheat',
    quantity_quintals: 120,
    price_per_quintal: 2550,
    gross_value: 306000,
    transport_cost: 4200,
    net_realization: 301800,
    status: 'Picked Up',
    pickup_date: '2026-09-10',
    delivery_date: '2026-09-12',
    created_at: '2026-09-02'
  }
];

export const initialPayments: Payment[] = [
  {
    id: 1,
    order_id: 1,
    transaction_value: 306000,
    amount_paid: 306000,
    remaining_amount: 0,
    payment_method: 'Escrow / Direct NEFT',
    status: 'Paid',
    transaction_id: 'KM-TXN-20260910-8841',
    payment_date: '2026-09-10'
  }
];

export const initialLogistics: LogisticsItem[] = [
  {
    id: 1,
    order_id: 1,
    pickup_location: 'Samrala Village, Ludhiana',
    destination: 'Karnal AgroCorp Silos',
    distance_km: 115,
    estimated_cost: 4200,
    vehicle_type: '10-Ton Multi-Axle Container',
    vehicle_status: 'En Route',
    pickup_date: '2026-09-10',
    delivery_date: '2026-09-12'
  }
];

export const initialFPOMembers: FPOMember[] = [
  { id: 1, fpo_id: 2, farmer_name: 'Harpreet Singh', village: 'Samrala', crop_name: 'Wheat', quantity_quintals: 65, harvest_date: '2026-09-01', is_aggregated: true },
  { id: 2, fpo_id: 2, farmer_name: 'Gurdeep Kaur', village: 'Khanna', crop_name: 'Wheat', quantity_quintals: 80, harvest_date: '2026-09-02', is_aggregated: true },
  { id: 3, fpo_id: 2, farmer_name: 'Baljit Singh', village: 'Doraha', crop_name: 'Wheat', quantity_quintals: 110, harvest_date: '2026-09-03', is_aggregated: true },
  { id: 4, fpo_id: 2, farmer_name: 'Sukhwinder Singh', village: 'Sahnewal', crop_name: 'Paddy', quantity_quintals: 90, harvest_date: '2026-09-15', is_aggregated: false }
];

export const initialDisputes: Dispute[] = [
  {
    id: 1,
    order_id: 1,
    raised_by_name: 'Ramesh Singh',
    category: 'Logistics',
    title: 'Minor pickup delay due to rain',
    description: 'Transporter reached pickup location 2 hours behind schedule due to rain on state highway.',
    status: 'Resolved',
    resolution_notes: 'Driver updated ETA and successfully completed pickup with moisture protection tarp.',
    created_at: '2026-09-02'
  }
];
