import assert from 'node:assert/strict';
import test from 'node:test';
import {normalizeTimer,normalizeTimerSound,normalizeCrafting,normalizeServer,serializeTimer} from '../src/tribe-logic.js';

test('timer is calculated using server time, not device clock',()=>{
 const timer=normalizeTimer({name:'Rex hatch',type:'Egg',minutes:2.5},100000);
 assert.deepEqual(timer,{name:'Rex hatch',type:'Egg',created:100000,end:250000});
 assert.throws(()=>normalizeTimer({name:'',minutes:1}));
 assert.throws(()=>normalizeTimer({name:'bad',minutes:-1}));
 assert.throws(()=>normalizeTimer({name:'bad',minutes:525601}));
});
test('crafting uses exact whole quantities with limits',()=>{
 assert.deepEqual(normalizeCrafting({name:'Sloped Wooden Roof',quantity:1000}),{name:'Sloped Wooden Roof',quantity:1000});
 for(const quantity of [0,-1,1.5,1000001])assert.throws(()=>normalizeCrafting({name:'Wood',quantity}));
});
test('server records use a normalized duplicate key and validated status',()=>{
 assert.equal(normalizeServer({name:'PvP #12',map:'The Island',status:'Available'}).serverKey,'the island|pvp #12');
 assert.throws(()=>normalizeServer({name:'1',map:'The Island',status:'Destroyed'}));
});
test('timestamps are emitted as numbers for synchronized countdowns',()=>{
 assert.equal(serializeTimer({id:'a',name:'Test',type:'Custom',created_ms:'1000',end_ms:'2000'}).end,2000);
});
test('timer alert preferences accept only explicit booleans',()=>{
 assert.deepEqual(normalizeTimerSound({enabled:true}),{enabled:true});
 assert.deepEqual(normalizeTimerSound({enabled:false}),{enabled:false});
 for(const invalid of [undefined,null,0,1,'false',{},[]])assert.throws(()=>normalizeTimerSound({enabled:invalid}));
});
