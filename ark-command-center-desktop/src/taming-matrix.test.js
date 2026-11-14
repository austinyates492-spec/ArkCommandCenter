import test from 'node:test';
import assert from 'node:assert/strict';
import source from './wiki-taming-data.json' with {type:'json'};
import {tameCreatures} from './data.js';
import {knockoutRoster,passiveRoster,specialtyRoster,tamingCategory,getTamingMethod} from './special-taming-methods.js';
import {wikiCreatureRecord,wikiFoodOptions,calculatedWikiFeed,calculateTame,availableFoods,knockoutProfiles} from './taming-engine.js';
import {knockoutEstimate} from './knockout-engine.js';
import {passiveFoodPlan} from './passive-taming.js';
import {specialtyAmmoOptions,estimateSpecialtyKnockout,specialtyFeeding,specialtyFoodOptions} from './specialty-engine.js';

test('every catalog entry is in exactly one taming or untameable category',()=>{
 const memberships=[...knockoutRoster,...passiveRoster,...specialtyRoster,...tameCreatures.filter(name=>tamingCategory(name)==='untameable')];
 assert.equal(new Set(memberships).size,memberships.length,'duplicate creature across tabs');
 assert.deepEqual(new Set(memberships),new Set(tameCreatures));
});

test('all automatically supported wiki foods are valid for every level and server rate matrix',()=>{
 const rates=[0.5,1,2.5,10,25], levels=[1,30,150,300], drains=[0.5,1,2];
 let cases=0;
 for(const creature of knockoutRoster){
  for(const food of availableFoods(creature)){
   for(const level of levels)for(const tamingRate of rates){
    const base=calculateTame({creature,food,level,tamingRate,foodDrainRate:1});
    if(!base.ok)continue; // unsupported data must remain explicitly unsupported.
    assert.ok(Number.isInteger(base.foodPieces)&&base.foodPieces>=1,`${creature} ${food} level ${level}`);
    assert.ok(Number.isFinite(base.seconds)&&base.seconds>0,`${creature} ${food} duration`);
    for(const foodDrainRate of drains){
     const value=calculateTame({creature,food,level,tamingRate,foodDrainRate});
     assert.equal(value.ok,true);
     assert.equal(value.foodPieces,base.foodPieces,'food count should not depend on dinosaur food-drain');
     if(foodDrainRate>1)assert.ok(value.seconds<=base.seconds);
     if(foodDrainRate<1)assert.ok(value.seconds>=base.seconds);
     cases++;
    }
   }
  }
 }
 assert.ok(cases>4000,`insufficient calculation matrix coverage: ${cases}`);
});

test('wiki-backed ordinary tames use exact published food preferences, not simplified example lists',()=>{
 for(const creature of ['Rex','Argentavis','Allosaurus','Stegosaurus','Pteranodon','Raptor']){
  const wiki=wikiCreatureRecord(creature);
  assert.ok(wiki);
  assert.equal(knockoutProfiles[creature].fromWiki,true,creature);
  assert.deepEqual(availableFoods(creature),wikiFoodOptions(creature));
 }
});

test('passive waking-tame affinity, consumption and last instantaneous feed match the wiki model',()=>{
 const name='Araneo',w=wikiCreatureRecord(name),food='Spoiled Meat',level=150,rate=10;
 const stats=w.specialFoodValues?.[food]||source.food[food];
 const affinity=stats.affinity*(w.wakeAffinityMult??1)*4*rate;
 const pieces=Math.ceil((w.affinityNeeded0+w.affinityIncrease*level)/affinity);
 const expectedSeconds=Math.ceil(Math.max(0,pieces-1)*stats.foodValue*(w.wakeFoodDeplMult??1)/(w.foodConsumptionBase*w.foodConsumptionMult));
 const calculated=calculatedWikiFeed({creature:name,level,food,tamingRate:rate});
 assert.equal(calculated.ok,true);
 assert.equal(calculated.foodPieces,pieces);
 assert.equal(calculated.seconds,expectedSeconds);
 assert.equal(calculated.passive,true);
 assert.equal(passiveFoodPlan({creature:name,level,food,tamingRate:rate}).pieces,pieces);
 assert.deepEqual(passiveFoodPlan({creature:'Ovis',level:150,food:'Sweet Vegetable Cake'}).pieces,1);
});

test('custom-affinity creatures never silently gain the universal 4x factor',()=>{
 const record=wikiCreatureRecord('Basilisk');
 assert.equal(record.usesCustomAffinityLogic,true);
 const result=calculatedWikiFeed({creature:'Basilisk',level:150,food:'Fertilized Rock Drake Egg',tamingRate:1});
 assert.equal(result.ok,true);
 const expected=Math.ceil((record.affinityNeeded0+record.affinityIncrease*150)/record.specialFoodValues['Fertilized Rock Drake Egg'].affinity);
 assert.equal(result.foodPieces,expected);
 assert.equal(result.customAffinity,true);
});

test('conventional tranq calculations reject non-tranq creatures even if given manual torpor',()=>{
 for(const creature of ['Ovis','Coelacanth','Wyvern','Karkinos','Giganotosaurus']){
  assert.equal(knockoutEstimate({creature,level:150,targetTorpor:15000}).ok,false,creature);
 }
 const ordinary=knockoutEstimate({creature:'Rex',level:150,targetTorpor:3000});
 assert.equal(ordinary.ok,true);
 assert.equal(ordinary.totalTorpor,3000);
 assert.equal(ordinary.manual,true);
});

test('every supported knockout, passive and specialty model returns only finite positive counts',()=>{
 let knockoutCases=0, passiveCases=0, specialtyCases=0;
 for(const creature of knockoutRoster){
  const r=knockoutEstimate({creature,level:150});
  if(!r.ok)continue;
  assert.ok(Number.isFinite(r.totalTorpor)&&r.totalTorpor>0,creature);
  for(const row of r.rows)assert.ok(Number.isInteger(row.body)&&row.body>0,creature);
  knockoutCases++;
 }
 for(const creature of passiveRoster){
  for(const food of new Set([...wikiFoodOptions(creature)])){
   const r=passiveFoodPlan({creature,level:150,food,tamingRate:10});
   if(!r.ok)continue;
   assert.ok(Number.isInteger(r.pieces)&&r.pieces>0,creature);
   assert.ok(Number.isFinite(r.seconds)&&r.seconds>=0,creature);
   passiveCases++;
  }
 }
 for(const creature of specialtyRoster){
  const method=getTamingMethod(creature);
  assert.ok(method&&method.instructions,creature);
  for(const ammo of specialtyAmmoOptions(creature)){
   const r=estimateSpecialtyKnockout({creature,level:150,ammo:ammo.label});
   assert.equal(r.ok,true,creature);
   assert.ok(Number.isInteger(r.amount)&&r.amount>0,creature);
   specialtyCases++;
  }
  for(const food of specialtyFoodOptions(creature)){
   const r=specialtyFeeding({creature,level:150,food,tamingRate:10});
   if(!r.ok)continue;
   assert.ok(Number.isInteger(r.foodPieces)&&r.foodPieces>0,creature);
   if(r.seconds!==null)assert.ok(Number.isFinite(r.seconds)&&r.seconds>=0,creature);
   specialtyCases++;
  }
 }
 assert.ok(knockoutCases>80,'too few knockout stat profiles');
 assert.ok(specialtyCases>10,'too few special calculator cases');
 console.info(`Tame matrix: ${knockoutCases} knockout torpor species, ${passiveCases} passive food scenarios, ${specialtyCases} specialty food/ammo scenarios. Unsupported creatures remain explicitly unquantified.`);
});
