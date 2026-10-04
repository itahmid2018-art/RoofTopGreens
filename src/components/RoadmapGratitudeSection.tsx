import React from 'react';
import { motion } from 'motion/react';
import { STRATEGIC_ROADMAP, REPORT_METADATA } from '../data/reportData';

export const RoadmapGratitudeSection: React.FC = () => {
  return (
    <section
      id="strategic-roadmap-section"
      className="relative min-h-screen py-24 px-4 sm:px-8 lg:px-12 flex flex-col justify-center border-t border-[#243324]/10 dark:border-white/10 bg-white dark:bg-[#131D12] text-[#243324] dark:text-[#F4EFE6] transition-colors duration-400"
    >
      <div className="max-w-6xl mx-auto w-full space-y-20">
        {/* Section Headline */}
        <div className="space-y-4 max-w-4xl">
          <p className="text-sm font-medium tracking-wide text-[#657351] dark:text-[#A3B59E]">
            Strategic Horizons
          </p>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-[1.02] tracking-tight">
            Our 2027 vision for a cooler, greener South India.
          </h2>
          <p className="text-lg sm:text-xl text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
            Four key commitments to expand riparian bio-corridors into Tier-2 urban basins, empower women-led micro-enterprises, and deploy solar acoustic biosensors across state climate monitoring networks.
          </p>
        </div>

        {/* 4 Strategic Pillars - Sandstone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {STRATEGIC_ROADMAP.map((goal, idx) => (
            <motion.div
              key={goal.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: idx * 0.08 }}
              className="p-8 sm:p-10 rounded-[2.5rem] bg-[#F5F2EB] dark:bg-[#233522] border border-[#243324]/10 dark:border-white/12 shadow-sm space-y-4 flex flex-col justify-between transition-colors duration-400"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
                    {goal.pillar}
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-[#1F2B1D] dark:text-[#F4EFE6]">
                  {goal.title}
                </h3>
                <p className="text-base text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
                  {goal.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#243324]/10 dark:border-white/10 flex items-baseline justify-between">
                <span className="text-xs text-[#657351] dark:text-[#A3B59E] uppercase tracking-wider">Target Milestone</span>
                <span className="font-display text-2xl sm:text-3xl text-[#1F2B1D] dark:text-[#F4EFE6] font-medium">
                  {goal.metric}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Founder Letter / Closing Statement */}
        <div className="p-10 sm:p-14 rounded-[2.5rem] sm:rounded-[3.5rem] bg-[#1F2B1D] dark:bg-[#1E2E1D] text-white shadow-xl space-y-8 border border-transparent dark:border-white/10 transition-colors duration-400">
          <div className="max-w-3xl space-y-6">
            <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl text-white dark:text-[#F4EFE6] font-light leading-snug">
              “{REPORT_METADATA.founderQuote}”
            </blockquote>
            <div>
              <p className="text-lg font-medium text-[#E8DCC4]">{REPORT_METADATA.founder}</p>
              <p className="text-sm text-white/70 dark:text-[#F4EFE6]/70 font-light">{REPORT_METADATA.founderTitle}</p>
              <p className="text-xs text-white/50 pt-0.5">{REPORT_METADATA.legalEntity}</p>
            </div>
          </div>
        </div>

        {/* Call to Action: DIY Rooftop Guide */}
        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#EBF5ED] dark:bg-[#1B291A] border border-[#10B981]/25 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#059669] dark:text-[#34D399]">
              Community Civic Playbook
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal">
              Want to set up your own rooftop garden?
            </h3>
            <p className="text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light max-w-2xl">
              Access our complete DIY Blueprint Generator: calculate lightweight coir substrate mixes, structural RCC loads, native pollinator plants, and gentle stingless bee installations tailored to Bengaluru, Chennai, Kochi, or Hyderabad.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-start md:self-auto shrink-0">
            <a
              href="/gallery"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/gallery');
                window.dispatchEvent(new PopStateEvent('popstate'));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3.5 rounded-2xl bg-white dark:bg-[#233522] border border-[#243324]/15 dark:border-white/15 text-[#1F2B1D] dark:text-[#F4EFE6] hover:bg-black/5 dark:hover:bg-white/5 font-medium text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
            >
              <span>View Community Gallery</span>
            </a>

            <a
              href="/guides"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/guides');
                window.dispatchEvent(new PopStateEvent('popstate'));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3.5 rounded-2xl bg-[#1F2B1D] dark:bg-[#10B981] hover:bg-[#2F452D] text-white dark:text-[#0C170B] font-medium text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
            >
              <span>Open Setup Guide</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-[#243324]/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#657351] dark:text-[#A3B59E] font-light">
          <p>© 2026 {REPORT_METADATA.legalEntity}. {REPORT_METADATA.societyRegNumber}.</p>
          <p>Crafted for South India’s living urban ecosystem · Karnataka · Tamil Nadu · Kerala · Andhra Pradesh · Telangana.</p>
        </footer>
      </div>
    </section>
  );
};
