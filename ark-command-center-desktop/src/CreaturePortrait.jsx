import React,{useEffect,useMemo,useState} from 'react';
import {PORTRAIT_SOURCE,portraitCandidates} from './creature-images.js';

export default function CreaturePortrait({creature}){
 const choices=useMemo(()=>portraitCandidates(creature),[creature]);
 const [index,setIndex]=useState(0);
 useEffect(()=>setIndex(0),[creature]);
 const src=choices[index];
 return <div className="featureart creature-portrait">
  {src?<><img key={`${creature}-${index}`} src={src} alt={`${creature} creature portrait`} loading="lazy" referrerPolicy="no-referrer" onError={()=>setIndex(n=>n+1)}/><a className="creature-credit" href={PORTRAIT_SOURCE} target="_blank" rel="noreferrer" title="ARK Utils species art, MIT licensed">Image: ARK Utils (MIT) ↗</a></>:
   <div className="creature-image-fallback" role="img" aria-label={`${creature} portrait unavailable`}><span aria-hidden="true">◇</span><small>{creature} · Image not yet available</small></div>}
 </div>;
}
