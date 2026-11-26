import React,{useEffect,useState} from 'react';
import {Cloud,CloudOff,CloudUpload,KeyRound,LogOut,ShieldCheck,RefreshCcw} from 'lucide-react';
import {request} from './cloud-sync.js';
import './cloud.css';

export default function CloudAccount({cloud}){
 const [mode,setMode]=useState('login');
 const [form,setForm]=useState({email:'',password:'',displayName:'',inviteCode:'',tribeName:''});
 const [rememberMe,setRememberMe]=useState(true);
 const [working,setWorking]=useState(false);
 const [tribe,setTribe]=useState(null);
 useEffect(()=>{
  let cancelled=false;
  setTribe(null);
  if(cloud.token)void request('/tribe/info',cloud.token).then(result=>{
   if(!cancelled)setTribe(result.tribe);
  }).catch(()=>{});
  return()=>{cancelled=true;};
 },[cloud.token]);
 const field=(key,value)=>setForm(p=>({...p,[key]:value}));
 const submit=async e=>{
  e.preventDefault();setWorking(true);
  try{
   const success=await (mode==='register'?cloud.register({...form,rememberMe}):mode==='create'?cloud.createTribe({...form,rememberMe}):cloud.login({email:form.email,password:form.password,rememberMe}));
   if(success)setForm(p=>({...p,password:'',inviteCode:''}));
  }
  finally{setWorking(false);}
 };
 return <div className="cloud-workspace">
  <div className="pagetitle"><h1>{cloud.user?.tribeName||'Tribe Accounts'}</h1><details className="hq-inline-help"><summary>Account & privacy</summary><p>Create a tribe or join one with its private invite code. Only members of your own tribe share timers, crafting and server intelligence.</p></details></div>
  {!cloud.configured?<section className="panel"><h2>Cloud connection not configured</h2><p>This installer was built without an API address. Install the cloud-enabled release to sign in. Your local data is safe.</p></section>:
  !cloud.user?<section className="panel cloud-auth"><div className="panelhead"><h2>{mode==='login'?'Sign in':mode==='register'?'Join a tribe':'Create your tribe'}</h2><span className="badge gold">PRIVATE TRIBE WORKSPACES</span></div>
   <form onSubmit={submit}>
    {mode!=='login'&&<label className="field"><span>Survivor name</span><input value={form.displayName} onChange={e=>field('displayName',e.target.value)} required minLength={2}/></label>}
    {mode==='create'&&<label className="field"><span>Tribe name</span><input value={form.tribeName} onChange={e=>field('tribeName',e.target.value)} required minLength={2} maxLength={60} placeholder="e.g. The Outcasts"/></label>}
    <label className="field"><span>Email address</span><input type="email" autoComplete="email" value={form.email} onChange={e=>field('email',e.target.value)} required/></label>
    <label className="field"><span>Password {mode!=='login'?'(12 characters minimum)':''}</span><input type="password" autoComplete={mode!=='login'?'new-password':'current-password'} value={form.password} onChange={e=>field('password',e.target.value)} required minLength={mode!=='login'?12:1}/></label>
    <label className="cloud-remember"><input type="checkbox" checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)}/><span>Remember this device for 30 days <small>(password not stored)</small></span></label>
    {mode==='register'&&<label className="field"><span>Private tribe invite code</span><input type="password" value={form.inviteCode} onChange={e=>field('inviteCode',e.target.value)} required/></label>}
    {cloud.error&&<div className="notice cloud-error">{cloud.error}</div>}
    <button className="primary full" disabled={working} type="submit"><KeyRound size={16}/>{working?'Connecting...':mode==='register'?'Join tribe':mode==='create'?'Create tribe and account':'Sign in'}</button>
   </form><div className="cloud-actions" style={{marginTop:12,justifyContent:'center',flexWrap:'wrap'}}>
     {mode!=='login'&&<button className="ghost" onClick={()=>setMode('login')}>Sign in</button>}
     {mode!=='register'&&<button className="ghost" onClick={()=>setMode('register')}>Join with code</button>}
     {mode!=='create'&&<button className="ghost" onClick={()=>setMode('create')}>Create a tribe</button>}
   </div>
  </section>:<><section className="panel cloud-profile"><div className="panelhead"><h2><ShieldCheck size={20}/> {cloud.user.displayName}</h2><span className={'badge '+(cloud.status==='connected'?'green':'gold')}>{cloud.status==='connected'?'CLOUD CONNECTED':cloud.status.toUpperCase().replaceAll('-',' ')}</span></div>
   <p>{cloud.user.email}</p>
   <p><strong>Tribe:</strong> {tribe?.name||cloud.user.tribeName||'Loading...'}</p>
   {tribe&&<div className="cloud-invite"><span>Invite code for your tribe ({tribe.memberCount}/{tribe.memberLimit} members)</span><code style={{display:'block',overflowWrap:'anywhere',margin:'8px 0'}}>{tribe.inviteCode}</code><button className="ghost" onClick={()=>navigator.clipboard?.writeText(tribe.inviteCode)}>Copy invite code</button></div>}
   <p className="cloud-hint">Personal saves include your cluster settings, theme and personal crafting projects. Shared timers, tribe crafting and server intel stay private to your tribe, even when other tribes use ArkTribeHQ.</p>
   {cloud.status==='choose-data'&&<div className="cloud-choice"><strong>This PC and the cloud contain different data.</strong><p>Choose which copy to use. Keeping this PC's data replaces the cloud copy on the next sync. Downloading cloud data replaces the matching data on this PC.</p><div className="cloud-actions"><button className="primary" onClick={cloud.chooseCloud}><Cloud size={16}/> Use cloud data</button><button className="ghost" onClick={cloud.chooseLocal}><CloudUpload size={16}/> Keep this PC's data</button></div></div>}
   {cloud.error&&<div className="notice cloud-error">{cloud.error}</div>}
   <div className="cloud-actions"><button className="ghost" onClick={cloud.syncNow} disabled={cloud.status!=='connected'}><CloudUpload size={16}/> Save now</button><button className="ghost" onClick={cloud.retry}><RefreshCcw size={16}/> Reconnect</button><button className="ghost" onClick={cloud.logout}><LogOut size={16}/> Sign out</button></div>
  </section><details className="panel hq-collapsible-panel"><summary className="hq-section-summary">How syncing works</summary><p>Shared timers, tribe crafting and server records are written directly to the cloud and streamed to other members immediately, with a 12-second refresh fallback. Personal preferences are saved locally and periodically synced to your account. Signing in with Remember this PC keeps a revocable 30-day session that automatically renews without storing your password. Signing out revokes it.</p></details></>}
 </div>;
}
