import test from 'node:test';
import assert from 'node:assert/strict';
import {resetAccountsOnce} from '../src/account-reset.js';

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
