import {randomBytes,scrypt as scryptCallback,createHmac,createHash,timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';

const scrypt=promisify(scryptCallback);
export const ACCESS_TOKEN_SECONDS=12*60*60;
export const REFRESH_TOKEN_DAYS=30;

export function newRefreshToken(){return randomBytes(48).toString('base64url');}
export function hashRefreshToken(value){
 if(typeof value!=='string'||!/^[A-Za-z0-9_-]{64}$/.test(value))return null;
 return createHash('sha256').update(value).digest('hex');
}

export async function hashPassword(password){
 const salt=randomBytes(16).toString('hex');
 const hash=await scrypt(password,salt,64);
 return `scrypt$${salt}$${hash.toString('hex')}`;
}
export async function verifyPassword(password,stored){
 try{
  const [algorithm,salt,hex]=stored.split('$');
  if(algorithm!=='scrypt'||!salt||!/^[a-f0-9]{128}$/i.test(hex))return false;
  const computed=await scrypt(password,salt,64);
  return timingSafeEqual(computed,Buffer.from(hex,'hex'));
 }catch{return false;}
}
export function secureCompare(a,b){
 const aHash=createHmac('sha256','compare').update(String(a)).digest();
 const bHash=createHmac('sha256','compare').update(String(b)).digest();
 return timingSafeEqual(aHash,bHash);
}
export function signAccessToken(user,secret,now=Math.floor(Date.now()/1000)){
 const header=Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url');
 const payload=Buffer.from(JSON.stringify({sub:user.id,iat:now,exp:now+ACCESS_TOKEN_SECONDS})).toString('base64url');
 const message=`${header}.${payload}`;
 const signature=createHmac('sha256',secret).update(message).digest('base64url');
 return `${message}.${signature}`;
}
export function verifyAccessToken(token,secret,now=Math.floor(Date.now()/1000)){
 if(typeof token!=='string'||token.length>3000)return null;
 const parts=token.split('.');if(parts.length!==3)return null;
 const [header,payload,signature]=parts;
 const expected=createHmac('sha256',secret).update(`${header}.${payload}`).digest();
 let provided;try{provided=Buffer.from(signature,'base64url');}catch{return null;}
 if(provided.length!==expected.length||!timingSafeEqual(provided,expected))return null;
 try{
  const parsedHeader=JSON.parse(Buffer.from(header,'base64url').toString());
  if(parsedHeader.alg!=='HS256')return null;
  const claims=JSON.parse(Buffer.from(payload,'base64url').toString());
  if(typeof claims.sub!=='string'||typeof claims.exp!=='number'||claims.exp<=now||claims.iat>now+60)return null;
  return claims;
 }catch{return null;}
}
