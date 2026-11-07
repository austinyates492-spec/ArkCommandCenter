import test from 'node:test';
import assert from 'node:assert/strict';
import {tameCreatures,species} from './data.js';
import {knockoutRoster,passiveRoster,specialtyRoster,tamingCategory} from './special-taming-methods.js';
import {availableFoods,calculateTame,wikiFoodOptions} from './taming-engine.js';
import {passiveFoodPlan} from './passive-taming.js';
import {specialtyAmmoOptions,estimateSpecialtyKnockout,specialtyFoodOptions,specialtyFeeding} from './specialty-engine.js';
import {knockoutEstimate} from './knockout-engine.js';
import wikiRecipes from './wiki-crafting-recipes.json' with {type:'json'};
import {starterRecipes} from './crafting-recipes.js';
import {buildTree,validateRecipes} from './crafting-engine.js';

test('every available conventional food returns a finite, positive estimate across levels/rates',()=>{
 let checked=0;
 for(const creature of knockoutRoster){
  for(const food of availableFoods(creature)){
   let prevCount=0;
   for(const level of [1,30,90,150,300]){
    const vanilla=calculateTame({creature,level,food,tamingRate:1,foodDrainRate:1});
    const boosted=calculateTame({creature,level,food,tamingRate:10,foodDrainRate:1});
    const fastDrain=calculateTame({creature,level,food,tamingRate:10,foodDrainRate:2});
    assert.equal(vanilla.ok,true,`${creature}: ${food} @ level ${level}: ${vanilla.reason}`);
    assert.equal(boosted.ok,true,`${creature}: ${food} @ level ${level}: ${boosted.reason}`);
    assert.equal(fastDrain.ok,true,`${creature}: ${food} @ level ${level}: ${fastDrain.reason}`);
    assert.ok(Number.isSafeInteger(boosted.foodPieces)&&boosted.foodPieces>0,creature);
    assert.ok(Number.isSafeInteger(boosted.seconds)&&boosted.seconds>0,creature);
    assert.ok(boosted.foodPieces<=vanilla.foodPieces,creature);
    assert.ok(boosted.foodPieces>=prevCount,creature);
    assert.ok(fastDrain.seconds<=boosted.seconds,creature);
    prevCount=boosted.foodPieces;
    checked++;
   }
  }
 }
 assert.ok(checked>3000);
});

test('specialty heavy-ammo minimum counts increase with level and never expose tranq arrows',()=>{
 let verifiedTypes=0;
 for(const creature of specialtyRoster){
  for(const item of specialtyAmmoOptions(creature)){
   const low=estimateSpecialtyKnockout({creature,level:1,ammo:item.label});
   const high=estimateSpecialtyKnockout({creature,level:150,ammo:item.label});
   assert.equal(low.ok,true,`${creature}: ${item.label}`);
   assert.equal(high.ok,true,`${creature}: ${item.label}`);
   assert.ok(high.amount>=low.amount);
   assert.ok(high.amount>=1);
   assert.equal(knockoutEstimate({creature,level:150}).ok,false);
   verifiedTypes++;
  }
 }
 assert.ok(verifiedTypes>=5);
});

test('every published specialty offering produces finite counts or explicitly withholds unverified math',()=>{
 let checked=0,unverified=0;
 for(const creature of specialtyRoster){
  for(const food of specialtyFoodOptions(creature)){
   const result=specialtyFeeding({creature,food,level:150,tamingRate:10});
   if(result.ok){
    assert.ok(Number.isSafeInteger(result.foodPieces)&&result.foodPieces>0);
    if(result.model==='bloodstalker'||result.model==='octopus-biotoxin')assert.equal(result.seconds,null);
    else assert.ok(result.seconds>0);
    checked++;
   }else{
    assert.ok(result.reason?.length>15,`${creature}: ${food} lacks a reason`);
    assert.equal(result.foodPieces,undefined,`${creature}: ${food} falsely claims a count`);
    unverified++;
   }
  }
 }
 assert.ok(checked>=15);
 assert.ok(unverified>=3);
});

test('all passive entries either provide valid food counts or an explicit manual requirement',()=>{
 for(const creature of passiveRoster){
  const food=wikiFoodOptions(creature)[0];
  const result=passiveFoodPlan({creature,level:150,food,tamingRate:10});
  if(result.ok){assert.ok(Number.isSafeInteger(result.pieces)&&result.pieces>=1,creature);}
  else assert.ok(result.reason?.length>10,creature);
 }
});

test('complete roster partitions are disjoint and breeding values are positive',()=>{
 const seen=new Set([...knockoutRoster,...passiveRoster,...specialtyRoster]);
 assert.equal(seen.size,knockoutRoster.length+passiveRoster.length+specialtyRoster.length);
 assert.equal([...seen].filter(name=>tamingCategory(name)==='untameable').length,0);
 assert.equal(tameCreatures.length-seen.size,35);
 for(const [name,entry] of Object.entries(species)){
  assert.ok(Number.isFinite(entry.mature)&&entry.mature>0,`${name} has bad maturation`);
  for(const field of ['hatch','gestation'])if(entry[field]!==undefined)assert.ok(Number.isFinite(entry[field])&&entry[field]>0,`${name} has bad ${field}`);
 }
});

test('all wiki crafting recipes expand to a finite and acyclic tree at quantities 1 and 1000',()=>{
 const all={...wikiRecipes,...starterRecipes};
 assert.equal(validateRecipes(all),true);
 for(const name of Object.keys(all)){
  for(const quantity of [1,1000]){
   const tree=buildTree(name,quantity,all);
   assert.equal(tree.quantity,quantity,name);
   assert.ok(Number.isSafeInteger(tree.batches)&&tree.batches>0,name);
  }
 }
});
