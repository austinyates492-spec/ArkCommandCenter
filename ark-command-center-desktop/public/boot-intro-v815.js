// Early boot intro lives outside React: visible even before the application bundle loads.
(function(){
  const doc=document.documentElement;
  const motion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let enabled=true;
  try{enabled=JSON.parse(localStorage.getItem('ark.showStartup')??'true')!==false}catch{}
  if(!enabled||motion)doc.dataset.bootIntro='off';
  let timer;
  const play=()=>{
    const splash=document.getElementById('ark-boot-intro');
    if(!splash)return;
    clearTimeout(timer);
    splash.classList.remove('boot-intro-finished');
    splash.hidden=false;
    // Restart CSS motion when explicitly replayed.
    splash.classList.remove('boot-intro-playing');
    void splash.offsetWidth;
    splash.classList.add('boot-intro-playing');
    timer=window.setTimeout(()=>{splash.classList.add('boot-intro-finished');splash.hidden=true},3400);
  };
  const close=()=>{
    clearTimeout(timer);
    const splash=document.getElementById('ark-boot-intro');
    if(splash){splash.classList.add('boot-intro-finished');splash.hidden=true}
  };
  document.addEventListener('DOMContentLoaded',()=>{
    const splash=document.getElementById('ark-boot-intro');
    if(!splash)return;
    splash.addEventListener('click',close);
    splash.querySelector('[data-intro-skip]')?.addEventListener('click',close);
    if(doc.dataset.bootIntro!=='off')play();
    else close();
  });
  window.addEventListener('ark:replay-intro',()=>{
    doc.dataset.bootIntro='on';play();
  });
  window.addEventListener('ark:close-intro',close);
  window.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
})();
