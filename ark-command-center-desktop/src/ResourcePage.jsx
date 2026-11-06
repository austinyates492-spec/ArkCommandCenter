import React,{useState} from 'react';
import {Compass,ExternalLink,Layers,MapPin} from 'lucide-react';
import {maps,resources,resourceMapUrl,wikiResourceMapUrl} from './data';

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
   <div className="atlas-preview"><MapPin size={35}/><div><span>RESOURCE SEARCH</span><h2>{resource} on {map}</h2><p>Open the interactive map, choose its <strong>Resources</strong> layer, then enable <strong>{resource}</strong>. View node markers and their positions directly on the map.</p><div className="actionrow"><a className="primary linkbtn" target="_blank" rel="noreferrer" href={url}>Open Interactive Resource Map <ExternalLink size={16}/></a><a className="ghost linkbtn" target="_blank" rel="noreferrer" href={wikiUrl}>Community Wiki Map <ExternalLink size={16}/></a></div></div></div>
   <div className="notice"><Compass size={17}/> The old embedded map failed because the map provider can block iframes and its resource-filter URL wasn't supported. This version opens the actual map page. Resource selection is completed on that page, and some newer maps may not have a full resource layer yet.</div>
  </section>
 </>;
}
