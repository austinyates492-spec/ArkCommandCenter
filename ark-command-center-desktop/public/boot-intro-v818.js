// First-paint themed intro for website, mobile PWA and Windows desktop.
// Preferences are local so they can be applied before React or cloud requests start.
(function(){
 const doc=document.documentElement;
 const palette={
  red:{accent:'#f34b63',glow:'#f34b6355',dark:'#42151e'},
  purple:{accent:'#b98aff',glow:'#b98aff55',dark:'#3a2465'},
  lime:{accent:'#a2ed78',glow:'#a2ed7855',dark:'#205b40'},
  gold:{accent:'#f1cb75',glow:'#f1cb7555',dark:'#614826'},
  ice:{accent:'#92e8fc',glow:'#92e8fc55',dark:'#305b72'},
  pink:{accent:'#ff73c9',glow:'#ff73c955',dark:'#693478'},
  orange:{accent:'#ffac56',glow:'#ffac5655',dark:'#633519'},
  monochrome:{accent:'#ffffff',glow:'#ffffff45',dark:'#393939'},
  rainbow:{accent:'#ff99dd',glow:'#ff99dd55',dark:'#49336c',spectrum:'linear-gradient(90deg,#ff709e,#ffca6c,#70f4bb,#69b6ff,#c28dff)'},
  forest:{accent:'#badb8b',glow:'#badb8b55',dark:'#405335'}
 };
 const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
 let enabled=true;
 let selected='red';
 try{
  enabled=JSON.parse(localStorage.getItem('ark.showStartup')??'true')!==false;
  const saved=JSON.parse(localStorage.getItem('ark.theme')??'"red"');
  if(Object.hasOwn(palette,saved))selected=saved;
 }catch{}
 doc.dataset.bootIntro=enabled?'on':'off';
 let timer=null;
 const splash=()=>document.getElementById('ark-boot-intro');
 const cleanName=value=>typeof value==='string'?value.trim().slice(0,60):'';
 const readIdentity=()=>{
  try{
   // The current authenticated tab takes priority; remember-only display cache
   // is used on new tabs while a remembered login is still present.
   const session=JSON.parse(sessionStorage.getItem('ark.cloudSession')||'null');
   const active=session?.token&&session?.user?session.user:null;
   if(active)return {displayName:cleanName(active.displayName),tribeName:cleanName(active.tribeName)};
   if(!localStorage.getItem('ark.cloudRememberToken'))return null;
   const cached=JSON.parse(localStorage.getItem('ark.bootIdentity')||'null');
   return cached&&typeof cached==='object'?{displayName:cleanName(cached.displayName),tribeName:cleanName(cached.tribeName)}:null;
  }catch{return null}
 };
 function applyIdentity(user){
  const el=splash();
  if(!el)return;
  const name=cleanName(user?.displayName);
  const tribe=cleanName(user?.tribeName);
  const welcome=el.querySelector('[data-boot-welcome]');
  const tribeLabel=el.querySelector('[data-boot-tribe]');
  if(welcome)welcome.textContent=name?'WELCOME BACK, '+name:'WELCOME, SURVIVOR';
  if(tribeLabel){tribeLabel.textContent=tribe;tribeLabel.hidden=!tribe}
 }

 function applyTheme(theme){
  const id=Object.hasOwn(palette,theme)?theme:'red';
  selected=id;
  const el=splash();
  if(!el)return;
  const p=palette[id];
  el.dataset.bootTheme=id;
  el.style.setProperty('--boot-accent',p.accent);
  el.style.setProperty('--boot-glow',p.glow);
  el.style.setProperty('--boot-dark',p.dark);
  el.style.setProperty('--boot-line',p.spectrum||p.accent);
 }
 function close(){
  if(timer!==null)clearTimeout(timer);
  timer=null;
  const el=splash();
  if(el){el.classList.add('boot-intro-finished');el.hidden=true}
 }
 function play(force=false){
  const el=splash();
  if(!el)return false;
  if(!force&&doc.dataset.bootIntro==='off'){close();return false}
  applyTheme(selected);
  applyIdentity(readIdentity());
  if(timer!==null)clearTimeout(timer);
  el.hidden=false;
  el.classList.remove('boot-intro-finished','boot-intro-playing');
  if(force)doc.dataset.bootIntro='on';
  void el.offsetWidth;
  el.classList.add('boot-intro-playing');
  timer=window.setTimeout(close,reduced()?1800:3400);
  return true;
 }
 function mount(){
  const el=splash();
  if(!el)return;
  applyTheme(selected);
  applyIdentity(readIdentity());
  el.addEventListener('click',close);
  el.querySelector('[data-intro-skip]')?.addEventListener('click',event=>{event.stopPropagation();close()});
  if(enabled)play();else close();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
 else mount();
 window.addEventListener('ark:theme-changed',event=>{
  if(typeof event.detail==='string')applyTheme(event.detail);
 });
 window.addEventListener('ark:identity-changed',event=>applyIdentity(event.detail||null));
 window.addEventListener('ark:replay-intro',()=>{
  try{
   const saved=JSON.parse(localStorage.getItem('ark.theme')??'"red"');
   if(Object.hasOwn(palette,saved))selected=saved;
  }catch{}
  play(true);
 });
 window.addEventListener('ark:close-intro',close);
 window.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
 window.arkTribeHQReplayIntro=()=>play(true);
})();
