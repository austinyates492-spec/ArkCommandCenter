import React,{useEffect,useState} from 'react';
import {lookupCreatureImage} from './creature-images.js';

export default function CreaturePortrait({creature}){
 const [photo,setPhoto]=useState(null);
 const [loading,setLoading]=useState(true);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  let active=true;
  setPhoto(null);setLoading(true);setFailed(false);
  void lookupCreatureImage(creature).then(value=>{
   if(active){setPhoto(value);setFailed(!value);setLoading(false);}
  }).catch(()=>{if(active){setLoading(false);setFailed(true);}});
  return()=>{active=false;};
 },[creature]);
 return <div className="featureart creature-portrait">
  {photo&&!failed?<><img src={photo.url} alt={`${creature} creature image`} loading="lazy" onError={()=>setFailed(true)}/><a className="creature-credit" href={photo.creditUrl} target="_blank" rel="noreferrer" title="Image source and attribution">Image: ARK Wiki ↗</a></>:
   <div className="creature-image-fallback" role="img" aria-label={`${creature} portrait unavailable`}><span aria-hidden="true">◇</span><small>{loading?'Loading creature image…':`${creature} · Image unavailable`}</small></div>}
 </div>;
}
