import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout,
  Droplets,
  Layers,
  ShieldCheck,
  Flower2,
  Bug,
  ThermometerSun,
  Scale,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Download,
  Info,
  Sparkles,
  BookOpen,
  Home,
  Check,
  ChevronDown,
  Building,
  Sun,
  CloudRain,
  Compass,
  HelpCircle,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CityRecommendation {
  id: string;
  name: string;
  state: string;
  climateTag: string;
  substrateFormula: string;
  floraRecommendations: {
    category: string;
    plants: string[];
    nectarPeriod: string;
  }[];
  waterRetentionTip: string;
  beeSpeciesNote: string;
}

const CITY_RECOMMENDATIONS: Record<string, CityRecommendation> = {
  bengaluru: {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    climateTag: 'Semi-Arid Deccan Plateau (Moderate Elevation, Intense Convective Showers)',
    substrateFormula: '50% Washed Coir Pith + 30% Aged Vermicompost + 15% Red Garden Soil + 5% Crushed Charcoal (Dry weight ~18 kg/m²)',
    floraRecommendations: [
      { category: 'Nectar Herbs', plants: ['Krishna Tulasi (Holy Basil)', 'Lemongrass', 'Ram Tulasi', 'Ajwain (Mexican Mint)'], nectarPeriod: 'Year-Round' },
      { category: 'Native Flowering', plants: ['Kani Konna (Cassia fistula)', 'Tecoma Stans', 'Sankhupushpam (Butterfly Pea)'], nectarPeriod: 'March – October' },
      { category: 'Nutritional Greenery', plants: ['Moringa (Drumstick tree - dwarf)', 'Curry Leaf', 'Agathi Keerai'], nectarPeriod: 'Post-Monsoon' },
    ],
    waterRetentionTip: 'Install 25mm dimpled drainage cell under coir beds. During pre-monsoon convective thunderstorms, beds buffer up to 45 Litres/m² before runoff.',
    beeSpeciesNote: 'Ideal for Tetragonula iridipennis (Stingless Indian honey bee). Place wooden hive boxes in shaded east-facing alcoves sheltered from cold northerly winter winds.',
  },
  chennai: {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    climateTag: 'Tropical Wet-and-Dry Coastal (High Humidity, Coromandel Northeast Monsoon)',
    substrateFormula: '55% Double-Washed Low-Salinity Coir Pith + 25% Enriched Vermicompost + 10% River Sand + 10% Rice Husk Ash',
    floraRecommendations: [
      { category: 'Coastal Resilient', plants: ['Vada Malli (Gomphrena)', 'Madagascar Periwinkle', 'Portulaca (10 O’Clock Flower)'], nectarPeriod: 'Year-Round' },
      { category: 'Medicinal Herbs', plants: ['Karisalanganni (Bhringraj)', 'Keezhanelli', 'Thuthuvalai (Solanum trilobatum)'], nectarPeriod: 'October – February' },
      { category: 'Climbers & Shade', plants: ['Sankhupushpam (Clitoria ternatea)', 'Kovakkai (Ivy Gourd)', 'Pirandai'], nectarPeriod: 'Monsoon Peaks' },
    ],
    waterRetentionTip: 'High salt air requires double-washed coir. Direct rooftop drainage outlets through coarse gravel filters into secondary rainwater recharge wells to counteract coastal saline ingress.',
    beeSpeciesNote: 'Cheruthen bees thrive in Chennai coastal moisture. Ensure hive boxes have UV-resistant terracotta roof tiles or wooden shade overhangs to prevent internal cavity heat exceeding 34°C in May.',
  },
  kochi: {
    id: 'kochi',
    name: 'Kochi & Malabar',
    state: 'Kerala',
    climateTag: 'Tropical Monsoon (Heavy Rainfall 3,100mm+, High Humidity)',
    substrateFormula: '40% Aerated Coir Pith + 30% Perlite/Coarse Sand + 20% Leaf Mould Compost + 10% Biochar (Ultra-Free Draining)',
    floraRecommendations: [
      { category: 'Spices & Medicinal', plants: ['Kurumulaku (Wild Pepper)', 'Ramacham (Vetiver grass)', 'Panikoorka (Coleus)'], nectarPeriod: 'June – January' },
      { category: 'Traditional Blossoms', plants: ['Chethi (Ixora coccinea)', 'Mulla (Jasmine)', 'Mandaram (Bauhinia)'], nectarPeriod: 'All Seasons' },
      { category: 'Shade Canopy', plants: ['Murungai (Moringa)', 'Kanji Bush', 'Native Passion Fruit climber'], nectarPeriod: 'Post-Edavappathi' },
    ],
    waterRetentionTip: 'Sustained monsoon rains can cause waterlogging. Use geotextile-lined raised planter crates with dual overflow weep holes 5cm above the floor to avoid root asphyxiation.',
    beeSpeciesNote: 'Tetragonula iridipennis is indigenous to Kerala’s backwater groves. Equip hives with rain guards to prevent monsoon droplet splash-in at the propolis entrance tube.',
  },
  hyderabad: {
    id: 'hyderabad',
    name: 'Hyderabad & AP',
    state: 'Andhra Pradesh & Telangana',
    climateTag: 'Hot Semi-Arid (Summer temperatures up to 43°C, Moderate Monsoon)',
    substrateFormula: '60% Moisture-Holding Coir Pith + 25% Bio-Compost + 10% Vermiculite + 5% Neem Cake (Deters root nematodes and retains critical summer hydration)',
    floraRecommendations: [
      { category: 'Drought-Hardy Nectar', plants: ['Neem (potted pruning)', 'Ganga Ravi', 'Bougainvillea (Dwarf)', 'Nerium'], nectarPeriod: 'March – November' },
      { category: 'Fragrant Pollinators', plants: ['Gundu Malli (Arabian Jasmine)', 'Crossandra (Kanakambaram)', 'Tulasi'], nectarPeriod: 'Summer & Monsoon' },
      { category: 'Terrace Greens', plants: ['Gongura (Sorrel leaves)', 'Pala Kura (Spinach)', 'Dwarf Pomegranate'], nectarPeriod: 'Winter – Spring' },
    ],
    waterRetentionTip: 'In extreme summer heat, apply a 3-inch mulch layer of dry coconut husks over coir beds. This reduces terrace evaporation by 65% and drops ceiling temperatures by 4–6°C.',
    beeSpeciesNote: 'Place hives under a 50% green agro-shade net. During peak May heat, provide a shallow terracotta saucer with pebbles and clean water for bees to drink without drowning.',
  },
};

