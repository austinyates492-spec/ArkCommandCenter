import React,{useEffect,useState} from 'react';
import {Shield,ArrowRight} from 'lucide-react';
import './startup.css';

// Runs once on every fresh web page load, refresh, installed PWA launch,
// or desktop app startup. SPA navigation never remounts the component.
export default function StartupSequence({enabled=true}){
 const [visible,setVisible]=useState(()=>{
  try{return enabled&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches}
  catch{return enabled}
 });
 useEffect(()=>{
  if(!visible)return;
  const done=()=>setVisible(false);
  const timer=setTimeout(done,2800);
  window.addEventListener('keydown',done);
  return()=>{clearTimeout(timer);window.removeEventListener('keydown',done)};
 },[visible]);
 if(!visible)return null;
 return <div className="hq-startup" role="dialog" aria-label="ARK Tribe HQ opening animation" onClick={()=>setVisible(false)}>
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
