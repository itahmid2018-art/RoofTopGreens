import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  GraduationCap,
  Store,
  Home,
  Droplets,
  Flower2,
  Sparkles,
  ThermometerSnowflake,
  SlidersHorizontal,
  CloudRain,
  IndianRupee,
  Leaf,
} from 'lucide-react';
import { IMAGES } from '../assets/images';

interface ClimateZoneOption {
  id: string;
  name: string;
  state: string;
  annualRainMm: number;
  monsoonLabel: string;
}

const CLIMATE_ZONES: ClimateZoneOption[] = [
  {
    id: 'kerala-coast',
    name: 'Malabar & Western Ghats (Kochi)',
    state: 'Kerala',
    annualRainMm: 3120,
    monsoonLabel: 'SW Monsoon Deluge (3,120 mm)',
  },
  {
    id: 'tamilnadu-coromandel',
    name: 'Coromandel Coast (Chennai)',
    state: 'Tamil Nadu',
    annualRainMm: 1385,
    monsoonLabel: 'Northeast Cyclonic Peak (1,385 mm)',
  },
  {
    id: 'karnataka-deccan',
    name: 'Deccan Plateau (Bengaluru)',
    state: 'Karnataka',
    annualRainMm: 1040,
    monsoonLabel: 'Bimodal & Thunderstorms (1,040 mm)',
  },
  {
    id: 'telangana-arid',
    name: 'Semi-Arid Deccan (Hyderabad)',
    state: 'Telangana / AP',
    annualRainMm: 820,
    monsoonLabel: 'Granite Heat & Spells (820 mm)',
  },
];

interface ArchetypeConfig {
  id: string;
  name: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  spongeAbsorptionFactor: number;
  baseSpecies: number;
  speciesMultiplier: number;
  honeyPerSqM: number;
  baseCoolingC: number;
  coolingScale: number;
  kwhSavedPerSqM: number;
  highlightInsight: string;
}

const ARCHETYPES: ArchetypeConfig[] = [
  {
    id: 'techpark',
    name: 'IT & Tech Park Campus',
    shortLabel: 'IT & Tech Park',
    icon: Building2,
    description: 'Expansive RCC flat roofs across Whitefield, OMR, and HITEC City with high HVAC cooling loads.',
    spongeAbsorptionFactor: 0.82,
    baseSpecies: 22,
    speciesMultiplier: 0.75,
    honeyPerSqM: 0.175,
    baseCoolingC: 3.4,
    coolingScale: 2.6,
    kwhSavedPerSqM: 28.5,
    highlightInsight: 'Cuts top-floor chiller HVAC energy consumption by ~16% while purifying runoff for campus recharge lakes.',
  },
  {
    id: 'apartment',
    name: 'Residential Apartment Complex',
    shortLabel: 'Gated Community RWA',
    icon: Home,
    description: 'Multi-storey RCC apartment terraces with resident terrace gardening, composting, and rooftop cooling.',
    spongeAbsorptionFactor: 0.78,
    baseSpecies: 24,
    speciesMultiplier: 0.85,
    honeyPerSqM: 0.155,
    baseCoolingC: 3.8,
    coolingScale: 2.4,
    kwhSavedPerSqM: 32.0,
    highlightInsight: 'Thermally insulates top-floor apartments against 42°C summer heat, cutting resident power bills significantly.',
  },
  {
    id: 'school',
    name: 'School & Anganwadi Campus',
    shortLabel: 'Govt School / Anganwadi',
    icon: GraduationCap,
    description: 'Educational terraces featuring harmless stingless bee (Tetragonula) observation hives and Moringa nutrition beds.',
    spongeAbsorptionFactor: 0.75,
    baseSpecies: 26,
    speciesMultiplier: 0.9,
    honeyPerSqM: 0.135,
    baseCoolingC: 3.2,
    coolingScale: 2.2,
    kwhSavedPerSqM: 22.0,
    highlightInsight: 'Enables safe hands-on pollination botany for 400+ students, channeling all harvested honey into mid-day meal nutrition.',
  },
  {
    id: 'ayurvedic',
    name: 'Ayurvedic & Herbal Trust',
    shortLabel: 'Ayurvedic Botanical Hub',
    icon: Leaf,
    description: 'Herbarium terraces cultivating medicinal Tulasi, Brahmi, Vetiver, and harvesting therapeutic Cheruthen honey.',
    spongeAbsorptionFactor: 0.85,
    baseSpecies: 30,
    speciesMultiplier: 0.95,
    honeyPerSqM: 0.19,
    baseCoolingC: 3.6,
    coolingScale: 2.5,
    kwhSavedPerSqM: 26.0,
    highlightInsight: 'Supplies high-potency medicinal stingless bee honey and fresh herbal extracts to community wellness clinics.',
  },
];

