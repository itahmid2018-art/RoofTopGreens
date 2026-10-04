import React, { useState, useRef, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'motion/react';
import { MapPin, BarChart3, ZoomIn, ZoomOut, CloudRain, Thermometer, ShieldCheck, Compass, Sparkles, Layers } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import { SOUTH_INDIA_CORRIDORS, REPORT_METADATA } from '../data/reportData';
import { SOUTH_INDIA_STATES, REGION_METRICS } from '../data/southIndiaMapData';
import { GoogleSouthIndiaEcoMap } from './GoogleSouthIndiaEcoMap';

export const BoroughCorridorSection: React.FC = () => {
  const [selectedCorridor, setSelectedCorridor] = useState<string | null>(null);
  const [hoveredCorridor, setHoveredCorridor] = useState<string | null>(null);
  const [activeListIndex, setActiveListIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const activeCorridorInList = SOUTH_INDIA_CORRIDORS[activeListIndex] || SOUTH_INDIA_CORRIDORS[0];

  const handleSelectFromMap = (name: string | null) => {
    setSelectedCorridor(name);
    if (name) {
      const idx = SOUTH_INDIA_CORRIDORS.findIndex(
        (c) =>
          c.city.toLowerCase() === name.toLowerCase() ||
          c.state.toLowerCase() === name.toLowerCase() ||
          name.toLowerCase().includes(c.city.toLowerCase())
      );
      if (idx !== -1) {
        setActiveListIndex(idx);
      }
    }
  };

  const handleSelectFromList = (idx: number) => {
    setActiveListIndex(idx);
    const selected = SOUTH_INDIA_CORRIDORS[idx];
    if (selected) {
      setSelectedCorridor(selected.city);
    }
  };

  const scrollToCardTop = () => {
    if (cardContainerRef.current && typeof window !== 'undefined') {
      const cardTop = cardContainerRef.current.getBoundingClientRect().top + window.scrollY - 75;
      window.scrollTo({ top: Math.max(0, cardTop), behavior: 'smooth' });
    }
  };

  const handleSwitchToMap = () => {
    setViewMode('map');
    if (cardContainerRef.current && typeof window !== 'undefined') {
      const cardTop = cardContainerRef.current.getBoundingClientRect().top + window.scrollY - 75;
      if (window.scrollY > cardTop) {
        window.scrollTo({ top: Math.max(0, cardTop), behavior: 'smooth' });
      }
    }
  };

  const handleViewCorridorOnMap = (cityName: string) => {
    setSelectedCorridor(cityName);
    setViewMode('map');
    scrollToCardTop();
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.85));

  // Compute active display info for the bottom display
  const activeMetricsDisplay = useMemo(() => {
    const targetName = hoveredCorridor || selectedCorridor;
    if (targetName) {
      const match = SOUTH_INDIA_CORRIDORS.find(
        (c) =>
          c.city.toLowerCase() === targetName.toLowerCase() ||
          c.state.toLowerCase() === targetName.toLowerCase() ||
          targetName.toLowerCase().includes(c.city.toLowerCase())
      );
      if (match) {
        return {
          title: `${match.city}, ${match.state} · ${match.corridorName}`,
          stats: `${match.sites} Sanctuaries • ${match.hives} Hives • ${match.areaSqM.toLocaleString()} m² Living Sponge • IMD Rain: ${match.imdAnnualRainfallMm} mm`,
        };
      }
    }

    return {
      title: 'South India Living Urban Ecosystem Network',
      stats: `${REPORT_METADATA.totalSites} Partner Sanctuaries • ${REPORT_METADATA.totalHives} Hives • ${REPORT_METADATA.meadowAreaSqM.toLocaleString()} m² Living Canopy • 4 States`,
    };
  }, [hoveredCorridor, selectedCorridor]);

  return (
    <section
      ref={containerRef}
      id="corridors-section"
      className="relative min-h-screen py-20 sm:py-24 px-4 sm:px-8 lg:px-12 flex flex-col justify-center border-t border-[#243324]/10 dark:border-white/10 bg-[#FBF9F5] dark:bg-[#131D12] text-[#243324] dark:text-[#F4EFE6] transition-colors duration-400"
    >
      <div className="max-w-6xl mx-auto w-full space-y-12 sm:space-y-16">
        {/* Section Headline */}
        <div className="space-y-4 max-w-4xl">
          <p className="text-sm font-medium tracking-wide text-[#657351] dark:text-[#A3B59E]">
            State Watersheds & Bio-Corridors
          </p>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-[1.02] tracking-tight">
            Connecting South India’s rooftop micro-reserves across 4 states.
          </h2>
          <p className="text-lg sm:text-xl text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
            From the Deccan Plateau in Bengaluru and Hyderabad to the Coromandel coast of Chennai and the Malabar backwaters of Kochi, our 79 partner terraces link fragmented urban habitats while buffering intense monsoon deluges.
          </p>
        </div>

        {/* View Toggle Bar & Zoom Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-sm self-start">
            <button
              type="button"
              onClick={handleSwitchToMap}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                viewMode === 'map'
                  ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                  : 'text-[#4A5D44] dark:text-[#CBD7C7] hover:text-[#1F2B1D]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Google Satellite & Street View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                  : 'text-[#4A5D44] dark:text-[#CBD7C7] hover:text-[#1F2B1D]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Corridor Directory ({SOUTH_INDIA_CORRIDORS.length})</span>
            </button>
          </div>

          {viewMode === 'map' && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleZoomOut}
                title="Zoom Out"
                className="p-2 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 text-[#1F2B1D] dark:text-[#F4EFE6] hover:bg-black/5 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                title="Zoom In"
                className="p-2 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 text-[#1F2B1D] dark:text-[#F4EFE6] hover:bg-black/5 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div ref={cardContainerRef} className="w-full">
          <AnimatePresence mode="wait">
            {viewMode === 'map' ? (
              <motion.div
                key="map-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                <GoogleSouthIndiaEcoMap
                  selectedBoroughName={selectedCorridor}
                  onSelectBorough={handleSelectFromMap}
                  onHoverBorough={setHoveredCorridor}
                />
              </motion.div>
            ) : (
              /* Corridor Directory List View */
              <motion.div
                key="list-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left: Corridor Selector List */}
                <div className="lg:col-span-5 space-y-2.5 max-h-[640px] overflow-y-auto pr-2 custom-scrollbar">
                  {SOUTH_INDIA_CORRIDORS.map((corridor, idx) => {
                    const isSelected = activeListIndex === idx;
                    return (
                      <button
                        key={corridor.id}
                        type="button"
                        onClick={() => handleSelectFromList(idx)}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#1F2B1D] dark:bg-[#253924] text-white border-transparent shadow-md'
                            : 'bg-white dark:bg-[#1A2619] text-[#1F2B1D] dark:text-[#F4EFE6] border-[#243324]/10 dark:border-white/10 hover:border-[#1F2B1D]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs font-semibold uppercase tracking-wider ${isSelected ? 'text-[#85E7B7]' : 'text-[#657351] dark:text-[#A3B59E]'}`}>
                            {corridor.state}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#E8EFE5] dark:bg-[#2C3F2B] text-[#243324] dark:text-[#CBD7C7]'}`}>
                            {corridor.hives} Hives
                          </span>
                        </div>
                        <h4 className="font-display text-lg sm:text-xl font-normal pt-1">
                          {corridor.city}
                        </h4>
                        <p className={`text-xs mt-1 line-clamp-1 ${isSelected ? 'text-white/80' : 'text-[#4A5D44] dark:text-[#CBD7C7]'}`}>
                          {corridor.corridorName} · {corridor.sites} Sanctuaries
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Right: Detailed Corridor Highlight Panel */}
                <div className="lg:col-span-7 p-6 sm:p-10 rounded-[2.5rem] bg-white dark:bg-[#1E2D1D] border border-[#243324]/10 dark:border-white/12 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#243324]/10 dark:border-white/10 pb-5">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
                        {activeCorridorInList.state} Watershed
                      </span>
                      <h3 className="font-display text-2xl sm:text-4xl text-[#1F2B1D] dark:text-[#F4EFE6] pt-1">
                        {activeCorridorInList.city} · {activeCorridorInList.corridorName}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleViewCorridorOnMap(activeCorridorInList.city)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#059669] dark:text-[#34D399] hover:underline self-start sm:self-auto cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>View on Map</span>
                    </button>
                  </div>

                  <p className="text-base text-[#3B4D36] dark:text-[#CBD7C7] font-light leading-relaxed">
                    {activeCorridorInList.description}
                  </p>

                  {/* 4 Quantitative Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    <div className="p-3.5 rounded-2xl bg-[#F5F2EB] dark:bg-[#253924] space-y-1">
                      <div className="font-display text-2xl text-[#1F2B1D] dark:text-[#F4EFE6]">
                        {activeCorridorInList.sites}
                      </div>
                      <p className="text-xs text-[#657351] dark:text-[#A3B59E]">Sanctuaries</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#F5F2EB] dark:bg-[#253924] space-y-1">
                      <div className="font-display text-2xl text-[#1F2B1D] dark:text-[#F4EFE6]">
                        {activeCorridorInList.hives}
                      </div>
                      <p className="text-xs text-[#657351] dark:text-[#A3B59E]">Active Hives</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#F5F2EB] dark:bg-[#253924] space-y-1">
                      <div className="font-display text-2xl text-[#059669] dark:text-[#34D399]">
                        -{activeCorridorInList.spongeCoolingC}°C
                      </div>
                      <p className="text-xs text-[#657351] dark:text-[#A3B59E]">Roof Cooling</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#F5F2EB] dark:bg-[#253924] space-y-1">
                      <div className="font-display text-2xl text-[#3B82F6]">
                        {activeCorridorInList.imdAnnualRainfallMm} mm
                      </div>
                      <p className="text-xs text-[#657351] dark:text-[#A3B59E]">IMD Rain / Yr</p>
                    </div>
                  </div>

                  {/* Monsoon & Flora Details */}
                  <div className="p-5 rounded-2xl bg-[#F5F2EB]/60 dark:bg-[#253924]/60 space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-[#1F2B1D] dark:text-[#F4EFE6]">
                      <CloudRain className="w-4 h-4 text-[#3B82F6]" />
                      <span className="font-semibold">Monsoon Rhythm: </span>
                      <span>{activeCorridorInList.monsoonProfile}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#1F2B1D] dark:text-[#F4EFE6]">
                      <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                      <span className="font-semibold">Dominant Pollinators: </span>
                      <span>{activeCorridorInList.dominantBee}</span>
                    </div>
                    <div className="pt-1 text-[#4A5D44] dark:text-[#CBD7C7]">
                      <span className="font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">Native Flora Canopy: </span>
                      {activeCorridorInList.keyNativeFlora.join(', ')}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
