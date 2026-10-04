import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Sparkles, TrendingUp, Layers, Flower2, ShieldCheck, Compass } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { POLLINATOR_GROWTH_DATA, PollinatorYearData } from '../data/biodiversityTrendsData';

type ChartViewType = 'area' | 'line' | 'bar';
type MetricType = 'bees' | 'hives' | 'area';

export const BiodiversityGrowthChart: React.FC = () => {
  const { isDark } = useTheme();
  const [viewType, setChartViewType] = useState<ChartViewType>('area');
  const [metricType, setMetricType] = useState<MetricType>('bees');
  const [highlightedState, setHighlightedState] = useState<string>('all');

  // Palette tuned to match the editorial South India aesthetic
  const colors = {
    karnataka: '#10B981', // Emerald green (Deccan Garden)
    tamilNadu: '#F59E0B', // Warm Amber (Madurai / Coromandel gold)
    kerala: '#06B6D4', // Deep cyan / Malabar coastal
    andhraPradesh: '#8B5CF6', // Royal purple (Eastern Ghats & Krishna)
    total: '#059669',
    grid: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(36, 51, 36, 0.08)',
    text: isDark ? '#A3B59E' : '#657351',
  };

  // Custom Rich Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const dataItem = payload[0].payload as PollinatorYearData;

    return (
      <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#1E2D1D]/95 backdrop-blur-md border border-[#243324]/15 dark:border-white/15 shadow-xl space-y-2 text-xs min-w-[220px]">
        <div className="flex items-center justify-between border-b border-[#243324]/10 dark:border-white/10 pb-2">
          <span className="font-display text-base font-medium text-[#1F2B1D] dark:text-[#F4EFE6]">
            Year {label}
          </span>
          <span className="font-semibold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#059669] dark:text-[#34D399]">
            {dataItem.totalBees}M Total Bees
          </span>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#3B4D36] dark:text-[#CBD7C7]">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.karnataka }} />
              Karnataka:
            </span>
            <span className="font-medium text-[#1F2B1D] dark:text-[#F4EFE6]">
              {dataItem.karnatakaBees}M ({Math.round((dataItem.karnatakaBees / dataItem.totalBees) * 100)}%)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#3B4D36] dark:text-[#CBD7C7]">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.tamilNadu }} />
              Tamil Nadu:
            </span>
            <span className="font-medium text-[#1F2B1D] dark:text-[#F4EFE6]">
              {dataItem.tamilNaduBees}M ({Math.round((dataItem.tamilNaduBees / dataItem.totalBees) * 100)}%)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#3B4D36] dark:text-[#CBD7C7]">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.kerala }} />
              Kerala:
            </span>
            <span className="font-medium text-[#1F2B1D] dark:text-[#F4EFE6]">
              {dataItem.keralaBees}M ({Math.round((dataItem.keralaBees / dataItem.totalBees) * 100)}%)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#3B4D36] dark:text-[#CBD7C7]">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.andhraPradesh }} />
              Andhra & Tel.:
            </span>
            <span className="font-medium text-[#1F2B1D] dark:text-[#F4EFE6]">
              {dataItem.andhraPradeshBees}M ({Math.round((dataItem.andhraPradeshBees / dataItem.totalBees) * 100)}%)
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#243324]/10 dark:border-white/10 flex items-center justify-between text-[11px] text-[#657351] dark:text-[#A3B59E]">
          <span>{dataItem.activeHives} Hives across {dataItem.totalSites} Sites</span>
          <span>{dataItem.nativePlantSpecies} Flora Species</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 sm:p-10 rounded-[2.5rem] bg-white dark:bg-[#1E2D1D] border border-[#243324]/10 dark:border-white/12 shadow-lg space-y-8 transition-colors duration-400">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-[#243324]/10 dark:border-white/10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
              Longitudinal Biodiversity Monitoring · 2022–2026
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#10B981]/15 text-[#059669] dark:text-[#34D399]">
              +495% Population Expansion
            </span>
          </div>
          <h3 className="font-display text-2xl sm:text-4xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-tight">
            Pollinator Population Growth Across 4 States
          </h3>
          <p className="text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light max-w-2xl">
            Tracking verified native colonies of harmless stingless bees (*Tetragonula iridipennis*) and Asian honey bees (*Apis cerana indica*) supported by urban rooftop sponge canopies.
          </p>
        </div>

        {/* View and State Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Chart Type Selector */}
          <div className="flex items-center p-1 rounded-2xl bg-[#F5F2EB] dark:bg-[#152214] border border-[#243324]/10 dark:border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setChartViewType('area')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                viewType === 'area'
                  ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                  : 'text-[#4A5D44] dark:text-[#CBD7C7]'
              }`}
            >
              Stacked Area
            </button>
            <button
              type="button"
              onClick={() => setChartViewType('line')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                viewType === 'line'
                  ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                  : 'text-[#4A5D44] dark:text-[#CBD7C7]'
              }`}
            >
              State Lines
            </button>
            <button
              type="button"
              onClick={() => setChartViewType('bar')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                viewType === 'bar'
                  ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                  : 'text-[#4A5D44] dark:text-[#CBD7C7]'
              }`}
            >
              State Bars
            </button>
          </div>
        </div>
      </div>

      {/* State Legend & Interactive Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setHighlightedState('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all border ${
              highlightedState === 'all'
                ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white border-transparent shadow-xs'
                : 'bg-[#FBF9F5] dark:bg-[#152214] text-[#4A5D44] dark:text-[#CBD7C7] border-[#243324]/10 dark:border-white/10'
            }`}
          >
            All 4 States
          </button>

          <button
            type="button"
            onClick={() => setHighlightedState('karnataka')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all border flex items-center gap-1.5 ${
              highlightedState === 'karnataka'
                ? 'bg-[#10B981] text-white border-transparent shadow-xs'
                : 'bg-[#FBF9F5] dark:bg-[#152214] text-[#4A5D44] dark:text-[#CBD7C7] border-[#243324]/10 dark:border-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            Karnataka (4.8M)
          </button>

          <button
            type="button"
            onClick={() => setHighlightedState('tamilNadu')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all border flex items-center gap-1.5 ${
              highlightedState === 'tamilNadu'
                ? 'bg-[#F59E0B] text-white border-transparent shadow-xs'
                : 'bg-[#FBF9F5] dark:bg-[#152214] text-[#4A5D44] dark:text-[#CBD7C7] border-[#243324]/10 dark:border-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            Tamil Nadu (3.6M)
          </button>

          <button
            type="button"
            onClick={() => setHighlightedState('kerala')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all border flex items-center gap-1.5 ${
              highlightedState === 'kerala'
                ? 'bg-[#06B6D4] text-white border-transparent shadow-xs'
                : 'bg-[#FBF9F5] dark:bg-[#152214] text-[#4A5D44] dark:text-[#CBD7C7] border-[#243324]/10 dark:border-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
            Kerala (2.5M)
          </button>

          <button
            type="button"
            onClick={() => setHighlightedState('andhraPradesh')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all border flex items-center gap-1.5 ${
              highlightedState === 'andhraPradesh'
                ? 'bg-[#8B5CF6] text-white border-transparent shadow-xs'
                : 'bg-[#FBF9F5] dark:bg-[#152214] text-[#4A5D44] dark:text-[#CBD7C7] border-[#243324]/10 dark:border-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
            Andhra & Tel. (1.6M)
          </button>
        </div>

        <div className="text-xs text-[#657351] dark:text-[#A3B59E]">
          Total Current: <strong className="text-[#1F2B1D] dark:text-[#F4EFE6]">12.5 Million Bees</strong>
        </div>
      </div>

      {/* Main Dynamic Recharts Canvas */}
      <div className="w-full h-[360px] sm:h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          {viewType === 'area' ? (
            <AreaChart data={POLLINATOR_GROWTH_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="gradKarnataka" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.karnataka} stopOpacity={0.65} />
                  <stop offset="95%" stopColor={colors.karnataka} stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="gradTamilNadu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.tamilNadu} stopOpacity={0.65} />
                  <stop offset="95%" stopColor={colors.tamilNadu} stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="gradKerala" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.kerala} stopOpacity={0.65} />
                  <stop offset="95%" stopColor={colors.kerala} stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="gradAndhra" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.andhraPradesh} stopOpacity={0.65} />
                  <stop offset="95%" stopColor={colors.andhraPradesh} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
              <XAxis dataKey="label" stroke={colors.text} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis
                stroke={colors.text}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}M`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="andhraPradeshBees"
                stackId="1"
                name="Andhra & Tel."
                stroke={colors.andhraPradesh}
                strokeWidth={2}
                fill="url(#gradAndhra)"
                fillOpacity={highlightedState === 'all' || highlightedState === 'andhraPradesh' ? 1 : 0.2}
              />
              <Area
                type="monotone"
                dataKey="keralaBees"
                stackId="1"
                name="Kerala"
                stroke={colors.kerala}
                strokeWidth={2}
                fill="url(#gradKerala)"
                fillOpacity={highlightedState === 'all' || highlightedState === 'kerala' ? 1 : 0.2}
              />
              <Area
                type="monotone"
                dataKey="tamilNaduBees"
                stackId="1"
                name="Tamil Nadu"
                stroke={colors.tamilNadu}
                strokeWidth={2}
                fill="url(#gradTamilNadu)"
                fillOpacity={highlightedState === 'all' || highlightedState === 'tamilNadu' ? 1 : 0.2}
              />
              <Area
                type="monotone"
                dataKey="karnatakaBees"
                stackId="1"
                name="Karnataka"
                stroke={colors.karnataka}
                strokeWidth={2}
                fill="url(#gradKarnataka)"
                fillOpacity={highlightedState === 'all' || highlightedState === 'karnataka' ? 1 : 0.2}
              />
            </AreaChart>
          ) : viewType === 'line' ? (
            <LineChart data={POLLINATOR_GROWTH_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
              <XAxis dataKey="label" stroke={colors.text} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis
                stroke={colors.text}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}M`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="totalBees"
                name="Total South India"
                stroke="#1F2B1D"
                strokeWidth={3}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: '#1F2B1D' }}
              />
              <Line
                type="monotone"
                dataKey="karnatakaBees"
                name="Karnataka"
                stroke={colors.karnataka}
                strokeWidth={highlightedState === 'karnataka' ? 4 : 2.5}
                dot={{ r: 4, fill: colors.karnataka }}
                strokeOpacity={highlightedState === 'all' || highlightedState === 'karnataka' ? 1 : 0.25}
              />
              <Line
                type="monotone"
                dataKey="tamilNaduBees"
                name="Tamil Nadu"
                stroke={colors.tamilNadu}
                strokeWidth={highlightedState === 'tamilNadu' ? 4 : 2.5}
                dot={{ r: 4, fill: colors.tamilNadu }}
                strokeOpacity={highlightedState === 'all' || highlightedState === 'tamilNadu' ? 1 : 0.25}
              />
              <Line
                type="monotone"
                dataKey="keralaBees"
                name="Kerala"
                stroke={colors.kerala}
                strokeWidth={highlightedState === 'kerala' ? 4 : 2.5}
                dot={{ r: 4, fill: colors.kerala }}
                strokeOpacity={highlightedState === 'all' || highlightedState === 'kerala' ? 1 : 0.25}
              />
              <Line
                type="monotone"
                dataKey="andhraPradeshBees"
                name="Andhra & Tel."
                stroke={colors.andhraPradesh}
                strokeWidth={highlightedState === 'andhraPradesh' ? 4 : 2.5}
                dot={{ r: 4, fill: colors.andhraPradesh }}
                strokeOpacity={highlightedState === 'all' || highlightedState === 'andhraPradesh' ? 1 : 0.25}
              />
            </LineChart>
          ) : (
            <BarChart data={POLLINATOR_GROWTH_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
              <XAxis dataKey="label" stroke={colors.text} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis
                stroke={colors.text}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}M`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="karnatakaBees"
                name="Karnataka"
                fill={colors.karnataka}
                radius={[4, 4, 0, 0]}
                fillOpacity={highlightedState === 'all' || highlightedState === 'karnataka' ? 1 : 0.25}
              />
              <Bar
                dataKey="tamilNaduBees"
                name="Tamil Nadu"
                fill={colors.tamilNadu}
                radius={[4, 4, 0, 0]}
                fillOpacity={highlightedState === 'all' || highlightedState === 'tamilNadu' ? 1 : 0.25}
              />
              <Bar
                dataKey="keralaBees"
                name="Kerala"
                fill={colors.kerala}
                radius={[4, 4, 0, 0]}
                fillOpacity={highlightedState === 'all' || highlightedState === 'kerala' ? 1 : 0.25}
              />
              <Bar
                dataKey="andhraPradeshBees"
                name="Andhra & Tel."
                fill={colors.andhraPradesh}
                radius={[4, 4, 0, 0]}
                fillOpacity={highlightedState === 'all' || highlightedState === 'andhraPradesh' ? 1 : 0.25}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* 4 Multi-Metric Bottom Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#243324]/10 dark:border-white/10">
        <div className="space-y-1">
          <span className="text-xs text-[#657351] dark:text-[#A3B59E]">Active Rooftops</span>
          <p className="font-display text-2xl sm:text-3xl text-[#1F2B1D] dark:text-[#F4EFE6]">
            79 Sites
          </p>
          <p className="text-[11px] text-[#059669] dark:text-[#34D399]">↑ from 14 sites in 2022</p>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-[#657351] dark:text-[#A3B59E]">Colony Hives</span>
          <p className="font-display text-2xl sm:text-3xl text-[#1F2B1D] dark:text-[#F4EFE6]">
            274 Apiaries
          </p>
          <p className="text-[11px] text-[#059669] dark:text-[#34D399]">100% stingless & cerana</p>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-[#657351] dark:text-[#A3B59E]">Coir Sponge Canopy</span>
          <p className="font-display text-2xl sm:text-3xl text-[#1F2B1D] dark:text-[#F4EFE6]">
            46,850 m²
          </p>
          <p className="text-[11px] text-[#059669] dark:text-[#34D399]">Lightweight agricultural coir</p>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-[#657351] dark:text-[#A3B59E]">Botanical Diversity</span>
          <p className="font-display text-2xl sm:text-3xl text-[#1F2B1D] dark:text-[#F4EFE6]">
            28.4 Species
          </p>
          <p className="text-[11px] text-[#059669] dark:text-[#34D399]">Average indigenous flora/site</p>
        </div>
      </div>
    </div>
  );
};
