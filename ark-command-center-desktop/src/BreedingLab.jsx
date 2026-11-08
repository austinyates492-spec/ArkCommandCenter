import React,{useMemo,useState} from 'react';
import {Egg,Timer,Search} from 'lucide-react';
import {species,durationText} from './data';

export default function BreedingLab({rates,onTimer}){
 const [selected,setSelected]=useState('Rex');
 const [filter,setFilter]=useState('');
 const names=useMemo(()=>Object.keys(species).sort(),[]);
 const visible=names.filter(x=>x.toLowerCase().includes(filter.toLowerCase()));
 const data=species[selected];
 const mature=data.mature/Number(rates.mature||1);
 const hatchingBase=Number.isFinite(data.hatch)?data.hatch:Number.isFinite(data.gestation)?data.gestation:null;
 const hatching=hatchingBase===null?null:hatchingBase/Number(rates.hatch||1);
 const cuddle=8*Number(rates.cuddle||1);
 const cooldownLow=Number.isFinite(data.cooldownMin)?data.cooldownMin*Number(rates.breeding||1):null;
 const cooldownHigh=Number.isFinite(data.cooldownMax)?data.cooldownMax*Number(rates.breeding||1):null;
 const stages=[['Baby ends / Juvenile begins',0.1],['Juvenile ends / Adolescent begins',0.5],['90% grown',0.9],['Adult',1]];
 return <>
  <div className="pagetitle"><span className="eyebrow">NURSERY / 02</span><h1>Breeding & Raising</h1><p>{names.length} creature profiles with 1× maturation baselines, adjusted for your selected {rates.mature}× maturation and {rates.hatch}× egg hatch settings.</p></div>
  <div className="two wideleft">
   <section className="panel"><div className="panelhead"><h2>Baby Planner</h2><span className="badge green">{names.length} CREATURES</span></div>
    <label className="field"><span>Search the creature database</span><div className="searchbox"><Search size={17}/><input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search Rex, Wyvern, Giga..."/></div></label>
    <label className="field"><span>Select creature</span><select value={visible.includes(selected)?selected:''} onChange={e=>setSelected(e.target.value)}>{!visible.includes(selected)&&<option value="">Choose a matching creature</option>}{visible.map(name=><option key={name}>{name}</option>)}</select></label>
    <div className="growcard"><div className="growhead"><Egg size={29}/><div><strong>{selected} Raising Plan</strong><small>{data.method} · {rates.mature}× maturation · {rates.hatch}× egg hatch</small></div></div>
     <div className="growtrack"><div/></div><div className="growstats"><div><small>Full maturity</small><strong>{durationText(mature*3600)}</strong></div><div><small>{data.method==='Gestation'?'Gestation':'Incubation'}</small><strong>{hatching===null?'Not verified':durationText(hatching*3600)}</strong></div><div><small>First imprint (assumed)</small><strong>{durationText(cuddle*3600)}</strong></div><div><small>Potential imprint windows (assumed)</small><strong>{Math.max(0,Math.floor((mature-0.00001)/cuddle))}</strong></div></div>
    </div>
    <div className="keyrow"><span>Mating cooldown at {rates.breeding}× interval</span><strong>{cooldownLow===null?'Not available':`${durationText(cooldownLow*3600)} – ${durationText(cooldownHigh*3600)}`}</strong></div>
    {data.method==='Egg'&&Array.isArray(data.eggTempC)&&<div className="keyrow"><span>Egg incubation temperature</span><strong>{data.eggTempC[0]}–{data.eggTempC[1]} °C</strong></div>}
    <div className="actionrow"><button className="ghost" disabled={hatching===null} onClick={()=>onTimer(`${selected} hatch / birth`,hatching*60,'Incubation')}>Start Birth Timer</button><button className="primary" onClick={()=>onTimer(`${selected} fully grown`,mature*60,'Maturation')}>Start Raising Timer <Timer size={16}/></button></div>
    <div className="notice"><strong>ASA source-checked baselines:</strong> This roster contains 156 base creatures and 64 verified variants. Source: ARK Smart Breeding ASA dataset {data.sourceDatasetVersion}, reviewed {data.sourceReview}. Active rates: {rates.mature}× mature, {rates.hatch}× egg hatch and {rates.breeding}× mating interval. Your {rates.cuddle}× imprint interval should be confirmed on your cluster. Incubation requires the correct temperature.</div>
   </section>
   <section className="panel"><div className="panelhead"><h2>Raising Milestones</h2><span className="badge gold">LOCAL TIMELINE</span></div>{stages.map(([name,portion],i)=><div className="milestone" key={name}><i>{String(i+1).padStart(2,'0')}</i><div><strong>{name}</strong><small>{durationText(mature*portion*3600)} since hatch / birth {portion<1?`(${Math.round(portion*100)}%)`:''}</small></div></div>)}<div className="notice">Baby ends at 10%, Juvenile ends at 50%, and Adolescent ends at 100%. Milestones use the precise ASA baseline divided by the current cluster growth multiplier. Imprinting timing remains an estimate where the cuddle interval is unknown.</div><div className="actionrow"><a className="ghost linkbtn" target="_blank" rel="noreferrer" href="https://www.dinoindex.com/breeding">View ASA breeding source</a></div></section>
  </div>
 </>;
}
