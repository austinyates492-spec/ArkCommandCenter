import assert from 'node:assert/strict';
import test from 'node:test';
import {handleTribe,parseTribeEvent} from '../src/tribe-routes.js';

const ALPHA='66ed0d9e-27c0-476d-90e9-d73ae8f345e7';
const BETA='ad02e92f-1398-4790-89f1-8fd59bd430b2';
const TIMER='eaf47cda-1f98-42ad-a6df-ab773c713e26';
const MEMBER='8d36979a-ec54-4a0d-9fdb-75d0ab40ea18';

function mocked(tribeId){
 const queries=[],replies=[];
 return {queries,replies,options:{
  pool:{query:async(sql,params)=>{queries.push({sql,params});return {rows:[]};}},
  authorize:async()=>({id:MEMBER,tribe_id:tribeId,display_name:'Survivor'}),
  bodyJson:async()=>({}),
  json:(res,status,value)=>{replies.push({status,value});}
 }};
}

test('every tribe list and delete query has an explicit tenant filter',async()=>{
 for(const path of ['/api/v1/tribe/timers','/api/v1/tribe/crafting','/api/v1/tribe/servers/live']){
  for(const tribe of [ALPHA,BETA]){
   const mock=mocked(tribe);
   await handleTribe({url:path,method:'GET'}, {},mock.options);
   assert.match(mock.queries[0].sql,/tribe_id\s*=\s*\$1/);
   assert.deepEqual(mock.queries[0].params,[tribe]);
  }
 }
 for(const path of [`/api/v1/tribe/timers/${TIMER}`,`/api/v1/tribe/servers/live/${TIMER}`]){
  const mock=mocked(BETA);
  await handleTribe({url:path,method:'DELETE'}, {},mock.options);
  assert.match(mock.queries[0].sql,/tribe_id=\$2/);
  assert.deepEqual(mock.queries[0].params,[TIMER,BETA]);
 }
});

test('notifications must specify the exact tribe; legacy global events are rejected',()=>{
 assert.deepEqual(parseTribeEvent(JSON.stringify({tribeId:ALPHA,topic:'timers'})),{tribeId:ALPHA,topic:'timers'});
 assert.equal(parseTribeEvent('timers'),null);
 assert.equal(parseTribeEvent(JSON.stringify({topic:'timers'})),null);
 assert.notEqual(ALPHA,BETA);
});
