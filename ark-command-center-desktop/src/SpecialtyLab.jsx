import React,{useMemo,useState} from 'react';
import {ExternalLink,Timer} from 'lucide-react';
import {maps} from './data.js';
import {specialtyRoster,getTamingMethod} from './special-taming-methods.js';
import {specialtyAmmoOptions,estimateSpecialtyKnockout,specialtyFeeding,specialtyFoodOptions,specialtyFixedSupply} from './specialty-engine.js';

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
 const fixedSupply=specialtyFixedSupply(creature);
 const estimatedMinutes=feeding.ok&&Number.isFinite(feeding.minutes)?feeding.minutes:Number(minutes);
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
     {foodChoices.length>0&&<label className="field"><span>{method?.quantityModel==='octopus-biotoxin'?'Bite-phase knockout item':method?.quantityModel==='bloodstalker'?'Grab-taming supply':method?.type==='Heavy knockout'?'Post-knockout food':'Specialty feeding / offering'}</span><select value={activeFood} onChange={e=>setFood(e.target.value)}>{foodChoices.map(item=><option key={item}>{item}</option>)}</select></label>}
    </div>
    {knockout.ok&&<div className="tame-results"><div><span>ESTIMATED HEAVY AMMO</span><strong>{fmt.format(knockout.amount)} <small>{knockout.ammo}</small></strong></div><div><span>TARGET TORPOR</span><strong>{fmt.format(knockout.totalTorpor)}</strong></div></div>}
    {knockout.ok&&<div className="notice">{knockout.caveat}</div>}
    {foodChoices.length>0&&feeding.ok?<><div className="tame-results"><div><span>{feeding.model==='octopus-biotoxin'?'MINIMUM SUCCESSFUL BITE FEEDS':feeding.model==='bloodstalker'?'BASELINE BLOOD PACK ESTIMATE':'ESTIMATED FOOD / OFFERINGS'}</span><strong>{fmt.format(feeding.foodPieces)} <small>{activeFood}</small></strong></div><div><span>{feeding.model==='bloodstalker'?'RECOMMENDED PACK SUPPLY':feeding.model==='octopus-biotoxin'?'BITE-INTERVAL TIME ONLY':'THEORETICAL FOOD-DRAIN TIME'}</span><strong>{feeding.model==='bloodstalker'?`${fmt.format(feeding.bufferPieces)} packs`:feeding.model==='octopus-biotoxin'?`${period(feeding.minBiteSeconds)}–${period(feeding.maxBiteSeconds)}`:period(feeding.seconds)}</strong></div></div><div className="notice">{feeding.caveat||'Wiki-based feeding estimate. Special interactions and cooldowns can extend the total duration.'}</div></>:null}
    {foodChoices.length>0&&!feeding.ok&&<div className="notice">{feeding.reason} Select a food or offering to see its documented interaction. A numerical count is shown only when we have a species-specific estimate.</div>}
    {fixedSupply&&<div className="tame-results"><div><span>FIXED REQUIRED SUPPLY</span><strong>{fixedSupply.amount} <small>{fixedSupply.item}</small></strong></div></div>}
    {fixedSupply&&<div className="notice">{fixedSupply.caveat}</div>}
    {method?.status==='unreleased'&&<div className="notice"><strong>Not available in the current game:</strong> this is an announced creature, not a live taming method. No item count or timer is offered.</div>}
    {method?.status==='unavailable'&&<div className="notice"><strong>Not an ordinary tame:</strong> event-only or otherwise unavailable to tame permanently on normal official rules.</div>}
    {method?.postKnockoutFoods?.length>0&&<div className="notice"><strong>After knockout:</strong> feed {method.postKnockoutFoods.join(', ')}. These are not the Bio Toxin used to cause unconsciousness; a validated post-knockout food count is not available.</div>}
    {method?.items?.length>0&&<div className="notice"><strong>Required specialty items:</strong> {method.items.join(' · ')}. {method.instructions}</div>}
    {!method?.items?.length&&<div className="notice">{method?.instructions||'This specialty method still needs individual verification.'}</div>}
    {method?.status==='documented'&&!knockout.ok&&(!feeding.ok||!Number.isFinite(feeding.minutes))&&<div className="formgrid"><label className="field"><span>Your observed item count (optional)</span><input type="number" min="1" placeholder="Manual, not auto-verified" value={manualCount} onChange={e=>setManualCount(e.target.value)}/></label><label className="field"><span>Your observed total duration (minutes)</span><input type="number" min="0.1" step="0.1" placeholder="Manual timer" value={minutes} onChange={e=>setMinutes(e.target.value)}/></label></div>}
    <div className="actionrow"><a className="ghost linkbtn" target="_blank" rel="noreferrer" href={wiki}>Read species method <ExternalLink size={15}/></a><button className="primary" disabled={!canTimer} onClick={()=>onTimer(`${creature} Lv ${level} · ${map}`,estimatedMinutes,'Specialty Tame')}>Start Timer <Timer size={16}/></button></div>
   </section>
   <section className="panel"><div className="panelhead"><h2>Specialty Loadout</h2><span className={`badge ${method?.status==='documented'?'green':'gold'}`}>{method?.type||'Review needed'}</span></div>
    <div className="featureart">🦀</div>
    <div className="keyrow"><span>Creature</span><strong>{creature}</strong></div>
    <div className="keyrow"><span>Level</span><strong>{level}</strong></div>
    {method?.items?.map(item=><div className="keyrow" key={item}><span>Allowed item / method</span><strong>{item}</strong></div>)}
    {manualCount&&Number(manualCount)>0&&<div className="keyrow"><span>Your manual supply count</span><strong>{manualCount}</strong></div>}
    <div className="keyrow"><span>Method status</span><strong>{method?.status==='documented'?'Wiki-documented (not in-game certified)':method?.status==='unreleased'?'Announced / unreleased':method?.status==='unavailable'?'Unavailable as ordinary tame':'Review needed'}</strong></div>
    <div className="keyrow"><span>Heavy-weapon math</span><strong>{knockout.ok?'Available':'Not applicable / unverified'}</strong></div>
    <div className="keyrow"><span>Supply count model</span><strong>{feeding.model==='bloodstalker'?'Published blood-pack estimate':feeding.model==='octopus-biotoxin'?'Minimum Bio Toxin hits':feeding.ok?'Wiki food-affinity baseline':fixedSupply?'One item per new tame':'Interaction-specific / not quantified'}</strong></div>
    <div className="keyrow"><span>Taming rate</span><strong>{rates.taming}×</strong></div>
    <div className="notice">Methods are reviewed against the official community wiki, not certified in-game for NomadARK. Its 10× taming rate does not automatically divide egg counts, minigame actions, torpor effects or sacrifices. Treat unspecified quantities as unknown, not zero.</div>
   </section>
  </div>
 </>;
}