const STEP_GUIDES = [
  {
    step: '01',
    title: 'Structural Safety & RCC Slab Load Audit',
    icon: Scale,
    summary: 'Ensuring your concrete roof slab can safely carry green beds, water weight, and human traffic.',
    details: [
      'Standard residential RCC roof slabs in South India (built under IS 456 codes) are rated for an imposed dead/live load of 150–200 kg/m².',
      'Never use heavy traditional agricultural garden soil (1,400–1,800 kg/m³ when water-saturated). This induces severe structural deflection and micro-cracking.',
      'Our engineered coir-pith substrate weighs only 350–450 kg/m³ at full water saturation, safely remaining well below 30% of your slab’s allowable limit.',
      'Concentrate heavy planter boxes and 200L water storage barrels directly over load-bearing structural columns and beams, never in the middle of long unsupported spans.',
    ],
  },
  {
    step: '02',
    title: 'Waterproofing Membrane & Drain Cell Layering',
    icon: Layers,
    summary: 'A 4-tier barrier system ensuring 100% root resistance, thermal decoupling, and zero ceiling dampness.',
    details: [
      'Layer 1 (Substrate base): Apply two coats of cold-applied elastomeric acrylic/polyurethane waterproofing sealant over clean, dried roof screed, cured for 72 hours.',
      'Layer 2 (Root Barrier): Lay a 0.5mm UV-stabilized high-density polyethylene (HDPE) root-resistant barrier sheet with 150mm taped overlaps.',
      'Layer 3 (Drainage Core): Lay 20mm or 30mm interlocking polypropylene dimpled drainage cells. These channel excess cloudburst waters freely toward rainwater downspouts.',
      'Layer 4 (Filter Fabric): Roll out 120–150 GSM non-woven geotextile fleece over the drain cells. This holds the coir mix in place while allowing clean filtered water to pass.',
    ],
  },
  {
    step: '03',
    title: 'Ultra-Lightweight Coir Pith & Microbe Substrate Mix',
    icon: Sprout,
    summary: 'The proven soil-less recipe that retains 8x its weight in rainwater while fostering mycorrhizal fungi.',
    details: [
      'Raw coir pith must be soaked, drained, and washed 2–3 times with fresh water to leach out electrical conductivity (EC < 0.8 mS/cm) and sodium salts.',
      'Blend 50% washed coir pith, 30% aged vermicompost, 10% red earth or sand, 5% biochar, and 5% neem seed meal.',
      'Inoculate the blend with Trichoderma viride and Pseudomonas fluorescens bio-fertilizers. These beneficial microbes protect root zones from root-rot and damping-off.',
      'Spread the substrate to a depth of 15–20cm for herbs and groundcovers, and 25–35cm for dwarf trees and deep-rooted pollinators in modular planter bags.',
    ],
  },
  {
    step: '04',
    title: 'Indigenous Pollinator Flora & Bloom Rotation',
    icon: Flower2,
    summary: 'Curating native South Indian nectar and pollen sources to provide continuous forage through every season.',
    details: [
      'Prioritize indigenous species like Krishna Tulasi, Ram Tulasi, Sankhupushpam, Murungai, and Curry Leaf that co-evolved with native bees.',
      'Avoid high-maintenance hybrid ornamental flowers bred for human aesthetics that produce zero pollen and sterile nectar glands.',
      'Arrange tall plants (Moringa, dwarf lemon) on the southwest perimeter to act as a living windbreak against strong pre-monsoon squalls.',
      'Companion-plant Marigold (Tagetes erecta) and Mexican Mint around vegetables to naturally repel whiteflies, aphids, and nematodes without chemicals.',
    ],
  },
  {
    step: '05',
    title: 'Stingless Bee (Cheruthen) Safe Colony Installation',
    icon: Bug,
    summary: 'Welcoming 1,500 gentle native pollinators (Tetragonula iridipennis) to your terrace.',
    details: [
      'Stingless bees (Cheruthen) possess reduced, non-functional stingers and are 100% gentle and safe around curious children, elderly residents, and domestic pets.',
      'Mount wooden hive boxes at chest height (1.2–1.5m) under a sun-sheltered awning or veranda overhang facing east or northeast to catch early morning sunshine.',
      'Position an ant-well (water moat with a drop of cooking oil) around the hive mounting bracket to prevent black ants and predatory weaver ants from entering.',
      'Never harvest brood comb. In year two, extract only small surplus medicinal honey pots (150–400g/year) using a sterilized blunt syringe, leaving sufficient reserves.',
    ],
  },
  {
    step: '06',
    title: 'Monsoon Rain Harvesting & Overflow Diversion',
    icon: Droplets,
    summary: 'Transforming your terrace into an urban sponge that recharges local groundwater.',
    details: [
      'Connect the geotextile-filtered drainage cell discharge to your building’s existing rainwater harvesting (RWH) downpipe.',
      'Install a simple first-flush sediment filter box before leading clean overflow to a percolation pit or open ring well.',
      'A 500 sq ft rooftop sponge garden intercepts approximately 55,000 Litres of rain annually, keeping stormwater out of congested municipal gutters.',
      'During dry months, utilize a low-pressure drip irrigation kit with an automated 9V battery timer set for early morning watering (6:00 AM) to minimize evaporation.',
    ],
  },
];

