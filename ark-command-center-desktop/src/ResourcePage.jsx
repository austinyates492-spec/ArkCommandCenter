import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Compass,MapPin,Layers,Plus,Minus,RotateCcw,Search,Route,Trash2,LocateFixed,CheckCheck,X,Info,ExternalLink} from 'lucide-react';
import {islandResources,islandSeedMarkers,islandResourceSources,normalizeIslandMarker,mapPoint} from './island-resource-data.js';
import {maps,resources,resourceMapUrl,wikiResourceMapUrl} from './data';
import EmbeddedMap from './EmbeddedMap';
import {loadIslandBasemap,saveIslandBasemap,clearIslandBasemap,validateIslandMapFile} from './island-basemap-storage.js';
import './resource-atlas-native.css';

const defaultSelected=islandResources.map(r=>r.name);
const INITIAL_VIEW={x:0,y:0,width:1000,height:1000};
const resourceByName=Object.fromEntries(islandResources.map(r=>[r.name,r]));
function readSaved(key,fallback){
 try{const data=JSON.parse(localStorage.getItem(key));return data??fallback;}catch{return fallback;}
}
const validMarker=p=>p&&islandResources.some(r=>r.name===p.resource)&&Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100;
function clampView(view){
 const width=Math.max(160,Math.min(1000,view.width));
 const height=width;
 return {x:Math.max(0,Math.min(1000-width,view.x)),y:Math.max(0,Math.min(1000-height,view.y)),width,height};
}
function IslandAtlas({onMapChange}){
 const [selected,setSelected]=useState(()=>{const saved=readSaved('ark.atlas.island.layers',defaultSelected);return Array.isArray(saved)?saved.filter(x=>resourceByName[x]):defaultSelected;});
 const [custom,setCustom]=useState(()=>{const saved=readSaved('ark.atlas.island.pins',[]);return Array.isArray(saved)?saved.filter(validMarker).slice(0,250):[];});
 const [route,setRoute]=useState(()=>{const saved=readSaved('ark.atlas.island.route',[]);return Array.isArray(saved)?saved.filter(x=>typeof x==='string').slice(0,50):[];});
 const [view,setView]=useState(INITIAL_VIEW);
 const [selectedId,setSelectedId]=useState(null);
 const [query,setQuery]=useState('');
 const [filterOpen,setFilterOpen]=useState(true);
 const [addForm,setAddForm]=useState({resource:'Metal',lat:'',lon:''});
 const [error,setError]=useState('');
 const [basemapUrl,setBasemapUrl]=useState(null);
 const [mapBusy,setMapBusy]=useState(false);
 const [tapToPin,setTapToPin]=useState(false);
 const mapUrlRef=useRef(null);
 const installBasemap=blob=>{
  if(mapUrlRef.current)URL.revokeObjectURL(mapUrlRef.current);
  mapUrlRef.current=blob?URL.createObjectURL(blob):null;
  setBasemapUrl(mapUrlRef.current);
 };
 useEffect(()=>{
  let active=true;
  loadIslandBasemap().then(blob=>{if(active&&blob)installBasemap(blob);}).catch(()=>{});
  return ()=>{active=false;if(mapUrlRef.current){URL.revokeObjectURL(mapUrlRef.current);mapUrlRef.current=null;}};
 },[]);
 const uploadBasemap=async(event)=>{
  const file=event.target.files?.[0];
  event.target.value='';
  if(!file)return;
  setError('');setMapBusy(true);
  try{validateIslandMapFile(file);await saveIslandBasemap(file);installBasemap(file);}
  catch(e){setError('Map image could not be saved: '+(e.message||String(e)));}
  finally{setMapBusy(false);}
 };
 const resetBasemap=async()=>{
  setError('');setMapBusy(true);
  try{await clearIslandBasemap();installBasemap(null);}
  catch(e){setError('Map image could not be removed: '+(e.message||String(e)));}
  finally{setMapBusy(false);}
 };
 const svgRef=useRef(null);
 const pointers=useRef(new Map());
 const gesture=useRef(null);
 const justDragged=useRef(false);
 const all=useMemo(()=>[...islandSeedMarkers,...custom],[custom]);
 const markers=useMemo(()=>all.filter(m=>selected.includes(m.resource)&&m.resource.toLowerCase().includes(query.trim().toLowerCase())),[all,selected,query]);
 const picked=all.find(m=>m.id===selectedId)||null;
 const routeMarkers=route.map(id=>all.find(m=>m.id===id)).filter(Boolean);
 const hasData=name=>all.some(m=>m.resource===name);
 const saveLayers=next=>{setSelected(next);localStorage.setItem('ark.atlas.island.layers',JSON.stringify(next));};
 const saveCustom=next=>{setCustom(next);localStorage.setItem('ark.atlas.island.pins',JSON.stringify(next));};
 const saveRoute=next=>{setRoute(next);localStorage.setItem('ark.atlas.island.route',JSON.stringify(next));};
 const zoom=(factor,focus)=>setView(previous=>{
  const w=Math.max(160,Math.min(1000,previous.width*factor));
  const ratio=w/previous.width;
  const cx=focus?.x??previous.x+previous.width/2,cy=focus?.y??previous.y+previous.height/2;
  return clampView({x:cx-(cx-previous.x)*ratio,y:cy-(cy-previous.y)*ratio,width:w});
 });
 const coord=(event)=>{
  const rect=svgRef.current?.getBoundingClientRect();
  if(!rect?.width||!rect.height)return {x:500,y:500};
  return {x:view.x+(event.clientX-rect.left)/rect.width*view.width,y:view.y+(event.clientY-rect.top)/rect.height*view.height};
 };
 const onDown=event=>{
  if(event.button!==0&&event.pointerType==='mouse')return;
  svgRef.current?.setPointerCapture(event.pointerId);
  pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
  justDragged.current=false;
  if(pointers.current.size===1)gesture.current={last:{x:event.clientX,y:event.clientY}};
  if(pointers.current.size===2){const [a,b]=[...pointers.current.values()];gesture.current={distance:Math.hypot(a.x-b.x,a.y-b.y)};}
 };
 const onMove=event=>{
  if(!pointers.current.has(event.pointerId))return;
  const previous=pointers.current.get(event.pointerId);
  pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
  const rect=svgRef.current?.getBoundingClientRect();
  if(!rect?.width||!rect.height)return;
  if(pointers.current.size===2){
   const [a,b]=[...pointers.current.values()];
   const d=Math.hypot(a.x-b.x,a.y-b.y);
   if(gesture.current?.distance){const center={x:(a.x+b.x)/2,y:(a.y+b.y)/2};const focus={x:view.x+(center.x-rect.left)/rect.width*view.width,y:view.y+(center.y-rect.top)/rect.height*view.height};zoom(gesture.current.distance/d,focus);}
   gesture.current={distance:d};justDragged.current=true;
  }else if(pointers.current.size===1){
   const dx=event.clientX-previous.x,dy=event.clientY-previous.y;
   if(Math.abs(dx)+Math.abs(dy)>1){justDragged.current=true;setView(v=>clampView({...v,x:v.x-dx/rect.width*v.width,y:v.y-dy/rect.height*v.height}));}
  }
 };
 const onUp=event=>{pointers.current.delete(event.pointerId);gesture.current=null;};
 const addPin=event=>{
  event.preventDefault();setError('');
  try{
   const marker=normalizeIslandMarker(addForm);
   if(custom.length>=250)throw new Error('Local marker limit reached (250).');
   const id='user-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
   const next={...marker,id};
   saveCustom([...custom,next]);saveLayers([...new Set([...selected,marker.resource])]);setSelectedId(id);
   setAddForm({...addForm,lat:'',lon:''});
  }catch(e){setError(e.message);}
 };
 const routeAdd=()=>{if(!picked||route.includes(picked.id)||route.length>=50)return;saveRoute([...route,picked.id]);};
 const resourceCount=new Set(markers.map(m=>m.resource)).size;
 const coords=p=>p.lat.toFixed(1)+' LAT · '+p.lon.toFixed(1)+' LON';
 return <div className="resource-atlas-native">
  <div className="pagetitle"><span className="eyebrow">FIELD SURVIVAL / NATIVE ATLAS</span><h1>Resource Atlas <span className="atlas-native-tag">THE ISLAND</span></h1><p>Interactive Island resource explorer with selectable layers, GPS sample pins and personal farming routes. No embedded wiki iframe.</p></div>
  <div className="atlas-native-kpis">
   <div><small>Visible map points</small><strong>{markers.length}</strong></div>
   <div><small>Selected layers</small><strong>{selected.length} <span>/ {islandResources.length}</span></strong></div>
   <div><small>Route stops</small><strong>{routeMarkers.length}</strong></div>
   <div><small>Dataset</small><strong className="atlas-native-dataset">PARTIAL</strong></div>
  </div>
  <div className="atlas-native-workspace">
   <section className="panel atlas-native-map-panel">
    <div className="atlas-native-head"><h2>Native Island Map</h2><span className="atlas-native-chip">GPS 0–100</span></div>
    <div className="atlas-native-toolbar">
     <div className="atlas-native-map-choice"><MapPin size={16}/><label className="atlas-native-map-pick"><span>ARK Map</span><select aria-label="Choose ARK map" value="The Island" onChange={e=>onMapChange(e.target.value)}>{maps.map(m=><option key={m}>{m}</option>)}</select></label></div>
     <div className="atlas-native-search"><Search size={16}/><input aria-label="Search resource types" placeholder="Filter resource names..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
    </div>
    <div className="atlas-native-basemap-tools">
     <label className="ghost atlas-native-image-upload">Use Your Island Map Image
      <input aria-label="Import your Island map image" type="file" accept="image/png,image/jpeg,image/webp" disabled={mapBusy} onChange={uploadBasemap}/>
     </label>
     {basemapUrl&&<button type="button" className="ghost" disabled={mapBusy} onClick={resetBasemap}>Use Schematic Map</button>}
     <button type="button" className={tapToPin?'primary':'ghost'} aria-pressed={tapToPin} onClick={()=>setTapToPin(v=>!v)}>{tapToPin?'Tap-to-Pin: ON':'Pick GPS on Map'}</button>
    </div>
    <div className="atlas-native-map-holder">
     <svg ref={svgRef} className={"atlas-native-map-svg"+(tapToPin?" is-placing":"")} viewBox={[view.x,view.y,view.width,view.height].join(' ')} preserveAspectRatio="none" role="img" aria-label="Schematic Island coordinate grid with community-sample resource markers. Drag to pan, pinch or scroll to zoom." onClick={e=>{if(!tapToPin||justDragged.current)return;const p=coord(e);setAddForm(v=>({...v,lat:(p.y/10).toFixed(1),lon:(p.x/10).toFixed(1)}));setError('');}} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onWheel={e=>{if(e.cancelable)e.preventDefault();zoom(e.deltaY>0?1.14:.88,coord(e));}}>
      <defs>
       <linearGradient id="atlas-native-water" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#13394a"/><stop offset="1" stopColor="#0b2433"/></linearGradient>
       <linearGradient id="atlas-native-land" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#5b7764"/><stop offset=".52" stopColor="#3b604e"/><stop offset="1" stopColor="#254b42"/></linearGradient>
       <pattern id="atlas-native-grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M100 0H0V100" fill="none" stroke="#94b9c1" strokeOpacity=".20" strokeWidth="2"/></pattern>
      </defs>
      <rect width="1000" height="1000" fill="url(#atlas-native-water)"/>
      {basemapUrl&&<image href={basemapUrl} x="0" y="0" width="1000" height="1000" preserveAspectRatio="none"/>}
      <g opacity={basemapUrl?0:1}>
      <path d="M180 205 Q240 90 405 170 L518 112 Q650 110 710 200 Q862 225 820 393 L882 534 Q800 656 844 765 Q714 856 605 836 L502 885 Q369 828 271 837 Q130 724 153 615 Q85 475 162 362Z" fill="url(#atlas-native-land)" stroke="#94ae8c" strokeWidth="9"/>
      <path d="M205 360 Q325 273 440 346 Q562 275 684 340 Q780 418 733 542 M290 680 Q450 547 618 667 M380 220 Q500 370 635 218" stroke="#8fa88a" strokeOpacity=".3" strokeWidth="65" fill="none" strokeLinecap="round"/>
      <path d="M274 320 L380 260 L430 330 L540 235 L650 300 L746 280 M332 553 L448 450 L532 530 L645 460 L755 530" stroke="#b8b7a2" strokeWidth="30" strokeOpacity=".58" fill="none" strokeLinecap="round"/>
      <path d="M266 315 L380 260 L430 330 L540 235 L650 300 L746 280 M332 553 L448 450 L532 530 L645 460 L755 530" stroke="#4e655c" strokeWidth="13" strokeOpacity=".8" fill="none"/>
      <path d="M480 240 Q445 409 530 514 T576 770" stroke="#84b6b2" strokeWidth="19" fill="none" strokeLinecap="round" opacity=".76"/>
      <path d="M480 240 Q445 409 530 514 T576 770" stroke="#245f6e" strokeWidth="8" fill="none"/>
      </g>
      <rect width="1000" height="1000" fill="url(#atlas-native-grid)"/>
      {routeMarkers.length>1&&<polyline fill="none" stroke="white" strokeOpacity=".8" strokeWidth={Math.max(3,view.width/220)} strokeDasharray="13 9" points={routeMarkers.map(m=>{const p=mapPoint(m.lat,m.lon);return p.x+','+p.y;}).join(' ')}/>}
      {markers.map(m=>{const p=mapPoint(m.lat,m.lon),active=selectedId===m.id,routeIndex=route.indexOf(m.id);return <g key={m.id} className="atlas-native-marker" role="button" tabIndex={0} aria-label={m.resource+' at latitude '+m.lat+' longitude '+m.lon} onClick={e=>{e.stopPropagation();if(!justDragged.current)setSelectedId(m.id);justDragged.current=false;}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelectedId(m.id);}}}>
       <circle cx={p.x} cy={p.y} r={active?17:14} fill={resourceByName[m.resource]?.color||'#fff'} fillOpacity=".22"/>
       <circle cx={p.x} cy={p.y} r={Math.max(5,view.width/170)} fill={resourceByName[m.resource]?.color||'#fff'} stroke={active?'#fff':'#0a1e2e'} strokeWidth={active?3:2}/>
       {routeIndex>=0&&<circle cx={p.x} cy={p.y} r={Math.max(10,view.width/90)} fill="none" stroke="#fff" strokeWidth="2"/>}
      </g>;})}
      <g fontSize="22" fill="#c8dce2" opacity=".75" fontWeight="bold"><text x="22" y="39">LAT 0</text><text x="22" y="982">LAT 100</text><text x="820" y="982">LON 100</text></g>
     </svg>
     <div className="atlas-native-map-title">THE ISLAND <span>{basemapUrl?'PERSONAL MAP · GPS-ALIGNED':'SCHEMATIC TERRAIN'}</span></div>
     <div className="atlas-native-map-zoom"><button type="button" aria-label="Zoom in" onClick={()=>zoom(.8)}><Plus size={17}/></button><button type="button" aria-label="Zoom out" onClick={()=>zoom(1.25)}><Minus size={17}/></button><button type="button" aria-label="Reset map view" onClick={()=>setView(INITIAL_VIEW)}><RotateCcw size={16}/></button></div>
     <div className="atlas-native-map-bottom">{tapToPin?'Tap the map to fill GPS fields · ':'Sample coordinates · '}{Math.round(1000/view.width*100)}% zoom</div>
    </div>
    <div className="atlas-native-layer-heading"><div><strong>Resource Layers</strong><small>{selected.length} of {islandResources.length} enabled · {resourceCount} with visible samples</small></div><button type="button" className="ghost" onClick={()=>setFilterOpen(v=>!v)}>{filterOpen?'Collapse':'Expand'} Filters</button></div>
    {filterOpen&&<>
     <div className="atlas-native-select-buttons"><button type="button" className="primary" onClick={()=>saveLayers(defaultSelected)}><CheckCheck size={16}/> Select All</button><button type="button" className="ghost" onClick={()=>saveLayers([])}><X size={16}/> Deselect All</button></div>
     <div className="atlas-native-resource-grid">{islandResources.map(r=>{
      const enabled=selected.includes(r.name),mapped=hasData(r.name);
      return <button key={r.name} type="button" aria-pressed={enabled} className={'atlas-native-resource-choice'+(enabled?' is-selected':'')} onClick={()=>saveLayers(enabled?selected.filter(x=>x!==r.name):[...selected,r.name])}><span className="atlas-native-resource-dot" style={{background:r.color}}/><span>{r.name}</span><small>{mapped?all.filter(x=>x.resource===r.name).length+' pins':'No pins'}</small><span aria-hidden>{enabled?'☑':'☐'}</span></button>;
     })}</div>
    </>}
    <div className="atlas-native-disclaimer"><Info size={15}/> {basemapUrl?'Your imported map is displayed only in this browser; it must cover the full 0–100 GPS coordinate square without borders or cropping.':'Map terrain is an original schematic, not exact in-game coastline.'} Only 15 community-sourced GPS samples are preloaded across five resource types. No invented pins are shown for the other eight resource layers. You can add your own locations below. Imported images must be yours to use.</div>
   </section>
   <div className="atlas-native-side">
    <section className="panel">
     <div className="atlas-native-head"><h2>Selected Resource</h2><span className="atlas-native-chip">GPS DETAILS</span></div>
     {picked?<div className="atlas-native-selected">
       <strong style={{color:resourceByName[picked.resource]?.color}}>{picked.resource}</strong>
       <div><span>Latitude</span><b>{picked.lat.toFixed(1)}</b></div>
       <div><span>Longitude</span><b>{picked.lon.toFixed(1)}</b></div>
       <div><span>Source</span><b>{picked.origin==='user-pin'?'Your personal marker':'Community GPS sample'}</b></div>
       <div><span>Verification</span><b>Unverified</b></div>
       <button type="button" className="primary" disabled={route.includes(picked.id)||route.length>=50} onClick={routeAdd}><Route size={15}/>{route.includes(picked.id)?'Already on Route':'Add to Farming Route'}</button>
       {picked.origin==='user-pin'&&<button type="button" className="ghost" onClick={()=>{if(!window.confirm('Remove this personal marker?'))return;saveCustom(custom.filter(p=>p.id!==picked.id));saveRoute(route.filter(id=>id!==picked.id));setSelectedId(null);}}><Trash2 size={15}/> Remove Personal Pin</button>}
      </div>:<p className="atlas-native-hint">Tap any marker for GPS coordinates and route planning. Marker coordinates are community samples or pins you've added yourself.</p>}
    </section>
    <section className="panel">
     <div className="atlas-native-head"><h2>Farming Route</h2><span className="atlas-native-chip">{routeMarkers.length} STOPS</span></div>
     {routeMarkers.length?<div className="atlas-native-route">{routeMarkers.map((m,i)=><div key={m.id}><span>{i+1}</span><div><strong>{m.resource}</strong><small>{coords(m)}</small></div><button type="button" aria-label={'Remove stop '+(i+1)} onClick={()=>saveRoute(route.filter(id=>id!==m.id))}><Trash2 size={15}/></button></div>)}</div>:<p className="atlas-native-hint">Build a farming circuit by selecting pins and adding them in the order you'd like to visit. No automatic travel-path calculations are implied.</p>}
     <button type="button" className="ghost atlas-native-full" disabled={!route.length} onClick={()=>saveRoute([])}><Trash2 size={15}/> Clear Route</button>
    </section>
    <section className="panel">
     <div className="atlas-native-head"><h2>Add Personal Pin</h2><span className="atlas-native-chip">LOCAL</span></div>
     <p className="atlas-native-hint">Found a gathering spot? Enter its GPS coordinates, or enable Pick GPS on Map and tap a location to fill them. Pins are saved in this browser, not synced to your tribe.</p>
     <form onSubmit={addPin}>
      <label className="field"><span>Resource</span><select value={addForm.resource} onChange={e=>setAddForm(v=>({...v,resource:e.target.value}))}>{islandResources.map(r=><option key={r.name}>{r.name}</option>)}</select></label>
      <div className="atlas-native-coord-inputs"><label className="field"><span>Latitude</span><input aria-label="Pin latitude" type="number" step=".1" min="0" max="100" required value={addForm.lat} onChange={e=>setAddForm(v=>({...v,lat:e.target.value}))} placeholder="e.g. 42.5"/></label><label className="field"><span>Longitude</span><input aria-label="Pin longitude" type="number" step=".1" min="0" max="100" required value={addForm.lon} onChange={e=>setAddForm(v=>({...v,lon:e.target.value}))} placeholder="e.g. 51.0"/></label></div>
      <button type="submit" className="primary atlas-native-full"><Plus size={15}/> Add to Map</button>
     </form>
     {error&&<div role="alert" className="notice">{error}</div>}
    </section>
   </div>
  </div>
  <section className="panel atlas-native-sources"><h2>Resource coverage and sources</h2><p>The resource catalog reflects the 13 published Island map layers. The official wiki's full resource-node dataset was not directly available for validated reuse, and its licensable material carries noncommercial terms. The native map uses original schematic artwork (or a map image you import locally), a small set of separately attributed unverified samples, and your local pins. Only use imagery you own or have permission to use.</p><div><a href={islandResourceSources.catalog} target="_blank" rel="noopener noreferrer">ASA resource layer catalog <ExternalLink size={12}/></a><a href={islandResourceSources.samples} target="_blank" rel="noopener noreferrer">Community GPS sample source <ExternalLink size={12}/></a><a href={islandResourceSources.wiki} target="_blank" rel="noopener noreferrer">Official wiki reference <ExternalLink size={12}/></a></div></section>
 </div>;
}

/** Preserve legacy embedded map support for all other official maps until their
 * independent native datasets can be licensed and verified. */
export default function ResourcePage(){
 const [map,setMap]=useState('The Island');
 const [resource,setResource]=useState('Metal');
 if(map==='The Island')return <IslandAtlas onMapChange={setMap}/>;
 return <div className="resource-atlas-native">
  <div className="pagetitle"><span className="eyebrow">FIELD SURVIVAL / LEGACY MAP PROVIDER</span><h1>Resource Atlas</h1><p>The native resource explorer currently covers The Island. Other maps retain their original third-party provider until native data is available.</p></div>
  <section className="panel">
   <div className="atlas-native-head"><h2>Other ARK Maps</h2><span className="atlas-native-chip">LEGACY VIEWER</span></div>
   <div className="resourceFilters">
    <label className="field"><span>ARK MAP</span><select value={map} onChange={e=>setMap(e.target.value)}>{maps.map(m=><option key={m}>{m}</option>)}</select></label>
    <label className="field"><span>RESOURCE TYPE</span><select value={resource} onChange={e=>setResource(e.target.value)}>{resources.map(r=><option key={r}>{r}</option>)}</select></label>
   </div>
   <EmbeddedMap key={map} url={resourceMapUrl(map)} alternativeUrl={wikiResourceMapUrl(map)} title={map+' Resource Atlas'} selection={resource} kind="resource"/>
   <div className="notice">This map still uses the previous external provider; native Island GPS coordinates are not projected onto other maps.</div>
  </section>
 </div>;
}
