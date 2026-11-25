// Compatibility helpers run before Vite modules, including older mobile Safari.
if(!Object.hasOwn)Object.hasOwn=function(o,k){return Object.prototype.hasOwnProperty.call(o,k);};
if(!Array.prototype.at)Object.defineProperty(Array.prototype,'at',{value:function(i){i=Math.trunc(i)||0;return this[i<0?this.length+i:i];},configurable:true,writable:true});
// Mobile startup watchdog: the intro is independent of React and can finish
// even when a stale asset or unsupported browser feature prevents app startup.
(function(){
 var lastError='';
 window.addEventListener('error',function(event){lastError=String(event.message||'Script failed to load').slice(0,200);},true);
 window.addEventListener('unhandledrejection',function(event){lastError=String((event.reason&&event.reason.message)||event.reason||'Startup request failed').slice(0,200);});
 function renderRecovery(){
  var root=document.getElementById('root');
  if(!root||root.querySelector('.shell')||root.querySelector('[role="alert"]'))return;
  var wrapper=document.createElement('main');
  wrapper.setAttribute('role','alert');
  wrapper.style.cssText='min-height:100dvh;background:#0b1116;color:#f1f6f3;padding:32px 20px;display:flex;align-items:center;justify-content:center;text-align:center;font-family:system-ui,sans-serif';
  var panel=document.createElement('div');panel.style.cssText='max-width:430px';
  var title=document.createElement('h1');title.textContent='ARK Tribe HQ could not start';title.style.cssText='font-size:23px;margin:0 0 12px';
  var desc=document.createElement('p');desc.textContent='The opening animation finished, but the app did not load. This may be an outdated mobile cache or a browser error. Your tribe information is safe.';desc.style.cssText='line-height:1.65';
  var reload=document.createElement('button');reload.textContent='Refresh App Files';reload.style.cssText='padding:14px 20px;min-height:48px;border:0;border-radius:10px;background:#84e6b8;color:#112c20;font-weight:800;font-size:16px;cursor:pointer';
  reload.addEventListener('click',function(){
   reload.disabled=true;reload.textContent='Refreshing…';
   Promise.resolve().then(function(){
    return 'serviceWorker' in navigator?navigator.serviceWorker.getRegistrations().then(function(regs){return Promise.all(regs.map(function(reg){return reg.unregister();}));}):null;
   }).then(function(){return 'caches' in window?caches.keys().then(function(keys){return Promise.all(keys.filter(function(key){return key.startsWith('arktribehq-');}).map(function(key){return caches.delete(key);}));}):null;}).catch(function(){}).then(function(){location.replace('/?refresh='+Date.now());});
  });
  var detail=document.createElement('p');detail.textContent=lastError?'Browser error: '+lastError:'If this continues, try opening the site in a new browser tab.';detail.style.cssText='font-size:11px;opacity:.7;margin-top:18px;overflow-wrap:anywhere';
  panel.append(title,desc,reload,detail);wrapper.append(panel);root.replaceChildren(wrapper);
  var intro=document.getElementById('ark-boot-intro');if(intro){intro.classList.add('boot-intro-finished');intro.hidden=true;}
 }
 window.setTimeout(renderRecovery,12000);
 window.addEventListener('ark:startup-error',function(event){lastError=String(event.detail||'App startup error').slice(0,200);renderRecovery();});
})();
