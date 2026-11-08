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
test('NomadARK Longneck 300% applies to darts, not arrows',()=>{
 const base=knockoutEstimate({creature:'Rex',level:150,weaponQuality:100,longneckBuffPercent:100});
 const nomad=knockoutEstimate({creature:'Rex',level:150,weaponQuality:100,longneckBuffPercent:300});
 for(const id of ['bow','crossbow','compound']){
  assert.equal(nomad.rows.find(row=>row.id===id).body,base.rows.find(row=>row.id===id).body,id);
 }
 for(const id of ['dart','shocking']){
  assert.ok(nomad.rows.find(row=>row.id===id).body<base.rows.find(row=>row.id===id).body,id);
 }
 assert.equal(knockoutEstimate({creature:'Rex',level:150,longneckBuffPercent:0}).ok,false);
});
test('invalid creature or rate refuses estimates',()=>{
 assert.equal(knockoutEstimate({creature:'Wyvern',level:150}).ok,false);
 assert.equal(knockoutEstimate({creature:'Rex',level:150,weaponQuality:0}).ok,false);
});
test('common ASA knockout creatures scale torpor with wild level',()=>{
 for(const creature of ['Stegosaurus','Therizinosaurus','Pteranodon','Quetzal','Raptor','Triceratops']){
  const low=knockoutEstimate({creature,level:1});
  const high=knockoutEstimate({creature,level:150});
  assert.equal(low.ok,true,creature);
  assert.ok(high.totalTorpor>low.totalTorpor,creature);
 }
});
test('egg-only creatures reject manual torpor overrides',()=>{
 const result=knockoutEstimate({creature:'Wyvern',level:150,targetTorpor:12000,weaponQuality:100});
 assert.equal(result.ok,false);
 assert.match(result.reason,/Nest egg/);
});
test('ASA-category knockout profiles include conventional creatures and variants',()=>{
 assert.ok(Object.keys(knockoutSpecies).length>=130);
 for(const name of ['Baryonyx','Dodo','Yutyrannus','Tek Rex']){
  const result=knockoutEstimate({creature:name,level:150});
  assert.equal(result.ok,true,name);
  assert.ok(result.totalTorpor>0,name);
 }
});
test('category-supported variants inherit conservative torpor values',()=>{
 const r=knockoutEstimate({creature:'Aberrant Baryonyx',level:150});
 assert.equal(r.ok,true);
 assert.equal(r.verification,'variant-parent-stat-assumed');
 assert.equal(r.rows[0].head,null);
});
test('creatures outside the knockout category cannot silently receive tranq estimates',()=>{
 for(const name of ['Carcharodontosaurus','Ceratosaurus','Deinosuchus','Dreadnoughtus','Karkinos','Rock Elemental']){
  assert.equal(knockoutEstimate({creature:name,level:150}).ok,false,name);
 }
});
test('passive and boss creatures do not automatically gain a knockout method',()=>{
 for(const creature of ['Ovis','Manta','Broodmother Lysrix','Wyvern']){
  assert.equal(knockoutEstimate({creature,level:150}).ok,false,creature);
 }
});
