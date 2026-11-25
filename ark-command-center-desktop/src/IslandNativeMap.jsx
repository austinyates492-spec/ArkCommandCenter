import React,{useMemo,useRef,useState} from 'react';
import {ZoomIn,ZoomOut,RotateCcw,MapPin,Info,Plus,Move} from 'lucide-react';
import IslandContourTerrain from './IslandContourTerrain';
import {islandWikiResources,islandWikiSource,visibleWikiSites} from './island-wiki-resource-overlay';
import './island-native-map.css';

/** Native interactive terrain, GPS overlay, wiki ASA resource survey and personal pins.
 * The wiki revision and exact coordinates are retained; published wiki points
 * are never presented as user markers or altered to fit the terrain.
 */
export default function IslandNativeMap({pins=[],stops=[],selectedId=null,onSelect=()=>{},colors={},enabledResources=[],onSaveAt=()=>{}}){
 const [zoom,setZoom]=useState(1);
 const [center,setCenter]=useState({x:500,y:500});
 const [showGrid,setShowGrid]=useState(true);
 const [showResources,setShowResources]=useState(true);
 const [inspected,setInspected]=useState(null);
 const [selectedWiki,setSelectedWiki]=useState(null);
 const [terrainFailed,setTerrainFailed]=useState(false);
 const drag=useRef(null);
 const moved=useRef(false);
 const bounded=Number.isFinite(zoom)?Math.min(4,Math.max(1,zoom)):1;
 const extent=1000/bounded;
 const offsetX=Math.max(0,Math.min(1000-extent,center.x-extent/2));
 const offsetY=Math.max(0,Math.min(1000-extent,center.y-extent/2));
 const selected=pins.find(p=>p.id===selectedId);
 const wikiSites=useMemo(()=>showResources?visibleWikiSites(islandWikiResources,enabledResources,bounded):[],[showResources,enabledResources,bounded]);
 const publishedCount=islandWikiResources.filter(p=>enabledResources.includes(p.resource)).length;
 const routePath=stops.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon))
   .map(p=>`${p.lon*10},${p.lat*10}`).join(' ');
 const pointerCoords=event=>{
  const box=event.currentTarget.getBoundingClientRect();
  if(!box.width||!box.height)return null;
  const px=(event.clientX-box.left)/box.width,py=(event.clientY-box.top)/box.height;
  return {lat:Math.max(0,Math.min(100,(offsetY+py*extent)/10)),
          lon:Math.max(0,Math.min(100,(offsetX+px*extent)/10))};
 };
 const inspectAt=event=>{
  if(moved.current){moved.current=false;return;}
  const position=pointerCoords(event);
  if(position){setInspected(position);setSelectedWiki(null);}
 };
 const beginDrag=event=>{
  if(event.button!==undefined&&event.button!==0)return;
  drag.current={x:event.clientX,y:event.clientY,originX:center.x,originY:center.y};
  moved.current=false;
  if(event.currentTarget.setPointerCapture)event.currentTarget.setPointerCapture(event.pointerId);
 };
 const duringDrag=event=>{
  if(!drag.current||zoom<=1)return;
  const box=event.currentTarget.getBoundingClientRect();
  if(!box.width)return;
  const dx=event.clientX-drag.current.x,dy=event.clientY-drag.current.y;
  if(Math.abs(dx)+Math.abs(dy)>5)moved.current=true;
  setCenter({x:drag.current.originX-dx/box.width*extent,y:drag.current.originY-dy/box.height*extent});
 };
 const finishDrag=()=>{drag.current=null;};
 const chooseSite=(event,p)=>{event.stopPropagation();setSelectedWiki(p);setInspected({lat:p.lat,lon:p.lon});};
 const setZoomSafe=next=>setZoom(v=>Math.min(4,Math.max(1,typeof next==='function'?next(v):next)));
 return <div className="island-native-map">
  <div className="island-map-toolbar">
   <div><strong>The Island · ASA Resource Atlas</strong><small>{publishedCount.toLocaleString()} sourced sites selected · {wikiSites.length.toLocaleString()} visible marker groups</small></div>
   <div className="island-map-actions">
    <button type="button" onClick={()=>setZoomSafe(v=>+(v+.5).toFixed(1))} aria-label="Zoom in"><ZoomIn size={17}/></button>
    <button type="button" onClick={()=>setZoomSafe(v=>+(v-.5).toFixed(1))} aria-label="Zoom out"><ZoomOut size={17}/></button>
    <button type="button" onClick={()=>{setZoom(1);setCenter({x:500,y:500});}} aria-label="Reset map zoom and position"><RotateCcw size={16}/></button>
    <label><input type="checkbox" checked={showGrid} onChange={e=>setShowGrid(e.target.checked)}/> GPS grid</label>
    <label><input type="checkbox" checked={showResources} onChange={e=>setShowResources(e.target.checked)}/> Resources</label>
   </div>
  </div>
  <div className="island-map-frame">
   <svg viewBox={`${offsetX} ${offsetY} ${extent} ${extent}`} role="img" aria-label="The Island ASA map with GPS, wiki resource points and personal pins; tap to inspect or drag to pan" preserveAspectRatio="xMidYMid meet" onClick={inspectAt} onPointerDown={beginDrag} onPointerMove={duringDrag} onPointerUp={finishDrag} onPointerCancel={finishDrag}>
    <defs><pattern id="island-gps-grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="#7187a8" strokeOpacity=".38" strokeWidth="2"/></pattern></defs>
    {terrainFailed?<IslandContourTerrain/>:<image href="/maps/the-island-asa.jpg" x="0" y="0" width="1000" height="1000" preserveAspectRatio="none" onError={()=>setTerrainFailed(true)}/>}
    {showGrid&&<rect width="1000" height="1000" fill="url(#island-gps-grid)" pointerEvents="none"/>}
    <rect x="2" y="2" width="996" height="996" fill="none" stroke="#7895ae" strokeOpacity=".5" strokeWidth="3" pointerEvents="none"/>
    {showGrid&&Array.from({length:9},(_,i)=><g key={i} pointerEvents="none"><text x={(i+1)*100} y="22" fill="#e1ecf6" stroke="#102331" strokeWidth="3" paintOrder="stroke" fontSize="17" textAnchor="middle">{(i+1)*10}</text><text x="12" y={(i+1)*100} fill="#e1ecf6" stroke="#102331" strokeWidth="3" paintOrder="stroke" fontSize="17">{(i+1)*10}</text></g>)}
    {wikiSites.map(p=><g key={p.id} role="button" tabIndex={0} aria-label={`${p.resource} at latitude ${p.lat.toFixed(1)}, longitude ${p.lon.toFixed(1)}; ${p.count} mapped site${p.count===1?'':'s'}`} onPointerDown={e=>e.stopPropagation()} onClick={e=>chooseSite(e,p)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelectedWiki(p);setInspected({lat:p.lat,lon:p.lon});}}} style={{cursor:'pointer'}}>
      <circle cx={p.lon*10} cy={p.lat*10} r={selectedWiki?.id===p.id?11:7} stroke={selectedWiki?.id===p.id?'#fff':'#061522'} strokeWidth="2.7" vectorEffect="non-scaling-stroke" fill={colors[p.resource]||'#dfcef8'} fillOpacity=".92"/>
      {p.count>1&&bounded<3&&<text x={p.lon*10} y={p.lat*10+3.5} textAnchor="middle" pointerEvents="none" fontSize="10" fontWeight="800" fill="#101323">{p.count}</text>}
    </g>)}
    {inspected&&<g pointerEvents="none"><path d={`M ${inspected.lon*10-17} ${inspected.lat*10} h34 M ${inspected.lon*10} ${inspected.lat*10-17} v34`} stroke="#ffe998" strokeWidth="2" vectorEffect="non-scaling-stroke"/><circle cx={inspected.lon*10} cy={inspected.lat*10} r="11" fill="none" stroke="#ffe998" strokeWidth="2" vectorEffect="non-scaling-stroke"/></g>}
    {stops.length>1&&<polyline points={routePath} fill="none" stroke="#f5c25b" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity=".9" pointerEvents="none"/>}
    {pins.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100).map(p=><g key={p.id} tabIndex="0" role="button" aria-label={`${p.title||p.resource} at latitude ${p.lat}, longitude ${p.lon}`} onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();onSelect(p.id);setInspected({lat:p.lat,lon:p.lon});setSelectedWiki(null);}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(p.id);setInspected({lat:p.lat,lon:p.lon});}}} style={{cursor:'pointer'}}>
     <circle cx={p.lon*10} cy={p.lat*10} r={selectedId===p.id?17:12} fill={colors[p.resource]||'#ffaf63'} stroke={selectedId===p.id?'#fff':'#09101b'} strokeWidth="5" vectorEffect="non-scaling-stroke"/>
     <path d={`M ${p.lon*10-6} ${p.lat*10} h12 M ${p.lon*10} ${p.lat*10-6} v12`} stroke="#0a1422" strokeWidth="2" pointerEvents="none"/>
    </g>)}
   </svg>
   <div className="island-map-watermark"><Move size={14}/> Drag to pan · Zoom to separate nearby markers</div>
  </div>
  <div className="island-map-inspection" aria-live="polite">
   <div><strong><MapPin size={16}/> Inspected location</strong>
    {inspected?<span>LAT <b>{inspected.lat.toFixed(1)}</b> · LON <b>{inspected.lon.toFixed(1)}</b></span>:<span>Click or tap any point on the map to inspect its GPS position.</span>}
    {selectedWiki&&<small><b>{selectedWiki.resource}</b> · {selectedWiki.name||`${selectedWiki.count} mapped site(s)`} · Wiki ASA resource survey (rev. {islandWikiSource.revision})</small>}
   </div>
   <button type="button" className="island-map-create-pin" disabled={!inspected} onClick={()=>inspected&&onSaveAt(inspected)}><Plus size={16}/> Add custom pin here</button>
  </div>
  <div className="island-map-caption"><Info size={16}/><span>Terrain and resource coordinate source: <a href="https://ark.wiki.gg/wiki/Resource_Map/The_Island" target="_blank" rel="noopener noreferrer">ARK Official Community Wiki, ASA The Island</a>. Resource sites are published estimates rather than guaranteed live spawns; six sourced categories available, other filters are for personal observations. Wiki-derived resource data: CC BY-NC-SA 4.0; game artwork belongs to its rights holders. {islandWikiSource.omittedOutOfBoundsCount} source points outside the map bounds are not displayed. ARK ASA's full-screen map and minimap can disagree; compare GPS readouts against the minimap.</span></div>
  {selected&&<div className="island-map-selection">Selected personal pin: <strong>{selected.title||selected.resource}</strong> — {selected.lat.toFixed(1)} LAT, {selected.lon.toFixed(1)} LON</div>}
 </div>;
}
