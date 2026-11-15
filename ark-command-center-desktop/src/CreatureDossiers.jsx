import React,{useEffect,useMemo,useState} from 'react';
import {Activity,AlertTriangle,ArrowLeft,ArrowRight,BookOpen,Check,ChevronRight,Clock3,Crosshair,ExternalLink,Heart,MapPin,Search,Shield,Star,Timer,Utensils, Zap} from 'lucide-react';
import {tameCreatures,maps} from './data.js';
import {availableFoods,calculateTame,wikiFoodOptions} from './taming-engine.js';
import {knockoutEstimate} from './knockout-engine.js';
import {tamingCategory,getTamingMethod} from './special-taming-methods.js';
import {passiveFoodPlan,passiveProfiles} from './passive-taming.js';
import {specialtyAmmoOptions,estimateSpecialtyKnockout,specialtyFeeding,specialtyFoodOptions,specialtyFixedSupply} from './specialty-engine.js';
import {creatureArtProfile} from './creature-art-profile.js';
import CreatureLineArt from './CreatureLineArt.jsx';
import {hasDetailedOutline,detailedOutlineNames} from './IndividualCreatureLineArt.jsx';
import RexDossier from './RexDossier.jsx';
import './creature-dossiers.css';

const nf=new Intl.NumberFormat('en-US');
const period=(seconds)=>{
 if(!Number.isFinite(seconds))return 'Not verified';
 const n=Math.max(0,Math.ceil(seconds)),d=Math.floor(n/86400),h=Math.floor(n%86400/3600),m=Math.floor(n%3600/60),s=n%60;
 return [d?d+'d':null,h?h+'h':null,m?m+'m':null,s+'s'].filter(Boolean).join(' ');
};
const methodNames={knockout:'Knockout',passive:'Passive',specialty:'Specialty',untameable:'Untameable'};
const categoryValues=['all','knockout','passive','specialty','untameable','favorites'];
const getSaved=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
function Info({label,value,emphasis=false}){return <div className={'cad-info'+(emphasis?' cad-info-emphasis':'')}><span>{label}</span><strong>{value??'—'}</strong></div>}
function Section({title,subtitle,children}){return <section className="cad-panel"><div className="cad-panel-heading"><h3>{title}</h3>{subtitle&&<small>{subtitle}</small>}</div>{children}</section>}
function SelectField({label,value,onChange,options,disabled=false}){return <label className="cad-field"><span>{label}</span><select value={value} disabled={disabled} onChange={event=>onChange(event.target.value)}>{options.length?options.map(option=><option key={option} value={option}>{option}</option>):<option value="">No verified options</option>}</select></label>}
function NumberField({label,value,onChange,min=1,max=1000,step='1'}){return <label className="cad-field"><span>{label}</span><input type="number" min={min} max={max} step={step} value={value} onChange={event=>onChange(event.target.value)}/></label>}

