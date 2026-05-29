export type Travelers = { adults: number; children: number; infants: number };

export type TripStyle =
  | "Culture & Food"
  | "Adventure"
  | "Relax & Wellness"
  | "Nightlife"
  | "Family"
  | "Luxury"
  | "Backpacker"
  | "Eco";

export type TripMemory = {
  lastDestination?: string;
  lastBudget?: number;
  lastStyles?: TripStyle[];
  lastPrompt?: string;
};

export type ProfileSignal = { label: string; value: string; score?: number };

export type UserProfile = {
  persona: string;
  summary: string;
  signals: ProfileSignal[];
  memoryNote: string;
  history: string[];
  socialActivity: "low" | "medium" | "high";
};

export type TripFormInput = {
  tripType: "round" | "oneway";
  from: string;
  to: string;
  startDate: string; // ISO
  endDate: string; // ISO
  travelers: Travelers;
  budget: number;
  currency: string;
  styles: TripStyle[];
  prompt?: string;
  memory?: TripMemory;
};

export type Activity = {
  id: string;
  name: string;
  type: string;
  durationMin: number;
  estimatedCostUSD: number;
  coords: [number, number]; // [lat, lng]
  photo: string;
  description: string;
};

export type Day = {
  day: number;
  title: string;
  activities: Activity[];
  estimatedCostUSD: number;
  photos: string[];
};

export type EcoTip = { tip: string; savingKg: number; icon: "leaf" | "bike" | "bus" | "utensils" };

export type SafetyAlert = { title: string; level: "low" | "medium" | "high"; description: string };

export type SafetyInfo = {
  status: "safe" | "caution" | "alert";
  emergencyNumber: string;
  nearestHospital: { name: string; distanceKm: number };
  nearestPolice: { name: string; distanceKm: number };
  alerts: SafetyAlert[];
  nightRiskAreas: string[];
  scamAlerts: string[];
};

export type PricingSignal = {
  type: "flight" | "hotel" | "activity";
  trend: "up" | "down" | "stable";
  impactUSD: number;
  confidence: number;
  message: string;
};

export type OptimizationTip = {
  category: "budget" | "time" | "safety" | "weather" | "eco";
  message: string;
  savingsUSD?: number;
  timeSavedMin?: number;
  riskLevel?: "low" | "medium" | "high";
};

export type HiddenGem = {
  name: string;
  type: string;
  description: string;
  coords: [number, number];
  photo: string;
  popularityScore: number;
};

export type CopilotEvent = {
  id: string;
  time: string;
  type: "flight" | "weather" | "safety" | "transport" | "booking";
  message: string;
  action?: string;
};

export type Prediction = {
  type: "crowd" | "delay" | "demand" | "weather";
  message: string;
  confidence: number;
};

export type OfflinePack = {
  status: "ready" | "stale" | "none";
  lastSynced: string;
  sizeMB: number;
};

export type MarketplaceOffer = {
  id: string;
  title: string;
  category: "guide" | "photographer" | "driver" | "restaurant" | "hotel" | "tour" | "experience";
  priceUSD: number;
  rating: number;
  photo: string;
  provider: string;
};

export type Experience = {
  id: string;
  title: string;
  priceUSD: number;
  photo: string;
  rating: number;
  durationMin: number;
};

export type Trip = {
  id: string;
  destination: string;
  country: string;
  coverImage: string;
  summary: string;
  currency: string;
  prompt?: string;
  profile: UserProfile;
  days: Day[];
  totalCostUSD: number;
  budgetUSD: number;
  ecoScore: number; // 0-100
  carbonKg: number;
  ecoTips: EcoTip[];
  eco: {
    greenTransportScore: number;
    localBusinessScore: number;
    certifiedStays: number;
    offsetUSD: number;
  };
  safety: SafetyInfo;
  experiences: Experience[];
  pricing: PricingSignal[];
  optimizations: OptimizationTip[];
  hiddenGems: HiddenGem[];
  predictions: Prediction[];
  copilot: CopilotEvent[];
  offline: OfflinePack;
  marketplace: MarketplaceOffer[];
};
