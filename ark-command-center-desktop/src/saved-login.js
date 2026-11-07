/** Persist a revocable refresh token, never an email/password pair. */
export const REMEMBER_KEY='ark.cloudRememberToken';
export const SESSION_KEY='ark.cloudSession';

export function currentSession(storage=sessionStorage){
 try{const data=JSON.parse(storage.getItem(SESSION_KEY));return data?.token&&data?.user?data:null;}
 catch{return null;}
}
export function rememberedToken(storage=localStorage){
 try{return storage.getItem(REMEMBER_KEY);}
 catch{return null;}
}
export function rememberToken(token,storage=localStorage){
 if(typeof token!=='string'||!token)throw new Error('Missing refresh token.');
 storage.setItem(REMEMBER_KEY,token);
}
export function forgetRememberedToken(storage=localStorage){
 try{storage.removeItem(REMEMBER_KEY);}catch{/* Storage unavailable. */}
}
export function saveSession(next,storage=sessionStorage){
 storage.setItem(SESSION_KEY,JSON.stringify({token:next.token,user:next.user}));
}
export function forgetSession(storage=sessionStorage){
 try{storage.removeItem(SESSION_KEY);}catch{/* Storage unavailable. */}
}
