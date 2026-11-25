import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Search,X,ArrowRight,Clock3,Layers,MapPin,Egg,Crosshair,Package,Map,Command} from 'lucide-react';
import {buildSearchIndex,searchWorkspace} from './universal-search-model.js';
import {vanillaTamesByMethod,vanillaKnockoutRoster} from './vanilla-tame-picker.js';
import {species,maps} from './data.js';
import {resourcesForMap} from './atlas-resource-model.js';
import {starterRecipes} from './crafting-recipes.js';
import wikiRecipes from './wiki-crafting-recipes.json' with {type:'json'};
import communityRecipes from './community-crafting-recipes.json' with {type:'json'};
import './universal-search.css';
const icons={'Active timers':Clock3,'Tribe crafting':Layers,'Saved map pins':MapPin,Creatures:Crosshair,Breeding:Egg,Recipes:Package,Resources:MapPin,Maps:Map,Tools:Command};
const creatures=[...new Map([...vanillaKnockoutRoster.map(name=>[name,{name,page:'taming'}]),...vanillaTamesByMethod.specialty.map(name=>[name,{name,page:'specialty'}]),...vanillaTamesByMethod.passive.map(name=>[name,{name,page:'passive'}])]).values()];
const mapResources=Object.fromEntries(maps.map(map=>[map,resourcesForMap(map).map(r=>r.id)]));
const tools=[{title:'Taming Lab',page:'taming'},{title:'Breeding Lab',page:'breeding'},{title:'Crafting Lab',page:'crafting'},{title:'Tribe Crafting',page:'tribe-crafting'},{title:'Resource Atlas',page:'resources'},{title:'Live Timers',page:'timers'},{title:'Server Intel',page:'servers'},{title:'Tribe Cloud',page:'cloud'},{title:'Settings',page:'settings'}];
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
export default function UniversalSearch({live,user,liveRecipes,now,onSelect}){
 const [open,setOpen]=useState(false),[query,setQuery]=useState(''),[cursor,setCursor]=useState(0),[local,setLocal]=useState({recipes:{},pins:[]});
 const dialog=useRef(null),input=useRef(null),trigger=useRef(null);
 const show=()=>{const custom=read('ark.crafting.recipes',{}),pins=read('ark.atlas.personalPins.v3',[]);setLocal({recipes:{...(read('ark.crafting.community',false)?communityRecipes:{}),...(custom&&typeof custom==='object'&&!Array.isArray(custom)?custom:{})},pins:Array.isArray(pins)?pins:[]});setQuery('');setCursor(0);setOpen(true);};
 const close=()=>setOpen(false);
 useEffect(()=>{const key=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(open)close();else show();}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[open]);
 useEffect(()=>{const d=dialog.current;if(!d)return;if(open&&!d.open){d.showModal();input.current?.focus();}else if(!open&&d.open)d.close();},[open]);
 const index=useMemo(()=>buildSearchIndex({creatures,breeding:Object.keys(species),recipes:{...wikiRecipes,...liveRecipes,...starterRecipes,...local.recipes},mapResources,timers:user&&live.searchTimersReady?live.timers:[],crafting:user&&live.searchCraftingReady?live.crafting:[],pins:local.pins,tools,now}),[liveRecipes,local,live.timers,live.crafting,live.searchTimersReady,live.searchCraftingReady,user,now]);
 const groups=useMemo(()=>searchWorkspace(index,query),[index,query]);const flat=groups.flatMap(g=>g.results),selected=Math.min(cursor,Math.max(0,flat.length-1));
 const choose=r=>{if(!r)return;close();onSelect(r);};
 const keyboard=e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(flat.length)setCursor((selected+(e.key==='ArrowDown'?1:flat.length-1))%flat.length);}else if(e.key==='Enter'&&e.target===input.current){e.preventDefault();choose(flat[selected]);}};
 useEffect(()=>{if(open&&flat[selected])document.getElementById('hq-search-result-'+selected)?.scrollIntoView({block:'nearest'});},[selected,query,open]);
 return <><button ref={trigger} type="button" className="hq-search-trigger" aria-label="Search ARK Tribe HQ" aria-haspopup="dialog" onClick={show}><Search size={18}/><span>Search anything</span><kbd>Ctrl K</kbd></button>
 <dialog ref={dialog} className="hq-search-dialog" aria-label="Search ARK Tribe HQ" onCancel={e=>{e.preventDefault();close();}} onClose={()=>{setOpen(false);trigger.current?.focus();}} onClick={e=>{if(e.target===dialog.current)close();}}>
 <div className="hq-search-panel" onKeyDown={keyboard}><div className="hq-search-inputrow"><Search size={21}/><input ref={input} value={query} onChange={e=>{setQuery(e.target.value);setCursor(0);}} placeholder="Search creatures, recipes, timers..." aria-label="Search query" role="combobox" aria-expanded={flat.length>0} aria-controls="hq-search-results" aria-autocomplete="list" aria-activedescendant={flat.length?'hq-search-result-'+selected:undefined} autoComplete="off"/><button type="button" aria-label="Close search" onClick={close}><X size={21}/></button></div>
 <div id="hq-search-results" className="hq-search-results" role="listbox" aria-label="Search results">{!query.trim()?<p>Search a creature, resource, recipe or your active tribe projects.</p>:!flat.length?<p>No matching results.</p>:groups.map(g=><div key={g.group} role="group" aria-label={g.group}><h3>{g.group}</h3>{g.results.map(r=>{const i=flat.indexOf(r),Icon=icons[g.group]||Search;return <button type="button" role="option" aria-selected={i===selected} id={'hq-search-result-'+i} className={'hq-search-result'+(i===selected?' selected':'')} key={r.id} onMouseMove={()=>setCursor(i)} onClick={()=>choose(r)}><span className="hq-search-result-icon"><Icon size={18}/></span><span><strong>{r.title}</strong><small>{r.subtitle}</small></span><ArrowRight size={16}/></button>;})}</div>)}</div>
 <footer><span>↑ ↓ Navigate · Enter Open</span><span>Esc Close</span></footer></div></dialog></>;
}
