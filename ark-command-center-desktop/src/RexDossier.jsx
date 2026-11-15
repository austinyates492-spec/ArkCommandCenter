import React from 'react';
import {Activity,AlertTriangle,ArrowRight,BookOpen,Clock3,Crosshair,ExternalLink,Heart,MapPin,Shield,Timer,Utensils,Target, Zap} from 'lucide-react';
import './rex-dossier.css';
import {rexOutlineGzip} from './rex-outline-data.js';

const fmt=new Intl.NumberFormat('en-US');
const time=seconds=>{
 const n=Math.max(0,Math.floor(Number(seconds)||0));
 return [Math.floor(n/3600)?Math.floor(n/3600)+'h':null,Math.floor(n%3600/60)?Math.floor(n%3600/60)+'m':null,n%60+'s'].filter(Boolean).join(' ');
};
const wiki='https://ark.wiki.gg/wiki/Rex';
function Panel({heading,aside,children,className=''}){return <section className={'rex-panel '+className}><div className="rex-panel-heading"><h2>{heading}</h2>{aside}</div>{children}</section>}
// The line drawing is an original, local SVG mask generated from clean black ink art.
// Native decompression keeps the source compact and avoids external image loading.
function RexArtwork(){
 const [mask,setMask]=React.useState('');
 React.useEffect(()=>{
  let active=true;
  async function load(){
   try{
    const bytes=Uint8Array.from(atob(rexOutlineGzip),ch=>ch.charCodeAt(0));
    const unzipped=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    const svg=await new Response(unzipped).text();
    if(!svg.startsWith('<svg')||!svg.includes('viewBox'))throw new Error('Invalid Rex artwork');
    if(active)setMask('data:image/svg+xml;base64,'+btoa(svg));
   }catch{
    if(active)setMask('');
   }
  }
  void load();
  return ()=>{active=false;};
 },[]);
 return <div className="rex-outline-frame" role="img" aria-label="Original precision outline of a roaring Tyrannosaurus rex, including jaw, teeth, claws and anatomical contours">
  {mask?<div className="rex-outline-art" style={{maskImage:`url("${mask}")`,WebkitMaskImage:`url("${mask}")`}}/>:<div className="rex-outline-loading">REX <small>FIELD SKETCH 001</small></div>}
  <span className="rex-outline-rule rex-outline-rule-top" aria-hidden="true"/>
  <span className="rex-outline-rule rex-outline-rule-bottom" aria-hidden="true"/>
 </div>;
}
export default function RexDossier({level,setLevel,food,setFood,foods,map,setMap,maps,rates,result,knockout,weaponQuality,setWeaponQuality,longneckBuffPercent,setLongneckBuffPercent,clusterId,onStart,onClassic,onBrowse}){
 const canStart=result.ok&&Number.isFinite(result.minutes)&&result.minutes>0;
 const ammo=knockout.ok?knockout.rows:[];
 const row=(id)=>ammo.find(item=>item.id===id);
 return <article className="rex-dossier" aria-label="Rex creature dossier">
  <div className="rex-breadcrumb"><span>FIELD OPERATIONS</span><ArrowRight size={13}/><span>TAMING LAB</span><ArrowRight size={13}/><strong>REX DOSSIER</strong></div>
  <div className="rex-layout">
   <div className="rex-left">
    <section className="rex-stage" aria-label="Rex overview">
     <div className="rex-stage-haze"/><div className="rex-stars" aria-hidden="true"/>
     <div className="rex-stage-text"><div className="rex-eyebrow"><Shield size={15}/> CREATURE DOSSIER / 001</div><h1>REX</h1><p>Tyrannosaurus • Alpha predator</p>
      <div className="rex-tags"><span><Utensils size={13}/> Carnivore</span><span><MapPin size={13}/> Land</span><span className="rex-alert"><AlertTriangle size={13}/> Aggressive</span></div>
     </div>
     <RexArtwork/>
     <div className="rex-art-credit">FIELD SKETCH / ORIGINAL LINEWORK · ACCENT COLOR FOLLOWS YOUR THEME</div>
    </section>
    <div className="rex-left-bottom">
     <Panel heading="FIELD INTELLIGENCE" aside={<span className="rex-section-tag">SPECIES PROFILE</span>}>
      <div className="rex-fact"><span>Species</span><strong>Tyrannosaurus dominum</strong></div>
      <div className="rex-fact"><span>Taming method</span><strong>Knockout</strong></div>
      <div className="rex-fact"><span>Preferred kibble</span><strong>Exceptional</strong></div>
      <div className="rex-fact"><span>Behavior</span><strong>Aggressive carnivore</strong></div>
      <div className="rex-fact"><span>Torpid target · Lv {level}</span><strong>{knockout.ok?fmt.format(knockout.totalTorpor):'Check inputs'}</strong></div>
      <a className="rex-inline-link" target="_blank" rel="noreferrer" href={wiki}>Official Community Wiki <ExternalLink size={14}/></a>
     </Panel>
     <Panel heading="PREPARATION NOTES" aside={<BookOpen size={17}/>}>
      <ul className="rex-notes"><li>Bring spare tranquilizers; the shot counts below are theoretical minimums.</li><li>Scout a safe location or trap before beginning the knockout.</li><li>Protect the unconscious Rex from nearby predators to preserve taming effectiveness.</li><li>Verify server-specific multipliers against the in-game results.</li></ul>
     </Panel>
    </div>
   </div>
   <div className="rex-right">
    <Panel heading="QUICK REFERENCE" aside={<span className="rex-section-tag">KNOCKOUT TAME</span>}>
     <div className="rex-fact"><span><Target size={15}/> Taming method</span><strong>Knockout</strong></div>
     <div className="rex-fact"><span><Utensils size={15}/> Selected food</span><strong>{food}</strong></div>
     <div className="rex-fact"><span><Crosshair size={15}/> Body shot torpor</span><strong>{knockout.ok?fmt.format(knockout.totalTorpor):'—'}</strong></div>
     <div className="rex-fact"><span><Shield size={15}/> Saddle unlock</span><strong>Level 74</strong></div>
    </Panel>
    <Panel heading="TAMING CALCULATOR" aside={<span className="rex-section-tag">{rates.taming}× SERVER RATE</span>} className="rex-calc">
     <div className="rex-fields">
      <label><span>Wild level</span><input type="number" min="1" max="1000" value={level} onChange={e=>setLevel(e.target.value)}/></label>
      <label><span>Food type</span><select value={food} onChange={e=>setFood(e.target.value)}>{foods.map(x=><option key={x}>{x}</option>)}</select></label>
      <label><span>Target map</span><select value={map} onChange={e=>setMap(e.target.value)}>{maps.map(x=><option key={x}>{x}</option>)}</select></label>
     </div>
     <div className="rex-outcome">
      <div className="rex-dial"><div className="rex-dial-inner"><Clock3 size={24}/><strong>{result.ok?time(result.seconds):'—'}</strong><small>Estimated duration</small></div></div>
      <div className="rex-result-list">
       <div><span><Utensils size={16}/> Food required</span><strong>{result.ok?fmt.format(result.foodPieces):'—'}</strong></div>
       <div><span><Clock3 size={16}/> Estimated time</span><strong>{result.ok?time(result.seconds):'—'}</strong></div>
       <div><span><Activity size={16}/> Target torpor</span><strong>{knockout.ok?fmt.format(knockout.totalTorpor):'—'}</strong></div>
       <div><span><Zap size={16}/> Food drain</span><strong>{rates.food}×</strong></div>
      </div>
     </div>
     <p className="rex-disclaimer">{result.ok?result.caveat:result.reason} Taming effectiveness and bonus levels are not estimated because they depend on damage and in-game conditions.</p>
    </Panel>
    <Panel heading="KNOCKOUT LOADOUT" aside={<span className="rex-section-tag">THEORETICAL MINIMUMS</span>}>
     <div className="rex-fields rex-weapon-fields">
      <label><span>Weapon damage %</span><input type="number" min="1" max={clusterId==='nomadark'?354:1000} value={weaponQuality} onChange={e=>setWeaponQuality(e.target.value)}/></label>
      <label><span>Longneck multiplier %</span><input type="number" min="1" max="1000" value={longneckBuffPercent} onChange={e=>setLongneckBuffPercent(e.target.value)}/></label>
     </div>
     {knockout.ok?<div className="rex-ammo-grid">
      {[['crossbow','Crossbow arrows'],['dart','Tranq darts'],['shocking','Shocking darts']].map(([id,name])=><div className="rex-ammo" key={id}><Crosshair size={18}/><span>{name}</span><strong>{fmt.format(row(id)?.body||0)}</strong><small>Body shots</small></div>)}
     </div>:<p className="rex-disclaimer">{knockout.reason}</p>}
     <p className="rex-disclaimer">Actual shots depend on reloads, torpor drain, hit location and weapon damage. The Longneck buff is modeled separately from blueprint quality.</p>
    </Panel>
    <div className="rex-actions">
     <button type="button" className="rex-start" disabled={!canStart} onClick={onStart}><Timer size={17}/> Add tame timer</button>
     <a href="https://www.dododex.com/taming/rex" target="_blank" rel="noreferrer" className="rex-link">Verify in Dododex <ExternalLink size={16}/></a>
     <button type="button" className="rex-classic" onClick={onClassic}>Classic planner <ArrowRight size={14}/></button>
     {onBrowse&&<button type="button" className="rex-classic" onClick={onBrowse}>Browse dossiers <BookOpen size={14}/></button>}
    </div>
   </div>
  </div>
 </article>;
}
