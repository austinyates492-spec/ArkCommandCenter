import test from 'node:test';
import assert from 'node:assert/strict';
import {specialtyAmmoOptions,estimateSpecialtyKnockout,specialtyFeeding} from './specialty-engine.js';
import {knockoutRoster,passiveRoster,specialtyRoster,tamingCategory} from './special-taming-methods.js';
import {tameCreatures} from './data.js';
import {availableFoods,calculateTame} from './taming-engine.js';
import {passiveFoodPlan} from './passive-taming.js';

test('mutually exclusive tab rosters cover the complete 278-entry catalog',()=>{
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
