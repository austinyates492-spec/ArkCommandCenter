import React from 'react';
import {Shield,Timer,Clock3,Server,Egg,Users,Activity,Calculator,Plus,Layers,ChevronRight,ArrowUpRight,Cloud,BookOpen,CheckCircle2} from 'lucide-react';
import './overview-dashboard.css';

const timerCategory=type=>{
 const t=String(type||'').toLowerCase();
 if(/matur|breed|incubat|hatch|gestat|imprint/.test(t))return 'breeding';
 if(/tam/.test(t))return 'taming';
 if(/craft|forg|smelt|cook/.test(t))return 'crafting';
 return 'custom';
};
const statusClass={'Available':'available','Contested':'contested','Locked Down':'locked','Unscouted':'unscouted'};
const stamp=ms=>{const seconds=Math.max(0,Math.ceil(ms/1000));return (Math.floor(seconds/86400)?Math.floor(seconds/86400)+'d ':'')+String(Math.floor(seconds%86400/3600)).padStart(2,'0')+':'+String(Math.floor(seconds%3600/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');};
const percent=(timer,now)=>Math.max(0,Math.min(100,(now-timer.created)/Math.max(1000,timer.end-timer.created)*100));
const isMaturation=timer=>timer.type==='Maturation'||(timerCategory(timer.type)==='breeding'&&/matur|raising|baby growth/i.test(timer.name)&&!/incubat|hatch|gestat|mating|cooldown/i.test(timer.name+' '+timer.type));

function ActiveTimer({timer,now}){
 const tone=timerCategory(timer.type),progress=percent(timer,now),phased=isMaturation(timer);
 return <article className={'overview-operation overview-operation-'+tone}>
  <div className="overview-operation-head">
   <div className="overview-operation-copy"><strong>{timer.name}</strong><span>{timer.type||'Custom'} · {timer.createdBy||'Tribe'}</span></div>
   <div className="overview-operation-clock" aria-label={'Time remaining '+stamp(timer.end-now)}>{stamp(timer.end-now)}</div>
  </div>
  <div className="overview-operation-progress"><strong>{progress.toFixed(1)}% complete</strong><span>{phased?(progress<10?'Baby':progress<50?'Juvenile':'Adolescent'):timer.end-now<=900000?'Finishing soon':'In progress'}</span></div>
  <div className="overview-operation-track" role="progressbar" aria-label={timer.name+' overall progress'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Number(progress.toFixed(1))}>
   <span style={{width:progress+'%'}}/>{phased&&<><i style={{left:'10%'}}/><i style={{left:'50%'}}/></>}
  </div>
  {phased&&<div className="overview-phase-labels"><span>10% Juvenile</span><span>50% Adolescent</span><span>100% Adult</span></div>}
 </article>;
}
function ServerCard({server}){
 const kind=statusClass[server.status]||'unscouted';
 return <div className="overview-server">
  <div className="overview-server-label"><strong>{server.map||'Unknown map'} · {server.name}</strong><small>{server.notes||'No scouting notes yet'}</small></div>
  <span className={'overview-server-status overview-status-'+kind}>{server.status||'Unscouted'}</span>
 </div>;
}

export default function OverviewDashboard({user,live,servers=[],rates,clusterLabel,now,onNavigate,onOpenTimer,onOpenTaming,isDesktopApp,adPlacement}){
 const timers=live.timers||[];
 const active=timers.filter(t=>t.end>now).sort((a,b)=>a.end-b.end);
 const upcoming=active.slice(0,3);
 const soon=active.filter(t=>t.end-now<=900000).length;
 const raising=active.filter(t=>isMaturation(t)).length;
 const available=servers.filter(s=>s.status==='Available').length;
 const crafting=live.crafting||[];
 // The backend has no durable activity-event history. Only show actual current records.
 const updates=[
  ...timers.filter(t=>Number.isFinite(t.created)).map(t=>({id:'t-'+t.id,at:t.created,label:'Timer created: '+t.name,detail:t.createdBy||'Tribe'})),
  ...servers.filter(s=>Number.isFinite(s.updated)).map(s=>({id:'s-'+s.id,at:s.updated,label:'Server intel: '+s.name,detail:s.updatedBy||s.map||'Tribe'}))
 ].sort((a,b)=>b.at-a.at).slice(0,3);
 const navigate=key=>onNavigate(key);
 return <div className="overview-dashboard">
  <section className="overview-command-hero" aria-label="Tribe operations center">
   <div className="overview-command-copy">
    <span className="overview-kicker">{user?.tribeName?user.tribeName.toUpperCase()+' / TRIBE HQ':'TRIBE OPERATIONS CENTER'}</span>
    <h1>Your tribe.<br/><em>Your command.</em></h1>
    {!user&&<p>Sign in to share progress with your tribe.</p>}
    <div className="overview-hero-actions">
     <button type="button" className="primary" onClick={onOpenTimer}><Plus size={17}/> New Tribe Timer</button>
     <button type="button" className="ghost" onClick={onOpenTaming}>Open Taming Lab <ChevronRight size={16}/></button>
    </div>
   </div>
   <div className="overview-command-emblem" aria-hidden="true"><Shield size={205} strokeWidth={1.2}/></div>
  </section>

  <div className="overview-metrics" aria-label="Tribe snapshot">
   <div className="overview-metric"><div className="overview-metric-title"><span>Active Timers</span><Clock3 size={18}/></div><strong>{active.length}</strong><small>{soon} finishing within 15 minutes</small></div>
   <div className="overview-metric"><div className="overview-metric-title"><span>Tracked Servers</span><Server size={18}/></div><strong>{servers.length}</strong><small>{available} marked available</small></div>
   <div className="overview-metric"><div className="overview-metric-title"><span>Raising Timers</span><Egg size={18}/></div><strong>{raising}</strong><small>Active maturation operations</small></div>
   <div className="overview-metric"><div className="overview-metric-title"><span>Tribe Crafting</span><Layers size={18}/></div><strong>{crafting.length}</strong><small>Shared recipe requests</small></div>
  </div>

  <div className="overview-command-columns">
   <section className="overview-command-panel" aria-label="Active operations">
    <div className="overview-panel-header"><h2>Active Operations</h2><button className="overview-text-link" type="button" onClick={()=>navigate('timers')}>View all <ArrowUpRight size={15}/></button></div>
    {upcoming.length?<div className="overview-operation-list">{upcoming.map(timer=><ActiveTimer key={timer.id} timer={timer} now={now}/>)}</div>:<div className="overview-empty"><Timer size={24}/><strong>No active timers</strong><span>Start a tame or breeding timer to see it here.</span><button type="button" className="ghost" onClick={onOpenTimer}>Create a timer</button></div>}
   </section>
   <section className="overview-command-panel" aria-label="Server intelligence">
    <div className="overview-panel-header"><h2>Server Intelligence</h2><button className="overview-text-link" type="button" onClick={()=>navigate('servers')}>View board <ArrowUpRight size={15}/></button></div>
    {servers.length?<div className="overview-server-list">{servers.slice(0,5).map(server=><ServerCard key={server.id} server={server}/>)}</div>:<div className="overview-empty"><Server size={24}/><strong>No tracked servers</strong><span>Scout your cluster and share the findings with your tribe.</span><button type="button" className="ghost" onClick={()=>navigate(user?'servers':'cloud')}>{user?'Open Server Intel':'Sign in to share'}</button></div>}
    <div className="overview-panel-footnote">Server statuses reflect your tribe's saved scouting reports, not automatic live population checks.</div>
   </section>
  </div>

  <div className="overview-command-columns overview-command-lower">
   <section className="overview-command-panel">
    <div className="overview-panel-header"><h2>Quick Actions</h2><span className="overview-panel-meta">MOST USED TOOLS</span></div>
    <div className="overview-quick-grid">
     <button type="button" onClick={onOpenTaming}><Calculator size={19}/> Plan a Tame <ChevronRight size={15}/></button>
     <button type="button" onClick={onOpenTimer}><Plus size={19}/> New Timer <ChevronRight size={15}/></button>
     <button type="button" onClick={()=>navigate('breeding')}><Egg size={19}/> Breeding Lab <ChevronRight size={15}/></button>
     <button type="button" onClick={()=>navigate('servers')}><Server size={19}/> Update Server <ChevronRight size={15}/></button>
    </div>
   </section>
   <section className="overview-command-panel" aria-label="Recent shared items">
    <div className="overview-panel-header"><h2>Recent Shared Items</h2><span className="overview-panel-meta">CURRENT RECORDS</span></div>
    {updates.length?<div className="overview-activity-list">{updates.map(item=><div className="overview-activity" key={item.id}><span className="overview-activity-dot"/><div><strong>{item.label}</strong><small>{item.detail} · {new Date(item.at).toLocaleString()}</small></div></div>)}</div>:<div className="overview-empty overview-empty-compact"><Activity size={21}/><strong>No shared updates yet</strong><span>Timer and server changes will appear here when your tribe starts using them.</span></div>}
    <div className="overview-panel-footnote">Shows latest saved timers and server records. A full event-history feed is not yet available.</div>
   </section>
  </div>
  {adPlacement||null}
 </div>;
}
