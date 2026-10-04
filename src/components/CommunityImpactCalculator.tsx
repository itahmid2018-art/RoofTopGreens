import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  HeartHandshake,
  Droplets,
  Flower2,
  Sparkles,
  IndianRupee,
  Leaf,
  ThermometerSnowflake,
  ShieldCheck,
  Baby,
} from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import { useTheme } from '../context/ThemeContext';

interface EngagementModel {
  id: string;
  name: string;
  shortDesc: string;
  honeyKgPerPerson: number;
  rainwaterLPerPerson: number;
  spongeAreaSqMPerPerson: number;
  co2OffsetKgPerPerson: number;
  economicSavingsInrPerPerson: number;
  anganwadiMealsPerPerson: number;
}

const ENGAGEMENT_MODELS: EngagementModel[] = [
  {
    id: 'blended',
    name: 'Balanced Community Model',
    shortDesc: 'A mix of active rooftop hosts, balcony stewards, and Anganwadi volunteers.',
    honeyKgPerPerson: 0.48, // kg/year
    rainwaterLPerPerson: 480, // Litres buffered
    spongeAreaSqMPerPerson: 5.2, // m² coir sponge
    co2OffsetKgPerPerson: 36, // kg CO2e
    economicSavingsInrPerPerson: 1650, // ₹ savings
    anganwadiMealsPerPerson: 12, // fortified meal rations
  },
  {
    id: 'rooftop_host',
    name: 'Active Terrace Host',
    shortDesc: 'Apartment RWAs and commercial buildings installing full coir beds and apiary boxes.',
    honeyKgPerPerson: 1.15,
    rainwaterLPerPerson: 1250,
    spongeAreaSqMPerPerson: 14.0,
    co2OffsetKgPerPerson: 88,
    economicSavingsInrPerPerson: 4200,
    anganwadiMealsPerPerson: 30,
  },
  {
    id: 'balcony_steward',
    name: 'Balcony Pollinator Steward',
    shortDesc: 'Urban residents nurturing potted native flora (Tulasi, Moringa) and stingless bee shelters.',
    honeyKgPerPerson: 0.22,
    rainwaterLPerPerson: 180,
    spongeAreaSqMPerPerson: 2.4,
    co2OffsetKgPerPerson: 16,
    economicSavingsInrPerPerson: 750,
    anganwadiMealsPerPerson: 6,
  },
];

const PRESET_PARTICIPANTS = [
  { label: '50 Residents', value: 50, desc: 'Apartment RWA' },
  { label: '250 Stewards', value: 250, desc: 'Neighborhood Ward' },
  { label: '1,000 Citizens', value: 1000, desc: 'Tech Campus / Cluster' },
  { label: '5,000 Collective', value: 5000, desc: 'Zonal Network' },
  { label: '15,000 Movement', value: 15000, desc: 'Metropolitan Scale' },
];

