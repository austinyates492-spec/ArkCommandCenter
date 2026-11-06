import test from 'node:test';
import assert from 'node:assert/strict';
import {knockoutEstimate} from './knockout-engine.js';
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
