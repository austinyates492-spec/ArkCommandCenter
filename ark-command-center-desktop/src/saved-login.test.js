import test from 'node:test';
import assert from 'node:assert/strict';
import {REMEMBER_KEY,SESSION_KEY,currentSession,rememberedToken,rememberToken,forgetRememberedToken,saveSession,forgetSession} from './saved-login.js';

function fakeStorage(){
 const values=new Map();
 return {getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k),entries:()=>[...values.entries()]};
}

test('remembered login persists refresh token without ever storing a password',()=>{
 const disk=fakeStorage(),session=fakeStorage();
 rememberToken('opaque-refresh-token',disk);
 saveSession({token:'short-lived-access',user:{id:'abc'},password:'should-not-persist'},session);
 assert.equal(rememberedToken(disk),'opaque-refresh-token');
 assert.deepEqual(currentSession(session),{token:'short-lived-access',user:{id:'abc'}});
 assert.equal(disk.entries().length,1);assert.equal(disk.entries()[0][0],REMEMBER_KEY);
 assert.equal(session.entries()[0][0],SESSION_KEY);
 assert.equal(JSON.stringify([...disk.entries(),...session.entries()]).includes('should-not-persist'),false);
});

test('sign out forgets both local refresh and short-lived access tokens',()=>{
 const disk=fakeStorage(),session=fakeStorage();
 rememberToken('opaque-refresh-token',disk);saveSession({token:'access',user:{id:'abc'}},session);
 forgetRememberedToken(disk);forgetSession(session);
 assert.equal(rememberedToken(disk),null);assert.equal(currentSession(session),null);
});