interface FaqItem {
  id: string;
  category: 'apiary' | 'irrigation';
  question: string;
  answer: string;
  keyTakeaway: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'apiary-summer-heat',
    category: 'apiary',
    question: 'How do I protect stingless bee hives during extreme 40°C+ summer heatwaves in cities like Hyderabad and Chennai?',
    answer: 'Stingless bees (Tetragonula iridipennis) regulate hive core temperature through physical propolis ventilation and evaporative fanning. When terrace temperatures exceed 38°C, install a 50% green agro-shade net 1.5 metres above the boxes, or place a curved terracotta roof tile with a 2cm air-gap over the wooden roof. Crucially, position a shallow terracotta saucer filled with clean water and pea gravel nearby. The gravel allows bees to drink safely without risk of drowning, which they carry into the colony to evaporatively cool the brood chamber.',
    keyTakeaway: 'Maintain external shade and a gravel-filled bee water saucer; never let direct noon sun heat bare wooden box walls.',
  },
  {
    id: 'irrigation-monsoon-calibration',
    category: 'irrigation',
    question: 'How should drip irrigation schedules be adjusted between blistering dry months and torrential monsoon downpours?',
    answer: 'During peak dry season (March–May), set automated drip cycles to run twice daily for 12–15 minutes at dawn (6:00 AM) and dusk (5:30 PM), delivering approximately 2.5–3 Litres per square metre directly to root zones. When monsoon showers arrive, switch the controller to manual or install an inline mechanical rain sensor switch (available for ~₹800). This automatically bypasses drip cycles once 5mm of rainfall has fallen, preventing over-saturation while conserving pump electricity.',
    keyTakeaway: 'Use dawn/dusk drip cycles in summer to minimize evaporation; automate monsoon shutoff using an inline rain sensor.',
  },
  {
    id: 'apiary-monsoon-feeding',
    category: 'apiary',
    question: 'Do stingless bees need supplementary feeding during prolonged monsoon downpours?',
    answer: 'If continuous monsoon downpours prevent bees from foraging for more than 4 consecutive days, natural nectar stores can deplete. Prepare an emergency feed using a 1:1 ratio of boiled cooled water with pure organic jaggery or floral honey. Place 10–15 drops inside an inverted bottle feeder or an inverted bottle cap with wooden toothpicks inside the hive entrance or veranda alcove. Never leave open sugar syrup bowls on the terrace, as they attract predatory wasps, black ants, and robber bee colonies.',
    keyTakeaway: 'Provide internal inverted cap feeding only if storms halt foraging for 4+ consecutive days.',
  },
  {
    id: 'irrigation-waterlogging-prevention',
    category: 'irrigation',
    question: 'How do I prevent lightweight coir-pith substrate from becoming waterlogged or rotting plant roots in cloudbursts?',
    answer: 'Waterlogging is prevented entirely through subsurface drainage engineering rather than reducing watering. Lay 25mm interlocking dimpled drain cells wrapped in 150 GSM non-woven needle-punched geotextile fleece beneath the coir substrate. Ensure raised planter boxes have secondary weep holes drilled 3cm above the base. Incorporating 10% biochar and 10% coarse perlite or river sand into the coir pith creates persistent air channels that drain 50mm/hr cloudbursts with zero ponding.',
    keyTakeaway: 'A dimpled drain cell layer and 150 GSM geotextile fleece allow water to escape in minutes while keeping soil microbes intact.',
  },
  {
    id: 'apiary-ant-predator-defense',
    category: 'apiary',
    question: 'How do I safeguard the hive against black ants, weaver ants, and wall lizards?',
    answer: 'Ants are the #1 natural predator of domestic stingless bee colonies. Mount the hive box on a single vertical metal pipe stand fitted with an ant-well (a circular moat cup filled with water and 2 drops of neem or coconut oil to prevent surface tension). Ensure no overhanging tree branches, creeping vines, or clotheslines bridge the hive to adjacent parapet walls. For wall lizards, stingless bees naturally construct a long, sticky propolis entrance tube that deters lizards, but maintaining a clear 30cm clearance around the flight hole is recommended.',
    keyTakeaway: 'An oil-topped ant-well moat on the mounting post stops 100% of crawling ant attacks; keep wires and vines away from the box.',
  },
  {
    id: 'irrigation-ac-condensate-greywater',
    category: 'irrigation',
    question: 'Can air conditioner condensate water or domestic greywater be used for rooftop garden irrigation?',
    answer: 'Air conditioner condensate is pure, mineral-free distilled water with low electrical conductivity (TDS < 30 ppm) and zero chlorine, making it premier hydration for coir-pith beds, sensitive tulasi, and flowering creepers. A typical 1.5-ton AC generates 10–25 Litres of condensate daily in humid coastal cities like Chennai and Kochi. In contrast, avoid kitchen or washing machine greywater, which contains sodium, synthetic surfactants, and bleaching agents that kill beneficial soil mycorrhizae and burn leaf tips.',
    keyTakeaway: 'AC condensate is clean, distilled, and excellent for plants; avoid domestic laundry greywater due to harmful surfactants and salts.',
  },
  {
    id: 'apiary-honey-harvesting-safety',
    category: 'apiary',
    question: 'How often can I safely harvest stingless bee honey, and what tools are required to protect the colony?',
    answer: 'Harvest strictly once a year, preferably in late spring or immediately following post-monsoon blooms, when the colony has accumulated surplus honey pots. Never crush or slice brood comb. Carefully unseal the upper honey super chamber and identify the dark cerumen resin pots that contain ripe honey. Use a sterile 20ml syringe with a silicone cannula to puncture and gently extract 200–450 grams of honey, leaving at least 30% of honey reserves for the queen and developing larvae.',
    keyTakeaway: 'Harvest once a year using a sterile syringe; never crush brood cells and always leave 30% reserves for the hive.',
  },
  {
    id: 'irrigation-rwh-recharge-connection',
    category: 'irrigation',
    question: 'How do I channel excess terrace garden runoff into our building rainwater harvesting (RWH) recharge well?',
    answer: 'Direct the discharge pipe emerging from the geotextile drainage cells into a multi-chambered sediment settling filter containing coarse gravel (20mm), charcoal chips, and river sand. Because the non-woven geotextile fleece filters out 98% of soil particulates, the discharge water is crystal clear and low in turbidity. Lead the clean overflow through a PVC bypass into your residential apartment recharge well or open garden percolation pit to raise localized groundwater levels.',
    keyTakeaway: 'Geotextile fleece pre-filters runoff, allowing clean, non-turbid rainwater to recharge local borewells and open aquifers.',
  },
];

