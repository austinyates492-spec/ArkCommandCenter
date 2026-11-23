import React,{useMemo,useState} from 'react';
import {Layers,Plus,Minus,Trash2,Search,ChevronRight,Save,Upload,Package,Check,Cloud,RefreshCcw} from 'lucide-react';
import {starterRecipes,recipeAliases} from './crafting-recipes';
import communityRecipes from './community-crafting-recipes.json' with {type:'json'};
import wikiRecipes from './wiki-crafting-recipes.json' with {type:'json'};
import {calculateCraftingCart,validateRecipes} from './crafting-engine';
import './crafting.css';
import './crafting-lab-v3.css';

const fmt=new Intl.NumberFormat('en-US');
function useLocal(key,initial){const [value,setValue]=useState(()=>{try{return JSON.parse(localStorage.getItem(key))??initial}catch{return initial}});const save=value=>{setValue(value);localStorage.setItem(key,JSON.stringify(value));};return [value,save]}
function RecipeNode({node,depth=0}){
 if(node.raw)return <div className="craftleaf" style={{paddingLeft:`${Math.min(depth,7)*14}px`}}><span className="craftnode-dot"/> <strong>{fmt.format(node.quantity)}</strong> {node.name} <small>RAW</small></div>;
 return <details className="craftbranch" open={depth<2}><summary style={{paddingLeft:`${Math.min(depth,7)*14}px`}}><ChevronRight size={16}/><strong>{fmt.format(node.quantity)} × {node.name}</strong><span>{fmt.format(node.batches)} craft{node.batches===1?'':'s'}{node.output>1?` · produces ${fmt.format(node.produced)}`:''}</span></summary><div>{node.children.map((child,i)=><RecipeNode key={`${child.name}-${i}`} node={child} depth={depth+1}/>)}</div></details>;
}
export default function CraftingPage({liveRecipes={},live,user,onOpenAccount,onOpenTribeCrafting}){
 const [extra,setExtra]=useLocal('ark.crafting.recipes',{});
 const [includeCommunity,setIncludeCommunity]=useLocal('ark.crafting.community',false);
 const [cart,setCart]=useLocal('ark.crafting.cart',[]);
 const [gathered,setGathered]=useLocal('ark.crafting.gathered.local',{});
 const [sending,setSending]=useState(false);
 const [search,setSearch]=useState('');
 const [selected,setSelected]=useState('Sloped Wooden Roof');
 const [quantity,setQuantity]=useState(1);
 const [error,setError]=useState('');
 const [form,setForm]=useState({name:'',output:1,category:'Custom',station:'Inventory',ingredients:'Wood: 60\nThatch: 15\nFiber: 10'});
 const recipes=useMemo(()=>({...(includeCommunity?communityRecipes:{}),...wikiRecipes,...liveRecipes,...starterRecipes,...extra}),[extra,includeCommunity,liveRecipes]);
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
 const currentName=matches.includes(selected)?selected:matches[0];
 const currentQty=Number(quantity);
 const validQty=Number.isSafeInteger(currentQty)&&currentQty>0&&currentQty<=1000000;
 const currentRecipe=currentName?recipes[currentName]:null;
 let preview=null,previewError='';
 if(currentName&&validQty){try{preview=calculateCraftingCart([{name:currentName,quantity:currentQty}],recipes);}catch(e){previewError=e.message;}}
 const previewTotals=Object.entries(preview?.materials||{}).sort((a,b)=>b[1]-a[1]);
 const previewUnits=previewTotals.reduce((sum,[,count])=>sum+count,0);
 const previewGathered=previewTotals.reduce((sum,[name,count])=>sum+Math.min(count,Math.max(0,gathered[name]||0)),0);
 const previewPercent=previewUnits?Math.round(previewGathered/previewUnits*100):0;
 const sharedCatalog={...wikiRecipes,...liveRecipes,...starterRecipes};
 const sendToTribe=async()=>{
  if(!user){onOpenAccount?.();return;}
  if(!live?.addCraft||sending||!cart.length)return;
  const invalid=cart.filter(item=>!sharedCatalog[item.name]||Object.hasOwn(extra,item.name)||(includeCommunity&&Object.hasOwn(communityRecipes,item.name)&&!Object.hasOwn(sharedCatalog,item.name)));
  if(invalid.length){setError('These local/custom items cannot be sent until added to the shared recipe catalog: '+invalid.map(x=>x.name).join(', '));return;}
  setSending(true);setError('');
  let sent=0;
  try{
   for(const item of cart){
    if(!Number.isSafeInteger(item.quantity)||item.quantity<1||item.quantity>1000000)throw new Error('Invalid queue quantity for '+item.name);
    await live.addCraft(item.name,item.quantity);
    sent++;
   }
   setError('Sent '+sent+' project'+(sent===1?'':'s')+' to the shared Tribe Crafting queue. Your local queue is unchanged.');
  }catch(e){setError('Shared queue transfer stopped after '+sent+' project'+(sent===1?'':'s')+': '+e.message+'. Already sent items remain shared.');}
  finally{setSending(false);}
 };
 const setCollected=(name,amount)=>setGathered(previous=>({...previous,[name]:Math.max(0,Math.min(1000000000,(Number(previous[name])||0)+amount))}));
 const totals=Object.entries(result?.materials||{}).sort((a,b)=>b[1]-a[1]);
 const crafts=Object.entries(result?.crafts||{}).sort((a,b)=>b[1]-a[1]);
 return <div className="craft-workspace crafting-lab-v3">
  <div className="pagetitle"><span className="eyebrow">COMMAND CENTER / LOGISTICS</span><h1>Crafting Lab</h1><p>Plan. Gather. Craft. Coordinate. Expand ingredient dependencies and combine production projects without losing your existing recipes.</p></div>
  <div className="craftv3-upper">
   <section className="panel craftv3-planner" aria-label="Recipe planner">
    <div className="craftv3-head"><h2>Recipe Planner</h2><span className="craftv3-pill">01 / PLAN</span></div>
    <label className="field"><span>Find a recipe or category</span><div className="searchbox"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Wood roof, tranq dart, gunpowder..." /></div></label>
    <label className="field"><span>Choose recipe</span><select value={matches.includes(selected)?selected:''} onChange={e=>setSelected(e.target.value)}>{!matches.includes(selected)&&<option value="">Choose a matching recipe</option>}{matches.map(name=><option key={name} value={name}>{name}{recipes[name]?.verification?' · check ASA':''}</option>)}</select></label>
    {currentRecipe&&<div className="craftv3-recipe-summary">
     <strong className="craftv3-recipe-name">{currentName}</strong>
     <div><span>Category</span><strong>{currentRecipe.category||'Uncategorized'}</strong></div>
     <div><span>Crafting station</span><strong>{currentRecipe.station||'Inventory'}</strong></div>
     <div><span>Output per craft</span><strong>{currentRecipe.output||1}</strong></div>
     <div><span>Recipe status</span><strong>{currentRecipe.verification?'Check ASA availability':Object.hasOwn(extra,currentName)?'Local custom recipe':'Catalog recipe'}</strong></div>
    </div>}
    {currentRecipe?.verification&&<div className="notice">Source-backed but not individually ASA-verified. Confirm item availability, ingredients and batch yields.</div>}
    <label className="field"><span>Quantity to produce</span><div className="craftv3-quantity"><button type="button" className="ghost" aria-label="Decrease quantity" onClick={()=>setQuantity(Math.max(1,(validQty?currentQty:1)-10))}><Minus size={16}/></button><input type="number" min="1" max="1000000" value={quantity} onChange={e=>setQuantity(e.target.value)}/><button type="button" className="ghost" aria-label="Increase quantity" onClick={()=>setQuantity(Math.min(1000000,(validQty?currentQty:1)+10))}><Plus size={16}/></button></div></label>
    <button className="primary full" disabled={!currentName||!validQty} onClick={add}><Plus size={17}/> Add to Crafting Queue</button>
    <div className="craftv3-features"><span>Nested calculations</span><span>Multiple projects</span><span>Raw resource totals</span></div>
    <details className="craftv3-advanced"><summary>Custom recipes and catalog import</summary>
     <div className="notice"><strong>{Object.keys(wikiRecipes).length.toLocaleString()} Official Community Wiki recipe records</strong> and 22 reviewed starter recipes are included. Not all records have been checked for ASA availability or batch yields.</div>
     <label className="field"><span><input type="checkbox" checked={includeCommunity} onChange={e=>{setIncludeCommunity(e.target.checked);setSearch('');}}/> Expanded community recipe candidates (unverified)</span></label>
     
    </details>
   </section>
   <section className="panel craftv3-requirements" aria-label="Resource requirements">
    <div className="craftv3-head"><h2>Resource Requirements</h2><span className="craftv3-pill">{previewTotals.length} MATERIAL TYPES</span></div>
    <div className="craftv3-summary-grid">
     <div><small>Finished items</small><strong>{validQty?fmt.format(currentQty):'—'}</strong></div>
     <div><small>Resource units</small><strong>{fmt.format(previewUnits)}</strong></div>
     <div><small>Gathered locally</small><strong>{previewPercent}%</strong></div>
    </div>
    {previewError&&<div className="notice">{previewError}</div>}
    {previewTotals.length?<div className="craftv3-resource-list">
     {previewTotals.map(([name,count],index)=>{
      const collected=Math.min(count,Math.max(0,Number(gathered[name])||0));
      const done=collected>=count;
      const pct=Math.round(collected/count*100);
      return <div className={'craftv3-resource'+(done?' collected':'')} key={name}>
       <div className="craftv3-resource-name"><span className="craftv3-resource-symbol">{index%2?'◆':'⬡'}</span><strong>{name}</strong></div>
       <div className="craftv3-resource-progress"><div><strong>{fmt.format(count)} required</strong><small>{fmt.format(collected)} gathered</small></div><div className="craftv3-progress" role="progressbar" aria-label={name+' gathered'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><span style={{width:pct+'%'}}/></div></div>
       <button type="button" className="craftv3-gather-button" disabled={done} onClick={()=>setCollected(name,Math.max(1,Math.ceil(count*.25)))}>{done?<><Check size={14}/> Done</>:<><Plus size={14}/> Gathered</>}</button>
      </div>;
     })}
    </div>:<div className="empty">Select a valid recipe and quantity to see its complete raw resource requirements.</div>}
    <div className="craftv3-inventory-actions"><span>Gathering progress is saved on this device, not shared with the tribe.</span><button className="ghost" type="button" onClick={()=>setGathered({})} disabled={!Object.keys(gathered).length}><RefreshCcw size={14}/> Reset gathered</button></div>
   </section>
  </div>
  <div className="craftv3-lower">
   <section className="panel craftv3-tree-panel">
    <div className="craftv3-head"><h2>Crafting Breakdown</h2><span className="craftv3-pill">02 / COMPONENTS</span></div>
    <p className="craftv3-explain">Expand each production branch to see every intermediate crafting step. Queue totals consolidate overlapping raw material requirements.</p>
    {result?.trees?.length?<div className="craftv3-tree">
      {result.trees.map(tree=><div className="craft-tree-root" key={tree.name}><RecipeNode node={tree}/></div>)}
    </div>:<div className="empty">Add a recipe to the queue to generate the complete production tree.</div>}
    {planError&&<div className="notice">{planError}</div>}
    {totals.length>0&&<div className="craftv3-combined">
     <h3 className="sectioncap">COMBINED RAW RESOURCES · ALL QUEUED PROJECTS</h3>
     <div className="craft-material-grid">{totals.map(([name,count])=><div className="craft-material" key={name}><strong>{fmt.format(count)}</strong><span>{name}</span></div>)}</div>
     <h3 className="sectioncap">INTERMEDIATE CRAFTING BATCHES</h3>
     {crafts.filter(([name])=>!cart.some(item=>item.name===name)).map(([name,count])=><div className="keyrow" key={name}><span>{name}</span><strong>{fmt.format(count)} crafts</strong></div>)}
    </div>}
   </section>
   <section className="panel craftv3-queue-panel">
    <div className="craftv3-head"><h2>Production Queue</h2><span className="craftv3-pill">{cart.length} PROJECTS</span></div>
    {cart.length?<div className="craftv3-queue-list">{cart.map(item=><div className="craftv3-queue-item" key={item.name}>
     <div><strong>{item.name}</strong><small>{recipes[item.name]?.station||'Unknown station'}</small></div>
     <input aria-label={'Quantity for '+item.name} type="number" min="1" max="1000000" value={item.quantity} onChange={e=>updateQty(item.name,e.target.value)}/>
     <button className="iconbtn" title={'Remove '+item.name} onClick={()=>setCart(cart.filter(x=>x.name!==item.name))}><Trash2 size={16}/></button>
    </div>)}</div>:<div className="empty">Add your first recipe to begin planning production.</div>}
    <div className="craftv3-queue-actions"><button className="ghost" disabled={!cart.length||sending} onClick={()=>setCart([])}><Trash2 size={15}/> Clear Queue</button>
     <button className="primary" disabled={!cart.length||sending} onClick={sendToTribe}><Cloud size={16}/>{sending?'Sending…':user?'Send to Tribe Crafting':'Sign in to share'}</button></div>
    {user&&<button type="button" className="craftv3-open-shared" onClick={onOpenTribeCrafting}>Open Shared Tribe Crafting <ChevronRight size={16}/></button>}
    {error&&<div className="notice" role="status">{error}</div>}
    <p className="craftv3-explain">Sending adds the current local projects to the live tribe crafting queue. Local-only custom recipes must first be made available in the shared catalog.</p>
   </section>
  </div>
  <section className="panel craftv3-custom-panel"><details className="craftv3-custom-details"><summary>Advanced · Create or import recipes</summary>
   <p>Custom recipe entries are saved locally. Import a JSON recipe catalog or enter a custom blueprint.</p>
   <div className="craft-editor"><label className="field"><span>Recipe name</span><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Vault"/></label>
    <div className="formgrid"><label className="field"><span>Output per craft</span><input type="number" min="1" value={form.output} onChange={e=>setForm(p=>({...p,output:e.target.value}))}/></label><label className="field"><span>Category</span><input value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}/></label></div>
    <label className="field"><span>Crafting station</span><input value={form.station} onChange={e=>setForm(p=>({...p,station:e.target.value}))}/></label>
    <label className="field"><span>Ingredients · one per line</span><textarea rows="5" value={form.ingredients} onChange={e=>setForm(p=>({...p,ingredients:e.target.value}))}/></label>
    <button className="ghost" onClick={addCustom}><Save size={16}/> Save Custom Recipe</button>
   </div>
   <label className="craft-import"><Upload size={16}/> Import JSON Recipe Catalog <input type="file" accept=".json,application/json" onChange={e=>importData(e.target.files?.[0])}/></label>
  </details></section>
  <div className="notice">Source: ARK Official Community Wiki Craftables table (cross-edition). Known Primitive Plus and mobile-only entries are excluded, but the catalog is not yet a certified official ASA-only manifest. Some unreviewed recipes assume one-item batch output. Optional community data may include mods; resource substitutions are not automatically optimized.</div>
 </div>;
}