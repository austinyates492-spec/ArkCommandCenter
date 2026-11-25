import React,{useEffect,useMemo,useState} from 'react';
import {CheckCircle2,Info,Layers3,MapPin,AlertTriangle} from 'lucide-react';
import IslandNativeMap from './IslandNativeMap.jsx';
import {spawnLoaders,terrainForSpawnMap,spawnTierColors,spawnTierNames,spawnTierOptions,spawnZonesForCreature,spawnLocationCoverage} from './spawn-zone-model.js';
import './native-spawn-atlas.css';

const EMPTY=[];
const EMPTY_SOURCE={revision:null,source:null};
/** One native map for every tame; load only the selected map's ASA spawn records.
 * Aberration shares native terrain, source rectangles and existing Zone Focus.
 * Genesis has a second genuinely sourced Ocean terrain/layer.
 */
export default function NativeSpawnAtlas({map='The Island',creature='Rex'}){
 const [ocean,setOcean]=useState(false);
 const effectiveMap=map==='Genesis: Part 1'&&ocean?'Genesis: Part 1 Ocean':map;
 const [bundle,setBundle]=useState(null);
 const [loading,setLoading]=useState(true);
 const [failure,setFailure]=useState(null);
 const [tier,setTier]=useState('all');
 const [mode,setMode]=useState('documented');
 const [showLegend,setShowLegend]=useState(true);
 useEffect(()=>{setOcean(false);setTier('all');},[map]);
 useEffect(()=>{
  let alive=true;
  setBundle(null);setLoading(true);setFailure(null);
  const loader=spawnLoaders[effectiveMap];
  if(!loader){setLoading(false);setFailure('No source-backed native spawn dataset for this map.');return;}
  loader().then(result=>{
   if(!alive)return;
   setBundle(result.default||result);setLoading(false);
  }).catch(error=>{
   if(!alive)return;
   setFailure('Unable to load the native spawn map. Please retry or refresh.');
   setLoading(false);
  });
  return()=>{alive=false;};
 },[effectiveMap]);
 const selection=useMemo(()=>bundle?spawnZonesForCreature(bundle,creature,effectiveMap,tier,mode):{zones:EMPTY,matched:EMPTY,count:0},[bundle,creature,effectiveMap,tier,mode]);
 const coverage=useMemo(()=>bundle?spawnLocationCoverage(bundle,creature,effectiveMap):{matched:[],documented:false},[bundle,creature,effectiveMap]);
 const allCount=useMemo(()=>bundle?spawnZonesForCreature(bundle,creature,effectiveMap).count:0,[bundle,creature,effectiveMap]);
 const versions=bundle?Object.keys(bundle.species).length:0;
 const terrain=terrainForSpawnMap[effectiveMap];
 return <section className="native-spawn-atlas" aria-label="Native creature spawn atlas">
  {map==='Genesis: Part 1'&&<div className="native-spawn-biome">
   <span><Layers3 size={17}/> Genesis spawn layer</span>
   <div className="native-spawn-tabs" role="group" aria-label="Genesis habitat map">
    <button type="button" className={!ocean?'active':''} aria-pressed={!ocean} onClick={()=>{setOcean(false);setTier('all');}}>Main simulations</button>
    <button type="button" className={ocean?'active':''} aria-pressed={ocean} onClick={()=>{setOcean(true);setTier('all');}}>Ocean simulation</button>
   </div>
  </div>}
  <div className="native-spawn-heading">
   <div><small>CREATURE SPAWN OVERLAY</small><strong>{creature||'Choose a creature'}</strong><span>{effectiveMap}</span></div>
   <div className="native-spawn-status">{loading?'Loading source data…':failure?'Source unavailable':coverage.documented?'Source-backed spawn zones':'No documented zone for this selection'}</div>
  </div>
  <div className="native-spawn-filter">
   <label htmlFor="spawn-display-mode"><Layers3 size={16}/> Spawn display</label>
   <select id="spawn-display-mode" value={mode} onChange={e=>{setMode(e.target.value);setTier('all');}}><option value="documented">Documented locations (likelihood unverified)</option><option value="weight">Relative entry weight (not encounter chance)</option></select>
   {mode==='weight'&&<> <label htmlFor="spawn-likelihood-layer">Relative weight filter</label>
   <select id="spawn-likelihood-layer" value={tier} onChange={e=>setTier(e.target.value)} aria-label="Spawn weighting layer">
    {spawnTierOptions.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}
   </select></>}
   <label className="native-spawn-legend-toggle"><input type="checkbox" checked={showLegend} onChange={e=>setShowLegend(e.target.checked)}/> Legend</label>
  </div>
  {showLegend&&<div className="native-spawn-legend" aria-label="Relative spawn weighting legend">
   {Object.entries(spawnTierColors).filter(([key])=>mode==='weight'?key!=='unverified':key==='unverified').map(([key,color])=><div key={key}><span className="native-spawn-swatch" style={{background:color}}/>{spawnTierNames[key]}{mode==='weight'?' weight':''}</div>)}
  </div>}
  {loading&&<div className="native-spawn-message" role="status">Loading published {effectiveMap} creature spawn tables and source geometry.</div>}
  {failure&&<div className="native-spawn-message" role="alert"><AlertTriangle size={17}/>{failure}</div>}
  {!loading&&!failure&&<div className="native-spawn-summary">
   {coverage.documented?<><CheckCircle2 size={17}/><span>{allCount.toLocaleString()} published habitat rectangle/point entries across {coverage.matched.join(', ')}. {tier==='all'?'All documented regions shown.':selection.count+' locations match the selected weight layer.'}</span></>
    :<><Info size={17}/><span>The published {effectiveMap} spawn tables do not document a region for <strong>{creature||'this creature'}</strong>. This is <b>unverified, not proof of absence</b>. No fake colored zones are drawn.</span></>}
  </div>}
  <IslandNativeMap key={effectiveMap} mapName={effectiveMap==='Genesis: Part 1 Ocean'?'Genesis: Part 1 Ocean':effectiveMap}
   terrainSrc={terrain} resourcePoints={EMPTY} resourceSource={EMPTY_SOURCE} enabledResources={EMPTY}
   spawnMode spawnRegions={selection.zones} spawnCreature={creature} spawnSource={bundle}/>
  {map==='Aberration'&&<p className="native-spawn-hint"><Layers3 size={15}/> Use <strong>Zone Focus</strong> on the map for All Zones, Green, Blue, or Red, and use the optional weight view to filter individual spawn-weight layers. Aberration biome boundaries are approximations because the world has overlapping vertical layers.</p>}
  <p className="native-spawn-hint"><Info size={15}/> Default gray outlines show documented habitat with unverified encounter likelihood. Optional colored weight view compares source-derived spawn-entry weights within a spawn container only. <strong>They are not percentages for encountering a creature or a global population heatmap.</strong> Actual spawns depend on container selection, server settings, mods, population limits and map updates. Every selectable tame is supported by the lookup; unsupported creature/map pairs are explicitly identified. {bundle&&<>Data revision: {bundle.revision}. {versions} documented species names on this map.</>}</p>
  {bundle?.source&&<p className="native-spawn-provenance">Spawn record source: <a href={bundle.source} target="_blank" rel="noopener noreferrer">ARK Official Community Wiki — {effectiveMap}</a> · {bundle.verifiedASA?'ASA-specific records':'Shared wiki records (ASA version not independently verified)'}</p>}
 </section>;
}