export const RooftopCalculator: React.FC = () => {
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>('techpark');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('karnataka-deccan');
  const [areaSqM, setAreaSqM] = useState<number>(450);

  const archetype = ARCHETYPES.find((a) => a.id === selectedArchetypeId) || ARCHETYPES[0];
  const climateZone = CLIMATE_ZONES.find((z) => z.id === selectedZoneId) || CLIMATE_ZONES[2];

  // Dynamic South Indian Calculations
  const areaSqFt = Math.round(areaSqM * 10.7639);
  // Stormwater captured (Litres) = Area (m²) * Annual Rainfall (m) * Sponge Absorption Rate * 1000
  const annualRainfallMeters = climateZone.annualRainMm / 1000;
  const stormwaterLitres = Math.round(areaSqM * annualRainfallMeters * archetype.spongeAbsorptionFactor * 1000);
  
  const nativeSpeciesCount = Math.round(archetype.baseSpecies + Math.sqrt(areaSqM) * archetype.speciesMultiplier);
  const honeyKg = Math.round(areaSqM * archetype.honeyPerSqM * 10) / 10;
  const estimatedBottles = Math.round(honeyKg / 0.5); // 500g bottles
  const coolingCelsius = (archetype.baseCoolingC + (areaSqM / 1000) * archetype.coolingScale).toFixed(1);
  
  // Power & Financial Savings in INR ₹ (Avg tariff ₹8.5/kWh in urban South India)
  const annualKwhSaved = Math.round(areaSqM * archetype.kwhSavedPerSqM);
  const annualInrSaved = Math.round(annualKwhSaved * 8.5);

  // Normalized percentages for visual meters
  const stormwaterPercent = Math.min(100, Math.max(12, (stormwaterLitres / 1200000) * 100));
  const speciesPercent = Math.min(100, Math.max(15, (nativeSpeciesCount / 55) * 100));
  const honeyPercent = Math.min(100, Math.max(12, (honeyKg / 180) * 100));
  const coolingPercent = Math.min(100, Math.max(20, (parseFloat(coolingCelsius) / 6.0) * 100));

  const strataLayers = [
    {
      id: 'thermal-cooling',
      sublabel: 'RCC Slab Thermal Shield',
      metricValue: `-${coolingCelsius}°C`,
      metricDetail: `Saves ~₹${annualInrSaved.toLocaleString('en-IN')} / yr in AC bills (${annualKwhSaved.toLocaleString()} kWh)`,
      icon: ThermometerSnowflake,
      percent: coolingPercent,
      barColor: 'bg-[#10B981]',
      accentColor: 'text-[#85E7B7]',
      bgImage: IMAGES.strataThermalSky,
      imagePosition: 'object-top',
      altText: 'Atmospheric cool breeze across South Indian green rooftop canopy',
    },
    {
      id: 'native-biodiversity',
      sublabel: 'Indigenous Pollinator Canopy',
      metricValue: `${nativeSpeciesCount}`,
      metricUnit: 'native species',
      metricDetail: 'Tulsi, Moringa, Vetiver, Jasmine, Kani Konna & Butterfly Pea',
      icon: Flower2,
      percent: speciesPercent,
      barColor: 'bg-[#84CC16]',
      accentColor: 'text-[#BEF264]',
      bgImage: IMAGES.strataWildflowerCanopy,
      imagePosition: 'object-center',
      altText: 'Vibrant tropical native rooftop flowering garden',
    },
    {
      id: 'community-honey',
      sublabel: 'Cheruthen & Multifloral Harvest',
      metricValue: `${honeyKg.toFixed(1)} kg`,
      metricDetail: `~${estimatedBottles} bottles donated to local Anganwadis & clinics`,
      icon: Sparkles,
      percent: honeyPercent,
      barColor: 'bg-[#F59E0B]',
      accentColor: 'text-[#FDE68A]',
      bgImage: IMAGES.communityHarvest,
      imagePosition: 'object-center',
      altText: 'Fresh raw honey harvest from South Indian rooftop apiary',
    },
    {
      id: 'monsoon-retention',
      sublabel: 'Monsoon Aquifer Recharge',
      metricValue: `${stormwaterLitres.toLocaleString('en-IN')}`,
      metricUnit: 'L / yr',
      metricDetail: `Diverted from city storm drains into recharge wells (${climateZone.annualRainMm} mm rain)`,
      icon: Droplets,
      percent: stormwaterPercent,
      barColor: 'bg-[#0284C7]',
      accentColor: 'text-[#7DD3FC]',
      bgImage: IMAGES.strataSubstrateWater,
      imagePosition: 'object-bottom',
      altText: 'Coconut-coir sponge substrate retaining monsoon cloudbursts',
    },
  ];

  return (
    <div
      id="rooftop-strata-calculator"
      className="mt-16 pt-12 border-t border-[#1F2B1D]/15 dark:border-white/15 space-y-10 transition-colors duration-400"
    >
      {/* Editorial Header */}
      <div className="space-y-3 max-w-3xl">
        <p className="text-sm font-medium tracking-wide text-[#657351] dark:text-[#A3B59E]">
          Interactive Simulator
        </p>
        <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-[1.08] tracking-tight">
          South India Rooftop Ecosystem Calculator
        </h3>
        <p className="text-base sm:text-lg text-[#3B4D36] dark:text-[#CBD7C7] font-light leading-relaxed">
          Select a South Indian building archetype, specify the local IMD monsoon rainfall zone, and scale the RCC terrace area to forecast real-time thermal, water, and community harvest returns.
        </p>
      </div>

      {/* 2-Column Split: Controls on Left, 4 Strata Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* LEFT COLUMN: Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Step 1: Building Archetype Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2B1D] dark:text-[#F4EFE6]">
              1. Select Building Archetype
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {ARCHETYPES.map((arch) => {
                const IconComponent = arch.icon;
                const isSelected = arch.id === selectedArchetypeId;
                return (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => setSelectedArchetypeId(arch.id)}
                    className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-[#1F2B1D] dark:bg-[#253924] text-white border-transparent shadow-md'
                        : 'bg-white dark:bg-[#1A2619] text-[#1F2B1D] dark:text-[#F4EFE6] border-[#243324]/10 dark:border-white/10 hover:border-[#1F2B1D]/30'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSelected
                          ? 'bg-white/15 text-white'
                          : 'bg-[#F5F2EB] dark:bg-[#283C27] text-[#059669] dark:text-[#34D399]'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-display text-base font-normal">{arch.name}</p>
                      <p
                        className={`text-xs line-clamp-2 ${
                          isSelected ? 'text-white/80' : 'text-[#4A5D44] dark:text-[#CBD7C7]'
                        }`}
                      >
                        {arch.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Local IMD Monsoon Climate Zone */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2B1D] dark:text-[#F4EFE6]">
              2. Select Climate & Monsoon Zone
            </label>
            <div className="grid grid-cols-1 gap-2">
              {CLIMATE_ZONES.map((zone) => {
                const isSelected = zone.id === selectedZoneId;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZoneId(zone.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[#059669] text-white border-transparent shadow-xs'
                        : 'bg-white dark:bg-[#1A2619] text-[#243324] dark:text-[#CBD7C7] border-[#243324]/10 dark:border-white/10 hover:border-[#059669]/40'
                    }`}
                  >
                    <span>{zone.name}</span>
                    <span className={`text-[11px] ${isSelected ? 'text-white/90' : 'text-[#657351] dark:text-[#A3B59E]'}`}>
                      {zone.annualRainMm} mm rain
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Terrace Area Slider */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="terrace-area-slider" className="text-xs font-semibold uppercase tracking-wider text-[#1F2B1D] dark:text-[#F4EFE6]">
                3. RCC Terrace Area
              </label>
              <div className="text-right">
                <span className="font-display text-xl sm:text-2xl text-[#1F2B1D] dark:text-[#F4EFE6] font-medium">
                  {areaSqM} m²
                </span>
                <span className="block text-[11px] text-[#657351] dark:text-[#A3B59E]">
                  ~{areaSqFt.toLocaleString('en-IN')} sq ft
                </span>
              </div>
            </div>

            <input
              id="terrace-area-slider"
              aria-label="RCC Terrace Area in square metres"
              type="range"
              min="80"
              max="1500"
              step="20"
              value={areaSqM}
              onChange={(e) => setAreaSqM(Number(e.target.value))}
              className="w-full h-2 bg-[#E8DCC4] dark:bg-[#344E32] rounded-lg appearance-none cursor-pointer accent-[#1F2B1D] dark:accent-[#34D399]"
            />
            <div className="flex justify-between text-[11px] text-[#657351] dark:text-[#A3B59E]">
              <span>80 m² (~860 sq ft)</span>
              <span>750 m² (~8,000 sq ft)</span>
              <span>1,500 m² (~16,000 sq ft)</span>
            </div>
          </div>

          {/* Practical Insight Callout */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#EBF5ED] dark:bg-[#1E2E1D] border border-[#059669]/20 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-[#059669] dark:text-[#34D399]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineered Substrate Advantage:</span>
            </div>
            <p className="text-[#3B4D36] dark:text-[#CBD7C7] font-light leading-relaxed">
              {archetype.highlightInsight}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 Strata Cards */}
        <div className="lg:col-span-7 space-y-4">
          {strataLayers.map((layer) => {
            const Icon = layer.icon;
            return (
              <motion.div
                key={layer.id}
                layout
                className="relative overflow-hidden rounded-[2rem] border border-[#243324]/10 dark:border-white/12 bg-[#1F2B1D] shadow-lg"
              >
                {/* Visual Background Photo */}
                <img
                  src={layer.bgImage}
                  alt={layer.altText}
                  referrerPolicy="no-referrer"
                  className={`absolute inset-0 w-full h-full object-cover ${layer.imagePosition} opacity-35 filter brightness-75`}
                />
                {/* Dark Gradient Overlay for Pristine Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#131D12]/95 via-[#131D12]/80 to-[#131D12]/60 pointer-events-none" />

                {/* Content Overlay */}
                <div className="relative z-10 p-6 sm:p-7 space-y-3 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white/10 text-white">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                        {layer.sublabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-white">
                        {layer.metricValue}
                      </span>
                      {layer.metricUnit && (
                        <span className="text-sm text-white/70">{layer.metricUnit}</span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-white/90 font-light">
                      {layer.metricDetail}
                    </p>
                  </div>

                  {/* Meter Progress Bar */}
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mt-2">
                    <motion.div
                      className={`h-full ${layer.barColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${layer.percent}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
