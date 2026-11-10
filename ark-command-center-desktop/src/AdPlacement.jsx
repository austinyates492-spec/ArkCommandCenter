import {useEffect,useRef} from 'react';

// Both an approved AdSense account and a published, compliant consent setup are
// required before switching on ad delivery in production.
const clientId=import.meta.env.VITE_ADSENSE_CLIENT_ID||'';
const slotId=import.meta.env.VITE_ADSENSE_SLOT_ID||'';
const enabled=import.meta.env.VITE_ADSENSE_ENABLED==='true'&&/^ca-pub-\d+$/.test(clientId)&&/^\d+$/.test(slotId);
let adsScriptPromise;

function loadAdSense(){
 if(!adsScriptPromise){
  adsScriptPromise=new Promise((resolve,reject)=>{
   const script=document.createElement('script');
   script.async=true;
   script.crossOrigin='anonymous';
   script.src=`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
   script.onload=resolve;
   script.onerror=reject;
   document.head.appendChild(script);
  });
 }
 return adsScriptPromise;
}

export default function AdPlacement({placement}){
 const initialized=useRef(false);
 useEffect(()=>{
  if(!enabled||initialized.current)return;
  initialized.current=true;
  // Activate only after the site owner has configured a compliant consent solution.
  void loadAdSense().then(()=>{(window.adsbygoogle=window.adsbygoogle||[]).push({})}).catch(()=>{});
 },[]);
 if(!enabled)return null;
 return <aside className="ad-placement" aria-label="Advertisement" data-placement={placement}>
  <span className="ad-label">Advertisement</span>
  <ins className="adsbygoogle" style={{display:'block'}} data-ad-client={clientId} data-ad-slot={slotId} data-ad-format="auto" data-full-width-responsive="true"/>
 </aside>;
}
