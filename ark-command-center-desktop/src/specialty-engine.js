import {wikiCreatureRecord,calculatedWikiFeed,wikiFoodOptions} from './taming-engine.js';
import {getTamingMethod} from './special-taming-methods.js';

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
 if(wikiFoodOptions(creature).includes(food))return calculatedWikiFeed({creature,level,food,tamingRate,foodDrainRate});
 return {ok:false,reason:'This special tame has an interaction-specific feeding process; no verified numeric formula is available yet.'};
}

export const specialtyFoodOptions=wikiFoodOptions;
