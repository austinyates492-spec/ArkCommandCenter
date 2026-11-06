import React,{useMemo,useState} from 'react';
import {Egg,Timer,Search} from 'lucide-react';
import {species,hoursText} from './data';

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
 const stages=[['Baby',0.1],['Juvenile',0.5],['Adolescent',0.9],['Adult',1]];
 return <>
  <div className="pagetitle"><span className="eyebrow">NURSERY / 02</span><h1>Breeding & Raising</h1><p>{names.length} creature profiles with 1× maturation baselines, adjusted for your {rates.mature}× maturation rate.</p></div>
  <div className="two wideleft">
   <section className="panel"><div className="panelhead"><h2>Baby Planner</h2><span className="badge green">{names.length} CREATURES</span></div>
    <label className="field"><span>Search the creature database</span><div className="searchbox"><Search size={17}/><input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search Rex, Wyvern, Giga..."/></div></label>
    <label className="field"><span>Select creature</span><select value={visible.includes(selected)?selected:''} onChange={e=>setSelected(e.target.value)}>{!visible.includes(selected)&&<option value="">Choose a matching creature</option>}{visible.map(name=><option key={name}>{name}</option>)}</select></label>
    <div className="growcard"><div className="growhead"><Egg size={29}/><div><strong>{selected} Raising Plan</strong><small>{data.method} · {rates.mature}× maturation · {rates.hatch}× hatch</small></div></div>
     <div className="growtrack"><div/></div><div className="growstats"><div><small>Full maturity</small><strong>{hoursText(mature)}</strong></div><div><small>{data.method==='Gestation'?'Gestation':'Incubation'}</small><strong>{hatching===null?'Not verified':hoursText(hatching)}</strong></div><div><small>First imprint</small><strong>{hoursText(cuddle)}</strong></div><div><small>Potential windows</small><strong>{Math.max(0,Math.floor((mature-0.00001)/cuddle))}</strong></div></div>
    </div>
    <div className="actionrow"><button className="ghost" disabled={hatching===null} onClick={()=>onTimer(`${selected} hatch / birth`,hatching*60,'Incubation')}>Start Birth Timer</button><button className="primary" onClick={()=>onTimer(`${selected} fully grown`,mature*60,'Maturation')}>Start Raising Timer <Timer size={16}/></button></div>
    <div className="notice">Maturation values come from a 155-creature ASA roster. Hatch and gestation values appear only when separately available in the original source data; they are never guessed from maturation. Imprints may be affected by settings and server events.</div>
   </section>
   <section className="panel"><div className="panelhead"><h2>Raising Milestones</h2><span className="badge gold">LOCAL TIMELINE</span></div>{stages.map(([name,portion],i)=><div className="milestone" key={name}><i>{String(i+1).padStart(2,'0')}</i><div><strong>{name}</strong><small>{hoursText(mature*portion)} since hatch / birth {portion<1?`(${Math.round(portion*100)}%)`:''}</small></div></div>)}<div className="notice">The Baby stage ends around 10%; the Juvenile stage ends near 50%, and Adolescent at 100%. These checkpoints are scaled from the maturation baseline.</div><div className="actionrow"><a className="ghost linkbtn" target="_blank" rel="noreferrer" href="https://www.dinoindex.com/breeding">Verify ASA breeding profile</a></div></section>
  </div>
 </>;
}
