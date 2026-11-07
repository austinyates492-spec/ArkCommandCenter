import React,{useMemo,useState} from 'react';
import {ExternalLink,Timer} from 'lucide-react';
import {maps} from './data.js';
import {specialtyRoster,getTamingMethod} from './special-taming-methods.js';
import {specialtyAmmoOptions,estimateSpecialtyKnockout,specialtyFeeding,specialtyFoodOptions} from './specialty-engine.js';

const fmt=new Intl.NumberFormat('en-US');
function period(seconds){const m=Math.round(seconds/60);return m>=60?`${Math.floor(m/60)}h ${m%60}m`:`${m}m`;}

export default function SpecialtyLab({rates,onTimer}){
 const [creature,setCreature]=useState(specialtyRoster.includes('Karkinos')?'Karkinos':specialtyRoster[0]);
 const [query,setQuery]=useState('');
 const [level,setLevel]=useState(150);
 const [map,setMap]=useState('Aberration');
 const [ammo,setAmmo]=useState('');
 const [food,setFood]=useState('');
 const [minutes,setMinutes]=useState('');
 const [manualCount,setManualCount]=useState('');
 const matches=useMemo(()=>specialtyRoster.filter(name=>name.toLowerCase().includes(query.toLowerCase())),[query]);
 const method=getTamingMethod(creature);
 const ammoChoices=specialtyAmmoOptions(creature);
 const activeAmmo=ammoChoices.some(item=>item.label===ammo)?ammo:(ammoChoices[0]?.label||'');
 const knockout=estimateSpecialtyKnockout({creature,level,ammo:activeAmmo});
 const foodChoices=specialtyFoodOptions(creature);
 const activeFood=foodChoices.includes(food)?food:(foodChoices[0]||'');
 const feeding=specialtyFeeding({creature,level,food:activeFood,tamingRate:rates.taming,foodDrainRate:rates.food});
 const estimatedMinutes=feeding.ok?feeding.minutes:Number(minutes);
 const canTimer=Number.isFinite(estimatedMinutes)&&estimatedMinutes>0;
 const wiki=method?.source||`https://ark.wiki.gg/wiki/${encodeURIComponent(creature.replaceAll(' ','_'))}`;
 return <>
  <div className="pagetitle"><span className="eyebrow">FIELD OPERATIONS / SPECIAL</span><h1>Specialty Taming Lab</h1><p>{specialtyRoster.length} specialty species and forms. Heavy weapons, egg theft, trust mechanics, pheromones and unusual food interactions—separate from tranquilizers and ordinary passive feeds.</p></div>
  <div className="two wideleft">
   <section className="panel"><div className="panelhead"><h2>Specialty Tame Planner</h2><span className="badge gold">{rates.taming}× TAMING</span></div>
    <label className="field"><span>Search specialty creatures</span><input value={query} placeholder="Karkinos, Basilisk, Rhyniognatha..." onChange={e=>setQuery(e.target.value)}/></label>
    <div className="formgrid">
     <label className="field"><span>Creature ({matches.length})</span><select value={matches.includes(creature)?creature:''} onChange={e=>{setCreature(e.target.value);setAmmo('');setFood('');setManualCount('');setMinutes('');}}>{!matches.includes(creature)&&<option value="">Choose creature</option>}{matches.map(name=><option key={name}>{name}</option>)}</select></label>
     <label className="field"><span>Wild level</span><input type="number" min="1" max="1000" value={level} onChange={e=>setLevel(e.target.value)}/></label>
     <label className="field"><span>Map</span><select value={map} onChange={e=>setMap(e.target.value)}>{maps.map(name=><option key={name}>{name}</option>)}</select></label>
     {ammoChoices.length>0&&<label className="field"><span>Specialty knockout ammunition</span><select value={activeAmmo} onChange={e=>setAmmo(e.target.value)}>{ammoChoices.map(item=><option key={item.label}>{item.label}</option>)}</select></label>}
     {foodChoices.length>0&&<label className="field"><span>{method?.type==='Heavy knockout'?'Post-knockout food':'Specialty feeding / offering'}</span><select value={activeFood} onChange={e=>setFood(e.target.value)}>{foodChoices.map(item=><option key={item}>{item}</option>)}</select></label>}
    </div>
    {knockout.ok&&<div className="tame-results"><div><span>ESTIMATED HEAVY AMMO</span><strong>{fmt.format(knockout.amount)} <small>{knockout.ammo}</small></strong></div><div><span>TARGET TORPOR</span><strong>{fmt.format(knockout.totalTorpor)}</strong></div></div>}
    {knockout.ok&&<div className="notice">{knockout.caveat}</div>}
    {foodChoices.length>0&&feeding.ok?<div className="tame-results"><div><span>ESTIMATED FOOD / OFFERINGS</span><strong>{fmt.format(feeding.foodPieces)} <small>{activeFood}</small></strong></div><div><span>THEORETICAL FOOD-DRAIN TIME</span><strong>{period(feeding.seconds)}</strong></div></div>:null}
    {foodChoices.length>0&&feeding.ok&&method?.type!=='Heavy knockout'&&<div className="notice">Item counts use the wiki's species affinity model. Special feeding intervals, egg pickup behavior, cooldowns and interaction steps are not included in the estimated time.</div>}
    {foodChoices.length>0&&!feeding.ok&&<div className="notice">Food quantities require a verified recipe for this special interaction.</div>}
    {method?.items?.length>0&&<div className="notice"><strong>Required specialty items:</strong> {method.items.join(' · ')}. {method.instructions}</div>}
    {!method?.items?.length&&<div className="notice">{method?.instructions||'This specialty method still needs individual verification.'}</div>}
    {!knockout.ok&&!feeding.ok&&<div className="formgrid"><label className="field"><span>Verified specialty item count (optional)</span><input type="number" min="1" placeholder="Only if verified" value={manualCount} onChange={e=>setManualCount(e.target.value)}/></label><label className="field"><span>Verified tame duration (minutes)</span><input type="number" min="0.1" step="0.1" placeholder="Manual timer" value={minutes} onChange={e=>setMinutes(e.target.value)}/></label></div>}
    <div className="actionrow"><a className="ghost linkbtn" target="_blank" rel="noreferrer" href={wiki}>Read species method <ExternalLink size={15}/></a><button className="primary" disabled={!canTimer} onClick={()=>onTimer(`${creature} Lv ${level} · ${map}`,estimatedMinutes,'Specialty Tame')}>Start Timer <Timer size={16}/></button></div>
   </section>
   <section className="panel"><div className="panelhead"><h2>Specialty Loadout</h2><span className={`badge ${method?.status==='documented'?'green':'gold'}`}>{method?.type||'Review needed'}</span></div>
    <div className="featureart">🦀</div>
    <div className="keyrow"><span>Creature</span><strong>{creature}</strong></div>
    <div className="keyrow"><span>Level</span><strong>{level}</strong></div>
    {method?.items?.map(item=><div className="keyrow" key={item}><span>Allowed item / method</span><strong>{item}</strong></div>)}
    <div className="keyrow"><span>Heavy-weapon math</span><strong>{knockout.ok?'Available':'Not applicable / unverified'}</strong></div>
    <div className="keyrow"><span>Food count model</span><strong>{feeding.ok?'Wiki baseline':'Interaction-specific / unverified'}</strong></div>
    <div className="keyrow"><span>Taming rate</span><strong>{rates.taming}×</strong></div>
    <div className="notice">For non-heavy specialty methods (eggs, pheromones and trust), no numerical item count is shown until the species-specific mechanics have been validated. The 10× rate does not automatically divide every specialty requirement.</div>
   </section>
  </div>
 </>;
}
