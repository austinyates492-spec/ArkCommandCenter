import TameSpawnAtlas from './TameSpawnAtlas.jsx';
import React,{useEffect,useMemo,useState} from 'react';
import {ExternalLink,Timer} from 'lucide-react';
import {maps} from './data.js';
import CreatureLineArt from './CreatureLineArt.jsx';
import {hasDetailedOutline} from './IndividualCreatureLineArt.jsx';
import './taming-lab-art.css';
import {getTamingMethod} from './special-taming-methods.js';
import {vanillaTamesByMethod} from './vanilla-tame-picker.js';
const specialtyRoster=vanillaTamesByMethod.specialty;
import {specialtyAmmoOptions,estimateSpecialtyKnockout,specialtyFeeding,specialtyFoodOptions,specialtyFixedSupply} from './specialty-engine.js';

const fmt=new Intl.NumberFormat('en-US');
function period(seconds){const m=Math.round(seconds/60);return m>=60?`${Math.floor(m/60)}h ${m%60}m`:`${m}m`;}

export default function SpecialtyLab({rates,onTimer,selectedCreature,artPreview=null}){
 const [creature,setCreature]=useState(()=>specialtyRoster.includes(selectedCreature)?selectedCreature:specialtyRoster.includes('Karkinos')?'Karkinos':specialtyRoster[0]);
 useEffect(()=>{if(specialtyRoster.includes(selectedCreature))setCreature(selectedCreature)},[selectedCreature]);
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
  <div className="pagetitle taming-compact-title">
   <span className="eyebrow">FIELD OPERATIONS / SPECIALTY</span>
   <h1>Specialty Taming Lab</h1>
   <p>All {specialtyRoster.length} official specialty tames and forms. The same artwork-first layout as the Knockout Taming Lab, with creature-specific heavy weapons, trust, egg, and other nonstandard interactions.</p>
  </div>
  <div className="taming-workspace">
   <section className="panel taming-combined-panel" aria-label="Specialty creature loadout and tame plan">
    <div className="panelhead"><h2>Loadout &amp; Sources</h2><span className="badge gold">SPECIALTY METHOD</span></div>
    <div className="taming-picker-bar">
     <label className="field taming-search-field"><span>Search all specialty creatures and variants</span><input value={query} placeholder="Karkinos, Basilisk, Astrocetus..." onChange={e=>setQuery(e.target.value)}/></label>
     <label className="field taming-creature-field"><span>Creature ({matches.length} matches)</span><select value={matches.includes(creature)?creature:''} onChange={e=>{setCreature(e.target.value);setAmmo('');setFood('');setManualCount('');setMinutes('');}}>{!matches.includes(creature)&&<option value="">Select a creature</option>}{matches.map(name=><option key={name} value={name}>{name}</option>)}</select></label>
    </div>
    <div className="taming-plan-layout">
     <div className="taming-visual-column">
      <div className="taming-art-stage" aria-label={creature+' creature field sketch'}>
       <span className="taming-art-caption">CREATURE FIELD SKETCH <strong>{creature.toUpperCase()}</strong></span>
       <CreatureLineArt creature={creature} previewArmadoggo={artPreview==='armadoggo'} previewAstrocetus={artPreview==='astrocetus'} previewAureliax={artPreview==='aureliax'} previewBasilisk={artPreview==='basilisk'}/>
       <span className="taming-art-status">{(artPreview==='armadoggo'&&creature==='Armadoggo')||(artPreview==='aureliax'&&creature==='Aureliax')||(artPreview==='basilisk'&&creature==='Basilisk')?'REVIEW ONLY · NOT FINAL':hasDetailedOutline(creature)?'SPECIES LINE ART':'ANATOMY STUDY'}</span>
      </div>
      <div className="taming-creature-meta"><span><strong>LEVEL</strong> {level||'—'}</span><span><strong>MAP</strong> {map}</span><span><strong>TYPE</strong> Specialty</span></div>
     </div>
     <div className="taming-plan-content">
      <div className="taming-small-title"><h3>Plan a Tame</h3><small>{rates.taming}× TAMING</small></div>
      <div className="taming-compact-fields">
       <label className="field"><span>Wild Level</span><input type="number" min="1" max="1000" value={level} onChange={e=>setLevel(e.target.value)}/></label>
       <label className="field"><span>Map</span><select value={map} onChange={e=>setMap(e.target.value)}>{maps.map(name=><option key={name}>{name}</option>)}</select></label>
       {ammoChoices.length>0&&<label className="field taming-field-wide"><span>Specialty knockout ammunition</span><select value={activeAmmo} onChange={e=>setAmmo(e.target.value)}>{ammoChoices.map(item=><option key={item.label} value={item.label}>{item.label}</option>)}</select></label>}
       {foodChoices.length>0&&<label className="field taming-field-wide"><span>{method?.quantityModel==='octopus-biotoxin'?'Bite-phase knockout item':method?.quantityModel==='bloodstalker'?'Grab-taming supply':method?.type==='Heavy knockout'?'Post-knockout food':'Specialty feeding / offering'}</span><select value={activeFood} onChange={e=>setFood(e.target.value)}>{foodChoices.map(item=><option key={item} value={item}>{item}</option>)}</select></label>}
      </div>
      <div className="taming-method-callout taming-specialty-type"><strong>{method?.type||'METHOD REVIEW NEEDED'}</strong><p>{method?.items?.length?method.items.join(' · '):'Follow the verified species-specific interaction; ordinary tranquilizer estimates do not apply.'}</p></div>
     </div>
    </div>
    <div className="taming-plan-notes">
     <div className="taming-note-heading"><strong>Plan Notes</strong><span>FIELD GUIDANCE</span></div>
     <p>{method?.instructions||'This specialty method still needs individual verification.'}</p>
     <small>Only species-specific supplies can be estimated; server taming multipliers do not automatically scale egg counts, minigame actions, or sacrifices.</small>
    </div>
    <div className="taming-compact-links"><a href={wiki} target="_blank" rel="noreferrer">Species Wiki <ExternalLink size={14}/></a><span>SPECIALTY · NONSTANDARD TAME</span></div>
   </section>
   <section className="panel taming-sibling-panel" aria-label="Specialty taming planner">
    <div className="panelhead"><h2>Specialty Method Planner</h2><span className={'badge '+(method?.status==='documented'?'green':'gold')}>{method?.type||'Review Needed'}</span></div>
    {knockout.ok&&<div className="taming-ko-headline"><div><span>ESTIMATED HEAVY AMMO</span><strong>{fmt.format(knockout.amount)}</strong><small>{knockout.ammo}</small></div><div><span>TARGET TORPOR</span><strong>{fmt.format(knockout.totalTorpor)}</strong><small>Wild Lv {level}</small></div></div>}
    {knockout.ok&&<div className="taming-ko-unverified">{knockout.caveat}</div>}
    {foodChoices.length>0&&feeding.ok&&<><div className="taming-ko-headline"><div><span>{feeding.model==='octopus-biotoxin'?'MIN. BITE FEEDS':feeding.model==='bloodstalker'?'BLOOD PACKS':'ESTIMATED FOOD / OFFERINGS'}</span><strong>{fmt.format(feeding.foodPieces)}</strong><small>{activeFood}</small></div><div><span>{feeding.model==='bloodstalker'?'RECOMMENDED SUPPLY':feeding.model==='octopus-biotoxin'?'BITE INTERVAL':'THEORETICAL DURATION'}</span><strong>{feeding.model==='bloodstalker'?fmt.format(feeding.bufferPieces):feeding.model==='octopus-biotoxin'?period(feeding.minBiteSeconds)+'–'+period(feeding.maxBiteSeconds):period(feeding.seconds)}</strong><small>{feeding.model==='bloodstalker'?'Packs':feeding.model==='octopus-biotoxin'?'Interaction time':rates.taming+'× profile'}</small></div></div><div className="taming-plan-notes"><div className="taming-note-heading"><strong>Supply Caveat</strong></div><p>{feeding.caveat||'Food-affinity estimate; specialty interactions and cooldowns can extend the duration.'}</p></div></>}
    {foodChoices.length>0&&!feeding.ok&&<div className="taming-ko-unverified">{feeding.reason} Select a food or offering to see its documented interaction. A count is shown only when a species-specific estimate exists.</div>}
    {fixedSupply&&<div className="taming-estimate-cards"><div><span>FIXED REQUIRED SUPPLY</span><strong>{fixedSupply.amount}</strong><small>{fixedSupply.item}</small></div></div>}
    {fixedSupply&&<div className="taming-plan-notes"><div className="taming-note-heading"><strong>Fixed Supply Caveat</strong></div><p>{fixedSupply.caveat}</p></div>}
    {method?.status==='unreleased'&&<div className="taming-ko-unverified"><strong>Not available in the current game.</strong> Announced creature; no validated item count or timer is available.</div>}
    {method?.status==='unavailable'&&<div className="taming-ko-unverified"><strong>Not an ordinary tame:</strong> Event-only or otherwise unavailable for permanent taming on official rules.</div>}
    {method?.postKnockoutFoods?.length>0&&<div className="taming-plan-notes"><div className="taming-note-heading"><strong>After Knockout</strong></div><p>Feed {method.postKnockoutFoods.join(', ')}. This is distinct from knockout Bio Toxin; a validated post-knockout count is not available.</p></div>}
    {method?.items?.length>0&&<div className="taming-method-visual"><h3>Required Specialty Items</h3><p>{method.items.join(' · ')}. {method.instructions}</p></div>}
    {!method?.items?.length&&<div className="taming-method-visual"><h3>Method Guidance</h3><p>{method?.instructions||'This specialty method still needs individual verification.'}</p></div>}
    {method?.status==='documented'&&!knockout.ok&&(!feeding.ok||!Number.isFinite(feeding.minutes))&&<div className="taming-compact-fields"><label className="field"><span>Your observed item count (optional)</span><input type="number" min="1" placeholder="Manual, not auto-verified" value={manualCount} onChange={e=>setManualCount(e.target.value)}/></label><label className="field"><span>Your observed duration (minutes)</span><input type="number" min="0.1" step="0.1" placeholder="Manual timer" value={minutes} onChange={e=>setMinutes(e.target.value)}/></label></div>}
    {manualCount&&Number(manualCount)>0&&<div className="taming-plan-notes"><div className="taming-note-heading"><strong>Manual Supply</strong></div><p>{manualCount} items observed on your server (not auto-verified).</p></div>}
    <button className="primary taming-start-btn" disabled={!canTimer} onClick={()=>onTimer(creature+' Lv '+level+' · '+map,estimatedMinutes,'Specialty Tame')}>Start Timer <Timer size={16}/></button>
    <div className="taming-plan-notes"><div className="taming-note-heading"><strong>Calculation Notes</strong><span>{rates.taming}× TAMING</span></div><p>Heavy-weapon math: {knockout.ok?'Species-specific estimate available':'Not applicable or unverified'}. Supply count: {feeding.model==='bloodstalker'?'Published blood-pack baseline':feeding.model==='octopus-biotoxin'?'Minimum Bio Toxin hits':feeding.ok?'Food-affinity baseline':fixedSupply?'Known fixed supply':'Interaction-specific / unquantified'}. Treat unknown quantities as unknown, never zero.</p></div>
    <a className="taming-ko-source" href={wiki} target="_blank" rel="noreferrer">Read species method <ExternalLink size={14}/></a>
   </section>
  </div>
  <TameSpawnAtlas creature={creature} map={map}/>
 </>;
}
