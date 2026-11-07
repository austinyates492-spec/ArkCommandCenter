import {useCallback,useEffect,useRef,useState} from 'react';

const API=String(import.meta.env.VITE_API_URL||'').replace(/\/$/,'');
export const PRIVATE_KEYS=['ark.rates','ark.timers','ark.theme','ark.crafting.recipes','ark.crafting.community','ark.crafting.cart'];
export const cloudConfigured=Boolean(API);

function readLocal(){
 const snapshot={};
 for(const key of PRIVATE_KEYS){try{const raw=localStorage.getItem(key);if(raw!==null)snapshot[key]=JSON.parse(raw);}catch{/* Ignore bad legacy data. */}}
 return snapshot;
}
async function request(path,token,method='GET',data){
 if(!API)throw new Error('Cloud API is not configured in this desktop build.');
 const res=await fetch(`${API}/api/v1${path}`,{
  method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},
  ...(data!==undefined?{body:JSON.stringify(data)}:{})
 });
 const body=await res.json().catch(()=>({}));
 if(!res.ok)throw Object.assign(new Error(body.error||`Server returned ${res.status}`),{status:res.status});
 return body;
}
function currentSession(){
 try{const data=JSON.parse(sessionStorage.getItem('ark.cloudSession'));return data?.token&&data?.user?data:null;}
 catch{return null;}
}

/** Cloud is optional; local storage remains usable when signed out or offline. */
export function useCloudSync({rates,setRates,servers,setServers,timers,setTimers,theme,setTheme}){
 const [session,setSession]=useState(currentSession);
 const [status,setStatus]=useState('signed-out');
 const [error,setError]=useState('');
 const [pending,setPending]=useState(null);
 const sessionRef=useRef(session);
 const versions=useRef({personal:0,shared:0});
 const baseline=useRef({personal:'',shared:''});
 const ready=useRef(false);
 const busy=useRef(false);
 const personalRef=useRef({rates,servers,timers,theme});
 personalRef.current={rates,servers,timers,theme};

 const applyRemote=useCallback((personal,shared)=>{
  if(Object.hasOwn(personal,'ark.rates'))setRates(personal['ark.rates']);
  if(Object.hasOwn(personal,'ark.timers'))setTimers(personal['ark.timers']);
  if(Object.hasOwn(personal,'ark.theme'))setTheme(personal['ark.theme']);
  for(const key of PRIVATE_KEYS.filter(k=>k.startsWith('ark.crafting.'))){
   if(Object.hasOwn(personal,key))localStorage.setItem(key,JSON.stringify(personal[key]));
  }
  if(Array.isArray(shared.servers))setServers(shared.servers);
 },[setRates,setTimers,setTheme,setServers]);

 const collect=useCallback(()=>({personal:readLocal(),shared:{servers:personalRef.current.servers}}),[]);

 const hydrate=useCallback(async(token)=>{
  ready.current=false;setPending(null);setStatus('connecting');setError('');
  try{
   const [personal,shared]=await Promise.all([request('/state',token),request('/tribe/servers',token)]);
   const local=collect();
   const remote={personal:personal.state||{},shared:shared.state||{servers:[]}};
   versions.current={personal:personal.version,shared:shared.version};
   const differing=(personal.version>0&&JSON.stringify(local.personal)!==JSON.stringify(remote.personal))||
    (shared.version>0&&JSON.stringify(local.shared)!==JSON.stringify(remote.shared));
   if(differing){setPending(remote);setStatus('choose-data');return;}
   if(personal.version>0||shared.version>0)applyRemote(remote.personal,remote.shared);
   // An uninitialized account still needs its first durable snapshot.
   baseline.current={personal:personal.version>0?JSON.stringify(remote.personal):'',shared:shared.version>0?JSON.stringify(remote.shared):''};
   ready.current=true;setStatus('connected');
  }catch(e){setStatus(e.status===401?'expired':'offline');setError(e.message);}
 },[applyRemote,collect]);

 useEffect(()=>{sessionRef.current=session;if(session?.token)void hydrate(session.token);else{ready.current=false;setStatus('signed-out');}},[session,hydrate]);

 const authenticate=useCallback(async(method,input)=>{
  setError('');setStatus('connecting');
  try{
   const result=await request(`/auth/${method}`,null,'POST',input);
   const next={token:result.token,user:result.user};
   sessionStorage.setItem('ark.cloudSession',JSON.stringify(next));
   setSession(next);return true;
  }catch(e){setError(e.message);setStatus('signed-out');return false;}
 },[]);

 const chooseCloud=useCallback(()=>{
  if(!pending)return;
  applyRemote(pending.personal,pending.shared);
  baseline.current={personal:JSON.stringify(pending.personal),shared:JSON.stringify(pending.shared)};
  ready.current=true;setPending(null);setError('');setStatus('connected');
 },[pending,applyRemote]);

 const chooseLocal=useCallback(()=>{
  if(!pending)return;
  // This explicitly chooses the PC snapshot; the next sync overwrites the cloud.
  baseline.current={personal:'',shared:''};
  ready.current=true;setPending(null);setError('');setStatus('connected');
 },[pending]);

 const syncNow=useCallback(async()=>{
  const token=sessionRef.current?.token;
  if(!token||!ready.current||busy.current)return;
  const current=collect();
  if(JSON.stringify(current.personal)===baseline.current.personal&&JSON.stringify(current.shared)===baseline.current.shared)return;
  busy.current=true;setStatus('syncing');
  try{
   if(JSON.stringify(current.personal)!==baseline.current.personal){
    const result=await request('/state',token,'PUT',{state:current.personal,version:versions.current.personal});
    versions.current.personal=result.version;baseline.current.personal=JSON.stringify(current.personal);
   }
   if(JSON.stringify(current.shared)!==baseline.current.shared){
    const result=await request('/tribe/servers',token,'PUT',{state:current.shared,version:versions.current.shared});
    versions.current.shared=result.version;baseline.current.shared=JSON.stringify(current.shared);
   }
   setStatus('connected');setError('');
  }catch(e){
   ready.current=false;
   if(e.status===409){setError('Data changed on another device. Choose which version to keep.');void hydrate(token);}
   else{setError(`Cloud save failed: ${e.message}. Your changes are still on this PC.`);setStatus(e.status===401?'expired':'offline');}
  }finally{busy.current=false;}
 },[collect,hydrate]);

 useEffect(()=>{if(!session)return;const timer=setInterval(()=>void syncNow(),4000);return()=>clearInterval(timer);},[session,syncNow]);

 const logout=()=>{ready.current=false;sessionRef.current=null;sessionStorage.removeItem('ark.cloudSession');setSession(null);setPending(null);setStatus('signed-out');setError('');};
 return {configured:cloudConfigured,user:session?.user||null,status,error,pending,
  register:data=>authenticate('register',data),login:data=>authenticate('login',data),
  logout,chooseCloud,chooseLocal,syncNow,retry:()=>sessionRef.current?.token&&hydrate(sessionRef.current.token)};
}
