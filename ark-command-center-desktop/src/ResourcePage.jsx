import React,{useMemo,useState} from 'react';
import {Map,MapPin,Layers,Route,Plus,Trash2,CheckCheck,X,ExternalLink,Info,Search,Navigation,Compass,ShieldCheck} from 'lucide-react';
import {maps,resourceMapUrl,wikiResourceMapUrl} from './data';
import {resourcesForMap,mapsWithOilVeins,checkAtlasPin,CUSTOM_PIN_RESOURCE,atlasSourceLinks} from './atlas-resource-model.js';
import EmbeddedMap from './EmbeddedMap';
import IslandNativeMap from './IslandNativeMap';
import {islandWikiResources,islandWikiAvailableResources} from './island-wiki-resource-overlay';
import {scorchedWikiResources,scorchedWikiAvailableResources,scorchedWikiSource} from './scorched-asa-resource-overlay.js';
import {centerWikiResources,centerWikiAvailableResources,centerWikiSource} from './center-asa-resource-overlay.js';
import {aberrationWikiResources,aberrationWikiAvailableResources,aberrationWikiSource} from './aberration-resource-overlay.js';
import {extinctionAtlasPoints,extinctionAtlasAvailableResources,extinctionWikiSource,extinctionEventSource} from './extinction-resource-overlay.js';
import {ragnarokWikiResources,ragnarokWikiAvailableResources,ragnarokWikiSource} from './ragnarok-resource-overlay.js';
import {valgueroWikiResources,valgueroWikiAvailableResources,valgueroWikiSource} from './valguero-resource-overlay.js';
import {astraeosAtlasPoints,astraeosAtlasAvailableResources,astraeosAtlasSource,astraeosWikiVeinSource,astraeosHotspotSource} from './astraeos-resource-overlay.js';
import {lostColonyAtlasPoints,lostColonyAtlasAvailableResources,lostColonyWikiSource,lostColonyOutpostSource} from './lost-colony-resource-overlay.js';
import {islandWikiSource} from './island-wiki-resource-overlay';
import {generateFarmingRoute,candidateFarmingSites,insideFarmingArea} from './island-area-route-planner.js';
import './resource-atlas-native.css';
import './atlas-production.css';

