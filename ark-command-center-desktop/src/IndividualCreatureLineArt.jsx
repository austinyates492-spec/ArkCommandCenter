import React,{useEffect,useState} from 'react';
import {individualOutlines} from './individual-outline-data.js';
import {predatorOutlines} from './predator-outline-data.js';
import {herbOutlines} from './herb-outline-data.js';
import {herbOutlinesB} from './herb-outline-data-b.js';
import {knockoutLineArt1} from './knockout-art-1.js';
import {knockoutLineArt2} from './knockout-art-2.js';
import {knockoutCustom14} from './knockout-custom-14.js';
import {approvedAchatinaOutline} from './achatina-approved-data.js';
import {acroPreviewOutline} from './acro-preview-outline-data.js';
import {alloPreviewOutline} from './allo-preview-outline-data.js';
import {amargaPreviewOutline} from './amarga-preview-outline-data.js';
import {ammonitePreviewOutline} from './ammonite-preview-outline-data.js';
import {anglerPreviewOutline} from './angler-preview-outline-data.js';
import {ankyPreviewOutline} from './anky-preview-outline-data.js';
import {araneoPreviewOutline} from './araneo-preview-outline-data.js';
import {archaeopteryxPreviewOutline} from './archaeopteryx-preview-outline-data.js';
import {archelonPreviewOutline} from './archelon-preview-outline-data.js';
import {argentavisPreviewOutline} from './argentavis-preview-outline-data.js';
import {armadoggoPreviewOutline} from './armadoggo-preview-outline-data.js';
import {arthroplueraPreviewOutline} from './arthropluera-preview-outline-data.js';
import {astrocetusPreviewOutline} from './astrocetus-preview-outline-data.js';
import {aureliaxPreviewPng} from './aureliax-preview-svg-data.js';
import {baryonyxPreviewPng} from './baryonyx-preview-svg-data.js';
import {basiliskPreviewPng} from './basilisk-preview-svg-data.js';

// This is a curated set of species-specific silhouettes, not a generic body
// family with per-name noise. Reviewed source illustration sheets were vectorized into
// local, gzipped SVGs and is tinted solely by the currently selected theme.
const tracedOutlines=Object.freeze({...individualOutlines,...predatorOutlines,...herbOutlines,...herbOutlinesB,...knockoutLineArt1,...knockoutLineArt2,...knockoutCustom14,Achatina:approvedAchatinaOutline,Acrocanthosaurus:acroPreviewOutline,Allosaurus:alloPreviewOutline,Anglerfish:anglerPreviewOutline,Ankylosaurus:ankyPreviewOutline,Araneo:araneoPreviewOutline,Archaeopteryx:archaeopteryxPreviewOutline,Archelon:archelonPreviewOutline,Argentavis:argentavisPreviewOutline,Arthropluera:arthroplueraPreviewOutline,Astrocetus:astrocetusPreviewOutline});
export const detailedOutlineNames=Object.freeze(Object.keys(tracedOutlines));
export function hasDetailedOutline(name){return Object.hasOwn(tracedOutlines,name);}

export default function IndividualCreatureLineArt({creature,fallback=null,previewAllo=false,previewAmarga=false,previewAmmonite=false,previewAngler=false,previewAnky=false,previewAraneo=false,previewArchaeopteryx=false,previewArchelon=false,previewArgentavis=false,previewArmadoggo=false,previewArthropluera=false,previewAstrocetus=false,previewAureliax=false,previewBaryonyx=false,previewBasilisk=false}){
 const [art,setArt]=useState({creature:null,url:null});
 useEffect(()=>{
  let alive=true;
  setArt({creature,url:null});
  async function decode(){
   try{
    const pngPayload=previewAureliax&&creature==='Aureliax'?aureliaxPreviewPng:previewBaryonyx&&creature==='Baryonyx'?baryonyxPreviewPng:previewBasilisk&&creature==='Basilisk'?basiliskPreviewPng:null;
    if(pngPayload){if(alive)setArt({creature,url:'data:image/png;base64,'+pngPayload});return;}
    const payload=previewArmadoggo&&creature==='Armadoggo'?armadoggoPreviewOutline:previewArthropluera&&creature==='Arthropluera'?arthroplueraPreviewOutline:previewAstrocetus&&creature==='Astrocetus'?astrocetusPreviewOutline:previewArgentavis&&creature==='Argentavis'?argentavisPreviewOutline:previewArchelon&&creature==='Archelon'?archelonPreviewOutline:previewArchaeopteryx&&creature==='Archaeopteryx'?archaeopteryxPreviewOutline:previewAraneo&&creature==='Araneo'?araneoPreviewOutline:previewAnky&&creature==='Ankylosaurus'?ankyPreviewOutline:previewAngler&&creature==='Anglerfish'?anglerPreviewOutline:previewAmmonite&&creature==='Ammonite'?ammonitePreviewOutline:previewAmarga&&creature==='Amargasaurus'?amargaPreviewOutline:tracedOutlines[creature];
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
 },[creature,previewAmarga,previewAmmonite,previewAngler,previewAnky,previewAraneo,previewArchaeopteryx,previewArchelon,previewArgentavis,previewArmadoggo,previewArthropluera,previewAstrocetus,previewAureliax,previewBaryonyx,previewBasilisk]);
 if(art.creature!==creature||!art.url)return fallback;
 return <div className="cad-illustration cad-detailed-outline" role="img"
  aria-label={creature+' original detailed anatomical contour illustration'}
  style={{maskImage:`url("${art.url}")`,WebkitMaskImage:`url("${art.url}")`}}/>;
}
