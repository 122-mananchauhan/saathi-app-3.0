import { FpoData, RiskIndicator, AiRecommendation } from '../types';

export const sampleFpos: FpoData[] = [
  {
    id: "FPO-GJ-001",
    name: "Anand Green Farmer Producer Co.",
    state: "Gujarat",
    district: "Anand",
    block: "Anand Rural",
    formationYear: 2021,
    membersCount: 420,
    smallFarmersCount: 350,
    womenMembersCount: 140,
    primaryCrops: ["Cotton", "Groundnut", "Banana"],
    annualProductionTonnes: 1850,
    revenueBeforeIntervention: 85.5,
    revenueAfterIntervention: 128.4,
    expensesLakhs: 78.2,
    netIncomeLakhs: 50.2,
    incomeGrowthPct: 50.2,
    healthScore: 88,
    performanceStatus: "High",
    lat: 22.5645,
    lng: 72.9289,
    interventions: [
      { name: "Solar Drip Irrigation System", type: "irrigation", startDate: "2023-04-15", investmentAmount: 1800000, beneficiaries: 210, status: "Active" },
      { name: "Cold Storage Linkage", type: "storage", startDate: "2023-09-01", investmentAmount: 1200000, beneficiaries: 150, status: "Active" },
      { name: "Direct Cotton Export Hub", type: "marketLinkage", startDate: "2024-01-10", investmentAmount: 950000, beneficiaries: 180, status: "Active" }
    ],
    historicalIncome: [
      { year: "2021", revenue: 62.0, netIncome: 18.5 },
      { year: "2022", revenue: 71.2, netIncome: 22.1 },
      { year: "2023", revenue: 85.5, netIncome: 28.0 },
      { year: "2024", revenue: 108.0, netIncome: 39.5 },
      { year: "2025", revenue: 128.4, netIncome: 50.2 }
    ]
  },
  {
    id: "FPO-MH-002",
    name: "Baramati Agri Prosperity Producer Co.",
    state: "Maharashtra",
    district: "Pune",
    block: "Baramati",
    formationYear: 2020,
    membersCount: 580,
    smallFarmersCount: 490,
    womenMembersCount: 195,
    primaryCrops: ["Sugarcane", "Onion", "Grapes"],
    annualProductionTonnes: 3400,
    revenueBeforeIntervention: 142.0,
    revenueAfterIntervention: 198.5,
    expensesLakhs: 125.0,
    netIncomeLakhs: 73.5,
    incomeGrowthPct: 39.8,
    healthScore: 84,
    performanceStatus: "High",
    lat: 18.1517,
    lng: 74.5772,
    interventions: [
      { name: "Onion Dehydration & Storage Hub", type: "storage", startDate: "2022-11-20", investmentAmount: 2500000, beneficiaries: 320, status: "Active" },
      { name: "CHC Tractor & Harvester Pool", type: "chcServices", startDate: "2023-03-10", investmentAmount: 3200000, beneficiaries: 450, status: "Active" }
    ],
    historicalIncome: [
      { year: "2021", revenue: 110.0, netIncome: 32.0 },
      { year: "2022", revenue: 125.4, netIncome: 38.2 },
      { year: "2023", revenue: 142.0, netIncome: 46.5 },
      { year: "2024", revenue: 172.0, netIncome: 60.1 },
      { year: "2025", revenue: 198.5, netIncome: 73.5 }
    ]
  },
  {
    id: "FPO-PB-003",
    name: "Malwa Golden Wheat Producer Co.",
    state: "Punjab",
    district: "Moga",
    block: "Dharamkot",
    formationYear: 2019,
    membersCount: 650,
    smallFarmersCount: 410,
    womenMembersCount: 90,
    primaryCrops: ["Wheat", "Paddy", "Mustard"],
    annualProductionTonnes: 4800,
    revenueBeforeIntervention: 210.0,
    revenueAfterIntervention: 275.2,
    expensesLakhs: 180.0,
    netIncomeLakhs: 95.2,
    incomeGrowthPct: 31.0,
    healthScore: 81,
    performanceStatus: "High",
    lat: 30.8165,
    lng: 75.1717,
    interventions: [
      { name: "Laser Land Levelling & Micro-Irrigation", type: "irrigation", startDate: "2022-06-01", investmentAmount: 2100000, beneficiaries: 380, status: "Active" },
      { name: "Direct Rice Seeders (DSR Pool)", type: "production", startDate: "2023-05-15", investmentAmount: 1400000, beneficiaries: 290, status: "Active" }
    ],
    historicalIncome: [
      { year: "2021", revenue: 175.0, netIncome: 52.0 },
      { year: "2022", revenue: 192.0, netIncome: 58.5 },
      { year: "2023", revenue: 210.0, netIncome: 67.2 },
      { year: "2024", revenue: 245.0, netIncome: 81.0 },
      { year: "2025", revenue: 275.2, netIncome: 95.2 }
    ]
  },
  {
    id: "FPO-RJ-004",
    name: "Hadoti Organic Spice Producer Co.",
    state: "Rajasthan",
    district: "Kota",
    block: "Ladpura",
    formationYear: 2022,
    membersCount: 310,
    smallFarmersCount: 270,
    womenMembersCount: 110,
    primaryCrops: ["Soybean", "Mustard", "Coriander"],
    annualProductionTonnes: 1200,
    revenueBeforeIntervention: 64.0,
    revenueAfterIntervention: 89.6,
    expensesLakhs: 58.0,
    netIncomeLakhs: 31.6,
    incomeGrowthPct: 40.0,
    healthScore: 76,
    performanceStatus: "Moderate",
    lat: 25.2138,
    lng: 75.8648,
    interventions: [
      { name: "Organic Certification & Market Link", type: "marketLinkage", startDate: "2023-02-12", investmentAmount: 800000, beneficiaries: 190, status: "Active" },
      { name: "Check Dam Water Harvesting", type: "irrigation", startDate: "2023-08-01", investmentAmount: 1500000, beneficiaries: 240, status: "Active" }
    ],
    historicalIncome: [
      { year: "2021", revenue: 48.0, netIncome: 12.0 },
      { year: "2022", revenue: 55.0, netIncome: 15.2 },
      { year: "2023", revenue: 64.0, netIncome: 19.8 },
      { year: "2024", revenue: 76.5, netIncome: 25.0 },
      { year: "2025", revenue: 89.6, netIncome: 31.6 }
    ]
  },
  {
    id: "FPO-UP-005",
    name: "Awadh Pulse & Grain Farmers Co.",
    state: "Uttar Pradesh",
    district: "Barabanki",
    block: "Haidergarh",
    formationYear: 2021,
    membersCount: 510,
    smallFarmersCount: 460,
    womenMembersCount: 180,
    primaryCrops: ["Arhar Pulse", "Mentha", "Wheat"],
    annualProductionTonnes: 2100,
    revenueBeforeIntervention: 92.0,
    revenueAfterIntervention: 119.6,
    expensesLakhs: 86.0,
    netIncomeLakhs: 33.6,
    incomeGrowthPct: 30.0,
    healthScore: 72,
    performanceStatus: "Moderate",
    lat: 26.9254,
    lng: 81.1834,
    interventions: [
      { name: "Mentha Oil Distillation Facility", type: "production", startDate: "2023-01-20", investmentAmount: 1600000, beneficiaries: 220, status: "Active" },
      { name: "Pulse Grading & Packaging Unit", type: "storage", startDate: "2023-07-15", investmentAmount: 1100000, beneficiaries: 300, status: "Active" }
    ],
    historicalIncome: [
      { year: "2021", revenue: 72.0, netIncome: 18.0 },
      { year: "2022", revenue: 81.0, netIncome: 21.5 },
      { year: "2023", revenue: 92.0, netIncome: 26.0 },
      { year: "2024", revenue: 104.5, netIncome: 29.8 },
      { year: "2025", revenue: 119.6, netIncome: 33.6 }
    ]
  },
  {
    id: "FPO-MP-006",
    name: "Narmada Valley Soybean Producer Co.",
    state: "Madhya Pradesh",
    district: "Hoshangabad",
    block: "Babai",
    formationYear: 2020,
    membersCount: 480,
    smallFarmersCount: 390,
    womenMembersCount: 130,
    primaryCrops: ["Soybean", "Wheat", "Gram"],
    annualProductionTonnes: 2600,
    revenueBeforeIntervention: 115.0,
    revenueAfterIntervention: 149.5,
    expensesLakhs: 105.0,
    netIncomeLakhs: 44.5,
    incomeGrowthPct: 30.0,
    healthScore: 79,
    performanceStatus: "Moderate",
    lat: 22.7519,
    lng: 77.7274,
    interventions: [
      { name: "Custom Hiring Center Equipment", type: "chcServices", startDate: "2022-10-05", investmentAmount: 1900000, beneficiaries: 350, status: "Active" },
      { name: "Seed Processing & Cleaning Mill", type: "production", startDate: "2023-04-10", investmentAmount: 1450000, beneficiaries: 260, status: "Active" }
    ],
    historicalIncome: [
      { year: "2021", revenue: 88.0, netIncome: 22.0 },
      { year: "2022", revenue: 99.5, netIncome: 27.8 },
      { year: "2023", revenue: 115.0, netIncome: 34.0 },
      { year: "2024", revenue: 132.0, netIncome: 39.2 },
      { year: "2025", revenue: 149.5, netIncome: 44.5 }
    ]
  },
  {
    id: "FPO-KA-007",
    name: "Deccan Bio-Spices Producer Co.",
    state: "Karnataka",
    district: "Haveri",
    block: "Byadgi",
    formationYear: 2021,
    membersCount: 390,
    smallFarmersCount: 320,
    womenMembersCount: 160,
    primaryCrops: ["Byadgi Chilli", "Maize", "Groundnut"],
    annualProductionTonnes: 1650,
    revenueBeforeIntervention: 98.0,
    revenueAfterIntervention: 142.1,
    expensesLakhs: 88.0,
    netIncomeLakhs: 54.1,
    incomeGrowthPct: 45.0,
    healthScore: 86,
    performanceStatus: "High",
    lat: 14.6800,
    lng: 75.4856,
    interventions: [
      { name: "Chilli Solar Drying Sheds", type: "storage", startDate: "2023-01-10", investmentAmount: 1750000, beneficiaries: 210, status: "Active" },
      { name: "Spices Direct E-Nam Linkage", type: "marketLinkage", startDate: "2023-06-20", investmentAmount: 900000, beneficiaries: 300, status: "Active" }
    ],
    historicalIncome: [
      { year: "2021", revenue: 75.0, netIncome: 19.5 },
      { year: "2022", revenue: 86.0, netIncome: 24.0 },
      { year: "2023", revenue: 98.0, netIncome: 31.2 },
      { year: "2024", revenue: 118.5, netIncome: 42.0 },
      { year: "2025", revenue: 142.1, netIncome: 54.1 }
    ]
  },
  {
    id: "FPO-TN-008",
    name: "Kongu Millet & Dairy Farmers Co.",
    state: "Tamil Nadu",
    district: "Erode",
    block: "Gobichettipalayam",
    formationYear: 2020,
    membersCount: 460,
    smallFarmersCount: 380,
    womenMembersCount: 220,
    primaryCrops: ["Millets", "Turmeric", "Tapioca"],
    annualProductionTonnes: 1900,
    revenueBeforeIntervention: 104.0,
    revenueAfterIntervention: 135.2,
    expensesLakhs: 94.0,
    netIncomeLakhs: 41.2,
    incomeGrowthPct: 30.0,
    healthScore: 78,
    performanceStatus: "Moderate",
    lat: 11.4549,
    lng: 77.4419,
    interventions: [
      { name: "Millet Value Addition & Biscuit Line", type: "production", startDate: "2023-03-01", investmentAmount: 1600000, beneficiaries: 280, status: "Active" },
      { name: "Drip Irrigation for Turmeric", type: "irrigation", startDate: "2023-08-15", investmentAmount: 1300000, beneficiaries: 190, status: "Active" }
    ],
    historicalIncome: [
      { year: "2021", revenue: 82.0, netIncome: 20.5 },
      { year: "2022", revenue: 92.5, netIncome: 25.0 },
      { year: "2023", revenue: 104.0, netIncome: 30.1 },
      { year: "2024", revenue: 119.0, netIncome: 36.2 },
      { year: "2025", revenue: 135.2, netIncome: 41.2 }
    ]
  },
  {
    id: "FPO-AP-009",
    name: "Rayalaseema Horticulture Farmers Co.",
    state: "Andhra Pradesh",
    district: "Anantapur",
    block: "Dharmavaram",
    formationYear: 2022,
    membersCount: 340,
    smallFarmersCount: 290,
    womenMembersCount: 105,
    primaryCrops: ["Sweet Lime", "Pomegranate", "Tomato"],
    annualProductionTonnes: 1400,
    revenueBeforeIntervention: 78.0,
    revenueAfterIntervention: 89.7,
    expensesLakhs: 76.0,
    netIncomeLakhs: 13.7,
    incomeGrowthPct: 15.0,
    healthScore: 54,
    performanceStatus: "Needs Attention",
    lat: 14.4137,
    lng: 77.7126,
    interventions: [
      { name: "Borewell Recharge & Micro-Drip", type: "irrigation", startDate: "2023-05-10", investmentAmount: 1100000, beneficiaries: 140, status: "Active" }
    ],
    historicalIncome: [
      { year: "2021", revenue: 60.0, netIncome: 10.0 },
      { year: "2022", revenue: 68.0, netIncome: 11.8 },
      { year: "2023", revenue: 78.0, netIncome: 13.0 },
      { year: "2024", revenue: 82.5, netIncome: 12.5 },
      { year: "2025", revenue: 89.7, netIncome: 13.7 }
    ]
  },
  {
    id: "FPO-OD-010",
    name: "Kalinga Rice & Vegetable Co.",
    state: "Odisha",
    district: "Ganjam",
    block: "Aska",
    formationYear: 2021,
    membersCount: 370,
    smallFarmersCount: 330,
    womenMembersCount: 175,
    primaryCrops: ["Paddy", "Brinjal", "Pulses"],
    annualProductionTonnes: 1550,
    revenueBeforeIntervention: 58.0,
    revenueAfterIntervention: 67.28,
    expensesLakhs: 55.0,
    netIncomeLakhs: 12.28,
    incomeGrowthPct: 16.0,
    healthScore: 51,
    performanceStatus: "Needs Attention",
    lat: 19.6094,
    lng: 84.6593,
    interventions: [
      { name: "Solar Water Pump Installation", type: "irrigation", startDate: "2023-04-01", investmentAmount: 850000, beneficiaries: 120, status: "Active" }
    ],
    historicalIncome: [
      { year: "2021", revenue: 45.0, netIncome: 8.0 },
      { year: "2022", revenue: 51.0, netIncome: 9.5 },
      { year: "2023", revenue: 58.0, netIncome: 10.8 },
      { year: "2024", revenue: 62.0, netIncome: 11.5 },
      { year: "2025", revenue: 67.28, netIncome: 12.28 }
    ]
  },
  {
    id: "FPO-WB-011",
    name: "Bengal Delta Paddy & Jute Producer Co.",
    state: "West Bengal",
    district: "Nadia",
    block: "Ranaghat",
    formationYear: 2020,
    membersCount: 530,
    smallFarmersCount: 470,
    womenMembersCount: 210,
    primaryCrops: ["Aman Rice", "Jute", "Potato"],
    annualProductionTonnes: 3100,
    revenueBeforeIntervention: 128.0,
    revenueAfterIntervention: 166.4,
    expensesLakhs: 118.0,
    netIncomeLakhs: 48.4,
    incomeGrowthPct: 30.0,
    healthScore: 77,
    performanceStatus: "Moderate",
    lat: 23.1805,
    lng: 88.5802,
    interventions: [
      { name: "Cold Storage Facility for Potatoes", type: "storage", startDate: "2022-12-01", investmentAmount: 2200000, beneficiaries: 310, status: "Active" },
      { name: "Jute Retting & Ribboning Machines", type: "chcServices", startDate: "2023-05-18", investmentAmount: 1300000, beneficiaries: 260, status: "Active" }
    ],
    historicalIncome: [
      { year: "2021", revenue: 98.0, netIncome: 24.0 },
      { year: "2022", revenue: 112.0, netIncome: 28.5 },
      { year: "2023", revenue: 128.0, netIncome: 34.0 },
      { year: "2024", revenue: 146.0, netIncome: 41.2 },
      { year: "2025", revenue: 166.4, netIncome: 48.4 }
    ]
  },
  {
    id: "FPO-TG-012",
    name: "Telangana Red Gram & Cotton Co.",
    state: "Telangana",
    district: "Warangal",
    block: "Narsampet",
    formationYear: 2021,
    membersCount: 410,
    smallFarmersCount: 360,
    womenMembersCount: 150,
    primaryCrops: ["Cotton", "Red Gram", "Chilli"],
    annualProductionTonnes: 1800,
    revenueBeforeIntervention: 96.0,
    revenueAfterIntervention: 134.4,
    expensesLakhs: 89.0,
    netIncomeLakhs: 45.4,
    incomeGrowthPct: 40.0,
    healthScore: 82,
    performanceStatus: "High",
    lat: 17.9689,
    lng: 79.5941,
    interventions: [
      { name: "Cotton Ginning & Direct Buyer Link", type: "marketLinkage", startDate: "2023-02-15", investmentAmount: 1600000, beneficiaries: 240, status: "Active" },
      { name: "Drip Irrigation & Soil Testing Kit", type: "irrigation", startDate: "2023-09-01", investmentAmount: 1150000, beneficiaries: 190, status: "Active" }
    ],
    historicalIncome: [
      { year: "2021", revenue: 72.0, netIncome: 18.0 },
      { year: "2022", revenue: 83.0, netIncome: 22.1 },
      { year: "2023", revenue: 96.0, netIncome: 28.0 },
      { year: "2024", revenue: 114.0, netIncome: 36.5 },
      { year: "2025", revenue: 134.4, netIncome: 45.4 }
    ]
  }
];

