// NomadARK settings: 10x taming/harvest from the cluster website; additional
// settings are user-supplied from the NomadARK server's rates/rules message.
// Player food drain (0.5) is NOT DinoCharacterFoodDrainMultiplier.
export const NOMADARK_SOURCE='https://nomadark.net/';
export const NOMADARK_DISCORD='https://discord.gg/nomadark';
export const NOMADARK_PROFILE={
  name:'NomadARK.net',
  checked:'2026-11-06',
  officialMapsOnly:true,
  published:{taming:10,harvest:10,xp:10,breeding:0.2,mature:8,hatch:25,crops:5},
  rules:{tribeLimit:6,alliances:false,tameLimit:500,turretLimit:100,weaponCap:354,stackSize:2000,weightReduction:0.5,snapLimit:8000,structureLimit:70000,uploadHours:72,infinitePickup:true,unlimitedMindwipe:true,structureCollision:false,elementTransfers:true},
  weapon:{longneckBuffPercent:300,flamethrowerNerfPercent:20},
  player:{health:1,stamina:1,oxygen:1,foodDrain:0.5,waterDrain:0.5,weight:5,damage:1,fortitude:2,crafting:1},
  evidence:{
    taming:'Owner website and user-supplied NomadARK rates: Taming 10×.',
    harvest:'Owner website and user-supplied NomadARK rates: Harvesting 10×.',
    xp:'User-supplied NomadARK rates: 10× XP (resolves conflicting public FAQ).',
    breeding:'User-supplied NomadARK rates: Mating interval 0.2×.',
    mature:'User-supplied NomadARK rates: Baby mature 8×.',
    hatch:'User-supplied NomadARK rates: Egg hatch 25×.'
  }
};

export const NOMADARK_RATE_FIELDS={
  taming:{label:'Taming speed',status:'confirmed',value:10,description:'10× confirmed by NomadARK website and your server rate list.'},
  hatch:{label:'Egg hatch / gestation speed',status:'confirmed',value:25,description:'25× egg hatch from your NomadARK rate list. Gestation may require separate verification.'},
  mature:{label:'Baby maturation',status:'confirmed',value:8,description:'8× baby mature from your NomadARK rate list.'},
  cuddle:{label:'Imprint cuddle interval',status:'unpublished',description:'The NomadARK rate list does not give BabyCuddleIntervalMultiplier or BabyImprintAmountMultiplier.'},
  breeding:{label:'Mating interval',status:'confirmed',value:0.2,description:'0.2× mating interval from your NomadARK rate list.'},
  food:{label:'Dinosaur food drain',status:'unpublished',description:'The stated 0.50× is PLAYER food drain, not the dinosaur food drain multiplier used for taming.'}
};

export const LEGACY_WORKING_RATES={taming:10,hatch:10,mature:10,cuddle:0.1,breeding:0.1,food:1};

export function applyNomadarkConfirmedRates(current){
  return {...current,taming:10,hatch:25,mature:8,breeding:0.2};
}

// Upgrade only an intact prior default preset. Any customized field means
// the entire saved object is preserved; the user can apply confirmed rates.
export function migrateOldRatePreset(saved,currentDefaults){
  if(!saved||typeof saved!=='object'||Array.isArray(saved))return currentDefaults;
  const pristine=Object.keys(LEGACY_WORKING_RATES).every(key=>Number(saved[key])===LEGACY_WORKING_RATES[key]);
  return pristine?applyNomadarkConfirmedRates({...currentDefaults,...saved}):{...currentDefaults,...saved};
}

export function rateDescription(key,value){
  const source=NOMADARK_RATE_FIELDS[key];
  if(!source)return 'Unknown server setting.';
  if(source.status==='confirmed'){
   if(Number(value)!==source.value)return `Custom override (${value}×). NomadARK listed ${source.value}×.`;
   return source.description;
  }
  return `${source.description} ${value}× remains a local assumption.`;
}
