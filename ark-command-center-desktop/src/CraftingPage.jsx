import React,{useMemo,useState} from 'react';
import {Layers,Plus,Trash2,Search,ChevronRight,Save,Upload,ExternalLink} from 'lucide-react';
import {starterRecipes,recipeAliases} from './crafting-recipes';
import communityRecipes from './community-crafting-recipes.json' with {type:'json'};
import wikiRecipes from './wiki-crafting-recipes.json' with {type:'json'};
import {calculateCraftingCart,validateRecipes} from './crafting-engine';
import './crafting.css';

const fmt=new Intl.NumberFormat('en-US');
function useLocal(key,initial){const [value,setValue]=useState(()=>{try{return JSON.parse(localStorage.getItem(key))??initial}catch{return initial}});const save=value=>{setValue(value);localStorage.setItem(key,JSON.stringify(value));};return [value,save]}
function RecipeNode({node,depth=0}){
 if(node.raw)return <div className="craftleaf" style={{paddingLeft:`${Math.min(depth,7)*14}px`}}><span className="craftnode-dot"/> <strong>{fmt.format(node.quantity)}</strong> {node.name} <small>RAW</small></div>;
 return <details className="craftbranch" open={depth<2}><summary style={{paddingLeft:`${Math.min(depth,7)*14}px`}}><ChevronRight size={16}/><strong>{fmt.format(node.quantity)} × {node.name}</strong><span>{fmt.format(node.batches)} craft{node.batches===1?'':'s'}{node.output>1?` · produces ${fmt.format(node.produced)}`:''}</span></summary><div>{node.children.map((child,i)=><RecipeNode key={`${child.name}-${i}`} node={child} depth={depth+1}/>)}</div></details>;
}
export default function CraftingPage(){
 const [extra,setExtra]=useLocal('ark.crafting.recipes',{});
 const [includeCommunity,setIncludeCommunity]=useLocal('ark.crafting.community',false);
 const [cart,setCart]=useLocal('ark.crafting.cart',[]);
 const [search,setSearch]=useState('');
 const [selected,setSelected]=useState('Sloped Wooden Roof');
 const [quantity,setQuantity]=useState(1);
 const [error,setError]=useState('');
 const [form,setForm]=useState({name:'',output:1,category:'Custom',station:'Inventory',ingredients:'Wood: 60\nThatch: 15\nFiber: 10'});
 const recipes=useMemo(()=>({...(includeCommunity?communityRecipes:{}),...wikiRecipes,...starterRecipes,...extra}),[extra,includeCommunity]);
 const matches=useMemo(()=>Object.keys(recipes).filter(name=>name.toLowerCase().includes(search.toLowerCase())||recipes[name].category?.toLowerCase().includes(search.toLowerCase())).sort(),[recipes,search]);
 let result=null,planError='';try{result=calculateCraftingCart(cart,recipes);}catch(e){planError=e.message}
 const add=()=>{const name=matches.includes(selected)?selected:matches[0];if(!name||!Number.isSafeInteger(Number(quantity))||Number(quantity)<1)return;setCart([...cart.filter(x=>x.name!==name),{name,quantity:Number(quantity)+(cart.find(x=>x.name===name)?.quantity||0)}]);setError('');};
 const updateQty=(name,n)=>{if(!Number.isSafeInteger(Number(n))||Number(n)<1)return;setCart(cart.map(x=>x.name===name?{...x,quantity:Number(n)}:x));};
 const addCustom=()=>{try{
  const name=form.name.trim();if(!name||starterRecipes[name])throw new Error('Choose a unique name that does not overwrite a verified recipe.');
  const ingredients={};for(const line of form.ingredients.split(/\r?\n/)){if(!line.trim())continue;const idx=line.lastIndexOf(':');if(idx<1)throw new Error(`Use Ingredient: amount, one per line (problem: ${line})`);const ingredient=line.slice(0,idx).trim(),amount=Number(line.slice(idx+1).trim());if(!ingredient||!Number.isSafeInteger(amount)||amount<1)throw new Error(`Invalid ingredient: ${line}`);ingredients[recipeAliases[ingredient]||ingredient]=amount;}
  if(!Object.keys(ingredients).length)throw new Error('Add at least one ingredient.');
  const next={...extra,[name]:{ingredients,output:Number(form.output),category:form.category||'Custom',station:form.station||'Inventory',source:'User entered'}};
  validateRecipes({...starterRecipes,...next});setExtra(next);setSelected(name);setError('Recipe saved on this PC.');
 }catch(e){setError(e.message)}};
 const importData=async file=>{if(!file)return;try{const data=JSON.parse(await file.text());if(!data||Array.isArray(data)||typeof data!=='object')throw new Error('Expected a recipe object keyed by item name.');const next={...extra,...data};validateRecipes({...starterRecipes,...next});setExtra(next);setError(`Imported ${Object.keys(data).length} recipes. Existing custom entries with identical names were updated.`);}catch(e){setError('Import failed: '+e.message)}};
 const totals=Object.entries(result?.materials||{}).sort((a,b)=>b[1]-a[1]);
 const crafts=Object.entries(result?.crafts||{}).sort((a,b)=>b[1]-a[1]);
 return <div className="craft-workspace">
  <div className="pagetitle"><span className="eyebrow">LOGISTICS / CRAFTING</span><h1>Crafting Calculator</h1><p>Build a shopping list for your tribe, combine quantities, and expand every intermediate crafting step.</p></div>
  <div className="craft-layout"><section className="panel"><div className="panelhead"><h2>Recipe Catalog</h2><span className="badge gold">{Object.keys(recipes).length} RECIPES</span></div>
   <div className="notice"><strong>{Object.keys(wikiRecipes).length.toLocaleString()} Official Community Wiki recipe records</strong> and 22 reviewed starter recipes are included. Wiki records have not all been checked for current ASA availability and crafting batch yields. The optional broader community export may contain mods and outdated costs.</div>
   <label className="field"><span><input type="checkbox" checked={includeCommunity} onChange={e=>{setIncludeCommunity(e.target.checked);setSearch('');}}/> Show expanded community recipe candidates (unverified)</span></label>
   <label className="field"><span>Find an item or category</span><div className="searchbox"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Wood roof, tranq dart, gunpowder..."/></div></label>
   <label className="field"><span>Choose recipe</span><select value={matches.includes(selected)?selected:''} onChange={e=>setSelected(e.target.value)}>{!matches.includes(selected)&&<option value="">Choose a result</option>}{matches.map(name=><option key={name} value={name}>{name}{recipes[name]?.verification?' · check ASA':''}</option>)}</select></label>
   {recipes[selected]?.verification&&<div className="notice">Source-backed but not yet individually ASA-verified: confirm item availability, ingredients, alternate materials, and batch yield before using this total.</div>}
   <label className="field"><span>How many finished items?</span><input type="number" min="1" step="1" value={quantity} onChange={e=>setQuantity(e.target.value)}/></label>
   <button className="primary full" disabled={!matches.length} onClick={add}><Plus size={17}/> Add to Crafting Queue</button>
   <div className="notice">Example: select <strong>Sloped Wooden Roof</strong> and enter 1 or 1000. Quantities stack with your other projects.</div>
   <div className="craft-custom"><h3>Custom / additional recipes</h3><p>Build your own blueprint or import a larger ASA recipe catalog. Custom entries are saved locally.</p><details><summary>Add a recipe manually</summary><div className="craft-editor"><label className="field"><span>Recipe name</span><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Vault"/></label><div className="formgrid"><label className="field"><span>Output per craft</span><input type="number" min="1" value={form.output} onChange={e=>setForm(p=>({...p,output:e.target.value}))}/></label><label className="field"><span>Category</span><input value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}/></label></div><label className="field"><span>Crafting station</span><input value={form.station} onChange={e=>setForm(p=>({...p,station:e.target.value}))}/></label><label className="field"><span>Ingredients · one per line</span><textarea rows="5" value={form.ingredients} onChange={e=>setForm(p=>({...p,ingredients:e.target.value}))}/></label><button className="ghost" onClick={addCustom}><Save size={16}/> Save Custom Recipe</button></div></details><label className="craft-import"><Upload size={16}/> Import JSON Recipe Catalog<input type="file" accept=".json,application/json" onChange={e=>importData(e.target.files?.[0])}/></label>{error&&<div className="notice">{error}</div>}</div>
  </section><section className="panel"><div className="panelhead"><h2>Tribe Crafting Queue</h2><span className="badge">{cart.length} PROJECTS</span></div>
   {cart.length?cart.map(item=><div className="craft-cart-row" key={item.name}><div><strong>{item.name}</strong><small>{recipes[item.name]?.station||'Unknown station'}</small></div><input type="number" min="1" value={item.quantity} onChange={e=>updateQty(item.name,e.target.value)}/><button className="iconbtn" title="Remove" onClick={()=>setCart(cart.filter(x=>x.name!==item.name))}><Trash2 size={17}/></button></div>):<div className="empty">Add an item from the recipe catalog to build your materials list.</div>}
   {!!cart.length&&<button className="ghost" onClick={()=>setCart([])}><Trash2 size={15}/> Clear Queue</button>}
   {planError&&<div className="notice">{planError}</div>}
   {!!totals.length&&<><h3 className="sectioncap">RAW RESOURCE TOTALS</h3><div className="craft-material-grid">{totals.map(([name,count])=><div className="craft-material" key={name}><strong>{fmt.format(count)}</strong><span>{name}</span></div>)}</div><h3 className="sectioncap">INTERMEDIATE CRAFTING BATCHES</h3>{crafts.filter(([name])=>!cart.some(item=>item.name===name)).map(([name,count])=><div className="keyrow" key={name}><span>{name}</span><strong>{fmt.format(count)} crafts</strong></div>)}</>}
  </section></div>
  {!!result?.trees?.length&&<section className="panel knockout-panel"><div className="panelhead"><h2>Ingredient Dependency Trees</h2><span className="badge green">EXPANDABLE</span></div><div className="notice">Open any branch to see its ingredients. The combined total above consolidates shared intermediate crafting batches across all selected projects.</div>{result.trees.map(tree=><div className="craft-tree-root" key={tree.name}><RecipeNode node={tree}/></div>)}</section>}
  <div className="notice">Source: ARK Official Community Wiki Craftables table (cross-edition). Known Primitive Plus and mobile-only entries are excluded, but this is not yet a certified official ASA-only manifest. Unreviewed wiki recipes currently assume a one-item output batch; some may have different yields. Optional third-party community data can include mods. Resource substitutions are not automatically optimized.</div>
 </div>;
}
