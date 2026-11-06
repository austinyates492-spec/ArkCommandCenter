import test from 'node:test';
import assert from 'node:assert/strict';
import {knockoutEstimate,knockoutSpecies} from './knockout-engine.js';
test('Rex at level 150 has scaled torpor and fewer headshots',()=>{
 const r=knockoutEstimate({creature:'Rex',level:150});
 assert.equal(r.totalTorpor,15407);
 assert.equal(r.rows.find(x=>x.id==='crossbow').body,98);
 assert.ok(r.rows.find(x=>x.id==='crossbow').head<98);
});
test('Argentavis does not show obsolete headshot bonus',()=>{
 const r=knockoutEstimate({creature:'Argentavis',level:150});
 assert.equal(r.rows[0].head,null);
 assert.equal(r.projectileMultiplier,1.5);
});
test('weapon damage percent scales shot count',()=>{
 const basic=knockoutEstimate({creature:'Allosaurus',level:150,weaponQuality:100});
 const improved=knockoutEstimate({creature:'Allosaurus',level:150,weaponQuality:200});
 assert.ok(improved.rows[0].body<basic.rows[0].body);
});
test('invalid creature or rate refuses estimates',()=>{
 assert.equal(knockoutEstimate({creature:'Wyvern',level:150}).ok,false);
 assert.equal(knockoutEstimate({creature:'Rex',level:150,weaponQuality:0}).ok,false);
});
test('common ASA knockout creatures scale torpor with wild level',()=>{
 for(const creature of ['Giganotosaurus','Stegosaurus','Therizinosaurus','Pteranodon','Quetzal','Raptor','Triceratops']){
  const low=knockoutEstimate({creature,level:1});
  const high=knockoutEstimate({creature,level:150});
  assert.equal(low.ok,true,creature);
  assert.ok(high.totalTorpor>low.totalTorpor,creature);
 }
});
test('unmodeled creatures use manual torpor without invented headshot bonus',()=>{
 const result=knockoutEstimate({creature:'Wyvern',level:150,targetTorpor:12000,weaponQuality:100});
 assert.equal(result.ok,true);
 assert.equal(result.manual,true);
 assert.equal(result.totalTorpor,12000);
 assert.equal(result.rows[0].head,null);
});
test('100 available knockout profiles include conventional creatures and variants',()=>{
 assert.equal(Object.keys(knockoutSpecies).length,100);
 for(const name of ['Baryonyx','Dodo','Yutyrannus','Tek Rex']){
  const result=knockoutEstimate({creature:name,level:150});
  assert.equal(result.ok,true,name);
  assert.ok(result.totalTorpor>0,name);
 }
});
