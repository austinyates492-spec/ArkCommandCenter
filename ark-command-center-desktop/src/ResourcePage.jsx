import React,{useMemo,useState} from 'react';
import {Map,MapPin,Layers,Route,Plus,Trash2,CheckCheck,X,ExternalLink,Info,Search,Navigation,Compass,ShieldCheck} from 'lucide-react';
import {maps,resourceMapUrl,wikiResourceMapUrl} from './data';
import {resourcesForMap,mapsWithOilVeins,checkAtlasPin,atlasSourceLinks} from './atlas-resource-model.js';
import EmbeddedMap from './EmbeddedMap';
import IslandNativeMap from './IslandNativeMap';
import './resource-atlas-native.css';
import './atlas-production.css';

const STORE='ark.atlas.personalPins.v3',ROUTE_STORE='ark.atlas.routes.v3';
function readLocal(key,fallback){try{const value=JSON.parse(localStorage.getItem(key));return value??fallback}catch{return fallback}}
function saveLocal(key,data){try{localStorage.setItem(key,JSON.stringify(data));return true}catch{return false}}
function localPins(){const a=readLocal(STORE,[]);return Array.isArray(a)?a.filter(p=>p&&typeof p.id==='string'&&typeof p.map==='string'&&Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100).slice(0,300):[];}
function localRoutes(){const o=readLocal(ROUTE_STORE,{});return o&&typeof o==='object'&&!Array.isArray(o)?o:{};}
export default function ResourcePage(){
 const [map,setMap]=useState('The Island');
 const [tab,setTab]=useState('resources');
 const [pins,setPins]=useState(localPins);
 const [routes,setRoutes]=useState(localRoutes);
 const [search,setSearch]=useState('');
 const [selection,setSelection]=useState(null);
 const [form,setForm]=useState({resource:'Metal',lat:'',lon:'',note:''});
 const [error,setError]=useState('');
 const [savedMessage,setSavedMessage]=useState('');
 const resources=useMemo(()=>resourcesForMap(map),[map]);
 const [filtersByMap,setFiltersByMap]=useState({});
 const enabled=filtersByMap[map]??resources.map(r=>r.id);
 const personalOnMap=pins.filter(p=>p.map===map);
 const shownPersonal=personalOnMap.filter(p=>enabled.includes(p.resource)&&p.resource.toLowerCase().includes(search.toLowerCase()));
 const selectedPin=personalOnMap.find(p=>p.id===selection);
 const routeIds=Array.isArray(routes[map])?routes[map]:[];
 const stops=routeIds.map(id=>personalOnMap.find(p=>p.id===id)).filter(Boolean);
 const updateFilters=next=>setFiltersByMap(current=>({...current,[map]:next}));
 const persistPins=next=>{setPins(next);if(!saveLocal(STORE,next))setError('Browser storage is blocked: these pins may not survive a reload.');};
 const persistRoutes=next=>{setRoutes(next);if(!saveLocal(ROUTE_STORE,next))setError('Browser storage is blocked: this route may not survive a reload.');};
 const setRouteIds=next=>persistRoutes({...routes,[map]:next});
 const changeMap=next=>{setMap(next);setSelection(null);setError('');setSavedMessage('');setSearch('');setForm({resource:'Metal',lat:'',lon:'',note:''});};
 const addPin=event=>{
  event.preventDefault();setError('');setSavedMessage('');
  try{
   const validated=checkAtlasPin(form,map);
   if(pins.length>=300)throw Error('Local marker limit reached (300).');
   const pin={id:'pin-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),map,...validated,source:'Your GPS entry'};
   persistPins([...pins,pin]);setSelection(pin.id);setSavedMessage('Personal GPS pin saved in this browser.');
   setForm({...form,lat:'',lon:'',note:''});
  }catch(e){setError(e.message);}
 };
 const deletePin=pin=>{
  if(!window.confirm('Delete this personal GPS pin?'))return;
  persistPins(pins.filter(p=>p.id!==pin.id));
  persistRoutes({...routes,[map]:routeIds.filter(id=>id!==pin.id)});
  if(selection===pin.id)setSelection(null);
 };
 const addStop=()=>{if(!selectedPin||routeIds.includes(selectedPin.id)||stops.length>=40)return;setRouteIds([...routeIds,selectedPin.id]);setSavedMessage('Pin added to this map’s route.');};
 const colors=Object.fromEntries(resources.map(r=>[r.id,r.color]));
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
    <div className="atlas-native-head"><h2><Map size={18}/> {map} <span className="atlas-v3-map-type">{map==='The Island'?'NATIVE GPS WORKSPACE':'GENUINE SOURCE MAP'}</span></h2><span className="atlas-native-chip">ASA REFERENCE</span></div>
    <div className="atlas-v3-source-explainer"><ShieldCheck size={17}/><span>{map==='The Island'?'The Island now displays genuine ASA terrain artwork from the ARK Official Community Wiki as an image layer, not a third-party iframe. Personal GPS markers are overlaid natively. Published resource nodes are not imported yet.':'This map uses an external community provider. The provider controls terrain and published marker layers.'}</span></div>
    {map==='The Island'?<IslandNativeMap pins={shownPersonal} stops={stops} selectedId={selection} onSelect={setSelection} colors={colors}/>:<EmbeddedMap key={map} url={resourceMapUrl(map)} alternativeUrl={wikiResourceMapUrl(map)} title={map+' Resources'} selection="Source-managed coordinates" kind="resource"/>}
    <div className="atlas-v3-source-links"><a href={resourceMapUrl(map)} target="_blank" rel="noopener noreferrer"><ExternalLink size={14}/> Open detailed map</a><a href={wikiResourceMapUrl(map)} target="_blank" rel="noopener noreferrer"><ExternalLink size={14}/> Official community wiki map</a></div>
    {map==='The Island'&&<div className="atlas-v3-source-note"><Info size={16}/> This map has gatherable Oil nodes, not Oil Well sites. Oil veins are only offered for maps with documented pumpable deposits.</div>}
   </section>
   <div className="atlas-v3-side">
    {tab==='resources'&&<section className="panel atlas-v3-panel">
     <div className="atlas-native-head"><h2><Layers size={18}/> Resource Filters</h2><span className="atlas-native-chip">{enabled.length} / {resources.length}</span></div>
     <div className="atlas-v3-selectrow"><button className="primary" type="button" onClick={()=>updateFilters(resources.map(r=>r.id))}><CheckCheck size={16}/> Select All</button><button className="ghost" type="button" onClick={()=>updateFilters([])}><X size={16}/> Deselect All</button></div>
     <label className="atlas-v3-find"><Search size={15}/><input aria-label="Search my resource filters" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search resources"/></label>
     <div className="atlas-v3-filters">{resources.filter(r=>r.id.toLowerCase().includes(search.toLowerCase())).map(r=><button type="button" key={r.id} aria-pressed={enabled.includes(r.id)} className={enabled.includes(r.id)?'active':''} onClick={()=>updateFilters(enabled.includes(r.id)?enabled.filter(n=>n!==r.id):[...enabled,r.id])}><span className="atlas-v3-type-dot" style={{background:r.color}}/><span>{r.id}</span><span className="atlas-v3-checkbox">{enabled.includes(r.id)?'☑':'☐'}</span></button>)}</div>
     <p className="atlas-v3-hint"><Info size={14}/> {map==='The Island'?'These filters immediately change which of your saved GPS markers are visible on the native map. Published resource nodes are not imported yet.':'These filters control your personal pin list. Published resource nodes remain controlled by the source map’s own Resources layers.'}</p>
     {mapsWithOilVeins.includes(map)&&<div className="atlas-v3-oil-note"><strong>Oil Vein / Oil Well</strong><span>Oil Pumps are built on oil veins. See the community provider for locations; we have not imported unverified coordinates.</span><a href={atlasSourceLinks.oilVein} target="_blank" rel="noopener noreferrer">Oil Vein reference <ExternalLink size={12}/></a></div>}
     <div className="atlas-v3-personal-heading"><h3>My visible GPS pins</h3><small>{shownPersonal.length}</small></div>
     {shownPersonal.length?<div className="atlas-v3-pinlist">{shownPersonal.map(p=><button key={p.id} type="button" className={selection===p.id?'active':''} onClick={()=>setSelection(p.id)}><span style={{background:colors[p.resource]}} className="atlas-v3-type-dot"/><span>{p.resource}<small>{p.lat.toFixed(1)} LAT · {p.lon.toFixed(1)} LON</small></span></button>)}</div>:<p className="atlas-v3-empty">No personal GPS pins match these filters yet. Check the external source links for community-published nodes.</p>}
    </section>}
    {tab==='routes'&&<section className="panel atlas-v3-panel">
     <div className="atlas-native-head"><h2><Route size={17}/> Farming Route</h2><span className="atlas-native-chip">{stops.length} STOPS</span></div>
     <p className="atlas-v3-hint">Save an ordered route from personal GPS pins on {map}. Route order is manual; no unsupported travel distances are claimed.</p>
     {stops.length?<div className="atlas-v3-route">{stops.map((p,i)=><div key={p.id}><b>{i+1}</b><span>{p.resource}<small>{p.lat.toFixed(1)}, {p.lon.toFixed(1)}</small></span><button type="button" aria-label={'Remove route stop '+(i+1)} onClick={()=>setRouteIds(routeIds.filter(id=>id!==p.id))}><Trash2 size={15}/></button></div>)}</div>:<p className="atlas-v3-empty">No stops yet. Go to My Pins and choose a saved location to add it.</p>}
     <button type="button" className="ghost atlas-v3-full" disabled={!stops.length} onClick={()=>setRouteIds([])}><Trash2 size={15}/> Clear Route</button>
    </section>}
    {tab==='pins'&&<section className="panel atlas-v3-panel">
     <div className="atlas-native-head"><h2><MapPin size={17}/> My Pins</h2><span className="atlas-native-chip">BROWSER-LOCAL</span></div>
     <p className="atlas-v3-hint">Enter GPS coordinates measured in ARK. These are your own observations—not published or automatically verified node coordinates. Pins and routes are saved only in this browser.</p>
     <form className="atlas-v3-form" onSubmit={addPin}>
      <label className="field"><span>RESOURCE</span><select value={form.resource} onChange={e=>setForm(f=>({...f,resource:e.target.value}))}>{resources.map(r=><option key={r.id}>{r.id}</option>)}</select></label>
      <div className="atlas-v3-coords"><label className="field"><span>LATITUDE</span><input type="number" required min="0" max="100" step=".1" placeholder="0–100" value={form.lat} onChange={e=>setForm(f=>({...f,lat:e.target.value}))}/></label><label className="field"><span>LONGITUDE</span><input type="number" required min="0" max="100" step=".1" placeholder="0–100" value={form.lon} onChange={e=>setForm(f=>({...f,lon:e.target.value}))}/></label></div>
      <label className="field"><span>SCOUTING NOTE (OPTIONAL)</span><textarea rows="2" maxLength="180" value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} placeholder="E.g. bring a flyer; nearby hostile creatures"/></label>
      <button type="submit" className="primary atlas-v3-full"><Plus size={15}/> Save GPS Pin</button>
     </form>
     <div className="atlas-v3-personal-heading"><h3>Saved markers</h3><small>{personalOnMap.length}</small></div>
     {personalOnMap.length?<div className="atlas-v3-pinlist">{personalOnMap.map(p=><button key={p.id} type="button" className={selection===p.id?'active':''} onClick={()=>setSelection(p.id)}><span className="atlas-v3-type-dot" style={{background:colors[p.resource]||'#a98def'}}/><span>{p.resource}<small>{p.lat.toFixed(1)} LAT · {p.lon.toFixed(1)} LON</small></span></button>)}</div>:<p className="atlas-v3-empty">Your first pin will appear here after you save it.</p>}
    </section>}
    <section className="panel atlas-v3-panel atlas-v3-selected">
     <div className="atlas-native-head"><h2><Navigation size={17}/> Selected Location</h2><span className="atlas-native-chip">PERSONAL GPS</span></div>
     {selectedPin?<><strong style={{color:colors[selectedPin.resource]||'var(--ark-bright)'}}>{selectedPin.resource}</strong><div><span>Latitude</span><b>{selectedPin.lat.toFixed(1)}</b></div><div><span>Longitude</span><b>{selectedPin.lon.toFixed(1)}</b></div><div><span>Source</span><b>Your GPS entry</b></div>{selectedPin.note&&<p>{selectedPin.note}</p>}<button type="button" className="primary atlas-v3-full" disabled={routeIds.includes(selectedPin.id)||stops.length>=40} onClick={addStop}><Plus size={15}/>{routeIds.includes(selectedPin.id)?'Already on Route':'Add to Farming Route'}</button><button type="button" className="ghost atlas-v3-full" onClick={()=>deletePin(selectedPin)}><Trash2 size={15}/> Delete Pin</button></>:<p className="atlas-v3-empty">Select one of your saved GPS pins to inspect its details and add it to a route.</p>}
    </section>
   </div>
  </div>
  {(error||savedMessage)&&<div className="notice" role="status">{error||savedMessage}</div>}
  <div className="atlas-v3-foot"><Compass size={16}/><span><strong>Atlas integrity:</strong> No invented terrain images, node positions, resource totals or oil-well counts. The Island terrain is sourced from the ARK Official Community Wiki and is loaded as a standalone image, not an iframe. Current markers and routes are personal entries; community resource nodes still require a vetted GPS dataset.</span></div>
 </div>;
}