export const sampleRiskIndicators: RiskIndicator[] = [
  {
    id: "RSK-001",
    fpoId: "FPO-AP-009",
    fpoName: "Rayalaseema Horticulture Farmers Co.",
    state: "Andhra Pradesh",
    riskType: "Income Decline",
    severity: "High",
    description: "Net income margin dropped to 15.2% due to water table depletion and lack of cold storage for perishable pomegranates.",
    recommendedAction: "Deploy emergency micro-drip irrigation kits & establish refrigerated transport link to Hyderabad market.",
    impactScore: 85
  },
  {
    id: "RSK-002",
    fpoId: "FPO-OD-010",
    fpoName: "Kalinga Rice & Vegetable Co.",
    state: "Odisha",
    riskType: "Low Intervention Usage",
    severity: "High",
    description: "Only 32% of member smallholders utilize solar water pumps due to insufficient field distribution lines.",
    recommendedAction: "Expand sub-surface water pipeline network and run CHC usage awareness camps.",
    impactScore: 78
  },
  {
    id: "RSK-003",
    fpoId: "FPO-UP-005",
    fpoName: "Awadh Pulse & Grain Farmers Co.",
    state: "Uttar Pradesh",
    riskType: "High Expense Ratio",
    severity: "Medium",
    description: "Operational diesel expenses increased by 22% for un-electrified mentha distillation units.",
    recommendedAction: "Convert diesel distillation units to solar-thermal hybrid biomass units.",
    impactScore: 64
  },
  {
    id: "RSK-004",
    fpoId: "FPO-RJ-004",
    fpoName: "Hadoti Organic Spice Producer Co.",
    state: "Rajasthan",
    riskType: "Distress Sale Risk",
    severity: "Medium",
    description: "Lack of post-harvest storage forces 60% of coriander harvest to be sold at local APMC mandis during peak supply dip.",
    recommendedAction: "Construct a 300-tonne modular spice warehouse with pledge financing capability.",
    impactScore: 68
  }
];

