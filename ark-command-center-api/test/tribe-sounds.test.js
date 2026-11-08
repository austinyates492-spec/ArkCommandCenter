import assert from 'node:assert/strict';
import test from 'node:test';
import {handleTribe} from '../src/tribe-routes.js';

const ID='eaf47cda-1f98-42ad-a6df-ab773c713e26';
const ALICE='8d36979a-ec54-4a0d-9fdb-75d0ab40ea18';
const BOB='99ecf7f1-e96c-4834-9cf1-1472a16db0c7';
const TRIBE='66ed0d9e-27c0-476d-90e9-d73ae8f345e7';
function optionsFor(member,query,body){
 const replies=[];
 return {replies,options:{
  pool:{query},authorize:async()=>({id:member,tribe_id:TRIBE,display_name:'Survivor'}),bodyJson:async()=>body,
  json:(res,status,value)=>{replies.push({status,value});}
 }};
}

test('member sounds API only queries this member’s preferences',async()=>{
 const queries=[];
 const {options,replies}=optionsFor(ALICE,async(sql,values)=>{
  queries.push({sql,values});return {rows:[{timer_id:ID,enabled:false}]};
 });
 await handleTribe({url:'/api/v1/tribe/timers/sounds',method:'GET'}, {},options);
 assert.deepEqual(queries[0].values,[ALICE,TRIBE]);
 assert.deepEqual(replies[0],{status:200,value:{sounds:{[ID]:false}}});
});

test('each member can mute the same shared timer independently',async()=>{
 const records=[];
 for(const [member,enabled] of [[ALICE,false],[BOB,true]]){
  const {options,replies}=optionsFor(member,async(sql,values)=>{
   if(sql.startsWith('INSERT INTO member_timer_sounds')){
    records.push(values);return {rows:[{timer_id:ID,enabled}]};
   }
   return {rows:[]};
  },{enabled});
  await handleTribe({url:`/api/v1/tribe/timers/${ID}/sound`,method:'PUT'}, {},options);
  assert.deepEqual(replies[0],{status:200,value:{timerId:ID,enabled}});
 }
 assert.deepEqual(records,[[ALICE,ID,false,TRIBE],[BOB,ID,true,TRIBE]]);
});

test('sound preferences cannot be written without boolean input',async()=>{
 const {options}=optionsFor(ALICE,async()=>{throw new Error('Should not query database');},{enabled:'false'});
 await assert.rejects(handleTribe({url:`/api/v1/tribe/timers/${ID}/sound`,method:'PUT'}, {},options),e=>e.status===400);
});
