import { 
  FpoData, 
  HealthScoreBreakdown, 
  CausalImpactBreakdown, 
  IncomePredictionResult, 
  WhatIfParams, 
  WhatIfResult,
  RiskIndicator,
  AiRecommendation 
} from '../types';
import { sampleRiskIndicators, sampleAiRecommendations } from '../data/mockData';

/**
 * Calculates FPO Health Score (0 - 100) based on 6 core pillars:
 * 1. Revenue Growth Rate
 * 2. Net Profit Margin %
 * 3. Production Stability
 * 4. Market Linkage & Buyer Direct Reach
 * 5. Smallholder Membership & Inclusion
 * 6. CHC & Asset Utilization
 */
export function calculateFpoHealthScore(fpo: FpoData): HealthScoreBreakdown {
  const revGrowthPillar = Math.min(100, Math.max(20, Math.round(fpo.incomeGrowthPct * 1.8)));
  const profitMarginPillar = Math.min(100, Math.max(15, Math.round((fpo.netIncomeLakhs / fpo.revenueAfterIntervention) * 220)));
  const yieldPillar = Math.min(100, Math.max(30, Math.round((fpo.annualProductionTonnes / fpo.membersCount) * 22)));
  const marketPillar = fpo.interventions.some(i => i.type === 'marketLinkage') ? 85 : 55;
  const memberPillar = Math.min(100, Math.round((fpo.smallFarmersCount / fpo.membersCount) * 100));
  const chcPillar = fpo.interventions.some(i => i.type === 'chcServices' || i.type === 'storage') ? 88 : 60;

  const overallScore = Math.round(
    revGrowthPillar * 0.25 +
    profitMarginPillar * 0.20 +
    yieldPillar * 0.15 +
    marketPillar * 0.15 +
    memberPillar * 0.15 +
    chcPillar * 0.10
  );

  let status: 'Excellent' | 'Good' | 'Moderate' | 'Needs Attention' = 'Good';
  if (overallScore >= 80) status = 'Excellent';
  else if (overallScore >= 65) status = 'Good';
  else if (overallScore >= 50) status = 'Moderate';
  else status = 'Needs Attention';

  return {
    overallScore,
    status,
    pillars: {
      revenueGrowth: revGrowthPillar,
      profitability: profitMarginPillar,
      yieldStability: yieldPillar,
      marketLinkage: marketPillar,
      membershipEngagement: memberPillar,
      chcUtilization: chcPillar,
    }
  };
}

/**
 * Calculates Causal Impact Breakdown attributable to WDC 2.0 interventions
 */
export function calculateCausalImpact(fpo: FpoData): CausalImpactBreakdown {
  const totalUpliftLakhs = Math.max(0, fpo.revenueAfterIntervention - fpo.revenueBeforeIntervention);
  
  const hasIrrigation = fpo.interventions.some(i => i.type === 'irrigation');
  const hasMarket = fpo.interventions.some(i => i.type === 'marketLinkage');
  const hasStorage = fpo.interventions.some(i => i.type === 'storage');
  const hasChc = fpo.interventions.some(i => i.type === 'chcServices');

  let irrigationPct = hasIrrigation ? 42 : 18;
  let marketLinkagePct = hasMarket ? 28 : 15;
  let productionImprovementPct = 18;
  let chcServicesPct = (hasChc || hasStorage) ? 14 : 8;
  let otherFactorsPct = 100 - (irrigationPct + marketLinkagePct + productionImprovementPct + chcServicesPct);

  if (otherFactorsPct < 0) {
    const scale = 100 / (irrigationPct + marketLinkagePct + productionImprovementPct + chcServicesPct);
    irrigationPct = Math.round(irrigationPct * scale);
    marketLinkagePct = Math.round(marketLinkagePct * scale);
    productionImprovementPct = Math.round(productionImprovementPct * scale);
    chcServicesPct = Math.round(chcServicesPct * scale);
    otherFactorsPct = 0;
  }

  return {
    irrigationPct,
    marketLinkagePct,
    productionImprovementPct,
    chcServicesPct,
    otherFactorsPct,
    totalUpliftLakhs: Number(totalUpliftLakhs.toFixed(2))
  };
}

