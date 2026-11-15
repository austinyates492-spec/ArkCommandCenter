import React,{useEffect,useState} from 'react';
import {Shield,ArrowRight} from 'lucide-react';
import './startup.css';
export default function StartupSequence(){
 const [visible,setVisible]=useState(()=>{
  try{
   if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return false;
   // Show once per tab/app session, avoiding repeat delays for navigation or reloads.
   if(sessionStorage.getItem('ark.startupSeen'))return false;
   sessionStorage.setItem('ark.startupSeen','1');
   return true;
  }catch{return false}
 });
 useEffect(()=>{
  if(!visible)return;
  const done=()=>setVisible(false);
  const timer=setTimeout(done,2800);
  window.addEventListener('keydown',done,{once:true});
  return()=>{clearTimeout(timer);window.removeEventListener('keydown',done)};
 },[visible]);
 if(!visible)return null;
 return <div className="hq-startup" role="dialog" aria-label="ARK Tribe HQ starting" onClick={()=>setVisible(false)}>
  <div className="hq-startup-grid" aria-hidden="true"/>
  <div className="hq-startup-content">
   <div className="hq-startup-emblem"><span className="hq-startup-ring"/><Shield size={62} strokeWidth={1.3}/></div>
   <div className="hq-startup-name">ARK TRIBE <span>HQ</span></div>
   <div className="hq-startup-subtitle">YOUR TRIBE. YOUR COMMAND.</div>
   <div className="hq-startup-progress" aria-hidden="true"><span/></div>
   <button type="button" className="hq-startup-skip" onClick={()=>setVisible(false)}>Skip intro <ArrowRight size={14}/></button>
  </div>
 </div>;
}
