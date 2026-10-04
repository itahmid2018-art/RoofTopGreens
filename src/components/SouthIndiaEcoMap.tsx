import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Droplets, Thermometer, Wind, CloudRain, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import {
  SOUTH_INDIA_STATES,
  URBAN_HUBS,
  WESTERN_GHATS_RIDGE,
  MAJOR_RIVERS,
  SURROUNDING_WATER_BODIES,
  ALL_ROOFTOP_SITES,
  MAP_DIMENSIONS,
  RegionGeoData,
  UrbanHubPoint,
} from '../data/southIndiaMapData';
import { RooftopSite } from '../types';

interface SouthIndiaEcoMapProps {
  selectedBoroughName?: string | null;
  onSelectBorough?: (boroughName: string | null) => void;
  onHoverBorough?: (boroughName: string | null) => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const SouthIndiaEcoMap: React.FC<SouthIndiaEcoMapProps> = ({
  selectedBoroughName,
  onSelectBorough,
  onHoverBorough,
  zoomLevel,
}) => {
  const { isDark } = useTheme();
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [selectedHub, setSelectedHub] = useState<UrbanHubPoint | null>(null);
  const [selectedSite, setSelectedSite] = useState<RooftopSite | null>(null);
  const [hoveredSite, setHoveredSite] = useState<RooftopSite | null>(null);
  const [activeFilterState, setActiveFilterState] = useState<string>('all');

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Sync with prop if controlled
  useEffect(() => {
    if (!selectedBoroughName) {
      setSelectedStateId(null);
      setSelectedHub(null);
      return;
    }

    const stateMatch = SOUTH_INDIA_STATES.find(
      (s) =>
        s.name.toLowerCase() === selectedBoroughName.toLowerCase() ||
        selectedBoroughName.toLowerCase().includes(s.name.toLowerCase())
    );

    const hubMatch = URBAN_HUBS.find(
      (h) =>
        h.name.toLowerCase() === selectedBoroughName.toLowerCase() ||
        selectedBoroughName.toLowerCase().includes(h.name.toLowerCase())
    );

    if (hubMatch) {
      setSelectedHub(hubMatch);
      setSelectedStateId(null);
    } else if (stateMatch) {
      setSelectedStateId(stateMatch.id);
      setSelectedHub(null);
    }
  }, [selectedBoroughName]);

  // Filter sites based on state/city selection
  const filteredSites = useMemo(() => {
    return ALL_ROOFTOP_SITES.filter((site) => {
      if (selectedHub) {
        return site.city.toLowerCase() === selectedHub.name.toLowerCase();
      }
      if (activeFilterState !== 'all') {
        return site.state.toLowerCase().includes(activeFilterState.toLowerCase());
      }
      if (selectedStateId) {
        const selected = SOUTH_INDIA_STATES.find((s) => s.id === selectedStateId);
        if (!selected) return true;
        return site.state.toLowerCase().includes(selected.name.toLowerCase());
      }
      return true;
    });
  }, [selectedHub, selectedStateId, activeFilterState]);

  const handleStateClick = (stateItem: RegionGeoData) => {
    if (selectedStateId === stateItem.id) {
      setSelectedStateId(null);
      setSelectedSite(null);
      onSelectBorough?.(null);
    } else {
      setSelectedStateId(stateItem.id);
      setSelectedHub(null);
      setSelectedSite(null);
      onSelectBorough?.(stateItem.name);
    }
  };

  const handleHubClick = (hub: UrbanHubPoint) => {
    if (selectedHub?.id === hub.id) {
      setSelectedHub(null);
      onSelectBorough?.(null);
    } else {
      setSelectedHub(hub);
      setSelectedStateId(null);
      setSelectedSite(null);
      onSelectBorough?.(hub.name);
    }
  };

  const activeRegion = SOUTH_INDIA_STATES.find((s) => s.id === (selectedStateId || hoveredStateId));

  return (
    <div
      ref={mapContainerRef}
      className="relative w-full h-[600px] sm:h-[680px] lg:h-[750px] rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden border border-[#243324]/10 dark:border-white/12 bg-[#F2EDE4] dark:bg-[#121B11] shadow-2xl transition-all duration-400 select-none flex flex-col justify-between"
    >
      {/* Top Filter Strip */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex flex-wrap items-center gap-2 max-w-[85%]">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/80 dark:bg-[#1A2619]/90 backdrop-blur-md border border-[#243324]/10 dark:border-white/10 shadow-sm text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveFilterState('all');
              setSelectedStateId(null);
              setSelectedHub(null);
              onSelectBorough?.(null);
            }}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeFilterState === 'all' && !selectedHub
                ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                : 'text-[#4A5D44] dark:text-[#CBD7C7] hover:text-[#1F2B1D]'
            }`}
          >
            All South India ({ALL_ROOFTOP_SITES.length} Sites)
          </button>
          {SOUTH_INDIA_STATES.map((state) => {
            const isActive = activeFilterState === state.id || selectedStateId === state.id;
            return (
              <button
                key={state.id}
                type="button"
                onClick={() => {
                  setActiveFilterState(state.id);
                  setSelectedStateId(state.id);
                  setSelectedHub(null);
                  onSelectBorough?.(state.name);
                }}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all hidden sm:inline-block ${
                  isActive
                    ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                    : 'text-[#4A5D44] dark:text-[#CBD7C7] hover:text-[#1F2B1D]'
                }`}
              >
                {state.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating IMD Meteorological Badge */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 hidden md:flex flex-col items-end gap-1.5 text-right pointer-events-none">
        <div className="px-3 py-2 rounded-2xl bg-white/85 dark:bg-[#1B291A]/90 backdrop-blur-md border border-[#243324]/10 dark:border-white/10 shadow-sm text-xs space-y-0.5">
          <div className="flex items-center gap-1.5 text-[#1F2B1D] dark:text-[#F4EFE6] font-semibold">
            <CloudRain className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>IMD Meteorological Network 2026</span>
          </div>
          <p className="text-[11px] text-[#657351] dark:text-[#A3B59E]">
            Real-time Monsoon & Microclimate Telemetry
          </p>
        </div>
      </div>

      {/* Map SVG Canvas */}
      <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
        <motion.svg
          viewBox={MAP_DIMENSIONS.viewBox}
          className="w-full h-full max-h-full object-contain cursor-grab active:cursor-grabbing"
          animate={{ scale: zoomLevel }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <defs>
            {/* Soft Ocean Water Pattern */}
            <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2EBE5" stopOpacity={isDark ? '0.08' : '0.45'} />
              <stop offset="100%" stopColor="#D5E3DB" stopOpacity={isDark ? '0.14' : '0.6'} />
            </linearGradient>

            {/* State Gradient */}
            <linearGradient id="karnatakaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#253B23' : '#E8EFE5'} />
              <stop offset="100%" stopColor={isDark ? '#1C2E1A' : '#D6E2D2'} />
            </linearGradient>
            <linearGradient id="tamilNaduGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#2B4228' : '#DFE9DC'} />
              <stop offset="100%" stopColor={isDark ? '#20331E' : '#CCDBC9'} />
            </linearGradient>
            <linearGradient id="keralaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#1F371C' : '#E2EFE0'} />
              <stop offset="100%" stopColor={isDark ? '#172B15' : '#D1E6CE'} />
            </linearGradient>
            <linearGradient id="andhraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#2D442A' : '#E6EDE3'} />
              <stop offset="100%" stopColor={isDark ? '#223620' : '#D5E0D1'} />
            </linearGradient>

            {/* Glow Filter for Hive Pins */}
            <filter id="hiveGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#F59E0B" floodOpacity="0.6" />
            </filter>
            <filter id="hubGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#10B981" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Sea Backgrounds */}
          <rect x="0" y="0" width="800" height="860" fill="url(#seaGradient)" />

          {/* Ocean Labels */}
          {SURROUNDING_WATER_BODIES.map((sea) => (
            <g key={sea.name} className="pointer-events-none select-none opacity-40 dark:opacity-30">
              <text
                x={sea.x}
                y={sea.y}
                textAnchor="middle"
                className="text-[14px] font-semibold tracking-[0.25em] fill-[#3B5438] dark:fill-[#94A992]"
              >
                {sea.name}
              </text>
              <text
                x={sea.x}
                y={sea.y + 16}
                textAnchor="middle"
                className="text-[10px] tracking-widest fill-[#5A7456] dark:fill-[#7B9179]"
              >
                {sea.sub}
              </text>
            </g>
          ))}

          {/* South India States Geo Paths */}
          <g id="states-group">
            {SOUTH_INDIA_STATES.map((state) => {
              const isSelected = selectedStateId === state.id;
              const isHovered = hoveredStateId === state.id;

              return (
                <motion.path
                  key={state.id}
                  d={state.svgPath}
                  stroke={isDark ? '#3D563A' : '#A4BA9E'}
                  strokeWidth={isSelected ? 2.5 : 1.2}
                  strokeDasharray={isSelected ? 'none' : 'none'}
                  fill={
                    state.id === 'karnataka'
                      ? 'url(#karnatakaGrad)'
                      : state.id === 'tamil-nadu'
                      ? 'url(#tamilNaduGrad)'
                      : state.id === 'kerala'
                      ? 'url(#keralaGrad)'
                      : 'url(#andhraGrad)'
                  }
                  className="cursor-pointer transition-all duration-300"
                  animate={{
                    fillOpacity: isSelected ? 1 : isHovered ? 0.95 : 0.85,
                  }}
                  onClick={() => handleStateClick(state)}
                  onMouseEnter={() => {
                    setHoveredStateId(state.id);
                    onHoverBorough?.(state.name);
                  }}
                  onMouseLeave={() => {
                    setHoveredStateId(null);
                    onHoverBorough?.(null);
                  }}
                />
              );
            })}
          </g>

          {/* Western Ghats Mountain Spine */}
          <g className="pointer-events-none opacity-60 dark:opacity-50">
            <path
              d={WESTERN_GHATS_RIDGE}
              fill="none"
              stroke={isDark ? '#4ADE80' : '#2E7D32'}
              strokeWidth="4"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />
            <text
              x="290"
              y="380"
              transform="rotate(78 290 380)"
              className="text-[10px] tracking-[0.2em] font-semibold fill-[#2E7D32] dark:fill-[#4ADE80]"
            >
              WESTERN GHATS BIODIVERSITY SPINE
            </text>
          </g>

          {/* Major South Indian Rivers */}
          <g id="rivers-group" className="pointer-events-none">
            {MAJOR_RIVERS.map((river) => (
              <g key={river.name}>
                <path
                  d={river.path}
                  fill="none"
                  stroke={river.color}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeOpacity={isDark ? 0.8 : 0.7}
                />
              </g>
            ))}
          </g>

          {/* State Text Labels */}
          {SOUTH_INDIA_STATES.map((state) => (
            <g
              key={`label-${state.id}`}
              className="pointer-events-none"
              transform={`translate(${state.labelPos.x}, ${state.labelPos.y})`}
            >
              <text
                textAnchor="middle"
                className="text-[14px] font-bold tracking-wider fill-[#1F2B1D] dark:fill-[#F4EFE6] drop-shadow-sm"
              >
                {state.name.toUpperCase()}
              </text>
              <text
                y="14"
                textAnchor="middle"
                className="text-[10px] font-medium fill-[#536E4F] dark:fill-[#A8BFA4]"
              >
                {state.hives} Hives · {state.imdRainfallMm} mm Rain
              </text>
            </g>
          ))}

          {/* Urban Hub Nodes (Bengaluru, Chennai, Kochi, Hyderabad, etc.) */}
          <g id="urban-hubs-group">
            {URBAN_HUBS.map((hub) => {
              const isSelected = selectedHub?.id === hub.id;
              return (
                <g
                  key={hub.id}
                  transform={`translate(${hub.x}, ${hub.y})`}
                  className="cursor-pointer group"
                  onClick={() => handleHubClick(hub)}
                >
                  {/* Outer Pulsing Ring */}
                  <circle
                    r={isSelected ? 16 : 10}
                    className={`transition-all duration-300 ${
                      isSelected
                        ? 'fill-[#10B981]/25 stroke-[#10B981] stroke-[2]'
                        : 'fill-[#10B981]/15 group-hover:fill-[#10B981]/30 stroke-transparent'
                    }`}
                  />
                  {/* Center Dot */}
                  <circle
                    r={isSelected ? 6 : 4.5}
                    className="fill-[#059669] dark:fill-[#34D399]"
                    filter="url(#hubGlow)"
                  />
                  {/* City Label */}
                  <text
                    x="10"
                    y="4"
                    className="text-[11px] font-bold fill-[#1F2B1D] dark:fill-white drop-shadow-sm select-none"
                  >
                    {hub.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Rooftop Sites Markers */}
          <g id="rooftop-sites-group">
            {filteredSites.map((site) => {
              // Convert x, y percentage coordinates (0-100) into SVG coordinates (0-800, 0-860)
              const posX = (site.x / 100) * 800;
              const posY = (site.y / 100) * 860;
              const isSelected = selectedSite?.id === site.id;
              const isHovered = hoveredSite?.id === site.id;

              return (
                <g
                  key={site.id}
                  transform={`translate(${posX}, ${posY})`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSite(site);
                  }}
                  onMouseEnter={() => setHoveredSite(site)}
                  onMouseLeave={() => setHoveredSite(null)}
                >
                  {/* Glow circle */}
                  <circle
                    r={site.isKeyStory ? (isSelected ? 12 : 8) : isSelected ? 9 : 5.5}
                    className={`transition-all duration-200 ${
                      isSelected
                        ? 'fill-[#F59E0B] stroke-white stroke-[2]'
                        : isHovered
                        ? 'fill-[#FBBF24] stroke-white stroke-[1.5]'
                        : site.isKeyStory
                        ? 'fill-[#EAB308] stroke-[#78350F] stroke-[1]'
                        : 'fill-[#D97706] stroke-white/80 stroke-[0.8]'
                    }`}
                    filter={isSelected || isHovered ? 'url(#hiveGlow)' : undefined}
                  />

                  {/* Tiny center icon for key stories */}
                  {site.isKeyStory && (
                    <circle r="2.2" className="fill-white pointer-events-none" />
                  )}
                </g>
              );
            })}
          </g>
        </motion.svg>
      </div>

      {/* Hover Site Tooltip */}
      <AnimatePresence>
        {hoveredSite && !selectedSite && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-20 left-6 sm:left-10 z-30 pointer-events-none max-w-sm p-4 rounded-2xl bg-white/95 dark:bg-[#1B291A]/95 backdrop-blur-md border border-[#243324]/10 dark:border-white/12 shadow-xl space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
                {hoveredSite.city} · {hoveredSite.state}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#B45309] dark:text-[#FCD34D]">
                {hoveredSite.hives} Hives
              </span>
            </div>
            <h4 className="font-display text-base font-medium text-[#1F2B1D] dark:text-[#F4EFE6] leading-tight">
              {hoveredSite.name}
            </h4>
            <p className="text-xs text-[#4A5D44] dark:text-[#CBD7C7] line-clamp-2">
              {hoveredSite.buildingType} · {hoveredSite.wildflowerAreaSqM.toLocaleString()} m² coir sponge bed
            </p>
            {hoveredSite.storyNote && (
              <p className="text-[11px] text-[#059669] dark:text-[#34D399] font-medium pt-0.5">
                ★ {hoveredSite.storyNote}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Site Detail Modal / Card */}
      <AnimatePresence>
        {selectedSite && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 p-6 rounded-[2rem] bg-white/95 dark:bg-[#1E2D1D]/95 backdrop-blur-xl border border-[#243324]/15 dark:border-white/15 shadow-2xl space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
                  {selectedSite.city}, {selectedSite.state}
                </span>
                <h4 className="font-display text-xl sm:text-2xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-tight pt-0.5">
                  {selectedSite.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSite(null)}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#4A5D44] dark:text-[#CBD7C7] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedSite.addressSnippet && (
              <div className="flex items-center gap-1.5 text-xs text-[#657351] dark:text-[#A3B59E]">
                <MapPin className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                <span>{selectedSite.addressSnippet}</span>
              </div>
            )}

            {/* Quick 3-Stat Grid */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-[#243324]/10 dark:border-white/10">
              <div className="p-2.5 rounded-xl bg-[#F5F2EB] dark:bg-[#273B25] text-center">
                <span className="block font-display text-lg text-[#1F2B1D] dark:text-[#F4EFE6]">
                  {selectedSite.hives}
                </span>
                <span className="text-[10px] text-[#657351] dark:text-[#A3B59E] uppercase">Hives</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F5F2EB] dark:bg-[#273B25] text-center">
                <span className="block font-display text-lg text-[#1F2B1D] dark:text-[#F4EFE6]">
                  {selectedSite.wildflowerAreaSqM}
                </span>
                <span className="text-[10px] text-[#657351] dark:text-[#A3B59E] uppercase">m² Sponge</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F5F2EB] dark:bg-[#273B25] text-center">
                <span className="block font-display text-lg text-[#059669] dark:text-[#34D399]">
                  -{selectedSite.coolingImpactC || 4.8}°C
                </span>
                <span className="text-[10px] text-[#657351] dark:text-[#A3B59E] uppercase">Roof Cooling</span>
              </div>
            </div>

            {selectedSite.storyNote && (
              <p className="text-xs text-[#243324] dark:text-[#D1E0CE] font-light leading-relaxed bg-[#EBF5ED] dark:bg-[#253A24] p-3 rounded-xl border border-[#059669]/20">
                <span className="font-semibold text-[#059669] dark:text-[#34D399]">Key Impact: </span>
                {selectedSite.storyNote}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-[#657351] dark:text-[#A3B59E] pt-1">
              <span>Cloudburst Buffer: {selectedSite.rainwaterL.toLocaleString()} Litres</span>
              <span>Donated: {selectedSite.jarsDonated} Honey Jars</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Summary Bar */}
      <div className="z-20 p-4 sm:p-5 bg-[#1F2B1D] dark:bg-[#1A2819] text-[#F4EFE6] border-t border-[#243324]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <div>
            <span className="font-semibold">
              {activeRegion
                ? `${activeRegion.name} Eco-Corridor`
                : selectedHub
                ? `${selectedHub.name} Urban Hub`
                : 'South India Living Urban Ecosystem Network'}
            </span>
            <span className="text-white/70 ml-2 hidden sm:inline">
              {activeRegion
                ? `· IMD Annual Rain: ${activeRegion.imdRainfallMm} mm · Peak Surface Drop: -${activeRegion.heatMitigationC}°C`
                : selectedHub
                ? `· ${selectedHub.hives} Hives · ${selectedHub.dominantBee}`
                : `· 4 States · 79 Sanctuaries · 274 Apiaries · 46,850 m² Sponge Bed Canopy`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-white/80 self-end sm:self-auto">
          <span>{filteredSites.length} Active Sites Plotted</span>
        </div>
      </div>
    </div>
  );
};
