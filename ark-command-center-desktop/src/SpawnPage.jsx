import React,{useMemo,useState} from 'react';
import {MapPin,Search} from 'lucide-react';
import {maps,tameCreatures} from './data.js';
import NativeSpawnAtlas from './NativeSpawnAtlas.jsx';
import {officialReleaseMapAvailability} from './asa-release-v97.js';

export default function SpawnPage(){
 const [map,setMap]=useState('The Island');
 const [creature,setCreature]=useState('Rex');
 const [query,setQuery]=useState('');
 const visible=useMemo(()=>tameCreatures.filter(name=>name.toLowerCase().includes(query.toLowerCase())),[query]);
 const releaseMap=officialReleaseMapAvailability(creature,map);
 return <>
  <div className="pagetitle"><span className="eyebrow">EXPLORATION / CREATURE SPAWNS</span><h1>Creature Spawn Atlas</h1><p>Select any tame from the complete ARK Tribe HQ roster and see published ASA habitat regions directly on our native terrain maps. Colored zones represent relative spawn weighting, not guaranteed encounters.</p></div>
  <section className="panel"><div className="panelhead"><h2>Spawn Navigator</h2><span className="badge gold">NATIVE ASA SPAWN MAPS</span></div>
   <div className="spawn-selector-grid">
    <label className="field"><span>SEARCH ALL TAMES</span><div className="searchbox"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search any tame or variant…" aria-label="Search creatures"/></div></label>
    <label className="field"><span>CREATURE</span><select value={visible.includes(creature)?creature:''} onChange={e=>setCreature(e.target.value)} aria-label="Creature"><option value="" disabled>Select a creature</option>{visible.map(name=><option key={name} value={name}>{name}</option>)}</select></label>
    <label className="field"><span>MAP</span><select value={map} onChange={e=>setMap(e.target.value)} aria-label="Map">{maps.map(name=><option key={name}>{name}</option>)}</select></label>
   </div>
   <div className="mapgrid compact-map-grid">{maps.map(name=><button key={name} type="button" className={`maptile ${map===name?'active':''}`} onClick={()=>setMap(name)}><MapPin size={18}/><strong>{name}</strong></button>)}</div>
   {releaseMap&&<div className="notice"><strong>ASA v97 confirmed Enigmasaur maps:</strong> {releaseMap.maps.join(', ')}. {releaseMap.available?`${map} is on Wildcard's release list.`:`${map} is not listed for Enigmasaur in Wildcard's v97 notes.`} <a href={releaseMap.source} target="_blank" rel="noreferrer">Official patch notes</a>. Exact spawn regions must still be verified against the map source.</div>}
   <NativeSpawnAtlas key={map} map={map} creature={creature}/>
  </section>
 </>;
}