export default function CreatureDossiers({rates,onTimer,clusterId='nomadark',onOpenLab}){
 const [creature,setCreature]=useState(()=>{const old=getSaved('ark.dossierCreature','Rex');return tameCreatures.includes(old)?old:'Rex'});
 const [query,setQuery]=useState('');
 const [filter,setFilter]=useState('all');
 const [limit,setLimit]=useState(24);
 const [favorites,setFavorites]=useState(()=>getSaved('ark.dossierFavorites',[]).filter(name=>tameCreatures.includes(name)));
 const [level,setLevel]=useState(150);
 const [food,setFood]=useState('');
 const [map,setMap]=useState('The Island');
 const [weaponQuality,setWeaponQuality]=useState(100);
 const [longneck,setLongneck]=useState(clusterId==='nomadark'?300:100);
 const [heavyAmmo,setHeavyAmmo]=useState('');
 const [manualMinutes,setManualMinutes]=useState('');
 useEffect(()=>{try{localStorage.setItem('ark.dossierCreature',JSON.stringify(creature))}catch{}},[creature]);
 useEffect(()=>{try{localStorage.setItem('ark.dossierFavorites',JSON.stringify(favorites))}catch{}},[favorites]);
 useEffect(()=>setLongneck(clusterId==='nomadark'?300:100),[clusterId]);
 useEffect(()=>setLimit(24),[filter,query]);
 const category=tamingCategory(creature);
 const method=getTamingMethod(creature);
 const art=creatureArtProfile(creature);
 const foods=category==='knockout'?availableFoods(creature):
  category==='passive'?(wikiFoodOptions(creature).length?wikiFoodOptions(creature):(passiveProfiles[creature]?.food||method?.items||[])):
  category==='specialty'?specialtyFoodOptions(creature):[];
 const selectedFood=foods.includes(food)?food:(foods[0]||'');
 const knockout=category==='knockout'?knockoutEstimate({creature,level,weaponQuality,longneckBuffPercent:longneck}):null;
 const normal=category==='knockout'?calculateTame({creature,level,food:selectedFood,tamingRate:rates.taming,foodDrainRate:rates.food}):null;
 const passive=category==='passive'?passiveFoodPlan({creature,level,food:selectedFood,tamingRate:rates.taming,foodDrainRate:rates.food}):null;
 const specialty=category==='specialty'?specialtyFeeding({creature,level,food:selectedFood,tamingRate:rates.taming,foodDrainRate:rates.food}):null;
 const fixed=category==='specialty'?specialtyFixedSupply(creature):null;
 const heavyOptions=category==='specialty'?specialtyAmmoOptions(creature):[];
 const selectedAmmo=heavyOptions.find(item=>item.label===heavyAmmo)?.label||heavyOptions[0]?.label||'';
 const heavy=category==='specialty'&&heavyOptions.length?estimateSpecialtyKnockout({creature,level,ammo:selectedAmmo}):null;
 const plan=category==='knockout'?normal:category==='passive'?passive:specialty;
 const computedSeconds=Number.isFinite(plan?.seconds)&&plan.seconds>0?plan.seconds:null;
 const suggestedMinutes=computedSeconds?computedSeconds/60:Number(manualMinutes);
 const canTimer=category!=='untameable'&&Number.isFinite(suggestedMinutes)&&suggestedMinutes>0;
 const visible=useMemo(()=>{
  const needle=query.trim().toLowerCase();
  return tameCreatures.filter(name=>(!needle||name.toLowerCase().includes(needle))
   &&(filter==='all'||(filter==='favorites'?favorites.includes(name):tamingCategory(name)===filter)))
   .sort((a,b)=>(favorites.includes(b)?1:0)-(favorites.includes(a)?1:0)||a.localeCompare(b));
 },[query,filter,favorites]);
 const toggleFavorite=()=>setFavorites(previous=>previous.includes(creature)?previous.filter(x=>x!==creature):[...previous,creature]);
 const selectCreature=name=>{setCreature(name);setFood('');setManualMinutes('');setHeavyAmmo('');};
 const wikiUrl=method?.source||`https://ark.wiki.gg/wiki/${encodeURIComponent(art.base.replaceAll(' ','_'))}`;
 const openOriginal=()=>onOpenLab?.(category==='passive'?'passive':category==='specialty'?'specialty':'taming');
 const timer=()=>onTimer(`${creature} Lv ${level} · ${map}${!computedSeconds?' · manually verified':''}`,suggestedMinutes,'Taming');
 const methodCounts=useMemo(()=>tameCreatures.reduce((acc,name)=>{acc[tamingCategory(name)]=(acc[tamingCategory(name)]||0)+1;return acc},{knockout:0,passive:0,specialty:0,untameable:0}),[]);
 return <div className="cad-library">
  <div className="pagetitle cad-heading"><span className="eyebrow">FIELD OPERATIONS / CREATURE ARCHIVE</span><h1>Creature Dossiers</h1><p>Every catalogued ASA creature and form has a dossier. Ten creatures now have dedicated detailed line art; the remaining entries keep their existing body-plan studies until their artwork is reviewed. Taming figures appear only where supported models exist.</p></div>
  <div className="cad-summary"><span><strong>{tameCreatures.length}</strong> creature entries</span><span className="cad-progress"><strong>{detailedOutlineNames.length+1}</strong> individually illustrated</span>{Object.entries(methodCounts).map(([kind,count])=><span key={kind}><b>{count}</b> {methodNames[kind]}</span>)}</div>
  <section className="cad-search-panel" aria-label="Browse creature dossiers">
   <label className="cad-search"><Search size={19}/><input type="search" placeholder="Search creatures, variants, and forms…" aria-label="Search creature dossiers" value={query} onChange={event=>setQuery(event.target.value)}/></label>
   <div className="cad-filters" aria-label="Filter by taming type">{categoryValues.map(value=><button type="button" className={filter===value?'active':''} key={value} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{value==='all'?'All':value==='favorites'?'★ Favorites':methodNames[value]}</button>)}</div>
   <div className="cad-roster" role="group" aria-label="Creature results">
    {visible.slice(0,limit).map(name=><button type="button" key={name} className={'cad-creature-tile'+(name===creature?' selected':'')} aria-pressed={name===creature} onClick={()=>selectCreature(name)}>
     <span className="cad-creature-glyph">{creatureArtProfile(name).group.slice(0,2).toUpperCase()}</span>
     <span className="cad-creature-copy"><strong>{name}</strong><small>{methodNames[tamingCategory(name)]} {favorites.includes(name)?' · ★':''}</small></span>
     {(name==='Rex'||hasDetailedOutline(name))&&<span className="cad-art-dot" title="Dedicated species illustration" aria-label="Dedicated species illustration"/>}
     {name===creature&&<Check size={14}/>}
    </button>)}
    {visible.length===0&&<p className="cad-empty">No creatures match that search or filter.</p>}
   </div>
   {visible.length>limit&&<button className="cad-show-more" type="button" onClick={()=>setLimit(n=>n+48)}>Show more creatures ({visible.length-limit} remaining)</button>}
  </section>
  {creature==='Rex'?<div className="cad-rex-container">
   <div className="cad-dossier-toolbar"><span><BookOpen size={17}/> CURRENT DOSSIER • REX</span><button type="button" className="cad-favorite-btn" onClick={toggleFavorite} aria-pressed={favorites.includes(creature)}><Star size={16} fill={favorites.includes(creature)?'currentColor':'none'}/>{favorites.includes(creature)?'Saved favorite':'Save favorite'}</button></div>
   <RexDossier level={level} setLevel={setLevel} food={selectedFood} setFood={setFood} foods={foods} map={map} setMap={setMap} maps={maps} rates={rates} result={normal} knockout={knockout} weaponQuality={weaponQuality} setWeaponQuality={setWeaponQuality} longneckBuffPercent={longneck} setLongneckBuffPercent={setLongneck} clusterId={clusterId} onStart={timer} onClassic={openOriginal}/>
  </div>:<article className="cad-dossier" aria-label={`${creature} dossier`}>
   <div className="cad-topline"><div><span className="cad-eyebrow"><Shield size={15}/> CREATURE DOSSIER / {art.group.toUpperCase()} STUDY</span><h2>{creature}</h2><p>{methodNames[category]} • {art.base!==creature?'Variant of '+art.base:'Official ASA catalog entry'} • Technical field sketch</p></div><button type="button" className="cad-favorite-btn" onClick={toggleFavorite} aria-pressed={favorites.includes(creature)}><Star size={17} fill={favorites.includes(creature)?'currentColor':'none'}/>{favorites.includes(creature)?'Saved favorite':'Save favorite'}</button></div>
   <div className="cad-detail-layout">
    <div className="cad-detail-left">
     <section className="cad-art-stage" aria-label={`${creature} anatomical illustration`}>
      <div className="cad-stage-grid" aria-hidden="true"/>
      <span className="cad-stage-label">FIELD SKETCH / {art.group.toUpperCase()}</span>
      <span className={'cad-art-status'+(hasDetailedOutline(creature)?'':' cad-art-status-pending')}>{hasDetailedOutline(creature)?'DETAILED SPECIES ART':'BODY-PLAN STUDY'}</span>
      <CreatureLineArt creature={creature}/>
      <div className="cad-stage-footer"><span>{hasDetailedOutline(creature)?'CURATED ANATOMICAL CONTOUR':'BODY-PLAN REFERENCE'}</span><span>LINEWORK MATCHES ACTIVE THEME</span></div>
     </section>
     <Section title="SPECIES INTELLIGENCE" subtitle="METHOD-AWARE">
      <Info label="Creature" value={creature}/>
      <Info label="Taming category" value={methodNames[category]}/>
      <Info label="Art body plan" value={art.group.replaceAll('-',' ')}/>
      <Info label="Official source" value={<a href={wikiUrl} target="_blank" rel="noreferrer">Creature wiki <ExternalLink size={13}/></a>}/>
      {method?.type&&<Info label="Encounter method" value={method.type}/>}
      <p className="cad-fineprint">{hasDetailedOutline(creature)?'This is a curated, individually drawn species illustration; not an in-game model.':'This is a shared body-plan study with species-specific variations. A dedicated detailed illustration is still pending review.'}</p>
     </Section>
    </div>
    <div className="cad-detail-right">
     <Section title="ENCOUNTER SETTINGS" subtitle={`${rates.taming}× TAMING / ${rates.food}× FOOD DRAIN`}>
      <div className="cad-field-grid">
       <NumberField label="Wild level" value={level} onChange={setLevel}/>
       <SelectField label="Map" value={map} onChange={setMap} options={maps}/>
       {foods.length>0&&<SelectField label={category==='specialty'?'Offering / food':'Food'} value={selectedFood} onChange={setFood} options={foods}/>}
       {heavyOptions.length>0&&<SelectField label="Heavy knockout equipment" value={selectedAmmo} onChange={setHeavyAmmo} options={heavyOptions.map(x=>x.label)}/>}
      </div>
      {method?.instructions&&<p className="cad-info-note"><AlertTriangle size={15}/>{method.instructions}</p>}
     </Section>
     {category==='untameable'?<Section title="TAMING STATUS" subtitle="NOT TAMEABLE"><p className="cad-warning">This creature is listed as untameable. No food, knockout estimate, or tame timer is provided.</p></Section>:
      <>
       <Section title={category==='knockout'?'LIVE TAMING PLAN':category==='passive'?'PASSIVE FEEDING':'SPECIALTY PREPARATION'} subtitle="WIKI-BASED WHERE AVAILABLE">
        <div className="cad-result-grid">
         <div className="cad-result"><Utensils size={20}/><span>{category==='passive'?'Food / offerings':'Required food / supply'}</span><strong>{plan?.ok?(plan.foodPieces??plan.pieces??fixed?.amount??'—'):(fixed?.amount??'Not verified')}</strong></div>
         <div className="cad-result"><Clock3 size={20}/><span>Estimated duration</span><strong>{computedSeconds?period(computedSeconds):'Not verified'}</strong></div>
         {(knockout?.ok||heavy?.ok)&&<div className="cad-result"><Activity size={20}/><span>Target torpor</span><strong>{nf.format(knockout?.totalTorpor??heavy?.totalTorpor)}</strong></div>}
        </div>
        {fixed&&<p className="cad-info-note">{fixed.amount} × {fixed.item}. {fixed.caveat}</p>}
        {plan?.ok?<p className="cad-fineprint">{plan.caveat||plan.notes||'These figures are theoretical; verify server mechanics.'}</p>:<p className="cad-warning">{plan?.reason||'No complete species-specific numeric model has been verified. The existing specialty planner remains available.'}</p>}
       </Section>
       {category==='knockout'&&<Section title="TRANQUILIZER LOADOUT" subtitle="BODY SHOT ESTIMATES">
        <div className="cad-field-grid">
         <NumberField label="Weapon blueprint damage %" value={weaponQuality} onChange={setWeaponQuality} max={clusterId==='nomadark'?354:1000}/>
         <NumberField label="Longneck damage multiplier %" value={longneck} onChange={setLongneck}/>
        </div>
        {knockout?.ok?<div className="cad-ammo-list">{knockout.rows.map(row=><div key={row.id}><span><Crosshair size={14}/>{row.label}</span><strong>{nf.format(row.body)} body{row.head!==null?` / ${nf.format(row.head)} head`:''}</strong></div>)}</div>:<p className="cad-warning">{knockout?.reason||'No verified tranq profile available.'}</p>}
        <p className="cad-fineprint">Theoretical minimums exclude misses, reload delays, torpor loss, and server overrides. Never substitute these figures for a verified trap plan.</p>
       </Section>}
       {category==='specialty'&&heavy?.ok&&<Section title="SPECIAL KNOCKOUT" subtitle="HEAVY AMMUNITION"><Info label="Equipment" value={heavy.ammo}/><Info label="Theoretical hits" value={heavy.amount}/><Info label="Target torpor" value={nf.format(heavy.totalTorpor)}/><p className="cad-fineprint">{heavy.caveat}</p></Section>}
       <Section title="OPERATION ACTIONS" subtitle="TRIBE TOOLS">
        {!computedSeconds&&<NumberField label="Verified duration for optional timer (minutes)" min={0.1} step=".1" value={manualMinutes} onChange={setManualMinutes}/>}
        <div className="cad-actions">
         <button type="button" className="cad-primary" onClick={timer} disabled={!canTimer}><Timer size={16}/> Add tame timer</button>
         <button type="button" className="cad-secondary" onClick={openOriginal}><ChevronRight size={16}/> Open {category==='passive'?'passive':category==='specialty'?'specialty':'knockout'} planner</button>
         <a href={wikiUrl} target="_blank" rel="noreferrer" className="cad-secondary"><ExternalLink size={16}/> Verify on Wiki</a>
        </div>
       </Section>
      </>}
    </div>
   </div>
  </article>}
 </div>;
}
