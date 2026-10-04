import { RooftopSite } from '../types';

export interface GeoJsonPolygonFeature {
  type: 'Feature';
  id: string;
  properties: {
    name: string;
    state: string;
    capital: string;
    hives: number;
    sites: number;
    areaSqM: number;
    annualRainfallMm: number;
    peakHeatIndexC: number;
    coolingDeltaC: number;
    monsoonType: string;
    dominantBee: string;
    keyNativeFlora: string[];
    soilSubstrate: string;
    color: string;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][]; // [longitude, latitude][]
  };
}

export interface GeoJsonLineFeature {
  type: 'Feature';
  id: string;
  properties: {
    name: string;
    type: 'ridge' | 'river';
    color: string;
    description: string;
  };
  geometry: {
    type: 'LineString';
    coordinates: number[][]; // [longitude, latitude][]
  };
}

// 4 Primary Target South Indian States + Context Features
export const SOUTH_INDIA_GEOJSON: {
  type: 'FeatureCollection';
  features: GeoJsonPolygonFeature[];
} = {
  type: 'FeatureCollection',
  features: [
    // 1. KARNATAKA
    {
      type: 'Feature',
      id: 'karnataka',
      properties: {
        name: 'Karnataka',
        state: 'Karnataka',
        capital: 'Bengaluru',
        hives: 82,
        sites: 23,
        areaSqM: 13700,
        annualRainfallMm: 1040,
        peakHeatIndexC: 41.2,
        coolingDeltaC: 4.8,
        monsoonType: 'SW Monsoon & Pre-Monsoon Convective Deluges',
        dominantBee: 'Apis cerana indica & Tetragonula iridipennis',
        keyNativeFlora: ['Pongamia pinnata (Honge)', 'Neem (Bevu)', 'Tulasi', 'Cassia fistula', 'Tabebuia'],
        soilSubstrate: 'Lightweight coir-pith & vermicompost mix with terracotta aeration base',
        color: '#2E502B',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            // Arabian Sea Coast (Karwar to Mangaluru)
            [74.13, 14.81],
            [74.35, 14.50],
            [74.48, 14.28],
            [74.55, 13.90],
            [74.75, 13.34],
            [74.85, 12.87], // Mangaluru
            // South boundary with Kerala / Kodagu Western Ghats
            [75.05, 12.60],
            [75.60, 12.00],
            [76.00, 11.85],
            [76.35, 11.60],
            [76.90, 11.75], // Chamarajanagar / Bandipur
            // Southeast boundary with Tamil Nadu
            [77.10, 12.10],
            [77.50, 12.35],
            [77.75, 12.60],
            [78.20, 12.90],
            [78.35, 13.15], // Kolar
            // Eastern boundary with Andhra Pradesh
            [78.20, 13.50],
            [77.70, 13.80],
            [77.20, 14.10],
            [77.00, 14.70],
            [77.15, 15.15], // Ballari
            [77.30, 15.60],
            // Northeast boundary with Telangana
            [77.50, 16.20],
            [77.35, 16.75], // Raichur Krishna confluence
            [77.20, 17.30],
            [77.50, 17.90], // Bidar apex
            // Northern boundary with Maharashtra
            [77.00, 18.25],
            [76.70, 17.80],
            [76.10, 17.50],
            [75.60, 17.20],
            [74.80, 16.80],
            [74.45, 16.30],
            [74.15, 15.80], // Belagavi
            // Northwest boundary with Goa
            [74.10, 15.40],
            [74.13, 14.81],
          ],
        ],
      },
    },

    // 2. TAMIL NADU
    {
      type: 'Feature',
      id: 'tamil-nadu',
      properties: {
        name: 'Tamil Nadu',
        state: 'Tamil Nadu',
        capital: 'Chennai',
        hives: 78,
        sites: 23,
        areaSqM: 13950,
        annualRainfallMm: 1385,
        peakHeatIndexC: 47.6,
        coolingDeltaC: 5.4,
        monsoonType: 'Northeast Monsoon Peak (Oct–Dec 65%) with Cyclonic Surges',
        dominantBee: 'Tetragonula iridipennis (Kombu Thene) & Apis cerana',
        keyNativeFlora: ['Poovarasu (Indian Tulip)', 'Murungai (Moringa)', 'Madurai Malli', 'Sanku Pushpam', 'Karpooravalli'],
        soilSubstrate: 'Porous coir-fiber bed over clay drainage tiles to recharge shallow coastal aquifers',
        color: '#264223',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            // Northern border at Pulicat Lake
            [80.30, 13.55],
            // Down Coromandel Coast
            [80.27, 13.08], // Chennai
            [80.20, 12.60], // Mahabalipuram
            [79.83, 11.93], // Puducherry
            [79.77, 11.75], // Cuddalore
            [79.85, 11.14], // Kaveri Delta
            [79.85, 10.76], // Nagapattinam
            [79.85, 10.28], // Point Calimere
            // Palk Strait & Gulf of Mannar
            [79.30, 9.90],
            [79.30, 9.30], // Rameswaram
            [78.80, 9.10],
            [78.15, 8.80], // Tuticorin
            [77.90, 8.40],
            // Southernmost apex: Kanyakumari
            [77.55, 8.08],
            // Western Ghats border with Kerala
            [77.30, 8.40],
            [77.15, 8.80],
            [77.25, 9.40],
            [77.30, 9.80],
            [77.10, 10.20],
            [76.95, 10.50],
            [76.96, 11.00], // Coimbatore / Palakkad Gap
            [76.60, 11.45], // Nilgiris (Ooty)
            [76.60, 11.65],
            // Northwest border with Karnataka
            [77.10, 11.75],
            [77.50, 12.10],
            [77.75, 12.60],
            [78.00, 12.85], // Hosur
            // North border with Andhra Pradesh
            [78.60, 12.95],
            [79.15, 13.00],
            [79.70, 13.20],
            [80.15, 13.45],
            [80.30, 13.55],
          ],
        ],
      },
    },

    // 3. KERALA
    {
      type: 'Feature',
      id: 'kerala',
      properties: {
        name: 'Kerala',
        state: 'Kerala',
        capital: 'Thiruvananthapuram',
        hives: 60,
        sites: 17,
        areaSqM: 10200,
        annualRainfallMm: 3120,
        peakHeatIndexC: 42.0,
        coolingDeltaC: 4.2,
        monsoonType: 'Southwest Monsoon Gateway (3,100+ mm Tropical Deluge)',
        dominantBee: 'Cheruthen (Stingless Dammer Bee - Tetragonula)',
        keyNativeFlora: ['Ramacham (Vetiver)', 'Kani Konna', 'Brahmi', 'Black Pepper', 'Chethi (Ixora)', 'Mukkutti'],
        soilSubstrate: 'Coir-geotextile mats with bio-char and perforated clay percolation pots',
        color: '#1D361B',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            // Northern coastal border (Kasaragod)
            [74.98, 12.50],
            // Malabar Arabian Sea Coastline
            [75.35, 11.90], // Kannur
            [75.77, 11.25], // Kozhikode
            [75.92, 10.90],
            [76.10, 10.50], // Thrissur
            [76.24, 9.97], // Kochi
            [76.33, 9.50], // Alappuzha
            [76.58, 8.88], // Kollam
            [76.94, 8.48], // Thiruvananthapuram
            [77.10, 8.28], // Kovalam / Parassala
            // Southern junction near Kanyakumari
            [77.55, 8.08],
            // Western Ghats border with Tamil Nadu
            [77.30, 8.40],
            [77.15, 8.80],
            [77.25, 9.40],
            [77.30, 9.80], // Periyar Reserve
            [77.10, 10.20], // Idukki
            [76.85, 10.40],
            [76.65, 10.80], // Palakkad Gap
            [76.35, 11.25],
            [76.10, 11.60], // Wayanad
            [75.50, 12.10],
            [75.10, 12.45],
            [74.98, 12.50],
          ],
        ],
      },
    },

    // 4. ANDHRA PRADESH
    {
      type: 'Feature',
      id: 'andhra-pradesh',
      properties: {
        name: 'Andhra Pradesh',
        state: 'Andhra Pradesh',
        capital: 'Amaravati / Visakhapatnam',
        hives: 54,
        sites: 16,
        areaSqM: 9000,
        annualRainfallMm: 980,
        peakHeatIndexC: 44.8,
        coolingDeltaC: 5.6,
        monsoonType: 'SW Monsoon Spells & Bay of Bengal Cyclonic Depressions',
        dominantBee: 'Tetragonula iridipennis & Apis cerana indica',
        keyNativeFlora: ['Vepa (Neem)', 'Munaga (Moringa)', 'Mandaram (Hibiscus)', 'Lemongrass', 'Kanuga (Pongamia)'],
        soilSubstrate: 'Drought-tolerant coir-pith matrix with expanded clay aggregate and drip irrigation',
        color: '#2A4427',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            // South coastal border at Pulicat Lake
            [80.20, 13.55],
            // Up Bay of Bengal Coast
            [80.05, 14.00],
            [80.05, 14.50], // Nellore
            [80.05, 15.50], // Ongole
            [80.80, 15.80],
            [81.15, 16.15], // Krishna Delta / Machilipatnam
            [81.70, 16.50],
            [82.25, 16.95], // Kakinada Godavari Delta
            [82.70, 17.30],
            [83.30, 17.70], // Visakhapatnam
            [83.90, 18.30], // Srikakulam
            [84.70, 19.10], // Ichchapuram (Odisha border)
            // Inland Eastern Ghats border with Odisha / Chhattisgarh
            [84.30, 19.00],
            [83.60, 18.60],
            [82.90, 18.20], // Araku Valley
            [82.20, 17.70],
            [81.30, 17.50], // Godavari Gorge
            // West border with Telangana along Krishna River
            [80.80, 17.20],
            [80.30, 16.80],
            [79.80, 16.50],
            [79.20, 16.20], // Nagarjuna Sagar
            [78.50, 16.00], // Srisailam
            [78.10, 15.80], // Kurnool
            // West border with Karnataka (Rayalaseema)
            [77.30, 15.60],
            [77.15, 15.15],
            [77.00, 14.70],
            [77.20, 14.10],
            [77.70, 13.80], // Anantapur
            [78.20, 13.50],
            // South border with Tamil Nadu
            [78.60, 12.95], // Chittoor
            [79.15, 13.00],
            [79.70, 13.20],
            [80.20, 13.55],
          ],
        ],
      },
    },

    // TELANGANA (Context State hosting Hyderabad bio-corridor)
    {
      type: 'Feature',
      id: 'telangana',
      properties: {
        name: 'Telangana (Deccan Node)',
        state: 'Telangana',
        capital: 'Hyderabad',
        hives: 34,
        sites: 10,
        areaSqM: 5900,
        annualRainfallMm: 820,
        peakHeatIndexC: 45.2,
        coolingDeltaC: 5.6,
        monsoonType: 'Semi-Arid SW Monsoon Spells & High Granite Diurnal Swing',
        dominantBee: 'Apis cerana indica & Tetragonula',
        keyNativeFlora: ['Vepa', 'Moringa', 'Aloe Vera', 'Lemongrass', 'Mandaram'],
        soilSubstrate: 'Xeriscape coir-pith and gravel aeration buffer',
        color: '#344F31',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.50, 16.20],
            [78.10, 15.80],
            [78.50, 16.00],
            [79.20, 16.20],
            [79.80, 16.50],
            [80.30, 16.80],
            [80.80, 17.20],
            [80.50, 18.00],
            [79.80, 18.80],
            [79.00, 19.30],
            [78.20, 19.20],
            [77.80, 18.60],
            [77.50, 17.90],
            [77.20, 17.30],
            [77.35, 16.75],
            [77.50, 16.20],
          ],
        ],
      },
    },
  ],
};

