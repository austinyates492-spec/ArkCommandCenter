import React,{useMemo,useState} from 'react';
import {Search,Plus,Trash2,Cloud,RefreshCcw,Upload,ChevronDown,ChevronUp,MapPin,NotebookPen,ShieldAlert,Users,CheckCircle2,ClipboardList} from 'lucide-react';
import {maps} from './data';
import './server-intel-v2.css';

const statuses=['Available','Contested','Locked Down','Unscouted'];
const categories=['Major Tribe','Dangerous Area','General Intel'];
const legacy=()=>{try{const value=JSON.parse(localStorage.getItem('ark.servers')||'[]');return Array.isArray(value)?value:[];}catch{return [];}};
const stamp=value=>{if(!Number.isFinite(Number(value)))return 'Unknown date';return new Date(Number(value)).toLocaleString();};

export default function ServerIntelPage({live,user,servers=[],onOpenAccount}){
 const [form,setForm]=useState({map:'Ragnarok',name:'',status:'Unscouted',notes:''});
 const [filter,setFilter]=useState('All');
 const [mapFilter,setMapFilter]=useState('All');
 const [query,setQuery]=useState('');
 const [expanded,setExpanded]=useState({});
 const [drafts,setDrafts]=useState({});
 const [busy,setBusy]=useState(false);
 const [feedback,setFeedback]=useState('');
 const [imported,setImported]=useState(()=>localStorage.getItem('ark.serversImportedV08')==='true');
 const oldServers=legacy();
 const summary=useMemo(()=>Object.fromEntries(statuses.map(s=>[s,servers.filter(x=>x.status===s).length])),[servers]);
 const shown=servers.filter(s=>(filter==='All'||s.status===filter)&&(mapFilter==='All'||s.map===mapFilter)&&[s.map,s.name,s.notes,...(s.scoutingNotes||[]).map(n=>n.type+' '+n.text)].join(' ').toLowerCase().includes(query.toLowerCase()));
 const currentDraft=id=>drafts[id]||{type:'Dangerous Area',text:''};
 const run=async(task,success)=>{
  setBusy(true);setFeedback('');
  try{await task();setFeedback(success);return true;}
  catch(e){setFeedback('Update failed: '+e.message);return false;}
  finally{setBusy(false);}
 };
 const save=event=>{
  event.preventDefault();
  if(!user||!form.name.trim()||busy)return;
  void run(()=>live.saveServer(form),'Scouting report saved for your entire tribe.').then(ok=>{if(ok)setForm(p=>({...p,name:'',notes:''}));});
 };
 const importOld=()=>void run(async()=>{
   for(const s of oldServers)await live.saveServer(s);
   localStorage.setItem('ark.serversImportedV08','true');
   setImported(true);
 },'Previous local scouting entries imported into the tribe.');
 const changeStatus=(server,status)=>void run(
  ()=>live.saveServer({map:server.map,name:server.name,status,notes:server.notes||''}),
  server.name+' marked '+status+' for the entire tribe.'
 );
 const addNote=server=>{
  const draft=currentDraft(server.id);
  if(!draft.text.trim()||busy)return;
  void run(()=>live.addScoutingNote(server.id,draft.type,draft.text.trim()),'Scouting note added for '+server.name+'.').then(ok=>{if(!ok)return;
   setDrafts(p=>({...p,[server.id]:{...currentDraft(server.id),text:''}}));
  });
 };
 const removeNote=(server,note)=>void run(()=>live.removeScoutingNote(server.id,note.id),'Scouting note removed from '+server.name+'.');
 return <div className="intel-v2">
  <div className="pagetitle"><span className="eyebrow">COMMAND CENTER / CLUSTER INTELLIGENCE</span><h1>Server Intel <span className="intel-v2-new">NEW DESIGN</span></h1><p>Your tribe's tactical server scouting board. Mark dangerous areas without necessarily locking down an entire server.</p></div>
  {!user?<section className="panel intel-v2-signin"><Cloud size={28}/><h2>Tribe sign-in required</h2><p>Server statuses and scouting notes are stored in the shared tribe database.</p><button className="primary" onClick={onOpenAccount}><Cloud size={17}/> Open Tribe Cloud</button></section>:<>
   <div className="intel-v2-summary">
    {statuses.map((status,i)=><div className={'intel-v2-stat intel-v2-'+['available','contested','locked','unscouted'][i]} key={status}><span>{status}</span><strong>{summary[status]||0}</strong><small>{['Open for scouting','Activity reported','Restricted servers','Awaiting reports'][i]}</small></div>)}
   </div>
   <div className="intel-v2-layout">
    <section className="panel intel-v2-board">
     <div className="intel-v2-head"><h2>Server Scouting Board</h2><span className="intel-v2-pill">{shown.length} / {servers.length} SERVERS</span></div>
     <div className="intel-v2-controls">
      <div className="searchbox"><Search size={17}/><input aria-label="Search server intel" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search server, tribes, caves or notes..."/></div>
      <select aria-label="Filter by ARK map" value={mapFilter} onChange={e=>setMapFilter(e.target.value)}><option value="All">All Maps</option>{maps.map(m=><option key={m} value={m}>{m}</option>)}</select>
     </div>
     <div className="intel-v2-filters" aria-label="Filter by status">{['All',...statuses].map(s=><button key={s} type="button" className={filter===s?'selected':''} aria-pressed={filter===s} onClick={()=>setFilter(s)}>{s==='All'?'All Servers':s}</button>)}</div>
     <div className="intel-v2-cards">
     {shown.length?shown.map(server=>{
      const open=!!expanded[server.id];
      const notes=Array.isArray(server.scoutingNotes)?server.scoutingNotes:[];
      const count=notes.length+(server.notes?.trim()?1:0);
      const draft=currentDraft(server.id);
      const tone={'Available':'available','Contested':'contested','Locked Down':'locked','Unscouted':'unscouted'}[server.status]||'unscouted';
      return <article className={'intel-v2-card intel-v2-'+tone} key={server.id}>
       <div className="intel-v2-card-head">
        <div><strong>{server.name}</strong><span><MapPin size={13}/>{server.map}</span></div>
        <span className="intel-v2-status">{server.status}</span>
       </div>
       <div className="intel-v2-card-actions">
        <div className="intel-v2-quick-status" aria-label={'Status for '+server.name}>{statuses.map(s=><button key={s} type="button" disabled={busy} className={server.status===s?'selected':''} aria-pressed={server.status===s} onClick={()=>changeStatus(server,s)}>{s==='Locked Down'?'Locked':s==='Unscouted'?'Unknown':s}</button>)}</div>
        <button className="intel-v2-notes-toggle" type="button" aria-expanded={open} onClick={()=>setExpanded(p=>({...p,[server.id]:!open}))}><NotebookPen size={15}/> Notes ({count}) {open?<ChevronUp size={15}/>:<ChevronDown size={15}/>}</button>
       </div>
       <div className="intel-v2-meta">Last status report: {server.updatedBy||'Tribe'} · {stamp(server.updated)}</div>
       {open&&<div className="intel-v2-note-section">
        <div className="intel-v2-note-heading"><strong>Scouting Notes</strong><small>Shared with your tribe</small></div>
        {!!server.notes?.trim()&&<div className="intel-v2-note"><span className="intel-v2-note-category general">GENERAL INTEL · EXISTING NOTES</span><p>{server.notes}</p><small>Saved with original server report</small></div>}
        {notes.map(note=><div className="intel-v2-note" key={note.id}>
         <div className="intel-v2-note-row"><span className={'intel-v2-note-category '+(note.type==='Dangerous Area'?'danger':note.type==='Major Tribe'?'tribe':'general')}>{note.type.toUpperCase()}</span><button type="button" disabled={busy} title="Remove scouting note" aria-label={'Remove '+note.type+' note'} onClick={()=>removeNote(server,note)}><Trash2 size={14}/></button></div>
         <p>{note.text}</p><small>{note.updatedBy||'Tribe member'} · {stamp(note.created)}</small>
        </div>)}
        {!count&&<div className="empty">No scouting notes yet. Add a major tribe, dangerous area or general report below.</div>}
        <div className="intel-v2-note-editor">
         <label className="field"><span>Note category</span><select aria-label={'Note category for '+server.name} value={draft.type} onChange={e=>setDrafts(p=>({...p,[server.id]:{...draft,type:e.target.value}}))}>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
         <label className="field"><span>Scout report</span><textarea rows="3" maxLength="1500" aria-label={'New scouting note for '+server.name} value={draft.text} onChange={e=>setDrafts(p=>({...p,[server.id]:{...draft,text:e.target.value}}))} placeholder="Major tribes, dangerous caves, turret coverage, contested locations..."/></label>
         <button className="primary" disabled={busy||!draft.text.trim()} onClick={()=>addNote(server)}><Plus size={15}/> Add Scouting Note</button>
        </div>
       </div>}
      </article>;
     }):<div className="empty">No matching server intel. Adjust your map, status, or search filters.</div>}
     </div>
     <div className="intel-v2-board-foot"><button className="ghost" disabled={busy} onClick={()=>void run(()=>live.refresh('servers'),'Server intel refreshed.')}><RefreshCcw size={16}/> Refresh</button><span>{live.status==='live'?'● Live tribe sync connected':'Cloud status: '+live.status}</span></div>
    </section>
    <section className="panel intel-v2-report">
     <div className="intel-v2-head"><h2>Scouting Report</h2><span className="intel-v2-pill">TRIBE INTEL</span></div>
     <form onSubmit={save}>
      <label className="field"><span>Server name or number</span><input required maxLength="120" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. NOMADARK-1045"/></label>
      <label className="field"><span>ARK map</span><select value={form.map} onChange={e=>setForm(p=>({...p,map:e.target.value}))}>{maps.map(m=><option key={m}>{m}</option>)}</select></label>
      <label className="field"><span>Server status</span><select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label>
      <label className="field"><span>Initial server notes (optional)</span><textarea rows="3" maxLength="3000" value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Summary of overall server conditions. Categorized notes can be added from each server card."/></label>
      <button className="primary full" disabled={busy||!form.name.trim()} type="submit"><Plus size={16}/> Save for Entire Tribe</button>
     </form>
     <div className="intel-v2-help"><strong><ShieldAlert size={16}/> Dangerous areas ≠ locked servers</strong><p>Keep a server Available or Contested when only one cave or territory is defended. Log the specific danger under its expandable notes instead.</p></div>
     <div className="intel-v2-help"><strong><Users size={16}/> Shared scouting records</strong><p>Notes show their category, reporting member and date. The tribe receives live updates when reports are added or removed.</p></div>
     {!!oldServers.length&&!imported&&<button className="ghost intel-v2-import" disabled={busy} onClick={importOld}><Upload size={15}/> Import {oldServers.length} old local entries</button>}
     {feedback&&<div role="status" className="notice">{feedback}</div>}
     {live.error&&<div role="alert" className="notice">{live.error}</div>}
     <div className="intel-v2-report-footer">Server information is entered by your tribe, not automatically scanned from the game.</div>
    </section>
   </div>
  </>}
 </div>;
}
