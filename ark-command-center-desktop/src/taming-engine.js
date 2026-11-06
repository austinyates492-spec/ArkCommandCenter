// Data and algorithm adapted from the ARK Official Community Wiki's
// Module:TamingTable/creatures, Module:TamingTable/food and Module:TamingTable.
// https://ark.wiki.gg/wiki/Module:TamingTable
// This is the wiki's standard knockout-tame model; special taming mechanics
// and creatures without audited values must not return fabricated estimates.
export const knockoutProfiles = {
  Rex: { base:3450, perLevel:150, drainBase:0.002314, drainMult:180.063385, kibble:'Exceptional', foods:['Raw Mutton','Raw Prime Meat','Raw Meat'] },
  Argentavis: { base:2000, perLevel:100, drainBase:0.001852, drainMult:199.983994, kibble:'Superior', foods:['Raw Mutton','Raw Prime Meat','Raw Meat'] },
  Allosaurus: { base:2400, perLevel:100, drainBase:0.002052, drainMult:180.063385, kibble:'Superior', foods:['Raw Mutton','Raw Prime Meat','Raw Meat'] }
};

const foodStats = {
  'Raw Mutton': {affinity:187.5,foodValue:50},
  'Raw Prime Meat': {affinity:150,foodValue:50},
  'Raw Meat': {affinity:50,foodValue:50},
  'Kibble': {affinity:400,foodValue:53.28}
};
export const kibbleOrder=['Basic','Simple','Regular','Superior','Exceptional','Extraordinary'];

export function availableFoods(creature){
  const profile=knockoutProfiles[creature];
  if(!profile)return [];
  return [...kibbleOrder.slice(kibbleOrder.indexOf(profile.kibble)).map(k=>`${k} Kibble`),...profile.foods];
}

export function calculateTame({creature,level,food,tamingRate=10,foodDrainRate=1}){
  const profile=knockoutProfiles[creature];
  if(!profile)return {ok:false,reason:'No verified knockout-taming profile for this creature yet.'};
  if(!Number.isInteger(Number(level))||Number(level)<1||Number(level)>1000)return {ok:false,reason:'Enter a wild level from 1 to 1000.'};
  if(!Number.isFinite(Number(tamingRate))||Number(tamingRate)<=0||!Number.isFinite(Number(foodDrainRate))||Number(foodDrainRate)<=0)return {ok:false,reason:'Server multipliers must be greater than zero.'};
  if(!availableFoods(creature).includes(food))return {ok:false,reason:'That food is not supported for this creature. Choose one from the available list.'};
  const stats=food.endsWith(' Kibble')?foodStats.Kibble:foodStats[food];
  const requiredAffinity=profile.base+profile.perLevel*Number(level);
  // Wiki accounts for post-2020 4x baseline; server taming multiplier scales affinity.
  const foodPieces=Math.ceil(requiredAffinity/(stats.affinity*4*Number(tamingRate)));
  const seconds=Math.ceil(foodPieces*stats.foodValue/(profile.drainBase*profile.drainMult*Number(foodDrainRate)));
  return {ok:true,foodPieces,seconds,minutes:seconds/60,requiredAffinity,creature,food,level:Number(level),
    caveat:'Wiki knockout-tame model; approximate total time. ASA patches, food-drain overrides, mods and initial hunger can change the result.'};
}
