import TameSpawnAtlas from './TameSpawnAtlas.jsx';
import React,{useEffect,useMemo,useState} from 'react';
import {ExternalLink,Timer,Crosshair,ShieldCheck,Info,ChevronDown} from 'lucide-react';
import {maps} from './data';
import {vanillaKnockoutRoster} from './vanilla-tame-picker.js';
import {availableFoods,calculateTame,knockoutProfiles} from './taming-engine';
import {knockoutEstimate,knockoutSpecies} from './knockout-engine';
import {getTamingMethod,tamingCategory} from './special-taming-methods.js';
import {RexArtwork} from './RexDossier.jsx';
import CreatureLineArt from './CreatureLineArt.jsx';
import {hasDetailedOutline} from './IndividualCreatureLineArt.jsx';
import './taming-lab-art.css';

const numberFormat=new Intl.NumberFormat('en-US');
const duration=(seconds)=>{const h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=seconds%60;return [h?`${h}h`:null,m?`${m}m`:null,`${s}s`].filter(Boolean).join(' ')};

export default function TamingLab({rates,onTimer,onNavigate,clusterId='nomadark',initialCreature='Rex',artPreview=null}){
 const reviewCreature=artPreview==='ammonite'?'Ammonite':artPreview==='amarga'?'Amargasaurus':null;
 const [creature,setCreature]=useState(initialCreature);
 const category=tamingCategory(creature);
 const isKnockout=category==='knockout';
 const [creatureQuery,setCreatureQuery]=useState('');
 const [level,setLevel]=useState(150);
 const [food,setFood]=useState('Exceptional Kibble');
 const [map,setMap]=useState('The Island');
 const [manualFood,setManualFood]=useState('');
 const [manualMinutes,setManualMinutes]=useState('');
 const [weaponQuality,setWeaponQuality]=useState(100);
 const [longneckBuffPercent,setLongneckBuffPercent]=useState(300);
 const [targetTorpor,setTargetTorpor]=useState('');
 const foods=useMemo(()=>availableFoods(creature),[creature]);
 const special=getTamingMethod(creature);
 const matchingCreatures=useMemo(()=>(reviewCreature?[reviewCreature]:vanillaKnockoutRoster).filter(name=>name.toLowerCase().includes(creatureQuery.toLowerCase())),[creatureQuery,reviewCreature]);
 useEffect(()=>setLongneckBuffPercent(clusterId==='nomadark'?300:100),[clusterId]);
 useEffect(()=>{if(foods.length&&!foods.includes(food))setFood(foods[0]);},[foods,food]);
 const selectedFood=foods.includes(food)?food:(foods[0]||'');
 const result=isKnockout?calculateTame({creature,level,food:selectedFood,tamingRate:rates.taming,foodDrainRate:rates.food}):{ok:false,reason:'Use this creature’s dedicated taming method.'};
 const isManual=!!special||!result.ok;
 const finalMinutes=isManual?Number(manualMinutes):result.minutes;
 const canStart=isKnockout&&Number.isFinite(finalMinutes)&&finalMinutes>0;
 const knockout=isKnockout?knockoutEstimate({creature,level,weaponQuality,longneckBuffPercent,targetTorpor}):{ok:false,reason:'Ordinary tranquilizers are not used for this encounter.'};
 const bestAmmo=knockout.ok&&knockout.rows.length?knockout.rows.reduce((best,item)=>item.body<best.body?item:best):null;
 const maxBodyShots=knockout.ok?Math.max(1,...knockout.rows.map(item=>item.body)):1;
 const planNote=!isKnockout?(special?.instructions||'This species requires a dedicated taming method.'):special?special.instructions:result.ok?result.caveat:result.reason;
 const wikiUrl=`https://ark.wiki.gg/wiki/${encodeURIComponent(creature.replaceAll(' ','_'))}`;
 const dododexUrl=`https://www.dododex.com/taming/${encodeURIComponent(creature.toLowerCase().replaceAll(' ','-'))}`;
 return <>
  <div className="pagetitle taming-compact-title">
   <span className="eyebrow">FIELD OPERATIONS / 01</span>
   <h1>Taming Lab</h1>
   <p>All {vanillaKnockoutRoster.length} official ASA knockout tames and forms. Search the complete knockout roster; passive and specialty-only creatures have their own labs. Special knockout methods remain clearly labeled and never use ordinary tranq estimates.</p>
  </div>
  <div className="taming-workspace">
   <section className="panel taming-combined-panel" aria-label="Creature loadout and tame plan">
    <div className="panelhead"><h2>Loadout & Sources</h2><span className={'badge '+(!special&&result.ok?'green':'gold')}>{special?special.type:result.ok?'WIKI MODEL':'METHOD REVIEW'}</span></div>
    <div className="taming-picker-bar">
     <label className="field taming-search-field"><span>Search all knockout creatures and variants</span><input value={creatureQuery} onChange={e=>setCreatureQuery(e.target.value)} placeholder="Search Rex, Allosaurus, Giga, Tek, Aberrant..."/></label>
     <label className="field taming-creature-field"><span>Creature ({matchingCreatures.length} matches)</span><select value={matchingCreatures.includes(creature)?creature:''} onChange={e=>setCreature(e.target.value)}>{!matchingCreatures.includes(creature)&&<option value="">Select a creature</option>}{matchingCreatures.map(name=><option key={name} value={name}>{name}</option>)}</select></label>
    </div>
    <div className="taming-plan-layout">
     <div className="taming-visual-column">
      <div className={'taming-art-stage'+(creature==='Rex'?' taming-art-rex':'')} aria-label={creature+' creature field sketch'}>
       <span className="taming-art-caption">CREATURE FIELD SKETCH <strong>{creature.toUpperCase()}</strong></span>
       {creature==='Rex'?<RexArtwork/>:<CreatureLineArt creature={creature} previewAllo={artPreview==='allo'} previewAmarga={artPreview==='amarga'} previewAmmonite={artPreview==='ammonite'}/>}
       <span className="taming-art-status">{((artPreview==='amarga'&&creature==='Amargasaurus')||(artPreview==='ammonite'&&creature==='Ammonite'))?'REVIEW ONLY · NOT FINAL':creature==='Rex'||hasDetailedOutline(creature)?'SPECIES LINE ART':'ANATOMY STUDY'}</span>
      </div>
      <div className="taming-creature-meta"><span><strong>LEVEL</strong> {level||'—'}</span><span><strong>MAP</strong> {map}</span><span><strong>TYPE</strong> {category}</span></div>
     </div>
     <div className="taming-plan-content">
      <div className="taming-small-title"><h3>Plan a Tame</h3><small>{rates.taming}× TAMING</small></div>
      <div className="taming-compact-fields">
       <label className="field"><span>Wild Level</span><input type="number" min="1" max="1000" value={level} onChange={e=>setLevel(e.target.value)}/></label>
       <label className="field"><span>Map</span><select value={map} onChange={e=>setMap(e.target.value)}>{maps.map(name=><option key={name}>{name}</option>)}</select></label>
       {isKnockout&&!special&&<label className="field taming-field-wide"><span>Food</span><select value={selectedFood} disabled={!foods.length} onChange={e=>setFood(e.target.value)}>{foods.length?foods.map(name=><option key={name}>{name}</option>):<option value="">Manual verification required</option>}</select></label>}
      </div>
      {!isKnockout?<div className="taming-method-callout"><strong>{category.toUpperCase()} METHOD</strong><p>{category==='untameable'?'Not an ordinary tame. No taming timer or tranquilizer estimate is available.':'This creature uses a different taming process, so standard food and tranquilizer counts are hidden.'}</p>{category!=='untameable'&&<button className="primary" type="button" onClick={()=>onNavigate?.(category==='passive'?'passive':'specialty',creature)}>Open {category==='passive'?'Passive':'Specialty'} Planner</button>}</div>:special?<div className="taming-manual-input"><p>{special.type}: {special.instructions}</p>{special.status!=='untameable'&&<label className="field"><span>Verified time (minutes)</span><input type="number" min="0.1" step="0.1" value={manualMinutes} onChange={e=>setManualMinutes(e.target.value)} placeholder="Optional manual timer"/></label>}</div>:result.ok?<div className="taming-estimate-cards"><div><span>FOOD REQUIRED</span><strong>{numberFormat.format(result.foodPieces)}</strong><small>{selectedFood}</small></div><div><span>TAME TIME</span><strong>{duration(result.seconds)}</strong><small>{rates.taming}× profile</small></div></div>:<div className="taming-manual-input"><p>{result.reason} Enter values verified against your cluster.</p><div className="taming-compact-fields"><label className="field"><span>Verified food count</span><input type="number" min="1" value={manualFood} onChange={e=>setManualFood(e.target.value)} placeholder="Optional"/></label><label className="field"><span>Verified minutes</span><input type="number" min="0.1" step="0.1" value={manualMinutes} onChange={e=>setManualMinutes(e.target.value)} placeholder="Timer duration"/></label></div></div>}
      {isKnockout&&<button type="button" className="primary taming-start-btn" disabled={!canStart||special?.status==='untameable'} onClick={()=>onTimer(creature+' Lv '+level+' · '+map+(isManual?' · manual':''),finalMinutes,'Taming')}>Start Timer <Timer size={16}/></button>}
     </div>
    </div>
    <div className="taming-plan-notes">
     <div className="taming-note-heading"><ShieldCheck size={16}/><strong>Plan Notes</strong><span>FIELD GUIDANCE</span></div>
     <p>{planNote}</p>
     
     {isKnockout&&result.ok&&<small>Rates: {rates.taming}× taming · {rates.food}× dinosaur food drain. Check your server's actual settings.</small>}
    </div>
    <div className="taming-compact-links">
     <a href={special?.source||wikiUrl} target="_blank" rel="noreferrer">Species Wiki <ExternalLink size={14}/></a>
     <a href={dododexUrl} target="_blank" rel="noreferrer">Cross-check Dododex <ExternalLink size={14}/></a>
     <span>{Object.keys(knockoutProfiles).length} built-in food profiles</span>
    </div>
   </section>

   {isKnockout&&!special&&<section className="panel knockout-panel taming-knockout-card" aria-label="Knockout planner">
    <div className="panelhead"><h2><Crosshair size={18}/> Knockout Planner</h2><span className="badge gold">THEORETICAL SHOTS</span></div>
    {knockout.ok?<div className="taming-ko-headline">
     <div className="taming-ko-target"><span>TARGET TORPOR</span><strong>{numberFormat.format(knockout.totalTorpor)}</strong><small>Wild Lv {level}</small></div>
     <div className="taming-ko-shortcut"><span>FEWEST BODY SHOTS</span><strong>{bestAmmo?numberFormat.format(bestAmmo.body):'—'}</strong><small>{bestAmmo?.label||'Unknown'}</small></div>
    </div>:<div className="taming-ko-unverified"><Info size={17}/><span>{knockout.reason} Enter verified in-game torpor below or cross-check Dododex.</span></div>}
    <div className="taming-ko-settings">
     <label className="field"><span>Weapon damage %</span><input type="number" min="1" max={clusterId==='nomadark'?354:1000} value={weaponQuality} onChange={e=>setWeaponQuality(e.target.value)}/></label>
     <label className="field"><span>Longneck buff %</span><input type="number" min="1" max="1000" value={longneckBuffPercent} onChange={e=>setLongneckBuffPercent(e.target.value)}/></label>
     <label className="field taming-field-wide"><span>Manual target torpor (if unsupported)</span><input type="number" min="1" value={targetTorpor} onChange={e=>setTargetTorpor(e.target.value)} placeholder="Read from in-game creature stat"/></label>
    </div>
    {knockout.ok?<div className="taming-ammo-section">
     <div className="taming-ammo-header"><h3>Tranquilizer Options</h3><span>BODY / HEAD SHOTS</span></div>
     <div className="taming-ammo-list">
      {knockout.rows.map((item,index)=><div key={item.id} className={'taming-ammo-row'+(bestAmmo?.id===item.id?' taming-ammo-best':'')}>
       <div className="taming-ammo-icon" aria-hidden="true"><Crosshair size={18}/></div>
       <div className="taming-ammo-description">
        <strong>{item.label}</strong>
        <div className="taming-ammo-meter" aria-hidden="true"><span style={{width:Math.max(7,Math.round(item.body/maxBodyShots*100))+'%'}}/></div>
       </div>
       <div className="taming-shot-count"><strong>{numberFormat.format(item.body)}</strong><small>BODY</small></div>
       <div className="taming-shot-count"><strong>{item.head===null?'—':numberFormat.format(item.head)}</strong><small>HEAD</small></div>
      </div>)}
     </div>
     <small className="taming-ammo-explainer">Bars compare theoretical body-shot counts (shorter means fewer shots). Estimates exclude misses, torpor decay and reloads.</small>
    </div>:<div className="taming-ko-unverified"><Info size={16}/><span>Shot counts will appear once torpor and applicable weapon values are available.</span></div>}
    <details className="taming-methodology">
     <summary>Calculation assumptions &amp; safety margins <ChevronDown size={15}/></summary>
     <div><strong>NomadARK Longneck buff:</strong> The server lists 300%. Dart rows treat this as 300% total base damage (3×), separately from blueprint weapon damage. Bow and crossbow rows do not use this buff. If the game tooltip already includes it, adjust the field to avoid double-counting. {knockout.referenceOnly?'TORPOR REFERENCE ONLY: projectile resistance not verified. ':knockout.manual?'Manual torpor mode uses in-game torpor. ':knockout.verification!=='reviewed'?'Wiki-derived torpor profile: headshot and resistance may differ. ':''}These are theoretical minimum shots; allow a buffer for misses and torpor loss.</div>
    </details>
    <a className="taming-ko-source" href="https://ark.wiki.gg/wiki/Tranquilizer_Comparison_Table" target="_blank" rel="noreferrer">Ammo calculation reference <ExternalLink size={14}/></a>
   </section>}

   {!isKnockout&&<section className="panel taming-method-panel">
    <div className="panelhead"><h2>Creature Taming Method</h2><span className="badge gold">{category.toUpperCase()}</span></div>
    <div className="taming-method-visual"><ShieldCheck size={31}/><h3>{creature}</h3><p>{special?.instructions||'This creature has no standard tranquilizer taming workflow.'}</p></div>
    {category!=='untameable'&&<button className="primary" type="button" onClick={()=>onNavigate?.(category==='passive'?'passive':'specialty',creature)}>Open {category==='passive'?'Passive':'Specialty'} Taming Lab</button>}
    <a className="taming-ko-source" href={special?.source||wikiUrl} target="_blank" rel="noreferrer">Read species method <ExternalLink size={14}/></a>
   </section>}
  </div>
  <TameSpawnAtlas creature={creature} map={map}/>
 </>;
}
