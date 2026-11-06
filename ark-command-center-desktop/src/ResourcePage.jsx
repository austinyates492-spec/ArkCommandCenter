import React,{useState} from 'react';
import {Compass,ExternalLink,Layers,MapPin} from 'lucide-react';
import {maps,resources,resourceMapUrl} from './data';

export default function ResourcePage(){
  const [map,setMap]=useState('The Island');
  const [resource,setResource]=useState('Metal');
  const url=resourceMapUrl(map,resource);
  return <>
    <div className="pagetitle"><span className="eyebrow">FIELD SURVIVAL / 05</span><h1>Resource Atlas</h1><p>Locate farming regions and resource nodes across supported ASA maps.</p></div>
    <section className="panel">
      <div className="panelhead"><h2>Find Resources</h2><span className="badge gold">COMMUNITY RESOURCE MAPS</span></div>
      <div className="resourceFilters">
        <label className="field"><span>RESOURCE TYPE</span><select value={resource} onChange={e=>setResource(e.target.value)}>{resources.map(r=><option key={r}>{r}</option>)}</select></label>
        <label className="field"><span>ARK MAP</span><select value={map} onChange={e=>setMap(e.target.value)}>{maps.map(m=><option key={m}>{m}</option>)}</select></label>
      </div>
      <div className="resourceTiles">{resources.slice(0,9).map(r=><button key={r} className={'resourceTile '+(r===resource?'active':'')} onClick={()=>setResource(r)}><Layers size={16}/>{r}</button>)}</div>
      <div className="mapviewer">
        <div className="mapviewerbar"><strong><MapPin size={14}/> {resource.toUpperCase()} • {map.toUpperCase()}</strong><span className="badge">RESOURCE LAYER</span></div>
        <iframe key={url} title={`${resource} resources on ${map}`} loading="lazy" referrerPolicy="no-referrer" src={url}/>
        <div className="notice"><Compass size={17}/> Resource locations are reference data, not live node availability. Map providers may block embedded display; use the external link if needed.</div>
      </div>
      <div className="actionrow"><span className="minor">Selected: <strong>{resource}</strong> on {map}</span><a className="primary linkbtn" href={url} target="_blank" rel="noreferrer">Open Resource Map <ExternalLink size={16}/></a></div>
    </section>
  </>;
}
