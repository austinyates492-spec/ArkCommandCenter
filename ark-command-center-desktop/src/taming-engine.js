// Data and algorithm adapted from the ARK Official Community Wiki's
// Module:TamingTable/creatures, Module:TamingTable/food and Module:TamingTable.
// https://ark.wiki.gg/wiki/Module:TamingTable
// This is the wiki's standard knockout-tame model; special taming mechanics
// and creatures without audited values must not return fabricated estimates.
export const knockoutProfiles = {
  Rex: { base:3450, perLevel:150, drainBase:0.002314, drainMult:180.063385, kibble:'Exceptional', foods:['Raw Mutton','Raw Prime Meat','Raw Meat'] },
  Argentavis: { base:2000, perLevel:100, drainBase:0.001852, drainMult:199.983994, kibble:'Superior', foods:['Raw Mutton','Raw Prime Meat','Raw Meat'] },
  Allosaurus: { base:2400, perLevel:100, drainBase:0.002052, drainMult:180.063385, kibble:'Superior', foods:['Raw Mutton','Raw Prime Meat','Raw Meat'] }
  ,Giganotosaurus: {base:5000,perLevel:160,drainBase:0.002314,drainMult:160.056335,kibble:'Exceptional',foods:['Raw Mutton','Raw Prime Meat','Raw Meat']}
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

const foodStats = {
  'Raw Mutton': {affinity:187.5,foodValue:50},
  'Raw Prime Meat': {affinity:150,foodValue:50},
  'Raw Meat': {affinity:50,foodValue:50},
  'Vegetables': {affinity:40,foodValue:40},
  'Mejoberries': {affinity:30,foodValue:30},
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
  const original=profile.special?.[food]??(food.endsWith(' Kibble')?foodStats.Kibble:foodStats[food]);
  const stats=food.endsWith(' Kibble')&&profile.kibbleFoodValue?{...original,foodValue:profile.kibbleFoodValue}:original;
  const requiredAffinity=profile.base+profile.perLevel*Number(level);
  // Wiki accounts for post-2020 4x baseline; server taming multiplier scales affinity.
  const foodPieces=Math.ceil(requiredAffinity/(stats.affinity*4*Number(tamingRate)));
  const seconds=Math.ceil(foodPieces*stats.foodValue/(profile.drainBase*profile.drainMult*Number(foodDrainRate)));
  return {ok:true,foodPieces,seconds,minutes:seconds/60,requiredAffinity,creature,food,level:Number(level),
    caveat:'Wiki knockout-tame model; approximate total time. ASA patches, food-drain overrides, mods and initial hunger can change the result.'};
}
