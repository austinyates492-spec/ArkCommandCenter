import React,{useState} from 'react';
import {ZoomIn,ZoomOut,RotateCcw,MapPin,Info} from 'lucide-react';
import './island-native-map.css';

/**
 * First-party GPS plot. No third-party iframe or unlicensed source tiles.
 * Coordinates are a 0–100 GPS plane; this is NOT an authenticated terrain layer.
 * Only user-entered points are shown until a verified licensed dataset is supplied.
 */
export default function IslandNativeMap({pins=[],stops=[],selectedId=null,onSelect=()=>{},colors={}}){
 const [zoom,setZoom]=useState(1);
 const [showGrid,setShowGrid]=useState(true);
 const bounded=Number.isFinite(zoom)?Math.min(4,Math.max(1,zoom)):1;
 const extent=1000/bounded,offset=(1000-extent)/2;
 const selected=pins.find(p=>p.id===selectedId);
 const path=stops.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon))
   .map(p=>`${p.lon*10},${p.lat*10}`).join(' ');
 return <div className="island-native-map">
  <div className="island-map-toolbar">
   <div><strong>The Island · GPS Workspace</strong><small>Native ARK Tribe HQ view · no embedded third-party map</small></div>
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
    {showGrid&&<rect width="1000" height="1000" fill="url(#island-gps-grid)"/>}
    <rect x="2" y="2" width="996" height="996" fill="none" stroke="#7895ae" strokeOpacity=".5" strokeWidth="3"/>
    {Array.from({length:9},(_,i)=><g key={i}><text x={(i+1)*100} y="22" fill="#9fb5cc" fontSize="17" textAnchor="middle">{(i+1)*10}</text><text x="10" y={(i+1)*100} fill="#9fb5cc" fontSize="17">{(i+1)*10}</text></g>)}
    {stops.length>1&&<polyline points={path} fill="none" stroke="#f5c25b" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity=".9"/>}
    {pins.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100).map(p=><g key={p.id} tabIndex="0" role="button" aria-label={`${p.resource} at latitude ${p.lat}, longitude ${p.lon}`} onClick={()=>onSelect(p.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(p.id);}}} style={{cursor:'pointer'}}>
     <circle cx={p.lon*10} cy={p.lat*10} r={selectedId===p.id?17:12} fill={colors[p.resource]||'#c6a0fb'} stroke={selectedId===p.id?'#fff':'#09101b'} strokeWidth="5" vectorEffect="non-scaling-stroke"/>
    </g>)}
   </svg>
   <div className="island-map-watermark"><MapPin size={16}/> GPS coordinates only · terrain asset not yet licensed</div>
  </div>
  <div className="island-map-caption"><Info size={16}/><span>Only your own saved GPS locations and route are drawn here. A verified, authorized ASA terrain layer and published resource-node dataset are still needed before this is a complete resource map. Latitude runs top to bottom; longitude runs left to right.</span></div>
  {selected&&<div className="island-map-selection">Selected: <strong>{selected.resource}</strong> — {selected.lat.toFixed(1)} LAT, {selected.lon.toFixed(1)} LON</div>}
 </div>;
}
