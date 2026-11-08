import React,{useMemo,useState} from 'react';
import {ExternalLink,Timer} from 'lucide-react';
import {maps} from './data.js';
import {passiveProfiles,passiveFoodPlan} from './passive-taming.js';
import {passiveRoster,getTamingMethod} from './special-taming-methods.js';
import {wikiFoodOptions} from './taming-engine.js';
import CreaturePortrait from './CreaturePortrait.jsx';

const fmt=new Intl.NumberFormat('en-US');
const timeText=s=>s>=3600?`${Math.floor(s/3600)}h ${Math.round(s%3600/60)}m`:`${Math.max(1,Math.round(s/60))}m`;
export default function PassiveLab({rates,onTimer}){
 const [creature,setCreature]=useState(passiveRoster.includes('Ovis')?'Ovis':passiveRoster[0]);
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
  <div className="pagetitle"><span className="eyebrow">FIELD OPERATIONS / PASSIVE</span><h1>Passive Taming Lab</h1><p>{passiveRoster.length} passive tames and forms only. Pick an eligible food, see published food estimates when available, and track feeding reminders without any tranq tables.</p></div>
  <div className="two wideleft">
   <section className="panel"><div className="panelhead"><h2>Passive Feeding Planner</h2><span className="badge gold">{rates.taming}× PROFILE</span></div>
    <label className="field"><span>Search passive creatures</span><input placeholder="Ovis, Manta, Equus..." value={search} onChange={e=>setSearch(e.target.value)}/></label>
    <div className="formgrid">
     <label className="field"><span>Creature ({matches.length})</span><select value={matches.includes(creature)?creature:''} onChange={e=>{setCreature(e.target.value);setFood('');setMinutes('');setFoodCount('');}}>{!matches.includes(creature)&&<option value="">Choose creature</option>}{matches.map(name=><option key={name}>{name}</option>)}</select></label>
     <label className="field"><span>Wild level</span><input type="number" min="1" max="1000" value={level} onChange={e=>setLevel(e.target.value)}/></label>
     <label className="field"><span>Map</span><select value={map} onChange={e=>setMap(e.target.value)}>{maps.map(name=><option key={name}>{name}</option>)}</select></label>
     <label className="field"><span>Food or interaction</span><select value={selectedFood} disabled={!foods.length} onChange={e=>setFood(e.target.value)}>{foods.length?foods.map(name=><option key={name}>{name}</option>):<option value="">Species-specific verification needed</option>}</select></label>
    </div>
    {plan.ok&&<div className="tame-results"><div><span>ESTIMATED FOOD REQUIRED</span><strong>{fmt.format(plan.pieces)} <small>{selectedFood}</small></strong></div><div><span>{plan.seconds===0?'FEEDING':'THEORETICAL HUNGER DURATION'}</span><strong>{plan.seconds===0?'One feed':timeText(plan.seconds)}</strong></div></div>}
    {plan.approximate&&<div className="notice">Published food affinity provides a quantity estimate. Passive intervals, approach conditions and interaction bonuses can change the real time substantially. Verify the active cluster's creature food-drain multiplier against your next feeding prompt.</div>}
    {!plan.ok&&<div className="notice">{plan.reason}</div>}
    <div className="notice">{entry?.notes||method?.instructions||'Follow the creature-specific passive taming interaction.'}</div>
    {!plan.ok&&<label className="field"><span>Verified food count (optional)</span><input type="number" min="1" value={foodCount} onChange={e=>setFoodCount(e.target.value)} placeholder="Verified on your cluster"/></label>}
    {(!plan.ok||plan.seconds===0)&&<label className="field"><span>Verified duration or next feeding reminder (minutes)</span><input type="number" min="0.1" step="0.1" placeholder="Manual timer" value={minutes} onChange={e=>setMinutes(e.target.value)}/></label>}
    <div className="actionrow"><button className="primary" disabled={!canTimer} onClick={()=>onTimer(`${creature} passive Lv ${level} · ${map}`,duration,'Passive Taming')}>Start Passive Timer <Timer size={16}/></button><a className="ghost linkbtn" target="_blank" rel="noreferrer" href={method?.source||`https://ark.wiki.gg/wiki/${encodeURIComponent(creature.replaceAll(' ','_'))}`}>Species guide <ExternalLink size={15}/></a></div>
   </section>
   <section className="panel"><div className="panelhead"><h2>Passive Loadout</h2><span className="badge">NO TRANQS</span></div><CreaturePortrait creature={creature}/>
    <div className="keyrow"><span>Species</span><strong>{creature}</strong></div>
    <div className="keyrow"><span>Method</span><strong>{method?.type||'Passive feeding'}</strong></div>
    <div className="keyrow"><span>Selected food</span><strong>{selectedFood||'Needs individual review'}</strong></div>
    <div className="keyrow"><span>Food count</span><strong>{displayedCount||'Not verified'}</strong></div>
    <div className="keyrow"><span>Food estimate source</span><strong>{plan.ok?(plan.approximate?'Wiki baseline':'Reviewed fixed amount'):'Awaiting creature data'}</strong></div>
    <div className="keyrow"><span>Taming rate</span><strong>{rates.taming}×</strong></div>
    <div className="notice">Passive taming includes moving, waiting for prompts, and sometimes multiple feeding choices. Numeric estimates do not guarantee the next feeding interval or total duration.</div>
   </section>
  </div>
 </>;
}