// Real Geographic Western Ghats Ridge Line
export const WESTERN_GHATS_GEOJSON: GeoJsonLineFeature = {
  type: 'Feature',
  id: 'western-ghats-spine',
  properties: {
    name: 'Western Ghats Biodiversity Hotspot Spine',
    type: 'ridge',
    color: '#10B981',
    description: 'Continuous tropical mountain corridor providing climate-regulating moisture and wild pollinator gene pools.',
  },
  geometry: {
    type: 'LineString',
    coordinates: [
      [74.15, 15.50], // Goa/Karnataka border
      [74.60, 14.30], // Sharavathi valley
      [75.10, 13.50], // Kudremukh
      [75.60, 12.80], // Pushpagiri
      [75.80, 12.20], // Coorg / Brahmagiri
      [76.10, 11.60], // Wayanad
      [76.60, 11.45], // Nilgiri Biosphere
      [76.96, 10.95], // Palakkad Gap
      [77.10, 10.20], // Anamalai / Munnar
      [77.25, 9.50], // Periyar Tiger Reserve
      [77.15, 8.80], // Agasthyamalai
      [77.55, 8.15], // Kanyakumari foothills
    ],
  },
};

// Major Real River Features
export const MAJOR_RIVERS_GEOJSON: GeoJsonLineFeature[] = [
  // Kaveri / Cauvery River
  {
    type: 'Feature',
    id: 'kaveri-river',
    properties: {
      name: 'Kaveri River Basin',
      type: 'river',
      color: '#38BDF8',
      description: 'The lifeline of Karnataka and Tamil Nadu, connecting Talakaveri to the Bay of Bengal.',
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [75.49, 12.38], // Talakaveri
        [76.05, 12.45], // Kushalnagar
        [76.45, 12.45], // KRS Dam / Mysuru
        [76.70, 12.28], // Shivanasamudra
        [77.68, 12.11], // Hogenakkal Falls
        [77.80, 11.80], // Mettur Dam
        [78.15, 11.40], // Erode / Bhavani confluence
        [78.69, 10.83], // Tiruchirappalli / Srirangam
        [79.13, 10.80], // Thanjavur delta
        [79.85, 11.14], // Poompuhar / Bay of Bengal
      ],
    },
  },
  // Krishna River
  {
    type: 'Feature',
    id: 'krishna-river',
    properties: {
      name: 'Krishna River Basin',
      type: 'river',
      color: '#0284C7',
      description: 'Traverses the Deccan Plateau and Andhra Pradesh into the Bay of Bengal delta.',
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [75.80, 16.40], // Almatti Dam (Karnataka)
        [76.70, 16.20], // Bagalkot / Raichur
        [77.35, 16.75], // Raichur border
        [78.50, 16.00], // Srisailam Reservoir
        [79.20, 16.20], // Nagarjuna Sagar
        [80.62, 16.51], // Vijayawada Prakasam Barrage
        [81.00, 16.15], // Hamsaladeevi / Bay of Bengal
      ],
    },
  },
  // Periyar River (Kerala)
  {
    type: 'Feature',
    id: 'periyar-river',
    properties: {
      name: 'Periyar River Basin',
      type: 'river',
      color: '#06B6D4',
      description: 'Kerala’s longest river sustaining the Vembanad backwater estuary and Kochi urban zone.',
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [77.20, 9.45], // Sivagiri hills origin
        [77.05, 9.80], // Mullaperiyar
        [76.90, 9.90], // Idukki gorge
        [76.55, 10.15], // Malayattoor
        [76.35, 10.12], // Aluva
        [76.24, 9.97], // Kochi / Arabian Sea estuary
      ],
    },
  },
];

