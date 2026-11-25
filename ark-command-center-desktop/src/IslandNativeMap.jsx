import React,{useState} from 'react';
import {ZoomIn,ZoomOut,RotateCcw,MapPin,Info} from 'lucide-react';
import './island-native-map.css';

/**
 * First-party GPS plot with a single wiki-sourced ASA terrain image (not a webpage embed).
 * Coordinates are plotted against the source's square map as a 0–100 GPS plane.
 * Personal pins remain user entered; published resource coordinates are not imported.
 */
const ISLAND_ASA_TERRAIN='https://ark.wiki.gg/wiki/Special:Redirect/file/The_Island_map_ASA.jpg';
const TERRAIN_SOURCE='https://ark.wiki.gg/wiki/File:The_Island_map_ASA.jpg';

export default function IslandNativeMap({pins=[],stops=[],selectedId=null,onSelect=()=>{},colors={}}){
 const [zoom,setZoom]=useState(1);
 const [showGrid,setShowGrid]=useState(true);
 const [terrainFailed,setTerrainFailed]=useState(false);
 const bounded=Number.isFinite(zoom)?Math.min(4,Math.max(1,zoom)):1;
 const extent=1000/bounded,offset=(1000-extent)/2;
 const selected=pins.find(p=>p.id===selectedId);
 const path=stops.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon))
   .map(p=>`${p.lon*10},${p.lat*10}`).join(' ');
 return <div className="island-native-map">
  <div className="island-map-toolbar">
   <div><strong>The Island · ASA Terrain</strong><small>Native map overlay · source image from ARK Official Community Wiki</small></div>
   <div className="island-map-actions">
    <button type="button" onClick={()=>setZoom(v=>Math.min(4,+(v+.5).toFixed(1)))} aria-label="Zoom in"><ZoomIn size={17}/></button>
    <button type="button" onClick={()=>setZoom(v=>Math.max(1,+(v-.5).toFixed(1)))} aria-label="Zoom out"><ZoomOut size={17}/></button>
    <button type="button" onClick={()=>setZoom(1)} aria-label="Reset zoom"><RotateCcw size={16}/></button>
    <label><input type="checkbox" checked={showGrid} onChange={e=>setShowGrid(e.target.checked)}/> GPS grid</label>
   </div>
  </div>
  <div className="island-map-frame">
   <svg viewBox={`${offset} ${offset} ${extent} ${extent}`} role="img" aria-label="Native 0 to 100 Island GPS plotting grid with user-entered markers" preserveAspectRatio="xMidYMid meet">
    <defs><pattern id="island-gps-grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="#7187a8" strokeOpacity=".3" strokeWidth="2"/></pattern></defs>
    <rect width="1000" height="1000" fill="#0a1422"/>
    {!terrainFailed&&<image href={ISLAND_ASA_TERRAIN} x="0" y="0" width="1000" height="1000" preserveAspectRatio="none" onError={()=>setTerrainFailed(true)}/>}
    {terrainFailed&&<text x="500" y="450" fill="#c9d5e5" fontSize="24" textAnchor="middle">Terrain unavailable — GPS grid fallback</text>}
    {showGrid&&<rect width="1000" height="1000" fill="url(#island-gps-grid)"/>}
    <rect x="2" y="2" width="996" height="996" fill="none" stroke="#7895ae" strokeOpacity=".5" strokeWidth="3"/>
    {Array.from({length:9},(_,i)=><g key={i}><text x={(i+1)*100} y="22" fill="#9fb5cc" fontSize="17" textAnchor="middle">{(i+1)*10}</text><text x="10" y={(i+1)*100} fill="#9fb5cc" fontSize="17">{(i+1)*10}</text></g>)}
    {stops.length>1&&<polyline points={path} fill="none" stroke="#f5c25b" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity=".9"/>}
    {pins.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100).map(p=><g key={p.id} tabIndex="0" role="button" aria-label={`${p.resource} at latitude ${p.lat}, longitude ${p.lon}`} onClick={()=>onSelect(p.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(p.id);}}} style={{cursor:'pointer'}}>
     <circle cx={p.lon*10} cy={p.lat*10} r={selectedId===p.id?17:12} fill={colors[p.resource]||'#c6a0fb'} stroke={selectedId===p.id?'#fff':'#09101b'} strokeWidth="5" vectorEffect="non-scaling-stroke"/>
    </g>)}
   </svg>
   <div className="island-map-watermark"><MapPin size={16}/> {terrainFailed?'Map artwork unavailable · GPS fallback':'ASA terrain · ARK Official Community Wiki'}</div>
  </div>
  <div className="island-map-caption"><Info size={16}/><span>Terrain: <a href={TERRAIN_SOURCE} target="_blank" rel="noopener noreferrer">ARK Official Community Wiki — The Island map ASA.jpg</a>. The image is loaded as a standalone map layer, not an iframe. Wiki content that may lawfully be licensed is offered under CC BY-NC-SA 4.0; game artwork rights remain with their owners. Only your saved GPS markers and routes appear until published resource points are verified. Check coordinates against in-game GPS.</span></div>
  {selected&&<div className="island-map-selection">Selected: <strong>{selected.resource}</strong> — {selected.lat.toFixed(1)} LAT, {selected.lon.toFixed(1)} LON</div>}
 </div>;
}
