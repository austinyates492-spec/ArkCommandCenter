import test from 'node:test';
import assert from 'node:assert/strict';
import {specialtyAmmoOptions,estimateSpecialtyKnockout,specialtyFeeding,specialtyFixedSupply,specialtyFoodOptions} from './specialty-engine.js';
import {knockoutRoster,passiveRoster,specialtyRoster,tamingCategory,getTamingMethod} from './special-taming-methods.js';
import {tameCreatures} from './data.js';
import {availableFoods,calculateTame} from './taming-engine.js';
import {passiveFoodPlan} from './passive-taming.js';

test('mutually exclusive tab rosters cover the complete 279-entry catalog',()=>{
 const groups=[...knockoutRoster,...passiveRoster,...specialtyRoster];
 assert.equal(new Set(groups).size,groups.length);
 assert.equal(groups.length+tameCreatures.filter(name=>tamingCategory(name)==='untameable').length,tameCreatures.length);
 assert.equal(tamingCategory('Karkinos'),'specialty');
 assert.equal(tamingCategory('Rex'),'knockout');
 assert.equal(tamingCategory('Ovis'),'passive');
 assert.ok(!knockoutRoster.includes('Rock Elemental'));
 assert.ok(!specialtyRoster.includes('Rex'));
});
test('Karkinos level 150 heavy projectiles use wiki torpor per hit',()=>{
 const boulder=estimateSpecialtyKnockout({creature:'Karkinos',level:150,ammo:'Boulder · Catapult Turret'});
 const cannon=estimateSpecialtyKnockout({creature:'Karkinos',level:150,ammo:'Cannonball · Cannon'});
 assert.equal(boulder.totalTorpor,6760);
 assert.equal(boulder.amount,16);
 assert.equal(cannon.amount,1);
 assert.equal(specialtyAmmoOptions('Karkinos').length,2);
});
test('specialty foods calculate Karkinos kibble and spoiled meat at 10x',()=>{
 const kibble=specialtyFeeding({creature:'Karkinos',level:150,food:'Exceptional Kibble',tamingRate:10});
 const meat=specialtyFeeding({creature:'Karkinos',level:150,food:'Spoiled Meat',tamingRate:10});
 assert.equal(kibble.ok,true);
 assert.equal(kibble.foodPieces,3);
 assert.equal(meat.ok,true);
 assert.equal(meat.foodPieces,10);
 assert.ok(meat.seconds>kibble.seconds);
});
test('heavy ammo estimates are not invented for other special tames',()=>{
 assert.equal(specialtyAmmoOptions('Basilisk').length,0);
 assert.equal(estimateSpecialtyKnockout({creature:'Basilisk',level:150,ammo:'Cannonball · Cannon'}).ok,false);
 assert.equal(specialtyFeeding({creature:'Basilisk',level:150,food:'Exceptional Kibble'}).ok,false);
 const egg=specialtyFeeding({creature:'Basilisk',level:150,food:'Fertilized Rock Drake Egg',tamingRate:10});
 assert.equal(egg.ok,true);
 assert.ok(egg.foodPieces>=1);
 const honey=specialtyFeeding({creature:'Roll Rat',level:150,food:'Giant Bee Honey',tamingRate:10});
 assert.equal(honey.ok,true);
});
test('published food values cover additional conventional and passive tames',()=>{
 const b=calculateTame({creature:'Baryonyx',level:150,food:availableFoods('Baryonyx')[0],tamingRate:10});
 const tek=calculateTame({creature:'Tek Rex',level:150,food:'Exceptional Kibble',tamingRate:10});
 const a=passiveFoodPlan({creature:'Araneo',level:150,food:'Spoiled Meat',tamingRate:10});
 assert.equal(b.ok,true);
 assert.equal(tek.ok,true);
 assert.equal(a.ok,true);
 assert.equal(a.approximate,true);
});
test('all specialty roster forms have species-specific sourced methods or explicit unavailable status',()=>{
 assert.ok(specialtyRoster.length>=73);
 for(const creature of specialtyRoster){
  const method=getTamingMethod(creature);
  assert.ok(method,creature);
  assert.ok(/^https:\/\/(?:ark\.wiki\.gg\/wiki\/|survivetheark\.com\/index\.php\?\/forums\/)/.test(method.source),`${creature}: missing wiki or official source`);
  assert.ok(method.instructions.length>35,`${creature}: missing procedure`);
  assert.ok(['documented','unreleased','unavailable'].includes(method.status),`${creature}: ${method.status}`);
 }
 assert.equal(tamingCategory('Cerberax'),'specialty');
 assert.ok(!knockoutRoster.includes('Cerberax'));
});
test('Bloodstalker blood packs use level and NomadARK rate, with an explicit supply buffer',()=>{
 const vanilla=specialtyFeeding({creature:'Bloodstalker',level:150,food:'Blood Pack',tamingRate:1});
 assert.equal(vanilla.foodPieces,1500);
 const nomad=specialtyFeeding({creature:'Bloodstalker',level:150,food:'Blood Pack',tamingRate:10,foodDrainRate:0.5});
 assert.equal(nomad.ok,true);
 assert.equal(nomad.foodPieces,150);
 assert.equal(nomad.bufferPieces,188);
 assert.equal(nomad.seconds,null);
 assert.equal(specialtyFeeding({creature:'Bloodstalker',level:300,food:'Blood Pack',tamingRate:10}).foodPieces,300);
 assert.equal(specialtyFeeding({creature:'Bloodstalker',level:150,food:'Blood Pack',tamingRate:0}).ok,false);
 assert.deepEqual(specialtyFoodOptions('Bloodstalker'),['Blood Pack']);
});
test('Palaeoctopus counts minimum Bio Toxin bite interactions, not post-knockout food',()=>{
 const result=specialtyFeeding({creature:'Palaeoctopus',level:150,food:'Bio Toxin',tamingRate:10});
 assert.equal(result.ok,true);
 assert.equal(result.totalTorpor,19880);
 assert.equal(result.foodPieces,25);
 assert.equal(result.minBiteSeconds,360);
 assert.equal(result.maxBiteSeconds,480);
 assert.equal(result.minutes,null);
 assert.ok(getTamingMethod('Palaeoctopus').postKnockoutFoods.includes('Black Pearls'));
 assert.ok(specialtyAmmoOptions('Palaeoctopus').length===0);
});
test('fish baskets and nest eggs require one capture item; unsupported interactions give no invented count',()=>{
 assert.deepEqual(specialtyFixedSupply('Piranha'),{item:'Fish Basket',amount:1,caveat:'One basket per captured creature; it is not a feeding-based tame.'});
 assert.equal(specialtyFixedSupply('Magmasaur').amount,1);
 assert.equal(specialtyFixedSupply('Desmodus'),null);
 assert.equal(specialtyFeeding({creature:'Desmodus',food:'Blood Pack',level:150,tamingRate:10}).ok,false);
 assert.deepEqual(specialtyFoodOptions('Cosmo'),['Plant Species Z Seed','Chitin']);
 assert.equal(specialtyFeeding({creature:'Cosmo',food:'Chitin',level:150,tamingRate:10}).ok,false);
});
