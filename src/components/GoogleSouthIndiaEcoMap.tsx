import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
  Pin,
} from '@vis.gl/react-google-maps';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Layers,
  Compass,
  Droplets,
  Flower2,
  Sparkles,
  Maximize2,
  Eye,
  Camera,
  X,
  Building2,
  Navigation,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { REAL_ROOFTOP_SITES } from '../data/realSouthIndiaGeoData';
import { RooftopSite } from '../types';
import { useTheme } from '../context/ThemeContext';

interface GoogleSouthIndiaEcoMapProps {
  selectedBoroughName?: string | null;
  onSelectBorough?: (boroughName: string | null) => void;
  onHoverBorough?: (boroughName: string | null) => void;
}

type MapTypeOption = 'hybrid' | 'roadmap' | 'terrain';

// Regional Camera Presets across South India
const REGIONAL_PRESETS = [
  { id: 'all', label: 'All South India', center: { lat: 13.0, lng: 78.4 }, zoom: 6.8 },
  { id: 'bengaluru', label: 'Bengaluru (KA)', center: { lat: 12.9716, lng: 77.5946 }, zoom: 12.5 },
  { id: 'chennai', label: 'Chennai (TN)', center: { lat: 13.0827, lng: 80.2707 }, zoom: 12.5 },
  { id: 'kochi', label: 'Kochi (KL)', center: { lat: 9.9312, lng: 76.2673 }, zoom: 12.5 },
  { id: 'hyderabad', label: 'Hyderabad (AP/TS)', center: { lat: 17.3850, lng: 78.4867 }, zoom: 12.5 },
];

