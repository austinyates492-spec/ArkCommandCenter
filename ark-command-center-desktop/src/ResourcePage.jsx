import React,{useState} from 'react';
import {ExternalLink,Info,MapPin,ShieldCheck} from 'lucide-react';
import {maps,resources,resourceMapUrl,wikiResourceMapUrl} from './data';
import EmbeddedMap from './EmbeddedMap';
import './resources.css';
import './resource-atlas-native.css';

/**
 * Accuracy-first: The Island must show genuine ASA map artwork and source
 * markers, not the old synthetic outline or unverified hand-picked GPS pins.
 * We use the provider's interactive map in its own iframe/origin. Their art
 * and data are not copied, bulk-scraped, or republished from our domain.
 */
export default function ResourcePage(){
 const [map,setMap]=useState('The Island');
 const [resource,setResource]=useState('Metal');
 const island=map==='The Island';
 const external=resourceMapUrl(map);
 const wiki=wikiResourceMapUrl(map);
 return <div className="resource-atlas-native">
  <div className="pagetitle">
   <span className="eyebrow">FIELD SURVIVAL / VERIFIED MAP SOURCES</span>
   <h1>Resource Atlas <span className="atlas-native-tag">{island?'THE ISLAND / ASA':'COMMUNITY MAP'}</span></h1>
   <p>{island?'Authentic Island terrain and resource overlays from the interactive ASA map provider. The fictional map and sample pins have been removed from the default view.':'Resource maps for other official worlds still use third-party interactive providers.'}</p>
  </div>
  <section className="panel resource-authentic-panel">
   <div className="atlas-native-head">
    <h2><MapPin size={18}/> {island?'The Island — Real Resource Map':map+' Resource Map'}</h2>
    <span className="atlas-native-chip">{island?'LIVE PROVIDER MAP':'COMMUNITY MAP'}</span>
   </div>
   <div className="resourceFilters">
    <label className="field"><span>ARK MAP</span><select aria-label="Choose ARK map" value={map} onChange={e=>setMap(e.target.value)}>{maps.map(m=><option key={m}>{m}</option>)}</select></label>
    {!island&&<label className="field"><span>RESOURCE REFERENCE</span><select value={resource} onChange={e=>setResource(e.target.value)}>{resources.map(r=><option key={r}>{r}</option>)}</select></label>}
   </div>
   {island&&<div className="resource-authentic-accuracy">
    <ShieldCheck size={20}/>
    <div><strong>Real Island artwork and provider-managed resource pins</strong>
     <p>Use the map's <b>Resources</b> layers to select node types. Its layers, including any bulk-selection controls, must be managed inside the map itself: our app cannot safely change another site's filters without a supported API.</p>
    </div>
   </div>}
   <EmbeddedMap key={map} url={external} alternativeUrl={wiki} title={map+' Resource Map'} selection={island?'Resource layers controlled inside map':resource} kind="resource"/>
   <div className="resource-authentic-footer">
    <Info size={17}/>
    <div>Map imagery and coordinate markers are provided by their original publishers, not recreated or independently validated by ARK Tribe HQ. If your browser blocks the embedded map, choose <b>Open Full Map</b>. We will only replace it with a first-party map after obtaining usable artwork rights and a properly verified coordinate dataset.</div>
   </div>
   {island&&<div className="resource-authentic-direct">
    <a href={external} target="_blank" rel="noopener noreferrer">Open genuine Island resource map <ExternalLink size={14}/></a>
    <a href={wiki} target="_blank" rel="noopener noreferrer">Official community wiki reference <ExternalLink size={14}/></a>
   </div>}
  </section>
 </div>;
}
