import {useCallback,useEffect,useRef,useState} from 'react';
import {API,request} from './cloud-sync';

/** Authenticated SSE events with an HTTP refresh fallback. All edits go directly to shared rows. */
export function useTribeLive(token,setServers){
 const [timers,setTimers]=useState([]);
 const [timerSounds,setTimerSounds]=useState({});
 const [timerSoundsReady,setTimerSoundsReady]=useState(false);
 const [crafting,setCrafting]=useState([]);
 const [clockOffsetMs,setClockOffsetMs]=useState(0);
 const [status,setStatus]=useState('signed-out');
 const [error,setError]=useState('');
 const tokenRef=useRef(token);
 tokenRef.current=token;

 const refresh=useCallback(async(topic='all')=>{
  if(!token)return;
  try{
   if(topic==='timer-sounds'||topic==='all'){
    const data=await request('/tribe/timers/sounds',token);
    if(tokenRef.current===token){setTimerSounds(data.sounds||{});setTimerSoundsReady(true);}
   }
   if(topic==='timers'||topic==='all'){
    const data=await request('/tribe/timers',token);
    if(tokenRef.current===token){setTimers(data.timers||[]);if(Number.isFinite(data.serverTime))setClockOffsetMs(Date.now()-data.serverTime);}
   }
   if(topic==='crafting'||topic==='all'){
    const data=await request('/tribe/crafting',token);
    if(tokenRef.current===token)setCrafting(data.items||[]);
   }
   if(topic==='servers'||topic==='all'){
    const data=await request('/tribe/servers/live',token);
    if(tokenRef.current===token)setServers(data.servers||[]);
   }
   if(tokenRef.current===token)setError('');
  }catch(e){if(tokenRef.current===token){setError(`Live refresh failed: ${e.message}`);setStatus('offline');}}
 },[token,setServers]);

 useEffect(()=>{
  if(!token){setTimers([]);setTimerSounds({});setTimerSoundsReady(false);setCrafting([]);setServers([]);setStatus('signed-out');setError('');return;}
  setTimers([]);setTimerSounds({});setTimerSoundsReady(false);setCrafting([]);setServers([]);
  let closed=false;const controller=new AbortController();
  setStatus('connecting');void refresh();
  const fallback=setInterval(()=>void refresh(),12000);
  const consume=async()=>{
   while(!controller.signal.aborted){
    try{
     const response=await fetch(`${API}/api/v1/events`,{headers:{Authorization:`Bearer ${token}`},signal:controller.signal});
     if(!response.ok||!response.body)throw new Error(`Live stream HTTP ${response.status}`);
     if(!closed)setStatus('live');
     const reader=response.body.getReader();const decoder=new TextDecoder();let buffer='';
     while(!controller.signal.aborted){
      const chunk=await reader.read();if(chunk.done)break;
      buffer+=decoder.decode(chunk.value,{stream:true});
      const blocks=buffer.split(/\r?\n\r?\n/);buffer=blocks.pop()||'';
      for(const block of blocks){
       const lines=block.split(/\r?\n/),event=lines.find(x=>x.startsWith('event: '))?.slice(7);
       if(event!=='tribe')continue;
       const raw=lines.find(x=>x.startsWith('data: '))?.slice(6);
       if(!raw)continue;
       try{const topic=JSON.parse(raw).topic;if(['timers','timer-sounds','crafting','servers'].includes(topic))void refresh(topic);}catch{/* Ignore invalid event. */}
      }
     }
    }catch(e){if(!controller.signal.aborted&&!closed){setStatus('polling');setError('Live connection interrupted; refreshing every 12 seconds.');}}
    if(!controller.signal.aborted)await new Promise(resolve=>setTimeout(resolve,2500));
   }
  };
  void consume();
  return()=>{closed=true;controller.abort();clearInterval(fallback);};
 },[token,refresh,setServers]);

 const perform=useCallback(async(path,method,data,topic)=>{
  if(!token)throw new Error('Sign in to Tribe Cloud before editing shared data.');
  try{
   const result=await request(path,token,method,data);
   await refresh(topic);
   setError('');return result;
  }catch(e){setError(e.message);throw e;}
 },[token,refresh]);

 return {timers,timerSounds,timerSoundsReady,crafting,clockOffsetMs,status,error,refresh,
  addTimer:(name,minutes,type='Custom',soundEnabledForCreator=true)=>perform('/tribe/timers','POST',{name,minutes,type,soundEnabledForCreator},'all'),
  setTimerSound:(id,enabled)=>perform(`/tribe/timers/${encodeURIComponent(id)}/sound`,'PUT',{enabled},'timer-sounds'),
  removeTimer:id=>perform(`/tribe/timers/${encodeURIComponent(id)}`,'DELETE',undefined,'timers'),
  addCraft:(name,quantity)=>perform('/tribe/crafting','POST',{name,quantity},'crafting'),
  setCraft:(name,quantity,expectedQuantity)=>perform('/tribe/crafting','PUT',{name,quantity,expectedQuantity},'crafting'),
  removeCraft:name=>perform(`/tribe/crafting/${encodeURIComponent(name)}`,'DELETE',undefined,'crafting'),
  clearCraft:()=>perform('/tribe/crafting','DELETE',undefined,'crafting'),
  saveServer:data=>perform('/tribe/servers/live','POST',data,'servers'),
  removeServer:id=>perform(`/tribe/servers/live/${encodeURIComponent(id)}`,'DELETE',undefined,'servers')};
}
