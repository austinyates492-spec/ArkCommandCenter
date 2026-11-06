import React,{useEffect,useMemo,useState} from 'react';
import {ExternalLink,Timer} from 'lucide-react';
import {tameCreatures,maps} from './data';
import {availableFoods,calculateTame,knockoutProfiles} from './taming-engine';

const numberFormat=new Intl.NumberFormat('en-US');
const duration=(seconds)=>{const h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=seconds%60;return [h?`${h}h`:null,m?`${m}m`:null,`${s}s`].filter(Boolean).join(' ')};

export default function TamingLab({rates,onTimer}){
 const [creature,setCreature]=useState('Rex');
 const [level,setLevel]=useState(150);
 const [food,setFood]=useState('Exceptional Kibble');
 const [map,setMap]=useState('The Island');
 const [manualFood,setManualFood]=useState('');
 const [manualMinutes,setManualMinutes]=useState('');
 const foods=useMemo(()=>availableFoods(creature),[creature]);
 useEffect(()=>{if(foods.length&&!foods.includes(food))setFood(foods[0]);},[foods,food]);
 const selectedFood=foods.includes(food)?food:(foods[0]||'');
 const result=calculateTame({creature,level,food:selectedFood,tamingRate:rates.taming,foodDrainRate:rates.food});
 const isManual=!result.ok;
 const finalMinutes=isManual?Number(manualMinutes):result.minutes;
 const canStart=Number.isFinite(finalMinutes)&&finalMinutes>0;
 const wikiUrl=`https://ark.wiki.gg/wiki/${encodeURIComponent(creature.replaceAll(' ','_'))}`;
 const dododexUrl=`https://www.dododex.com/taming/${encodeURIComponent(creature.toLowerCase().replaceAll(' ','-'))}`;
 return <>
  <div className="pagetitle"><span className="eyebrow">FIELD OPERATIONS / 01</span><h1>Taming Lab</h1><p>Choose a creature, wild level and food. Verified knockout profiles calculate your {rates.taming}× cluster automatically.</p></div>
  <div className="two wideleft">
   <section className="panel"><div className="panelhead"><h2>Plan a Tame</h2><span className="badge gold">{rates.taming}× PROFILE</span></div>
    <div className="formgrid">
     <label className="field"><span>Creature</span><select value={creature} onChange={e=>setCreature(e.target.value)}>{tameCreatures.map(name=><option key={name}>{name}</option>)}</select></label>
     <label className="field"><span>Wild Level</span><input type="number" min="1" max="1000" value={level} onChange={e=>setLevel(e.target.value)}/></label>
     <label className="field"><span>Food</span><select value={selectedFood} disabled={!foods.length} onChange={e=>setFood(e.target.value)}>{foods.length?foods.map(name=><option key={name}>{name}</option>):<option value="">Manual verification required</option>}</select></label>
     <label className="field"><span>Map</span><select value={map} onChange={e=>setMap(e.target.value)}>{maps.map(name=><option key={name}>{name}</option>)}</select></label>
    </div>
    {result.ok?<div className="tame-results"><div><span>FOOD REQUIRED</span><strong>{numberFormat.format(result.foodPieces)} <small>pieces</small></strong></div><div><span>ESTIMATED DURATION</span><strong>{duration(result.seconds)}</strong></div></div>:<><div className="notice">{result.reason} Enter the food quantity and time you verified in Dododex to schedule a timer. No automatic estimate is shown.</div><div className="formgrid"><label className="field"><span>Verified food pieces (optional)</span><input type="number" min="1" value={manualFood} onChange={e=>setManualFood(e.target.value)} placeholder="From Dododex"/></label><label className="field"><span>Verified duration (minutes)</span><input type="number" min="0.1" step="0.1" value={manualMinutes} onChange={e=>setManualMinutes(e.target.value)} placeholder="Required for timer"/></label></div></>}
    {result.ok&&<div className="notice">{result.caveat} Confirm against your server before using valuable kibble or narcotics.</div>}
    <div className="actionrow"><a className="ghost linkbtn" target="_blank" rel="noreferrer" href={dododexUrl}>Cross-check Dododex <ExternalLink size={15}/></a><button className="primary" disabled={!canStart} onClick={()=>onTimer(`${creature} Lv ${level} · ${map}${isManual?' · manual':''}`,finalMinutes,'Taming')}>Start Timer <Timer size={16}/></button></div>
   </section>
   <section className="panel"><div className="panelhead"><h2>Loadout & Sources</h2><span className={`badge ${result.ok?'green':'gold'}`}>{result.ok?'WIKI MODEL':'NEEDS DATA'}</span></div><div className="featureart">🦖</div>
    <div className="keyrow"><span>Creature</span><strong>{creature}</strong></div><div className="keyrow"><span>Level</span><strong>{level}</strong></div><div className="keyrow"><span>Food</span><strong>{result.ok?selectedFood:'Verify externally'}</strong></div><div className="keyrow"><span>Food pieces</span><strong>{result.ok?result.foodPieces:(manualFood||'—')}</strong></div><div className="keyrow"><span>Taming multiplier</span><strong>{rates.taming}×</strong></div><div className="keyrow"><span>Food drain multiplier</span><strong>{rates.food}×</strong></div><div className="keyrow"><span>Verified built-in profiles</span><strong>{Object.keys(knockoutProfiles).length}</strong></div>
    <div className="actionrow"><a className="ghost linkbtn" target="_blank" rel="noreferrer" href={wikiUrl}>Species wiki <ExternalLink size={15}/></a></div>
    <div className="notice">Sources: ARK Official Community Wiki taming modules. Special/passive tames are excluded from the automatic knockout model.</div>
   </section>
  </div>
 </>;
}
