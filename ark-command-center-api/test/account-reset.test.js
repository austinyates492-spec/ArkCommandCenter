import test from 'node:test';
import assert from 'node:assert/strict';
import {resetAccountsOnce,resetAllAccountDataOnce} from '../src/account-reset.js';

function mockDatabase(alreadyApplied=false){
 const calls=[];let released=false;
 const client={
  query:async(sql,args=[])=>{
   calls.push({sql,args});
   if(sql.startsWith('SELECT key FROM schema_meta'))return {rows:alreadyApplied?[{key:args[0]}]:[]};
   if(sql.startsWith('INSERT INTO account_reset_archive'))return {rowCount:2};
   return {rows:[],rowCount:0};
  },release:()=>{released=true;}
 };
 return {pool:{connect:async()=>client},calls,get released(){return released;}};
}

test('account reset cannot execute without explicit valid reset epoch',async()=>{
 const db=mockDatabase();
 assert.deepEqual(await resetAccountsOnce(db.pool,''),{reset:false,reason:'disabled'});
 await assert.rejects(()=>resetAccountsOnce(db.pool,'true'),/Invalid account reset identifier/);
 assert.equal(db.calls.length,0);
});

test('account reset archives personal state before deleting accounts, not tribe records or passwords',async()=>{
 const db=mockDatabase();
 assert.deepEqual(await resetAccountsOnce(db.pool,'nov-2026-login-restart'),{reset:true,count:2});
 const statements=db.calls.map(x=>x.sql);
 const archiveIndex=statements.findIndex(s=>s.startsWith('INSERT INTO account_reset_archive'));
 const deleteIndex=statements.indexOf('DELETE FROM members');
 assert.ok(archiveIndex>0&&deleteIndex>archiveIndex);
 assert.ok(statements[archiveIndex].includes('LEFT JOIN member_state'));
 assert.equal(statements.join(' ').includes('password_hash'),false);
 assert.equal(statements.filter(s=>s.startsWith('DELETE FROM')).length,1);
 assert.equal(statements.at(-1),'COMMIT');assert.equal(db.released,true);
});

test('account reset never repeats a deletion after its marker is applied',async()=>{
 const db=mockDatabase(true);
 assert.deepEqual(await resetAccountsOnce(db.pool,'nov-2026-login-restart'),{reset:false,reason:'already-applied'});
 assert.equal(db.calls.some(x=>x.sql.startsWith('DELETE FROM')),false);
 assert.equal(db.calls.at(-1).sql,'COMMIT');assert.equal(db.released,true);
});

test('full reset clears account and tribe tables but leaves catalog, updater and schema markers',async()=>{
 const db=mockDatabase();
 await resetAllAccountDataOnce(db.pool,'arktribehq-fresh-public-launch');
 const statements=db.calls.map(x=>x.sql);
 const deletes=statements.filter(s=>s.startsWith('DELETE FROM '));
 const expected=['member_timer_sounds_v2','member_timer_sounds','tribe_timers_v2','tribe_timers',
  'tribe_crafting_v2','tribe_crafting','tribe_servers_v2','tribe_servers',
  'tribe_server_snapshots','tribe_state','member_state','member_sessions','members'];
 assert.deepEqual(deletes.slice(0,expected.length),expected.map(t=>`DELETE FROM ${t}`));
 assert.ok(deletes.includes('DELETE FROM tribes WHERE legacy=FALSE'));
 assert.ok(statements.some(s=>s.includes('DELETE FROM account_reset_archive')));
 assert.ok(statements.some(s=>s.includes("member_limit=0 WHERE legacy=TRUE")));
 assert.ok(!statements.some(s=>s.includes('DELETE FROM live_catalog')||s.includes('DELETE FROM app_updates')));
 assert.equal(statements.at(-1),'COMMIT');
 assert.equal(db.released,true);
});

test('full reset is one-time even after a second deployment',async()=>{
 const db=mockDatabase(true);
 assert.deepEqual(await resetAllAccountDataOnce(db.pool,'arktribehq-fresh-public-launch'),{reset:false,reason:'already-applied'});
 assert.ok(!db.calls.some(x=>x.sql.startsWith('DELETE FROM')));
});
