import test from 'node:test';
import assert from 'node:assert/strict';
import {LAUNCH_RESET_EPOCH,resetLocalWorkspaceOnce} from './launch-reset.js';

function memoryStorage(initial={}){
 const map=new Map(Object.entries(initial));
 return {get length(){return map.size;},key:i=>[...map.keys()][i]||null,
  getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,String(value)),
  removeItem:key=>map.delete(key)};
}

test('fresh launch removes old accounts and local app data but not unrelated storage',()=>{
 const local=memoryStorage({'ark.cloudRememberToken':'old-token','ark.clusterId':'nomadark','ark.timers':'[]',other:'keep'});
 const session=memoryStorage({'ark.cloudSession':'old-session','external-session':'keep'});
 assert.equal(resetLocalWorkspaceOnce(local,session),true);
 assert.equal(local.getItem('ark.cloudRememberToken'),null);
 assert.equal(local.getItem('ark.clusterId'),null);
 assert.equal(local.getItem('ark.timers'),null);
 assert.equal(session.getItem('ark.cloudSession'),null);
 assert.equal(local.getItem('other'),'keep');
 assert.equal(session.getItem('external-session'),'keep');
 assert.equal(local.getItem('ark.launchResetEpoch'),LAUNCH_RESET_EPOCH);
 assert.equal(resetLocalWorkspaceOnce(local,session),false);
});
