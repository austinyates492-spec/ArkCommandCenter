import React,{useState} from 'react';
import {Clock3,CheckCircle2,Trash2,Bell,Plus,Cloud,Upload,RefreshCcw} from 'lucide-react';

export function clock(ms){const s=Math.max(0,Math.ceil(ms/1000));return `${Math.floor(s/86400)?Math.floor(s/86400)+'d ':''}${String(Math.floor(s%86400/3600)).padStart(2,'0')}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
const legacy=()=>{try{const data=JSON.parse(localStorage.getItem('ark.timers')||'[]');return Array.isArray(data)?data:[];}catch{return [];}};

export default function LiveTimersPage({live,user,now,onAdd,onOpenAccount}){
 const [name,setName]=useState('Tribe reminder'),[minutes,setMinutes]=useState(30),[importing,setImporting]=useState(false);
 const [imported,setImported]=useState(()=>localStorage.getItem('ark.timersImportedV08')==='true');
 const active=live.timers.filter(t=>t.end>now),finished=live.timers.filter(t=>t.end<=now);
 const old=legacy().filter(t=>Number(t.end)>now&&t.name);
 const importOld=()=>{setImporting(true);void(async()=>{for(const timer of old)await live.addTimer(timer.name,(timer.end-Date.now())/60000,timer.type||'Imported');localStorage.setItem('ark.timersImportedV08','true');setImported(true);})().catch(()=>{}).finally(()=>setImporting(false));};
 return <><div className="pagetitle"><span className="eyebrow">OPERATIONS / SHARED COUNTDOWNS</span><h1>Tribe Live Timers</h1><p>Everyone in your tribe sees the same timers, with end times calculated by the server.</p></div>
 {!user?<section className="panel"><h2>Sign in for shared timers</h2><p>All new timers are live tribe operations. Sign in to create and view them.</p><button className="primary" onClick={onOpenAccount}><Cloud size={17}/> Open Tribe Cloud</button></section>:
 <><div className="notice">{live.status==='live'?'● Live stream connected.':`Cloud updates: ${live.status}.`} {old.length>0&&!imported&&<button className="ghost" disabled={importing} onClick={importOld}><Upload size={16}/> Import {old.length} old timers</button>}</div>{live.error&&<div className="notice">{live.error}</div>}
  <div className="two wideleft"><section className="panel"><div className="panelhead"><h2>Active Tribe Countdowns</h2><span className="badge green">{active.length} RUNNING</span></div>
  {active.length?active.map(t=><div className="timerrow" key={t.id}><div className="roundicon"><Clock3 size={19}/></div><div className="timerinfo"><strong>{t.name}</strong><small>{t.type} · {t.createdBy||'Tribe'} · {new Date(t.end).toLocaleString()}</small><div className="smalltrack"><div style={{width:`${Math.max(0,Math.min(100,(now-t.created)/(t.end-t.created)*100))}%`}}/></div></div><div className="timerend">{clock(t.end-now)}</div><button className="iconbtn" title="Remove for everyone" onClick={()=>void live.removeTimer(t.id).catch(()=>{})}><Trash2 size={17}/></button></div>):<div className="empty">No active tribe timers. Add one here or start one from a taming/breeding lab.</div>}
  {finished.length>0&&<><h3 className="sectioncap">COMPLETED</h3>{finished.slice(0,20).map(t=><div className="listrow" key={t.id}><CheckCircle2 size={18} color="#65cc9c"/><div><strong>{t.name}</strong><small>{t.type} · {t.createdBy||'Tribe'}</small></div><button className="iconbtn push" onClick={()=>void live.removeTimer(t.id).catch(()=>{})}><Trash2 size={16}/></button></div>)}</>}
  <button className="ghost" onClick={()=>void live.refresh('timers').catch(()=>{})}><RefreshCcw size={16}/> Refresh Timers</button></section>
  <section className="panel"><div className="panelhead"><h2>Quick Tribe Timer</h2></div><form onSubmit={e=>{e.preventDefault();onAdd(name,minutes,'Custom');}}><label className="field"><span>Timer name</span><input required value={name} onChange={e=>setName(e.target.value)}/></label><label className="field"><span>Duration (minutes)</span><input type="number" min="0.0167" step="any" max="525600" required value={minutes} onChange={e=>setMinutes(e.target.value)}/></label><button type="submit" className="primary full"><Plus size={17}/> Start For Entire Tribe</button></form><div className="notice"><Bell size={16}/> The countdown is shared immediately. Desktop or Discord notifications while the app is closed are not yet implemented.</div></section></div></>}
 </>;
}
