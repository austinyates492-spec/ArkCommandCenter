import {useCallback,useEffect,useRef,useState} from 'react';
import {currentSession,rememberedToken,rememberToken,forgetRememberedToken,saveSession,forgetSession} from './saved-login.js';

export const API=String(import.meta.env.VITE_API_URL||'').replace(/\/$/,'');
export const PRIVATE_KEYS=['ark.rates','ark.customRates','ark.clusterId','ark.timers','ark.theme','ark.crafting.recipes','ark.crafting.community','ark.crafting.cart'];
export const cloudConfigured=Boolean(API);

function readLocal(){
 const snapshot={};
 for(const key of PRIVATE_KEYS){try{const raw=localStorage.getItem(key);if(raw!==null)snapshot[key]=JSON.parse(raw);}catch{/* Ignore bad legacy data. */}}
 return snapshot;
}
export async function request(path,token,method='GET',data){
 if(!API)throw new Error('Cloud API is not configured in this desktop build.');
 const res=await fetch(`${API}/api/v1${path}`,{
  method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},
  ...(data!==undefined?{body:JSON.stringify(data)}:{})
 });
 const body=await res.json().catch(()=>({}));
 if(!res.ok)throw Object.assign(new Error(body.error||`Server returned ${res.status}`),{status:res.status});
 return body;
}

