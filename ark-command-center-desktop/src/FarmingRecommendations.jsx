import React from 'react';
import {Pickaxe,MapPin,ArrowRight,ExternalLink,Route} from 'lucide-react';
import {farmingGuide,farmingMapOptions,farmingResourceNames} from './farming-recommendations.js';
import {vanillaTamesByMethod,vanillaKnockoutRoster} from './vanilla-tame-picker.js';
import './farming-recommendations.css';
function creaturePage(name){if(vanillaTamesByMethod.specialty.includes(name))return 'specialty';if(vanillaTamesByMethod.passive.includes(name))return 'passive';if(vanillaKnockoutRoster.includes(name))return 'taming';return null;}
export default function FarmingRecommendations({resource,onResource,map,coverage,onMap,onCreature,onRoute}){
 const guide=farmingGuide(resource),options=farmingMapOptions(resource,coverage);
 const names=[...new Set([...farmingResourceNames,...Object.values(coverage).flat(),resource])].sort();
 const current=options.find(x=>x.map===map);
 return <section className="panel farming-guide" aria-label="Farming recommendations">
 <div className="atlas-native-head"><h2><Pickaxe size={18}/> Farming Recommendations</h2><span className="atlas-native-chip">GATHERING GUIDE</span></div>
 <label className="field"><span>RESOURCE TO FARM</span><select aria-label="Resource to farm" value={resource} onChange={e=>onResource(e.target.value)}>{names.map(n=><option key={n}>{n}</option>)}</select></label>
 {guide?<><div className="farm-guide-tool"><span>Recommended tool / method</span><strong>{guide.tools}</strong></div>
 {guide.creatures.length>0&&<div className="farm-guide-creatures"><h3>Recommended creatures</h3>{guide.creatures.map(c=>{const page=creaturePage(c.name);return <div className="farm-guide-creature" key={c.name}><div><strong>{c.name}</strong><small>{c.role}</small></div>{page&&onCreature&&<button type="button" className="ghost" aria-label={'Open '+c.name+' tame planner'} onClick={()=>onCreature(page,c.name)}><ArrowRight size={15}/></button>}</div>;})}</div>}
 <p className="farm-guide-tip">{guide.tip}</p><a className="farm-guide-source" href={guide.source} target="_blank" rel="noopener noreferrer"><ExternalLink size={13}/> Gathering reference</a></>:<p className="atlas-v3-hint">No reviewed harvesting recommendation yet. Use the documented map layer below.</p>}
 <div className="farm-guide-maps"><h3>Maps with published locations</h3>{options.length?<div className="farm-guide-maplist">{options.map(x=><button key={x.map} type="button" className={'ghost'+(x.map===map?' farm-current-map':'')} onClick={()=>onMap(x.map,x.layers)}><MapPin size={14}/>{x.map}</button>)}</div>:<p className="atlas-v3-hint">No published GPS layer in this atlas. The gathering advice above does not imply mapped coordinates.</p>}
 {current&&<button type="button" className="primary farm-route" onClick={()=>onRoute(current.layers)}><Route size={16}/> Plan farming route</button>}</div>
 <p className="atlas-v3-hint">Suggestions depend on node type, access, creature availability and server rules. Maps are shown by documented coverage, not ranked by unmeasured yield.</p></section>;
}
