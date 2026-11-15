import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {LayoutDashboard,Compass,Timer,Settings,Shield,BookOpen,Search,Plus,Trash2,ExternalLink,ChevronRight,Server,Activity,Egg,Calculator,CheckCircle2,Clock3,MapPin,Bell,Save,Layers,Cloud,Menu,X} from 'lucide-react';
import ResourcePage from './ResourcePage';
import SpawnPage from './SpawnPage';
import TamingLab from './TamingLab';
import CreatureDossiers from './CreatureDossiers.jsx';
import SpecialtyLab from './SpecialtyLab';
import BreedingLab from './BreedingLab';
import PassiveLab from './PassiveLab';
import CoveragePanel from './CoveragePanel';
import CraftingPage from './CraftingPage';
import ThemePicker,{themeIds} from './ThemePicker';
import ClusterSettings from './ClusterSettings';
import CloudAccount from './CloudAccount';
import {useCloudSync} from './cloud-sync';
import {useTribeLive} from './tribe-live';
import TribeCraftingPage from './TribeCraftingPage';
import ServerIntelPage from './ServerIntelPage';
import LiveTimersPage from './LiveTimersPage';
import {createTimerAlarmTracker,collectDueTimerAlarms} from './timer-alarms.js';
import {unlockTimerAudio,playTimerAlarm} from './timer-audio.js';
import {migrateOldRatePreset} from './nomadark-profile.js';
import {clusterPresets,ratesForPreset,DEFAULT_CLUSTER_ID} from './cluster-presets.js';
import {resetLocalWorkspaceOnce} from './launch-reset.js';
import {useLiveCatalog} from './live-catalog.js';
import CatalogUpdatesPage from './CatalogUpdatesPage.jsx';
import AppUpdater from './AppUpdater.jsx';
import MobileInstall from './MobileInstall.jsx';
import AdPlacement from './AdPlacement.jsx';
import {species,maps,tameCreatures,defaults,hoursText,creatureSpawnUrl} from './data';
import './style.css';
import './maps.css';
import './resources.css';
import './timer-sounds.css';
import './mobile.css';
import './premium.css';
import './personality.css';

