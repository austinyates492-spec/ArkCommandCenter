import React,{useEffect,useState} from 'react';
import {individualOutlines} from './individual-outline-data.js';
import {predatorOutlines} from './predator-outline-data.js';
import {herbOutlines} from './herb-outline-data.js';

// This is a curated set of species-specific silhouettes, not a generic body
// family with per-name noise. Raster art was individually vector traced into
// local, gzipped SVGs and is tinted solely by the currently selected theme.
const tracedOutlines=Object.freeze({...individualOutlines,...predatorOutlines,...herbOutlines});
export const detailedOutlineNames=Object.freeze(Object.keys(tracedOutlines));
export function hasDetailedOutline(name){return Object.hasOwn(tracedOutlines,name);}

export default function IndividualCreatureLineArt({creature,fallback=null}){
 const [art,setArt]=useState({creature:null,url:null});
 useEffect(()=>{
  let alive=true;
  setArt({creature,url:null});
  async function decode(){
   try{
    const payload=tracedOutlines[creature];
    if(!payload||typeof DecompressionStream!=='function')return;
    const bytes=Uint8Array.from(atob(payload),c=>c.charCodeAt(0));
    const readable=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    const svg=await new Response(readable).text();
    if(!svg.startsWith('<svg')||!svg.includes('viewBox'))throw new Error('Outline asset invalid');
    if(alive)setArt({creature,url:'data:image/svg+xml;base64,'+btoa(svg)});
   }catch{if(alive)setArt({creature,url:null})}
  }
  void decode();
  return ()=>{alive=false};
 },[creature]);
 if(art.creature!==creature||!art.url)return fallback;
 return <div className="cad-illustration cad-detailed-outline" role="img"
  aria-label={creature+' original detailed anatomical contour illustration'}
  style={{maskImage:`url("${art.url}")`,WebkitMaskImage:`url("${art.url}")`}}/>;
}
