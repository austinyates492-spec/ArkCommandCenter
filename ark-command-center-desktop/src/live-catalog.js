import {useEffect,useMemo,useState} from 'react';
import {API} from './cloud-sync.js';
import {asaBaseCreatures} from './asa-official-catalog.js';
import wikiRecipes from './wiki-crafting-recipes.json' with {type:'json'};
import {starterRecipes} from './crafting-recipes.js';

const CACHE='ark.live.catalog.v1';
const MAX_AGE=12*60*60*1000;
function stored(){try{const value=JSON.parse(localStorage.getItem(CACHE));return valid(value)?value:null;}catch{return null;}}
export function valid(value){
 return Boolean(value&&typeof value==='object'&&!Array.isArray(value)&&typeof value.checkedAt==='string'&&
  Array.isArray(value.creatures)&&value.creatures.length<=1000&&
  (value.recipeCandidates===undefined||(Array.isArray(value.recipeCandidates)&&value.recipeCandidates.length<=2500))&&
  value.recipes&&typeof value.recipes==='object'&&!Array.isArray(value.recipes)&&Object.keys(value.recipes).length<=5000);
}
export function newWikiRecipes(catalog){
 const additions={};if(!valid(catalog))return additions;
 for(const [name,entry] of Object.entries(catalog.recipes)){
  if(Object.hasOwn(wikiRecipes,name)||Object.hasOwn(starterRecipes,name))continue;
  if(typeof name!=='string'||name.length>100||!entry||typeof entry!=='object'||
   !entry.ingredients||typeof entry.ingredients!=='object'||Array.isArray(entry.ingredients))continue;
  const parts=Object.entries(entry.ingredients);
  if(!parts.length||parts.length>20||parts.some(([item,count])=>!item||!Number.isSafeInteger(count)||count<1||count>1e6))continue;
  additions[name]={...entry,output:1,verification:'wiki-asa-unconfirmed'};
 }
 return additions;
}
export function newWikiCreatures(catalog){
 if(!valid(catalog))return [];
 const builtIn=new Set(asaBaseCreatures.map(name=>name.toLowerCase()));
 return [...new Set(catalog.creatures.filter(name=>typeof name==='string'&&name.length<100&&!builtIn.has(name.toLowerCase())))].sort();
}
export function newWikiRecipeCandidates(catalog){
 if(!valid(catalog)||!Array.isArray(catalog.recipeCandidates))return [];
 return [...new Set(catalog.recipeCandidates.filter(name=>typeof name==='string'&&name.length>0&&name.length<100&&
  !Object.hasOwn(wikiRecipes,name)&&!Object.hasOwn(starterRecipes,name)&&!Object.hasOwn(catalog.recipes,name)))].sort();
}
export function useLiveCatalog(){
 const [catalog,setCatalog]=useState(stored),[status,setStatus]=useState('loading'),[error,setError]=useState('');
 useEffect(()=>{
  let cancelled=false;
  const load=async()=>{
   if(!API){setStatus('not-configured');return;}
   try{
    const response=await fetch(`${API}/api/v1/catalog/live`,{signal:AbortSignal.timeout(18000)});
    if(!response.ok)throw Error(`Catalog API HTTP ${response.status}`);
    const value=await response.json();
    if(cancelled)return;
    if(valid(value.catalog)){setCatalog(value.catalog);localStorage.setItem(CACHE,JSON.stringify(value.catalog));setStatus('live');setError('');}
    else setStatus('waiting');
   }catch(e){if(!cancelled){setStatus('offline');setError(e.message);}}
  };
  void load();const interval=setInterval(()=>void load(),60*60*1000);
  return()=>{cancelled=true;clearInterval(interval);};
 },[]);
 const recipes=useMemo(()=>newWikiRecipes(catalog),[catalog]);
 const creatures=useMemo(()=>newWikiCreatures(catalog),[catalog]);
 const recipeCandidates=useMemo(()=>newWikiRecipeCandidates(catalog),[catalog]);
 return {catalog,recipes,recipeCandidates,creatures,status,error,isCached:catalog&&Date.now()-new Date(catalog.checkedAt).getTime()>MAX_AGE};
}
