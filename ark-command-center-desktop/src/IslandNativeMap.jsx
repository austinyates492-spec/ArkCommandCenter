import React,{useEffect,useMemo,useRef,useState} from 'react';
import {RotateCcw,MapPin,Info,Plus} from 'lucide-react';
import IslandContourTerrain from './IslandContourTerrain';
import {islandWikiResources,islandWikiSource,visibleWikiSites} from './island-wiki-resource-overlay';
import {areaRoutePolyline} from './island-area-route-planner.js';
import {aberrationZoneOptions,aberrationZoneNote,aberrationZoneOpacity,zoneById,zoneContains} from './aberration-zone-focus.js';
import {spawnTierColors,spawnTierNames} from './spawn-zone-model.js';
import './island-native-map.css';

/** Native interactive terrain, GPS overlay, wiki ASA resource survey and personal pins.
 * The wiki revision and exact coordinates are retained; published wiki points
 * are never presented as user markers or altered to fit the terrain.
 */
export default function IslandNativeMap({pins=[],stops=[],selectedId=null,onSelect=()=>{},colors={},enabledResources=[],onSaveAt=()=>{},areaDrawing=false,areaPolygon=[],onAreaPoint=()=>{},plannedStops=[],mapName='The Island',terrainSrc='/maps/the-island-asa.jpg',resourcePoints=islandWikiResources,resourceSource=islandWikiSource,spawnMode=false,spawnRegions=[],spawnCreature='',spawnSource=null}){
 const [zoom,setZoom]=useState(1);
 const [center,setCenter]=useState({x:500,y:500});
 const [showGrid,setShowGrid]=useState(true);
 const [showResources,setShowResources]=useState(true);
 const [zoneFocus,setZoneFocus]=useState('all');
 const [inspected,setInspected]=useState(null);
 const [selectedWiki,setSelectedWiki]=useState(null);
 const [terrainFailed,setTerrainFailed]=useState(false);
 const drag=useRef(null);
 const pointers=useRef(new Map());
 const pinch=useRef(null);
 const svgRef=useRef(null);
 const moved=useRef(false);
 const bounded=Number.isFinite(zoom)?Math.min(8,Math.max(1,zoom)):1;
 const extent=1000/bounded;
 const offsetX=Math.max(0,Math.min(1000-extent,center.x-extent/2));
 const offsetY=Math.max(0,Math.min(1000-extent,center.y-extent/2));
 const selected=pins.find(p=>p.id===selectedId);
 const inspectedSpawnRegions=inspected&&spawnMode?spawnRegions.filter(p=>p.pos.length===4?inspected.lat>=p.pos[0]&&inspected.lat<=p.pos[2]&&inspected.lon>=p.pos[1]&&inspected.lon<=p.pos[3]:Math.hypot(inspected.lat-p.pos[0],inspected.lon-p.pos[1])<.5):[];
 const bestSpawnRegion=inspectedSpawnRegions.reduce((best,r)=>!best||r.weight>best.weight?r:best,null);
 const activeZone=mapName==='Aberration'?zoneById(zoneFocus):null;
 const zoneClip=activeZone?.polygon.map(p=>`${p.lon*10},${p.lat*10}`).join(' ')||'';
 const nodeOpacity=p=>!activeZone||zoneContains(activeZone,p)?1:0.15;
 const wikiSites=useMemo(()=>spawnMode?[]:showResources?visibleWikiSites(resourcePoints,enabledResources,bounded):[],[showResources,spawnMode,resourcePoints,enabledResources,bounded]);
 const publishedCount=resourcePoints.filter(p=>enabledResources.includes(p.resource)).length;
 const areaLine=areaPolygon.map(p=>`${p.lon*10},${p.lat*10}`).join(' ');
 const planPath=areaRoutePolyline(plannedStops,areaPolygon).map(p=>`${p.lon*10},${p.lat*10}`).join(' ');
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
  if(position){if(areaDrawing){onAreaPoint(position);return;}setInspected(position);setSelectedWiki(null);}
 };
 const beginDrag=event=>{
  if(event.pointerType==='mouse'&&event.button!==0)return;
  pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
  if(event.currentTarget.setPointerCapture)event.currentTarget.setPointerCapture(event.pointerId);
  if(pointers.current.size===2){
   const [a,b]=[...pointers.current.values()];
   const box=event.currentTarget.getBoundingClientRect();
   const midX=(a.x+b.x)/2,midY=(a.y+b.y)/2;
   pinch.current={
    distance:Math.hypot(a.x-b.x,a.y-b.y),
    startZoom:bounded,
    anchorX:offsetX+((midX-box.left)/box.width)*extent,
    anchorY:offsetY+((midY-box.top)/box.height)*extent,
    initialX:(midX-box.left)/box.width,
    initialY:(midY-box.top)/box.height
   };
   drag.current=null;moved.current=true;
  }else if(pointers.current.size===1){
   drag.current={x:event.clientX,y:event.clientY,originX:center.x,originY:center.y};
   moved.current=false;
  }
 };
 const duringDrag=event=>{
  if(!pointers.current.has(event.pointerId))return;
  pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
  const box=event.currentTarget.getBoundingClientRect();
  if(!box.width||!box.height)return;
  if(pointers.current.size===2&&pinch.current){
   const [a,b]=[...pointers.current.values()];
   const distance=Math.hypot(a.x-b.x,a.y-b.y);
   const nextZoom=Math.max(1,Math.min(8,pinch.current.startZoom*distance/Math.max(1,pinch.current.distance)));
   const nextExtent=1000/nextZoom;
   const fx=((a.x+b.x)/2-box.left)/box.width,fy=((a.y+b.y)/2-box.top)/box.height;
   const ox=Math.max(0,Math.min(1000-nextExtent,pinch.current.anchorX-fx*nextExtent));
   const oy=Math.max(0,Math.min(1000-nextExtent,pinch.current.anchorY-fy*nextExtent));
   setZoom(nextZoom);
   setCenter({x:ox+nextExtent/2,y:oy+nextExtent/2});
   moved.current=true;
  }else if(drag.current&&bounded>1){
   const dx=event.clientX-drag.current.x,dy=event.clientY-drag.current.y;
   if(Math.abs(dx)+Math.abs(dy)>5)moved.current=true;
   setCenter({x:drag.current.originX-dx/box.width*extent,y:drag.current.originY-dy/box.height*extent});
  }
 };
 const finishDrag=event=>{
  pointers.current.delete(event.pointerId);
  if(pointers.current.size<2)pinch.current=null;
  drag.current=null;
 };
 // Register a non-passive wheel handler so scrolling the map zooms the map
 // instead of scrolling the page; zoom is anchored to the mouse position.
 useEffect(()=>{
  const svg=svgRef.current;
  if(!svg)return;
  const wheel=e=>{
   e.preventDefault();
   const box=svg.getBoundingClientRect();
   if(!box.width||!box.height)return;
   const px=Math.max(0,Math.min(1,(e.clientX-box.left)/box.width));
   const py=Math.max(0,Math.min(1,(e.clientY-box.top)/box.height));
   const nextZoom=Math.min(8,Math.max(1,bounded*Math.exp(-e.deltaY*.0015)));
   if(Math.abs(nextZoom-bounded)<.001)return;
   const nextExtent=1000/nextZoom;
   const anchorX=offsetX+px*extent,anchorY=offsetY+py*extent;
   const ox=Math.max(0,Math.min(1000-nextExtent,anchorX-px*nextExtent));
   const oy=Math.max(0,Math.min(1000-nextExtent,anchorY-py*nextExtent));
   setZoom(nextZoom);
   setCenter({x:ox+nextExtent/2,y:oy+nextExtent/2});
  };
  svg.addEventListener('wheel',wheel,{passive:false});
  return()=>svg.removeEventListener('wheel',wheel);
 },[bounded,offsetX,offsetY,extent]);
 const chooseSite=(event,p)=>{if(areaDrawing)return;event.stopPropagation();if(moved.current){moved.current=false;return;}setSelectedWiki(p);setInspected({lat:p.lat,lon:p.lon});};
 return <div className="island-native-map">
  <div className="island-map-toolbar">
   <div><strong>{mapName} · ASA {spawnMode?'Creature Spawn Atlas':'Resource Atlas'}</strong><small>{areaDrawing?'Draw area: tap map to add vertices (minimum 3)':'Scroll / pinch to zoom · drag to pan'} · {spawnMode?spawnRegions.length.toLocaleString()+' documented spawn areas':wikiSites.length.toLocaleString()+' marker groups'}</small></div>
   <div className="island-map-actions">
    <button type="button" onClick={()=>{setZoom(1);setCenter({x:500,y:500});}} aria-label="Reset map zoom and position"><RotateCcw size={16}/></button>
    {mapName==='Aberration'&&<label className="island-zone-select"><span>ZONE FOCUS</span><select aria-label="Aberration Zone Focus" value={zoneFocus} onChange={e=>setZoneFocus(e.target.value)}>{aberrationZoneOptions.map(z=><option key={z.id} value={z.id}>{z.label}</option>)}</select></label>}
    <label><input type="checkbox" checked={showGrid} onChange={e=>setShowGrid(e.target.checked)}/> GPS grid</label>
    <label><input type="checkbox" checked={showResources} onChange={e=>setShowResources(e.target.checked)}/> {spawnMode?'Spawn zones':'Resources'}</label>
   </div>
  </div>
  <div className="island-map-frame">
   <svg ref={svgRef} viewBox={`${offsetX} ${offsetY} ${extent} ${extent}`} role="img" aria-label={`${mapName} ASA map with GPS, ${spawnMode?'documented colored creature spawn zones':'wiki resource points and personal pins'}; use mouse wheel or pinch to zoom, drag to pan, tap to inspect`} preserveAspectRatio="xMidYMid meet" onClick={inspectAt} onPointerDown={beginDrag} onPointerMove={duringDrag} onPointerUp={finishDrag} onPointerCancel={finishDrag}>
    <defs>{activeZone&&<clipPath id="aberration-active-zone"><polygon points={zoneClip}/></clipPath>}<pattern id="island-gps-grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="#7187a8" strokeOpacity=".38" strokeWidth="2"/></pattern></defs>
    {terrainFailed?(mapName==='The Island'?<IslandContourTerrain/>:<rect width="1000" height="1000" fill="#121822"/>):<><image href={terrainSrc} x="0" y="0" width="1000" height="1000" opacity={activeZone?aberrationZoneOpacity:1} preserveAspectRatio="none" onError={()=>setTerrainFailed(true)}/>{activeZone&&<image href={terrainSrc} x="0" y="0" width="1000" height="1000" preserveAspectRatio="none" clipPath="url(#aberration-active-zone)" pointerEvents="none"/>}</>}
    {showGrid&&<rect width="1000" height="1000" fill="url(#island-gps-grid)" pointerEvents="none"/>}
    <rect x="2" y="2" width="996" height="996" fill="none" stroke="#7895ae" strokeOpacity=".5" strokeWidth="3" pointerEvents="none"/>
    {showGrid&&Array.from({length:9},(_,i)=><g key={i} pointerEvents="none"><text x={(i+1)*100} y="22" fill="#e1ecf6" stroke="#102331" strokeWidth="3" paintOrder="stroke" fontSize="17" textAnchor="middle">{(i+1)*10}</text><text x="12" y={(i+1)*100} fill="#e1ecf6" stroke="#102331" strokeWidth="3" paintOrder="stroke" fontSize="17">{(i+1)*10}</text></g>)}
    {spawnMode&&showResources&&<g className="island-spawn-areas" pointerEvents="none">{spawnRegions.map((p,i)=>{const fill=spawnTierColors[p.tier]||spawnTierColors.unverified;const pos=p.pos;const location=pos.length===4?{lat:(pos[0]+pos[2])/2,lon:(pos[1]+pos[3])/2}:{lat:pos[0],lon:pos[1]};return <g key={'spawn-'+i} opacity={nodeOpacity(location)}>{pos.length===4?<rect x={pos[1]*10} y={pos[0]*10} width={Math.max(0.5,(pos[3]-pos[1])*10)} height={Math.max(0.5,(pos[2]-pos[0])*10)} fill={fill} fillOpacity={p.tier==='unverified'?0:.32} stroke={fill} strokeDasharray={p.tier==='unverified'?'4 3':undefined} strokeOpacity=".72" strokeWidth="1.25" vectorEffect="non-scaling-stroke"/>:<circle cx={pos[1]*10} cy={pos[0]*10} r="5" fill={fill} stroke="#121b21" strokeWidth="1.3" vectorEffect="non-scaling-stroke"/>}</g>;})}</g>}
    {wikiSites.map(p=><g opacity={nodeOpacity(p)} pointerEvents={areaDrawing?'none':'auto'} key={p.id} role="button" tabIndex={0} aria-label={`${p.resource} at latitude ${p.lat.toFixed(1)}, longitude ${p.lon.toFixed(1)}; ${p.count} mapped site${p.count===1?'':'s'}`} onClick={e=>chooseSite(e,p)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelectedWiki(p);setInspected({lat:p.lat,lon:p.lon});}}} style={{cursor:'pointer'}}>
      <circle cx={p.lon*10} cy={p.lat*10} r={selectedWiki?.id===p.id?11:7} stroke={selectedWiki?.id===p.id?'#fff':'#061522'} strokeWidth="2.7" vectorEffect="non-scaling-stroke" fill={colors[p.resource]||'#dfcef8'} fillOpacity=".92"/>
      {p.count>1&&bounded<3&&<text x={p.lon*10} y={p.lat*10+3.5} textAnchor="middle" pointerEvents="none" fontSize="10" fontWeight="800" fill="#101323">{p.count}</text>}
    </g>)}
    {areaPolygon.length>1&&<polyline points={areaLine} fill="none" stroke="#dda2ff" strokeWidth="3" strokeDasharray="8 6" vectorEffect="non-scaling-stroke" pointerEvents="none"/>}
    {areaPolygon.length>=3&&<polygon points={areaLine} fill="#b38af0" fillOpacity=".17" stroke="#d9b1ff" strokeWidth="3" strokeDasharray="8 6" vectorEffect="non-scaling-stroke" pointerEvents="none"/>}
    {areaPolygon.map((p,i)=><g key={'area-'+i} pointerEvents="none"><circle cx={p.lon*10} cy={p.lat*10} r="7" fill="#dfb3ff" stroke="#190b24" strokeWidth="2"/><text x={p.lon*10} y={p.lat*10+3} textAnchor="middle" fontSize="8" fontWeight="700" fill="#180c20">{i+1}</text></g>)}
    {plannedStops.length>1&&<polyline points={planPath} fill="none" stroke="#ffe08c" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity=".95" pointerEvents="none"/>}
    {plannedStops.map((p,i)=><g key={'route-'+p.id} pointerEvents="none"><circle cx={p.lon*10} cy={p.lat*10} r="11" fill="#ffe08c" stroke="#1a2534" strokeWidth="3" vectorEffect="non-scaling-stroke"/><text x={p.lon*10} y={p.lat*10+3.7} fontSize="11" textAnchor="middle" fontWeight="800" fill="#172434">{i+1}</text></g>)}
    {stops.length>1&&<polyline points={routePath} fill="none" stroke="#f5c25b" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity=".9" pointerEvents="none"/>}
    {pins.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100).map(p=><g pointerEvents={areaDrawing?'none':'auto'} key={p.id} tabIndex="0" role="button" aria-label={`${p.title||p.resource} at latitude ${p.lat}, longitude ${p.lon}`} onClick={e=>{e.stopPropagation();if(moved.current){moved.current=false;return;}onSelect(p.id);setInspected({lat:p.lat,lon:p.lon});setSelectedWiki(null);}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(p.id);setInspected({lat:p.lat,lon:p.lon});}}} style={{cursor:'pointer'}}>
     <circle cx={p.lon*10} cy={p.lat*10} r={selectedId===p.id?17:12} fill={colors[p.resource]||'#ffaf63'} stroke={selectedId===p.id?'#fff':'#09101b'} strokeWidth="5" vectorEffect="non-scaling-stroke"/>
     <path d={`M ${p.lon*10-6} ${p.lat*10} h12 M ${p.lon*10} ${p.lat*10-6} v12`} stroke="#0a1422" strokeWidth="2" pointerEvents="none"/>
    </g>)}
   </svg>
  </div>
  <div className="island-map-inspection" aria-live="polite">
   <div><strong><MapPin size={16}/> Inspected location</strong>
    {areaDrawing?<small>Drawing region · {areaPolygon.length} corners selected · click the map to add more</small>:null}
    {inspected?<span>LAT <b>{inspected.lat.toFixed(1)}</b> · LON <b>{inspected.lon.toFixed(1)}</b></span>:<span>Click or tap any point on the map to inspect its GPS position.</span>}
    {spawnMode&&bestSpawnRegion&&<small><b>{bestSpawnRegion.species}</b> · {spawnTierNames[bestSpawnRegion.tier]} · {bestSpawnRegion.basis} · {bestSpawnRegion.container}. Not a guaranteed encounter.</small>}
    {selectedWiki&&<small><b>{selectedWiki.resource}</b> · {selectedWiki.name||`${selectedWiki.count} mapped site(s)`} · {mapName==='Lost Colony'?(selectedWiki.resource==='Resource Outpost'?'Wiki ASA explorer resource outpost':'Wiki ASA resource survey'):mapName==='Astraeos'?(selectedWiki.resource.includes('Vein')?'Wiki ASA explorer vein reference':'Published approximate farming hotspot (not an individual node)'):selectedWiki.kind==='event'?'ARKCademy candidate event location (not live/ASA-verified)':resourceSource.verifiedASA===false?'Historical community resource GPS (ASA unverified)':'Wiki ASA resource survey'} {selectedWiki.kind==='event'?'':'(rev. '+resourceSource.revision+')'}</small>}
   </div>
   <button type="button" className="island-map-create-pin" disabled={!inspected||areaDrawing} onClick={()=>inspected&&onSaveAt(inspected)}><Plus size={16}/> Add custom pin here</button>
  </div>
  {mapName==='Aberration'&&<div className="island-zone-note" role="note">{aberrationZoneNote} Selecting a zone dims other regions and their published markers; it does not hide your personal pins, override GPS inspection, or constrain saved farming routes.</div>}
  {spawnMode?<div className="island-map-caption"><Info size={16}/><span>Genuine ASA terrain with native spawn overlays from <a href={spawnSource?.source||'#'} target="_blank" rel="noopener noreferrer">ARK Official Community Wiki spawn tables</a> (revision {spawnSource?.revision||'unknown'}). Gray outlines show documented areas with unverified rarity. Colors depict modeled regional rarity, NOT observed frequency or guaranteed encounter probabilities. Data may omit new, modified or unofficial cluster spawns. Wiki material is contributor-licensed; ARK terrain artwork belongs to its rights holders.</span></div>:<div className="island-map-caption"><Info size={16}/><span>Terrain and resource coordinate source: <a href={mapName==='Genesis: Part 1'?'https://ark.wiki.gg/wiki/Data:Maps/Resources/Genesis:_Part_1':mapName==='Lost Colony'?'https://ark.wiki.gg/wiki/Data:Maps/Resources/Lost_Colony/ASA':mapName==='Astraeos'?'https://ark.wiki.gg/wiki/Data:Maps/Exploration/Astraeos/ASA':mapName==='Valguero'?'https://ark.wiki.gg/wiki/Data:Maps/Resources/Valguero':mapName==='Ragnarok'?'https://ark.wiki.gg/wiki/Data:Maps/Resources/Ragnarok':mapName==='Extinction'?'https://ark.wiki.gg/wiki/Data:Maps/Resources/Extinction':mapName==='Aberration'?'https://ark.wiki.gg/wiki/Data:Maps/Resources/Aberration':mapName==='The Center'?'https://ark.wiki.gg/wiki/Data:Maps/Resources/The_Center':mapName==='The Island'?'https://ark.wiki.gg/wiki/Resource_Map/The_Island':'https://ark.wiki.gg/wiki/Resource_Map/Scorched_Earth'} target="_blank" rel="noopener noreferrer">ARK Official Community Wiki, {mapName}</a>. {resourceSource.verifiedASA===false?mapName==='Astraeos'?'Astraeos veins come from the ASA wiki explorer; other material markers are approximate published farming hotspots rather than complete individual resource nodes.':'Warning: Wiki shared resource GPS data are NOT independently ASA-verified; map overlays are references only.':'Resource coordinates are from the ASA-specific wiki map.'} Resource sites are published estimates rather than guaranteed live spawns; sourced categories are available for the selected map, other filters are for personal observations. Wiki-derived resource data: CC BY-NC-SA 4.0; game artwork belongs to its rights holders. {resourceSource.omittedOutOfBoundsCount} wiki explorer sites beyond GPS 0–100 are not displayed. Some Astraeos islands and routes extend beyond this 0–100 viewport. ARK ASA's full-screen map and minimap can disagree; compare GPS readouts against the minimap.</span></div>}
  {selected&&<div className="island-map-selection">Selected personal pin: <strong>{selected.title||selected.resource}</strong> — {selected.lat.toFixed(1)} LAT, {selected.lon.toFixed(1)} LON</div>}
 </div>;
}
