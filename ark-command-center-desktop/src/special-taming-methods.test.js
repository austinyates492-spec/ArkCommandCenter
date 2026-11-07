import test from 'node:test';
import assert from 'node:assert/strict';
import {getTamingMethod} from './special-taming-methods.js';
import {knockoutEstimate} from './knockout-engine.js';

test('special heavy knockout only lists heavy weapons',()=>{
 const method=getTamingMethod('Rock Elemental');
 assert.deepEqual(method.items,['Cannonball · Cannon']);
 assert.equal(knockoutEstimate({creature:'Rock Elemental',level:150,targetTorpor:50000}).ok,false);
});
test('egg-only and passive tames never offer normal arrows even with override',()=>{
 for(const creature of ['Basilisk','Wyvern','Deinonychus','Ovis','Ceratosaurus','Rhyniognatha']){
  const method=getTamingMethod(creature);
  assert.ok(method);
  assert.equal(knockoutEstimate({creature,level:150,targetTorpor:2500}).ok,false,creature);
  assert.ok(!method.items.some(item=>/Tranq Arrow|Tranq Dart|Shocking Dart/.test(item)));
 }
});
test('ordinary knockout remains available for Rex',()=>{
 assert.equal(getTamingMethod('Rex'),null);
 assert.equal(knockoutEstimate({creature:'Rex',level:150}).ok,true);
});
test('unreviewed special methods never invent a specific item',()=>{
 const method=getTamingMethod('Cosmo');
 assert.equal(method.status,'needs-review');
 assert.deepEqual(method.items,[]);
});
