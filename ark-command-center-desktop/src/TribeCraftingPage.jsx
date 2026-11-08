import React,{useMemo,useState} from 'react';
import {Layers,Plus,Trash2,Search,ChevronRight,Cloud,RefreshCcw} from 'lucide-react';
import {starterRecipes} from './crafting-recipes';
import wikiRecipes from './wiki-crafting-recipes.json' with {type:'json'};
import {calculateCraftingCart} from './crafting-engine';
import './crafting.css';
import './tribe-crafting.css';

const fmt=new Intl.NumberFormat('en-US');
function Node({item,depth=0}){
 if(item.raw)return <div className="craftleaf" style={{paddingLeft:`${depth*14}px`}}><span className="craftnode-dot"/> <strong>{fmt.format(item.quantity)}</strong> {item.name} <small>RAW</small></div>;
 return <details className="craftbranch" open={depth<2}><summary style={{paddingLeft:`${depth*14}px`}}><ChevronRight size={16}/><strong>{fmt.format(item.quantity)} × {item.name}</strong><span>{fmt.format(item.batches)} craft{item.batches!==1?'s':''}</span></summary><div>{item.children.map((child,i)=><Node key={`${child.name}-${i}`} item={child} depth={depth+1}/>)}</div></details>;
}
function Quantity({item,onSave}){
 const [value,setValue]=useState(String(item.quantity));
 return <div className="tribe-quantity"><input aria-label={`${item.name} quantity`} type="number" min="1" max="1000000" value={value} onChange={e=>setValue(e.target.value)} onBlur={()=>{const n=Number(value);if(Number.isSafeInteger(n)&&n>0&&n<=1000000&&n!==item.quantity)onSave(n);else setValue(String(item.quantity));}} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur();}}/></div>;
}

export default function TribeCraftingPage({live,user,onOpenAccount,liveRecipes={}}){
 const catalog=useMemo(()=>({...wikiRecipes,...liveRecipes,...starterRecipes}),[liveRecipes]);
 const names=useMemo(()=>Object.keys(catalog).sort(),[catalog]);
 const [query,setQuery]=useState('');const [selected,setSelected]=useState('Sloped Wooden Roof');const [quantity,setQuantity]=useState(1);
 const matches=useMemo(()=>names.filter(name=>name.toLowerCase().includes(query.toLowerCase())).slice(0,400),[query,names]);
 let plan=null,planError='';try{plan=calculateCraftingCart(live.crafting,catalog);}catch(e){planError=e.message;}
 const act=promise=>void promise.catch(()=>{});
 if(!user)return <div className="craft-workspace"><div className="pagetitle"><span className="eyebrow">LOGISTICS / TRIBE</span><h1>Tribe Crafting</h1></div><section className="panel"><h2>Sign in to share projects</h2><p>Tribe crafting is stored in the shared database so every member sees the same queue and resource totals.</p><button className="primary" onClick={onOpenAccount}><Cloud size={16}/> Open Tribe Cloud</button></section></div>;
 const totals=Object.entries(plan?.materials||{}).sort((a,b)=>b[1]-a[1]);
 const crafts=Object.entries(plan?.crafts||{}).sort((a,b)=>b[1]-a[1]);
 return <div className="craft-workspace tribe-crafting-page">
  <div className="pagetitle"><span className="eyebrow">LOGISTICS / SHARED WORKSPACE</span><h1>Tribe Crafting</h1><p>Add items to a single live queue. Everyone sees updates to quantities, dependency trees and raw material totals.</p></div>
  <section className="panel"><div className="panelhead"><h2>1 · Shared Crafting Tree</h2><span className="badge green">{live.status==='live'?'● LIVE SYNC':'CLOUD · '+live.status.toUpperCase()}</span></div>
   {plan?.trees?.length?plan.trees.map(tree=><div className="craft-tree-root" key={tree.name}><Node item={tree}/></div>):<div className="empty">No tribe projects yet. Add a recipe below to see its complete crafting tree.</div>}
  </section>
  <section className="panel"><div className="panelhead"><h2>2 · Combined Resource Totals</h2><span className="badge gold">{totals.length} MATERIALS</span></div>
   {planError&&<div className="notice">{planError}</div>}
   {totals.length?<><div className="craft-material-grid">{totals.map(([name,count])=><div className="craft-material" key={name}><strong>{fmt.format(count)}</strong><span>{name}</span></div>)}</div><h3 className="sectioncap">INTERMEDIATE CRAFTING BATCHES</h3>{crafts.filter(([name])=>!live.crafting.some(item=>item.name===name)).map(([name,count])=><div className="keyrow" key={name}><span>{name}</span><strong>{fmt.format(count)} crafts</strong></div>)}</>:<div className="empty">The combined resource list appears when the tribe adds projects.</div>}
  </section>
  <section className="panel"><div className="panelhead"><h2>3 · Tribe Crafting Queue</h2><span className="badge">{live.crafting.length} PROJECTS</span></div>
   <div className="tribe-crafting-picker"><label className="field"><span>Search recipes</span><div className="searchbox"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Wooden roof, turret, ammunition..."/></div></label><label className="field"><span>Recipe</span><select value={matches.includes(selected)?selected:''} onChange={e=>setSelected(e.target.value)}>{!matches.includes(selected)&&<option value="">Choose a matching recipe</option>}{matches.map(name=><option value={name} key={name}>{name}</option>)}</select></label><label className="field"><span>Quantity to add</span><input type="number" min="1" max="1000000" value={quantity} onChange={e=>setQuantity(e.target.value)}/></label><button className="primary" disabled={!matches.length} onClick={()=>{const name=matches.includes(selected)?selected:matches[0];if(name&&Number.isSafeInteger(Number(quantity))&&Number(quantity)>0)act(live.addCraft(name,Number(quantity)));}}><Plus size={16}/> Add to Tribe Queue</button></div>
   {live.crafting.map(item=><div className="craft-cart-row tribe-queue-row" key={item.name}><div><strong>{item.name}</strong><small>{catalog[item.name]?.station||'Unknown station'}{item.updatedBy?` · Last changed by ${item.updatedBy}`:''}</small></div><Quantity key={`${item.name}-${item.quantity}`} item={item} onSave={n=>act(live.setCraft(item.name,n,item.quantity))}/><button className="iconbtn" title={`Remove ${item.name}`} onClick={()=>act(live.removeCraft(item.name))}><Trash2 size={17}/></button></div>)}
   {!live.crafting.length&&<div className="empty">No shared crafting projects yet.</div>}
   {live.error&&<div className="notice">{live.error}</div>}
   <div className="tribe-queue-actions"><button className="ghost" onClick={()=>act(live.refresh('crafting'))}><RefreshCcw size={16}/> Refresh</button>{live.crafting.length>0&&<button className="ghost" onClick={()=>{if(window.confirm('Clear every tribe crafting project for all members?'))act(live.clearCraft());}}><Trash2 size={16}/> Clear Tribe Queue</button>}</div>
  </section>
  <div className="notice">Shared across your tribe accounts. The recipe tree uses the same official-community-wiki catalog as the personal calculator; unverified ASA batch yields and map-specific recipes may still need checking.</div>
 </div>;
}
