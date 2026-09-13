export type Page = 
  | 'landing' 
  | 'dashboard' 
  | 'fpos' 
  | 'impact' 
  | 'health-risk' 
  | 'recommendations' 
  | 'gis' 
  | 'reports' 
  | 'data-mgmt';

export type PerformanceStatus = 'High' | 'Moderate' | 'Needs Attention';

export type InterventionType = 'irrigation' | 'marketLinkage' | 'production' | 'chcServices' | 'storage';

export interface FpoIntervention {
  name: string;
  type: InterventionType;
  startDate: string;
  investmentAmount: number; // in INR
  beneficiaries: number;
  status: 'Active' | 'Completed' | 'Planned';
}

export interface HistoricalIncome {
  year: string;
  revenue: number; // in Lakhs
  netIncome: number; // in Lakhs
}

export interface FpoData {
  id: string;
  name: string;
  state: string;
  district: string;
  block: string;
  formationYear: number;
  membersCount: number;
  smallFarmersCount: number;
  womenMembersCount: number;
  primaryCrops: string[];
  annualProductionTonnes: number;
  revenueBeforeIntervention: number; // Lakhs
  revenueAfterIntervention: number; // Lakhs
  expensesLakhs: number;
  netIncomeLakhs: number;
  incomeGrowthPct: number;
  healthScore: number; // 0-100
  performanceStatus: PerformanceStatus;
  lat: number;
  lng: number;
  interventions: FpoIntervention[];
  historicalIncome: HistoricalIncome[];
}

export interface CausalImpactBreakdown {
  irrigationPct: number;
  marketLinkagePct: number;
  productionImprovementPct: number;
  chcServicesPct: number;
  otherFactorsPct: number;
  totalUpliftLakhs: number;
}

export interface IncomePredictionResult {
  currentIncomeLakhs: number;
  predictedIncomeLakhs: number;
  expectedGrowthPct: number;
  confidencePct: number;
  lowerBoundLakhs: number;
  upperBoundLakhs: number;
  trend: { year: string; actual?: number; predicted: number }[];
}

export interface WhatIfParams {
  irrigationBoostPct: number; // 0 - 50%
  marketLinkageBoostPct: number; // 0 - 50%
  storageCapacityTons: number; // 0 - 500 tons
  chcMachineryCount: number; // 0 - 10 units
  trainingSessionsCount: number; // 0 - 20 sessions
}

export interface WhatIfResult {
  baselineRevenueLakhs: number;
  simulatedRevenueLakhs: number;
  additionalIncomeLakhs: number;
  simulatedGrowthPct: number;
  simulatedHealthScore: number;
}

export interface HealthScoreBreakdown {
  overallScore: number;
  status: 'Excellent' | 'Good' | 'Moderate' | 'Needs Attention';
  pillars: {
    revenueGrowth: number; // 0-100
    profitability: number; // 0-100
    yieldStability: number; // 0-100
    marketLinkage: number; // 0-100
    membershipEngagement: number; // 0-100
    chcUtilization: number; // 0-100
  };
}

export interface RiskIndicator {
  id: string;
  fpoId: string;
  fpoName: string;
  state: string;
  riskType: 'Income Decline' | 'High Expense Ratio' | 'Low Intervention Usage' | 'Market Price Volatility' | 'Distress Sale Risk';
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  recommendedAction: string;
  impactScore: number;
}

export interface AiRecommendation {
  id: string;
  fpoId?: string;
  fpoName?: string;
  title: string;
  category: 'Market Linkage' | 'Irrigation Infrastructure' | 'Storage & Processing' | 'CHC Expansion' | 'Financial Management';
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  expectedImpactPct: number;
  actionableSteps: string[];
}

export interface DataQualityReport {
  totalRows: number;
  validRows: number;
  missingValuesCount: number;
  anomaliesDetected: number;
  dataQualityScore: number; // 0-100
  issues: string[];
}
