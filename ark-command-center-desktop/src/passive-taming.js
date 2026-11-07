// Passive / non-violent methods checked against ARK Official Community Wiki.
// https://ark.wiki.gg/wiki/Taming and species articles.
// Special interactions must not be treated like standard timed feeding.
import {calculatedWikiFeed,wikiFoodOptions} from './taming-engine.js';
import {breedingVariants} from './breeding-variants.js';
export const passiveProfiles={
  Ovis:{method:'single',food:['Sweet Vegetable Cake'],notes:'One Sweet Vegetable Cake, regardless of wild level.'},
  Equus:{method:'ride',food:['Simple Kibble','Rockarrot','Mejoberry'],notes:'Approach, feed, mount, and calm it whenever prompted. Kibble choice varies by version; verify on your cluster.'},
  Mesopithecus:{method:'feeding',food:['Regular Kibble','Mejoberry'],notes:'Approach cautiously and feed from the hotbar; getting too close may scare it.'},
  Gigantopithecus:{method:'feeding',food:['Regular Kibble','Mejoberry'],notes:'Follow behind and feed; avoid touching or alarming it.'},
  Ichthyosaurus:{method:'feeding',food:['Simple Kibble','Raw Mutton','Raw Prime Meat'],notes:'Approach underwater and feed from the hotbar.'},
  Basilosaurus:{method:'feeding',food:['Exceptional Kibble','Raw Mutton','Raw Prime Meat'],notes:'Clear its accompanying mantas before feeding; watch for danger in deep water.'},
  Manta:{method:'feeding',food:['Angler Gel'],notes:'Passive feed while underwater; dangerous if provoked.'},
  Moschops:{method:'request',food:['Requested food'],notes:'Each feeding can demand a different item; read its current food request before planning.'},
  Hyaenodon:{method:'pet',food:['Pet'],notes:'Crouch, approach and pet it repeatedly without startling the pack.'},
  'Dung Beetle':{method:'feeding',food:['Large Animal Feces','Medium Animal Feces'],notes:'Feed while crouching; avoid being attacked by cave creatures.'},
  'Giant Queen Bee':{method:'feeding',food:['Simple Kibble','Rare Flower'],notes:'Destroy the hive and approach the queen with appropriate protection.'},
  Chalicotherium:{method:'feeding',food:['Beer Jar'],notes:'Feed beer from the hotbar; keep your distance between feeds.'},
  Electrophorus:{method:'feeding',food:['Raw Mutton','Bio Toxin','Raw Prime Meat'],notes:'Approach underwater and feed; avoid electric attacks.'},
  Liopleurodon:{method:'feeding',food:['Giant Bee Honey'],notes:'Time-limited special tame; confirm the current map behavior.'},
  'Giant Bee':{method:'feeding',food:['Simple Kibble','Rare Flower'],notes:'Approach the queen after breaking the hive.'}
  ,Deinosuchus:{method:'feeding',food:['Superior Kibble'],notes:'Feed when it is basking with its mouth open. Do not treat this as a knockout tame; exact intervals and counts need newer ASA source values.'}
};
export function passiveFoodPlan({creature,level,food,tamingRate=10,foodDrainRate=1}){
 if(!Number.isInteger(Number(level))||Number(level)<1||!Number.isFinite(Number(tamingRate))||Number(tamingRate)<=0)return {ok:false,reason:'Enter a valid level and taming multiplier.'};
 const entry=passiveProfiles[creature]||passiveProfiles[breedingVariants[creature]];
 if(entry?.method==='single')return {ok:true,food:entry.food[0],pieces:1,seconds:0,notes:entry.notes};
 if(entry?.method==='request'||entry?.method==='pet'||entry?.method==='ride')return {ok:false,reason:'This tame depends on interaction prompts and changing feeding intervals; an exact count or completion time cannot be inferred from food values.',notes:entry?.notes};
 if(wikiFoodOptions(creature).includes(food)){
  const result=calculatedWikiFeed({creature,level,food,tamingRate,foodDrainRate});
  if(result.ok)return {...result,pieces:result.foodPieces,notes:entry?.notes||'Passive feeding requires staying close and checking each feeding prompt.',approximate:true};
 }
 return {ok:false,reason:'Passive taming requires creature-specific feeding intervals or interactions; choose a documented food or enter verified counts and times.',notes:entry?.notes};
}
