// Data and algorithm adapted from the ARK Official Community Wiki's
// Module:TamingTable/creatures, Module:TamingTable/food and Module:TamingTable.
// https://ark.wiki.gg/wiki/Module:TamingTable
// This is the wiki's standard knockout-tame model; special taming mechanics
// and creatures without audited values must not return fabricated estimates.
import wikiTaming from './wiki-taming-data.json' with {type:'json'};
import asaMethods from './asa-taming-methods.json' with {type:'json'};
import {breedingVariants} from './breeding-variants.js';
import {ASA_V97_NONSTANDARD_KNOCKOUTS} from './asa-release-v97.js';

const coreProfiles = {
  Rex: { base:3450, perLevel:150, drainBase:0.002314, drainMult:180.063385, kibble:'Exceptional', foods:['Raw Mutton','Raw Prime Meat','Raw Meat'] },
  Argentavis: { base:2000, perLevel:100, drainBase:0.001852, drainMult:199.983994, kibble:'Superior', foods:['Raw Mutton','Raw Prime Meat','Raw Meat'] },
  Allosaurus: { base:2400, perLevel:100, drainBase:0.002052, drainMult:180.063385, kibble:'Superior', foods:['Raw Mutton','Raw Prime Meat','Raw Meat'] }
  ,Stegosaurus: {base:6000,perLevel:300,drainBase:0.005341,drainMult:208.034286,kibble:'Regular',foods:['Vegetables','Mejoberries']}
  ,Therizinosaurus: {base:6800,perLevel:160,drainBase:0.002314,drainMult:180.063385,kibble:'Exceptional',foods:['Vegetables','Mejoberries'],kibbleFoodValue:119.969994}
  ,Pteranodon:{base:1200,perLevel:60,drainBase:0.001543,drainMult:216.029373,kibble:'Regular',foods:['Raw Mutton','Raw Prime Meat','Raw Meat']}
  ,Tapejara:{base:2200,perLevel:100,drainBase:0.001543,drainMult:216.029373,kibble:'Superior',foods:['Raw Mutton','Raw Prime Meat','Raw Meat']}
  ,Raptor:{base:1200,perLevel:60,drainBase:0.001543,drainMult:648.088135,kibble:'Simple',foods:['Raw Mutton','Raw Prime Meat','Raw Meat']}
  ,Sabertooth:{base:1200,perLevel:60,drainBase:0.001543,drainMult:288.039185,kibble:'Regular',foods:['Raw Mutton','Raw Prime Meat','Raw Meat']}
  ,Sarcosuchus:{base:2000,perLevel:75,drainBase:0.001578,drainMult:211.237854,kibble:'Regular',foods:['Raw Mutton','Raw Prime Meat','Raw Meat'],special:{'Raw Prime Meat':{affinity:120,foodValue:50}}}
  ,Triceratops:{base:3000,perLevel:150,drainBase:0.003156,drainMult:352.06308,kibble:'Simple',foods:['Vegetables','Mejoberries']}
  ,Ankylosaurus:{base:3000,perLevel:150,drainBase:0.003156,drainMult:176.03154,kibble:'Regular',foods:['Vegetables','Mejoberries']}
  ,Quetzal:{base:6850,perLevel:300,drainBase:0.0035,drainMult:140,kibble:'Exceptional',foods:['Raw Mutton','Raw Prime Meat','Raw Meat']}
};

const aliases={Sarcosuchus:'Sarco',Therizinosaurus:'Therizinosaur',Spinosaurus:'Spino',Triceratops:'Triceratops'};
export function wikiCreatureRecord(name){return wikiTaming.creatures[name]||wikiTaming.creatures[aliases[name]]||wikiTaming.creatures[breedingVariants[name]]||wikiTaming.creatures[aliases[breedingVariants[name]]]||null;}
const officialKnockoutRecords=Object.fromEntries(Object.keys(asaMethods).filter(name=>asaMethods[name].methods.includes('knockout')&&!['Karkinos','Rock Elemental','Titanosaur'].includes(name)&&!ASA_V97_NONSTANDARD_KNOCKOUTS.has(breedingVariants[name]||name)&&wikiCreatureRecord(name)).map(name=>[name,wikiCreatureRecord(name)]));
// The wiki's per-species food tables win over simplified legacy examples.
// Legacy examples are only fallbacks for names missing a wiki record.
const baseKnockoutProfiles={...coreProfiles,...Object.fromEntries(Object.entries(officialKnockoutRecords).map(([name,record])=>[name,{base:record.affinityNeeded0,perLevel:record.affinityIncrease,drainBase:record.foodConsumptionBase,drainMult:record.foodConsumptionMult,kibble:record.favoriteKibble,foods:record.eats,fromWiki:true}]))};
export const knockoutProfiles={...baseKnockoutProfiles,...Object.fromEntries(Object.entries(breedingVariants).filter(([,parent])=>baseKnockoutProfiles[parent]&&asaMethods[parent]?.methods.includes('knockout')&&!ASA_V97_NONSTANDARD_KNOCKOUTS.has(parent)).map(([variant,parent])=>[variant,{...baseKnockoutProfiles[parent],variantInherited:true}]))};

