import React,{useEffect,useState} from 'react';
import {Clock3,CheckCircle2,Trash2,Bell,BellOff,Volume2,Plus,Cloud,Upload,RefreshCcw} from 'lucide-react';

export function clock(ms){const s=Math.max(0,Math.ceil(ms/1000));return `${Math.floor(s/86400)?Math.floor(s/86400)+'d ':''}${String(Math.floor(s%86400/3600)).padStart(2,'0')}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
const legacy=()=>{try{const data=JSON.parse(localStorage.getItem('ark.timers')||'[]');return Array.isArray(data)?data:[];}catch{return [];}};


const growthStages=[
 {at:0.1,name:'Juvenile (10%)'},
 {at:0.5,name:'Adolescent (50%)'},
 {at:1,name:'Fully grown (100%)'}
];
function TimerAdjustment({timer,now,live}){
 const duration=Math.max(1000,timer.end-timer.created);
 const currentRemaining=Math.max(0,(timer.end-now)/60000);
 const currentProgress=Math.max(0,Math.min(100,(now-timer.created)/duration*100));
 const [open,setOpen]=useState(false);
 const [progress,setProgress]=useState(currentProgress);
 const [manualPercent,setManualPercent]=useState(currentProgress.toFixed(1));
 const [saving,setSaving]=useState(false);
 const [message,setMessage]=useState('');
 useEffect(()=>{setProgress(Math.max(0,Math.min(100,(Date.now()-timer.created)/Math.max(1000,timer.end-timer.created)*100)));setManualPercent(Math.max(0,Math.min(100,(Date.now()-timer.created)/Math.max(1000,timer.end-timer.created)*100)).toFixed(1));setMessage('');},[timer.created,timer.end]);
 const isGrowth=timer.type==='Maturation';
 const next=isGrowth?growthStages.find(stage=>currentProgress/100<stage.at):null;
 const nextTime=next?timer.created+duration*next.at:null;
 const enteredPercent=manualPercent.trim()===''?NaN:Number(manualPercent);
 const save=async()=>{
  if(!Number.isFinite(enteredPercent)||enteredPercent<0||enteredPercent>100){setMessage('Enter a valid growth or timer progress percentage from 0 to 100.');return;}
  const remainingMinutes=duration*(1-enteredPercent/100)/60000;
  setSaving(true);setMessage('');
  try{await live.adjustTimer(timer.id,remainingMinutes,timer.end);setOpen(false);}
  catch(error){setMessage(error.message||'Could not save this adjustment.');}
  finally{setSaving(false);}
 };
 return <div className="timer-adjustment">
  {isGrowth&&<div className="notice" style={{marginTop:8}}>
   <strong>Growth: {currentProgress.toFixed(1)}%</strong> · {next?<>Next: {next.name} in {clock(nextTime-now)} ({new Date(nextTime).toLocaleString()})</>:'All growth stages completed'}
  </div>}
  <button className="ghost" type="button" aria-expanded={open} onClick={()=>setOpen(value=>!value)}>{open?'Close adjustment':'Adjust time / progress'}</button>
  {open&&<div className="timer-adjust-controls">
   <label className="field"><span>Progress: {Number(progress).toFixed(1)}%</span>
    <input type="range" min="0" max="100" step="0.1" value={progress} onChange={event=>{const p=Number(event.target.value);setProgress(p);setManualPercent(p.toFixed(1));}}/>
   </label>
   <label className="field"><span>Progress percentage (manual entry, %)</span>
    <input type="number" min="0" max="100" step="0.1" value={manualPercent} onChange={event=>{setManualPercent(event.target.value);const v=Number(event.target.value);if(event.target.value!==''&&Number.isFinite(v))setProgress(Math.max(0,Math.min(100,v)));}}/>
   </label>
   <small>Slide or type the creature's current growth percentage (0–100%). Both inputs remain synchronized. The original timer duration determines remaining time. Saving updates this shared timer for the whole tribe.</small>
   {message&&<div className="notice" role="alert">{message}</div>}
   <button className="primary" type="button" disabled={saving} onClick={save}>{saving?'Saving…':'Save for entire tribe'}</button>
  </div>}
 </div>;
}

export default function LiveTimersPage({live,user,now,onAdd,onOpenAccount,onTestSound}){
 const [name,setName]=useState('Tribe reminder'),[minutes,setMinutes]=useState(30),[importing,setImporting]=useState(false);
 const [quickSound,setQuickSound]=useState(true);
 const [imported,setImported]=useState(()=>localStorage.getItem('ark.timersImportedV08')==='true');
 const active=live.timers.filter(t=>t.end>now),finished=live.timers.filter(t=>t.end<=now);
 const old=legacy().filter(t=>Number(t.end)>now&&t.name);
 const importOld=()=>{setImporting(true);void(async()=>{for(const timer of old)await live.addTimer(timer.name,(timer.end-Date.now())/60000,timer.type||'Imported');localStorage.setItem('ark.timersImportedV08','true');setImported(true);})().catch(()=>{}).finally(()=>setImporting(false));};
 return <><div className="pagetitle"><span className="eyebrow">OPERATIONS / SHARED COUNTDOWNS</span><h1>Tribe Live Timers</h1><p>Everyone in your tribe sees the same timers. Adjust them with a progress slider or manual percentage entry; raising timers also show the next growth milestone.</p></div>
 {!user?<section className="panel"><h2>Sign in for shared timers</h2><p>All new timers are live tribe operations. Sign in to create and view them.</p><button className="primary" onClick={onOpenAccount}><Cloud size={17}/> Open Tribe Cloud</button></section>:
 <><div className="notice">{live.status==='live'?'● Live stream connected.':`Cloud updates: ${live.status}.`} {old.length>0&&!imported&&<button className="ghost" disabled={importing} onClick={importOld}><Upload size={16}/> Import {old.length} old timers</button>}</div>{live.error&&<div className="notice">{live.error}</div>}
  <div className="two wideleft"><section className="panel"><div className="panelhead"><h2>Active Tribe Countdowns</h2><span className="badge green">{active.length} RUNNING</span></div>
  {active.length?active.map(t=>{const enabled=live.timerSounds[t.id]!==false;return <div className="timerrow" key={t.id}><div className="roundicon"><Clock3 size={19}/></div><div className="timerinfo"><strong>{t.name}</strong><small>{t.type} · {t.createdBy||'Tribe'} · {new Date(t.end).toLocaleString()}</small><div className="smalltrack"><div style={{width:`${Math.max(0,Math.min(100,(now-t.created)/(t.end-t.created)*100))}%`}}/></div><TimerAdjustment key={t.id} timer={t} now={now} live={live}/></div><div className="timerend">{clock(t.end-now)}</div><button type="button" className={'soundtoggle '+(enabled?'sound-on':'sound-off')} disabled={!live.timerSoundsReady} aria-pressed={enabled} title={enabled?'Mute this timer for your account only':'Enable this timer sound for your account'} onClick={()=>void live.setTimerSound(t.id,!enabled).catch(()=>{})}>{enabled?<Bell size={16}/>:<BellOff size={16}/>}<span>Sound {enabled?'On':'Off'}</span></button><button className="iconbtn" title="Remove for everyone" onClick={()=>void live.removeTimer(t.id).catch(()=>{})}><Trash2 size={17}/></button></div>;}):<div className="empty">No active tribe timers. Add one here or start one from a taming/breeding lab.</div>}
  {finished.length>0&&<><h3 className="sectioncap">COMPLETED</h3>{finished.slice(0,20).map(t=><div className="listrow" key={t.id}><CheckCircle2 size={18} color="#65cc9c"/><div><strong>{t.name}</strong><small>{t.type} · {t.createdBy||'Tribe'}</small><TimerAdjustment key={t.id} timer={t} now={now} live={live}/></div><button className="iconbtn push" onClick={()=>void live.removeTimer(t.id).catch(()=>{})}><Trash2 size={16}/></button></div>)}</>}
  <button className="ghost" onClick={()=>void live.refresh('timers').catch(()=>{})}><RefreshCcw size={16}/> Refresh Timers</button></section>
  <section className="panel"><div className="panelhead"><h2>Quick Tribe Timer</h2></div><form onSubmit={e=>{e.preventDefault();onAdd(name,minutes,'Custom',quickSound);}}><label className="field"><span>Timer name</span><input required value={name} onChange={e=>setName(e.target.value)}/></label><label className="field"><span>Duration (minutes)</span><input type="number" min="0.0167" step="any" max="525600" required value={minutes} onChange={e=>setMinutes(e.target.value)}/></label><label className="quick-sound"><input type="checkbox" checked={quickSound} onChange={e=>setQuickSound(e.target.checked)}/><Bell size={17}/> Play completion sound for me</label><button type="submit" className="primary full"><Plus size={17}/> Start For Entire Tribe</button></form><button type="button" className="ghost timer-test-sound" onClick={onTestSound}><Volume2 size={16}/> Test alarm sound</button><div className="notice"><Bell size={16}/> Timers and end times sync live for your tribe. Each member controls sound separately for each timer, and those preferences follow their account. Sounds play while the desktop app is open; Discord and closed-app notifications are not yet supported.</div></section></div></>}
 </>;
}
