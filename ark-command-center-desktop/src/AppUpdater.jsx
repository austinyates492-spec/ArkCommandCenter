import React,{useCallback,useEffect,useRef,useState} from 'react';
import {RefreshCcw,Download,CheckCircle2} from 'lucide-react';
import {check} from '@tauri-apps/plugin-updater';
import {relaunch} from '@tauri-apps/plugin-process';

export default function AppUpdater(){
 const [update,setUpdate]=useState(null),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const pending=useRef(false);
 const native=typeof window!=='undefined'&&Boolean(window.__TAURI_INTERNALS__);
 const checkNow=useCallback(async(manual=false)=>{
  if(!native||pending.current)return;pending.current=true;
  if(manual)setMessage('Checking for updates…');
  try{
   const found=await check({timeout:15000});setUpdate(found||null);
   if(manual)setMessage(found?`v${found.version} is ready`:'You have the latest version.');
  }catch(e){if(manual)setMessage(`Update check failed: ${e.message}`);}
  finally{pending.current=false;}
 },[native]);
 useEffect(()=>{
  if(!native)return;
  const first=setTimeout(()=>void checkNow(),7000);
  const interval=setInterval(()=>void checkNow(),4*60*60*1000);
  return()=>{clearTimeout(first);clearInterval(interval);};
 },[checkNow,native]);
 const install=async()=>{
  if(!update||busy)return;setBusy(true);setMessage('Downloading verified update…');
  try{
   await update.downloadAndInstall(event=>{
    if(event.event==='Finished')setMessage('Installing update…');
   });
   setMessage('Update installed. Restarting…');await relaunch();
  }catch(e){setMessage(`Update failed: ${e.message}`);setBusy(false);}
 };
 if(!native)return null;
 return <div className="updater-control">
  {update?<button type="button" className="updater-available" disabled={busy} onClick={()=>void install()}><Download size={14}/>{busy?'UPDATING…':`INSTALL v${update.version}`}</button>:
   <button type="button" className="updater-check" title="Check for app updates" onClick={()=>void checkNow(true)}><RefreshCcw size={15}/><span>UPDATE</span></button>}
  {message&&<span role="status" className="updater-message" title={message}>{message}</span>}
 </div>;
}
