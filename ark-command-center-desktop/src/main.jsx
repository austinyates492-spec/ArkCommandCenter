import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {LayoutDashboard,Compass,Timer,Settings,Shield,Search,Plus,Trash2,ExternalLink,ChevronRight,Server,Activity,Egg,Calculator,CheckCircle2,Clock3,MapPin,Bell,Save,Layers} from 'lucide-react';
import ResourcePage from './ResourcePage';
import SpawnPage from './SpawnPage';
import TamingLab from './TamingLab';
import SpecialtyLab from './SpecialtyLab';
import BreedingLab from './BreedingLab';
import PassiveLab from './PassiveLab';
import CoveragePanel from './CoveragePanel';
import CraftingPage from './CraftingPage';
import ThemePicker from './ThemePicker';
import ClusterSettings from './ClusterSettings';
import {migrateOldRatePreset} from './nomadark-profile.js';
import {species,maps,tameCreatures,defaults,hoursText,creatureSpawnUrl} from './data';
import './style.css';
import './maps.css';
import './resources.css';

const nav=[['overview','Overview',LayoutDashboard],['taming','Taming Lab',Calculator],['specialty','Specialty Taming Lab',Shield],['passive','Passive Taming Lab',Activity],['breeding','Breeding Lab',Egg],['crafting','Crafting Calculator',Layers],['servers','Server Intel',Server],['maps','Spawn Maps',Compass],['resources','Resource Atlas',Layers],['timers','Live Timers',Timer],['settings','Settings',Settings]];
const statusColors={'Available':'green','Contested':'gold','Locked Down':'red','Unscouted':'muted'};
function useStored(key,initial){const [value,setValue]=useState(()=>{try{return JSON.parse(localStorage.getItem(key))??initial}catch{return initial}});useEffect(()=>localStorage.setItem(key,JSON.stringify(value)),[key,value]);return [value,setValue]}
function Badge({children,tone='green'}){return <span className={'badge '+tone}>{children}</span>}
function Panel({title,aside,children,className=''}){return <section className={'panel '+className}><div className="panelhead"><h2>{title}</h2>{aside}</div>{children}</section>}
function Field({label,children}){return <label className="field"><span>{label}</span>{children}</label>}
function App(){
 const [page,setPage]=useState('overview'),[savedRates,setRates]=useStored('ark.rates',defaults),[servers,setServers]=useStored('ark.servers',[]),[timers,setTimers]=useStored('ark.timers',[]),[theme,setTheme]=useStored('ark.theme','emerald'),[now,setNow]=useState(Date.now());
 const rates=savedRates;
 useEffect(()=>{
  try{
   if(localStorage.getItem('ark.ratePresetVersion')==='nomadark-2026-11-06-v2')return;
   setRates(previous=>migrateOldRatePreset(previous,defaults));
   localStorage.setItem('ark.ratePresetVersion','nomadark-2026-11-06-v2');
  }catch{/* Without local storage, keep current rate input and run locally. */}
 },[setRates]);
 const [selectedMap,setSelectedMap]=useState('The Island'),[mapCreature,setMapCreature]=useState('Rex');
 const [form,setForm]=useState({map:'Ragnarok',name:'',status:'Unscouted',notes:''}),[query,setQuery]=useState(''),[filter,setFilter]=useState('All');
 useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id)},[]);
 const active=timers.filter(t=>t.end>now),finished=timers.filter(t=>t.end<=now);
 const addTimer=(name,minutes,type='Custom')=>{const mins=Number(minutes);if(!Number.isFinite(mins)||mins<=0)return;setTimers(p=>[{id:crypto.randomUUID(),name,type,created:Date.now(),end:Date.now()+mins*60000},...p]);setPage('timers')};
 const shownServers=servers.filter(s=>(filter==='All'||s.status===filter)&&`${s.map} ${s.name} ${s.notes}`.toLowerCase().includes(query.toLowerCase()));
 const addServer=e=>{e.preventDefault();if(!form.name.trim())return;setServers(p=>[{...form,id:crypto.randomUUID(),updated:Date.now()},...p.filter(s=>!(s.name.toLowerCase()===form.name.trim().toLowerCase()&&s.map===form.map))]);setForm(p=>({...p,name:'',notes:''}))};
 const pageName=nav.find(x=>x[0]===page)?.[1]||'Overview';
 return <div className="shell" data-theme={theme}>
  <aside className="sidebar"><div className="brand"><div className="brandmark"><Shield size={24}/></div><div><strong>ARK <em>COMMAND</em></strong><small>CENTER // TRIBE EDITION</small></div></div>
  <div className="sidegroup">WORKSPACE</div><nav>{nav.map(([key,label,Icon])=><button key={key} className={'navitem '+(page===key?'selected':'')} onClick={()=>setPage(key)}><Icon size={18}/><span>{label}</span>{key==='timers'&&active.length>0?<b className="counter">{active.length}</b>:null}</button>)}</nav>
  <div className="sidebottom"><div className="live-dot"/><span>LOCAL WORKSPACE<br/><small>Private tribe build</small></span></div></aside>
  <main className="main"><header className="topbar"><div className="breadcrumbs">ARK COMMAND CENTER <ChevronRight size={15}/> <strong>{pageName.toUpperCase()}</strong></div><div className="topright"><Badge tone="green">● NOMADARK · {rates.taming}× TAME</Badge><div className="avatar">AY</div></div></header>
  <div className="content">
  {page==='overview'&&<><div className="hero"><div className="heroeyebrow">WELCOME BACK, SURVIVOR</div><h1>Your tribe.<br/><span>Your command.</span></h1><p>Every tame, timer and server decision in one place. Built for your private ARK squad.</p><div className="heroactions"><button className="primary" onClick={()=>setPage('taming')}>Open Taming Lab <ChevronRight size={17}/></button><button className="ghost" onClick={()=>setPage('servers')}>View Servers</button></div><div className="heroart">◈</div></div>
   <div className="metrics"><div className="metric"><span><Server size={18}/> Tracked Servers</span><strong>{servers.length}</strong><small>Scouted locations</small></div><div className="metric"><span><Clock3 size={18}/> Active Timers</span><strong>{active.length}</strong><small>Counting down</small></div><div className="metric"><span><Egg size={18}/> Supported Species</span><strong>{Object.keys(species).length}</strong><small>Validated breeding baselines</small></div><div className="metric"><span><Activity size={18}/> Taming Rate</span><strong>{rates.taming}×</strong><small>Default cluster multiplier</small></div></div>
   <div className="two"><Panel title="Active Operations" aside={<button className="subtlebtn" onClick={()=>setPage('timers')}>View all →</button>}>{active.length?active.slice(0,4).map(t=><div className="listrow" key={t.id}><div className="roundicon"><Timer size={19}/></div><div><strong>{t.name}</strong><small>{t.type}</small></div><div className="push countdown">{clock(t.end-now)}</div></div>):<div className="empty">No active operations. Start a tame or raising timer to see it here.</div>}</Panel><Panel title="Server Intelligence" aside={<button className="subtlebtn" onClick={()=>setPage('servers')}>Manage →</button>}>{servers.length?servers.slice(0,4).map(s=><div className="listrow" key={s.id}><div className="roundicon"><Server size={17}/></div><div><strong>{s.name}</strong><small>{s.map}</small></div><div className="push"><Badge tone={statusColors[s.status]}>{s.status}</Badge></div></div>):<div className="empty">No servers tracked yet. Add your first server to start scouting.</div>}</Panel></div></>}
  {page==='taming'&&<TamingLab rates={rates} onTimer={addTimer}/>}
  {page==='specialty'&&<SpecialtyLab rates={rates} onTimer={addTimer}/>}
  {page==='passive'&&<PassiveLab rates={rates} onTimer={addTimer}/>}
  {page==='breeding'&&<BreedingLab rates={rates} onTimer={addTimer}/>}
  {page==='servers'&&<><div className="pagetitle"><span className="eyebrow">CLUSTER INTELLIGENCE / 03</span><h1>Server Tracker</h1><p>Mark the servers your tribe has scouted. Local records are editable and saved on this computer.</p></div><div className="two wideleft"><Panel title="Tracked Servers" aside={<Badge>{shownServers.length} RESULTS</Badge>}><div className="filters"><div className="searchbox"><Search size={17}/><input placeholder="Search server, map or notes..." value={query} onChange={e=>setQuery(e.target.value)}/></div><select value={filter} onChange={e=>setFilter(e.target.value)}>{['All','Available','Contested','Locked Down','Unscouted'].map(s=><option key={s}>{s}</option>)}</select></div>{shownServers.length?<div className="tablewrap"><table><thead><tr><th>SERVER</th><th>MAP</th><th>STATUS</th><th>NOTES</th><th/></tr></thead><tbody>{shownServers.map(s=><tr key={s.id}><td><strong>{s.name}</strong></td><td>{s.map}</td><td><Badge tone={statusColors[s.status]}>{s.status}</Badge></td><td className="truncate">{s.notes||'—'}</td><td><button className="iconbtn" aria-label="Remove server" onClick={()=>setServers(p=>p.filter(x=>x.id!==s.id))}><Trash2 size={16}/></button></td></tr>)}</tbody></table></div>:<div className="empty">No matching servers yet.</div>}</Panel><Panel title="Add or Update Server"><form onSubmit={addServer}><Field label="Map"><select value={form.map} onChange={e=>setForm(p=>({...p,map:e.target.value}))}>{maps.map(m=><option key={m}>{m}</option>)}</select></Field><Field label="Server name / number"><input required placeholder="e.g. NA-PVP-1045" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></Field><Field label="Status"><select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>{['Available','Contested','Locked Down','Unscouted'].map(s=><option key={s}>{s}</option>)}</select></Field><Field label="Scouting notes"><textarea rows="4" placeholder="Tribe name, defenses, available caves..." value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></Field><button className="primary full" type="submit"><Plus size={17}/> Save Server</button></form></Panel></div></>}
  {page==='maps'&&<SpawnPage/>}
  {page==='resources'&&<ResourcePage/>}
  {page==='timers'&&<><div className="pagetitle"><span className="eyebrow">OPERATIONS / 05</span><h1>Live Timers</h1><p>Countdowns for tames, breeding, hatching and anything else your tribe needs.</p></div><div className="two wideleft"><Panel title="Active Countdowns" aside={<Badge>{active.length} RUNNING</Badge>}>{active.length?active.map(t=><div className="timerrow" key={t.id}><div className="roundicon"><Clock3 size={19}/></div><div className="timerinfo"><strong>{t.name}</strong><small>{t.type} · {new Date(t.end).toLocaleString()}</small><div className="smalltrack"><div style={{width:`${Math.max(0,Math.min(100,(now-t.created)/(t.end-t.created)*100))}%`}}/></div></div><div className="timerend">{clock(t.end-now)}</div><button className="iconbtn" title="Remove timer" onClick={()=>setTimers(p=>p.filter(x=>x.id!==t.id))}><Trash2 size={17}/></button></div>):<div className="empty">No active timers. Start one in the Taming or Breeding Lab.</div>}{finished.length>0&&<><h3 className="sectioncap">COMPLETED</h3>{finished.slice(0,6).map(t=><div className="listrow" key={t.id}><CheckCircle2 size={18} color="#65cc9c"/><div><strong>{t.name}</strong><small>{t.type}</small></div><button className="iconbtn push" onClick={()=>setTimers(p=>p.filter(x=>x.id!==t.id))}><Trash2 size={16}/></button></div>)}</>}</Panel><Panel title="Quick Timer"><QuickTimer onAdd={addTimer}/><div className="notice"><Bell size={16}/> Timers count down while the app is open. This first release does not send system or Discord notifications while closed.</div></Panel></div></>}
  {page==='settings'&&<ClusterSettings rates={rates} setRates={setRates}/>}
  {page==='settings'&&<CoveragePanel/>}
  {page==='settings'&&<ThemePicker value={theme} onChange={setTheme}/>}
  {page==='crafting'&&<CraftingPage/>}
  </div></main></div>;
}
function clock(ms){const s=Math.max(0,Math.ceil(ms/1000));return `${Math.floor(s/86400)?Math.floor(s/86400)+'d ':''}${String(Math.floor(s%86400/3600)).padStart(2,'0')}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
function QuickTimer({onAdd}){const [name,setName]=useState('Tribe reminder'),[minutes,setMinutes]=useState(30);return <form onSubmit={e=>{e.preventDefault();onAdd(name,minutes,'Custom')}}><Field label="Timer name"><input value={name} onChange={e=>setName(e.target.value)} required/></Field><Field label="Duration (minutes)"><input type="number" min="1" value={minutes} onChange={e=>setMinutes(e.target.value)} required/></Field><button className="primary full" type="submit"><Plus size={17}/> Start Countdown</button></form>}
createRoot(document.getElementById('root')).render(<App/>);
