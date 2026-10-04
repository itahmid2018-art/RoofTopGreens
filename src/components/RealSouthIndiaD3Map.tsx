import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { geoMercator, geoPath } from 'd3-geo';
import {
  X,
  Droplets,
  Thermometer,
  CloudRain,
  MapPin,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Info,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import {
  SOUTH_INDIA_GEOJSON,
  WESTERN_GHATS_GEOJSON,
  MAJOR_RIVERS_GEOJSON,
  REAL_ROOFTOP_SITES,
  GeoJsonPolygonFeature,
} from '../data/realSouthIndiaGeoData';
import { RooftopSite } from '../types';

interface RealSouthIndiaD3MapProps {
  selectedBoroughName?: string | null;
  onSelectBorough?: (boroughName: string | null) => void;
  onHoverBorough?: (boroughName: string | null) => void;
  zoomLevel?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

type MapLayerMode = 'all' | 'rainfall' | 'heat' | 'bees';

export const RealSouthIndiaD3Map: React.FC<RealSouthIndiaD3MapProps> = ({
  selectedBoroughName,
  onSelectBorough,
  onHoverBorough,
}) => {
  const { isDark } = useTheme();
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<RooftopSite | null>(null);
  const [hoveredSite, setHoveredSite] = useState<RooftopSite | null>(null);
  const [activeFilterState, setActiveFilterState] = useState<string>('all');
  const [activeLayer, setActiveLayer] = useState<MapLayerMode>('all');
  const [zoomFactor, setZoomFactor] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Canvas Dimensions
  const mapWidth = 850;
  const mapHeight = 920;

  // D3 Geo Projection for South India (Center ~79.2°E, 13.8°N)
  const projection = useMemo(() => {
    return geoMercator()
      .center([79.2, 13.6])
      .scale(3300)
      .translate([mapWidth / 2, mapHeight / 2]);
  }, []);

  const pathGenerator = useMemo(() => {
    return geoPath().projection(projection);
  }, [projection]);

  // Sync with prop if controlled
  useEffect(() => {
    if (!selectedBoroughName) {
      setSelectedStateId(null);
      return;
    }

    const stateMatch = SOUTH_INDIA_GEOJSON.features.find(
      (f) =>
        f.properties.name.toLowerCase() === selectedBoroughName.toLowerCase() ||
        f.properties.state.toLowerCase() === selectedBoroughName.toLowerCase() ||
        selectedBoroughName.toLowerCase().includes(f.properties.state.toLowerCase())
    );

    if (stateMatch) {
      setSelectedStateId(stateMatch.id);
      setActiveFilterState(stateMatch.id);
    }
  }, [selectedBoroughName]);

  // Projected SVG path strings using D3
  const statePaths = useMemo(() => {
    return SOUTH_INDIA_GEOJSON.features.map((feature) => ({
      feature,
      path: pathGenerator(feature as any) || '',
    }));
  }, [pathGenerator]);

  const westernGhatsPath = useMemo(() => {
    return pathGenerator(WESTERN_GHATS_GEOJSON as any) || '';
  }, [pathGenerator]);

  const riverPaths = useMemo(() => {
    return MAJOR_RIVERS_GEOJSON.map((river) => ({
      river,
      path: pathGenerator(river as any) || '',
    }));
  }, [pathGenerator]);

  // Projected Rooftop Apiary Points with coordinates
  const projectedSites = useMemo(() => {
    return REAL_ROOFTOP_SITES.map((site) => {
      const coords = site.coordinates || [77.59, 12.97];
      const projected = projection(coords);
      return {
        ...site,
        projectedX: projected ? projected[0] : 0,
        projectedY: projected ? projected[1] : 0,
      };
    });
  }, [projection]);

  // Filtered sites based on selected state
  const filteredSites = useMemo(() => {
    return projectedSites.filter((site) => {
      if (activeFilterState === 'all' && !selectedStateId) return true;
      const targetState = selectedStateId || activeFilterState;

      if (targetState === 'karnataka') return site.state.toLowerCase().includes('karnataka');
      if (targetState === 'tamil-nadu') return site.state.toLowerCase().includes('tamil');
      if (targetState === 'kerala') return site.state.toLowerCase().includes('kerala');
      if (targetState === 'andhra-pradesh') {
        return site.state.toLowerCase().includes('andhra') || site.state.toLowerCase().includes('telangana');
      }
      return true;
    });
  }, [projectedSites, activeFilterState, selectedStateId]);

  const handleStateClick = (feature: GeoJsonPolygonFeature) => {
    if (selectedStateId === feature.id) {
      setSelectedStateId(null);
      setActiveFilterState('all');
      setSelectedSite(null);
      onSelectBorough?.(null);
    } else {
      setSelectedStateId(feature.id);
      setActiveFilterState(feature.id);
      setSelectedSite(null);
      onSelectBorough?.(feature.properties.state);
    }
  };

  const handleResetMap = () => {
    setSelectedStateId(null);
    setActiveFilterState('all');
    setSelectedSite(null);
    setZoomFactor(1);
    setPanPosition({ x: 0, y: 0 });
    onSelectBorough?.(null);
  };

  const activeFeature = SOUTH_INDIA_GEOJSON.features.find(
    (f) => f.id === (selectedStateId || hoveredStateId)
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[620px] sm:h-[700px] lg:h-[780px] rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden border border-[#243324]/10 dark:border-white/12 bg-[#F3EFE7] dark:bg-[#111A10] shadow-2xl transition-all duration-400 select-none flex flex-col justify-between"
    >
      {/* Top Interactive Controls Header */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex flex-wrap items-center gap-2 max-w-[88%]">
        {/* State Filter Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/85 dark:bg-[#1B291A]/90 backdrop-blur-md border border-[#243324]/10 dark:border-white/10 shadow-sm text-xs">
          <button
            type="button"
            onClick={handleResetMap}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeFilterState === 'all' && !selectedStateId
                ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                : 'text-[#4A5D44] dark:text-[#CBD7C7] hover:text-[#1F2B1D]'
            }`}
          >
            All 4 States ({REAL_ROOFTOP_SITES.length} Sites)
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveFilterState('karnataka');
              setSelectedStateId('karnataka');
              onSelectBorough?.('Karnataka');
            }}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeFilterState === 'karnataka'
                ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                : 'text-[#4A5D44] dark:text-[#CBD7C7] hover:text-[#1F2B1D]'
            }`}
          >
            Karnataka
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveFilterState('tamil-nadu');
              setSelectedStateId('tamil-nadu');
              onSelectBorough?.('Tamil Nadu');
            }}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeFilterState === 'tamil-nadu'
                ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                : 'text-[#4A5D44] dark:text-[#CBD7C7] hover:text-[#1F2B1D]'
            }`}
          >
            Tamil Nadu
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveFilterState('kerala');
              setSelectedStateId('kerala');
              onSelectBorough?.('Kerala');
            }}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeFilterState === 'kerala'
                ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                : 'text-[#4A5D44] dark:text-[#CBD7C7] hover:text-[#1F2B1D]'
            }`}
          >
            Kerala
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveFilterState('andhra-pradesh');
              setSelectedStateId('andhra-pradesh');
              onSelectBorough?.('Andhra Pradesh');
            }}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeFilterState === 'andhra-pradesh'
                ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                : 'text-[#4A5D44] dark:text-[#CBD7C7] hover:text-[#1F2B1D]'
            }`}
          >
            Andhra & Telangana
          </button>
        </div>

        {/* Layer Mode Toggle (All, Rainfall, Heat Reduction, Bee Colonies) */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-white/85 dark:bg-[#1B291A]/90 backdrop-blur-md border border-[#243324]/10 dark:border-white/10 shadow-sm text-xs">
          <button
            type="button"
            onClick={() => setActiveLayer('all')}
            className={`px-2.5 py-1.5 rounded-xl font-medium transition-all ${
              activeLayer === 'all'
                ? 'bg-[#059669] text-white shadow-xs'
                : 'text-[#4A5D44] dark:text-[#CBD7C7] hover:text-[#1F2B1D]'
            }`}
          >
            Apiary Clusters
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('rainfall')}
            className={`px-2.5 py-1.5 rounded-xl font-medium transition-all ${
              activeLayer === 'rainfall'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-[#4A5D44] dark:text-[#CBD7C7] hover:text-[#1F2B1D]'
            }`}
          >
            IMD Rainfall
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('heat')}
            className={`px-2.5 py-1.5 rounded-xl font-medium transition-all ${
              activeLayer === 'heat'
                ? 'bg-[#D97706] text-white shadow-xs'
                : 'text-[#4A5D44] dark:text-[#CBD7C7] hover:text-[#1F2B1D]'
            }`}
          >
            Roof Cooling
          </button>
        </div>
      </div>

      {/* Top Right Zoom Controls & Telemetry Indicator */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex flex-col items-end gap-2">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/85 dark:bg-[#1B291A]/90 backdrop-blur-md border border-[#243324]/10 dark:border-white/10 shadow-sm">
          <button
            type="button"
            onClick={() => setZoomFactor((prev) => Math.min(prev + 0.25, 2.5))}
            title="Zoom In"
            className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[#1F2B1D] dark:text-[#F4EFE6] transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomFactor((prev) => Math.max(prev - 0.25, 0.85))}
            title="Zoom Out"
            className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[#1F2B1D] dark:text-[#F4EFE6] transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetMap}
            title="Reset View"
            className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[#1F2B1D] dark:text-[#F4EFE6] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* GIS Projection Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-[#1B291A]/80 backdrop-blur-md border border-[#243324]/10 dark:border-white/10 text-[11px] font-medium text-[#4A5D44] dark:text-[#CBD7C7] shadow-xs">
          <Compass className="w-3.5 h-3.5 text-[#059669]" />
          <span>D3.js Mercator GIS Projection</span>
        </div>
      </div>

      {/* Main SVG D3 Map Canvas */}
      <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
        <motion.svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-full max-h-full object-contain"
          animate={{
            scale: zoomFactor,
            x: panPosition.x,
            y: panPosition.y,
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        >
          <defs>
            {/* Soft Ocean Water Texture */}
            <linearGradient id="oceanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFEAE2" stopOpacity={isDark ? '0.07' : '0.55'} />
              <stop offset="100%" stopColor="#D2E2D8" stopOpacity={isDark ? '0.12' : '0.7'} />
            </linearGradient>

            {/* Glowing Apiary Pin Filter */}
            <filter id="apiaryPinGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#F59E0B" floodOpacity="0.7" />
            </filter>
            <filter id="keyStoryGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#10B981" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Ocean Background */}
          <rect x="0" y="0" width={mapWidth} height={mapHeight} fill="url(#oceanGlow)" />

          {/* Surrounding Maritime Labels */}
          <g className="pointer-events-none select-none opacity-40 dark:opacity-30">
            <text
              x="130"
              y="520"
              textAnchor="middle"
              className="text-[13px] font-semibold tracking-[0.3em] fill-[#2D452B] dark:fill-[#94A992]"
            >
              ARABIAN SEA
            </text>
            <text
              x="130"
              y="538"
              textAnchor="middle"
              className="text-[10px] tracking-wider fill-[#486345] dark:fill-[#7B9179]"
            >
              (Lakshadweep Waters)
            </text>

            <text
              x="720"
              y="450"
              textAnchor="middle"
              className="text-[13px] font-semibold tracking-[0.3em] fill-[#2D452B] dark:fill-[#94A992]"
            >
              BAY OF BENGAL
            </text>
            <text
              x="720"
              y="468"
              textAnchor="middle"
              className="text-[10px] tracking-wider fill-[#486345] dark:fill-[#7B9179]"
            >
              (Coromandel Waters)
            </text>

            <text
              x="425"
              y="880"
              textAnchor="middle"
              className="text-[12px] font-semibold tracking-[0.25em] fill-[#2D452B] dark:fill-[#94A992]"
            >
              INDIAN OCEAN · CAPE COMORIN
            </text>
          </g>

          {/* D3 Real Projected State Boundaries */}
          <g id="d3-states-layer">
            {statePaths.map(({ feature, path }) => {
              const isSelected = selectedStateId === feature.id;
              const isHovered = hoveredStateId === feature.id;

              // Color dynamic based on active layer
              let fillColor = isDark ? '#233921' : '#E2ECE0';
              if (feature.id === 'karnataka') fillColor = isDark ? '#243B22' : '#DEEADE';
              if (feature.id === 'tamil-nadu') fillColor = isDark ? '#1F341D' : '#DCE7DA';
              if (feature.id === 'kerala') fillColor = isDark ? '#192E17' : '#D7E5D4';
              if (feature.id === 'andhra-pradesh') fillColor = isDark ? '#263D23' : '#E0EAE0';

              if (activeLayer === 'rainfall') {
                if (feature.properties.annualRainfallMm > 3000) fillColor = isDark ? '#0C4A6E' : '#BAE6FD';
                else if (feature.properties.annualRainfallMm > 1300) fillColor = isDark ? '#0369A1' : '#E0F2FE';
                else fillColor = isDark ? '#1E293B' : '#F1F5F9';
              } else if (activeLayer === 'heat') {
                if (feature.properties.coolingDeltaC >= 5.0) fillColor = isDark ? '#78350F' : '#FEF3C7';
                else fillColor = isDark ? '#27272A' : '#F4F4F5';
              }

              return (
                <path
                  key={feature.id}
                  d={path}
                  stroke={isSelected ? '#10B981' : isDark ? '#3E583A' : '#A2B99D'}
                  strokeWidth={isSelected ? 2.5 : 1.2}
                  fill={fillColor}
                  fillOpacity={isSelected ? 1 : isHovered ? 0.95 : 0.85}
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => handleStateClick(feature)}
                  onMouseEnter={() => {
                    setHoveredStateId(feature.id);
                    onHoverBorough?.(feature.properties.state);
                  }}
                  onMouseLeave={() => {
                    setHoveredStateId(null);
                    onHoverBorough?.(null);
                  }}
                />
              );
            })}
          </g>

          {/* D3 Real Projected Western Ghats Spine */}
          <g id="d3-western-ghats-layer" className="pointer-events-none">
            <path
              d={westernGhatsPath}
              fill="none"
              stroke="#10B981"
              strokeWidth="4"
              strokeDasharray="6 4"
              strokeLinecap="round"
              className="opacity-75 dark:opacity-65"
            />
          </g>

          {/* D3 Real Projected Major Rivers (Kaveri, Krishna, Periyar) */}
          <g id="d3-rivers-layer" className="pointer-events-none">
            {riverPaths.map(({ river, path }) => (
              <path
                key={river.id}
                d={path}
                fill="none"
                stroke={river.properties.color}
                strokeWidth="2.2"
                strokeLinecap="round"
                className="opacity-70 dark:opacity-80"
              />
            ))}
          </g>

          {/* State Metric & Centroid Badges */}
          <g id="d3-state-labels" className="pointer-events-none select-none">
            {statePaths.map(({ feature }) => {
              // Calculate representative center from geometry coordinates
              const coords = feature.geometry.coordinates[0];
              const avgLng = coords.reduce((acc, c) => acc + c[0], 0) / coords.length;
              const avgLat = coords.reduce((acc, c) => acc + c[1], 0) / coords.length;
              const center = projection([avgLng, avgLat]) || [0, 0];

              return (
                <g key={`lbl-${feature.id}`} transform={`translate(${center[0]}, ${center[1]})`}>
                  <text
                    textAnchor="middle"
                    className="text-[13px] font-bold tracking-wider fill-[#1F2B1D] dark:fill-[#F4EFE6] drop-shadow-sm"
                  >
                    {feature.properties.name.toUpperCase()}
                  </text>
                  <text
                    y="14"
                    textAnchor="middle"
                    className="text-[10px] font-medium fill-[#516B4D] dark:fill-[#A6BFA2]"
                  >
                    {feature.properties.hives} Hives · {feature.properties.annualRainfallMm} mm Rain
                  </text>
                </g>
              );
            })}
          </g>

          {/* D3 Real Projected Rooftop Apiaries */}
          <g id="d3-rooftop-apiaries">
            {filteredSites.map((site) => {
              const isSelected = selectedSite?.id === site.id;
              const isHovered = hoveredSite?.id === site.id;
              const radius = site.isKeyStory ? (isSelected ? 11 : 7.5) : isSelected ? 8.5 : 5.5;

              return (
                <g
                  key={site.id}
                  transform={`translate(${site.projectedX}, ${site.projectedY})`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSite(site);
                  }}
                  onMouseEnter={() => setHoveredSite(site)}
                  onMouseLeave={() => setHoveredSite(null)}
                >
                  {/* Outer Pulsing Halo on Hover / Select */}
                  {(isSelected || isHovered) && (
                    <circle
                      r={radius + 6}
                      className="fill-[#F59E0B]/20 animate-pulse stroke-[#F59E0B]/50 stroke-[1]"
                    />
                  )}

                  {/* Main Apiary Dot */}
                  <circle
                    r={radius}
                    className={`transition-all duration-200 ${
                      isSelected
                        ? 'fill-[#F59E0B] stroke-white stroke-[2]'
                        : isHovered
                        ? 'fill-[#FBBF24] stroke-white stroke-[1.5]'
                        : site.isKeyStory
                        ? 'fill-[#10B981] stroke-white stroke-[1.5]'
                        : 'fill-[#D97706] stroke-white/90 stroke-[0.8]'
                    }`}
                    filter={site.isKeyStory ? 'url(#keyStoryGlow)' : 'url(#apiaryPinGlow)'}
                  />

                  {/* Center Dot for Key Milestone Sanctuaries */}
                  {site.isKeyStory && (
                    <circle r="2.2" className="fill-white pointer-events-none" />
                  )}
                </g>
              );
            })}
          </g>
        </motion.svg>
      </div>

      {/* Floating Hover Tooltip with Real Coordinates */}
      <AnimatePresence>
        {hoveredSite && !selectedSite && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-20 left-4 sm:left-8 z-30 pointer-events-none max-w-sm p-4 rounded-2xl bg-white/95 dark:bg-[#1B291A]/95 backdrop-blur-md border border-[#243324]/10 dark:border-white/12 shadow-xl space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
                {hoveredSite.city}, {hoveredSite.state}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#B45309] dark:text-[#FCD34D]">
                {hoveredSite.hives} Hives
              </span>
            </div>
            <h4 className="font-display text-base font-medium text-[#1F2B1D] dark:text-[#F4EFE6] leading-tight">
              {hoveredSite.name}
            </h4>
            <p className="text-xs text-[#4A5D44] dark:text-[#CBD7C7] line-clamp-2">
              {hoveredSite.buildingType} · {hoveredSite.wildflowerAreaSqM.toLocaleString()} m² sponge canopy
            </p>
            {hoveredSite.coordinates && (
              <p className="text-[10px] font-mono text-[#657351] dark:text-[#8FA88B]">
                GPS: {hoveredSite.coordinates[1].toFixed(4)}°N, {hoveredSite.coordinates[0].toFixed(4)}°E
              </p>
            )}
            {hoveredSite.storyNote && (
              <p className="text-[11px] text-[#059669] dark:text-[#34D399] font-medium pt-0.5">
                ★ {hoveredSite.storyNote}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Site Detail Drawer */}
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
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#4A5D44] dark:text-[#CBD7C7] transition-colors cursor-pointer"
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

            {selectedSite.coordinates && (
              <div className="text-[11px] font-mono text-[#059669] dark:text-[#34D399] bg-[#EBF5ED] dark:bg-[#253A24] px-2.5 py-1 rounded-lg inline-block">
                Exact Coordinates: {selectedSite.coordinates[1].toFixed(4)}°N, {selectedSite.coordinates[0].toFixed(4)}°E
              </div>
            )}

            {/* 3 Metric Card Grid */}
            <div className="grid grid-cols-3 gap-2.5 pt-1 border-t border-[#243324]/10 dark:border-white/10">
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
                <span className="text-[10px] text-[#657351] dark:text-[#A3B59E] uppercase">Slab Cooling</span>
              </div>
            </div>

            {selectedSite.storyNote && (
              <p className="text-xs text-[#243324] dark:text-[#D1E0CE] font-light leading-relaxed bg-[#EBF5ED] dark:bg-[#253A24] p-3 rounded-xl border border-[#059669]/20">
                <span className="font-semibold text-[#059669] dark:text-[#34D399]">Ecological Note: </span>
                {selectedSite.storyNote}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-[#657351] dark:text-[#A3B59E] pt-0.5">
              <span>Cloudburst Buffer: {selectedSite.rainwaterL.toLocaleString()} L</span>
              <span>Donated: {selectedSite.jarsDonated} Honey Jars</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom GIS Status Bar */}
      <div className="z-20 p-4 sm:p-5 bg-[#1F2B1D] dark:bg-[#1A2819] text-[#F4EFE6] border-t border-[#243324]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <div>
            <span className="font-semibold">
              {activeFeature
                ? `${activeFeature.properties.name} Watershed`
                : 'South India Living Urban Ecosystem Network'}
            </span>
            <span className="text-white/70 ml-2 hidden sm:inline">
              {activeFeature
                ? `· IMD Rain: ${activeFeature.properties.annualRainfallMm} mm · Surface Drop: -${activeFeature.properties.coolingDeltaC}°C · Soil: ${activeFeature.properties.soilSubstrate}`
                : `· Karnataka, Tamil Nadu, Kerala & Andhra Pradesh · ${filteredSites.length} Apiaries Rendered via D3`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-white/80 self-end sm:self-auto">
          <span>{filteredSites.length} of {REAL_ROOFTOP_SITES.length} Sites Plotted</span>
        </div>
      </div>
    </div>
  );
};
