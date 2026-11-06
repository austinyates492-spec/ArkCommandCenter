import React,{useState} from 'react';
import {Compass,ExternalLink,Layers,MapPin} from 'lucide-react';
import {maps,resources,resourceMapUrl,wikiResourceMapUrl} from './data';
import {invoke} from '@tauri-apps/api/core';

export default function ResourcePage(){
 const [map,setMap]=useState('The Island');
 const [resource,setResource]=useState('Metal');
 const url=resourceMapUrl(map);
 const wikiUrl=wikiResourceMapUrl(map);
 const [openError,setOpenError]=useState('');
 const openMap=async(url)=>{
  try{
   if(window.__TAURI_INTERNALS__){await invoke('open_external',{url});}
   else {const win=window.open(url,'_blank','noopener,noreferrer');if(!win)throw new Error('Pop-up blocked');}
   setOpenError('');
  }catch(e){setOpenError('Could not open the map automatically. Copy this address into your browser: '+url);}
 };
 return <>
  <div className="pagetitle"><span className="eyebrow">FIELD SURVIVAL / 05</span><h1>Resource Atlas</h1><p>Find resource nodes using reliable interactive community maps. Select a map and resource to plan your farming route.</p></div>
  <section className="panel">
   <div className="panelhead"><h2>Find Resources</h2><span className="badge gold">MAP LAUNCHER</span></div>
   <div className="resourceFilters">
    <label className="field"><span>RESOURCE TYPE</span><select value={resource} onChange={e=>setResource(e.target.value)}>{resources.map(r=><option key={r}>{r}</option>)}</select></label>
    <label className="field"><span>ARK MAP</span><select value={map} onChange={e=>setMap(e.target.value)}>{maps.map(m=><option key={m}>{m}</option>)}</select></label>
   </div>
   <div className="resourceTiles">{resources.map(r=><button key={r} className={'resourceTile '+(r===resource?'active':'')} onClick={()=>setResource(r)}><Layers size={16}/>{r}</button>)}</div>
   <div className="atlas-preview"><MapPin size={35}/><div><span>RESOURCE SEARCH</span><h2>{resource} on {map}</h2><p>Open the interactive map, choose its <strong>Resources</strong> layer, then enable <strong>{resource}</strong>. View node markers and their positions directly on the map.</p><div className="actionrow"><button className="primary" onClick={()=>openMap(url)}>Open Interactive Resource Map <ExternalLink size={16}/></button><button className="ghost" onClick={()=>openMap(wikiUrl)}>Community Wiki Map <ExternalLink size={16}/></button></div>{openError&&<p className="notice">{openError}</p>}<label className="field"><span>Direct map URL (copy if opening is blocked)</span><input readOnly value={url} onFocus={e=>e.target.select()}/></label></div></div>
   <div className="notice"><Compass size={17}/> The old embedded map failed because the map provider can block iframes and its resource-filter URL wasn't supported. This version opens the actual map page. Resource selection is completed on that page, and some newer maps may not have a full resource layer yet.</div>
  </section>
 </>;
}
