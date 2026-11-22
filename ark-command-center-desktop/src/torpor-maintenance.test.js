import test from 'node:test';
import assert from 'node:assert/strict';
import {torporDrainRate,unconsciousSupplies} from './torpor-maintenance.js';

test('official wiki torpor drain formula matches baseline and scales with level',()=>{
 assert.equal(torporDrainRate({baseRate:0.3,level:1}),0.3);
 const lvl150=torporDrainRate({baseRate:0.3,level:150});
 assert.ok(lvl150>0.3);
 assert.equal(torporDrainRate({baseRate:0.3,level:150,drainMultiplier:2}),lvl150*2);
});
test('full torpor lasting longer than tame time needs no narcotics',()=>{
 const r=unconsciousSupplies({creature:'Rex',level:150,tameSeconds:10,totalTorpor:15000});
 assert.equal(r.ok,true);
 assert.deepEqual(r.rows.map(row=>row.amount),[0,0,0]);
});
test('wiki-model upkeep uses individual consumable torpor and effect duration',()=>{
 const r=unconsciousSupplies({creature:'Raptor',level:150,tameSeconds:3600,totalTorpor:100,startingTorpor:80});
 assert.equal(r.ok,true);
 const deficit=Math.max(0,r.drainPerSecond*3600-80);
 assert.deepEqual(r.rows.map(row=>row.amount),[
  Math.ceil(deficit/(7.5+3*r.drainPerSecond)),
  Math.ceil(deficit/(40+8*r.drainPerSecond)),
  Math.ceil(deficit/(80+16*r.drainPerSecond))
 ]);
});
test('missing species drain rate is never fabricated',()=>{
 const r=unconsciousSupplies({creature:'Nonexistent Creature',level:150,tameSeconds:3600,totalTorpor:100});
 assert.equal(r.ok,false);
});
test('invalid current torpor and server multiplier are rejected',()=>{
 assert.equal(unconsciousSupplies({creature:'Rex',level:150,tameSeconds:3600,totalTorpor:100,startingTorpor:101}).ok,false);
 assert.equal(unconsciousSupplies({creature:'Rex',level:150,tameSeconds:3600,totalTorpor:100,drainMultiplier:0}).ok,false);
});