const foodStats = {
  'Raw Mutton': {affinity:187.5,foodValue:50},
  'Raw Prime Meat': {affinity:150,foodValue:50},
  'Raw Meat': {affinity:50,foodValue:50},
  'Vegetables': {affinity:40,foodValue:40},
  'Mejoberries': {affinity:30,foodValue:30},
  'Kibble': {affinity:400,foodValue:53.28}
};
export const kibbleOrder=['Basic','Simple','Regular','Superior','Exceptional','Extraordinary'];

const foodAliases={Crops:'Vegetables',Mejoberry:'Mejoberries',Berries:'Other Berries',AnglerGel:'Angler Gel'};
const inverseFoodAliases=Object.fromEntries(Object.entries(foodAliases).map(([key,val])=>[val,key]));
export function wikiFoodOptions(creature){
 const record=wikiCreatureRecord(creature);
 if(!record?.eats?.length)return [];
 return [...new Set(record.eats.filter(food=>!food.includes('Primitive Plus')&&food!=='Stimberry').flatMap(food=>food==='Kibble'?record.favoriteKibble?kibbleOrder.slice(kibbleOrder.indexOf(record.favoriteKibble)).map(name=>`${name} Kibble`):[]:[foodAliases[food]||food]))];
}
export function calculatedWikiFeed({creature,level,food,tamingRate=10,foodDrainRate=1}){
 if(ASA_V97_NONSTANDARD_KNOCKOUTS.has(breedingVariants[creature]||creature))return {ok:false,reason:'ASA v97 replaced this creature’s ordinary knockout with the Apex Challenge. Use Specialty Taming Lab.'};
 const record=wikiCreatureRecord(creature);
 if(!record||!Number.isFinite(record.affinityNeeded0)||!Number.isFinite(record.affinityIncrease)||!Number.isFinite(record.foodConsumptionBase)||!Number.isFinite(record.foodConsumptionMult))return {ok:false,reason:'No published food calculation for this species.'};
 const lvl=Number(level),rate=Number(tamingRate),drain=Number(foodDrainRate);
 if(!Number.isInteger(lvl)||lvl<1||lvl>1000||!Number.isFinite(rate)||rate<=0||!Number.isFinite(drain)||drain<=0)return {ok:false,reason:'Enter a valid level and positive taming / food rates.'};
 if(!wikiFoodOptions(creature).includes(food))return {ok:false,reason:'Choose a compatible food from the official wiki list.'};
 const key=food.endsWith(' Kibble')?'Kibble':inverseFoodAliases[food]||food;
 const custom=record.specialFoodValues?.[key]||record.specialFoodValues?.[food];
 const general=wikiTaming.food[key]||wikiTaming.food[food];
 const affinity=custom?.affinity??general?.affinity;
 const value=custom?.value??general?.foodValue;
 if(!Number.isFinite(affinity)||affinity<=0||!Number.isFinite(value)||value<=0)return {ok:false,reason:'The wiki does not include valid affinity and food-value numbers for this option.'};
 // Follow Module:TamingTable: waking/passive tames use separate food
 // affinity and consumption multipliers; their last feeding is instantaneous.
 // Creatures with custom affinity logic (Basilisk) do not use the universal 4×
 // affinity factor. These are wiki *theoretical* results, not server telemetry.
 const passive=record.nonViolentTame===1;
 const customAffinity=record.usesCustomAffinityLogic===true;
 const wakeAffinity=passive?(record.wakeAffinityMult??1):1;
 const wakeConsumption=passive?(record.wakeFoodDeplMult??1):1;
 const affinityNeeded=record.affinityNeeded0+record.affinityIncrease*lvl;
 const effectiveAffinity=affinity*(customAffinity?1:4*wakeAffinity)*rate;
 const foodPieces=Math.ceil(affinityNeeded/effectiveAffinity);
 const foodPerInterval=value*wakeConsumption;
 const constantInterval=record.constantFeedingInterval;
 // Match the official wiki module's total-time model; the last feed is
 // instant only for the displayed *average between-feed interval*, not for
 // subtraction from the total hunger-duration equation.
 let seconds=Number.isFinite(constantInterval)&&constantInterval>0
  ?Math.ceil(foodPieces*constantInterval/drain)
  :Math.ceil(foodPieces*foodPerInterval/(record.foodConsumptionBase*record.foodConsumptionMult*drain));
 if(Number.isFinite(record.resultCorrection)&&record.resultCorrection>0)seconds=Math.ceil(seconds*record.resultCorrection);
 if(!Number.isFinite(seconds)||!Number.isFinite(foodPieces)||foodPieces<1||seconds<0)return {ok:false,reason:'Published coefficients produced an invalid result; use manual verification.'};
 return {ok:true,foodPieces,seconds,minutes:seconds/60,feedingIntervalSeconds:passive&&foodPieces>1?seconds/(foodPieces-1):null,creature,food,level:lvl,passive,customAffinity,
  source:'https://ark.wiki.gg/wiki/Module:TamingTable/creatures',
  caveat:passive?'Theoretical waking-tame food and hunger model with species-specific multipliers. The initial feeding and real feeding prompts can change the elapsed time; not a guaranteed timer.':'Wiki-derived knockout food/affinity model. Published coefficients may lag current ASA patches and server-specific overrides; this is an estimate, not an in-game certified value.'};
}

