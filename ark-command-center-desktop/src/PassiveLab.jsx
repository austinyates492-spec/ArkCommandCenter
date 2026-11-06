import React,{useState} from 'react';
import {ExternalLink,Timer} from 'lucide-react';
import {maps} from './data';
import {passiveProfiles,passiveFoodPlan} from './passive-taming';

export default function PassiveLab({rates,onTimer}){
 const [creature,setCreature]=useState('Ovis');
 const [level,setLevel]=useState(150);
 const [map,setMap]=useState('The Island');
 const [foodCount,setFoodCount]=useState('');
 const [minutes,setMinutes]=useState('');
 const entry=passiveProfiles[creature],plan=passiveFoodPlan({creature,level,tamingRate:rates.taming});
 const canTimer=Number(minutes)>0&&Number.isFinite(Number(minutes));
 return <>
  <div className="pagetitle"><span className="eyebrow">FIELD OPERATIONS / PASSIVE</span><h1>Passive Taming</h1><p>Non-violent tames, special food requests and feeding reminders. This is separate from knockout-taming math.</p></div>
  <div className="two wideleft"><section className="panel"><div className="panelhead"><h2>Passive Tame Planner</h2><span className="badge gold">{rates.taming}× PROFILE</span></div>
   <div className="formgrid"><label className="field"><span>Creature</span><select value={creature} onChange={e=>setCreature(e.target.value)}>{Object.keys(passiveProfiles).sort().map(name=><option key={name}>{name}</option>)}</select></label><label className="field"><span>Wild level</span><input type="number" min="1" value={level} onChange={e=>setLevel(e.target.value)}/></label><label className="field"><span>Map</span><select value={map} onChange={e=>setMap(e.target.value)}>{maps.map(name=><option key={name}>{name}</option>)}</select></label><label className="field"><span>Food / interaction</span><select>{entry.food.map(name=><option key={name}>{name}</option>)}</select></label></div>
   {plan.ok?<div className="tame-results"><div><span>FOOD REQUIRED</span><strong>{plan.pieces} <small>{plan.food}</small></strong></div><div><span>METHOD</span><strong>One feed</strong></div></div>:<div className="notice">{plan.reason}</div>}
   <div className="notice">{entry.notes}</div><div className="formgrid"><label className="field"><span>Verified food count (optional)</span><input type="number" min="1" placeholder="From Dododex" value={foodCount} onChange={e=>setFoodCount(e.target.value)}/></label><label className="field"><span>Feeding reminder / tame duration (minutes)</span><input type="number" min="0.1" step="0.1" placeholder="Verified time" value={minutes} onChange={e=>setMinutes(e.target.value)}/></label></div>
   <div className="actionrow"><button className="primary" disabled={!canTimer} onClick={()=>onTimer(`${creature} passive Lv ${level} · ${map}`,Number(minutes),'Passive Taming')}>Start Passive Timer <Timer size={16}/></button><a className="ghost linkbtn" target="_blank" rel="noreferrer" href={`https://www.dododex.com/taming/${encodeURIComponent(creature.toLowerCase().replaceAll(' ','-'))}`}>Verify Dododex <ExternalLink size={15}/></a></div>
  </section><section className="panel"><div className="panelhead"><h2>How It Works</h2><span className="badge">NON-VIOLENT</span></div><div className="milestone"><i>01</i><div><strong>Approach safely</strong><small>Most passive tames require food in your hotbar.</small></div></div><div className="milestone"><i>02</i><div><strong>Feed or interact</strong><small>Some species have unique riding, petting or food-request mechanics.</small></div></div><div className="milestone"><i>03</i><div><strong>Observe the next prompt</strong><small>Do not assume a fixed feeding interval without species-specific data.</small></div></div><div className="notice">Species methods are listed; only Ovis has a validated fixed food count. Other passive species need additional game-value profiles for automatic counts and accurate times.</div></section></div>
 </>;
}
