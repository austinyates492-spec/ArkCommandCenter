import React,{useState} from 'react';
import {ExternalLink,RefreshCw,Copy,MapPin,Info,Maximize2,Minimize2} from 'lucide-react';
import {invoke} from '@tauri-apps/api/core';

export default function EmbeddedMap({url,alternativeUrl,title,selection,kind='resource'}){
 const [provider,setProvider]=useState('primary');
 const [refresh,setRefresh]=useState(0);
 const [warning,setWarning]=useState('');
 const [expanded,setExpanded]=useState(false);
 const selectedUrl=provider==='primary'?url:alternativeUrl;
 const open=async()=>{
  try{
   if(window.__TAURI_INTERNALS__)await invoke('open_external',{url:selectedUrl});
   else {const win=window.open(selectedUrl,'_blank','noopener,noreferrer');if(!win)throw Error('Pop-up blocked');}
   setWarning('');
  }catch(e){setWarning(`Map could not open automatically. Copy this address instead: ${selectedUrl}`);}
 };
 const copy=async()=>{try{await navigator.clipboard.writeText(selectedUrl);setWarning('Map address copied.');}catch{setWarning(selectedUrl);}};
 return <div className={`mapviewer embedded-atlas ${expanded?'map-expanded':''}`}>
  <div className="mapviewerbar"><strong><MapPin size={15}/> {title}</strong><span>{selection}</span></div>
  <div className="map-tools">
   <label className="field"><span>MAP SOURCE</span><select value={provider} onChange={e=>{setProvider(e.target.value);setRefresh(x=>x+1);setWarning('');}}><option value="primary">Interactive community map</option><option value="alternate">ARK Official Community Wiki</option></select></label>
   <button className="ghost" onClick={()=>setRefresh(n=>n+1)} title="Reload map"><RefreshCw size={15}/> Reload</button>
   <button className="ghost" onClick={()=>setExpanded(x=>!x)}>{expanded?<Minimize2 size={15}/>:<Maximize2 size={15}/>} {expanded?'Exit Large View':'Larger Map'}</button>
   <button className="ghost" onClick={copy}><Copy size={15}/> Copy URL</button>
   <button className="primary" onClick={open}><ExternalLink size={15}/> Open Full Map</button>
  </div>
  <iframe key={`${selectedUrl}:${refresh}`} title={title} src={selectedUrl} loading="lazy" referrerPolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"/>
  <div className="map-instructions"><Info size={17}/><span>{kind==='resource'?'Use the map’s own Resources layer to select nodes. Your resource choice above is a quick reference; third-party maps do not expose a dependable direct filter.':'The selected creature is sent to the Wiki map using its documented URL fragment. If the overlay does not load, use the map’s own species selector.'} If the provider blocks embedding, use <strong>Open Full Map</strong>.</span></div>
  {warning&&<div className="notice">{warning}</div>}
 </div>;
}
