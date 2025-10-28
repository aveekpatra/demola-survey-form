// Shared type definitions for survey data

export interface SurveyResponse {
  _id: string;
  _creationTime: number;
  completedAt?: number;
  
  // Phase 1: Demographics & Shopping Behavior
  age?: string;
  gender?: string;
  shoppingPreference?: string;
  onlineShoppingFrequency?: string;

  // Phase 2: Online Shopping Experience & Pain Points
  findClothes?: string;
  socialMediaShopping?: string;
  socialMediaPlatforms?: string[];
  clothesFit?: string;
  returnsProblem?: string;
  misSizedItems?: string;
  trustIssues?: string[];
  colorMatchingUncertainty?: string;

  // Phase 3: Virtual Try-On & MVP Solution
  imageUploadWillingness?: string;
  tryOnFromSocialMedia?: string;
  tryOnUseFrequency?: string;
  tryOnBodyType?: string;
  tryOnConcerns?: string[];
  speedExpectation?: string;
  skinToneAccuracy?: string;
  virtualTryOn?: string;
  arRealism?: string;
  purchaseConfidence?: string;

  // Metadata
  userAgent?: string;
}

// Analytics types
export interface UserSegment {
  name: string;
  count: number;
  percentage: number;
  description: string;
}

export interface PainPoint {
  name: string;
  count: number;
  percentage: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface MarketOpportunity {
  tam: number; // Total Addressable Market
  sam: number; // Serviceable Addressable Market
  som: number; // Serviceable Obtainable Market
  obtainableMarket: number;
  projectedRevenue: number;
}

export interface ConversionFunnel {
  awareness: number;
  interest: number;
  consideration: number;
  intent: number;
  action: number;
}