export interface RegionCorridorData {
  id: string;
  state: string;
  city: string;
  corridorName: string;
  hives: number;
  sites: number;
  areaSqM: number;
  description: string;
  imdAnnualRainfallMm: number;
  monsoonProfile: string;
  peakSummerTempC: number;
  spongeCoolingC: number;
  dominantBee: string;
  keyNativeFlora: string[];
}

// Backward compatibility alias for BoroughData if used
export type BoroughData = RegionCorridorData & {
  borough: string;
};

export interface RooftopSite {
  id: string;
  name: string;
  city: string;
  state: string;
  corridor: string;
  buildingType: string;
  hives: number;
  wildflowerAreaSqM: number;
  honeyHarvestKg: number;
  jarsDonated: number;
  rainwaterL: number;
  x: number; // percentage coordinate on map viewBox
  y: number; // percentage coordinate on map viewBox
  coordinates?: [number, number]; // [longitude, latitude] for D3 geo projection
  isKeyStory?: boolean;
  storyNote?: string;
  addressSnippet?: string;
  coolingImpactC?: number;
  monsoonBufferL?: number;
}

export interface SectorImpact {
  buildingType: string;
  sites: number;
  hives: number;
  wildflowerArea: number; // sq m
  honeyHarvestKg: number; // kg
  jarsDonated: number;
  corporateSponsorshipInr: number; // in INR ₹
  primaryRole: string;
}

export interface StrategicGoal {
  title: string;
  pillar: string;
  metric: string;
  description: string;
  targetDate: string;
}

export interface NarrativeStory {
  title: string;
  location: string;
  region: string;
  state: string;
  heroStat: string;
  statLabel: string;
  body: string;
  quote?: string;
  quoteAuthor?: string;
}

export interface ClimateStationData {
  city: string;
  state: string;
  currentSeason: string;
  annualRainfallMm: number;
  swMonsoonContribution: string;
  neMonsoonContribution: string;
  peakHeatIndexC: number;
  rooftopTempDiffC: number;
  aquiferRechargeLPerSqm: number;
}
