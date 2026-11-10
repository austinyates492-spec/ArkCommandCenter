import {useEffect,useState} from 'react';
import {Download,Smartphone,X} from 'lucide-react';

export default function MobileInstall(){
 const [installEvent,setInstallEvent]=useState(null);
 const [dismissed,setDismissed]=useState(()=>sessionStorage.getItem('ark.mobileInstallDismissed')==='yes');
 const [standalone,setStandalone]=useState(()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true);
 const [showInstructions,setShowInstructions]=useState(false);
 useEffect(()=>{
  const onPrompt=event=>{event.preventDefault();setInstallEvent(event)};
  const onInstalled=()=>{setInstallEvent(null);setStandalone(true)};
  window.addEventListener('beforeinstallprompt',onPrompt);
  window.addEventListener('appinstalled',onInstalled);
  return()=>{window.removeEventListener('beforeinstallprompt',onPrompt);window.removeEventListener('appinstalled',onInstalled)};
 },[]);
 if(standalone||dismissed)return null;
 return <section className="mobile-install" aria-label="Install ArkTribeHQ on your phone">
  <Smartphone size={19}/><div><strong>ArkTribeHQ on your phone</strong><span>Add it to your home screen for an app-like experience.</span>
   {showInstructions&&<small>iPhone: Safari → Share → Add to Home Screen. Android: browser menu → Install app or Add to Home screen.</small>}
  </div><button type="button" className="mobile-install-action" onClick={async()=>{
   if(installEvent){await installEvent.prompt();const choice=await installEvent.userChoice;if(choice?.outcome==='accepted')setDismissed(true);setInstallEvent(null)}
   else setShowInstructions(previous=>!previous);
  }}><Download size={15}/> Install</button><button type="button" className="mobile-install-dismiss" aria-label="Dismiss install suggestion" onClick={()=>{sessionStorage.setItem('ark.mobileInstallDismissed','yes');setDismissed(true)}}><X size={16}/></button>
 </section>;
}
