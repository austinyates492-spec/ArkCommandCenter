import React,{useEffect,useState} from 'react';
import {Clock3,CheckCircle2,Trash2,Bell,BellOff,Volume2,Plus,Cloud,Upload,RefreshCcw,Egg,Crosshair,Anvil,Pencil,Users} from 'lucide-react';
import './live-timer-redesign.css';
export function clock(ms){const n=Math.max(0,Math.ceil(ms/1000));return (Math.floor(n/86400)?Math.floor(n/86400)+'d ':'')+String(Math.floor(n%86400/3600)).padStart(2,'0')+':'+String(Math.floor(n%3600/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}
const legacy=()=>{try{const data=JSON.parse(localStorage.getItem('ark.timers')||'[]');return Array.isArray(data)?data:[];}catch{return [];}};
const MAX=525600*60,valid=seconds=>Number.isSafeInteger(seconds)&&seconds>=1&&seconds<=MAX;
const category=type=>/matur|breed|incubat|hatch|gestat|imprint/i.test(type)?'breeding':/tam/i.test(type)?'taming':/craft|forg|smelt|cook/i.test(type)?'crafting':'custom';
const choices=[['Maturation','Breeding',Egg],['Taming','Taming',Crosshair],['Crafting','Crafting',Anvil],['Custom','Custom',Clock3]];
const growthStages=[{at:.1,name:'Juvenile (10%)'},{at:.5,name:'Adolescent (50%)'},{at:1,name:'Fully grown (100%)'}];
function DurationControl({seconds,onChange,label}){
 const h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=seconds%60;
 const change=(unit,value)=>{
  const n=value===''?0:Number(value);if(!Number.isFinite(n)||n<0)return;
  const v=Math.floor(n),next=unit==='h'?v*3600+m*60+s:unit==='m'?h*3600+Math.min(59,v)*60+s:h*3600+m*60+Math.min(59,v);
  if(next<=MAX)onChange(next);
 };
 return <div className="timer-duration-control">
  <div className="timer-duration-head"><strong>{label}</strong><strong className="timer-duration-readout">{clock(seconds*1000)}</strong></div>
  <input aria-label={label+' quick slider'} type="range" min="0" max="1440" step="5" value={Math.min(1440,Math.round(seconds/300)*5)} onChange={e=>onChange(Number(e.target.value)*60)}/>
  <div className="timer-range-labels"><span>0 min</span><span>12 hours</span><span>24 hours</span></div>
  <div className="timer-manual-heading">Or enter an exact duration</div>
  <div className="timer-duration-fields">
   <label className="field"><span>Hours</span><input type="number" min="0" max="8760" step="1" value={h} onChange={e=>change('h',e.target.value)}/></label>
   <label className="field"><span>Minutes</span><input type="number" min="0" max="59" step="1" value={m} onChange={e=>change('m',e.target.value)}/></label>
   <label className="field"><span>Seconds</span><input type="number" min="0" max="59" step="1" value={s} onChange={e=>change('s',e.target.value)}/></label>
  </div>
  <small>Slider: 5-minute steps up to 24 hours. Manual: exact seconds up to one year.</small>
 </div>;
}
function CategoryChoices({value,onChange}){
 return <div className="timer-category-choices" role="group" aria-label="Timer category">
 {choices.map(([kind,label,Icon])=><button key={kind} type="button" className={'timer-category timer-tone-'+category(kind)+(value===kind?' selected':'')} aria-pressed={value===kind} onClick={()=>onChange(kind)}><Icon size={18}/>{label}</button>)}
 </div>;
}
function CreateTimer({live,onTestSound}){
 const [name,setName]=useState('Tribe reminder'),[type,setType]=useState('Custom'),[seconds,setSeconds]=useState(1800),[sound,setSound]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState('');
 const submit=async e=>{
  e.preventDefault();if(!valid(seconds)||!name.trim()){setError('Enter a name and a duration between one second and one year.');return;}
  setSaving(true);setError('');
  try{await live.addTimer(name.trim(),seconds/60,type,sound);setName('Tribe reminder');setSeconds(1800);}
  catch(e){setError(e.message||'Could not create timer.');}finally{setSaving(false);}
 };
 return <section className="panel timer-create-panel"><div className="panelhead"><h2><Plus size={18}/> Quick Tribe Timer</h2><span className="badge gold">SHARED</span></div>
 <form className="timer-form" onSubmit={submit}>
  <CategoryChoices value={type} onChange={setType}/>
  <label className="field"><span>Timer name</span><input value={name} onChange={e=>setName(e.target.value)} maxLength="120" required/></label>
  <DurationControl seconds={seconds} onChange={setSeconds} label="Quick duration"/>
  <label className="quick-sound"><input type="checkbox" checked={sound} onChange={e=>setSound(e.target.checked)}/><Bell size={16}/> Play completion sound for me</label>
  <small className="timer-share-note"><Users size={14}/> Timers are shared with the whole tribe; sound preferences stay personal.</small>
  {error&&<div className="notice" role="alert">{error}</div>}
  <button className="primary full" type="submit" disabled={saving||!valid(seconds)||!name.trim()}><Plus size={16}/>{saving?'Saving…':'Start For Entire Tribe'}</button>
 </form>
 <button className="ghost timer-test-sound" type="button" onClick={onTestSound}><Volume2 size={16}/> Test alarm sound</button>
 </section>;
}
function TimerAdjustment({timer,now,live}){
 const remaining=Math.max(0,Math.ceil((timer.end-now)/1000)),total=Math.max(1,Math.round((timer.end-timer.created)/1000));
 const progress=Math.max(0,Math.min(100,(now-timer.created)/(timer.end-timer.created)*100)),complete=timer.end<=now;
 const [open,setOpen]=useState(false),[mode,setMode]=useState('remaining'),[seconds,setSeconds]=useState(Math.max(1,remaining));
 const [name,setName]=useState(timer.name),[type,setType]=useState(timer.type),[percent,setPercent]=useState(progress.toFixed(1));
 const [reopen,setReopen]=useState(false),[saving,setSaving]=useState(false),[error,setError]=useState('');
 useEffect(()=>{setSeconds(Math.max(1,Math.ceil((timer.end-Date.now())/1000)));setName(timer.name);setType(timer.type);setPercent(Math.max(0,Math.min(100,(Date.now()-timer.created)/Math.max(1000,timer.end-timer.created)*100)).toFixed(1));setReopen(false);setError('');},[timer.id,timer.created,timer.end,timer.name,timer.type]);
 const choose=m=>{setMode(m);setSeconds(m==='total'?total:Math.max(1,remaining));setError('');};
 const save=async()=>{
  if(!name.trim()){setError('Enter a timer name.');return;}
  if(complete&&!reopen){setError('Confirm reopening this completed timer.');return;}
  setSaving(true);setError('');
  try{
   if(mode==='progress'){
    const p=Number(percent);if(!Number.isFinite(p)||p<0||p>100)throw new Error('Progress must be 0–100%.');
    await live.adjustTimer(timer.id,total*(1-p/100)/60,timer.end);
   }else{
    if(!valid(seconds))throw new Error('Duration must be between one second and one year.');
    await live.editTimer(timer.id,{mode,minutes:seconds/60,expectedEnd:timer.end,name:name.trim(),type,reopen});
   }
   setOpen(false);
  }catch(e){setError(e.message||'Could not update shared timer.');}finally{setSaving(false);}
 };
 const extend=async minutes=>{
  setSaving(true);setError('');
  try{await live.editTimer(timer.id,{mode:'extend',minutes,expectedEnd:timer.end,name:timer.name,type:timer.type});}
  catch(e){setError(e.message||'Could not extend timer.');setOpen(true);}finally{setSaving(false);}
 };
 const next=timer.type==='Maturation'?growthStages.find(stage=>progress/100<stage.at):null;
 return <div className="timer-edit-area">
  {next&&<small className="timer-growth-note">Next: {next.name} in {clock(timer.created+total*1000*next.at-now)}</small>}
  <div className="timer-inline-actions">
   <button className="ghost" type="button" aria-expanded={open} onClick={()=>setOpen(!open)}><Pencil size={14}/>{open?'Close editor':'Edit timer'}</button>
   {!complete&&[5,15,60].map(m=><button key={m} type="button" className="timer-extend-btn" disabled={saving} onClick={()=>extend(m)}>+{m===60?'1h':m+'m'}</button>)}
  </div>
  {open&&<div className="timer-editor">
   <h3><Pencil size={16}/> Edit shared timer</h3>
   <label className="field"><span>Name</span><input value={name} maxLength="120" onChange={e=>setName(e.target.value)}/></label>
   <label className="field"><span>Category</span><select value={type} onChange={e=>setType(e.target.value)}>{!choices.some(c=>c[0]===type)&&<option value={type}>{type}</option>}{choices.map(c=><option key={c[0]} value={c[0]}>{c[1]}</option>)}</select></label>
   <div className="timer-edit-modes" role="group" aria-label="Timer adjustment method">
    <button type="button" aria-pressed={mode==='remaining'} className={mode==='remaining'?'selected':''} onClick={()=>choose('remaining')}>Time remaining</button>
    <button type="button" aria-pressed={mode==='total'} className={mode==='total'?'selected':''} onClick={()=>choose('total')}>Total duration</button>
    {timer.type==='Maturation'&&<button type="button" aria-pressed={mode==='progress'} className={mode==='progress'?'selected':''} onClick={()=>choose('progress')}>Growth %</button>}
   </div>
   {mode==='progress'?<>
    <label className="field"><span>Growth progress: {percent}%</span><input type="range" min="0" max="100" step="0.1" value={Number(percent)||0} onChange={e=>setPercent(e.target.value)}/></label>
    <label className="field"><span>Exact progress (%)</span><input type="number" min="0" max="100" step="0.1" value={percent} onChange={e=>setPercent(e.target.value)}/></label>
    <small>Preserves percentage-based maturation correction.</small>
   </>:<DurationControl seconds={seconds} onChange={setSeconds} label={mode==='total'?'Total duration':'Time remaining'}/>}
   <div className="timer-edit-preview"><span>Current: <b>{clock(remaining*1000)}</b></span><span>New remaining: <b>{clock(mode==='total'?Math.max(0,timer.created+seconds*1000-now):mode==='progress'?total*1000*(1-(Number(percent)||0)/100):seconds*1000)}</b></span></div>
   {complete&&<label className="quick-sound"><input type="checkbox" checked={reopen} onChange={e=>setReopen(e.target.checked)}/> Reopen this completed timer for the tribe</label>}
   {error&&<div className="notice" role="alert">{error}</div>}
   <button type="button" className="primary" disabled={saving||(complete&&!reopen)} onClick={save}>{saving?'Saving…':'Save for entire tribe'}</button>
  </div>}
  {!open&&error&&<div className="notice" role="alert">{error}</div>}
 </div>;
}
function TimerCard({timer,live,now,completed=false}){
 const duration=Math.max(1000,timer.end-timer.created),progress=Math.max(0,Math.min(100,(now-timer.created)/duration*100));
 const tone=category(timer.type),enabled=live.timerSounds[timer.id]!==false;
 const Icon=tone==='breeding'?Egg:tone==='taming'?Crosshair:tone==='crafting'?Anvil:Clock3;
 return <article className={'timer-operation timer-tone-'+tone+(completed?' timer-completed':'')}>
  <div className="timer-operation-main"><div className="timer-operation-icon"><Icon size={22}/></div>
   <div className="timer-operation-name"><strong>{timer.name}</strong><small>{timer.type} · {timer.createdBy||'Tribe'}</small></div>
   <div className="timer-operation-countdown"><strong>{clock(timer.end-now)}</strong><small>{completed?'Completed':'Remaining'}</small></div>
  </div>
  <div className="timer-progress-track" role="progressbar" aria-label={timer.name+' progress'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><span style={{width:progress+'%'}}/></div>
  <div className="timer-progress-caption"><span>{Math.round(progress)}% complete</span><span>{completed?'FINISHED':tone.toUpperCase()}</span></div>
  <TimerAdjustment timer={timer} now={now} live={live}/>
  <div className="timer-operation-footer">
   <button type="button" className={'soundtoggle '+(enabled?'sound-on':'sound-off')} disabled={!live.timerSoundsReady} aria-pressed={enabled} onClick={()=>void live.setTimerSound(timer.id,!enabled).catch(()=>{})}>{enabled?<Bell size={15}/>:<BellOff size={15}/>} Sound {enabled?'On':'Off'}</button>
   <small>{new Date(timer.end).toLocaleString()}</small>
   <button type="button" className="iconbtn" title="Remove for everyone" aria-label={'Remove '+timer.name+' for everyone'} onClick={()=>void live.removeTimer(timer.id).catch(()=>{})}><Trash2 size={16}/></button>
  </div>
 </article>;
}
export default function LiveTimersPage({live,user,now,onAdd,onOpenAccount,onTestSound}){
 const [filter,setFilter]=useState('all'),[importing,setImporting]=useState(false);
 const [imported,setImported]=useState(()=>localStorage.getItem('ark.timersImportedV08')==='true');
 const active=live.timers.filter(t=>t.end>now),finished=live.timers.filter(t=>t.end<=now);
 const filtered=active.filter(t=>filter==='all'||category(t.type)===filter);
 const old=legacy().filter(t=>Number(t.end)>now&&t.name);
 const importOld=()=>{setImporting(true);void(async()=>{for(const timer of old)await live.addTimer(timer.name,(timer.end-Date.now())/60000,timer.type||'Imported');localStorage.setItem('ark.timersImportedV08','true');setImported(true);})().catch(()=>{}).finally(()=>setImporting(false));};
 return <><div className="pagetitle"><span className="eyebrow">OPERATIONS / SHARED COUNTDOWNS</span><h1>Tribe Live Timers</h1><p>Create and edit shared countdowns using a slider or exact hours, minutes and seconds. Each activity has its own color.</p></div>
 {!user?<section className="panel"><h2>Sign in for shared timers</h2><p>Sign in to create and manage live tribe operations.</p><button className="primary" onClick={onOpenAccount}><Cloud size={17}/> Open Tribe Cloud</button></section>:
 <><div className="notice">{live.status==='live'?'● Live stream connected.':'Cloud updates: '+live.status+'.'} {old.length>0&&!imported&&<button className="ghost" disabled={importing} onClick={importOld}><Upload size={16}/> Import {old.length} old timers</button>}</div>{live.error&&<div className="notice" role="alert">{live.error}</div>}
 <div className="timer-summary-grid"><div><Clock3 size={18}/><strong>{active.length}</strong><span>Active</span></div><div><Bell size={18}/><strong>{active.filter(t=>t.end-now<=900000).length}</strong><span>Finishing soon</span></div><div><Users size={18}/><strong>{live.timers.length}</strong><span>Tribe operations</span></div></div>
 <div className="timer-page-grid">
  <section className="panel timer-operations-panel"><div className="panelhead"><h2>Active Tribe Countdowns</h2><span className="badge green">{active.length} RUNNING</span></div>
   <div className="timer-filters" role="group" aria-label="Filter timers">{[{value:'all',label:'All'},...choices.map(c=>({value:category(c[0]),label:c[1]}))].map(item=><button type="button" key={item.value} className={filter===item.value?'selected':''} aria-pressed={filter===item.value} onClick={()=>setFilter(item.value)}>{item.label}</button>)}</div>
   <div className="timer-operation-list">{filtered.length?filtered.map(t=><TimerCard key={t.id} timer={t} live={live} now={now}/>):<div className="empty">No active timers in this category. Add one or start a tame/breeding timer.</div>}</div>
   {finished.length>0&&<><h3 className="sectioncap">COMPLETED</h3><div className="timer-operation-list">{finished.slice(0,20).map(t=><TimerCard key={t.id} timer={t} live={live} now={now} completed/>)}</div></>}
   <button className="ghost" onClick={()=>void live.refresh('timers').catch(()=>{})}><RefreshCcw size={16}/> Refresh Timers</button>
  </section>
  <CreateTimer live={live} onTestSound={onTestSound}/>
 </div>
 <div className="notice"><Bell size={16}/> Timers sync live across the tribe. Sounds are individual and play while the app is open; closed-app and Discord alerts are not yet supported.</div></>}
 </>;
}