export const CommunityImpactCalculator: React.FC = () => {
  const { isDark } = useTheme();
  const [participants, setParticipants] = useState<number>(1000);
  const [selectedModelId, setSelectedModelId] = useState<string>('blended');

  const activeModel = useMemo(() => {
    return ENGAGEMENT_MODELS.find((m) => m.id === selectedModelId) || ENGAGEMENT_MODELS[0];
  }, [selectedModelId]);

  // Derived Collective Resource Savings Calculations
  const calculatedSavings = useMemo(() => {
    const totalHoneyKg = Math.round(participants * activeModel.honeyKgPerPerson);
    const jarsShared = Math.round(totalHoneyKg * 2.5); // standard 400g medicinal jar
    const rainwaterLitres = Math.round(participants * activeModel.rainwaterLPerPerson);
    const spongeSqM = Math.round(participants * activeModel.spongeAreaSqMPerPerson);
    const co2Kg = Math.round(participants * activeModel.co2OffsetKgPerPerson);
    const economicSavingsInr = Math.round(participants * activeModel.economicSavingsInrPerPerson);
    const mealsFortified = Math.round(participants * activeModel.anganwadiMealsPerPerson);
    const childrenNourished = Math.round(mealsFortified / 18); // ~18 monthly doses per child

    return {
      totalHoneyKg,
      jarsShared,
      rainwaterLitres,
      spongeSqM,
      co2Kg,
      economicSavingsInr,
      mealsFortified,
      childrenNourished,
    };
  }, [participants, activeModel]);

  return (
    <div className="p-6 sm:p-10 rounded-[2.5rem] bg-white dark:bg-[#1E2D1D] border border-[#243324]/10 dark:border-white/12 shadow-lg space-y-8 transition-colors duration-400">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#243324]/10 dark:border-white/10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
              Interactive Resource Estimator
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FCD34D]">
              Community Food Equity
            </span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-tight">
            Community Impact Calculator
          </h3>
          <p className="text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light max-w-2xl">
            Simulate collective resource savings and public health yields when urban residents unite across Karnataka, Tamil Nadu, Kerala, and Andhra Pradesh.
          </p>
        </div>

        {/* Engagement Tier Tabs */}
        <div className="flex flex-wrap items-center p-1 rounded-2xl bg-[#F5F2EB] dark:bg-[#152214] border border-[#243324]/10 dark:border-white/10 text-xs">
          {ENGAGEMENT_MODELS.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => setSelectedModelId(model.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                selectedModelId === model.id
                  ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                  : 'text-[#4A5D44] dark:text-[#CBD7C7]'
              }`}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>

      {/* Participant Controls & Slider */}
      <div className="space-y-4 p-6 rounded-2xl bg-[#FBF9F5] dark:bg-[#162315] border border-[#243324]/10 dark:border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label htmlFor="participant-slider" className="text-xs font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
              Collective Participant Scale
            </label>
            <p className="text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light">
              Slide to scale from a single residential society to a multi-city movement
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="font-display text-3xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light">
              {participants.toLocaleString()}
            </span>
            <span className="text-xs text-[#657351] dark:text-[#A3B59E] uppercase font-semibold">
              Participants
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <input
          id="participant-slider"
          type="range"
          min={25}
          max={20000}
          step={25}
          value={participants}
          onChange={(e) => setParticipants(Number(e.target.value))}
          className="w-full h-2 bg-[#E2ECE0] dark:bg-[#253924] rounded-lg appearance-none cursor-pointer accent-[#10B981]"
        />

        {/* Preset Scale Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          {PRESET_PARTICIPANTS.map((preset) => {
            const isSelected = participants === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => setParticipants(preset.value)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1F2B1D] dark:bg-[#2D452B] text-white border-transparent shadow-xs'
                    : 'bg-white dark:bg-[#1A2819] text-[#1F2B1D] dark:text-[#F4EFE6] border-[#243324]/10 dark:border-white/10 hover:border-[#10B981]/50'
                }`}
              >
                <div className="text-xs font-semibold">{preset.label}</div>
                <div className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-[#657351] dark:text-[#A3B59E]'}`}>
                  {preset.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource Savings & Public Health Impact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Pure Honey Harvested & Shared */}
        <div className="p-6 rounded-2xl bg-[#F5F2EB] dark:bg-[#233522] border border-[#243324]/10 dark:border-white/12 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/20 text-[#B45309] dark:text-[#FCD34D] flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="font-display text-3xl sm:text-4xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light tracking-tight pt-1">
            <AnimatedNumber value={calculatedSavings.totalHoneyKg} /> kg
          </div>
          <p className="text-xs font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">
            Raw Honey Harvested
          </p>
          <p className="text-[11px] text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
            Yields <strong className="font-medium text-[#B45309] dark:text-[#FCD34D]">{calculatedSavings.jarsShared.toLocaleString()} jars</strong> for local Anganwadis and health centers.
          </p>
        </div>

        {/* Metric 2: Monsoon Water Retained */}
        <div className="p-6 rounded-2xl bg-[#F5F2EB] dark:bg-[#233522] border border-[#243324]/10 dark:border-white/12 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#0284C7]/20 text-[#0284C7] dark:text-[#38BDF8] flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          <div className="font-display text-3xl sm:text-4xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light tracking-tight pt-1">
            <AnimatedNumber value={calculatedSavings.rainwaterLitres} /> L
          </div>
          <p className="text-xs font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">
            Monsoon Runoff Buffered
          </p>
          <p className="text-[11px] text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
            Prevents flash flooding into city drains, replenishing shallow aquifers.
          </p>
        </div>

        {/* Metric 3: Living Coir Sponge Canopy */}
        <div className="p-6 rounded-2xl bg-[#F5F2EB] dark:bg-[#233522] border border-[#243324]/10 dark:border-white/12 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#10B981]/20 text-[#059669] dark:text-[#34D399] flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </div>
          <div className="font-display text-3xl sm:text-4xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light tracking-tight pt-1">
            <AnimatedNumber value={calculatedSavings.spongeSqM} /> m²
          </div>
          <p className="text-xs font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">
            Living Botanical Terrace Area
          </p>
          <p className="text-[11px] text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
            Insulates concrete slabs, cutting building air-conditioning heat loads.
          </p>
        </div>

        {/* Metric 4: Children & Anganwadis Supported */}
        <div className="p-6 rounded-2xl bg-[#F5F2EB] dark:bg-[#233522] border border-[#243324]/10 dark:border-white/12 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-[#C4B5FD] flex items-center justify-center">
            <Baby className="w-5 h-5" />
          </div>
          <div className="font-display text-3xl sm:text-4xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light tracking-tight pt-1">
            <AnimatedNumber value={calculatedSavings.childrenNourished} />
          </div>
          <p className="text-xs font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">
            Children Regularly Nourished
          </p>
          <p className="text-[11px] text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
            Supplying immune-boosting bio-active Cheruthen honey directly to Anganwadis.
          </p>
        </div>
      </div>

      {/* Summary Narrative Banner */}
      <div className="p-5 rounded-2xl bg-[#EBF5ED] dark:bg-[#192718] border border-[#10B981]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#10B981]/20 text-[#059669] dark:text-[#34D399] flex items-center justify-center shrink-0">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">
              Collective Economic & Carbon Value: ₹{(calculatedSavings.economicSavingsInr / 100000).toFixed(2)} Lakhs Saved
            </h4>
            <p className="text-[11px] text-[#4A5D44] dark:text-[#CBD7C7] font-light">
              Off-sets {calculatedSavings.co2Kg.toLocaleString()} kg CO₂e while substituting commercial processed syrups with pure medicinal flora honey.
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#253924] border border-[#243324]/10 dark:border-white/10 text-xs font-medium text-[#1F2B1D] dark:text-[#F4EFE6] self-start sm:self-auto shrink-0 shadow-xs">
          {calculatedSavings.mealsFortified.toLocaleString()} Fortified Doses
        </div>
      </div>
    </div>
  );
};
