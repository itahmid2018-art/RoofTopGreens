import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { CloudRain, Droplets, Info, Sparkles, Filter } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { REPORT_METADATA } from '../data/reportData';
import { IMD_RAINFALL_TRENDS, IMD_LPA_NORMALS, RainfallTrendYearData } from '../data/biodiversityTrendsData';
import { EcoAlertTicker } from './EcoAlertTicker';
import { IMAGES } from '../assets/images';

export const StormwaterClimateSection: React.FC = () => {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStateLine, setActiveStateLine] = useState<string>('all');
  const [showNormalLines, setShowNormalLines] = useState<boolean>(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['-22%', '0%'], { clamp: true });

  // Color tokens matching the editorial palette
  const stateColors = {
    kerala: '#06B6D4', // Deep cyan (Malabar Monsoon)
    tamilNadu: '#F59E0B', // Warm amber (Coromandel Northeast Monsoon)
    karnataka: '#10B981', // Emerald green (Deccan Plateau & Ghats)
    andhraPradesh: '#8B5CF6', // Purple (Eastern Ghats & Coastal AP)
    grid: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(36, 51, 36, 0.08)',
    text: isDark ? '#A3B59E' : '#657351',
  };

  // Custom branded Tooltip
  const RainfallCustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const yearItem = payload[0].payload as RainfallTrendYearData;

    return (
      <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#1E2D1D]/95 backdrop-blur-md border border-[#243324]/15 dark:border-white/15 shadow-xl space-y-2.5 text-xs min-w-[260px]">
        <div className="flex items-center justify-between border-b border-[#243324]/10 dark:border-white/10 pb-2">
          <span className="font-display text-base font-medium text-[#1F2B1D] dark:text-[#F4EFE6]">
            Monsoon Season {label}
          </span>
          <span className="font-semibold px-2 py-0.5 rounded-full bg-[#0284C7]/15 text-[#0284C7] dark:text-[#38BDF8]">
            {(yearItem.spongeBufferVolumeL / 1000000).toFixed(2)}M L Buffered
          </span>
        </div>

        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#3B4D36] dark:text-[#CBD7C7]">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stateColors.kerala }} />
              Kerala (Malabar):
            </span>
            <span className="font-medium text-[#1F2B1D] dark:text-[#F4EFE6]">
              {yearItem.keralaMm.toLocaleString()} mm
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#3B4D36] dark:text-[#CBD7C7]">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stateColors.tamilNadu }} />
              Tamil Nadu (Coromandel):
            </span>
            <span className="font-medium text-[#1F2B1D] dark:text-[#F4EFE6]">
              {yearItem.tamilNaduMm.toLocaleString()} mm
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#3B4D36] dark:text-[#CBD7C7]">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stateColors.karnataka }} />
              Karnataka (Deccan/Ghats):
            </span>
            <span className="font-medium text-[#1F2B1D] dark:text-[#F4EFE6]">
              {yearItem.karnatakaMm.toLocaleString()} mm
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#3B4D36] dark:text-[#CBD7C7]">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stateColors.andhraPradesh }} />
              Andhra Pradesh:
            </span>
            <span className="font-medium text-[#1F2B1D] dark:text-[#F4EFE6]">
              {yearItem.andhraPradeshMm.toLocaleString()} mm
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#243324]/10 dark:border-white/10 text-[11px] text-[#4A5D44] dark:text-[#CBD7C7] leading-relaxed">
          <span className="font-semibold text-[#0284C7] dark:text-[#38BDF8]">IMD Event: </span>
          {yearItem.keyWeatherEvent}
        </div>
      </div>
    );
  };

  return (
    <section
      ref={containerRef}
      id="climate-resilience-section"
      className="relative min-h-screen py-24 px-4 sm:px-8 lg:px-12 flex flex-col justify-center border-t border-[#243324]/10 dark:border-white/10 bg-[#FBF9F5] dark:bg-[#131D12] text-[#243324] dark:text-[#F4EFE6] transition-colors duration-400"
    >
      <div className="max-w-6xl mx-auto w-full space-y-12 sm:space-y-16">
        {/* Eco-Alert Real-Time Monsoon Status Ticker Widget */}
        <EcoAlertTicker />

        {/* Section Headline */}
        <div className="space-y-4 max-w-4xl">
          <p className="text-sm font-medium tracking-wide text-[#657351] dark:text-[#A3B59E]">
            Monsoon Dynamics & Heat Mitigation
          </p>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-[1.02] tracking-tight">
            Monsoon sponge terraces absorb cloudbursts before they flood city streets.
          </h2>
          <p className="text-lg sm:text-xl text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
            By engineering lightweight coconut-coir substrate and deep-rooted native flora over bare RCC concrete slabs, our 79 sanctuaries act as natural rain reservoirs, recharge groundwater aquifers, and cool building interiors during brutal 42°C summer heatwaves.
          </p>
        </div>

        {/* Visual & Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual Image with Parallax Scroll */}
          <div className="lg:col-span-7 h-[420px] sm:h-[500px] rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-lg relative bg-[#1F2B1D]">
            <motion.img
              style={{ y: imageY }}
              src={IMAGES.rooftopHaven}
              alt="Engineered South Indian rooftop sponge garden with coir-pith beds and native pollinator flora"
              referrerPolicy="no-referrer"
              className="absolute top-0 left-0 w-full h-[135%] object-cover object-center max-w-none will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F2B1D]/85 via-transparent to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-8 left-8 right-8 text-white z-20">
              <p className="font-display text-2xl sm:text-3xl font-light">
                Lowering RCC concrete slab thermal gain by up to 5.4°C during peak Deccan & coastal heatwaves.
              </p>
            </div>
          </div>

          {/* Key Metric Highlights */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="p-8 sm:p-10 rounded-[2.5rem] bg-[#F5F2EB] dark:bg-[#233522] border border-[#243324]/10 dark:border-white/12 shadow-sm space-y-3 transition-colors duration-400"
            >
              <div className="font-display text-5xl sm:text-6xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light tracking-tight">
                {(REPORT_METADATA.stormwaterLitres / 1000000).toFixed(2)}M L
              </div>
              <p className="text-base text-[#1F2B1D] dark:text-[#F4EFE6] font-medium">Monsoon Deluge Retained & Recharged</p>
              <p className="text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
                Slowly filtered through vetiver and coir root zones, mitigating flash surges into Bengaluru’s Raja-kaluves and Chennai’s Adyar basin.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="p-8 sm:p-10 rounded-[2.5rem] bg-[#F5F2EB] dark:bg-[#233522] border border-[#243324]/10 dark:border-white/12 shadow-sm space-y-3 transition-colors duration-400"
            >
              <div className="font-display text-5xl sm:text-6xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light tracking-tight">
                {REPORT_METADATA.speciesPerSite}
              </div>
              <p className="text-base text-[#1F2B1D] dark:text-[#F4EFE6] font-medium">Native Flora Species Per Roof</p>
              <p className="text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
                Tulasi, Murungai (Moringa), Vetiver (Ramacham), Butterfly Pea, Kani Konna, and Madurai Malli providing perennial nectar across seasonal shifts.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Recharts 5-Year Rainfall Trends Line Graph */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="p-6 sm:p-10 rounded-[2.5rem] bg-white dark:bg-[#1E2D1D] border border-[#243324]/10 dark:border-white/12 shadow-lg space-y-6 transition-colors duration-400"
        >
          {/* Card Header & Meteorological Narrative */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#243324]/10 dark:border-white/10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
                  India Meteorological Department (IMD) Telemetry
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0284C7]/15 text-[#0284C7] dark:text-[#38BDF8]">
                  5-Year Rainfall Trends (2022–2026)
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-tight">
                Contrasting Monsoon Basins Across South India
              </h3>
              <p className="text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light max-w-3xl">
                Comparing Kerala’s heavy Southwest Monsoon downpours with Tamil Nadu’s Northeast cyclonic deluges, and the semi-arid rainfall patterns of the Deccan Plateau in Karnataka and Andhra Pradesh.
              </p>
            </div>

            {/* Reference Line Toggle */}
            <div className="flex items-center gap-2 self-start lg:self-center">
              <button
                type="button"
                onClick={() => setShowNormalLines(!showNormalLines)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  showNormalLines
                    ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white border-transparent shadow-xs'
                    : 'bg-[#F5F2EB] dark:bg-[#152214] text-[#4A5D44] dark:text-[#CBD7C7] border-[#243324]/10 dark:border-white/10'
                }`}
              >
                {showNormalLines ? '✓ IMD LPA Normals' : 'Show IMD Normals'}
              </button>
            </div>
          </div>

          {/* Interactive State Toggle Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveStateLine('all')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all border ${
                  activeStateLine === 'all'
                    ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white border-transparent shadow-xs'
                    : 'bg-[#FBF9F5] dark:bg-[#152214] text-[#4A5D44] dark:text-[#CBD7C7] border-[#243324]/10 dark:border-white/10'
                }`}
              >
                All 4 States
              </button>

              <button
                type="button"
                onClick={() => setActiveStateLine('kerala')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all border flex items-center gap-1.5 ${
                  activeStateLine === 'kerala'
                    ? 'bg-[#06B6D4] text-white border-transparent shadow-xs'
                    : 'bg-[#FBF9F5] dark:bg-[#152214] text-[#4A5D44] dark:text-[#CBD7C7] border-[#243324]/10 dark:border-white/10'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
                Kerala (3,120 mm)
              </button>

              <button
                type="button"
                onClick={() => setActiveStateLine('tamilNadu')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all border flex items-center gap-1.5 ${
                  activeStateLine === 'tamilNadu'
                    ? 'bg-[#F59E0B] text-white border-transparent shadow-xs'
                    : 'bg-[#FBF9F5] dark:bg-[#152214] text-[#4A5D44] dark:text-[#CBD7C7] border-[#243324]/10 dark:border-white/10'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                Tamil Nadu (1,385 mm)
              </button>

              <button
                type="button"
                onClick={() => setActiveStateLine('karnataka')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all border flex items-center gap-1.5 ${
                  activeStateLine === 'karnataka'
                    ? 'bg-[#10B981] text-white border-transparent shadow-xs'
                    : 'bg-[#FBF9F5] dark:bg-[#152214] text-[#4A5D44] dark:text-[#CBD7C7] border-[#243324]/10 dark:border-white/10'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                Karnataka (1,040 mm)
              </button>

              <button
                type="button"
                onClick={() => setActiveStateLine('andhraPradesh')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all border flex items-center gap-1.5 ${
                  activeStateLine === 'andhraPradesh'
                    ? 'bg-[#8B5CF6] text-white border-transparent shadow-xs'
                    : 'bg-[#FBF9F5] dark:bg-[#152214] text-[#4A5D44] dark:text-[#CBD7C7] border-[#243324]/10 dark:border-white/10'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                Andhra Pradesh (980 mm)
              </button>
            </div>

            <div className="text-xs text-[#657351] dark:text-[#A3B59E]">
              Peak Storm Buffer: <strong className="text-[#1F2B1D] dark:text-[#F4EFE6]">3.84M Litres / Year</strong>
            </div>
          </div>

          {/* Recharts Line Canvas */}
          <div className="w-full h-[320px] sm:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={IMD_RAINFALL_TRENDS} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={stateColors.grid} vertical={false} />
                <XAxis dataKey="label" stroke={stateColors.text} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis
                  stroke={stateColors.text}
                  tickLine={false}
                  axisLine={false}
                  domain={[600, 3600]}
                  tickFormatter={(v) => `${v}mm`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<RainfallCustomTooltip />} />

                {/* IMD Long Period Average Reference Lines */}
                {showNormalLines && (
                  <>
                    <ReferenceLine
                      y={IMD_LPA_NORMALS.kerala}
                      stroke={stateColors.kerala}
                      strokeDasharray="4 4"
                      strokeOpacity={0.4}
                      label={{ value: 'Kerala Normal (2,950 mm)', position: 'insideTopLeft', fill: stateColors.kerala, fontSize: 10 }}
                    />
                    <ReferenceLine
                      y={IMD_LPA_NORMALS.tamilNadu}
                      stroke={stateColors.tamilNadu}
                      strokeDasharray="4 4"
                      strokeOpacity={0.4}
                      label={{ value: 'TN Normal (998 mm)', position: 'insideBottomLeft', fill: stateColors.tamilNadu, fontSize: 10 }}
                    />
                  </>
                )}

                {/* State Trend Lines */}
                <Line
                  type="monotone"
                  dataKey="keralaMm"
                  name="Kerala"
                  stroke={stateColors.kerala}
                  strokeWidth={activeStateLine === 'kerala' ? 4 : 2.8}
                  dot={{ r: 4.5, fill: stateColors.kerala }}
                  activeDot={{ r: 7, stroke: '#FFFFFF', strokeWidth: 2 }}
                  strokeOpacity={activeStateLine === 'all' || activeStateLine === 'kerala' ? 1 : 0.2}
                />
                <Line
                  type="monotone"
                  dataKey="tamilNaduMm"
                  name="Tamil Nadu"
                  stroke={stateColors.tamilNadu}
                  strokeWidth={activeStateLine === 'tamilNadu' ? 4 : 2.8}
                  dot={{ r: 4.5, fill: stateColors.tamilNadu }}
                  activeDot={{ r: 7, stroke: '#FFFFFF', strokeWidth: 2 }}
                  strokeOpacity={activeStateLine === 'all' || activeStateLine === 'tamilNadu' ? 1 : 0.2}
                />
                <Line
                  type="monotone"
                  dataKey="karnatakaMm"
                  name="Karnataka"
                  stroke={stateColors.karnataka}
                  strokeWidth={activeStateLine === 'karnataka' ? 4 : 2.8}
                  dot={{ r: 4.5, fill: stateColors.karnataka }}
                  activeDot={{ r: 7, stroke: '#FFFFFF', strokeWidth: 2 }}
                  strokeOpacity={activeStateLine === 'all' || activeStateLine === 'karnataka' ? 1 : 0.2}
                />
                <Line
                  type="monotone"
                  dataKey="andhraPradeshMm"
                  name="Andhra Pradesh"
                  stroke={stateColors.andhraPradesh}
                  strokeWidth={activeStateLine === 'andhraPradesh' ? 4 : 2.8}
                  dot={{ r: 4.5, fill: stateColors.andhraPradesh }}
                  activeDot={{ r: 7, stroke: '#FFFFFF', strokeWidth: 2 }}
                  strokeOpacity={activeStateLine === 'all' || activeStateLine === 'andhraPradesh' ? 1 : 0.2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Meteorological Narrative Callout Footer */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#EBF5ED] dark:bg-[#182618] border border-[#059669]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-[#0284C7] shrink-0" />
              <span className="text-[#3B4D36] dark:text-[#CBD7C7] font-light leading-relaxed">
                <strong className="font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">IMD Climate Analysis: </strong>
                High inter-annual variability (e.g. Cyclone Michaung in 2023 vs El Niño drought) highlights the necessity of localized coir-pith rooftop retention to prevent urban runoff surges.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
