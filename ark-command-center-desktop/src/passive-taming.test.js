import test from 'node:test';
import assert from 'node:assert/strict';
import {passiveFoodPlan,passiveProfiles} from './passive-taming.js';
test('Ovis uses exactly one cake',()=>{
 const p=passiveFoodPlan({creature:'Ovis',level:150,tamingRate:10});
 assert.equal(p.ok,true);assert.equal(p.pieces,1);
});
test('special passive tames do not invent a fixed feeding time',()=>{
 const p=passiveFoodPlan({creature:'Moschops',level:150,tamingRate:10});
 assert.equal(p.ok,false);assert.match(p.reason,/feeding intervals/);
 assert.ok(Object.keys(passiveProfiles).length>=10);
});
