import React,{useMemo,useState} from 'react';
import {Egg,Timer,Search,Clock3,Thermometer,HeartHandshake,RefreshCw,ExternalLink,Info} from 'lucide-react';
import {species,durationText} from './data';
import CreatureLineArt from './CreatureLineArt.jsx';
import {RexArtwork} from './RexDossier.jsx';
import './breeding-lab-premium.css';

const maturityStages=[
 {label:'Baby',start:0,end:10},
 {label:'Juvenile',start:10,end:50},
 {label:'Adolescent',start:50,end:100}
];
const milestones=[
 {name:'Juvenile begins',portion:0.1},
 {name:'Adolescent begins',portion:0.5},
 {name:'90% grown',portion:0.9},
 {name:'Fully grown',portion:1}
];
function Metric({icon:Icon,title,value,note,primary=false}){
 return <div className={'breeding-metric'+(primary?' breeding-metric-primary':'')}>
  <span className="breeding-metric-label"><Icon size={15}/>{title}</span>
  <strong>{value}</strong>
  <small>{note}</small>
 </div>;
}
export default function BreedingLab({rates,onTimer,initialCreature}){
 const [selected,setSelected]=useState(initialCreature&&species[initialCreature]?initialCreature:'Rex');
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
 const birthLabel=data.method==='Gestation'?'Gestation':'Incubation';
 const windows=Math.max(0,Math.floor((mature-0.00001)/cuddle));
 return <div className="breeding-lab">
  <div className="pagetitle"><h1>Breeding & Raising</h1></div>
  <div className="breeding-top-grid">
   <section className="panel breeding-profile-panel" aria-label="Creature profile">
    <div className="breeding-section-head"><h2>Creature Profile</h2><span className="breeding-pill">{names.length} CREATURES</span></div>
    <div className="breeding-picker-grid">
     <label className="field"><span>Search creatures</span><div className="searchbox"><Search size={17}/><input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search Rex, Wyvern, Giga..." /></div></label>
     <label className="field"><span>Select creature</span><select value={visible.includes(selected)?selected:''} onChange={e=>{if(e.target.value&&species[e.target.value])setSelected(e.target.value)}}>{!visible.includes(selected)&&<option value="">Choose a matching creature</option>}{visible.map(name=><option key={name} value={name}>{name}</option>)}</select></label>
    </div>
    <div className="breeding-art-stage" aria-label={selected+' breeding creature artwork'}>
     <div className="breeding-art-label">ASA BREEDING PROFILE <strong>{selected.toUpperCase()}</strong></div>
     {selected==='Rex'?<RexArtwork/>:<CreatureLineArt creature={selected}/>}
     <span className="breeding-art-method">{data.method==='Gestation'?'LIVE BIRTH':'EGG LAYER'}</span>
    </div>
    <div className="breeding-profile-facts">
     <div><span>Reproduction method</span><strong>{data.method==='Gestation'?'Gestation':'Egg / Incubation'}</strong></div>
     <div><span>Maturation multiplier</span><strong>{rates.mature}×</strong></div>
     <div><span>Hatch / birth multiplier</span><strong>{rates.hatch}×</strong></div>
     <div><span>Mating interval multiplier</span><strong>{rates.breeding}×</strong></div>
    </div>
   </section>
   <section className="panel breeding-calculator-panel" aria-label="Raising calculator">
    <div className="breeding-section-head"><h2>Raising Calculator</h2><span className="breeding-pill">CLUSTER RATES</span></div>
    <div className="breeding-metric-grid">
     <Metric icon={Clock3} title="Full maturation" value={durationText(mature*3600)} note="Hatch / birth to fully grown" primary/>
     <Metric icon={Egg} title={birthLabel} value={hatching===null?'Not verified':durationText(hatching*3600)} note={data.method==='Gestation'?'Pregnancy to birth':'Egg to hatch'}/>
     <Metric icon={HeartHandshake} title="First imprint (assumed)" value={durationText(cuddle*3600)} note={rates.cuddle+'× cuddle interval'}/>
     <Metric icon={RefreshCw} title="Imprint windows (assumed)" value={windows} note="Potential imprint opportunities"/>
    </div>
    <div className="breeding-readiness"><Info size={17}/><div><strong>Raising readiness</strong><p>Baby care lasts through the first 10% of maturation. Imprinting intervals are estimates until the cluster's cuddle settings are confirmed.</p></div></div>
    <div className="breeding-calculator-actions">
     <button className="ghost" disabled={hatching===null} onClick={()=>onTimer(`${selected} hatch / birth`,hatching*60,'Incubation')}><Egg size={16}/> Start Birth Timer</button>
     <button className="primary" onClick={()=>onTimer(`${selected} fully grown`,mature*60,'Maturation')}><Timer size={16}/> Start Raising Timer</button>
    </div>
    <div className="breeding-calculator-details">
     <div><span>Mating cooldown at {rates.breeding}× interval</span><strong>{cooldownLow===null||cooldownHigh===null?'Not available':`${durationText(cooldownLow*3600)} – ${durationText(cooldownHigh*3600)}`}</strong></div>
     {data.method==='Egg'&&Array.isArray(data.eggTempC)&&<div><span><Thermometer size={15}/> Egg incubation temperature</span><strong>{data.eggTempC[0]}–{data.eggTempC[1]} °C</strong></div>}
    </div>
   </section>
  </div>
  <section className="panel breeding-timeline-panel" aria-label="Growth timeline">
   <div className="breeding-section-head"><div><h2>Growth Timeline</h2></div><span className="breeding-pill">0–100% GROWTH</span></div>
   <div className="breeding-timeline-track" role="img" aria-label="Baby 0 to 10 percent, Juvenile 10 to 50 percent, Adolescent 50 to 100 percent">
    {maturityStages.map(stage=><div key={stage.label} className={'breeding-timeline-'+stage.label.toLowerCase()} style={{width:(stage.end-stage.start)+'%'}}/>)}
   </div>
   <div className="breeding-timeline-labels"><span><b>0–10%</b> Baby</span><span><b>10–50%</b> Juvenile</span><span><b>50–100%</b> Adolescent</span></div>
   <div className="breeding-milestones">{milestones.map(stage=><div className="breeding-milestone-card" key={stage.name}><span>{Math.round(stage.portion*100)}% · {stage.name}</span><strong>{durationText(mature*stage.portion*3600)}</strong><small>Since hatch / birth</small></div>)}</div>
   <details className="hq-inline-help"><summary>Growth phase details</summary><p>Baby ends at 10%, Juvenile ends at 50%, and Adolescent ends at 100%. These are elapsed times, not independent phase percentages.</p></details>
  </section>
  <details className="hq-inline-help"><summary>Breeding data &amp; sources</summary><div className="breeding-source-note"><div><strong>ASA source-checked baselines</strong><p>This roster contains 156 base creatures and 64 verified variants. Source: ARK Smart Breeding ASA dataset {data.sourceDatasetVersion}, reviewed {data.sourceReview}. Active rates: {rates.mature}× mature, {rates.hatch}× egg hatch and {rates.breeding}× mating interval. Your {rates.cuddle}× imprint interval should be confirmed on your cluster. Incubation requires the correct temperature.</p></div><a className="ghost linkbtn" target="_blank" rel="noreferrer" href="https://www.dinoindex.com/breeding">View ASA breeding source <ExternalLink size={15}/></a></div></details>
 </div>;
}
