import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { AnimatedNumber } from './AnimatedNumber';
import { CommunityImpactCalculator } from './CommunityImpactCalculator';
import { REPORT_METADATA } from '../data/reportData';
import { IMAGES } from '../assets/images';

export const FoodSharingSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98]);

  return (
    <section
      ref={containerRef}
      id="food-equity-section"
      className="relative min-h-screen py-24 px-4 sm:px-8 lg:px-12 flex flex-col justify-center border-t border-[#243324]/10 dark:border-white/10 bg-[#FBF9F5] dark:bg-[#131D12] text-[#243324] dark:text-[#F4EFE6] transition-colors duration-400"
    >
      <div className="max-w-6xl mx-auto w-full space-y-16">
        {/* Headline */}
        <div className="space-y-4 max-w-4xl">
          <p className="text-sm font-medium tracking-wide text-[#657351] dark:text-[#A3B59E]">
            Food Equity & Nutrition
          </p>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-[1.02] tracking-tight">
            Turning pure rooftop honey into nourishment for local Anganwadis.
          </h2>
          <p className="text-lg sm:text-xl text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
            Rather than bottling honey exclusively for luxury boutique shelves, our community model channels over 4,200 jars of raw multifloral and medicinal Cheruthen (stingless bee) honey directly to government child care centers, municipal mid-day meal programs, and elderly wellness homes.
          </p>
        </div>

        {/* Visual & Metric Integration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual */}
          <motion.div
            style={{ scale: imageScale }}
            className="lg:col-span-6 h-[440px] sm:h-[520px] rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-lg relative bg-[#1F2B1D]"
          >
            <img
              src={IMAGES.honeyHarvest}
              alt="Fresh golden Cheruthen stingless bee honey harvest and terracotta clay pots in South India"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F2B1D]/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-8 left-8 right-8 text-white z-10">
              <p className="font-display text-2xl sm:text-3xl font-light">
                Unfiltered, cold-extracted honey rich in native pollen from Murungai, Tulasi, and Kani Konna.
              </p>
            </div>
          </motion.div>

          {/* Impact Stats */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#F5F2EB] dark:bg-[#233522] border border-[#243324]/10 dark:border-white/12 shadow-sm space-y-3 transition-colors duration-400">
              <div className="font-display text-5xl sm:text-6xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light tracking-tight">
                <AnimatedNumber value={REPORT_METADATA.jarsDonated} />
              </div>
              <p className="text-base text-[#1F2B1D] dark:text-[#F4EFE6] font-medium">Jars Donated to Anganwadis & Clinics</p>
              <p className="text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
                Directly distributed to young children and nursing mothers facing nutritional deficits, paired with medicinal guides for traditional Ayurvedic respiratory wellness.
              </p>
            </div>

            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#F5F2EB] dark:bg-[#233522] border border-[#243324]/10 dark:border-white/12 shadow-sm space-y-3 transition-colors duration-400">
              <div className="font-display text-5xl sm:text-6xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light tracking-tight">
                <AnimatedNumber value={REPORT_METADATA.honeyHarvestKg} suffix=" kg" />
              </div>
              <p className="text-base text-[#1F2B1D] dark:text-[#F4EFE6] font-medium">Total 2026 Raw Harvest</p>
              <p className="text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
                Harvested strictly following ethical apiculture standards, reserving surplus honey stores inside each colony for sustenance during severe monsoon downpours.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Community Impact Calculator Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
        >
          <CommunityImpactCalculator />
        </motion.div>
      </div>
    </section>
  );
};
