import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateTame,availableFoods,knockoutProfiles} from './taming-engine.js';

test('Rex level 150 at 10x: preferred kibble count and feeding time',()=>{
 const result=calculateTame({creature:'Rex',level:150,food:'Exceptional Kibble'});
 assert.equal(result.foodPieces,2);
 assert.equal(result.seconds,256);
});
test('food affinity changes required quantity',()=>{
 const kibble=calculateTame({creature:'Rex',level:150,food:'Exceptional Kibble'});
 const meat=calculateTame({creature:'Rex',level:150,food:'Raw Meat'});
 assert.ok(meat.foodPieces>kibble.foodPieces);
 assert.ok(meat.seconds>kibble.seconds);
});
test('rate and food drain are independent',()=>{
 const a=calculateTame({creature:'Argentavis',level:100,food:'Superior Kibble',tamingRate:10,foodDrainRate:1});
 const b=calculateTame({creature:'Argentavis',level:100,food:'Superior Kibble',tamingRate:10,foodDrainRate:2});
 assert.equal(a.foodPieces,b.foodPieces);
 assert.ok(b.seconds<a.seconds);
});
test('higher taming rate never increases required food',()=>{
 const a=calculateTame({creature:'Allosaurus',level:150,food:'Raw Mutton',tamingRate:1});
 const b=calculateTame({creature:'Allosaurus',level:150,food:'Raw Mutton',tamingRate:10});
 assert.ok(b.foodPieces<=a.foodPieces);
});
test('unsupported and invalid combinations refuse a calculation',()=>{
 assert.equal(calculateTame({creature:'Wyvern',level:150,food:'Raw Meat'}).ok,false);
 assert.equal(calculateTame({creature:'Rex',level:0,food:'Raw Meat'}).ok,false);
 assert.equal(calculateTame({creature:'Rex',level:150,food:'Mejoberries'}).ok,false);
 assert.ok(!availableFoods('Wyvern').length);
});
test('expanded wiki knockout profiles preserve 14 audited core species',()=>{
 assert.ok(Object.keys(knockoutProfiles).length>=70);
 for(const creature of ['Rex','Argentavis','Allosaurus','Giganotosaurus','Stegosaurus','Therizinosaurus','Pteranodon','Tapejara','Raptor','Sabertooth','Sarcosuchus','Triceratops','Ankylosaurus','Quetzal']){
  const result=calculateTame({creature,level:150,food:availableFoods(creature)[0],tamingRate:10});
  assert.equal(result.ok,true,creature);
  assert.ok(result.foodPieces>=1,creature);
 }
});