const nav=[['overview','Overview',LayoutDashboard],['dossiers','Creature Dossiers',BookOpen],['taming','Taming Lab',Calculator],['specialty','Specialty Taming Lab',Shield],['passive','Passive Taming Lab',Activity],['breeding','Breeding Lab',Egg],['crafting','Crafting Calculator',Layers],['tribe-crafting','Tribe Crafting',Layers],['servers','Server Intel',Server],['maps','Spawn Maps',Compass],['resources','Resource Atlas',Layers],['timers','Live Timers',Timer],['cloud','Tribe Cloud',Cloud],['settings','Settings',Settings]];
const statusColors={'Available':'green','Contested':'gold','Locked Down':'red','Unscouted':'muted'};
function useStored(key,initial){const [value,setValue]=useState(()=>{try{return JSON.parse(localStorage.getItem(key))??initial}catch{return initial}});useEffect(()=>localStorage.setItem(key,JSON.stringify(value)),[key,value]);return [value,setValue]}
function Badge({children,tone='green'}){return <span className={'badge '+tone}>{children}</span>}
function Panel({title,aside,children,className=''}){return <section className={'panel '+className}><div className="panelhead"><h2>{title}</h2>{aside}</div>{children}</section>}
function Field({label,children}){return <label className="field"><span>{label}</span>{children}</label>}
function App(){
 const isDesktopApp=typeof window!=='undefined'&&('__TAURI_INTERNALS__' in window);
 const [mobileNavOpen,setMobileNavOpen]=useState(false);
 const [showStartup,setShowStartup]=useStored('ark.showStartup',true);
 const startingRates=ratesForPreset(DEFAULT_CLUSTER_ID,defaults);
 const [page,setPage]=useState('overview'),[savedRates,setRates]=useStored('ark.rates',startingRates),[customRates,setCustomRates]=useStored('ark.customRates',startingRates),[servers,setServers]=useState([]),[theme,setTheme]=useStored('ark.theme','red'),[clusterId,setClusterId]=useStored('ark.clusterId',DEFAULT_CLUSTER_ID),[now,setNow]=useState(Date.now());
 useEffect(()=>{if(!themeIds.includes(theme))setTheme('red')},[theme,setTheme]);
 // Keep the first-paint animation in sync with cloud-hydrated and manually selected themes.
 useEffect(()=>{if(themeIds.includes(theme))window.dispatchEvent(new CustomEvent('ark:theme-changed',{detail:theme}))},[theme]);
 const cloud=useCloudSync({rates:savedRates,setRates,customRates,setCustomRates,theme,setTheme,clusterId,setClusterId});
 // A display-only remembered identity is used by the early HTML boot splash.
 // Do not store an identity when the login is not remembered across browser restarts.
 useEffect(()=>{
  const user=cloud.user;
  try{
   if(user&&typeof user.displayName==='string'){
    const identity={displayName:user.displayName,tribeName:user.tribeName||''};
    if(localStorage.getItem('ark.cloudRememberToken'))localStorage.setItem('ark.bootIdentity',JSON.stringify(identity));
    else localStorage.removeItem('ark.bootIdentity');
    window.dispatchEvent(new CustomEvent('ark:identity-changed',{detail:identity}));
   }else if(!localStorage.getItem('ark.cloudRememberToken')){
    // Avoid replacing the remembered welcome with "guest" during async login restore.
    window.dispatchEvent(new CustomEvent('ark:identity-changed',{detail:null}));
   }
  }catch{}
 },[cloud.user]);

 const catalog=useLiveCatalog();
 const live=useTribeLive(cloud.token,setServers);
 const [alarmAlerts,setAlarmAlerts]=useState([]);
 const alarmTracker=useRef(createTimerAlarmTracker());
 const timers=live.timers;
 const rates=savedRates;
 const onClusterChange=id=>{
  if(clusterId==='custom')setCustomRates(savedRates);
  setClusterId(id);
  if(id==='custom')setRates(clusterId==='custom'?savedRates:customRates);
  else setRates(current=>ratesForPreset(id,current));
 };
 const updateRates=value=>{
  const next=typeof value==='function'?value(savedRates):value;
  setRates(next);
  if(clusterId==='custom')setCustomRates(next);
 };
 useEffect(()=>{
  try{
   if(localStorage.getItem('ark.ratePresetVersion')==='nomadark-2026-11-06-v2')return;
   setRates(previous=>migrateOldRatePreset(previous,defaults));
   localStorage.setItem('ark.ratePresetVersion','nomadark-2026-11-06-v2');
  }catch{/* Without local storage, keep current rate input and run locally. */}
 },[setRates]);
 useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id)},[]);
 // WebAudio requires a user gesture on some systems, so unlock on interaction anywhere in the app.
 useEffect(()=>{
  const unlock=()=>{void unlockTimerAudio().catch(()=>{});};
  window.addEventListener('pointerdown',unlock);window.addEventListener('keydown',unlock);
  return()=>{window.removeEventListener('pointerdown',unlock);window.removeEventListener('keydown',unlock);};
 },[]);
 useEffect(()=>setAlarmAlerts([]),[cloud.user?.id]);
 useEffect(()=>{
  if(!mobileNavOpen)return;
  const onKeyDown=event=>{if(event.key==='Escape')setMobileNavOpen(false)};
  window.addEventListener('keydown',onKeyDown);
  return()=>window.removeEventListener('keydown',onKeyDown);
 },[mobileNavOpen]);
 useEffect(()=>{
  const due=collectDueTimerAlarms(alarmTracker.current,{memberId:cloud.user?.id||null,timers,now:now-live.clockOffsetMs,sounds:live.timerSounds,ready:live.timerSoundsReady});
  if(!due.length)return;
  due.forEach((_,index)=>playTimerAlarm(index*0.65));
  setAlarmAlerts(previous=>[...due.map(timer=>({id:timer.id,name:timer.name})),...previous].slice(0,4));
 },[cloud.user?.id,timers,now,live.clockOffsetMs,live.timerSounds,live.timerSoundsReady]);
 const active=timers.filter(t=>t.end>now);
 const addTimer=(name,minutes,type='Custom',soundEnabledForCreator=true)=>{const mins=Number(minutes);if(!Number.isFinite(mins)||mins<=0)return;if(!cloud.user){setPage('cloud');return;}void live.addTimer(name,mins,type,soundEnabledForCreator).catch(()=>{});setPage('timers')};
 const openDossier=name=>{try{localStorage.setItem('ark.dossierCreature',JSON.stringify(name))}catch{}setPage('dossiers')};
 const pageName=nav.find(x=>x[0]===page)?.[1]||'Overview';
 return <div className={'shell'+(isDesktopApp?' tauri-desktop':'')} data-theme={theme}>
  {mobileNavOpen&&<button type="button" className="mobile-nav-backdrop" aria-label="Close navigation" onClick={()=>setMobileNavOpen(false)}/>}
  <aside className={'sidebar'+(mobileNavOpen?' mobile-open':'')} id="ark-primary-nav" aria-label="Main navigation"><div className="brand"><div className="brandmark"><Shield size={24}/></div><div><strong>ARK TRIBE<em>HQ</em></strong><small>LIVE TRIBE COMMAND</small></div><button type="button" className="mobile-nav-close" aria-label="Close menu" onClick={()=>setMobileNavOpen(false)}><X size={21}/></button></div>
  <div className="sidegroup" title={cloud.user?.tribeName||'Choose a tribe'}>TRIBE: {cloud.user?.tribeName||'NOT CONNECTED'}</div>
  <div className="sidegroup">WORKSPACE</div><nav>{nav.map(([key,label,Icon])=><button key={key} className={'navitem '+(page===key?'selected':'')} aria-current={page===key?'page':undefined} onClick={()=>{setPage(key);setMobileNavOpen(false)}}><Icon size={18}/><span>{label}</span>{key==='timers'&&active.length>0?<b className="counter">{active.length}</b>:null}</button>)}</nav>
  <div className="sidebottom"><div className="live-dot"/><span>{live.status==='live'?'TRIBE FEED LIVE':cloud.status==='connected'?'CLOUD CONNECTED':'LOCAL WORKSPACE'}<br/><small>{cloud.user?cloud.user.displayName:'Sign in to share'}</small></span></div></aside>
  <main className="main"><header className="topbar"><button type="button" className="mobile-nav-toggle" aria-label="Open navigation menu" aria-expanded={mobileNavOpen} aria-controls="ark-primary-nav" onClick={()=>setMobileNavOpen(true)}><Menu size={23}/></button><div className="breadcrumbs">COMMAND CENTER <ChevronRight size={15}/> <strong>{pageName.toUpperCase()}</strong></div><div className="topright"><span className="hq-sync"><span className="hq-sync-dot"/>{live.status==='live'?'Live tribe sync':cloud.user?'Connecting':'Guest workspace'}</span><AppUpdater/><label className="header-cluster"><span className="sr-only">Active cluster profile</span><select aria-label="Active cluster profile" value={clusterId} onChange={event=>onClusterChange(event.target.value)}>{clusterPresets.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select><small>{rates.taming}× TAME</small></label><div className="avatar">{cloud.user?.displayName?.slice(0,2).toUpperCase()||'HQ'}</div></div></header>
  <div className="content">
  {!isDesktopApp&&<MobileInstall/>}
  {page==='overview'&&<><div className="hero"><div className="heroeyebrow">{cloud.user?.tribeName?`${cloud.user.tribeName.toUpperCase()} / TRIBE HQ`:'WELCOME BACK, SURVIVOR'}</div><h1>Your tribe.<br/><span>Your command.</span></h1><p>Every tame, timer and server decision in one place. {cloud.user?.tribeName?`Connected to ${cloud.user.tribeName}.`:'Create or join a tribe to share live operations.'}</p><div className="heroactions"><button className="primary" onClick={()=>setPage('taming')}>Open Taming Lab <ChevronRight size={17}/></button><button className="ghost" onClick={()=>setPage(cloud.user?'servers':'cloud')}>{cloud.user?'View Servers':'Create or join a tribe'}</button></div><div className="heroart" aria-hidden="true"><Shield size={148} strokeWidth={1}/></div></div>
   <div className="metrics"><div className="metric"><span><Server size={18}/> Tracked Servers</span><strong>{servers.length}</strong><small>Scouted locations</small></div><div className="metric"><span><Clock3 size={18}/> Active Timers</span><strong>{active.length}</strong><small>Counting down</small></div><div className="metric"><span><Egg size={18}/> Supported Species</span><strong>{Object.keys(species).length}</strong><small>Validated breeding baselines</small></div><div className="metric"><span><Activity size={18}/> Taming Rate</span><strong>{rates.taming}×</strong><small>Default cluster multiplier</small></div></div>
   <div className="two"><Panel title="Active Operations" aside={<button className="subtlebtn" onClick={()=>setPage('timers')}>View all →</button>}>{active.length?active.slice(0,4).map(t=><div className="listrow" key={t.id}><div className="roundicon"><Timer size={19}/></div><div><strong>{t.name}</strong><small>{t.type}</small></div><div className="push countdown">{clock(t.end-now)}</div></div>):<div className="empty">No active operations. Start a tame or raising timer to see it here.</div>}</Panel><Panel title="Server Intelligence" aside={<button className="subtlebtn" onClick={()=>setPage('servers')}>Manage →</button>}>{servers.length?servers.slice(0,4).map(s=><div className="listrow" key={s.id}><div className="roundicon"><Server size={17}/></div><div><strong>{s.name}</strong><small>{s.map}</small></div><div className="push"><Badge tone={statusColors[s.status]}>{s.status}</Badge></div></div>):<div className="empty">No servers tracked yet. Add your first server to start scouting.</div>}</Panel></div>
   {!isDesktopApp&&<AdPlacement placement="overview"/>}</>}
  {page==='dossiers'&&<CreatureDossiers rates={rates} onTimer={addTimer} clusterId={clusterId} onOpenLab={setPage}/>}
  {page==='taming'&&<TamingLab rates={rates} onTimer={addTimer} onOpenDossier={openDossier} discoveredCreatures={catalog.creatures} clusterId={clusterId}/>}
  {page==='specialty'&&<SpecialtyLab rates={rates} onTimer={addTimer} onOpenDossier={openDossier} clusterId={clusterId}/>}
  {page==='passive'&&<PassiveLab rates={rates} onTimer={addTimer} onOpenDossier={openDossier} clusterId={clusterId}/>}
  {page==='breeding'&&<BreedingLab rates={rates} onTimer={addTimer} clusterId={clusterId}/>}
  {page==='servers'&&<ServerIntelPage live={live} user={cloud.user} servers={servers} onOpenAccount={()=>setPage('cloud')}/>}
  {page==='maps'&&<SpawnPage/>}
  {page==='resources'&&<ResourcePage/>}
  {page==='timers'&&<LiveTimersPage live={live} user={cloud.user} now={now-live.clockOffsetMs} onAdd={addTimer} onOpenAccount={()=>setPage('cloud')} onTestSound={()=>void unlockTimerAudio().then(ok=>{if(ok)playTimerAlarm();}).catch(()=>{})}/>}
  {page==='settings'&&<ClusterSettings rates={rates} setRates={updateRates} clusterId={clusterId} onClusterChange={onClusterChange}/>}
  {page==='settings'&&<CoveragePanel/>}
  {page==='settings'&&<ThemePicker value={theme} onChange={setTheme}/>}
  {page==='settings'&&<section className="panel"><div className="panelhead"><h2>Opening Animation</h2></div><label className="startup-preference"><input type="checkbox" checked={showStartup} onChange={event=>setShowStartup(event.target.checked)}/><span>Play the cinematic intro when I open the website or launch the app</span></label><button className="ghost" type="button" onClick={()=>window.dispatchEvent(new Event('ark:replay-intro'))}>Replay opening animation</button><p className="notice">The intro is always skippable and does not play when navigating between pages. Reduced Motion disables it automatically.</p></section>}
  {page==='cloud'&&<CloudAccount cloud={cloud}/>}
  {page==='crafting'&&<CraftingPage liveRecipes={catalog.recipes}/>}
  {page==='tribe-crafting'&&<TribeCraftingPage live={live} user={cloud.user} liveRecipes={catalog.recipes} onOpenAccount={()=>setPage('cloud')}/>}
  {page==='catalog'&&<CatalogUpdatesPage catalog={catalog}/>}
  </div></main>
  {alarmAlerts.length>0&&<div className="timer-alerts" role="status" aria-live="polite">{alarmAlerts.map(item=><div key={item.id} className="timer-alert"><Bell size={20}/><div><strong>Tribe timer complete</strong><span>{item.name}</span></div><button type="button" className="iconbtn" title="Dismiss timer notification" onClick={()=>setAlarmAlerts(previous=>previous.filter(x=>x.id!==item.id))}><span aria-hidden="true">×</span></button></div>)}</div>}
 </div>;
}
function clock(ms){const s=Math.max(0,Math.ceil(ms/1000));return `${Math.floor(s/86400)?Math.floor(s/86400)+'d ':''}${String(Math.floor(s%86400/3600)).padStart(2,'0')}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
function QuickTimer({onAdd}){const [name,setName]=useState('Tribe reminder'),[minutes,setMinutes]=useState(30);return <form onSubmit={e=>{e.preventDefault();onAdd(name,minutes,'Custom')}}><Field label="Timer name"><input value={name} onChange={e=>setName(e.target.value)} required/></Field><Field label="Duration (minutes)"><input type="number" min="1" value={minutes} onChange={e=>setMinutes(e.target.value)} required/></Field><button className="primary full" type="submit"><Plus size={17}/> Start Countdown</button></form>}
resetLocalWorkspaceOnce();
createRoot(document.getElementById('root')).render(<App/>);
if(!('__TAURI_INTERNALS__' in window)&&'serviceWorker' in navigator){
 window.addEventListener('load',()=>{
  navigator.serviceWorker.register('/sw.js').catch(()=>{/* Normal web experience works without offline support. */});
 });
}
