import React from 'react';
import {Activity,AlertTriangle,ArrowRight,BookOpen,Clock3,Crosshair,ExternalLink,Heart,MapPin,Shield,Timer,Utensils,Target, Zap} from 'lucide-react';
import './rex-dossier.css';

const fmt=new Intl.NumberFormat('en-US');
const time=seconds=>{
 const n=Math.max(0,Math.floor(Number(seconds)||0));
 return [Math.floor(n/3600)?Math.floor(n/3600)+'h':null,Math.floor(n%3600/60)?Math.floor(n%3600/60)+'m':null,n%60+'s'].filter(Boolean).join(' ');
};
const wiki='https://ark.wiki.gg/wiki/Rex';
function Panel({heading,aside,children,className=''}){return <section className={'rex-panel '+className}><div className="rex-panel-heading"><h2>{heading}</h2>{aside}</div>{children}</section>}
function RexArtwork(){
 return <svg className="rex-art" viewBox="0 0 820 580" role="img" aria-label="Decorative illustrated Tyrannosaurus rex silhouette in a rugged landscape" preserveAspectRatio="xMidYMid meet">
  <defs>
   <linearGradient id="rexSkin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8b8fa5"/><stop offset=".45" stopColor="#4b526a"/><stop offset="1" stopColor="#1c2335"/></linearGradient>
   <linearGradient id="rexGround" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#5e476c"/><stop offset="1" stopColor="#121723"/></linearGradient>
  </defs>
  <path d="M0 445 112 335 174 396 292 250 407 425 560 310 665 419 734 344 820 420V580H0Z" fill="url(#rexGround)" opacity=".43"/>
  <path d="M0 516 125 465 212 487 382 445 516 485 688 447 820 478V580H0Z" fill="#111722" opacity=".85"/>
  <g transform="translate(-45 28)">
   <path d="M349 346C250 363 158 406 40 441c95-5 180-21 284-40 59-8 111-9 151-40Z" fill="#22283a" stroke="#a6a9bb" strokeWidth="4"/>
   <path d="M300 315c-8-76 21-137 93-170 59-28 121-15 155 23l29 44 42-3 57 23 56 2 28 19-21 26-55 9-52-6-67-1c-12 26-37 45-78 57l-8 74 38 63 35 17-8 18-73-3-52-90-20-49-37 42-18 95 36 4-1 19-70 2-13-27 11-104Z" fill="url(#rexSkin)" stroke="#aeb2c6" strokeWidth="5" strokeLinejoin="round"/>
   <path d="M579 273c30 9 65 11 111 4l46 17 29 2-19 19-61 17-90-18-34-21Z" fill="#242b3e" stroke="#b8b3c5" strokeWidth="4"/>
   <path d="m634 296 10 17 8-16 10 16 9-17 9 16 9-18 10 17 12-17 8 12" fill="#e5dacf" stroke="#aab0bb" strokeWidth="2"/>
   <path d="M470 294c-4 43 28 65 58 79l9 34 28 12 11-16-17-15-11-51-39-44" fill="#3a4258" stroke="#a9aabd" strokeWidth="4"/>
   <path d="M358 358c-17 55-21 90-10 128l43 12-6 17-78-4-10-27 14-103" fill="#394257" stroke="#adb2c8" strokeWidth="5"/>
   <path d="M558 223c18-12 35-11 51 2l-6 16-37 1Z" fill="#0b1119" stroke="#a9a1b9" strokeWidth="3"/>
   <circle cx="585" cy="228" r="6" fill="#f5ad7d"/>
   <path d="M338 272c85-64 140-71 209-44M311 339c51-10 82-5 124 7M356 410l58-3M413 186c21 38 17 75-3 111" fill="none" stroke="#c4bdd1" strokeOpacity=".32" strokeWidth="7"/>
  </g>
 </svg>;
}
export default function RexDossier({level,setLevel,food,setFood,foods,map,setMap,maps,rates,result,knockout,weaponQuality,setWeaponQuality,longneckBuffPercent,setLongneckBuffPercent,clusterId,onStart,onClassic}){
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
     <div className="rex-art-credit">ORIGINAL STYLIZED ILLUSTRATION • NOT IN-GAME ART</div>
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
    </div>
   </div>
  </div>
 </article>;
}
