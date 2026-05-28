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

export type SafetyInfo = {
  status: "safe" | "caution" | "alert";
  emergencyNumber: string;
  nearestHospital: { name: string; distanceKm: number };
  nearestPolice: { name: string; distanceKm: number };
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
  days: Day[];
  totalCostUSD: number;
  budgetUSD: number;
  ecoScore: number; // 0-100
  carbonKg: number;
  ecoTips: EcoTip[];
  safety: SafetyInfo;
  experiences: Experience[];
};
