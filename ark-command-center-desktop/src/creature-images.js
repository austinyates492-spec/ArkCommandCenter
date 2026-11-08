import {breedingVariants} from './breeding-variants.js';

const WIKI_API='https://ark.wiki.gg/api.php';
const MAX_AGE_MS=6*60*60*1000;
const cached=new Map();

export function imageSpeciesNames(creature){
 if(typeof creature!=='string'||creature.length>100||!/^[\w\s:'’\-().,]+$/u.test(creature))return [];
 const names=[creature];
 const parent=breedingVariants[creature]||creature.replace(/^(?:Aberrant |Tek |X-|R-)/,'');
 if(parent!==creature)names.push(parent);
 return [...new Set(names)];
}

export function imageTitleOptions(creature){
 return imageSpeciesNames(creature).flatMap(name=>[
  `File:Ark ${name} render.png`,
  `File:${name} render.png`,
  `File:${name} Idle.png`,
  `File:${name}.png`,
  `File:Dossier ${name}.png`
 ]);
}

export function pickCreatureImage(creature,pages=[]){
 const options=imageTitleOptions(creature);
 for(const title of options){
  const page=pages.find(page=>page.title===title&&page.imageinfo?.length);
  if(!page)continue;
  const info=page.imageinfo[0];
  const url=info.thumburl||info.url;
  if(!url)continue;
  try{
   const source=new URL(url);
   if(source.protocol!=='https:'||!(source.hostname==='ark.wiki.gg'||source.hostname.endsWith('.wiki.gg')))continue;
   return {url,creditUrl:info.descriptionurl||`https://ark.wiki.gg/wiki/${encodeURIComponent(title.replaceAll(' ','_'))}`,file:title};
  }catch{/* Ignore malformed wiki image URLs. */}
 }
 return null;
}

export async function lookupCreatureImage(creature,{fetcher=fetch}={}){
 const options=imageTitleOptions(creature);
 if(!options.length)return null;
 const existing=cached.get(creature);
 if(fetcher===fetch&&existing&&Date.now()-existing.at<MAX_AGE_MS)return existing.value;
 const query=new URL(WIKI_API);
 for(const [key,value] of Object.entries({action:'query',format:'json',formatversion:'2',prop:'imageinfo',iiprop:'url|size',iiurlwidth:'600',titles:options.join('|'),origin:'*'}))query.searchParams.set(key,value);
 const response=await fetcher(query.toString(),{signal:AbortSignal.timeout(18000)});
 if(!response.ok)throw Error(`Image lookup HTTP ${response.status}`);
 const payload=await response.json();
 const selected=pickCreatureImage(creature,payload?.query?.pages||[]);
 if(fetcher===fetch)cached.set(creature,{at:Date.now(),value:selected});
 return selected;
}