export const RooftopGuidePage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { isDark } = useTheme();

  // Configurator state
  const [selectedCity, setSelectedCity] = useState<string>('bengaluru');
  const [roofAreaSqFt, setRoofAreaSqFt] = useState<number>(350);
  const [sunlightHours, setSunlightHours] = useState<string>('full'); // 'full' | 'partial' | 'high_wind'
  const [openStepIdx, setOpenStepIdx] = useState<number>(0);
  const [copiedChecklist, setCopiedChecklist] = useState<boolean>(false);
  const [faqFilter, setFaqFilter] = useState<'all' | 'apiary' | 'irrigation'>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0].id);

  const filteredFaqs = useMemo(() => {
    if (faqFilter === 'all') return FAQ_ITEMS;
    return FAQ_ITEMS.filter((item) => item.category === faqFilter);
  }, [faqFilter]);

  const cityData = useMemo(() => {
    return CITY_RECOMMENDATIONS[selectedCity] || CITY_RECOMMENDATIONS.bengaluru;
  }, [selectedCity]);

  // Derived calculations for user's customized blueprint
  const estimatedCostInr = useMemo(() => {
    // Approx ₹180 - ₹240 per sq ft for complete setup including drain cells, geotextile, coir substrate, plants & drip
    const baseCost = roofAreaSqFt * 210;
    const beeBoxCost = roofAreaSqFt >= 200 ? 3500 : 0; // Hive box included for terraces >= 200 sq ft
    return Math.round(baseCost + beeBoxCost);
  }, [roofAreaSqFt]);

  const estimatedWaterSavedLitres = useMemo(() => {
    // ~110 Litres buffered per sq ft/year in South Indian monsoon
    return Math.round(roofAreaSqFt * 115);
  }, [roofAreaSqFt]);

  const estimatedHoneyKg = useMemo(() => {
    if (roofAreaSqFt < 200) return 0.25;
    return Math.round((roofAreaSqFt / 450) * 0.8 * 10) / 10;
  }, [roofAreaSqFt]);

  const estimatedTempDropC = useMemo(() => {
    if (roofAreaSqFt < 150) return 2.5;
    if (roofAreaSqFt < 600) return 4.2;
    return 5.4;
  }, [roofAreaSqFt]);

  const handleCopyChecklist = () => {
    const text = `
ROOFTOP BIO-SPONGE SETUP BLUEPRINT (${cityData.name}, ${cityData.state})
Target Area: ${roofAreaSqFt} sq ft | Sunlight: ${sunlightHours.toUpperCase()}

1. LOAD & WATERPROOFING:
   - Max allowable wet load: ~45 kg/m² (using coir pith substrate)
   - 2 coats elastomeric PU waterproofing + 0.5mm HDPE root barrier
   - 20mm interlocking dimpled drain cells + 150 GSM non-woven geotextile

2. SUBSTRATE MIX:
   ${cityData.substrateFormula}

3. RECOMMENDED FLORA:
${cityData.floraRecommendations.map((c) => `   - ${c.category}: ${c.plants.join(', ')}`).join('\n')}

4. ECOLOGICAL YIELDS:
   - Annual Rainwater Buffered: ~${estimatedWaterSavedLitres.toLocaleString()} Litres
   - Indoor Slab Temperature Drop: -${estimatedTempDropC}°C
   - Pure Cheruthen Honey Yield: ~${estimatedHoneyKg} kg/year
   - Estimated Material Budget: ₹${estimatedCostInr.toLocaleString()}

Source: South India Urban Apiary & Living Ecosystems 2026 Guidelines.
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedChecklist(true);
    setTimeout(() => setCopiedChecklist(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#131D12] text-[#243324] dark:text-[#F4EFE6] transition-colors duration-400">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 dark:bg-[#131D12]/90 backdrop-blur-md border-b border-[#243324]/10 dark:border-white/10 px-4 sm:px-8 lg:px-12 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#1F2B1D] dark:text-[#F4EFE6] hover:text-[#059669] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>← Back to 2026 Annual Report</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#10B981]/15 text-[#059669] dark:text-[#34D399]">
              DIY Rooftop Setup Guide
            </span>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 border-b border-[#243324]/10 dark:border-white/10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
              Community Civic Manual · Sub-Directory /guides
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal text-[#1F2B1D] dark:text-[#F4EFE6] leading-[1.05] tracking-tight">
            How to build an engineered rooftop bio-haven on South Indian concrete.
          </h1>

          <p className="text-lg sm:text-xl text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed max-w-4xl">
            A comprehensive, battle-tested manual for residents, apartment RWAs, and schools across Karnataka, Tamil Nadu, Kerala, and Andhra Pradesh. Learn how to convert bare RCC slabs into cooling sponge terraces that harvest cloudbursts, host gentle stingless bees, and drop ceiling temperatures by 5°C.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-16 space-y-20">
        {/* ======================================================== */}
        {/* INTERACTIVE ROOFTOP CONFIGURATOR WIDGET */}
        {/* ======================================================== */}
        <section className="p-6 sm:p-10 rounded-[2.5rem] bg-white dark:bg-[#1E2D1D] border border-[#243324]/10 dark:border-white/12 shadow-xl space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#243324]/10 dark:border-white/10">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
                Interactive Blueprint Generator
              </span>
              <h2 className="font-display text-2xl sm:text-4xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal">
                Customize Your Terrace Setup Blueprint
              </h2>
              <p className="text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light">
                Select your city and rooftop footprint to calculate exact substrate recipes, cost estimates, and native plant pairings.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyChecklist}
              className="px-4 py-2.5 rounded-xl bg-[#1F2B1D] dark:bg-[#2F452D] hover:bg-[#2B3B29] text-white text-xs font-medium flex items-center gap-2 self-start lg:self-auto cursor-pointer transition-colors shadow-xs"
            >
              {copiedChecklist ? <Check className="w-4 h-4 text-[#85E7B7]" /> : <Download className="w-4 h-4" />}
              <span>{copiedChecklist ? 'Blueprint Copied!' : 'Copy / Export Spec Sheet'}</span>
            </button>
          </div>

          {/* Configurator Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Control 1: City Selection */}
            <div className="space-y-2">
              <label htmlFor="city-select" className="text-xs font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E] block">
                1. Select City / Biome
              </label>
              <select
                id="city-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#F5F2EB] dark:bg-[#152214] border border-[#243324]/10 dark:border-white/10 text-sm text-[#1F2B1D] dark:text-[#F4EFE6] font-medium focus:outline-none focus:ring-2 focus:ring-[#10B981]"
              >
                <option value="bengaluru">Bengaluru (Karnataka)</option>
                <option value="chennai">Chennai (Tamil Nadu)</option>
                <option value="kochi">Kochi & Malabar (Kerala)</option>
                <option value="hyderabad">Hyderabad & AP (Deccan)</option>
              </select>
              <p className="text-[11px] text-[#657351] dark:text-[#A3B59E]">{cityData.climateTag}</p>
            </div>

            {/* Control 2: Terrace Area Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="terrace-area-slider" className="text-xs font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
                  2. Usable Terrace Area
                </label>
                <span className="font-display font-medium text-lg text-[#1F2B1D] dark:text-[#F4EFE6]">
                  {roofAreaSqFt} sq ft
                </span>
              </div>
              <input
                id="terrace-area-slider"
                type="range"
                min={50}
                max={2500}
                step={25}
                value={roofAreaSqFt}
                onChange={(e) => setRoofAreaSqFt(Number(e.target.value))}
                className="w-full h-2 bg-[#E2ECE0] dark:bg-[#253924] rounded-lg appearance-none cursor-pointer accent-[#10B981]"
              />
              <div className="flex justify-between text-[10px] text-[#657351] dark:text-[#A3B59E]">
                <span>Balcony (50 sq ft)</span>
                <span>Apartment RWA (1,000+)</span>
                <span>2,500 sq ft</span>
              </div>
            </div>

            {/* Control 3: Sunlight & Exposure */}
            <div className="space-y-2">
              <label htmlFor="sunlight-select" className="text-xs font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E] block">
                3. Micro-Climate Exposure
              </label>
              <select
                id="sunlight-select"
                value={sunlightHours}
                onChange={(e) => setSunlightHours(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#F5F2EB] dark:bg-[#152214] border border-[#243324]/10 dark:border-white/10 text-sm text-[#1F2B1D] dark:text-[#F4EFE6] font-medium focus:outline-none focus:ring-2 focus:ring-[#10B981]"
              >
                <option value="full">Direct Sun (6+ hrs daily)</option>
                <option value="partial">Partial Terrace Shade / Pergola (3-5 hrs)</option>
                <option value="high_wind">High-Rise (8th floor+ High Wind)</option>
              </select>
              <p className="text-[11px] text-[#657351] dark:text-[#A3B59E]">
                Determines windbreak barriers and moisture mulch depth.
              </p>
            </div>
          </div>

          {/* Generated Dynamic Specification Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#243324]/10 dark:border-white/10">
            {/* Card 1: Estimated Budget */}
            <div className="p-5 rounded-2xl bg-[#FBF9F5] dark:bg-[#162315] border border-[#243324]/10 dark:border-white/10 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#059669] dark:text-[#34D399] flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <div className="font-display text-2xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light">
                ₹{estimatedCostInr.toLocaleString()}
              </div>
              <p className="text-xs font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">
                Estimated Setup Investment
              </p>
              <p className="text-[11px] text-[#4A5D44] dark:text-[#CBD7C7] font-light">
                Includes drain cells, coir mix, geotextile, starter native plants & drip.
              </p>
            </div>

            {/* Card 2: Rainwater Retained */}
            <div className="p-5 rounded-2xl bg-[#FBF9F5] dark:bg-[#162315] border border-[#243324]/10 dark:border-white/10 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-[#0284C7]/15 text-[#0284C7] dark:text-[#38BDF8] flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <div className="font-display text-2xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light">
                {estimatedWaterSavedLitres.toLocaleString()} L / yr
              </div>
              <p className="text-xs font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">
                Monsoon Rain Buffered
              </p>
              <p className="text-[11px] text-[#4A5D44] dark:text-[#CBD7C7] font-light">
                Prevents stormwater runoff into street drains; recharges local aquifers.
              </p>
            </div>

            {/* Card 3: Indoor Slab Cooling */}
            <div className="p-5 rounded-2xl bg-[#FBF9F5] dark:bg-[#162315] border border-[#243324]/10 dark:border-white/10 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FCD34D] flex items-center justify-center">
                <ThermometerSun className="w-4 h-4" />
              </div>
              <div className="font-display text-2xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light">
                -{estimatedTempDropC}°C
              </div>
              <p className="text-xs font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">
                Ceiling Temperature Reduction
              </p>
              <p className="text-[11px] text-[#4A5D44] dark:text-[#CBD7C7] font-light">
                Cuts top-floor air conditioning energy consumption by 22–34%.
              </p>
            </div>

            {/* Card 4: Pure Cheruthen Honey */}
            <div className="p-5 rounded-2xl bg-[#FBF9F5] dark:bg-[#162315] border border-[#243324]/10 dark:border-white/10 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/15 text-[#8B5CF6] dark:text-[#C4B5FD] flex items-center justify-center">
                <Bug className="w-4 h-4" />
              </div>
              <div className="font-display text-2xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light">
                ~{estimatedHoneyKg} kg / yr
              </div>
              <p className="text-xs font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">
                Stingless Honey Yield
              </p>
              <p className="text-[11px] text-[#4A5D44] dark:text-[#CBD7C7] font-light">
                Raw medicinal honey from 100% gentle, non-stinging native pollinators.
              </p>
            </div>
          </div>

          {/* Regional Substrate & Plant Recommendations Box */}
          <div className="p-6 rounded-2xl bg-[#F5F2EB] dark:bg-[#233522] border border-[#243324]/10 dark:border-white/10 space-y-4">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[#059669] dark:text-[#34D399]" />
              <h3 className="font-display font-medium text-lg text-[#1F2B1D] dark:text-[#F4EFE6]">
                Target Soil Mix for {cityData.name}
              </h3>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#182617] border border-[#243324]/10 dark:border-white/10 text-xs sm:text-sm font-medium text-[#1F2B1D] dark:text-[#F4EFE6]">
              {cityData.substrateFormula}
            </div>

            {/* Plant recommendations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {cityData.floraRecommendations.map((group, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-[#182617] border border-[#243324]/10 dark:border-white/10 space-y-1.5 text-xs">
                  <span className="font-semibold text-[#059669] dark:text-[#34D399] uppercase text-[10px] tracking-wide">
                    {group.category}
                  </span>
                  <ul className="space-y-1 text-[#4A5D44] dark:text-[#CBD7C7]">
                    {group.plants.map((p, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-[#10B981] shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-1 text-[10px] text-[#657351] dark:text-[#A3B59E] border-t border-black/5 dark:border-white/5">
                    Bloom: {group.nectarPeriod}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-[#EBF5ED] dark:bg-[#162315] border border-[#10B981]/20 flex items-start gap-2.5 text-xs text-[#243324] dark:text-[#CBD7C7]">
              <Info className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <div>
                <strong>Local Biome Note: </strong>
                {cityData.waterRetentionTip} {cityData.beeSpeciesNote}
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* STEP-BY-STEP ROOFTOP SETUP MANUAL (ACCORDION) */}
        {/* ======================================================== */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
              Chronological Execution Framework
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal">
              The 6-Phase Rooftop Setup Manual
            </h2>
            <p className="text-sm sm:text-base text-[#4A5D44] dark:text-[#CBD7C7] font-light max-w-3xl">
              Follow these sequential phases to avoid the common mistakes of structural overloading, water leakage, or chemical contamination.
            </p>
          </div>

          <div className="space-y-3">
            {STEP_GUIDES.map((guide, idx) => {
              const isOpen = openStepIdx === idx;
              const IconComponent = guide.icon;

              return (
                <div
                  key={guide.step}
                  className="rounded-2xl bg-white dark:bg-[#1E2D1D] border border-[#243324]/10 dark:border-white/10 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenStepIdx(isOpen ? -1 : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-display text-xl sm:text-2xl font-light text-[#059669] dark:text-[#34D399]">
                        {guide.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#F5F2EB] dark:bg-[#152214] flex items-center justify-center text-[#1F2B1D] dark:text-[#F4EFE6] shrink-0">
                        <IconComponent className="w-5 h-5 text-[#1F2B1D] dark:text-[#85E7B7]" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg sm:text-xl font-normal text-[#1F2B1D] dark:text-[#F4EFE6]">
                          {guide.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light hidden sm:block">
                          {guide.summary}
                        </p>
                      </div>
                    </div>

                    <ChevronDown
                      className={`w-5 h-5 text-[#657351] dark:text-[#A3B59E] transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-6 pb-6 pt-2 border-t border-[#243324]/10 dark:border-white/10 bg-[#FBF9F5]/50 dark:bg-[#162315]/50"
                      >
                        <div className="space-y-3 pt-2">
                          {guide.details.map((point, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-3 text-xs sm:text-sm text-[#243324] dark:text-[#CBD7C7] leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-2 shrink-0" />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
        {/* ======================================================== */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
                Practical Troubleshooting & Operations
              </span>
              <h2 className="font-display text-3xl sm:text-5xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal">
                Frequently Asked Questions
              </h2>
              <p className="text-sm sm:text-base text-[#4A5D44] dark:text-[#CBD7C7] font-light max-w-2xl">
                Expert answers on stingless apiary health, monsoon cloudburst drainage, ant defense, and drip irrigation calibration.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center p-1 rounded-2xl bg-[#E8EFE5] dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 text-xs self-start md:self-auto">
              <button
                type="button"
                onClick={() => setFaqFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                  faqFilter === 'all'
                    ? 'bg-[#1F2B1D] dark:bg-[#2F452D] text-white shadow-xs'
                    : 'text-[#4A5D44] dark:text-[#CBD7C7]'
                }`}
              >
                All FAQs ({FAQ_ITEMS.length})
              </button>
              <button
                type="button"
                onClick={() => setFaqFilter('apiary')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  faqFilter === 'apiary'
                    ? 'bg-[#1F2B1D] dark:bg-[#2F452D] text-white shadow-xs'
                    : 'text-[#4A5D44] dark:text-[#CBD7C7]'
                }`}
              >
                <Bug className="w-3.5 h-3.5" />
                <span>Apiary Care</span>
              </button>
              <button
                type="button"
                onClick={() => setFaqFilter('irrigation')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  faqFilter === 'irrigation'
                    ? 'bg-[#1F2B1D] dark:bg-[#2F452D] text-white shadow-xs'
                    : 'text-[#4A5D44] dark:text-[#CBD7C7]'
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>Irrigation & Water</span>
              </button>
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;

              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-white dark:bg-[#1E2D1D] border border-[#243324]/10 dark:border-white/10 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="p-2 rounded-xl bg-[#F5F2EB] dark:bg-[#152214] text-[#059669] dark:text-[#34D399] shrink-0 mt-0.5">
                        {faq.category === 'apiary' ? (
                          <Bug className="w-4 h-4" />
                        ) : (
                          <Droplets className="w-4 h-4" />
                        )}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#657351] dark:text-[#A3B59E]">
                            {faq.category === 'apiary' ? 'Rooftop Apiary Care' : 'Garden Irrigation & Drainage'}
                          </span>
                        </div>
                        <h3 className="font-display text-base sm:text-lg font-medium text-[#1F2B1D] dark:text-[#F4EFE6] leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <ChevronDown
                      className={`w-5 h-5 text-[#657351] dark:text-[#A3B59E] transition-transform duration-300 shrink-0 mt-2 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-6 pb-6 pt-1 border-t border-[#243324]/10 dark:border-white/10 bg-[#FBF9F5]/60 dark:bg-[#162315]/60"
                      >
                        <div className="space-y-3 pt-3">
                          <p className="text-xs sm:text-sm text-[#384835] dark:text-[#CBD7C7] font-light leading-relaxed">
                            {faq.answer}
                          </p>

                          {/* Key Takeaway Box */}
                          <div className="p-3.5 rounded-xl bg-[#EBF5ED] dark:bg-[#1D2B1C] border border-[#10B981]/25 flex items-start gap-2.5 text-xs text-[#1F2B1D] dark:text-[#E8F0E6]">
                            <CheckCircle2 className="w-4 h-4 text-[#059669] dark:text-[#34D399] shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-semibold text-[#059669] dark:text-[#34D399]">Key Takeaway: </strong>
                              <span>{faq.keyTakeaway}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* SAFETY & FAQ CALLOUT */}
        {/* ======================================================== */}
        <section className="p-8 sm:p-10 rounded-[2.5rem] bg-[#1F2B1D] dark:bg-[#253924] text-white space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-semibold text-[#85E7B7] tracking-wider">
              Safety & Public Health Protocols
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-light">
              Why Indian Stingless Bees (Cheruthen) are 100% Safe for Urban Terraces
            </h3>
            <p className="text-sm text-white/80 font-light leading-relaxed max-w-3xl">
              Unlike western honey bees (*Apis mellifera*) which can sting when disturbed, *Tetragonula iridipennis* have non-functional stingers and communicate entirely through propolis and gentle floral dancing. They cannot sting children or pets, making them the gold-standard pollinator approved for Indian residential apartments, kindergartens, and rooftop hospitals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/15 text-xs">
            <div className="space-y-1">
              <strong className="text-white block font-medium">1. Zero Defense Stings</strong>
              <p className="text-white/70 font-light">
                Completely stingless morphology; safe even if inspected up close by curious toddlers.
              </p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block font-medium">2. High Medicinal Potency</strong>
              <p className="text-white/70 font-light">
                Cheruthen honey possesses superior phenolic and antimicrobial values compared to commercial syrup.
              </p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block font-medium">3. Micro-Flora Pollination</strong>
              <p className="text-white/70 font-light">
                Because of their 3mm size, they efficiently pollinate tiny flowers (coriander, tulasi, mustard) that larger bees ignore.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              type="button"
              onClick={onNavigateHome}
              className="px-6 py-3 rounded-xl bg-white text-[#1F2B1D] font-medium text-xs sm:text-sm hover:bg-[#F5F2EB] transition-colors cursor-pointer self-start sm:self-auto shadow-md"
            >
              ← Return to Main Annual Report
            </button>
            <span className="text-xs text-white/60">
              Published by the South India Urban Apiaries Consortium · Updated for 2026 Season
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
