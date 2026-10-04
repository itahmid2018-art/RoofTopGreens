import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CloudRain,
  AlertTriangle,
  Radio,
  RefreshCw,
  Droplets,
  Wind,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  Activity,
  CheckCircle2,
  Gauge,
  SlidersHorizontal,
} from 'lucide-react';
import {
  fetchLatestMonsoonAlerts,
  StateMonsoonAlert,
  MonsoonAlertResponse,
  AlertSeverity,
} from '../services/monsoonAlertService';
import { useTheme } from '../context/ThemeContext';

export const EcoAlertTicker: React.FC = () => {
  const { isDark } = useTheme();
  const [alertData, setAlertData] = useState<MonsoonAlertResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeAlertIndex, setActiveAlertIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');

  const loadAlerts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchLatestMonsoonAlerts();
      setAlertData(response);
    } catch (err) {
      console.error('Failed to fetch monsoon alerts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  // Filter alerts by state
  const displayedAlerts = alertData?.alerts
    ? selectedStateFilter === 'all'
      ? alertData.alerts
      : alertData.alerts.filter((a) => a.stateId === selectedStateFilter)
    : [];

  // Auto-cycle through alerts every 6 seconds if not paused
  useEffect(() => {
    if (isPaused || displayedAlerts.length <= 1) return;

    const timer = setInterval(() => {
      setActiveAlertIndex((prev) => (prev + 1) % displayedAlerts.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, displayedAlerts.length]);

  const currentAlert: StateMonsoonAlert | undefined = displayedAlerts[activeAlertIndex] || displayedAlerts[0];

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'active':
        return {
          bg: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
          dot: 'bg-rose-500',
          label: 'Active Monsoon Surge',
        };
      case 'watch':
        return {
          bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
          dot: 'bg-amber-500',
          label: 'Cyclonic Trough Watch',
        };
      case 'advisory':
        return {
          bg: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30',
          dot: 'bg-sky-500',
          label: 'Convective Rain Advisory',
        };
      case 'normal':
      default:
        return {
          bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-500',
          label: 'Normal Flow & Retention',
        };
    }
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full rounded-2xl sm:rounded-3xl bg-white dark:bg-[#1C2A1B] border border-[#243324]/12 dark:border-white/12 shadow-md overflow-hidden transition-all duration-300"
    >
      {/* Top Banner Bar */}
      <div className="p-3 sm:p-4 px-4 sm:px-6 bg-[#F5F2EB]/90 dark:bg-[#162315]/90 border-b border-[#243324]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#059669] dark:text-[#34D399] text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
            </span>
            <span className="tracking-wide uppercase text-[10px]">Eco-Alert Live Telemetry</span>
          </div>
          <span className="text-xs text-[#657351] dark:text-[#A3B59E] hidden md:inline">
            IMD Radar & Rooftop Sponge Infiltration Network
          </span>
        </div>

        {/* State Filter Buttons & Refresh */}
        <div className="flex items-center gap-2 text-xs">
          <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-white dark:bg-[#233522] border border-[#243324]/10 dark:border-white/10 text-[11px]">
            <button
              type="button"
              onClick={() => {
                setSelectedStateFilter('all');
                setActiveAlertIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedStateFilter === 'all'
                  ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                  : 'text-[#4A5D44] dark:text-[#CBD7C7]'
              }`}
            >
              All 4 States
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedStateFilter('kerala');
                setActiveAlertIndex(0);
              }}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                selectedStateFilter === 'kerala'
                  ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                  : 'text-[#4A5D44] dark:text-[#CBD7C7]'
              }`}
            >
              Kerala
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedStateFilter('tamil_nadu');
                setActiveAlertIndex(0);
              }}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                selectedStateFilter === 'tamil_nadu'
                  ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                  : 'text-[#4A5D44] dark:text-[#CBD7C7]'
              }`}
            >
              Tamil Nadu
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedStateFilter('karnataka');
                setActiveAlertIndex(0);
              }}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                selectedStateFilter === 'karnataka'
                  ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                  : 'text-[#4A5D44] dark:text-[#CBD7C7]'
              }`}
            >
              Karnataka
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedStateFilter('andhra_pradesh');
                setActiveAlertIndex(0);
              }}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                selectedStateFilter === 'andhra_pradesh'
                  ? 'bg-[#1F2B1D] dark:bg-[#344E32] text-white shadow-xs'
                  : 'text-[#4A5D44] dark:text-[#CBD7C7]'
              }`}
            >
              Andhra
            </button>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={loadAlerts}
            disabled={isLoading}
            title="Refresh IMD Telemetry"
            className="p-1.5 px-2 rounded-xl bg-white dark:bg-[#233522] border border-[#243324]/10 dark:border-white/10 text-[#1F2B1D] dark:text-[#F4EFE6] hover:bg-black/5 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#10B981]' : ''}`} />
            <span className="text-[10px] hidden xs:inline">{alertData?.timestamp || 'Sync'}</span>
          </button>
        </div>
      </div>

      {/* Main Ticker Stream Line */}
      <div className="p-4 sm:p-5 px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {currentAlert ? (
          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display font-medium text-base text-[#1F2B1D] dark:text-[#F4EFE6]">
                {currentAlert.stateName} ({currentAlert.regionalHub})
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${
                  getSeverityBadge(currentAlert.severity).bg
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${getSeverityBadge(currentAlert.severity).dot}`} />
                {getSeverityBadge(currentAlert.severity).label}
              </span>
              <span className="text-xs text-[#657351] dark:text-[#A3B59E]">
                · {currentAlert.monsoonType}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-snug">
              <strong className="font-medium text-[#1F2B1D] dark:text-[#F4EFE6]">
                {currentAlert.alertTitle}:{' '}
              </strong>
              {currentAlert.ecologicalAction}
            </p>
          </div>
        ) : (
          <div className="flex-1 py-2 text-xs text-[#657351] dark:text-[#A3B59E] flex items-center gap-2">
            <Activity className="w-4 h-4 animate-spin text-[#10B981]" />
            Connecting to mock IMD meteorological stream...
          </div>
        )}

        {/* Ticker Quick Telemetry Badges & Expand Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          {currentAlert && (
            <div className="hidden lg:flex items-center gap-3 text-xs border-l border-[#243324]/10 dark:border-white/10 pl-4">
              <div className="space-y-0.5 text-right">
                <span className="text-[10px] text-[#657351] dark:text-[#A3B59E] block">Precipitation</span>
                <span className="font-semibold text-[#0284C7] dark:text-[#38BDF8]">
                  {currentAlert.currentPrecipitationMmHr} mm/hr
                </span>
              </div>
              <div className="space-y-0.5 text-right">
                <span className="text-[10px] text-[#657351] dark:text-[#A3B59E] block">Sponge Storage</span>
                <span className="font-semibold text-[#10B981] dark:text-[#34D399]">
                  {currentAlert.terraceCapacityUsedPercent}% Full
                </span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 rounded-xl bg-[#F5F2EB] dark:bg-[#233522] hover:bg-[#E8EFE5] text-[#1F2B1D] dark:text-[#F4EFE6] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Hide Details' : 'Station Telemetry'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded Multi-Station Telemetry Grid */}
      <AnimatePresence>
        {isExpanded && alertData && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-[#243324]/10 dark:border-white/10 bg-[#FAF8F3] dark:bg-[#142013] p-4 sm:p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
                All 4 States Live Sensor Feeds · {alertData.timestamp}
              </span>
              <span className="text-xs text-[#10B981]">
                Total Network Infiltration Rate: <strong>{alertData.overallNetworkAbsorptionRateLPerSec} L/sec</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {alertData.alerts.map((alert) => {
                const badge = getSeverityBadge(alert.severity);
                return (
                  <div
                    key={alert.stateId}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#1E2D1D] border border-[#243324]/10 dark:border-white/10 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-medium text-sm text-[#1F2B1D] dark:text-[#F4EFE6]">
                        {alert.stateName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#657351] dark:text-[#A3B59E]">
                      {alert.regionalHub} · {alert.imdStationCode}
                    </p>

                    <div className="space-y-1 pt-1 border-t border-[#243324]/10 dark:border-white/10 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-[#657351] dark:text-[#A3B59E]">Rate:</span>
                        <strong className="text-[#0284C7] dark:text-[#38BDF8]">{alert.currentPrecipitationMmHr} mm/hr</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#657351] dark:text-[#A3B59E]">24h Forecast:</span>
                        <strong className="text-[#1F2B1D] dark:text-[#F4EFE6]">{alert.expected24hRainfallMm} mm</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#657351] dark:text-[#A3B59E]">Sponge Retention:</span>
                        <strong className="text-[#10B981] dark:text-[#34D399]">{alert.terraceCapacityUsedPercent}%</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
