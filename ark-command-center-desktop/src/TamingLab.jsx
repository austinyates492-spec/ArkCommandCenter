import React,{useEffect,useMemo,useState} from 'react';
import {ExternalLink,Timer} from 'lucide-react';
import {maps,tameCreatures} from './data';
import {availableFoods,calculateTame,knockoutProfiles} from './taming-engine';
import {knockoutEstimate,knockoutSpecies} from './knockout-engine';
import {getTamingMethod,knockoutRoster,tamingCategory} from './special-taming-methods.js';
import {RexArtwork} from './RexDossier.jsx';
import CreatureLineArt from './CreatureLineArt.jsx';
import {hasDetailedOutline} from './IndividualCreatureLineArt.jsx';
import './taming-lab-art.css';

const numberFormat=new Intl.NumberFormat('en-US');
const duration=(seconds)=>{const h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=seconds%60;return [h?`${h}h`:null,m?`${m}m`:null,`${s}s`].filter(Boolean).join(' ')};

export default function TamingLab({rates,onTimer,onNavigate,clusterId='nomadark',discoveredCreatures=[]}){
 const [creature,setCreature]=useState('Rex');
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
 const matchingCreatures=useMemo(()=>[...new Set([...tameCreatures,...discoveredCreatures])].filter(name=>name.toLowerCase().includes(creatureQuery.toLowerCase())).sort(),[creatureQuery,discoveredCreatures]);
 const isDiscovered=discoveredCreatures.includes(creature);
 useEffect(()=>setLongneckBuffPercent(clusterId==='nomadark'?300:100),[clusterId]);
 useEffect(()=>{if(foods.length&&!foods.includes(food))setFood(foods[0]);},[foods,food]);
 const selectedFood=foods.includes(food)?food:(foods[0]||'');
 const result=isKnockout?calculateTame({creature,level,food:selectedFood,tamingRate:rates.taming,foodDrainRate:rates.food}):{ok:false,reason:'Use this creature’s dedicated taming method.'};
 const isManual=!!special||!result.ok;
 const finalMinutes=isManual?Number(manualMinutes):result.minutes;
 const canStart=isKnockout&&Number.isFinite(finalMinutes)&&finalMinutes>0;
 const knockout=isKnockout?knockoutEstimate({creature,level,weaponQuality,longneckBuffPercent,targetTorpor}):{ok:false,reason:'Ordinary tranquilizers are not used for this encounter.'};
 const wikiUrl=`https://ark.wiki.gg/wiki/${encodeURIComponent(creature.replaceAll(' ','_'))}`;
 const dododexUrl=`https://www.dododex.com/taming/${encodeURIComponent(creature.toLowerCase().replaceAll(' ','-'))}`;
 return <>
  <div className="pagetitle"><span className="eyebrow">FIELD OPERATIONS / 01</span><h1>Taming Lab</h1><p>Search all {tameCreatures.length} creatures and forms here. Conventional knockout taming uses the original calculator; passive and specialty creatures link to their dedicated planners. Artwork is a stylized anatomical study, not an in-game model.</p></div>
  <div className="two wideleft">
   <section className="panel"><div className="panelhead"><h2>Plan a Tame</h2><span className="badge gold">{rates.taming}× PROFILE</span></div>
    <label className="field"><span>Search all creatures and variants</span><input value={creatureQuery} onChange={e=>setCreatureQuery(e.target.value)} placeholder="Rex, Tek, Aberrant, Giga..."/></label>
    <div className="formgrid">
     <label className="field"><span>Creature ({matchingCreatures.length} matches)</span><select value={matchingCreatures.includes(creature)?creature:''} onChange={e=>setCreature(e.target.value)}>{!matchingCreatures.includes(creature)&&<option value="">Select a creature</option>}{matchingCreatures.map(name=><option key={name}>{name}</option>)}</select></label>
     <label className="field"><span>Wild Level</span><input type="number" min="1" max="1000" value={level} onChange={e=>setLevel(e.target.value)}/></label>
     {isKnockout&&!special&&<label className="field"><span>Food</span><select value={selectedFood} disabled={!foods.length} onChange={e=>setFood(e.target.value)}>{foods.length?foods.map(name=><option key={name}>{name}</option>):<option value="">Manual verification required</option>}</select></label>}
     <label className="field"><span>Map</span><select value={map} onChange={e=>setMap(e.target.value)}>{maps.map(name=><option key={name}>{name}</option>)}</select></label>
    </div>
    {!isKnockout?<div className="notice"><strong>{category.toUpperCase()} CREATURE:</strong> {special?.instructions||'No standard knockout method has been confirmed.'} {category!=='untameable'&&<button className="ghost" type="button" onClick={()=>onNavigate?.(category==='passive'?'passive':'specialty',creature)} style={{marginLeft:8}}>Open {category==='passive'?'Passive':'Specialty'} Taming Lab for {creature}</button>}</div>:special?<><div className="notice"><strong>{special.type}:</strong> {special.instructions} Special taming time and item counts are not estimated without verified mechanics.</div>{special.status!=='untameable'&&<label className="field"><span>Verified duration (minutes, optional timer)</span><input type="number" min="0.1" step="0.1" value={manualMinutes} onChange={e=>setManualMinutes(e.target.value)} placeholder="Enter verified time"/></label>}</>:result.ok?<div className="tame-results"><div><span>FOOD REQUIRED</span><strong>{numberFormat.format(result.foodPieces)} <small>pieces</small></strong></div><div><span>ESTIMATED DURATION</span><strong>{duration(result.seconds)}</strong></div></div>:<><div className="notice">{result.reason} Enter the food quantity and time you verified in Dododex to schedule a timer. No automatic estimate is shown.</div><div className="formgrid"><label className="field"><span>Verified food pieces (optional)</span><input type="number" min="1" value={manualFood} onChange={e=>setManualFood(e.target.value)} placeholder="From Dododex"/></label><label className="field"><span>Verified duration (minutes)</span><input type="number" min="0.1" step="0.1" value={manualMinutes} onChange={e=>setManualMinutes(e.target.value)} placeholder="Required for timer"/></label></div></>}
    {isDiscovered&&<div className="notice">This creature was found in the live wiki feed. Its knockout method, food and torpor are not yet verified; use a manually confirmed timer until data is reviewed.</div>}
    {!special&&result.ok&&<div className="notice">{result.caveat} Current cluster: {rates.taming}× taming; the {rates.food}× dinosaur food-drain multiplier can change the duration. Player hunger is a separate setting.</div>}
    <div className="actionrow"><a className="ghost linkbtn" target="_blank" rel="noreferrer" href={dododexUrl}>Cross-check Dododex <ExternalLink size={15}/></a>{isKnockout?<button className="primary" disabled={!canStart||special?.status==='untameable'} onClick={()=>onTimer(`${creature} Lv ${level} · ${map}${isManual?' · manual':''}`,finalMinutes,'Taming')}>Start Timer <Timer size={16}/></button>:category!=='untameable'&&<button className="primary" type="button" onClick={()=>onNavigate?.(category==='passive'?'passive':'specialty',creature)}>Open {category==='passive'?'Passive':'Specialty'} Planner</button>}</div>
   </section>
   <section className="panel"><div className="panelhead"><h2>Loadout & Sources</h2><span className={`badge ${!special&&result.ok?'green':'gold'}`}>{special?special.type:result.ok?'WIKI MODEL':'NEEDS DATA'}</span></div><div className={'taming-art-stage'+(creature==='Rex'?' taming-art-rex':'')} aria-label={creature+' creature field sketch'}>
     <span className="taming-art-caption">CREATURE FIELD SKETCH <strong>{creature.toUpperCase()}</strong></span>
     {creature==='Rex'?<RexArtwork/>:<CreatureLineArt creature={creature}/>}
     <span className="taming-art-status">{creature==='Rex'||hasDetailedOutline(creature)?'DETAILED SPECIES ART':'STYLIZED BODY-PLAN ART'}</span>
    </div>
    <div className="keyrow"><span>Creature</span><strong>{creature}</strong></div><div className="keyrow"><span>Level</span><strong>{level}</strong></div>{special?<><div className="keyrow"><span>Required method</span><strong>{special.type}</strong></div>{special.items.map(item=><div className="keyrow" key={item}><span>Allowed item</span><strong>{item}</strong></div>)}{!special.items.length&&<div className="keyrow"><span>Item</span><strong>{special.status==='untameable'?'None':'Not yet confirmed'}</strong></div>}</>:<><div className="keyrow"><span>Food</span><strong>{result.ok?selectedFood:'Verify externally'}</strong></div><div className="keyrow"><span>Food pieces</span><strong>{result.ok?result.foodPieces:(manualFood||'—')}</strong></div></>}<div className="keyrow"><span>Taming multiplier</span><strong>{rates.taming}×</strong></div><div className="keyrow"><span>Food drain multiplier</span><strong>{rates.food}×</strong></div><div className="keyrow"><span>Verified built-in profiles</span><strong>{Object.keys(knockoutProfiles).length}</strong></div>
    <div className="actionrow"><a className="ghost linkbtn" target="_blank" rel="noreferrer" href={special?.source||wikiUrl}>Species wiki <ExternalLink size={15}/></a></div>
    <div className="notice">Sources: ARK Official Community Wiki taming modules. Special/passive tames are excluded from the automatic knockout model.</div>
   </section>
  </div>
  {isKnockout&&!special&&<section className="panel knockout-panel"><div className="panelhead"><h2>Tranquilizer & Knockout Planner</h2><span className="badge gold">ESTIMATED AMMO</span></div>
   <div className="formgrid"><label className="field"><span>Blueprint weapon damage % {clusterId==='nomadark'?'(Nomad cap: 354%)':'(check cluster cap)'}</span><input type="number" min="1" max={clusterId==='nomadark'?354:1000} value={weaponQuality} onChange={e=>setWeaponQuality(e.target.value)}/></label><label className="field"><span>Longneck damage multiplier %</span><input type="number" min="1" max="1000" value={longneckBuffPercent} onChange={e=>setLongneckBuffPercent(e.target.value)}/></label><label className="field"><span>Target torpor (for unsupported creatures)</span><input type="number" min="1" placeholder="Use in-game stat if no built-in profile" value={targetTorpor} onChange={e=>setTargetTorpor(e.target.value)}/></label><div className="keyrow"><span>Target torpor</span><strong>{knockout.ok?numberFormat.format(knockout.totalTorpor):'—'}</strong></div></div>
   {knockout.ok?<><div className="tablewrap"><table><thead><tr><th>AMMO / WEAPON</th><th>BODY SHOTS</th><th>HEAD SHOTS</th></tr></thead><tbody>{knockout.rows.map(item=><tr key={item.id}><td><strong>{item.label}</strong></td><td>{numberFormat.format(item.body)}</td><td>{item.head===null?'No verified bonus':numberFormat.format(item.head)}</td></tr>)}</tbody></table></div><div className="notice"><strong>NomadARK Longneck buff:</strong> The server lists 300%. Dart rows currently interpret this as 300% total base damage (3×), separately from your entered blueprint percentage. Bow/crossbow rows do not use that buff. If the actual game shows a +300% bonus or already includes the buff in its weapon tooltip, change the field to avoid double-counting. {knockout.referenceOnly?'TORPOR REFERENCE ONLY: projectile resistance not verified. ':knockout.manual?'Manual torpor mode uses in-game torpor. ':knockout.verification!=='reviewed'?'Wiki-derived torpor profile: headshot/resistance may differ. ':''}These theoretical minimum shots exclude torpor loss, missed hits and reload times.</div></>:<div className="notice">{knockout.reason} Check Dododex until the creature's torpor and multipliers are verified.</div>}
   <div className="actionrow"><a className="ghost linkbtn" href="https://ark.wiki.gg/wiki/Tranquilizer_Comparison_Table" target="_blank" rel="noreferrer">Ammo values source <ExternalLink size={15}/></a></div>
  </section>}
 </>;
}