export const GoogleSouthIndiaEcoMap: React.FC<GoogleSouthIndiaEcoMapProps> = ({
  selectedBoroughName,
  onSelectBorough,
  onHoverBorough,
}) => {
  const { isDark } = useTheme();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const [selectedSite, setSelectedSite] = useState<RooftopSite | null>(REAL_ROOFTOP_SITES[0]);
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');
  const [mapTypeId, setMapTypeId] = useState<MapTypeOption>('hybrid'); // Default to Satellite/Hybrid
  const [isStreetViewOpen, setIsStreetViewOpen] = useState<boolean>(false);
  const [streetViewPosition, setStreetViewPosition] = useState<{ lat: number; lng: number }>({
    lat: REAL_ROOFTOP_SITES[0].coordinates[1],
    lng: REAL_ROOFTOP_SITES[0].coordinates[0],
  });
  const [streetViewAvailable, setStreetViewAvailable] = useState<boolean>(true);

  const streetViewRef = useRef<HTMLDivElement>(null);
  const panoramaInstanceRef = useRef<google.maps.StreetViewPanorama | null>(null);

  // Filter sites based on state
  const filteredSites = useMemo(() => {
    if (selectedStateFilter === 'all') return REAL_ROOFTOP_SITES;
    return REAL_ROOFTOP_SITES.filter(
      (site) => site.state.toLowerCase() === selectedStateFilter.toLowerCase()
    );
  }, [selectedStateFilter]);

  // Sync with selectedBoroughName from parent if passed
  useEffect(() => {
    if (!selectedBoroughName) return;
    const match = REAL_ROOFTOP_SITES.find(
      (s) =>
        s.city.toLowerCase().includes(selectedBoroughName.toLowerCase()) ||
        s.state.toLowerCase().includes(selectedBoroughName.toLowerCase()) ||
        s.corridor.toLowerCase().includes(selectedBoroughName.toLowerCase())
    );
    if (match) {
      setSelectedSite(match);
      setStreetViewPosition({
        lat: match.coordinates[1],
        lng: match.coordinates[0],
      });
    }
  }, [selectedBoroughName]);

  // Initialize or update Street View Panorama
  useEffect(() => {
    if (!isStreetViewOpen || !streetViewRef.current || typeof google === 'undefined') return;

    try {
      const svService = new google.maps.StreetViewService();
      const pos = new google.maps.LatLng(streetViewPosition.lat, streetViewPosition.lng);

      svService.getPanorama({ location: pos, radius: 1000 }, (data, status) => {
        if (status === google.maps.StreetViewStatus.OK && data && data.location) {
          setStreetViewAvailable(true);
          if (streetViewRef.current) {
            panoramaInstanceRef.current = new google.maps.StreetViewPanorama(streetViewRef.current, {
              position: data.location.latLng,
              pov: { heading: 160, pitch: 10 },
              zoom: 1,
              addressControl: true,
              fullscreenControl: true,
              motionTracking: false,
              linksControl: true,
              panControl: true,
              enableCloseButton: true,
            });

            panoramaInstanceRef.current.addListener('closeclick', () => {
              setIsStreetViewOpen(false);
            });
          }
        } else {
          setStreetViewAvailable(false);
        }
      });
    } catch (e) {
      console.warn('Street view initialization error:', e);
      setStreetViewAvailable(false);
    }
  }, [isStreetViewOpen, streetViewPosition]);

  // Open Street view for a site
  const handleOpenStreetView = useCallback((site: RooftopSite) => {
    setStreetViewPosition({
      lat: site.coordinates[1],
      lng: site.coordinates[0],
    });
    setIsStreetViewOpen(true);
  }, []);

  return (
    <div className="relative w-full rounded-[2.5rem] overflow-hidden border border-[#243324]/15 dark:border-white/15 bg-[#1F2B1D] shadow-2xl flex flex-col">
      {/* Top Map Control Bar */}
      <div className="p-4 sm:p-5 bg-white/95 dark:bg-[#1A2619]/95 backdrop-blur-md border-b border-[#243324]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 z-20">
        <div className="flex flex-wrap items-center gap-2">
          {/* Satellite vs Roadmap vs Terrain Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-[#F5F2EB] dark:bg-[#131D12] border border-[#243324]/10 dark:border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setMapTypeId('hybrid')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                mapTypeId === 'hybrid'
                  ? 'bg-[#1F2B1D] dark:bg-[#2F452D] text-white shadow-xs'
                  : 'text-[#4A5D44] dark:text-[#CBD7C7]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Satellite
            </button>
            <button
              type="button"
              onClick={() => setMapTypeId('roadmap')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                mapTypeId === 'roadmap'
                  ? 'bg-[#1F2B1D] dark:bg-[#2F452D] text-white shadow-xs'
                  : 'text-[#4A5D44] dark:text-[#CBD7C7]'
              }`}
            >
              Roadmap
            </button>
            <button
              type="button"
              onClick={() => setMapTypeId('terrain')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                mapTypeId === 'terrain'
                  ? 'bg-[#1F2B1D] dark:bg-[#2F452D] text-white shadow-xs'
                  : 'text-[#4A5D44] dark:text-[#CBD7C7]'
              }`}
            >
              Terrain
            </button>
          </div>

          {/* Quick Jump Buttons */}
          <div className="hidden md:flex items-center gap-1.5 text-xs">
            {REGIONAL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setSelectedStateFilter(preset.id === 'all' ? 'all' : preset.id);
                  if (onSelectBorough) onSelectBorough(preset.label);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#233522] border border-[#243324]/10 dark:border-white/10 text-[#3B4D36] dark:text-[#CBD7C7] hover:border-[#10B981]/50 transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Street View Quick Toggle */}
        <div className="flex items-center gap-2">
          {selectedSite && (
            <button
              type="button"
              onClick={() => handleOpenStreetView(selectedSite)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isStreetViewOpen
                  ? 'bg-[#0284C7] text-white shadow-md'
                  : 'bg-[#0284C7]/15 hover:bg-[#0284C7]/25 text-[#0284C7] dark:text-[#38BDF8] border border-[#0284C7]/30'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              {isStreetViewOpen ? 'In Street View' : 'Explore Street View (360°)'}
            </button>
          )}

          <div className="text-xs text-[#657351] dark:text-[#A3B59E] hidden sm:block">
            <strong>{filteredSites.length}</strong> Rooftops Geocoded
          </div>
        </div>
      </div>

      {/* Main Map & Street View Container */}
      <div className="relative w-full h-[580px] sm:h-[640px] bg-[#162315]">
        {/* Google Maps API Provider & Map Surface */}
        <APIProvider
          apiKey={apiKey}
          solutionChannel="gmp_mcp_codeassist_v1_aistudio"
        >
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={{ lat: 13.0, lng: 78.4 }}
            defaultZoom={6.8}
            mapTypeId={mapTypeId}
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          >
            {/* Advanced Markers for All Rooftop Sites */}
            {filteredSites.map((site) => {
              const isSelected = selectedSite?.id === site.id;
              const lat = site.coordinates[1];
              const lng = site.coordinates[0];

              // Color token based on state
              const pinBg =
                site.state === 'Karnataka'
                  ? '#10B981'
                  : site.state === 'Tamil Nadu'
                  ? '#F59E0B'
                  : site.state === 'Kerala'
                  ? '#06B6D4'
                  : '#8B5CF6';

              return (
                <AdvancedMarker
                  key={site.id}
                  position={{ lat, lng }}
                  onClick={() => {
                    setSelectedSite(site);
                    if (onSelectBorough) onSelectBorough(site.corridor);
                  }}
                  title={site.name}
                >
                  <Pin
                    background={pinBg}
                    borderColor="#FFFFFF"
                    glyphColor="#FFFFFF"
                    scale={isSelected ? 1.3 : 1.0}
                  />
                </AdvancedMarker>
              );
            })}

            {/* InfoWindow for Selected Rooftop Site */}
            {selectedSite && !isStreetViewOpen && (
              <InfoWindow
                position={{
                  lat: selectedSite.coordinates[1],
                  lng: selectedSite.coordinates[0],
                }}
                onCloseClick={() => setSelectedSite(null)}
                pixelOffset={[0, -35]}
              >
                <div className="p-3 max-w-[280px] text-[#1F2B1D] space-y-2">
                  <div className="flex items-center justify-between border-b border-black/10 pb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#059669]">
                      {selectedSite.state} · {selectedSite.city}
                    </span>
                    <span className="text-[11px] font-semibold text-[#1F2B1D]">
                      {selectedSite.hives} Hives
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display font-medium text-sm text-[#1F2B1D] leading-tight">
                      {selectedSite.name}
                    </h4>
                    <p className="text-[11px] text-[#4A5D44] font-light mt-0.5">
                      {selectedSite.addressSnippet || selectedSite.corridor}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                    <div className="p-1.5 rounded-lg bg-[#F5F2EB]">
                      <span className="text-[#657351] block">Sponge Area</span>
                      <strong className="text-[#1F2B1D]">{selectedSite.wildflowerAreaSqM} m²</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#F5F2EB]">
                      <span className="text-[#657351] block">Honey Harvest</span>
                      <strong className="text-[#1F2B1D]">{selectedSite.honeyHarvestKg} kg</strong>
                    </div>
                  </div>

                  {selectedSite.storyNote && (
                    <p className="text-[11px] text-[#4A5D44] italic border-t border-black/10 pt-1.5">
                      "{selectedSite.storyNote}"
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenStreetView(selectedSite)}
                    className="w-full mt-2 py-1.5 px-3 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Open 360° Street View Here
                  </button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>

        {/* Embedded Interactive Street View Panorama Overlay */}
        <AnimatePresence>
          {isStreetViewOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-30 bg-black flex flex-col"
            >
              {/* Street View Overlay Bar */}
              <div className="p-3.5 bg-black/85 backdrop-blur-md text-white flex items-center justify-between border-b border-white/15 px-6 z-40">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#0284C7] flex items-center justify-center">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-white">
                      Google Street View · {selectedSite?.name}
                    </h4>
                    <p className="text-[11px] text-white/70">
                      {selectedSite?.city}, {selectedSite?.state} · Look up at the building terrace canopy
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsStreetViewOpen(false)}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                    title="Close Street View"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Panorama DOM Canvas */}
              <div ref={streetViewRef} className="w-full h-full relative bg-neutral-900">
                {!streetViewAvailable && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                    <Camera className="w-10 h-10 text-white/40" />
                    <p className="text-sm font-medium">
                      Street View Imagery is being resolved for this exact terrace coordinate.
                    </p>
                    <p className="text-xs text-white/60 max-w-md">
                      You can return to the satellite layer to inspect the rooftop coir-pith beds and vegetation canopy.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsStreetViewOpen(false)}
                      className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs mt-2"
                    >
                      Return to Satellite Map
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Legend Overlay */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-10 p-3 sm:p-4 rounded-2xl bg-white/95 dark:bg-[#1A2619]/95 backdrop-blur-md border border-[#243324]/10 dark:border-white/10 shadow-lg text-xs space-y-2 pointer-events-auto">
          <div className="flex items-center justify-between gap-4 font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">
            <span>South India Apiary Sites</span>
            <span className="text-[11px] font-normal text-[#657351] dark:text-[#A3B59E]">
              {selectedSite ? selectedSite.name : 'Select a pin'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-[#3B4D36] dark:text-[#CBD7C7]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              Karnataka (23)
            </span>
            <span className="flex items-center gap-1.5 text-[#3B4D36] dark:text-[#CBD7C7]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              Tamil Nadu (21)
            </span>
            <span className="flex items-center gap-1.5 text-[#3B4D36] dark:text-[#CBD7C7]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
              Kerala (19)
            </span>
            <span className="flex items-center gap-1.5 text-[#3B4D36] dark:text-[#CBD7C7]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
              Andhra & Tel. (16)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
