import TameSpawnAtlas from './TameSpawnAtlas.jsx';
import React,{useEffect,useMemo,useState} from 'react';
import {ExternalLink,Timer} from 'lucide-react';
import {maps} from './data.js';
import CreatureLineArt from './CreatureLineArt.jsx';
import {hasDetailedOutline} from './IndividualCreatureLineArt.jsx';
import './taming-lab-art.css';
import {passiveProfiles,passiveFoodPlan} from './passive-taming.js';
import {getTamingMethod} from './special-taming-methods.js';
import {vanillaTamesByMethod} from './vanilla-tame-picker.js';
const passiveRoster=vanillaTamesByMethod.passive;
import {wikiFoodOptions} from './taming-engine.js';

const fmt=new Intl.NumberFormat('en-US');
const timeText=s=>s>=3600?`${Math.floor(s/3600)}h ${Math.round(s%3600/60)}m`:`${Math.max(1,Math.round(s/60))}m`;
export default function PassiveLab({rates,onTimer,selectedCreature,artPreview=null}){
 const [creature,setCreature]=useState(()=>passiveRoster.includes(selectedCreature)?selectedCreature:passiveRoster.includes('Ovis')?'Ovis':passiveRoster[0]);
 useEffect(()=>{if(passiveRoster.includes(selectedCreature))setCreature(selectedCreature)},[selectedCreature]);
 const [search,setSearch]=useState('');
 const [level,setLevel]=useState(150);
 const [map,setMap]=useState('The Island');
 const [food,setFood]=useState('');
 const [foodCount,setFoodCount]=useState('');
 const [minutes,setMinutes]=useState('');
 const matches=useMemo(()=>passiveRoster.filter(name=>name.toLowerCase().includes(search.toLowerCase())),[search]);
 const entry=passiveProfiles[creature];
 const foods=wikiFoodOptions(creature).length?wikiFoodOptions(creature):entry?.food||[];
 const selectedFood=foods.includes(food)?food:(foods[0]||'');
 const plan=passiveFoodPlan({creature,level,food:selectedFood,tamingRate:rates.taming,foodDrainRate:rates.food});
 const displayedCount=plan.ok?plan.pieces:foodCount;
 const duration=plan.ok&&plan.seconds>0?plan.seconds/60:Number(minutes);
 const canTimer=Number.isFinite(duration)&&duration>0;
 const method=getTamingMethod(creature);
 return <>
  <div className="pagetitle taming-compact-title">
   <span className="eyebrow">FIELD OPERATIONS / PASSIVE</span>
   <h1>Passive Taming Lab</h1>
   <p>All {passiveRoster.length} official passive tames and forms. The creature sketch, loadout, and feeding planner share the same layout as the Knockout Taming Lab; no tranquilizers are used here.</p>
  </div>
  <div className="taming-workspace">
   <section className="panel taming-combined-panel" aria-label="Passive creature loadout and tame plan">
    <div className="panelhead"><h2>Loadout &amp; Sources</h2><span className="badge gold">PASSIVE FEEDING</span></div>
    <div className="taming-picker-bar">
     <label className="field taming-search-field"><span>Search all passive creatures and variants</span><input placeholder="Ovis, Manta, Equus, Arthropluera..." value={search} onChange={e=>setSearch(e.target.value)}/></label>
     <label className="field taming-creature-field"><span>Creature ({matches.length} matches)</span><select value={matches.includes(creature)?creature:''} onChange={e=>{setCreature(e.target.value);setFood('');setMinutes('');setFoodCount('');}}>{!matches.includes(creature)&&<option value="">Select a creature</option>}{matches.map(name=><option key={name} value={name}>{name}</option>)}</select></label>
    </div>
    <div className="taming-plan-layout">
     <div className="taming-visual-column">
      <div className="taming-art-stage" aria-label={creature+' creature field sketch'}>
       <span className="taming-art-caption">CREATURE FIELD SKETCH <strong>{creature.toUpperCase()}</strong></span>
       <CreatureLineArt creature={creature} previewArchelon={artPreview==='archelon'} previewArthropluera={artPreview==='arthropluera'}/>
       <span className="taming-art-status">{hasDetailedOutline(creature)?'SPECIES LINE ART':'ANATOMY STUDY'}</span>
      </div>
      <div className="taming-creature-meta"><span><strong>LEVEL</strong> {level||'—'}</span><span><strong>MAP</strong> {map}</span><span><strong>TYPE</strong> Passive</span></div>
     </div>
     <div className="taming-plan-content">
      <div className="taming-small-title"><h3>Plan a Feed</h3><small>{rates.taming}× TAMING</small></div>
      <div className="taming-compact-fields">
       <label className="field"><span>Wild Level</span><input type="number" min="1" max="1000" value={level} onChange={e=>setLevel(e.target.value)}/></label>
       <label className="field"><span>Map</span><select value={map} onChange={e=>setMap(e.target.value)}>{maps.map(name=><option key={name}>{name}</option>)}</select></label>
       <label className="field taming-field-wide"><span>Food or interaction</span><select value={selectedFood} disabled={!foods.length} onChange={e=>setFood(e.target.value)}>{foods.length?foods.map(name=><option key={name} value={name}>{name}</option>):<option value="">Species-specific verification needed</option>}</select></label>
      </div>
      {plan.ok?<div className="taming-estimate-cards"><div><span>FOOD REQUIRED</span><strong>{fmt.format(plan.pieces)}</strong><small>{selectedFood}</small></div><div><span>{plan.seconds===0?'FEEDING':'HUNGER DURATION'}</span><strong>{plan.seconds===0?'One feed':timeText(plan.seconds)}</strong><small>{rates.taming}× profile</small></div></div>:<div className="taming-method-callout"><strong>METHOD NEEDS VERIFICATION</strong><p>{plan.reason}</p></div>}
     </div>
    </div>
    <div className="taming-plan-notes">
     <div className="taming-note-heading"><strong>Plan Notes</strong><span>FIELD GUIDANCE</span></div>
     <p>{entry?.notes||method?.instructions||'Follow the creature-specific passive taming interaction.'}</p>
     {plan.approximate&&<small>Food affinity gives an estimate. Feeding intervals, approach conditions, and interaction bonuses can change the real duration; verify prompts on your cluster.</small>}
    </div>
    <div className="taming-compact-links">
     <a href={method?.source||'https://ark.wiki.gg/wiki/'+encodeURIComponent(creature.replaceAll(' ','_'))} target="_blank" rel="noreferrer">Species Wiki <ExternalLink size={14}/></a>
     <span>PASSIVE · NO TRANQS</span>
    </div>
   </section>
   <section className="panel taming-sibling-panel" aria-label="Passive feeding planner">
    <div className="panelhead"><h2>Passive Feeding Planner</h2><span className="badge gold">NO TRANQS</span></div>
    <div className="taming-ko-headline">
     <div><span>FOOD REQUIRED</span><strong>{plan.ok?fmt.format(plan.pieces):displayedCount||'—'}</strong><small>{selectedFood||'Pending verification'}</small></div>
     <div><span>{plan.ok&&plan.seconds===0?'ONE FEED':'ESTIMATED FEED TIME'}</span><strong>{plan.ok?(plan.seconds===0?'1 Feed':timeText(plan.seconds)):Number(minutes)>0?timeText(Number(minutes)*60):'—'}</strong><small>{rates.taming}× taming · {rates.food}× food drain</small></div>
    </div>
    <div className="taming-method-visual"><h3>{method?.type||'Passive feeding'}</h3><p>{entry?.notes||method?.instructions||'Approach and interact with the wild creature without tranquilizing it.'}</p></div>
    {plan.approximate&&<div className="taming-ko-unverified">Published affinity provides a food estimate. Passive intervals and interaction bonuses can change the duration. Confirm the next feeding prompt on your server.</div>}
    {!plan.ok&&<div className="taming-ko-unverified">{plan.reason}</div>}
    {!plan.ok&&<label className="field"><span>Verified food count (optional)</span><input type="number" min="1" value={foodCount} onChange={e=>setFoodCount(e.target.value)} placeholder="Verified on your cluster"/></label>}
    {(!plan.ok||plan.seconds===0)&&<label className="field"><span>Verified duration or next feed reminder (minutes)</span><input type="number" min="0.1" step="0.1" placeholder="Manual timer" value={minutes} onChange={e=>setMinutes(e.target.value)}/></label>}
    <button className="primary taming-start-btn" disabled={!canTimer} onClick={()=>onTimer(creature+' passive Lv '+level+' · '+map,duration,'Passive Taming')}>Start Passive Timer <Timer size={16}/></button>
    <div className="taming-plan-notes"><div className="taming-note-heading"><strong>Method &amp; Data</strong><span>PASSIVE</span></div><p>Food estimate: {plan.ok?(plan.approximate?'Wiki affinity baseline':'Reviewed fixed quantity'):'Awaiting verified data'}. The tame timer uses the species-specific estimate where available; otherwise it uses your verified minutes.</p></div>
    <a className="taming-ko-source" target="_blank" rel="noreferrer" href={method?.source||'https://ark.wiki.gg/wiki/'+encodeURIComponent(creature.replaceAll(' ','_'))}>Read species method <ExternalLink size={14}/></a>
   </section>
  </div>
  <TameSpawnAtlas creature={creature} map={map}/>
 </>;
}
