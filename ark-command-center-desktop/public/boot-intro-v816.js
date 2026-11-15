// Boot intro is independent of the React app; desktop, browser and PWA share it.
// Reduced Motion shows an accessible still splash instead of hiding it.
(function(){
  const doc=document.documentElement;
  const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
  let enabled=true;
  try{enabled=JSON.parse(localStorage.getItem('ark.showStartup')??'true')!==false}catch{}
  doc.dataset.bootIntro=enabled?'on':'off';
  let timer=null;
  const splash=()=>document.getElementById('ark-boot-intro');
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
    if(timer!==null)clearTimeout(timer);
    el.hidden=false;
    el.classList.remove('boot-intro-finished','boot-intro-playing');
    doc.dataset.bootIntro='on';
    // Force a new animation timeline for consecutive manual replays.
    void el.offsetWidth;
    el.classList.add('boot-intro-playing');
    timer=window.setTimeout(close,reduced()?1800:3400);
    return true;
  }
  const mount=()=>{
    const el=splash();
    if(!el)return;
    el.addEventListener('click',close);
    el.querySelector('[data-intro-skip]')?.addEventListener('click',event=>{event.stopPropagation();close()});
    if(enabled)play();else close();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();
  window.addEventListener('ark:replay-intro',()=>play(true));
  window.addEventListener('ark:close-intro',close);
  window.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
  window.arkTribeHQReplayIntro=()=>play(true);
})();
