import assert from 'node:assert/strict';
import test from 'node:test';
import {hashPassword,verifyPassword,signAccessToken,verifyAccessToken,secureCompare,newRefreshToken,hashRefreshToken,REFRESH_TOKEN_DAYS} from '../src/security.js';

test('passwords are salted and only correct input verifies',async()=>{
 const a=await hashPassword('my-very-secure-password');const b=await hashPassword('my-very-secure-password');
 assert.notEqual(a,b);assert.ok(await verifyPassword('my-very-secure-password',a));
 assert.equal(await verifyPassword('wrong',a),false);
});
test('signed tokens reject tampering and expire',()=>{
 const secret='0'.repeat(48), token=signAccessToken({id:'user-123'},secret,1000);
 assert.equal(verifyAccessToken(token,secret,1002)?.sub,'user-123');
 assert.equal(verifyAccessToken(token,secret,1000+12*60*60),null);
 assert.equal(verifyAccessToken(token.replace(/.$/,'x'),secret,1002),null);
 assert.equal(verifyAccessToken(token,'wrong-secret',1002),null);
});
test('invite code comparison is exact',()=>{assert.ok(secureCompare('abc','abc'));assert.equal(secureCompare('abc','abx'),false);});
test('remembered sessions use opaque rotating tokens instead of storing passwords',()=>{
 const a=newRefreshToken(),b=newRefreshToken();
 assert.equal(REFRESH_TOKEN_DAYS,30);
 assert.equal(a.length,64);assert.notEqual(a,b);
 assert.equal(hashRefreshToken(a).length,64);
 assert.notEqual(hashRefreshToken(a),hashRefreshToken(b));
 assert.equal(hashRefreshToken('password'),null);
});
