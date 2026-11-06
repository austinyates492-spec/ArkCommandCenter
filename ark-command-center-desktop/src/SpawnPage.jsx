import React,{useMemo,useState} from 'react';
import {MapPin,Search} from 'lucide-react';
import {maps,tameCreatures,wikiSpawn,resourceMapUrl} from './data';
import EmbeddedMap from './EmbeddedMap';

export default function SpawnPage(){
 const [map,setMap]=useState('The Island');
 const [creature,setCreature]=useState('Rex');
 const [query,setQuery]=useState('');
 const visible=useMemo(()=>tameCreatures.filter(name=>name.toLowerCase().includes(query.toLowerCase())),[query]);
 return <>
  <div className="pagetitle"><span className="eyebrow">EXPLORATION / SPAWNS</span><h1>Creature Spawn Atlas</h1><p>Choose a map and find a creature, then inspect wild spawn regions in the map viewer. These are habitat regions, not sightings.</p></div>
  <section className="panel"><div className="panelhead"><h2>Spawn Navigator</h2><span className="badge gold">OFFICIAL MAPS + DLC</span></div>
   <div className="spawn-selector-grid"><label className="field"><span>SEARCH CREATURE</span><div className="searchbox"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search Rex, Anky, Giga..."/></div></label><label className="field"><span>CREATURE</span><select value={visible.includes(creature)?creature:''} onChange={e=>setCreature(e.target.value)}>{!visible.includes(creature)&&<option value="">Select a result</option>}{visible.map(name=><option key={name}>{name}</option>)}</select></label><label className="field"><span>MAP</span><select value={map} onChange={e=>setMap(e.target.value)}>{maps.map(name=><option key={name}>{name}</option>)}</select></label></div>
   <div className="mapgrid compact-map-grid">{maps.map(name=><button key={name} className={`maptile ${map===name?'active':''}`} onClick={()=>setMap(name)}><MapPin size={18}/><strong>{name}</strong></button>)}</div>
   <div className="notice">Looking for <strong>{creature}</strong> on <strong>{map}</strong>. Use the map provider's creature filter to display its actual habitat overlay. The app does not fabricate spawn markers or claim that every creature exists on every map.</div>
   <EmbeddedMap key={map} url={wikiSpawn(map)} alternativeUrl={resourceMapUrl(map)} title={`${map} Wild Spawn Map`} selection={creature} kind="spawn"/>
  </section>
 </>;
}