/** Cloud is optional; local storage remains usable when signed out or offline. */
export function useCloudSync({rates,setRates,customRates,setCustomRates,theme,setTheme,clusterId,setClusterId}){
 const [session,setSession]=useState(currentSession);
 const [status,setStatus]=useState('signed-out');
 const [error,setError]=useState('');
 const [pending,setPending]=useState(null);
 const sessionRef=useRef(session);
 const versions=useRef({personal:0});
 const baseline=useRef({personal:''});
 const ready=useRef(false);
 const busy=useRef(false);
 const renewalRef=useRef(null);
 const personalRef=useRef({rates,theme});
 personalRef.current={rates,theme};

 const renewSession=useCallback(()=>{
  if(renewalRef.current)return renewalRef.current;
  const renewal=(async()=>{
  const refreshToken=rememberedToken();
  if(!refreshToken)return false;
  setStatus('connecting');
  try{
   const result=await request('/auth/refresh',null,'POST',{refreshToken});
   rememberToken(result.refreshToken);
   const next={token:result.token,user:result.user};
   saveSession(next);
   setSession(next);setError('');return true;
  }catch(e){
   if(e.status===401||e.status===403){forgetRememberedToken();forgetSession();setSession(null);setStatus('signed-out');setError('The remembered session expired or the account was reset. Create a new account or sign in.');}
   else{setStatus('offline');setError(`Could not restore your session: ${e.message}. Your remembered login is still saved.`);}
   return false;
  }
  })();
  renewalRef.current=renewal;
  void renewal.finally(()=>{if(renewalRef.current===renewal)renewalRef.current=null;});
  return renewal;
 },[]);

 const applyRemote=useCallback(personal=>{
  if(Object.hasOwn(personal,'ark.rates'))setRates(personal['ark.rates']);
  if(Object.hasOwn(personal,'ark.customRates'))setCustomRates(personal['ark.customRates']);
  if(Object.hasOwn(personal,'ark.clusterId'))setClusterId(personal['ark.clusterId']);
  if(Object.hasOwn(personal,'ark.theme'))setTheme(personal['ark.theme']);
  for(const key of PRIVATE_KEYS.filter(k=>k.startsWith('ark.crafting.')||k==='ark.timers')){
   if(Object.hasOwn(personal,key))localStorage.setItem(key,JSON.stringify(personal[key]));
  }
 },[setRates,setCustomRates,setTheme,setClusterId]);

 const collect=useCallback(()=>({personal:readLocal()}),[]);

 const hydrate=useCallback(async(token)=>{
  ready.current=false;setPending(null);setStatus('connecting');setError('');
  try{
   const personal=await request('/state',token);
   const local=collect();
   const remote={personal:personal.state||{}};
   versions.current={personal:personal.version};
   const differing=personal.version>0&&JSON.stringify(local.personal)!==JSON.stringify(remote.personal);
   if(differing){setPending(remote);setStatus('choose-data');return;}
   if(personal.version>0)applyRemote(remote.personal);
   // An uninitialized account still needs its first durable snapshot.
   baseline.current={personal:personal.version>0?JSON.stringify(remote.personal):''};
   ready.current=true;setStatus('connected');
  }catch(e){
   if(e.status===401&&rememberedToken()){void renewSession();return;}
   if(e.status===401){forgetSession();setSession(null);setStatus('signed-out');setError('That session is no longer valid. Sign in again or create a new tribe account.');return;}
   setStatus(e.status===401?'expired':'offline');setError(e.message);
  }
 },[applyRemote,collect,renewSession]);

 useEffect(()=>{
  sessionRef.current=session;
  if(session?.token){void hydrate(session.token);}
  else{ready.current=false;if(rememberedToken())void renewSession();else setStatus('signed-out');}
 },[session,hydrate,renewSession]);

 // Reissue access credentials before the 12-hour token expires while the app stays open.
 useEffect(()=>{
  if(!session?.token||!rememberedToken())return;
  const timer=setInterval(()=>void renewSession(),10*60*60*1000);
  return()=>clearInterval(timer);
 },[session,renewSession]);

 const authenticate=useCallback(async(method,input)=>{
  setError('');setStatus('connecting');
  try{
   const result=await request(`/auth/${method}`,null,'POST',input);
   const next={token:result.token,user:result.user};
   if(input.rememberMe===true&&result.refreshToken)rememberToken(result.refreshToken);
   else forgetRememberedToken();
   saveSession(next);
   setSession(next);return true;
  }catch(e){setError(e.message);setStatus('signed-out');return false;}
 },[]);

 const chooseCloud=useCallback(()=>{
  if(!pending)return;
  applyRemote(pending.personal);
  baseline.current={personal:JSON.stringify(pending.personal)};
  ready.current=true;setPending(null);setError('');setStatus('connected');
 },[pending,applyRemote]);

 const chooseLocal=useCallback(()=>{
  if(!pending)return;
  // This explicitly chooses the PC snapshot; the next sync overwrites the cloud.
  baseline.current={personal:''};
  ready.current=true;setPending(null);setError('');setStatus('connected');
 },[pending]);

 const syncNow=useCallback(async()=>{
  const token=sessionRef.current?.token;
  if(!token||!ready.current||busy.current)return;
  const current=collect();
  if(JSON.stringify(current.personal)===baseline.current.personal)return;
  busy.current=true;setStatus('syncing');
  try{
   if(JSON.stringify(current.personal)!==baseline.current.personal){
    const result=await request('/state',token,'PUT',{state:current.personal,version:versions.current.personal});
    versions.current.personal=result.version;baseline.current.personal=JSON.stringify(current.personal);
   }
   setStatus('connected');setError('');
  }catch(e){
   ready.current=false;
   if(e.status===409){setError('Data changed on another device. Choose which version to keep.');void hydrate(token);}
   else if(e.status===401){
    if(rememberedToken())void renewSession();
    else{forgetSession();setSession(null);setStatus('signed-out');setError('Your account session ended. Sign in again or create a new account.');}
   }
   else{setError(`Cloud save failed: ${e.message}. Your changes are still on this PC.`);setStatus(e.status===401?'expired':'offline');}
  }finally{busy.current=false;}
 },[collect,hydrate]);

 useEffect(()=>{if(!session)return;const timer=setInterval(()=>void syncNow(),4000);return()=>clearInterval(timer);},[session,syncNow]);

 const logout=()=>{
  const refreshToken=rememberedToken();
  ready.current=false;sessionRef.current=null;forgetRememberedToken();forgetSession();
  setSession(null);setPending(null);setStatus('signed-out');setError('');
  if(refreshToken)void request('/auth/logout',null,'POST',{refreshToken}).catch(()=>{});
 };
 return {configured:cloudConfigured,user:session?.user||null,token:session?.token||null,status,error,pending,
  register:data=>authenticate('register',data),login:data=>authenticate('login',data),
  logout,chooseCloud,chooseLocal,syncNow,retry:()=>sessionRef.current?.token&&hydrate(sessionRef.current.token)};
}
