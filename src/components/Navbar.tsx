import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { Sun, Moon, BookOpen, Home, Camera } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type AppRoute = 'report' | 'guides' | 'gallery';

interface NavbarProps {
  currentRoute?: AppRoute;
  onNavigate?: (route: AppRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute = 'report', onNavigate }) => {
  const { scrollY } = useScroll();
  const { isDark, toggleTheme } = useTheme();
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    // Switch state once user scrolls past 70% of the viewport (exiting the hero section)
    const threshold = typeof window !== 'undefined' ? window.innerHeight * 0.7 : 550;
    setIsScrolledPastHero(latest >= threshold);
  });

  const reportTextColor = isScrolledPastHero
    ? isDark
      ? 'text-[#F4EFE6]'
      : 'text-[#1F2B1D]'
    : 'text-[#F4EFE6] drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]';

  const handleNavClick = (route: AppRoute) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      const path = route === 'report' ? '/' : `/${route}`;
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 sm:py-5 px-4 sm:px-8 lg:px-12 pointer-events-none flex justify-between items-center transition-colors duration-500">
      {/* Top Left: Direct Route Switcher Pill */}
      <div className="pointer-events-auto flex items-center gap-2">
        <div className="flex items-center p-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-md text-xs">
          <button
            type="button"
            onClick={() => handleNavClick('report')}
            className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              currentRoute === 'report'
                ? 'bg-white text-[#1F2B1D] shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Annual Report</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('guides')}
            className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              currentRoute === 'guides'
                ? 'bg-[#10B981] text-white shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>DIY Guide</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('gallery')}
            className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              currentRoute === 'gallery'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Gallery</span>
          </button>
        </div>
      </div>

      {/* Top Right: "2026 REPORT" & Sun/Moon Dark Mode Toggle */}
      <div className="pointer-events-auto flex items-center gap-3 sm:gap-5">
        <div className={`transition-colors duration-300 ${reportTextColor}`}>
          <span className="text-xs sm:text-sm font-medium tracking-widest uppercase select-none hidden sm:inline-block">
            South India · 2026
          </span>
        </div>

        {/* Sun / Moon Theme Toggle Button */}
        <button
          id="theme-toggle-btn"
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 sm:p-2.5 rounded-full border border-white/30 bg-black/40 hover:bg-black/60 backdrop-blur-md transition-colors duration-200 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50 text-white shadow-md"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="sun-icon"
                initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="moon-icon"
                initial={{ rotate: 90, scale: 0.7, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
};
