import React,{useState} from 'react';
import {Compass,Layers,MapPin} from 'lucide-react';
import {maps,resources,resourceMapUrl,wikiResourceMapUrl} from './data';
import EmbeddedMap from './EmbeddedMap';

export default function ResourcePage(){
 const [map,setMap]=useState('The Island');
 const [resource,setResource]=useState('Metal');
 const url=resourceMapUrl(map);
 const wikiUrl=wikiResourceMapUrl(map);
 return <>
  <div className="pagetitle"><span className="eyebrow">FIELD SURVIVAL / 05</span><h1>Resource Atlas</h1><p>Find resource nodes using reliable interactive community maps. Select a map and resource to plan your farming route.</p></div>
  <section className="panel">
   <div className="panelhead"><h2>Find Resources</h2><span className="badge gold">MAP LAUNCHER</span></div>
   <div className="resourceFilters">
    <label className="field"><span>RESOURCE TYPE</span><select value={resource} onChange={e=>setResource(e.target.value)}>{resources.map(r=><option key={r}>{r}</option>)}</select></label>
    <label className="field"><span>ARK MAP</span><select value={map} onChange={e=>setMap(e.target.value)}>{maps.map(m=><option key={m}>{m}</option>)}</select></label>
   </div>
   <div className="resourceTiles">{resources.map(r=><button key={r} className={'resourceTile '+(r===resource?'active':'')} onClick={()=>setResource(r)}><Layers size={16}/>{r}</button>)}</div>
   <EmbeddedMap key={map} url={url} alternativeUrl={wikiUrl} title={`${map} Resource Atlas`} selection={resource} kind="resource"/>
   <div className="notice"><Compass size={17}/> Resource nodes are supplied by third-party maps. These providers may block in-app embedding; the integrated toolbar can open the exact page externally. Some DLC maps may not have all resource layers yet.</div>
  </section>
 </>;
}
