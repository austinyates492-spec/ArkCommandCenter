import test from 'node:test';
import assert from 'node:assert/strict';
import {knockoutEstimate} from './knockout-engine.js';

const estimate=overrides=>knockoutEstimate({creature:'Rex',level:150,...overrides});
test('official baseline defaults to a 100% weapon and no bonus longneck multiplier',()=>{
 const result=estimate();
 assert.equal(result.ok,true);
 assert.equal(result.longneckBuffPercent,100);
 assert.equal(result.torporMultiplier,1);
 const dart=result.rows.find(row=>row.id==='dart');
 assert.equal(dart.torporPerShot,221);
 assert.equal(dart.body,Math.ceil(result.totalTorpor/221));
});
test('changing weapon damage or multiplier recalculates counts without changing the creature torpor',()=>{
 const base=estimate();
 const stronger=estimate({weaponQuality:200});
 const modified=estimate({torporMultiplier:2});
 assert.equal(stronger.totalTorpor,base.totalTorpor);
 assert.equal(modified.totalTorpor,base.totalTorpor);
 assert.equal(stronger.rows.find(row=>row.id==='crossbow').torporPerShot,315);
 assert.equal(modified.rows.find(row=>row.id==='crossbow').torporPerShot,315);
 assert.ok(stronger.rows.find(row=>row.id==='crossbow').body<base.rows.find(row=>row.id==='crossbow').body);
});
test('additional longneck modifier affects darts but not arrows',()=>{
 const base=estimate();
 const buff=estimate({longneckBuffPercent:300});
 assert.equal(buff.rows.find(row=>row.id==='crossbow').body,base.rows.find(row=>row.id==='crossbow').body);
 assert.equal(buff.rows.find(row=>row.id==='dart').torporPerShot,663);
});
