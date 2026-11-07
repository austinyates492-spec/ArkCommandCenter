import React,{useState} from 'react';
import {Search,Plus,Trash2,Cloud,RefreshCcw,Upload} from 'lucide-react';
import {maps} from './data';

const statuses=['Available','Contested','Locked Down','Unscouted'];
const colors={'Available':'green','Contested':'gold','Locked Down':'red','Unscouted':'muted'};
const legacy=()=>{try{const value=JSON.parse(localStorage.getItem('ark.servers')||'[]');return Array.isArray(value)?value:[];}catch{return [];}};

export default function ServerIntelPage({live,user,servers,onOpenAccount}){
 const [form,setForm]=useState({map:'Ragnarok',name:'',status:'Unscouted',notes:''});
 const [filter,setFilter]=useState('All'),[query,setQuery]=useState(''),[saving,setSaving]=useState(false);
 const [imported,setImported]=useState(()=>localStorage.getItem('ark.serversImportedV08')==='true');
 const oldServers=legacy();
 const shown=servers.filter(s=>(filter==='All'||s.status===filter)&&`${s.map} ${s.name} ${s.notes}`.toLowerCase().includes(query.toLowerCase()));
 const save=e=>{e.preventDefault();if(!user||!form.name.trim())return;setSaving(true);void live.saveServer(form).then(()=>setForm(p=>({...p,name:'',notes:''}))).catch(()=>{}).finally(()=>setSaving(false));};
 const importOld=()=>{setSaving(true);void(async()=>{for(const s of oldServers)await live.saveServer(s);localStorage.setItem('ark.serversImportedV08','true');setImported(true);})().catch(()=>{}).finally(()=>setSaving(false));};
 return <><div className="pagetitle"><span className="eyebrow">CLUSTER INTELLIGENCE / LIVE</span><h1>Server Tracker</h1><p>Every server status and scouting note is shared instantly with all tribe accounts.</p></div>
  {!user?<section className="panel"><h2>Tribe sign-in required</h2><p>Server intel now lives in the shared database.</p><button className="primary" onClick={onOpenAccount}><Cloud size={17}/> Open Tribe Cloud</button></section>:
  <><div className="notice">{live.status==='live'?'● Live tribe updates are connected.':'Shared data is refreshing through the cloud.'} {oldServers.length>0&&!imported&&<button className="ghost" disabled={saving} onClick={importOld}><Upload size={15}/> Import {oldServers.length} old local entries</button>}</div>
  {live.error&&<div className="notice">{live.error}</div>}
  <div className="two wideleft"><section className="panel"><div className="panelhead"><h2>Tracked Servers</h2><span className="badge green">{shown.length} SHARED</span></div><div className="filters"><div className="searchbox"><Search size={17}/><input placeholder="Search server, map or notes..." value={query} onChange={e=>setQuery(e.target.value)}/></div><select value={filter} onChange={e=>setFilter(e.target.value)}>{['All',...statuses].map(s=><option key={s}>{s}</option>)}</select></div>
   {shown.length?<div className="tablewrap"><table><thead><tr><th>SERVER</th><th>MAP</th><th>STATUS</th><th>NOTES</th><th>UPDATED BY</th><th/></tr></thead><tbody>{shown.map(s=><tr key={s.id}><td><strong>{s.name}</strong></td><td>{s.map}</td><td><span className={'badge '+colors[s.status]}>{s.status}</span></td><td className="truncate">{s.notes||'—'}</td><td>{s.updatedBy||'Tribe'}</td><td><button className="iconbtn" title="Remove server" onClick={()=>void live.removeServer(s.id).catch(()=>{})}><Trash2 size={16}/></button></td></tr>)}</tbody></table></div>:<div className="empty">No matching server intel yet.</div>}
   <button className="ghost" onClick={()=>void live.refresh('servers').catch(()=>{})}><RefreshCcw size={16}/> Refresh</button>
  </section><section className="panel"><div className="panelhead"><h2>Add or Update Server</h2></div><form onSubmit={save}><label className="field"><span>Map</span><select value={form.map} onChange={e=>setForm(p=>({...p,map:e.target.value}))}>{maps.map(m=><option key={m}>{m}</option>)}</select></label><label className="field"><span>Server name / number</span><input required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. NA-PVP-1045"/></label><label className="field"><span>Status</span><select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label><label className="field"><span>Scouting notes</span><textarea rows="4" value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></label><button className="primary full" type="submit" disabled={saving}><Plus size={16}/> Save for Entire Tribe</button></form></section></div></>}
 </>;
}
