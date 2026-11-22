import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeTimerAdjustment} from '../src/tribe-logic.js';

test('accepts remaining time and expected revision for a shared timer',()=>{
 assert.deepEqual(normalizeTimerAdjustment({remainingMinutes:12.5,expectedEnd:1760000000000}),{remainingMinutes:12.5,expectedEnd:1760000000000});
});
test('allows a missed timer to be restarted',()=>{
 assert.equal(normalizeTimerAdjustment({remainingMinutes:30,expectedEnd:1760000000000}).remainingMinutes,30);
});
test('rejects invalid correction input',()=>{
 for(const value of [-1,'nope',Infinity,525601])assert.throws(()=>normalizeTimerAdjustment({remainingMinutes:value,expectedEnd:1760000000000}));
 assert.throws(()=>normalizeTimerAdjustment({remainingMinutes:5,expectedEnd:0}));
});
