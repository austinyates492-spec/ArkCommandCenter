import React,{useState} from 'react';
import {ZoomIn,ZoomOut,RotateCcw,MapPin,Info} from 'lucide-react';
import './island-native-map.css';
import IslandContourTerrain from './IslandContourTerrain';

/**
 * First-party original contour artwork, no external network or iframe required.
 * The cartographic outline is approximate and not GPS calibrated.
 * Personal pins use a 0–100 workspace, published resource nodes are not imported.
 */
export default function IslandNativeMap({pins=[],stops=[],selectedId=null,onSelect=()=>{},colors={}}){
 const [zoom,setZoom]=useState(1);
 const [showGrid,setShowGrid]=useState(true);
 const [inspected,setInspected]=useState(null);
 const bounded=Number.isFinite(zoom)?Math.min(4,Math.max(1,zoom)):1;
 const extent=1000/bounded,offset=(1000-extent)/2;
 const selected=pins.find(p=>p.id===selectedId);
 const inspectAt=event=>{const svg=event.currentTarget;const rect=svg.getBoundingClientRect();if(!rect.width||!rect.height)return;const x=offset+(event.clientX-rect.left)/rect.width*extent;const y=offset+(event.clientY-rect.top)/rect.height*extent;setInspected({lat:Math.max(0,Math.min(100,y/10)),lon:Math.max(0,Math.min(100,x/10))});};
 const path=stops.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon))
   .map(p=>`${p.lon*10},${p.lat*10}`).join(' ');
 return <div className="island-native-map">
  <div className="island-map-toolbar">
   <div><strong>The Island · Contour Atlas</strong><small>Original ARK Tribe HQ cartography · preview terrain</small></div>
   <div className="island-map-actions">
    <button type="button" onClick={()=>setZoom(v=>Math.min(4,+(v+.5).toFixed(1)))} aria-label="Zoom in"><ZoomIn size={17}/></button>
    <button type="button" onClick={()=>setZoom(v=>Math.max(1,+(v-.5).toFixed(1)))} aria-label="Zoom out"><ZoomOut size={17}/></button>
    <button type="button" onClick={()=>setZoom(1)} aria-label="Reset zoom"><RotateCcw size={16}/></button>
    <label><input type="checkbox" checked={showGrid} onChange={e=>setShowGrid(e.target.checked)}/> GPS grid</label>
   </div>
  </div>
  <div className="island-map-frame">
   <svg viewBox={`${offset} ${offset} ${extent} ${extent}`} role="img" aria-label="Native 0 to 100 Island GPS plotting grid with user-entered markers; tap map to inspect grid coordinates" preserveAspectRatio="xMidYMid meet" onClick={inspectAt}>
    <defs><pattern id="island-gps-grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="#7187a8" strokeOpacity=".3" strokeWidth="2"/></pattern></defs>
    <IslandContourTerrain/>
    {showGrid&&<rect width="1000" height="1000" fill="url(#island-gps-grid)"/>}
    <rect x="2" y="2" width="996" height="996" fill="none" stroke="#7895ae" strokeOpacity=".5" strokeWidth="3"/>
    {Array.from({length:9},(_,i)=><g key={i}><text x={(i+1)*100} y="22" fill="#9fb5cc" fontSize="17" textAnchor="middle">{(i+1)*10}</text><text x="10" y={(i+1)*100} fill="#9fb5cc" fontSize="17">{(i+1)*10}</text></g>)}
    {inspected&&<g pointerEvents="none"><path d={`M ${inspected.lon*10-20} ${inspected.lat*10} h40 M ${inspected.lon*10} ${inspected.lat*10-20} v40`} stroke="#f9e089" strokeWidth="3" vectorEffect="non-scaling-stroke"/><circle cx={inspected.lon*10} cy={inspected.lat*10} r="8" fill="none" stroke="#f9e089" strokeWidth="3" vectorEffect="non-scaling-stroke"/></g>}
    {stops.length>1&&<polyline points={path} fill="none" stroke="#f5c25b" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity=".9"/>}
    {pins.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100).map(p=><g key={p.id} tabIndex="0" role="button" aria-label={`${p.resource} at latitude ${p.lat}, longitude ${p.lon}`} onClick={e=>{e.stopPropagation();onSelect(p.id);}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(p.id);}}} style={{cursor:'pointer'}}>
     <circle cx={p.lon*10} cy={p.lat*10} r={selectedId===p.id?17:12} fill={colors[p.resource]||'#c6a0fb'} stroke={selectedId===p.id?'#fff':'#09101b'} strokeWidth="5" vectorEffect="non-scaling-stroke"/>
    </g>)}
   </svg>
   <div className="island-map-watermark"><MapPin size={16}/>{inspected?`Inspected LAT ${inspected.lat.toFixed(1)} · LON ${inspected.lon.toFixed(1)}`:"Tap map to inspect GPS · terrain alignment preliminary"}</div>
  </div>
  <div className="island-map-caption"><Info size={16}/><span>This is an original stylized Island-inspired terrain illustration, not a tracing or a GPS-calibrated coastline. Only your saved GPS pins and routes are shown. Tap the map to inspect grid coordinates. Grid mathematics follow 0–100 latitude/longitude, but the illustrated coastline still requires landmark calibration against the ASA wiki reference. Published resource-node coverage has not been integrated. No third-party image or iframe is loaded.</span></div>
  {selected&&<div className="island-map-selection">Selected: <strong>{selected.resource}</strong> — {selected.lat.toFixed(1)} LAT, {selected.lon.toFixed(1)} LON</div>}
 </div>;
}
