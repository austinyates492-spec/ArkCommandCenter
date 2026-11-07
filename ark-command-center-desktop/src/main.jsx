import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {LayoutDashboard,Compass,Timer,Settings,Shield,Search,Plus,Trash2,ExternalLink,ChevronRight,Server,Activity,Egg,Calculator,CheckCircle2,Clock3,MapPin,Bell,Save,Layers,Cloud} from 'lucide-react';
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
import CloudAccount from './CloudAccount';
import {useCloudSync} from './cloud-sync';
import {useTribeLive} from './tribe-live';
import TribeCraftingPage from './TribeCraftingPage';
import ServerIntelPage from './ServerIntelPage';
import LiveTimersPage from './LiveTimersPage';
import {migrateOldRatePreset} from './nomadark-profile.js';
import {species,maps,tameCreatures,defaults,hoursText,creatureSpawnUrl} from './data';
import './style.css';
import './maps.css';
import './resources.css';

const nav=[['overview','Overview',LayoutDashboard],['taming','Taming Lab',Calculator],['specialty','Specialty Taming Lab',Shield],['passive','Passive Taming Lab',Activity],['breeding','Breeding Lab',Egg],['crafting','Crafting Calculator',Layers],['tribe-crafting','Tribe Crafting',Layers],['servers','Server Intel',Server],['maps','Spawn Maps',Compass],['resources','Resource Atlas',Layers],['timers','Live Timers',Timer],['cloud','Tribe Cloud',Cloud],['settings','Settings',Settings]];
const statusColors={'Available':'green','Contested':'gold','Locked Down':'red','Unscouted':'muted'};
function useStored(key,initial){const [value,setValue]=useState(()=>{try{return JSON.parse(localStorage.getItem(key))??initial}catch{return initial}});useEffect(()=>localStorage.setItem(key,JSON.stringify(value)),[key,value]);return [value,setValue]}
function Badge({children,tone='green'}){return <span className={'badge '+tone}>{children}</span>}
function Panel({title,aside,children,className=''}){return <section className={'panel '+className}><div className="panelhead"><h2>{title}</h2>{aside}</div>{children}</section>}
function Field({label,children}){return <label className="field"><span>{label}</span>{children}</label>}
function App(){
 const [page,setPage]=useState('overview'),[savedRates,setRates]=useStored('ark.rates',defaults),[servers,setServers]=useState([]),[theme,setTheme]=useStored('ark.theme','emerald'),[now,setNow]=useState(Date.now());
 const cloud=useCloudSync({rates:savedRates,setRates,theme,setTheme});
 const live=useTribeLive(cloud.token,setServers);
 const timers=live.timers;
 const rates=savedRates;
 useEffect(()=>{
  try{
   if(localStorage.getItem('ark.ratePresetVersion')==='nomadark-2026-11-06-v2')return;
   setRates(previous=>migrateOldRatePreset(previous,defaults));
   localStorage.setItem('ark.ratePresetVersion','nomadark-2026-11-06-v2');
  }catch{/* Without local storage, keep current rate input and run locally. */}
 },[setRates]);
 useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id)},[]);
 const active=timers.filter(t=>t.end>now);
 const addTimer=(name,minutes,type='Custom')=>{const mins=Number(minutes);if(!Number.isFinite(mins)||mins<=0)return;if(!cloud.user){setPage('cloud');return;}void live.addTimer(name,mins,type).catch(()=>{});setPage('timers')};
 const pageName=nav.find(x=>x[0]===page)?.[1]||'Overview';
 return <div className="shell" data-theme={theme}>
  <aside className="sidebar"><div className="brand"><div className="brandmark"><Shield size={24}/></div><div><strong>ARK <em>COMMAND</em></strong><small>CENTER // TRIBE EDITION</small></div></div>
  <div className="sidegroup">WORKSPACE</div><nav>{nav.map(([key,label,Icon])=><button key={key} className={'navitem '+(page===key?'selected':'')} onClick={()=>setPage(key)}><Icon size={18}/><span>{label}</span>{key==='timers'&&active.length>0?<b className="counter">{active.length}</b>:null}</button>)}</nav>
  <div className="sidebottom"><div className="live-dot"/><span>{live.status==='live'?'TRIBE FEED LIVE':cloud.status==='connected'?'CLOUD CONNECTED':'LOCAL WORKSPACE'}<br/><small>{cloud.user?cloud.user.displayName:'Sign in to share'}</small></span></div></aside>
  <main className="main"><header className="topbar"><div className="breadcrumbs">ARK COMMAND CENTER <ChevronRight size={15}/> <strong>{pageName.toUpperCase()}</strong></div><div className="topright"><Badge tone="green">● NOMADARK · {rates.taming}× TAME</Badge><div className="avatar">AY</div></div></header>
  <div className="content">
  {page==='overview'&&<><div className="hero"><div className="heroeyebrow">WELCOME BACK, SURVIVOR</div><h1>Your tribe.<br/><span>Your command.</span></h1><p>Every tame, timer and server decision in one place. Built for your private ARK squad.</p><div className="heroactions"><button className="primary" onClick={()=>setPage('taming')}>Open Taming Lab <ChevronRight size={17}/></button><button className="ghost" onClick={()=>setPage('servers')}>View Servers</button></div><div className="heroart">◈</div></div>
   <div className="metrics"><div className="metric"><span><Server size={18}/> Tracked Servers</span><strong>{servers.length}</strong><small>Scouted locations</small></div><div className="metric"><span><Clock3 size={18}/> Active Timers</span><strong>{active.length}</strong><small>Counting down</small></div><div className="metric"><span><Egg size={18}/> Supported Species</span><strong>{Object.keys(species).length}</strong><small>Validated breeding baselines</small></div><div className="metric"><span><Activity size={18}/> Taming Rate</span><strong>{rates.taming}×</strong><small>Default cluster multiplier</small></div></div>
   <div className="two"><Panel title="Active Operations" aside={<button className="subtlebtn" onClick={()=>setPage('timers')}>View all →</button>}>{active.length?active.slice(0,4).map(t=><div className="listrow" key={t.id}><div className="roundicon"><Timer size={19}/></div><div><strong>{t.name}</strong><small>{t.type}</small></div><div className="push countdown">{clock(t.end-now)}</div></div>):<div className="empty">No active operations. Start a tame or raising timer to see it here.</div>}</Panel><Panel title="Server Intelligence" aside={<button className="subtlebtn" onClick={()=>setPage('servers')}>Manage →</button>}>{servers.length?servers.slice(0,4).map(s=><div className="listrow" key={s.id}><div className="roundicon"><Server size={17}/></div><div><strong>{s.name}</strong><small>{s.map}</small></div><div className="push"><Badge tone={statusColors[s.status]}>{s.status}</Badge></div></div>):<div className="empty">No servers tracked yet. Add your first server to start scouting.</div>}</Panel></div></>}
  {page==='taming'&&<TamingLab rates={rates} onTimer={addTimer}/>}
  {page==='specialty'&&<SpecialtyLab rates={rates} onTimer={addTimer}/>}
  {page==='passive'&&<PassiveLab rates={rates} onTimer={addTimer}/>}
  {page==='breeding'&&<BreedingLab rates={rates} onTimer={addTimer}/>}
  {page==='servers'&&<ServerIntelPage live={live} user={cloud.user} servers={servers} onOpenAccount={()=>setPage('cloud')}/>}
  {page==='maps'&&<SpawnPage/>}
  {page==='resources'&&<ResourcePage/>}
  {page==='timers'&&<LiveTimersPage live={live} user={cloud.user} now={now} onAdd={addTimer} onOpenAccount={()=>setPage('cloud')}/>}
  {page==='settings'&&<ClusterSettings rates={rates} setRates={setRates}/>}
  {page==='settings'&&<CoveragePanel/>}
  {page==='settings'&&<ThemePicker value={theme} onChange={setTheme}/>}
  {page==='cloud'&&<CloudAccount cloud={cloud}/>}
  {page==='crafting'&&<CraftingPage/>}
  {page==='tribe-crafting'&&<TribeCraftingPage live={live} user={cloud.user} onOpenAccount={()=>setPage('cloud')}/>}
  </div></main></div>;
}
function clock(ms){const s=Math.max(0,Math.ceil(ms/1000));return `${Math.floor(s/86400)?Math.floor(s/86400)+'d ':''}${String(Math.floor(s%86400/3600)).padStart(2,'0')}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
function QuickTimer({onAdd}){const [name,setName]=useState('Tribe reminder'),[minutes,setMinutes]=useState(30);return <form onSubmit={e=>{e.preventDefault();onAdd(name,minutes,'Custom')}}><Field label="Timer name"><input value={name} onChange={e=>setName(e.target.value)} required/></Field><Field label="Duration (minutes)"><input type="number" min="1" value={minutes} onChange={e=>setMinutes(e.target.value)} required/></Field><button className="primary full" type="submit"><Plus size={17}/> Start Countdown</button></form>}
createRoot(document.getElementById('root')).render(<App/>);