export const sampleAiRecommendations: AiRecommendation[] = [
  {
    id: "REC-001",
    fpoId: "FPO-GJ-001",
    fpoName: "Anand Green Farmer Producer Co.",
    title: "Expand Direct Cotton B2B Export Contracts",
    category: "Market Linkage",
    reason: "High yield stability achieved through drip irrigation; direct textile mill contracts will capture additional 12% profit margin.",
    priority: "High",
    expectedImpactPct: 18.5,
    actionableSteps: [
      "Obtain NABL quality certification for long-staple cotton.",
      "Partner with Surat textile exporter consortium.",
      "Enable digital weighment and instant UPI payout for farmers."
    ]
  },
  {
    id: "REC-002",
    fpoId: "FPO-MH-002",
    fpoName: "Baramati Agri Prosperity Producer Co.",
    title: "Deploy Solar Powered Cold Chain for Grapes & Onion",
    category: "Storage & Processing",
    reason: "Prevent post-harvest rot loss during summer price spikes; extends shelf life by 45 days.",
    priority: "High",
    expectedImpactPct: 22.0,
    actionableSteps: [
      "Install 50 MT packhouse with pre-cooling unit.",
      "Tie up with Maharashtra State Agricultural Marketing Board.",
      "Issue warehouse receipt loans via regional rural banks."
    ]
  },
  {
    id: "REC-003",
    fpoId: "FPO-RJ-004",
    fpoName: "Hadoti Organic Spice Producer Co.",
    title: "Upgrade to NABL Certified Organic Brand Packaging",
    category: "Financial Management",
    reason: "Raw coriander sells at ₹95/kg; retail-ready organic packaged coriander powder sells at ₹280/kg.",
    priority: "Medium",
    expectedImpactPct: 15.0,
    actionableSteps: [
      "Setup automated grinding and vacuum packaging line.",
      "Register brand trademark on ONDC (Open Network for Digital Commerce).",
      "Train 50 women members in hygienic quality control."
    ]
  },
  {
    id: "REC-004",
    fpoId: "FPO-AP-009",
    fpoName: "Rayalaseema Horticulture Farmers Co.",
    title: "Immediate Watershed & Drip fertigation Package",
    category: "Irrigation Infrastructure",
    reason: "Fruit drop rate in sweet lime is high due to moisture stress; micro-drip fertigation reduces water requirement by 40%.",
    priority: "High",
    expectedImpactPct: 28.0,
    actionableSteps: [
      "Construct 4 farm ponds connected to drip mainlines.",
      "Distribute water-soluble NPK fertigation doses.",
      "Enroll in WDC 2.0 watershed maintenance subsidy."
    ]
  }
];
