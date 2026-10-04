/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar, AppRoute } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { OverviewSection } from './components/OverviewSection';
import { BoroughCorridorSection } from './components/BoroughCorridorSection';
import { StormwaterClimateSection } from './components/StormwaterClimateSection';
import { SectorImpactSection } from './components/SectorImpactSection';
import { FoodSharingSection } from './components/FoodSharingSection';
import { EducationSection } from './components/EducationSection';
import { RoadmapGratitudeSection } from './components/RoadmapGratitudeSection';
import { RooftopGuidePage } from './components/RooftopGuidePage';
import { RooftopGalleryPage } from './components/RooftopGalleryPage';

function checkCurrentRoute(): AppRoute {
  if (typeof window === 'undefined') return 'report';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  if (path === '/gallery' || path.startsWith('/gallery/') || hash === '#/gallery' || hash.startsWith('#/gallery')) {
    return 'gallery';
  }
  if (path === '/guides' || path.startsWith('/guides/') || hash === '#/guides' || hash.startsWith('#/guides')) {
    return 'guides';
  }
  return 'report';
}

function MainContent() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => checkCurrentRoute());
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // Sync route on popstate and hashchange (browser forward/back)
  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentRoute(checkCurrentRoute());
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Update browser document title based on route
  useEffect(() => {
    if (currentRoute === 'gallery') {
      document.title = 'Community Rooftop Gallery · South India Living Ecosystem';
    } else if (currentRoute === 'guides') {
      document.title = 'DIY Rooftop Bio-Haven Setup Guide · South India 2026';
    } else {
      document.title = 'South India’s Living Urban Ecosystem: 2026 Annual Report';
    }
  }, [currentRoute]);

  // Google Maps Quota Listener
  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  const handleNavigate = useCallback((route: AppRoute) => {
    const path = route === 'report' ? '/' : `/${route}`;
    window.history.pushState({}, '', path);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <div className="relative min-h-screen bg-[#FBF9F5] dark:bg-[#131D12] text-[#243324] dark:text-[#F4EFE6] font-sans antialiased selection:bg-[#E8DCC4] dark:selection:bg-[#384F35] selection:text-[#1F2B1D] dark:selection:text-[#F4EFE6] transition-colors duration-400">
      {/* Google Maps Quota Defense Notice */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Floating Navigation Bar with route switcher */}
      <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />

      {/* Top Reading Progress Bar (only on main report) */}
      {currentRoute === 'report' && (
        <motion.div
          style={{ scaleX }}
          className="fixed top-0 left-0 right-0 h-1 bg-[#3B4D36] dark:bg-[#4A6D47] origin-left z-50 pointer-events-none transition-colors duration-300"
        />
      )}

      {/* Route Views */}
      {currentRoute === 'gallery' ? (
        <RooftopGalleryPage onNavigateHome={() => handleNavigate('report')} />
      ) : currentRoute === 'guides' ? (
        <RooftopGuidePage onNavigateHome={() => handleNavigate('report')} />
      ) : (
        <main className="w-full overflow-x-hidden">
          <HeroSection />
          <OverviewSection />
          <BoroughCorridorSection />
          <StormwaterClimateSection />
          <SectorImpactSection />
          <FoodSharingSection />
          <EducationSection />
          <RoadmapGratitudeSection />
        </main>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}
