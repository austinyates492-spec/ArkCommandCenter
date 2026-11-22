// Torpor maintenance estimates follow the ARK Official Community Wiki's
// Module:TamingTable formula and creature-specific torporDepletionPS0 dataset.
// This is distinct from knockout ammunition required to induce torpor.
import {wikiCreatureRecord} from './taming-engine.js';

export const torporConsumables=Object.freeze([
 {id:'narcoberry',label:'Narcoberries',torpor:7.5,effectSeconds:3},
 {id:'narcotic',label:'Narcotics',torpor:40,effectSeconds:8},
 {id:'bio-toxin',label:'Bio Toxin',torpor:80,effectSeconds:16}
]);

export function torporDrainRate({baseRate,level,drainMultiplier=1}){
 const base=Number(baseRate),lvl=Number(level),mult=Number(drainMultiplier);
 if(!Number.isFinite(base)||base<=0||!Number.isInteger(lvl)||lvl<1||lvl>1000||!Number.isFinite(mult)||mult<=0||mult>1000)return null;
 // Wiki's exponential approximation; level 1 has no additional drain.
 return (base+base*Math.pow(lvl-1,0.800403041)/22.39671632)*mult;
}

export function unconsciousSupplies({creature,level,tameSeconds,totalTorpor,drainMultiplier=1,startingTorpor}){
 const profile=wikiCreatureRecord(creature);
 const rate=torporDrainRate({baseRate:profile?.torporDepletionPS0,level,drainMultiplier});
 const seconds=Number(tameSeconds),maximum=Number(totalTorpor);
 if(!rate)return {ok:false,reason:'This creature has no verified unconscious torpor-drain rate in the official wiki dataset. No supply estimate is shown.'};
 if(!Number.isFinite(seconds)||seconds<=0||!Number.isFinite(maximum)||maximum<=0)return {ok:false,reason:'A valid tame duration and maximum torpor are required.'};
 const observed=startingTorpor===''||startingTorpor===undefined||startingTorpor===null?maximum:Number(startingTorpor);
 if(!Number.isFinite(observed)||observed<=0||observed>maximum)return {ok:false,reason:'Current torpor must be greater than zero and no higher than maximum torpor.'};
 // The wiki assumes full initial torpor and adds duration of torpor-rise effects
 // to time kept unconscious, rather than treating each narcotic as instantaneous.
 const deficit=Math.max(0,rate*seconds-observed);
 const rows=torporConsumables.map(item=>({
  ...item,
  amount:Math.ceil(deficit/(item.torpor+item.effectSeconds*rate))
 }));
 return {ok:true,drainPerSecond:rate,initialTorpor:observed,maxTorpor:maximum,seconds,deficit,rows,source:'https://ark.wiki.gg/wiki/Module:TamingTable'};
}
