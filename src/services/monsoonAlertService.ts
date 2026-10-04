// Mock API Service for IMD Real-Time Monsoon Status & Ecological Terrace Response
// Across South India (Karnataka, Tamil Nadu, Kerala, Andhra Pradesh)

export type AlertSeverity = 'advisory' | 'watch' | 'active' | 'normal';

export interface StateMonsoonAlert {
  stateId: 'karnataka' | 'tamil_nadu' | 'kerala' | 'andhra_pradesh';
  stateName: string;
  regionalHub: string;
  severity: AlertSeverity;
  alertTitle: string;
  monsoonType: string;
  currentPrecipitationMmHr: number;
  expected24hRainfallMm: number;
  spongeAbsorptionStatus: string;
  terraceCapacityUsedPercent: number;
  windSpeedKmph: number;
  imdStationCode: string;
  bulletinTime: string;
  ecologicalAction: string;
}

export interface MonsoonAlertResponse {
  timestamp: string;
  systemStatus: 'ONLINE' | 'STANDBY';
  overallNetworkAbsorptionRateLPerSec: number;
  alerts: StateMonsoonAlert[];
}

const MOCK_ALERT_DATA: StateMonsoonAlert[] = [
  {
    stateId: 'kerala',
    stateName: 'Kerala',
    regionalHub: 'Kochi & Malabar Gateway',
    severity: 'active',
    alertTitle: 'Heavy Southwest Monsoon Surge Active Along Malabar Coast',
    monsoonType: 'Southwest Monsoon (Edavappathi)',
    currentPrecipitationMmHr: 18.5,
    expected24hRainfallMm: 95,
    spongeAbsorptionStatus: 'High Volume Absorption (94% retention)',
    terraceCapacityUsedPercent: 91,
    windSpeedKmph: 34,
    imdStationCode: 'IMD-KOC-04',
    bulletinTime: 'Updated 8 mins ago · IMD Thiruvananthapuram',
    ecologicalAction: '19 coastal bio-sponges diverting 124,000 Litres/hr away from Ernakulam storm canals into deep ground filters.',
  },
  {
    stateId: 'tamil_nadu',
    stateName: 'Tamil Nadu',
    regionalHub: 'Chennai & Coromandel Coast',
    severity: 'watch',
    alertTitle: 'Northeast Monsoon Cyclonic Trough Approaching SW Bay of Bengal',
    monsoonType: 'Northeast Monsoon (Vada Kizhakku)',
    currentPrecipitationMmHr: 4.2,
    expected24hRainfallMm: 68,
    spongeAbsorptionStatus: 'Terraces Pre-Drained & Primed for Surge Catchment',
    terraceCapacityUsedPercent: 38,
    windSpeedKmph: 28,
    imdStationCode: 'IMD-MAA-02',
    bulletinTime: 'Updated 14 mins ago · IMD Chennai',
    ecologicalAction: 'Valves opened to secondary recharge wells across 21 OMR and Mylapore apiary rooftops to buffer cloudburst peaks.',
  },
  {
    stateId: 'karnataka',
    stateName: 'Karnataka',
    regionalHub: 'Bengaluru Deccan Plateau',
    severity: 'advisory',
    alertTitle: 'Convective Evening Thunderstorms Forming Over South Interior Karnataka',
    monsoonType: 'Post-Monsoon Convective Cloudbursts',
    currentPrecipitationMmHr: 9.0,
    expected24hRainfallMm: 45,
    spongeAbsorptionStatus: 'Active Infiltration Into Coir-Pith Substrate',
    terraceCapacityUsedPercent: 54,
    windSpeedKmph: 18,
    imdStationCode: 'IMD-BLR-01',
    bulletinTime: 'Updated 22 mins ago · IMD Bengaluru',
    ecologicalAction: 'Rooftop vetiver and lemongrass root zones in KR Market & Hebbal delaying flash runoff into Raja-kaluves by 110 minutes.',
  },
  {
    stateId: 'andhra_pradesh',
    stateName: 'Andhra Pradesh',
    regionalHub: 'Visakhapatnam & Coastal Andhra',
    severity: 'normal',
    alertTitle: 'Moderate Coastal Breeze with Isolated Coastal Drizzle',
    monsoonType: 'Bay of Bengal Depressions Watch',
    currentPrecipitationMmHr: 1.5,
    expected24hRainfallMm: 18,
    spongeAbsorptionStatus: 'Optimal Soil Moisture Reservoir (Stingless bees actively foraging)',
    terraceCapacityUsedPercent: 26,
    windSpeedKmph: 14,
    imdStationCode: 'IMD-VTZ-03',
    bulletinTime: 'Updated 31 mins ago · IMD Visakhapatnam',
    ecologicalAction: '16 rooftop sanctuaries retaining soil moisture for native flora flowering while solar radiation heats RCC slabs.',
  },
];

/**
 * Mock API service simulating asynchronous network fetch with realistic latency and jitter.
 */
export async function fetchLatestMonsoonAlerts(): Promise<MonsoonAlertResponse> {
  // Simulate network latency (300ms - 650ms)
  await new Promise((resolve) => setTimeout(resolve, 450));

  const now = new Date();
  const timeString = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return {
    timestamp: timeString,
    systemStatus: 'ONLINE',
    overallNetworkAbsorptionRateLPerSec: 142.8,
    alerts: MOCK_ALERT_DATA.map((alert) => ({
      ...alert,
      bulletinTime: `Live Sync ${timeString} · ${alert.imdStationCode}`,
    })),
  };
}
