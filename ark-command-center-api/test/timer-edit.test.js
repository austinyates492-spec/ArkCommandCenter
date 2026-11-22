import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeTimerEdit} from '../src/tribe-logic.js';

const valid={name:'Rex maturation',type:'Maturation',mode:'remaining',minutes:12.5,expectedEnd:1760000000000};

test('validates an existing timer edit without changing its identity',()=>{
 assert.deepEqual(normalizeTimerEdit(valid),{...valid,reopen:false});
 assert.equal(normalizeTimerEdit({...valid,mode:'total',minutes:180}).mode,'total');
 assert.equal(normalizeTimerEdit({...valid,mode:'extend',minutes:5}).minutes,5);
 assert.equal(normalizeTimerEdit({...valid,reopen:true}).reopen,true);
});

test('rejects invalid timer edits and unknown operations',()=>{
 for(const mode of ['delete','progress',''])assert.throws(()=>normalizeTimerEdit({...valid,mode}));
 for(const minutes of [0,-1,Infinity,'bad',525601])assert.throws(()=>normalizeTimerEdit({...valid,minutes}));
 for(const name of ['', 'x'.repeat(121)])assert.throws(()=>normalizeTimerEdit({...valid,name}));
 assert.throws(()=>normalizeTimerEdit({...valid,expectedEnd:0}));
});
