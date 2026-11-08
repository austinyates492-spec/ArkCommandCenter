import {wikiCreatureRecord,calculatedWikiFeed,wikiFoodOptions} from './taming-engine.js';
import {getTamingMethod} from './special-taming-methods.js';
import torporReferences from './wiki-torpor-references.json' with {type:'json'};

const ammoType={
 'Boulder · Catapult Turret':'boulder',
 'Cannonball · Cannon':'cannonball'
};

export function specialtyAmmoOptions(creature){
 const method=getTamingMethod(creature);
 const values=wikiCreatureRecord(creature)?.heavyWeaponTorporValue;
 if(!method||!values)return [];
 return method.items.map(item=>({label:item,type:ammoType[item],torpor:values[ammoType[item]]})).filter(item=>item.type&&Number(item.torpor)>0);
}

export function estimateSpecialtyKnockout({creature,level,ammo}){
 const record=wikiCreatureRecord(creature);
 const options=specialtyAmmoOptions(creature);
 const selected=options.find(item=>item.label===ammo);
 const lvl=Number(level);
 if(!Number.isInteger(lvl)||lvl<1||lvl>1000)return {ok:false,reason:'Enter a valid wild level from 1 to 1000.'};
 if(!record||!selected||!Number.isFinite(record.torpor1)||!Number.isFinite(record.torporIncrease))return {ok:false,reason:'This creature lacks published heavy-weapon knockout numbers.'};
 const totalTorpor=record.torpor1+(lvl-1)*record.torporIncrease;
 return {ok:true,ammo:selected.label,amount:Math.ceil(totalTorpor/selected.torpor),totalTorpor,torporPerHit:selected.torpor,source:'https://ark.wiki.gg/wiki/Module:TamingTable/creatures',caveat:'Theoretical hits at baseline weapon damage, before torpor drain, missed/invalid hit locations or damage resistance. Bring extra ammunition; verify ASA differences in-game.'};
}

export function specialtyFeeding({creature,level,food,tamingRate=10,foodDrainRate=1}){
 if(creature==='Giganotosaurus'||creature==='Tek Giganotosaurus')return {ok:false,reason:'The post-v97 Apex Challenge taming supply and duration have not been verified; use an observed manual timer.'};
 const lvl=Number(level),rate=Number(tamingRate);
 if(!Number.isInteger(lvl)||lvl<1||lvl>1000||!Number.isFinite(rate)||rate<=0)return {ok:false,reason:'Enter a level from 1 to 1000 and a positive taming multiplier.'};
 if(creature==='Bloodstalker'&&food==='Blood Pack'){
  // ARK Wiki: 10 packs per wild level at 1×. Applies taming-speed scaling,
  // but wild individual behavior and melee damage change real consumption.
  const foodPieces=Math.max(1,Math.ceil(10*lvl/rate));
  return {ok:true,foodPieces,bufferPieces:Math.ceil(foodPieces*1.25),seconds:null,minutes:null,model:'bloodstalker',
   source:'https://ark.wiki.gg/wiki/Bloodstalker',
   caveat:'Level-based planning estimate, not a guaranteed exact count. The wild Bloodstalker’s melee/behavior changes actual consumption; bring at least 25% extra. The 10× taming setting is included; the separate dinosaur food-drain setting does not govern this grab interaction.'};
 }
 if(creature==='Palaeoctopus'&&food==='Bio Toxin'){
  const baseline=torporReferences.Palaeoctopus;
  if(!baseline||!Number.isFinite(baseline.torpor)||!Number.isFinite(baseline.perLevel))return {ok:false,reason:'No published Palaeoctopus torpor reference is available.'};
  const totalTorpor=baseline.torpor+(lvl-1)*baseline.perLevel;
  const foodPieces=Math.ceil(totalTorpor/800);
  return {ok:true,foodPieces,totalTorpor,seconds:null,minutes:null,model:'octopus-biotoxin',
   minBiteSeconds:Math.max(0,(foodPieces-1)*15),maxBiteSeconds:Math.max(0,(foodPieces-1)*20),
   source:'https://ark.wiki.gg/wiki/Paleoctopus',
   caveat:'Theoretical minimum successful Bio Toxin interactions (approximately 800 torpor each), before torpor decay, mistimed bites and actual wait times. The encounter-specific bite torpor is NOT divided by the 10× taming rate. The wiki advises carrying more; knockout must be followed by ordinary food taming.'};
 }
 if(wikiFoodOptions(creature).includes(food))return calculatedWikiFeed({creature,level,food,tamingRate,foodDrainRate});
 return {ok:false,reason:'This special tame has an interaction-specific feeding process; no verified numeric formula is available yet.'};
}

export function specialtyFoodOptions(creature){return getTamingMethod(creature)?.foodOptions||wikiFoodOptions(creature);}

export function specialtyFixedSupply(creature){
 const method=getTamingMethod(creature);
 if(method?.type==='Fish-basket capture')return {item:'Fish Basket',amount:1,caveat:'One basket per captured creature; it is not a feeding-based tame.'};
 if(['Nest egg','Boss reward egg raising','Seed acquisition / raising'].includes(method?.type))return {
  item:method.items[0],amount:1,caveat:'One source egg or seed per hatchling/seedling. Obtaining it can require a fight or another encounter.'
 };
 return null;
}