const STORE='ark.atlas.personalPins.v3',ROUTE_STORE='ark.atlas.routes.v3',PLAN_STORE='ark.atlas.generatedFarmingRoutes.v1';
function readLocal(key,fallback){try{const value=JSON.parse(localStorage.getItem(key));return value??fallback}catch{return fallback}}
function saveLocal(key,data){try{localStorage.setItem(key,JSON.stringify(data));return true}catch{return false}}
function localPins(){const a=readLocal(STORE,[]);return Array.isArray(a)?a.filter(p=>p&&typeof p.id==='string'&&typeof p.map==='string'&&Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100).slice(0,300):[];}
function localRoutes(){const o=readLocal(ROUTE_STORE,{});return o&&typeof o==='object'&&!Array.isArray(o)?o:{};}
export default function ResourcePage(){
 const [map,setMap]=useState('The Island');
 const [tab,setTab]=useState('resources');
 const [pins,setPins]=useState(localPins);
 const [routes,setRoutes]=useState(localRoutes);
 const [areaDrawing,setAreaDrawing]=useState(false);
 const [areaPolygon,setAreaPolygon]=useState([]);
 const [routeTypes,setRouteTypes]=useState(['Metal','Rich Metal','Crystal','Obsidian']);
 const [routeMode,setRouteMode]=useState('balanced');
 const [maxRouteStops,setMaxRouteStops]=useState(12);
 const [routeStart,setRouteStart]=useState('center');
 const [generated,setGenerated]=useState(null);
 const [savedPlans,setSavedPlans]=useState(()=>{const value=readLocal(PLAN_STORE,[]);return Array.isArray(value)?value.slice(0,15):[];});
 const [planName,setPlanName]=useState('Island resource run');
 const [search,setSearch]=useState('');
 const [selection,setSelection]=useState(null);
 const [form,setForm]=useState({resource:'Metal',title:'',lat:'',lon:'',note:''});
 const [error,setError]=useState('');
 const [savedMessage,setSavedMessage]=useState('');
 const resources=useMemo(()=>resourcesForMap(map),[map]);
 const nativeAtlas=map==='The Island'||map==='Scorched Earth'||map==='The Center'||map==='Aberration'||map==='Extinction'||map==='Ragnarok'||map==='Valguero'||map==='Astraeos'||map==='Lost Colony';
 const wikiPoints=map==='Scorched Earth'?scorchedWikiResources:map==='The Center'?centerWikiResources:map==='Aberration'?aberrationWikiResources:map==='Extinction'?extinctionAtlasPoints:map==='Ragnarok'?ragnarokWikiResources:map==='Valguero'?valgueroWikiResources:map==='Astraeos'?astraeosAtlasPoints:map==='Lost Colony'?lostColonyAtlasPoints:islandWikiResources;
 const sourcedResources=map==='Scorched Earth'?scorchedWikiAvailableResources:map==='The Center'?centerWikiAvailableResources:map==='Aberration'?aberrationWikiAvailableResources:map==='Extinction'?extinctionAtlasAvailableResources:map==='Ragnarok'?ragnarokWikiAvailableResources:map==='Valguero'?valgueroWikiAvailableResources:map==='Astraeos'?astraeosAtlasAvailableResources:map==='Lost Colony'?lostColonyAtlasAvailableResources:islandWikiAvailableResources;
 const wikiSource=map==='Scorched Earth'?scorchedWikiSource:map==='The Center'?centerWikiSource:map==='Aberration'?aberrationWikiSource:map==='Extinction'?extinctionWikiSource:map==='Ragnarok'?ragnarokWikiSource:map==='Valguero'?valgueroWikiSource:map==='Astraeos'?astraeosAtlasSource:map==='Lost Colony'?lostColonyWikiSource:islandWikiSource;
 const [filtersByMap,setFiltersByMap]=useState({});
 const enabled=filtersByMap[map]??resources.map(r=>r.id);
 const personalOnMap=pins.filter(p=>p.map===map);
 const shownPersonal=personalOnMap.filter(p=>(p.resource===CUSTOM_PIN_RESOURCE||enabled.includes(p.resource))&&(p.resource.toLowerCase().includes(search.toLowerCase())||String(p.title||'').toLowerCase().includes(search.toLowerCase())));
 const selectedPin=personalOnMap.find(p=>p.id===selection);
 const routeIds=Array.isArray(routes[map])?routes[map]:[];
 const stops=routeIds.map(id=>personalOnMap.find(p=>p.id===id)).filter(Boolean);
 const insideSites=useMemo(()=>candidateFarmingSites(wikiPoints,areaPolygon,routeTypes),[wikiPoints,areaPolygon,routeTypes]);
 const routeStartCoords=routeStart==='first'?areaPolygon[0]||null:routeStart.startsWith('pin:')?personalOnMap.find(p=>p.id===routeStart.slice(4))||null:null;
 const drawAreaPoint=point=>{if(areaPolygon.length>=24)return;setAreaPolygon(v=>[...v,{lat:Math.round(point.lat*100)/100,lon:Math.round(point.lon*100)/100}]);setGenerated(null);};
 const buildRoute=()=>{
  if(areaPolygon.length<3){setError('Draw an area using at least 3 points first.');return;}
  if(!routeTypes.length){setError('Select at least one mapped resource category.');return;}
  const result=generateFarmingRoute({points:wikiPoints,polygon:areaPolygon,types:routeTypes,maxStops:maxRouteStops,mode:routeMode,start:routeStartCoords});
  if(result.reason){setGenerated(null);setError(result.reason);return;}
  setGenerated(result);setAreaDrawing(false);setError('');setSavedMessage('Generated a GPS-ordered resource run inside your selected area. Review and save it below.');
 };
 const saveGeneratedPlan=()=>{
  if(!generated?.stops?.length)return;
  const entry={id:'farm-'+Date.now(),name:planName.trim().slice(0,60)||map+' resource run',map,polygon:areaPolygon,
   types:routeTypes,mode:routeMode,maxStops:maxRouteStops,routeStart,stops:generated.stops.map(p=>p.id),savedAt:new Date().toISOString()};
  const next=[entry,...savedPlans].slice(0,15);
  setSavedPlans(next);
  if(!saveLocal(PLAN_STORE,next))setError('Browser storage is unavailable; route may not survive reload.');
  else setSavedMessage('Farming route saved in this browser.');
 };
 const loadGeneratedPlan=entry=>{
  const nodes=entry.stops.map(id=>wikiPoints.find(p=>p.id===id)).filter(Boolean);
  if(!nodes.length){setError('Saved route sites are no longer present in this source dataset.');return;}
  if(entry.map!==map){setError('Select '+entry.map+' before loading this route.');return;}
  setAreaPolygon(entry.polygon);setRouteTypes(entry.types);setRouteMode(entry.mode);setMaxRouteStops(entry.maxStops);setRouteStart(entry.routeStart);
  setGenerated({stops:nodes,eligible:nodes.length});setPlanName(entry.name);setAreaDrawing(false);setTab('routes');
  setSavedMessage('Saved route loaded. You can edit stops or generate a new path.');
 };
 const deleteGeneratedPlan=id=>{const next=savedPlans.filter(p=>p.id!==id);setSavedPlans(next);saveLocal(PLAN_STORE,next);};
 const updateFilters=next=>setFiltersByMap(current=>({...current,[map]:next}));
 const persistPins=next=>{setPins(next);if(!saveLocal(STORE,next))setError('Browser storage is blocked: these pins may not survive a reload.');};
 const persistRoutes=next=>{setRoutes(next);if(!saveLocal(ROUTE_STORE,next))setError('Browser storage is blocked: this route may not survive a reload.');};
 const setRouteIds=next=>persistRoutes({...routes,[map]:next});
 const changeMap=next=>{setAreaDrawing(false);setAreaPolygon([]);setGenerated(null);setRouteStart('center');setRouteTypes(['Metal','Rich Metal','Crystal','Obsidian']);setMap(next);setSelection(null);setError('');setSavedMessage('');setSearch('');setForm({resource:'Metal',title:'',lat:'',lon:'',note:''});};
 const saveAtMapPoint=point=>{setForm({resource:CUSTOM_PIN_RESOURCE,title:'',lat:point.lat.toFixed(1),lon:point.lon.toFixed(1),note:''});setTab('pins');setError('');setSavedMessage('Coordinates selected from map. Name this custom pin, then save it.');};
 const addPin=event=>{
  event.preventDefault();setError('');setSavedMessage('');
  try{
   const validated=checkAtlasPin(form,map);
   if(pins.length>=300)throw Error('Local marker limit reached (300).');
   const pin={id:'pin-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),map,...validated,source:'Your GPS entry'};
   persistPins([...pins,pin]);setSelection(pin.id);setSavedMessage('Personal GPS pin saved in this browser.');
   setForm({...form,title:'',lat:'',lon:'',note:''});
  }catch(e){setError(e.message);}
 };
 const deletePin=pin=>{
  if(!window.confirm('Delete this personal GPS pin?'))return;
  persistPins(pins.filter(p=>p.id!==pin.id));
  persistRoutes({...routes,[map]:routeIds.filter(id=>id!==pin.id)});
  if(selection===pin.id)setSelection(null);
 };
 const addStop=()=>{if(!selectedPin||routeIds.includes(selectedPin.id)||stops.length>=40)return;setRouteIds([...routeIds,selectedPin.id]);setSavedMessage('Pin added to this map’s route.');};
 const colors={...Object.fromEntries(resources.map(r=>[r.id,r.color])),[CUSTOM_PIN_RESOURCE]:'#ffad5a'};
 const sourcedCount=nativeAtlas?wikiPoints.filter(p=>enabled.includes(p.resource)).length:0;
 return <div className="resource-atlas-native atlas-v3">
  <div className="atlas-v3-top">
   <div><span className="eyebrow">EXPLORATION / RESOURCE ATLAS</span><h1>Resource Atlas <span className="atlas-native-tag">V3</span></h1><p>Genuine map sources with ARK Tribe HQ scouting, personal pins and farming routes.</p></div>
   <div className="atlas-v3-top-actions">
    <label className="field"><span>WORLD / MAP</span><select aria-label="Select map" value={map} onChange={e=>changeMap(e.target.value)}>{maps.map(m=><option key={m}>{m}</option>)}</select></label>
   </div>
  </div>
  <div className="atlas-v3-tabs" role="tablist" aria-label="Atlas tool panel">
   {[['resources','Resources',Layers],['routes','Farming Routes',Route],['pins','My Pins',MapPin]].map(([id,label,Icon])=><button type="button" role="tab" key={id} aria-selected={tab===id} className={tab===id?'selected':''} onClick={()=>setTab(id)}><Icon size={16}/>{label}</button>)}
  </div>
  <div className="atlas-v3-statgrid">
   <div><small>Resource types</small><b>{resources.length}</b></div>
   <div><small>Selected filters</small><b>{enabled.length}</b></div>
   <div><small>My map pins</small><b>{personalOnMap.length}</b></div>
   <div><small>Saved route stops</small><b>{stops.length}</b></div>
  </div>
  <div className="atlas-v3-grid">
   <section className="panel atlas-v3-main">
    <div className="atlas-native-head"><h2><Map size={18}/> {map} <span className="atlas-v3-map-type">{nativeAtlas?'NATIVE ASA TERRAIN':'GENUINE SOURCE MAP'}</span></h2><span className="atlas-native-chip">ASA REFERENCE</span></div>
    <div className="atlas-v3-source-explainer"><ShieldCheck size={17}/><span>{nativeAtlas?map==='Lost Colony'?'Authentic Lost Colony ASA terrain with 17,966 source-mapped resource sites and 22 separate resource outpost locations from the official wiki ASA explorer map. Outposts are scouting locations, not ordinary gatherable material nodes.':map==='Astraeos'?'Authentic Astraeos ASA terrain with official-wiki ASA explorer Oil, Gas and Water Vein positions, plus separately sourced approximate ARK Status resource-farming hotspots. The wiki does not publish a complete Astraeos resource-node map; material markers are curated cluster centres, not individual rocks.':map==='Valguero'?'Authentic Valguero ASA terrain with published community reference resource sites. Includes 44 Oil Vein / Oil Well entries, 53 gas veins, gatherable Oil and cave resources. The shared wiki coordinates are not independently ASA-verified.':map==='Ragnarok'?'Authentic Ragnarok ASA terrain and published wiki community resource references. Includes separate pumpable Oil Vein and Water Vein layers, plus gatherable Oil. Coordinates are sourced from a shared wiki map and are not independently ASA-verified.':map==='Extinction'?'Authentic Extinction ASA terrain with published community reference resource coordinates. The wiki shared resource dataset is not ASA-verified. OSD and Element Vein markers use separate ARKCademy published candidate event waypoints; they are reference spawn locations, not live ASA event availability.':map==='Aberration'?'Authentic Aberration ASA terrain with wiki community resource GPS references. Select Green, Blue or Red using the Zone Focus dropdown above the map. Zone boundaries are approximate visual references because Aberration has stacked underground regions.':map==='The Center'?'Authentic The Center ASA terrain with historical community resource GPS references from the official wiki. These source markers have NOT been verified against ASA; cave and surface sites are separate. Map and overlays load locally, without external iframes.':'Authentic '+map+' ASA terrain and sourced GPS resource markers from ARK Official Community Wiki, served directly by ARK Tribe HQ. No remote image or iframe. Your GPS pins and routes remain separate from published sites.':'This map uses an external community provider. The provider controls terrain and published marker layers.'}</span></div>
    {nativeAtlas?<IslandNativeMap key={map} mapName={map} terrainSrc={map==='Scorched Earth'?'/maps/scorched-earth-asa.jpg':map==='The Center'?'/maps/the-center-asa.jpg':map==='Aberration'?'/maps/aberration-asa.jpg':map==='Extinction'?'/maps/extinction-asa.jpg':map==='Ragnarok'?'/maps/ragnarok-asa.jpg':map==='Valguero'?'/maps/valguero-asa.jpg':map==='Astraeos'?'/maps/astraeos-asa.jpg':map==='Lost Colony'?'/maps/lost-colony-asa.jpg':'/maps/the-island-asa.jpg'} resourcePoints={wikiPoints} resourceSource={wikiSource} pins={shownPersonal} stops={stops} selectedId={selection} onSelect={setSelection} colors={colors} enabledResources={enabled} onSaveAt={saveAtMapPoint} areaDrawing={areaDrawing} areaPolygon={areaPolygon} onAreaPoint={drawAreaPoint} plannedStops={generated?.stops||[]}/>:<EmbeddedMap key={map} url={resourceMapUrl(map)} alternativeUrl={wikiResourceMapUrl(map)} title={map+' Resources'} selection="Source-managed coordinates" kind="resource"/>}
    <div className="atlas-v3-source-links"><a href={resourceMapUrl(map)} target="_blank" rel="noopener noreferrer"><ExternalLink size={14}/> Open detailed map</a><a href={wikiResourceMapUrl(map)} target="_blank" rel="noopener noreferrer"><ExternalLink size={14}/> Official community wiki map</a></div>
    {map==='Lost Colony'&&<div className="atlas-v3-source-note"><Info size={16}/> The <a href={lostColonyWikiSource.url} target="_blank" rel="noopener noreferrer">ASA Wiki Resource Map</a> supplies published material locations. The <a href={lostColonyOutpostSource.url} target="_blank" rel="noopener noreferrer">ASA Explorer Map</a> supplies 22 separately filterable Resource Outposts; these are locations to scout, not guaranteed live supplies or ordinary harvestable nodes.</div>}
    {map==='Astraeos'&&<div className="atlas-v3-source-note"><Info size={16}/> Astraeos's wiki has no complete resource-node atlas yet. Native pins combine <a href={astraeosWikiVeinSource.url} target="_blank" rel="noopener noreferrer">ASA wiki explorer data for oil, gas and water veins</a> with <a href={astraeosHotspotSource.url} target="_blank" rel="noopener noreferrer">published ARK Status farming hotspots</a>. Hotspots are approximate area centres, not individual ore nodes. Some real Astraeos GPS locations exceed 100 and cannot appear on this 0–100 map; see the original source for the full extent.</div>}
    {map==='Extinction'&&<div className="atlas-v3-source-note"><Info size={16}/> OSD and Element Vein reference GPS sites are sourced from <a href={extinctionEventSource.url} target="_blank" rel="noopener noreferrer">ARKCademy</a>. A single site may host either event, and the event may not be active. These coordinates are not independently ASA-verified.</div>}
    {map==='The Island'&&<div className="atlas-v3-source-note"><Info size={16}/> This map has gatherable Oil nodes, not Oil Well sites. Oil veins are only offered for maps with documented pumpable deposits.</div>}
   </section>
   <div className="atlas-v3-side">
    {tab==='resources'&&<section className="panel atlas-v3-panel">
     <div className="atlas-native-head"><h2><Layers size={18}/> Resource Filters</h2><span className="atlas-native-chip">{enabled.length} / {resources.length}</span></div>
     <div className="atlas-v3-selectrow"><button className="primary" type="button" onClick={()=>updateFilters(resources.map(r=>r.id))}><CheckCheck size={16}/> Select All</button><button className="ghost" type="button" onClick={()=>updateFilters([])}><X size={16}/> Deselect All</button></div>
     <label className="atlas-v3-find"><Search size={15}/><input aria-label="Search my resource filters" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search resources"/></label>
     <div className="atlas-v3-filters">{resources.filter(r=>r.id.toLowerCase().includes(search.toLowerCase())).map(r=><button type="button" key={r.id} aria-pressed={enabled.includes(r.id)} className={enabled.includes(r.id)?'active':''} onClick={()=>updateFilters(enabled.includes(r.id)?enabled.filter(n=>n!==r.id):[...enabled,r.id])}><span className="atlas-v3-type-dot" style={{background:r.color}}/><span>{r.id}{nativeAtlas&&!sourcedResources.includes(r.id)&&<small className="atlas-v3-personal-only">My pins only</small>}</span><span className="atlas-v3-checkbox">{enabled.includes(r.id)?'☑':'☐'}</span></button>)}</div>
     <p className="atlas-v3-hint"><Info size={14}/> {nativeAtlas?map==='Lost Colony'?'Resource markers come from the Wiki Lost Colony ASA map; Resource Outposts use a separate ASA explorer layer. Markers indicate published sites and do not guarantee in-game availability.':map==='Astraeos'?'Pumpable Oil, Gas and Water Vein pins come from the ASA wiki explorer map. Material markers are a limited number of published approximate farming hotspot centres, not a complete resource-node dataset. Other categories are for personal pins only.':map==='Valguero'?'Select Oil Vein / Oil Well for pumpable oil deposits, Oil for gatherable rocks, and Gas Vein for gas extraction sites. All source locations are community references pending individual ASA verification.':map==='Ragnarok'?'Select Oil Vein / Oil Well for pumpable locations, Oil for gatherable nodes, or Water Vein for water pumps. Wiki source coordinates are community references not independently ASA-verified.':map==='Extinction'?'These filters show community resource references on genuine Extinction ASA terrain; OSD and Element Vein filters show separately sourced candidate event waypoints (37 OSD, 26 Element Vein entries, some overlapping), not guaranteed active events.':map==='Aberration'?'These filters show community mapped Aberration resources; exact ASA positions are not independently verified, and Zone Focus only dims map layers.':map==='The Center'?'These filters display historical Center community resource locations on ASA terrain; exact ASA node accuracy is unverified. Cave markers are distinct from surface markers.':'These filters change published Wiki ASA resource markers and your saved resource pins. Only categories with sourced points show public markers; other filters are for personal scouting notes.':'These filters control your personal pin list. Published resource nodes remain controlled by the source map’s own Resources layers.'}</p>
     {mapsWithOilVeins.includes(map)&&<div className="atlas-v3-oil-note"><strong>Oil Vein / Oil Well</strong><span>{map==='Scorched Earth'?'Oil pump sites are sourced from the ASA wiki Oil Vein layer and displayed on the native map.':map==='Ragnarok'?'47 published oil-vein locations are imported from the community Ragnarok map as reference coordinates, not individually ASA-confirmed.':map==='Valguero'?'44 published oil-vein sites are imported from the shared community Valguero resource map; pump availability and ASA accuracy should be verified in-game.':map==='Astraeos'?'58 in-bounds Oil Vein locations are imported from the official wiki ASA explorer map (source revision 601078); the wider map extends beyond GPS 100 and some sites cannot be shown in this viewport.':'Oil Pumps are built on oil veins. See the community provider for locations; we have not imported unverified coordinates.'}</span><a href={atlasSourceLinks.oilVein} target="_blank" rel="noopener noreferrer">Oil Vein reference <ExternalLink size={12}/></a></div>}
     {nativeAtlas&&<p className="atlas-v3-hint"><Info size={14}/> {sourcedCount.toLocaleString()} {map==='The Center'||map==='Aberration'||map==='Extinction'||map==='Ragnarok'||map==='Valguero'||map==='Astraeos'?'community reference':'sourced ASA wiki'} resource sites match your filters (grouped at low zoom), plus {shownPersonal.length} personal pin(s). Custom pins always appear.</p>}
     <div className="atlas-v3-personal-heading"><h3>My visible GPS pins</h3><small>{shownPersonal.length}</small></div>
     {shownPersonal.length?<div className="atlas-v3-pinlist">{shownPersonal.map(p=><button key={p.id} type="button" className={selection===p.id?'active':''} onClick={()=>setSelection(p.id)}><span style={{background:colors[p.resource]}} className="atlas-v3-type-dot"/><span>{p.title||p.resource}<small>{p.lat.toFixed(1)} LAT · {p.lon.toFixed(1)} LON</small></span></button>)}</div>:<p className="atlas-v3-empty">No personal GPS pins match these filters. Published wiki resource markers appear directly on the native ASA map.</p>}
    </section>}
    {tab==='routes'&&nativeAtlas&&<section className="panel atlas-v3-panel atlas-v3-planner">
     <div className="atlas-native-head"><h2><Route size={17}/> Area Farming Planner</h2><span className="atlas-native-chip">GPS ROUTING</span></div>
     <p className="atlas-v3-hint">Outline a region on the map using at least three clicks or taps. Select resource types or reference event sites, then generate an approximate GPS route within your boundary. Event availability and safe routes cannot be guaranteed.</p>
     <div className="atlas-v3-selectrow"><button type="button" className={areaDrawing?'primary':'ghost'} onClick={()=>{setTab('routes');setAreaDrawing(v=>!v);setError('');}}>{areaDrawing?'Finish Drawing':'Draw Farming Area'}</button><button type="button" className="ghost" onClick={()=>{setAreaPolygon([]);setGenerated(null);setAreaDrawing(false);}}>Clear Area</button></div>
     <div className="atlas-v3-plan-progress">{areaPolygon.length} boundary corners · {insideSites.length.toLocaleString()} matching sourced sites</div>
     <div className="atlas-v3-plan-tools"><button type="button" className="ghost" disabled={!areaPolygon.length} onClick={()=>{setAreaPolygon(v=>v.slice(0,-1));setGenerated(null);}}>Undo last corner</button></div>
     <div className="atlas-v3-personal-heading"><h3>Resources to gather</h3><small>{routeTypes.length} selected</small></div>
     <div className="atlas-v3-filters">{sourcedResources.map(r=><button key={r} type="button" className={routeTypes.includes(r)?'active':''} aria-pressed={routeTypes.includes(r)} onClick={()=>{setRouteTypes(v=>v.includes(r)?v.filter(x=>x!==r):[...v,r]);setGenerated(null);}}><span className="atlas-v3-type-dot" style={{background:colors[r]}}/>{r}<span className="atlas-v3-checkbox">{routeTypes.includes(r)?'☑':'☐'}</span></button>)}</div>
     <div className="atlas-v3-form">
      <label className="field"><span>OPTIMIZATION</span><select value={routeMode} onChange={e=>{setRouteMode(e.target.value);setGenerated(null);}}><option value="shortest">Shortest GPS path</option><option value="balanced">Balanced resources</option><option value="coverage">Area coverage</option></select></label>
      <label className="field"><span>START NEAR</span><select value={routeStart} onChange={e=>{setRouteStart(e.target.value);setGenerated(null);}}><option value="center">Area center</option><option value="first">First area corner</option>{personalOnMap.filter(p=>insideFarmingArea(p,areaPolygon)).map(p=><option key={p.id} value={'pin:'+p.id}>{p.title||p.resource} ({p.lat.toFixed(1)}, {p.lon.toFixed(1)})</option>)}</select></label>
      <label className="field"><span>MAXIMUM STOPS — {maxRouteStops}</span><input aria-label="Maximum farming stops" type="range" min="5" max="40" step="1" value={maxRouteStops} onChange={e=>{setMaxRouteStops(Number(e.target.value));setGenerated(null);}}/></label>
     </div>
     <button type="button" className="primary atlas-v3-full" disabled={areaPolygon.length<3||!routeTypes.length||!insideSites.length} onClick={buildRoute}><Route size={16}/> Generate Farming Route</button>
     {generated?.stops?.length>0&&<>
      <div className="atlas-v3-personal-heading"><h3>Generated route</h3><small>{generated.stops.length} / {generated.eligible} sites</small></div>
      <p className="atlas-v3-hint">Yellow numbered stops show an approximate GPS visit order. Lines are direct connections, not validated roads, flights or terrain-safe paths.</p>
      <div className="atlas-v3-route">{generated.stops.map((p,i)=><div key={p.id}><b>{i+1}</b><span>{p.resource}<small>LAT {p.lat.toFixed(1)} · LON {p.lon.toFixed(1)}</small></span><button type="button" aria-label={'Remove generated route stop '+(i+1)} onClick={()=>setGenerated(v=>({...v,stops:v.stops.filter(n=>n.id!==p.id)}))}><Trash2 size={15}/></button></div>)}</div>
      <label className="field"><span>ROUTE NAME</span><input type="text" maxLength="60" value={planName} onChange={e=>setPlanName(e.target.value)}/></label>
      <button type="button" className="primary atlas-v3-full" onClick={saveGeneratedPlan}>Save Farming Route</button>
     </>}
     {savedPlans.filter(p=>p.map===map).length>0&&<>
      <div className="atlas-v3-personal-heading"><h3>Saved area routes</h3><small>THIS BROWSER</small></div>
      <div className="atlas-v3-pinlist">{savedPlans.filter(p=>p.map===map).map(p=><div key={p.id} className="atlas-v3-saved-plan"><button type="button" onClick={()=>loadGeneratedPlan(p)}>{p.name}<small>{p.stops.length} stops · {p.mode}</small></button><button type="button" aria-label={'Delete '+p.name} onClick={()=>deleteGeneratedPlan(p.id)}><Trash2 size={16}/></button></div>)}</div>
     </>}
    </section>}
    {tab==='routes'&&<section className="panel atlas-v3-panel">
     <div className="atlas-native-head"><h2><Route size={17}/> Farming Route</h2><span className="atlas-native-chip">{stops.length} STOPS</span></div>
     <p className="atlas-v3-hint">Save an ordered route from personal GPS pins on {map}. Route order is manual; no unsupported travel distances are claimed.</p>
     {stops.length?<div className="atlas-v3-route">{stops.map((p,i)=><div key={p.id}><b>{i+1}</b><span>{p.resource}<small>{p.lat.toFixed(1)}, {p.lon.toFixed(1)}</small></span><button type="button" aria-label={'Remove route stop '+(i+1)} onClick={()=>setRouteIds(routeIds.filter(id=>id!==p.id))}><Trash2 size={15}/></button></div>)}</div>:<p className="atlas-v3-empty">No stops yet. Go to My Pins and choose a saved location to add it.</p>}
     <button type="button" className="ghost atlas-v3-full" disabled={!stops.length} onClick={()=>setRouteIds([])}><Trash2 size={15}/> Clear Route</button>
    </section>}
    {tab==='pins'&&<section className="panel atlas-v3-panel">
     <div className="atlas-native-head"><h2><MapPin size={17}/> My Pins</h2><span className="atlas-native-chip">BROWSER-LOCAL</span></div>
     <p className="atlas-v3-hint">Choose Custom Pin and enter a name. Type latitude/longitude manually, or click the native ASA map and choose Add custom pin here. Personal pins are saved only in this browser.</p>
     <form className="atlas-v3-form" onSubmit={addPin}>
      <label className="field"><span>RESOURCE</span><select value={form.resource} onChange={e=>setForm(f=>({...f,resource:e.target.value}))}><option value={CUSTOM_PIN_RESOURCE}>Custom Pin</option>{resources.map(r=><option key={r.id}>{r.id}</option>)}</select></label>
      <label className="field"><span>{form.resource===CUSTOM_PIN_RESOURCE?'PIN NAME (REQUIRED)':'PIN LABEL (OPTIONAL)'}</span><input type="text" maxLength="60" required={form.resource===CUSTOM_PIN_RESOURCE} value={form.title||''} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="E.g. Hidden base entrance"/></label>
      <div className="atlas-v3-coords"><label className="field"><span>LATITUDE</span><input type="number" required min="0" max="100" step=".1" placeholder="0–100" value={form.lat} onChange={e=>setForm(f=>({...f,lat:e.target.value}))}/></label><label className="field"><span>LONGITUDE</span><input type="number" required min="0" max="100" step=".1" placeholder="0–100" value={form.lon} onChange={e=>setForm(f=>({...f,lon:e.target.value}))}/></label></div>
      <label className="field"><span>SCOUTING NOTE (OPTIONAL)</span><textarea rows="2" maxLength="180" value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} placeholder="E.g. bring a flyer; nearby hostile creatures"/></label>
      <button type="submit" className="primary atlas-v3-full"><Plus size={15}/> Save GPS Pin</button>
     </form>
     <div className="atlas-v3-personal-heading"><h3>Saved markers</h3><small>{personalOnMap.length}</small></div>
     {personalOnMap.length?<div className="atlas-v3-pinlist">{personalOnMap.map(p=><button key={p.id} type="button" className={selection===p.id?'active':''} onClick={()=>setSelection(p.id)}><span className="atlas-v3-type-dot" style={{background:colors[p.resource]||'#a98def'}}/><span>{p.title||p.resource}<small>{p.lat.toFixed(1)} LAT · {p.lon.toFixed(1)} LON</small></span></button>)}</div>:<p className="atlas-v3-empty">Your first pin will appear here after you save it.</p>}
    </section>}
    <section className="panel atlas-v3-panel atlas-v3-selected">
     <div className="atlas-native-head"><h2><Navigation size={17}/> Selected Location</h2><span className="atlas-native-chip">PERSONAL GPS</span></div>
     {selectedPin?<><strong style={{color:colors[selectedPin.resource]||'var(--ark-bright)'}}>{selectedPin.title||selectedPin.resource}</strong><div><span>Latitude</span><b>{selectedPin.lat.toFixed(1)}</b></div><div><span>Longitude</span><b>{selectedPin.lon.toFixed(1)}</b></div><div><span>Source</span><b>Your GPS entry</b></div>{selectedPin.note&&<p>{selectedPin.note}</p>}<button type="button" className="primary atlas-v3-full" disabled={routeIds.includes(selectedPin.id)||stops.length>=40} onClick={addStop}><Plus size={15}/>{routeIds.includes(selectedPin.id)?'Already on Route':'Add to Farming Route'}</button><button type="button" className="ghost atlas-v3-full" onClick={()=>deletePin(selectedPin)}><Trash2 size={15}/> Delete Pin</button></>:<p className="atlas-v3-empty">Select one of your saved GPS pins to inspect its details and add it to a route.</p>}
    </section>
   </div>
  </div>
  {(error||savedMessage)&&<div className="notice" role="status">{error||savedMessage}</div>}
  <div className="atlas-v3-foot"><Compass size={16}/><span><strong>Atlas integrity:</strong> No invented terrain images, node positions, resource totals or oil-well counts. The Island terrain is an authentic ASA map image from the ARK Official Community Wiki, hosted locally. The Island and Scorched Earth include ASA wiki datasets. The Center, Aberration, Extinction, Ragnarok, and Valguero use shared wiki community resource coordinates on genuine ASA terrain. Astraeos combines wiki ASA explorer vein references with limited independently published material farming hotspots; none are invented as complete node surveys. Lost Colony uses its dedicated ASA wiki resource dataset plus separately sourced ASA explorer Resource Outposts. Custom markers and saved routes are browser-local.</span></div>
 </div>;
}