export function availableFoods(creature){
  const profile=knockoutProfiles[creature];
  if(!profile)return [];
  if(profile.fromWiki)return wikiFoodOptions(creature);
  return [...kibbleOrder.slice(kibbleOrder.indexOf(profile.kibble)).map(k=>`${k} Kibble`),...profile.foods];
}

export function calculateTame({creature,level,food,tamingRate=10,foodDrainRate=1}){
 if(ASA_V97_NONSTANDARD_KNOCKOUTS.has(breedingVariants[creature]||creature))return {ok:false,reason:'ASA v97 replaced this creature’s ordinary knockout with the Apex Challenge. Use Specialty Taming Lab.'};
  const profile=knockoutProfiles[creature];
  if(!profile)return {ok:false,reason:'No verified knockout-taming profile for this creature yet.'};
  if(profile.fromWiki)return calculatedWikiFeed({creature,level,food,tamingRate,foodDrainRate});
  if(!Number.isInteger(Number(level))||Number(level)<1||Number(level)>1000)return {ok:false,reason:'Enter a wild level from 1 to 1000.'};
  if(!Number.isFinite(Number(tamingRate))||Number(tamingRate)<=0||!Number.isFinite(Number(foodDrainRate))||Number(foodDrainRate)<=0)return {ok:false,reason:'Server multipliers must be greater than zero.'};
  if(!availableFoods(creature).includes(food))return {ok:false,reason:'That food is not supported for this creature. Choose one from the available list.'};
  const original=profile.special?.[food]??(food.endsWith(' Kibble')?foodStats.Kibble:foodStats[food]);
  const stats=food.endsWith(' Kibble')&&profile.kibbleFoodValue?{...original,foodValue:profile.kibbleFoodValue}:original;
  const requiredAffinity=profile.base+profile.perLevel*Number(level);
  // Wiki accounts for post-2020 4x baseline; server taming multiplier scales affinity.
  const foodPieces=Math.ceil(requiredAffinity/(stats.affinity*4*Number(tamingRate)));
  const seconds=Math.ceil(foodPieces*stats.foodValue/(profile.drainBase*profile.drainMult*Number(foodDrainRate)));
  return {ok:true,foodPieces,seconds,minutes:seconds/60,requiredAffinity,creature,food,level:Number(level),
    caveat:`Wiki knockout-tame model${profile.variantInherited?' (base-species values inherited for variant)':''}; approximate total time. ASA patches, food-drain overrides, mods and initial hunger can change the result.`};
}
