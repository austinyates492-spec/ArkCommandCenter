// Torpor stats: ARK Official Community Wiki Module:TamingTable/creatures.
// Ammo base torpor: https://ark.wiki.gg/wiki/Tranquilizer_Comparison_Table
// Head modifiers: https://ark.wiki.gg/wiki/T._rex and /wiki/Allosaurus
// Argentavis has NO post-TLC headshot bonus; projectile multiplier is 1.5x.
import wikiKnockoutProfiles from './wiki-knockout-profiles.json' with {type:'json'};
import torporReferences from './wiki-torpor-references.json' with {type:'json'};
import {passiveProfiles} from './passive-taming.js';
import {breedingVariants} from './breeding-variants.js';
import asaTamingMethods from './asa-taming-methods.json' with {type:'json'};
import {getTamingMethod} from './special-taming-methods.js';
import {ASA_V97_NONSTANDARD_KNOCKOUTS} from './asa-release-v97.js';
const manuallyReviewedSpecies={
  Rex:{torpor:1550,perLevel:93,head:1.5,projectile:1},
  Argentavis:{torpor:600,perLevel:36,head:1,projectile:1.5},
  Allosaurus:{torpor:1000,perLevel:60,head:1.5,projectile:1},
  Stegosaurus:{torpor:500,perLevel:30,head:1,projectile:1},
  Therizinosaurus:{torpor:925,perLevel:55.5,head:1,projectile:1},
  Pteranodon:{torpor:120,perLevel:7.2,head:1,projectile:1.5},
  Tapejara:{torpor:450,perLevel:27,head:1,projectile:1.5},
  Raptor:{torpor:180,perLevel:10.8,head:1,projectile:1},
  Sabertooth:{torpor:500,perLevel:30,head:1,projectile:1},
  Sarcosuchus:{torpor:400,perLevel:24,head:1,projectile:1},
  Triceratops:{torpor:250,perLevel:15,head:1,projectile:1},
  Ankylosaurus:{torpor:420,perLevel:25.2,head:1,projectile:1},
  Quetzal:{torpor:1850,perLevel:111,head:1,projectile:1.5}
};
// The wiki's CreatureStats table gives torpor, not taming eligibility. Only
// construct normal-tranq profiles for creatures in the ASA knockout category;
// cannon/boulder-only special knockouts are handled separately.
const heavyKnockouts=new Set(['Karkinos','Rock Elemental','Titanosaur']);
const categoryKnockouts={};
for(const [name,method] of Object.entries(asaTamingMethods)){
 if(!method.methods.includes('knockout')||heavyKnockouts.has(name)||ASA_V97_NONSTANDARD_KNOCKOUTS.has(breedingVariants[name]||name))continue;
 const reference=wikiKnockoutProfiles[name]||torporReferences[name];
 if(!reference)continue;
 categoryKnockouts[name]={...reference,verification:reference.verification||'wiki-base-6pct',source:reference.source||'https://ark.wiki.gg/wiki/Special:CargoTables/CreatureStats'};
}
for(const [variant,parent] of Object.entries(breedingVariants)){
 if(!asaTamingMethods[parent]?.methods.includes('knockout')||heavyKnockouts.has(parent)||ASA_V97_NONSTANDARD_KNOCKOUTS.has(parent))continue;
 const base=categoryKnockouts[parent]||manuallyReviewedSpecies[parent];
 if(!base)continue;
 categoryKnockouts[variant]={torpor:base.torpor,perLevel:base.perLevel,head:1,projectile:1,verification:'variant-parent-stat-assumed',source:base.source||'https://ark.wiki.gg/wiki/Special:CargoTables/CreatureStats'};
}
export const knockoutSpecies={...categoryKnockouts,...manuallyReviewedSpecies};
export const tranqs=[
 {id:'bow',label:'Tranq Arrow · Bow',torpor:90},
 {id:'crossbow',label:'Tranq Arrow · Crossbow',torpor:157.5},
 {id:'compound',label:'Tranq Arrow · Compound Bow',torpor:121.5},
 {id:'dart',label:'Tranq Dart · Longneck',torpor:221},
 {id:'shocking',label:'Shocking Dart · Longneck',torpor:442}
];
export function knockoutEstimate({creature,level,weaponQuality=100,longneckBuffPercent=100,torporMultiplier=1,targetTorpor}){
 const special=getTamingMethod(creature);
 if(special)return {ok:false,reason:`${special.type}: conventional tranquilizer estimates are not applicable. ${special.instructions}`};
 const verified=knockoutSpecies[creature];
 const entered=Number(targetTorpor);
 const hasOverride=targetTorpor!==undefined&&targetTorpor!==''&&Number.isFinite(entered)&&entered>0;
 const nonKnockout=new Set(['Broodmother Lysrix','Dragon','Megapithecus','Manticore','Overseer','King Titan','Desert Titan','Forest Titan','Ice Titan','Attack Drone','Defense Unit','Deathworm','DodoRex','Dodo Wyvern','Giant Bee','Giant Queen Bee','Wyvern','Ovis','Oasisaur','Ammonite','Coelacanth','Cnidaria','Piranha','Leedsichthys','Sabertooth Salmon','Trilobite','Meganeura','Titanomyrma','Glowbug','Jug Bug','Eurypterid','Leech','Lamprey','Nameless','Seeker','Yeti']);
 const parent=breedingVariants[creature];
 const methods=(asaTamingMethods[creature]||asaTamingMethods[parent])?.methods||[];
 const conventional=methods.includes('knockout')&&!heavyKnockouts.has(creature)&&!heavyKnockouts.has(parent);
 const reference=(conventional&&!nonKnockout.has(creature)&&!nonKnockout.has(parent))?(torporReferences[creature]||(parent&&torporReferences[parent])):null;
 // Never generate a theoretical tranquilizer table for a non-knockout tame,
 // even if the user typed a torpor override.
 const entry=conventional?(verified||reference||(hasOverride?{torpor:entered,perLevel:0,head:1,projectile:1,verification:'manual-target'}:null)):null;
 if(!entry)return {ok:false,reason:methods.includes('untameable')?'This creature is listed as untameable; ordinary knockout taming is not available.':methods.includes('passive-or-special')&&!methods.includes('knockout')?'This creature uses passive or special taming. Ordinary tranq counts are not supported.':heavyKnockouts.has(creature)||heavyKnockouts.has(parent)?'This is a special knockout tame using heavy projectiles, not standard tranq arrows or darts.':'No verified standard knockout model exists. Enter the target torpor from the game for theoretical body-shot math only.'};
 const lvl=Number(level),quality=Number(weaponQuality),longneck=Number(longneckBuffPercent),multiplier=Number(torporMultiplier);
 if(!Number.isInteger(lvl)||lvl<1||lvl>1000)return {ok:false,reason:'Enter a wild level from 1 to 1000.'};
 if(!Number.isFinite(quality)||quality<1||quality>1000)return {ok:false,reason:'Enter weapon damage between 1% and 1000%.'};
 if(!Number.isFinite(longneck)||longneck<1||longneck>1000)return {ok:false,reason:'Enter a valid additional Longneck damage percentage from 1% to 1000%.'};
 if(!Number.isFinite(multiplier)||multiplier<=0||multiplier>1000)return {ok:false,reason:'Enter an effective torpor multiplier greater than 0 and no more than 1000.'};
 // An observed in-game torpor override takes priority over wiki baselines.
 const totalTorpor=hasOverride?entered:entry.torpor+(lvl-1)*entry.perLevel;
 if(!Number.isFinite(totalTorpor)||totalTorpor<=0)return {ok:false,reason:'Missing or invalid target torpor for this creature.'};
 const rows=tranqs.map(item=>{
  const longneckFactor=(item.id==='dart'||item.id==='shocking')?longneck/100:1;
  const bodyPerShot=item.torpor*quality/100*entry.projectile*longneckFactor*multiplier;
  const body=Math.ceil(totalTorpor/bodyPerShot);
  const head=entry.head>1?Math.ceil(totalTorpor/(bodyPerShot*entry.head)):null;
  return {...item,body,head,torporPerShot:bodyPerShot};
 });
 return {ok:true,totalTorpor,headMultiplier:entry.head,projectileMultiplier:entry.projectile,longneckBuffPercent:longneck,torporMultiplier:multiplier,rows,manual:hasOverride,referenceOnly:!verified&&!!reference&&!hasOverride,verification:entry.verification||'reviewed'};
}
