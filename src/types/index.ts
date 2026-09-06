export type Role = 'farmer' | 'fpo' | 'buyer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  state?: string;
  district?: string;
  is_verified: boolean;
  verification_badge: 'VERIFIED' | 'TRUSTED' | 'NEW BUYER';
  reliability_score: number;
}

export interface CropLot {
  id: number;
  seller_id: number;
  seller_name?: string;
  crop_name: string;
  quantity_quintals: number;
  grade: string; // Grade A, Grade B, Grade C
  moisture_pct: number;
  grain_size: string;
  variety: string;
  minimum_price: number; // per quintal
  location: string;
  district: string;
  state: string;
  storage_available: boolean;
  storage_cost_per_quintal_month: number;
  image_url?: string;
  status: 'Active' | 'Negotiating' | 'Sold' | 'Cancelled';
  is_bulk: boolean;
  fpo_name?: string;
  aggregated_farmer_count: number;
  created_at: string;
}

export interface BuyerRequirement {
  id: number;
  buyer_id: number;
  buyer_name?: string;
  crop_name: string;
  quantity_quintals: number;
  grade: string;
  max_moisture_pct: number;
  target_price: number;
  preferred_location: string;
  max_distance_km: number;
  delivery_deadline: string;
  status: 'Open' | 'Fulfilled' | 'Closed';
  created_at: string;
}

export interface MarketPrice {
  id: number;
  commodity: string;
  mandi_name: string;
  district: string;
  state: string;
  modal_price: number;
  min_price: number;
  max_price: number;
  arrivals_tons: number;
  demand_level: 'Very High' | 'High' | 'Medium' | 'Low';
  distance_km: number;
  date: string;
}

export interface NetRealization {
  gross_revenue: number;
  transport_cost: number;
  storage_cost: number;
  transaction_fee: number;
  total_costs: number;
  net_revenue: number;
  effective_net_price_per_quintal: number;
  profitability_percentage: number;
}

export interface MarketComparison {
  mandi_name: string;
  district: string;
  state: string;
  modal_price: number;
  distance_km: number;
  demand_level: string;
  arrivals_tons: number;
  net_realization: NetRealization;
}

export interface ForecastFactor {
  type: 'positive' | 'negative';
  driver: string;
}

export interface EventAlert {
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  headline: string;
  impact_summary: string;
  status: string;
  detected_time: string;
  region_affected: string;
}

export interface UpgradedPrediction {
  crop_name: string;
  region: string;
  current_price: number;
  horizon_days: number;
  expected_price_range: {
    min: number;
    max: number;
    modal: number;
    change_pct: number;
  };
  confidence: {
    score: number;
    level: 'High' | 'Medium' | 'Low';
    uncertainty_reason: string;
  };
  data_quality_pct: number;
  last_updated_timestamp: string;
  factors: ForecastFactor[];
  event_alert?: EventAlert | null;
  chart_data: { period: string; price: number; min?: number; max?: number }[];
  technical_details: {
    model_type: string;
    mae: number;
    rmse: number;
    mape: number;
    features_used: string[];
  };
}

export interface ModelValidationStats {
  primary_model: string;
  validation_method: string;
  metrics: {
    mae: string;
    rmse: string;
    mape: string;
    r2_score: string;
  };
  baseline_comparison: {
    naive_moving_avg_mae: string;
    model_improvement_pct: string;
  };
  last_trained: string;
}

export interface PricePrediction {
  crop_name: string;
  current_price: number;
  predictions: {
    day_7: { price: number; min: number; max: number; change_pct: number };
    day_15: { price: number; min: number; max: number; change_pct: number };
    day_30: { price: number; min: number; max: number; change_pct: number };
  };
  confidence_score: number;
  trend_direction: 'UPWARD' | 'DOWNWARD' | 'STABLE';
}

export interface SaleWindowAdvice {
  crop_name: string;
  recommendation: 'SELL NOW' | 'WAIT 7–10 DAYS' | 'SELL PARTIALLY / STORE NEARBY' | 'SELL PARTIALLY / HEDGE RISK' | 'MOVE TO DISTANT PROCESSOR MARKET' | 'CONSIDER DISTANT PROCESSOR MARKET';
  window: string;
  reason: string;
  current_price: number;
  projected_15d_price?: number;
  projected_15d_range?: string;
  estimated_net_gain_rs: number;
  storage_advisable?: boolean;
  event_active?: boolean;
  confidence_level?: string;
}

export interface BuyerMatch {
  requirement_id: number;
  buyer_id: number;
  buyer_name: string;
  buyer_badge: 'VERIFIED' | 'TRUSTED' | 'NEW BUYER';
  buyer_reliability: number;
  crop_name: string;
  requested_qty: number;
  target_price: number;
  preferred_location: string;
  delivery_deadline: string;
  match: {
    match_score: number;
    quality_match: 'EXCELLENT MATCH' | 'GOOD MATCH' | 'PARTIAL MATCH' | 'MISMATCH';
    match_label: string;
    offered_price: number;
    distance_km: number;
    buyer_reliability: number;
    reasons: string[];
  };
}

export interface Offer {
  id: number;
  lot_id: number;
  buyer_id: number;
  buyer_name?: string;
  seller_id: number;
  seller_name?: string;
  crop_name?: string;
  offered_price: number;
  offered_quantity: number;
  payment_terms: string;
  pickup_date: string;
  status: 'Pending' | 'Countered' | 'Accepted' | 'Rejected';
  counter_price?: number;
  notes?: string;
  created_at: string;
}

export interface Order {
  id: number;
  offer_id: number;
  lot_id: number;
  buyer_name: string;
  seller_name: string;
  crop_name: string;
  quantity_quintals: number;
  price_per_quintal: number;
  gross_value: number;
  transport_cost: number;
  net_realization: number;
  status: 'Confirmed' | 'Picked Up' | 'In Transit' | 'Delivered' | 'Completed';
  pickup_date: string;
  delivery_date: string;
  created_at: string;
}

export interface Payment {
  id: number;
  order_id: number;
  transaction_value: number;
  amount_paid: number;
  remaining_amount: number;
  payment_method: string;
  status: 'Pending' | 'Processing' | 'Paid' | 'Disputed';
  transaction_id: string;
  payment_date: string;
}

export interface LogisticsItem {
  id: number;
  order_id: number;
  pickup_location: string;
  destination: string;
  distance_km: number;
  estimated_cost: number;
  vehicle_type: string;
  vehicle_status: 'Scheduled' | 'En Route' | 'Delivered';
  pickup_date: string;
  delivery_date: string;
}

export interface Dispute {
  id: number;
  order_id: number;
  raised_by_name: string;
  category: 'Quality' | 'Quantity' | 'Payment' | 'Delivery' | 'Logistics';
  title: string;
  description: string;
  evidence_url?: string;
  status: 'Open' | 'Under Review' | 'Resolved' | 'Rejected';
  resolution_notes?: string;
  created_at: string;
}

export interface FPOMember {
  id: number;
  fpo_id: number;
  farmer_name: string;
  village: string;
  crop_name: string;
  quantity_quintals: number;
  harvest_date: string;
  is_aggregated: boolean;
}