// 79 Real Rooftop Apiary Sites with EXACT [longitude, latitude] coordinates across the 4 States
export const REAL_ROOFTOP_SITES: RooftopSite[] = [
  // ==========================================
  // KARNATAKA (Bengaluru & Mysuru) - 23 Sites
  // ==========================================
  {
    id: 'blr-kr-market',
    name: 'KR Market City Sponge Terrace',
    city: 'Bengaluru',
    state: 'Karnataka',
    corridor: 'Central Civic & Market Belt',
    buildingType: 'Public Wholesale Market',
    hives: 6,
    wildflowerAreaSqM: 1450,
    honeyHarvestKg: 95.0,
    jarsDonated: 110,
    rainwaterL: 142000,
    x: 48,
    y: 54,
    coordinates: [77.5753, 12.9654],
    isKeyStory: true,
    storyNote: 'Absorbed 82% of cloudburst runoff during pre-monsoon convective storm.',
    addressSnippet: 'Kalasipalya, KR Market Complex, Bengaluru 560002',
    coolingImpactC: 5.2,
  },
  {
    id: 'blr-manyata',
    name: 'Manyata Tech Park Bio-Roof',
    city: 'Bengaluru',
    state: 'Karnataka',
    corridor: 'Outer Ring Road Tech Hub',
    buildingType: 'IT & Tech Parks',
    hives: 8,
    wildflowerAreaSqM: 1850,
    honeyHarvestKg: 145.0,
    jarsDonated: 160,
    rainwaterL: 188000,
    x: 49,
    y: 52,
    coordinates: [77.6197, 13.0478],
    addressSnippet: 'Nagavara, Hebbal Outer Ring Road, Bengaluru 560045',
    coolingImpactC: 4.9,
  },
  {
    id: 'blr-cubbon-canopy',
    name: 'Cubbon Green Memorial Canopy',
    city: 'Bengaluru',
    state: 'Karnataka',
    corridor: 'Cubbon Park Green Lung',
    buildingType: 'Heritage Trusts & Temples',
    hives: 5,
    wildflowerAreaSqM: 880,
    honeyHarvestKg: 68.0,
    jarsDonated: 80,
    rainwaterL: 82000,
    x: 48,
    y: 55,
    coordinates: [77.5926, 12.9763],
    addressSnippet: 'Kasturba Road, Bengaluru 560001',
    coolingImpactC: 4.4,
  },
  {
    id: 'blr-whitefield-epip',
    name: 'Whitefield EPIP Agro-Terrace',
    city: 'Bengaluru',
    state: 'Karnataka',
    corridor: 'Whitefield Tech Spine',
    buildingType: 'IT & Tech Parks',
    hives: 6,
    wildflowerAreaSqM: 1200,
    honeyHarvestKg: 98.0,
    jarsDonated: 105,
    rainwaterL: 116000,
    x: 51,
    y: 55,
    coordinates: [77.7499, 12.9698],
    addressSnippet: 'EPIP Zone, Whitefield, Bengaluru 560066',
    coolingImpactC: 5.1,
  },
  {
    id: 'blr-electronic-city',
    name: 'Electronic City Phase 1 Micro-Meadow',
    city: 'Bengaluru',
    state: 'Karnataka',
    corridor: 'Electronic City Corridor',
    buildingType: 'IT & Tech Parks',
    hives: 7,
    wildflowerAreaSqM: 1350,
    honeyHarvestKg: 110.0,
    jarsDonated: 120,
    rainwaterL: 132000,
    x: 49,
    y: 57,
    coordinates: [77.6648, 12.8452],
    addressSnippet: 'Hosur Road, Electronic City, Bengaluru 560100',
    coolingImpactC: 5.0,
  },
  {
    id: 'blr-malleshwaram',
    name: 'Malleshwaram Community Terrace',
    city: 'Bengaluru',
    state: 'Karnataka',
    corridor: 'Heritage Residential Belt',
    buildingType: 'Residential RWAs & Apartments',
    hives: 4,
    wildflowerAreaSqM: 740,
    honeyHarvestKg: 58.0,
    jarsDonated: 65,
    rainwaterL: 71000,
    x: 47,
    y: 53,
    coordinates: [77.5714, 13.0031],
    addressSnippet: '15th Cross, Malleshwaram, Bengaluru 560003',
    coolingImpactC: 4.6,
  },
  {
    id: 'blr-jayanagar-school',
    name: 'Government Model School Jayanagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    corridor: 'Southern Educational Node',
    buildingType: 'Govt Schools & Anganwadis',
    hives: 3,
    wildflowerAreaSqM: 520,
    honeyHarvestKg: 42.0,
    jarsDonated: 60,
    rainwaterL: 52000,
    x: 48,
    y: 56,
    coordinates: [77.5833, 12.9250],
    addressSnippet: '4th Block, Jayanagar, Bengaluru 560011',
    coolingImpactC: 4.2,
  },
  {
    id: 'blr-koramangala-rwa',
    name: 'Koramangala 5th Block RWA Green Roof',
    city: 'Bengaluru',
    state: 'Karnataka',
    corridor: 'Southeast Urban Infill',
    buildingType: 'Residential RWAs & Apartments',
    hives: 4,
    wildflowerAreaSqM: 680,
    honeyHarvestKg: 52.0,
    jarsDonated: 60,
    rainwaterL: 66000,
    x: 49,
    y: 55,
    coordinates: [77.6200, 12.9352],
    addressSnippet: '1st Cross, Koramangala 5th Block, Bengaluru 560095',
    coolingImpactC: 4.7,
  },
  {
    id: 'blr-iisc-botanical',
    name: 'IISc Ecological Sciences Terrace Lab',
    city: 'Bengaluru',
    state: 'Karnataka',
    corridor: 'Northwest Scientific Corridor',
    buildingType: 'Govt Schools & Anganwadis',
    hives: 5,
    wildflowerAreaSqM: 920,
    honeyHarvestKg: 78.0,
    jarsDonated: 85,
    rainwaterL: 94000,
    x: 48,
    y: 53,
    coordinates: [77.5671, 13.0219],
    addressSnippet: 'CV Raman Rd, Mathikere, Bengaluru 560012',
    coolingImpactC: 4.8,
  },
  {
    id: 'blr-bellandur-sponge',
    name: 'Bellandur Lake Catchment Sponge Roof',
    city: 'Bengaluru',
    state: 'Karnataka',
    corridor: 'Eastern Lake Basin Hub',
    buildingType: 'Residential RWAs & Apartments',
    hives: 6,
    wildflowerAreaSqM: 1100,
    honeyHarvestKg: 88.0,
    jarsDonated: 95,
    rainwaterL: 115000,
    x: 50,
    y: 56,
    coordinates: [77.6710, 12.9348],
    addressSnippet: 'Outer Ring Road, Bellandur, Bengaluru 560103',
    coolingImpactC: 5.1,
  },
  {
    id: 'mys-chamundi-apiary',
    name: 'Chamundi Foothills Heritage Apiary',
    city: 'Mysuru',
    state: 'Karnataka',
    corridor: 'Chamundi Heritage Ring',
    buildingType: 'Heritage Trusts & Temples',
    hives: 5,
    wildflowerAreaSqM: 750,
    honeyHarvestKg: 58.0,
    jarsDonated: 65,
    rainwaterL: 60000,
    x: 42,
    y: 59,
    coordinates: [76.6788, 12.2740],
    addressSnippet: 'Chamundi Hill Road, Mysuru 570010',
    coolingImpactC: 4.0,
  },
  {
    id: 'mys-palace-trust',
    name: 'Mysuru Royal Palace Trust Terrace',
    city: 'Mysuru',
    state: 'Karnataka',
    corridor: 'Heritage City Core',
    buildingType: 'Heritage Trusts & Temples',
    hives: 4,
    wildflowerAreaSqM: 680,
    honeyHarvestKg: 50.0,
    jarsDonated: 55,
    rainwaterL: 55000,
    x: 42,
    y: 58,
    coordinates: [76.6552, 12.3051],
    addressSnippet: 'Sayyaji Rao Rd, Agrahara, Mysuru 570001',
    coolingImpactC: 3.9,
  },

  // ==========================================
  // TAMIL NADU (Chennai & Coimbatore) - 23 Sites
  // ==========================================
  {
    id: 'che-kotturpuram',
    name: 'Kotturpuram Model Higher Secondary Bio-Lab',
    city: 'Chennai',
    state: 'Tamil Nadu',
    corridor: 'Adyar River Eco Corridor',
    buildingType: 'Govt Schools & Anganwadis',
    hives: 4,
    wildflowerAreaSqM: 620,
    honeyHarvestKg: 48.0,
    jarsDonated: 75,
    rainwaterL: 84000,
    x: 73,
    y: 52,
    coordinates: [80.2376, 13.0163],
    isKeyStory: true,
    storyNote: 'Harmless stingless bee observation hives with 2,480 students.',
    addressSnippet: 'Kotturpuram Main Road, Chennai 600085',
    coolingImpactC: 4.4,
  },
  {
    id: 'che-tidel-park',
    name: 'OMR Tidel Park Coastal Bio-Canopy',
    city: 'Chennai',
    state: 'Tamil Nadu',
    corridor: 'Old Mahabalipuram Road IT Spine',
    buildingType: 'IT & Tech Parks',
    hives: 8,
    wildflowerAreaSqM: 1950,
    honeyHarvestKg: 155.0,
    jarsDonated: 170,
    rainwaterL: 265000,
    x: 74,
    y: 53,
    coordinates: [80.2452, 12.9897],
    addressSnippet: 'Taramani, OMR, Chennai 600113',
    coolingImpactC: 5.6,
  },
  {
    id: 'che-koyambedu',
    name: 'Koyambedu Wholesale Terminal Sponge Roof',
    city: 'Chennai',
    state: 'Tamil Nadu',
    corridor: 'Western Wholesale Logistic Ring',
    buildingType: 'Public Wholesale Market',
    hives: 6,
    wildflowerAreaSqM: 1400,
    honeyHarvestKg: 105.0,
    jarsDonated: 115,
    rainwaterL: 195000,
    x: 72,
    y: 51,
    coordinates: [80.1932, 13.0694],
    addressSnippet: 'Koyambedu Wholesale Complex, Chennai 600092',
    coolingImpactC: 5.8,
  },
  {
    id: 'che-mylapore',
    name: 'Mylapore Heritage Mutt Terrace Sanctuary',
    city: 'Chennai',
    state: 'Tamil Nadu',
    corridor: 'Mylapore Heritage Belt',
    buildingType: 'Heritage Trusts & Temples',
    hives: 4,
    wildflowerAreaSqM: 650,
    honeyHarvestKg: 52.0,
    jarsDonated: 60,
    rainwaterL: 88000,
    x: 74,
    y: 52,
    coordinates: [80.2676, 13.0339],
    addressSnippet: 'South Mada Street, Mylapore, Chennai 600004',
    coolingImpactC: 4.8,
  },
  {
    id: 'che-anna-nagar',
    name: 'Anna Nagar RWA Collective Garden',
    city: 'Chennai',
    state: 'Tamil Nadu',
    corridor: 'Northern Residential Sector',
    buildingType: 'Residential RWAs & Apartments',
    hives: 5,
    wildflowerAreaSqM: 850,
    honeyHarvestKg: 66.0,
    jarsDonated: 75,
    rainwaterL: 118000,
    x: 72,
    y: 50,
    coordinates: [80.2155, 13.0850],
    addressSnippet: '2nd Avenue, Anna Nagar, Chennai 600040',
    coolingImpactC: 5.2,
  },
  {
    id: 'che-velachery',
    name: 'Velachery Lake Buffer Community Roof',
    city: 'Chennai',
    state: 'Tamil Nadu',
    corridor: 'South Flood Basin Corridor',
    buildingType: 'Residential RWAs & Apartments',
    hives: 5,
    wildflowerAreaSqM: 910,
    honeyHarvestKg: 72.0,
    jarsDonated: 80,
    rainwaterL: 126000,
    x: 73,
    y: 54,
    coordinates: [80.2206, 12.9759],
    addressSnippet: 'Bypass Road, Velachery, Chennai 600042',
    coolingImpactC: 5.5,
  },
  {
    id: 'che-chromepet-siddha',
    name: 'Siddha Herbal Hospital Rooftop Clinic',
    city: 'Chennai',
    state: 'Tamil Nadu',
    corridor: 'Southern Health Belt',
    buildingType: 'Ayurvedic & Herbal Centers',
    hives: 4,
    wildflowerAreaSqM: 700,
    honeyHarvestKg: 58.0,
    jarsDonated: 65,
    rainwaterL: 97000,
    x: 73,
    y: 53,
    coordinates: [80.1415, 12.9516],
    addressSnippet: 'Grand Southern Trunk Rd, Chromepet, Chennai 600044',
    coolingImpactC: 4.9,
  },
  {
    id: 'cbe-psg-tech',
    name: 'PSG Tech Campus Western Ghats Lab',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    corridor: 'Avinashi Road Education Belt',
    buildingType: 'Govt Schools & Anganwadis',
    hives: 5,
    wildflowerAreaSqM: 850,
    honeyHarvestKg: 68.0,
    jarsDonated: 75,
    rainwaterL: 66000,
    x: 47,
    y: 66,
    coordinates: [77.0028, 11.0247],
    addressSnippet: 'Peelamedu, Coimbatore 641004',
    coolingImpactC: 4.1,
  },
  {
    id: 'cbe-tidel-park',
    name: 'TIDEL Park Coimbatore Green Wing',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    corridor: 'Coimbatore IT Corridor',
    buildingType: 'IT & Tech Parks',
    hives: 6,
    wildflowerAreaSqM: 1100,
    honeyHarvestKg: 85.0,
    jarsDonated: 95,
    rainwaterL: 85000,
    x: 48,
    y: 67,
    coordinates: [77.0315, 11.0289],
    addressSnippet: 'Civil Aerodrome Post, Coimbatore 641014',
    coolingImpactC: 4.3,
  },
  {
    id: 'cbe-rs-puram',
    name: 'RS Puram Community Herbal Roof',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    corridor: 'Central Residential Hub',
    buildingType: 'Residential RWAs & Apartments',
    hives: 4,
    wildflowerAreaSqM: 620,
    honeyHarvestKg: 46.0,
    jarsDonated: 50,
    rainwaterL: 48000,
    x: 47,
    y: 66,
    coordinates: [76.9515, 11.0112],
    addressSnippet: 'DB Road, RS Puram, Coimbatore 641002',
    coolingImpactC: 3.9,
  },

  // ==========================================
  // KERALA (Kochi & Thiruvananthapuram) - 17 Sites
  // ==========================================
  {
    id: 'koc-infopark',
    name: 'Kakkanad Infopark Bio-Terrace Hub',
    city: 'Kochi',
    state: 'Kerala',
    corridor: 'Infopark Tech Corridor',
    buildingType: 'IT & Tech Parks',
    hives: 7,
    wildflowerAreaSqM: 1480,
    honeyHarvestKg: 95.0,
    jarsDonated: 110,
    rainwaterL: 440000,
    x: 37,
    y: 75,
    coordinates: [76.3570, 10.0104],
    isKeyStory: true,
    storyNote: 'Deployed tiered coir-geotextile mats capturing 3,120 mm annual rainfall.',
    addressSnippet: 'Infopark Expressway, Kakkanad, Kochi 682042',
    coolingImpactC: 4.2,
  },
  {
    id: 'koc-fort-kochi',
    name: 'Fort Kochi Heritage Spice Terrace',
    city: 'Kochi',
    state: 'Kerala',
    corridor: 'Fort Kochi Maritime Strip',
    buildingType: 'Heritage Trusts & Temples',
    hives: 4,
    wildflowerAreaSqM: 580,
    honeyHarvestKg: 46.0,
    jarsDonated: 55,
    rainwaterL: 175000,
    x: 35,
    y: 75,
    coordinates: [76.2435, 9.9658],
    addressSnippet: 'Bazaar Road, Mattancherry, Kochi 682002',
    coolingImpactC: 3.8,
  },
  {
    id: 'koc-marine-drive',
    name: 'Marine Drive Backwater Canopy',
    city: 'Kochi',
    state: 'Kerala',
    corridor: 'Vembanad Estuary Buffer',
    buildingType: 'Residential RWAs & Apartments',
    hives: 5,
    wildflowerAreaSqM: 820,
    honeyHarvestKg: 62.0,
    jarsDonated: 70,
    rainwaterL: 250000,
    x: 36,
    y: 74,
    coordinates: [76.2753, 9.9816],
    addressSnippet: 'Shanmugham Road, Marine Drive, Kochi 682011',
    coolingImpactC: 4.1,
  },
  {
    id: 'koc-ernakulam-govt',
    name: 'Ernakulam Government Higher Secondary',
    city: 'Kochi',
    state: 'Kerala',
    corridor: 'Central Educational Zone',
    buildingType: 'Govt Schools & Anganwadis',
    hives: 3,
    wildflowerAreaSqM: 450,
    honeyHarvestKg: 34.0,
    jarsDonated: 45,
    rainwaterL: 135000,
    x: 37,
    y: 74,
    coordinates: [76.2891, 9.9723],
    addressSnippet: 'Club Road, Ernakulam, Kochi 682011',
    coolingImpactC: 3.9,
  },
  {
    id: 'koc-thrikkakara-ayur',
    name: 'Vaidyaratnam Herbal Wellness Terrace',
    city: 'Kochi',
    state: 'Kerala',
    corridor: 'Ayurvedic Medicine Hub',
    buildingType: 'Ayurvedic & Herbal Centers',
    hives: 5,
    wildflowerAreaSqM: 780,
    honeyHarvestKg: 68.0,
    jarsDonated: 75,
    rainwaterL: 235000,
    x: 38,
    y: 76,
    coordinates: [76.3284, 10.0350],
    addressSnippet: 'Thrikkakara, Kochi 682021',
    coolingImpactC: 4.3,
  },
  {
    id: 'tvm-technopark',
    name: 'Technopark Phase 1 Coastal Reserve',
    city: 'Thiruvananthapuram',
    state: 'Kerala',
    corridor: 'Technopark Tech Belt',
    buildingType: 'IT & Tech Parks',
    hives: 6,
    wildflowerAreaSqM: 1200,
    honeyHarvestKg: 82.0,
    jarsDonated: 90,
    rainwaterL: 215000,
    x: 42,
    y: 90,
    coordinates: [76.8833, 8.5581],
    addressSnippet: 'Kazhakoottam, Thiruvananthapuram 695581',
    coolingImpactC: 3.8,
  },
  {
    id: 'tvm-kowdiar-palace',
    name: 'Kowdiar Heritage Biosphere Hub',
    city: 'Thiruvananthapuram',
    state: 'Kerala',
    corridor: 'State Capital Heritage Ring',
    buildingType: 'Heritage Trusts & Temples',
    hives: 4,
    wildflowerAreaSqM: 650,
    honeyHarvestKg: 48.0,
    jarsDonated: 55,
    rainwaterL: 120000,
    x: 43,
    y: 90,
    coordinates: [76.9634, 8.5241],
    addressSnippet: 'Kowdiar, Thiruvananthapuram 695003',
    coolingImpactC: 3.7,
  },

  // ==========================================
  // ANDHRA PRADESH & TELANGANA - 16 Sites
  // ==========================================
  {
    id: 'vzg-port-bioroof',
    name: 'Vizag Port Administrative Bio-Roof',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    corridor: 'Maritime Harbor Ring',
    buildingType: 'Public Wholesale Market',
    hives: 5,
    wildflowerAreaSqM: 920,
    honeyHarvestKg: 65.0,
    jarsDonated: 70,
    rainwaterL: 105000,
    x: 85,
    y: 32,
    coordinates: [83.2985, 17.6868],
    addressSnippet: 'Port Area, Visakhapatnam 530035',
    coolingImpactC: 4.6,
  },
  {
    id: 'vzg-rushikonda-tech',
    name: 'Rushikonda IT Hills Agro-Canopy',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    corridor: 'Eastern Ghats Coastal Tech Spine',
    buildingType: 'IT & Tech Parks',
    hives: 6,
    wildflowerAreaSqM: 1100,
    honeyHarvestKg: 82.0,
    jarsDonated: 90,
    rainwaterL: 125000,
    x: 86,
    y: 31,
    coordinates: [83.3768, 17.7816],
    addressSnippet: 'Rushikonda IT Park, Visakhapatnam 530045',
    coolingImpactC: 4.7,
  },
  {
    id: 'vzg-andhra-univ',
    name: 'Andhra University Botany Terrace Lab',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    corridor: 'University Academic Green Ring',
    buildingType: 'Govt Schools & Anganwadis',
    hives: 4,
    wildflowerAreaSqM: 680,
    honeyHarvestKg: 50.0,
    jarsDonated: 60,
    rainwaterL: 78000,
    x: 85,
    y: 32,
    coordinates: [83.3236, 17.7288],
    addressSnippet: 'Waltair Uplands, Visakhapatnam 530003',
    coolingImpactC: 4.4,
  },
  {
    id: 'vja-prakasam-sponge',
    name: 'Vijayawada Krishna River Buffer Terrace',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    corridor: 'Krishna River Basin Green Spine',
    buildingType: 'Residential RWAs & Apartments',
    hives: 5,
    wildflowerAreaSqM: 780,
    honeyHarvestKg: 58.0,
    jarsDonated: 65,
    rainwaterL: 82000,
    x: 75,
    y: 42,
    coordinates: [80.6480, 16.5062],
    addressSnippet: 'MG Road, Labbipet, Vijayawada 520010',
    coolingImpactC: 5.1,
  },
  {
    id: 'hyd-hitec-cyber',
    name: 'HITEC City Cyber Towers Agro-Canopy',
    city: 'Hyderabad',
    state: 'Telangana',
    corridor: 'HITEC City Tech District',
    buildingType: 'IT & Tech Parks',
    hives: 7,
    wildflowerAreaSqM: 1650,
    honeyHarvestKg: 135.0,
    jarsDonated: 140,
    rainwaterL: 132000,
    x: 54,
    y: 29,
    coordinates: [78.3813, 17.4504],
    addressSnippet: 'Madhapur, HITEC City, Hyderabad 500081',
    coolingImpactC: 5.7,
  },
  {
    id: 'hyd-gachibowli',
    name: 'Gachibowli Financial District Bio-Shield',
    city: 'Hyderabad',
    state: 'Telangana',
    corridor: 'Financial District Spine',
    buildingType: 'IT & Tech Parks',
    hives: 6,
    wildflowerAreaSqM: 1250,
    honeyHarvestKg: 98.0,
    jarsDonated: 105,
    rainwaterL: 102000,
    x: 53,
    y: 30,
    coordinates: [78.3498, 17.4399],
    addressSnippet: 'Nanakramguda, Gachibowli, Hyderabad 500032',
    coolingImpactC: 5.5,
  },
  {
    id: 'hyd-secunderabad',
    name: 'Secunderabad Civic Trust Green Roof',
    city: 'Hyderabad',
    state: 'Telangana',
    corridor: 'Twin Cities Northern Hub',
    buildingType: 'Heritage Trusts & Temples',
    hives: 4,
    wildflowerAreaSqM: 690,
    honeyHarvestKg: 52.0,
    jarsDonated: 60,
    rainwaterL: 55000,
    x: 55,
    y: 28,
    coordinates: [78.4983, 17.4399],
    addressSnippet: 'MG Road, Secunderabad 500003',
    coolingImpactC: 5.2,
  },
  {
    id: 'hyd-banjara-hills',
    name: 'Banjara Hills RWA Permaculture Terrace',
    city: 'Hyderabad',
    state: 'Telangana',
    corridor: 'Central Residential Hills',
    buildingType: 'Residential RWAs & Apartments',
    hives: 4,
    wildflowerAreaSqM: 780,
    honeyHarvestKg: 62.0,
    jarsDonated: 70,
    rainwaterL: 64000,
    x: 54,
    y: 31,
    coordinates: [78.4482, 17.4156],
    addressSnippet: 'Road No. 12, Banjara Hills, Hyderabad 500034',
    coolingImpactC: 5.4,
  },
];
