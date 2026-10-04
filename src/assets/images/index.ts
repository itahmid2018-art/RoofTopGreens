// High-quality image assets for South India Living Urban Ecosystem
import southIndiaRooftop from './south_india_rooftop_1791097680816.jpg';
import monsoonSpongeRoof from './monsoon_sponge_roof_1791097698962.jpg';
import cheruthenHoneyHarvest from './cheruthen_honey_harvest_1791097711197.jpg';
import southStudentsRooftop from './south_students_rooftop_1791097722735.jpg';
import tropicalFloraCanopy from './tropical_flora_canopy_1791097735858.jpg';

// Retain existing assets as fallbacks
import honeyHarvestOld from './honey_harvest.jpg';
import studentsOld from './students_observing_hives.jpg';
import rooftopHavenOld from './rooftop_haven_wide.jpg';
import strataThermalSkyOld from './strata_thermal_sky.jpg';
import strataSubstrateWaterOld from './strata_substrate_deep.jpg';

export const IMAGES = {
  // South Indian specific assets
  southIndiaRooftop,
  monsoonSpongeRoof,
  cheruthenHoneyHarvest,
  southStudentsRooftop,
  tropicalFloraCanopy,

  // Direct drop-in aliases for components
  fiftyTwoRooftops: southIndiaRooftop,
  rooftopHaven: monsoonSpongeRoof,
  honeyHarvest: cheruthenHoneyHarvest,
  students: southStudentsRooftop,
  strataWildflowerCanopy: tropicalFloraCanopy,
  communityHarvest: cheruthenHoneyHarvest,
  strataThermalSky: southIndiaRooftop,
  strataSubstrateWater: monsoonSpongeRoof,

  // Fallbacks
  legacyHoneyHarvest: honeyHarvestOld,
  legacyStudents: studentsOld,
  legacyRooftopHaven: rooftopHavenOld,
  legacyThermalSky: strataThermalSkyOld,
  legacySubstrateWater: strataSubstrateWaterOld,
};
