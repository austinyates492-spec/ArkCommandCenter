import React,{useEffect,useMemo,useState} from 'react';
import {ExternalLink,Timer} from 'lucide-react';
import {maps} from './data';
import {availableFoods,calculateTame,knockoutProfiles} from './taming-engine';
import {knockoutEstimate,knockoutSpecies} from './knockout-engine';
import {getTamingMethod,knockoutRoster} from './special-taming-methods.js';

const numberFormat=new Intl.NumberFormat('en-US');
const duration=(seconds)=>{const h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=seconds%60;return [h?`${h}h`:null,m?`${m}m`:null,`${s}s`].filter(Boolean).join(' ')};

export default function TamingLab({rates,onTimer}){
 const [creature,setCreature]=useState('Rex');
 const [creatureQuery,setCreatureQuery]=useState('');
 const [level,setLevel]=useState(150);
 const [food,setFood]=useState('Exceptional Kibble');
 const [map,setMap]=useState('The Island');
 const [manualFood,setManualFood]=useState('');
 const [manualMinutes,setManualMinutes]=useState('');
 const [weaponQuality,setWeaponQuality]=useState(100);
 const [targetTorpor,setTargetTorpor]=useState('');
 const foods=useMemo(()=>availableFoods(creature),[creature]);
 const special=getTamingMethod(creature);
 const matchingCreatures=useMemo(()=>knockoutRoster.filter(name=>name.toLowerCase().includes(creatureQuery.toLowerCase())),[creatureQuery]);
 useEffect(()=>{if(foods.length&&!foods.includes(food))setFood(foods[0]);},[foods,food]);
 const selectedFood=foods.includes(food)?food:(foods[0]||'');
 const result=calculateTame({creature,level,food:selectedFood,tamingRate:rates.taming,foodDrainRate:rates.food});
 const isManual=!!special||!result.ok;
 const finalMinutes=isManual?Number(manualMinutes):result.minutes;
 const canStart=Number.isFinite(finalMinutes)&&finalMinutes>0;
 const knockout=knockoutEstimate({creature,level,weaponQuality,targetTorpor});
 const wikiUrl=`https://ark.wiki.gg/wiki/${encodeURIComponent(creature.replaceAll(' ','_'))}`;
 const dododexUrl=`https://www.dododex.com/taming/${encodeURIComponent(creature.toLowerCase().replaceAll(' ','-'))}`;
 return <>
  <div className="pagetitle"><span className="eyebrow">FIELD OPERATIONS / 01</span><h1>Taming Lab</h1><p>{knockoutRoster.length} conventional knockout species and forms. Tranq arrows, darts and shocking darts only. Heavy-weapon, passive and egg/interaction tames now have their own tabs. Wiki-derived estimates should be checked against your server.</p></div>
  <div className="two wideleft">
   <section className="panel"><div className="panelhead"><h2>Plan a Tame</h2><span className="badge gold">{rates.taming}× PROFILE</span></div>
    <label className="field"><span>Search creatures and variants</span><input value={creatureQuery} onChange={e=>setCreatureQuery(e.target.value)} placeholder="Rex, Tek, Aberrant, Giga..."/></label>
    <div className="formgrid">
     <label className="field"><span>Creature ({matchingCreatures.length} matches)</span><select value={matchingCreatures.includes(creature)?creature:''} onChange={e=>setCreature(e.target.value)}>{!matchingCreatures.includes(creature)&&<option value="">Select a creature</option>}{matchingCreatures.map(name=><option key={name}>{name}</option>)}</select></label>
     <label className="field"><span>Wild Level</span><input type="number" min="1" max="1000" value={level} onChange={e=>setLevel(e.target.value)}/></label>
     {!special&&<label className="field"><span>Food</span><select value={selectedFood} disabled={!foods.length} onChange={e=>setFood(e.target.value)}>{foods.length?foods.map(name=><option key={name}>{name}</option>):<option value="">Manual verification required</option>}</select></label>}
     <label className="field"><span>Map</span><select value={map} onChange={e=>setMap(e.target.value)}>{maps.map(name=><option key={name}>{name}</option>)}</select></label>
    </div>
    {special?<><div className="notice"><strong>{special.type}:</strong> {special.instructions} Special taming time and item counts are not estimated without verified mechanics.</div>{special.status!=='untameable'&&<label className="field"><span>Verified duration (minutes, optional timer)</span><input type="number" min="0.1" step="0.1" value={manualMinutes} onChange={e=>setManualMinutes(e.target.value)} placeholder="Enter verified time"/></label>}</>:result.ok?<div className="tame-results"><div><span>FOOD REQUIRED</span><strong>{numberFormat.format(result.foodPieces)} <small>pieces</small></strong></div><div><span>ESTIMATED DURATION</span><strong>{duration(result.seconds)}</strong></div></div>:<><div className="notice">{result.reason} Enter the food quantity and time you verified in Dododex to schedule a timer. No automatic estimate is shown.</div><div className="formgrid"><label className="field"><span>Verified food pieces (optional)</span><input type="number" min="1" value={manualFood} onChange={e=>setManualFood(e.target.value)} placeholder="From Dododex"/></label><label className="field"><span>Verified duration (minutes)</span><input type="number" min="0.1" step="0.1" value={manualMinutes} onChange={e=>setManualMinutes(e.target.value)} placeholder="Required for timer"/></label></div></>}
    {!special&&result.ok&&<div className="notice">{result.caveat} Confirm against your server before using valuable kibble or narcotics.</div>}
    <div className="actionrow"><a className="ghost linkbtn" target="_blank" rel="noreferrer" href={dododexUrl}>Cross-check Dododex <ExternalLink size={15}/></a><button className="primary" disabled={!canStart||special?.status==='untameable'} onClick={()=>onTimer(`${creature} Lv ${level} · ${map}${isManual?' · manual':''}`,finalMinutes,'Taming')}>Start Timer <Timer size={16}/></button></div>
   </section>
   <section className="panel"><div className="panelhead"><h2>Loadout & Sources</h2><span className={`badge ${!special&&result.ok?'green':'gold'}`}>{special?special.type:result.ok?'WIKI MODEL':'NEEDS DATA'}</span></div><div className="featureart">🦖</div>
    <div className="keyrow"><span>Creature</span><strong>{creature}</strong></div><div className="keyrow"><span>Level</span><strong>{level}</strong></div>{special?<><div className="keyrow"><span>Required method</span><strong>{special.type}</strong></div>{special.items.map(item=><div className="keyrow" key={item}><span>Allowed item</span><strong>{item}</strong></div>)}{!special.items.length&&<div className="keyrow"><span>Item</span><strong>{special.status==='untameable'?'None':'Not yet confirmed'}</strong></div>}</>:<><div className="keyrow"><span>Food</span><strong>{result.ok?selectedFood:'Verify externally'}</strong></div><div className="keyrow"><span>Food pieces</span><strong>{result.ok?result.foodPieces:(manualFood||'—')}</strong></div></>}<div className="keyrow"><span>Taming multiplier</span><strong>{rates.taming}×</strong></div><div className="keyrow"><span>Food drain multiplier</span><strong>{rates.food}×</strong></div><div className="keyrow"><span>Verified built-in profiles</span><strong>{Object.keys(knockoutProfiles).length}</strong></div>
    <div className="actionrow"><a className="ghost linkbtn" target="_blank" rel="noreferrer" href={special?.source||wikiUrl}>Species wiki <ExternalLink size={15}/></a></div>
    <div className="notice">Sources: ARK Official Community Wiki taming modules. Special/passive tames are excluded from the automatic knockout model.</div>
   </section>
  </div>
  {!special&&<section className="panel knockout-panel"><div className="panelhead"><h2>Tranquilizer & Knockout Planner</h2><span className="badge gold">ESTIMATED AMMO</span></div>
   <div className="formgrid"><label className="field"><span>Weapon damage percentage</span><input type="number" min="1" max="1000" value={weaponQuality} onChange={e=>setWeaponQuality(e.target.value)}/></label><label className="field"><span>Target torpor (for unsupported creatures)</span><input type="number" min="1" placeholder="Use in-game stat if no built-in profile" value={targetTorpor} onChange={e=>setTargetTorpor(e.target.value)}/></label><div className="keyrow"><span>Target torpor</span><strong>{knockout.ok?numberFormat.format(knockout.totalTorpor):'—'}</strong></div></div>
   {knockout.ok?<><div className="tablewrap"><table><thead><tr><th>AMMO / WEAPON</th><th>BODY SHOTS</th><th>HEAD SHOTS</th></tr></thead><tbody>{knockout.rows.map(item=><tr key={item.id}><td><strong>{item.label}</strong></td><td>{numberFormat.format(item.body)}</td><td>{item.head===null?'No verified bonus':numberFormat.format(item.head)}</td></tr>)}</tbody></table></div><div className="notice">{knockout.referenceOnly?'TORPOR REFERENCE ONLY: knockout eligibility and projectile resistance are not verified. This is theoretical ammo math, not a confirmed taming method. ':knockout.manual?'Manual torpor mode uses your in-game torpor and neutral damage modifiers. ':knockout.verification!=='reviewed'?'Wiki-derived torpor profile: headshot/resistance effects are not independently verified. Some forms assume the standard 6% wild-level torpor increase; confirm against your game before committing expensive ammunition. ':''}Estimates assume every shot lands, full torpor-over-time takes effect, and the target has no torpor loss between shots. Actual counts can be higher due to torpor drain, reloads and misses.</div></>:<div className="notice">{knockout.reason} Check Dododex until the creature's torpor and multipliers are verified.</div>}
   <div className="actionrow"><a className="ghost linkbtn" href="https://ark.wiki.gg/wiki/Tranquilizer_Comparison_Table" target="_blank" rel="noreferrer">Ammo values source <ExternalLink size={15}/></a></div>
  </section>}
 </>;
}