/**
 * Deterministic ML Income Prediction engine (designed for seamless replacement with FastAPI/Python backend)
 */
export function predictFpoIncome(fpo: FpoData, projectionYears: number = 3): IncomePredictionResult {
  const currentIncomeLakhs = fpo.revenueAfterIntervention;
  const annualGrowthRate = Math.max(0.06, (fpo.incomeGrowthPct / 100) * 0.45);
  
  const predictedIncomeLakhs = Number((currentIncomeLakhs * Math.pow(1 + annualGrowthRate, projectionYears)).toFixed(2));
  const expectedGrowthPct = Number((((predictedIncomeLakhs - currentIncomeLakhs) / currentIncomeLakhs) * 100).toFixed(1));
  
  const confidencePct = Math.min(96, Math.max(82, 90 + Math.round((fpo.membersCount / 100) - 3)));
  const marginOfError = predictedIncomeLakhs * 0.08;
  
  const lowerBoundLakhs = Number((predictedIncomeLakhs - marginOfError).toFixed(2));
  const upperBoundLakhs = Number((predictedIncomeLakhs + marginOfError).toFixed(2));

  const trend: { year: string; actual?: number; predicted: number }[] = fpo.historicalIncome.map(h => ({
    year: h.year,
    actual: h.revenue,
    predicted: h.revenue
  }));

  let lastRev = currentIncomeLakhs;
  for (let i = 1; i <= projectionYears; i++) {
    const yr = String(2025 + i);
    lastRev = Number((lastRev * (1 + annualGrowthRate)).toFixed(2));
    trend.push({
      year: yr,
      predicted: lastRev
    });
  }

  return {
    currentIncomeLakhs,
    predictedIncomeLakhs,
    expectedGrowthPct,
    confidencePct,
    lowerBoundLakhs,
    upperBoundLakhs,
    trend
  };
}

/**
 * Runs interactive What-If Scenario simulation on FPO parameters
 */
export function simulateWhatIfScenario(fpo: FpoData, params: WhatIfParams): WhatIfResult {
  const baselineRevenueLakhs = fpo.revenueAfterIntervention;
  
  // Calculate boost contributions
  const irrigationBoost = baselineRevenueLakhs * (params.irrigationBoostPct / 100) * 0.60;
  const marketBoost = baselineRevenueLakhs * (params.marketLinkageBoostPct / 100) * 0.50;
  const storageBoost = baselineRevenueLakhs * (params.storageCapacityTons / 1000) * 0.25;
  const chcBoost = baselineRevenueLakhs * (params.chcMachineryCount * 0.02);
  const trainingBoost = baselineRevenueLakhs * (params.trainingSessionsCount * 0.01);

  const additionalIncomeLakhs = Number((irrigationBoost + marketBoost + storageBoost + chcBoost + trainingBoost).toFixed(2));
  const simulatedRevenueLakhs = Number((baselineRevenueLakhs + additionalIncomeLakhs).toFixed(2));
  const simulatedGrowthPct = Number((((simulatedRevenueLakhs - fpo.revenueBeforeIntervention) / fpo.revenueBeforeIntervention) * 100).toFixed(1));
  
  const simulatedHealthScore = Math.min(99, Math.round(fpo.healthScore + (additionalIncomeLakhs / baselineRevenueLakhs) * 20));

  return {
    baselineRevenueLakhs,
    simulatedRevenueLakhs,
    additionalIncomeLakhs,
    simulatedGrowthPct,
    simulatedHealthScore
  };
}

/**
 * Retrieves Risk & Anomaly indicators for the dataset
 */
export function getFpoRiskIndicators(fpoId?: string): RiskIndicator[] {
  if (fpoId) {
    return sampleRiskIndicators.filter(r => r.fpoId === fpoId);
  }
  return sampleRiskIndicators;
}

/**
 * Retrieves AI Recommendations for FPOs
 */
export function getFpoRecommendations(fpoId?: string): AiRecommendation[] {
  if (fpoId) {
    return sampleAiRecommendations.filter(r => r.fpoId === fpoId);
  }
  return sampleAiRecommendations;
}
