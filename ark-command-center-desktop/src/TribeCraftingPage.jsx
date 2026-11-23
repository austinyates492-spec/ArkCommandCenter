import React,{useMemo,useState} from 'react';
import {Layers,Plus,Trash2,Search,ChevronRight,Cloud,RefreshCcw,Package,Users,GitBranch,ClipboardList,CheckCircle2} from 'lucide-react';
import {starterRecipes} from './crafting-recipes';
import wikiRecipes from './wiki-crafting-recipes.json' with {type:'json'};
import {calculateCraftingCart} from './crafting-engine';
import './crafting.css';
import './tribe-crafting.css';
import './tribe-crafting-v3.css';

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
 const [query,setQuery]=useState('');
 const [selected,setSelected]=useState('Sloped Wooden Roof');
 const [quantity,setQuantity]=useState(1);
 const [busy,setBusy]=useState(false);
 const [feedback,setFeedback]=useState('');
 const matches=useMemo(()=>names.filter(name=>name.toLowerCase().includes(query.toLowerCase())).slice(0,400),[query,names]);
 const selectedName=matches.includes(selected)?selected:matches[0]||'';
 const selectedRecipe=catalog[selectedName];
 const queue=live.crafting||[];
 let plan=null,planError='';
 try{plan=calculateCraftingCart(queue,catalog);}catch(e){planError=e.message;}
 const totals=Object.entries(plan?.materials||{}).sort((a,b)=>b[1]-a[1]);
 const crafts=Object.entries(plan?.crafts||{}).filter(([name])=>!queue.some(item=>item.name===name)).sort((a,b)=>b[1]-a[1]);
 const totalUnits=totals.reduce((sum,[,count])=>sum+count,0);
 const totalItems=queue.reduce((sum,item)=>sum+item.quantity,0);
 const add=async()=>{
  const n=Number(quantity);
  if(!selectedName||!Number.isSafeInteger(n)||n<1||n>1000000){setFeedback('Choose a recipe and a whole-number quantity between 1 and 1,000,000.');return;}
  setBusy(true);setFeedback('');
  try{await live.addCraft(selectedName,n);setFeedback('Added '+n.toLocaleString()+' × '+selectedName+' to the shared tribe queue.');}
  catch(e){setFeedback('Unable to add shared project: '+e.message);}
  finally{setBusy(false);}
 };
 const act=async(action,success)=>{
  setBusy(true);setFeedback('');
  try{await action();setFeedback(success);}
  catch(e){setFeedback('Shared update failed: '+e.message);}
  finally{setBusy(false);}
 };
 if(!user)return <div className="craft-workspace tribe-crafting-page tribe-crafting-v3"><div className="pagetitle"><span className="eyebrow">LOGISTICS / TRIBE</span><h1>Tribe Crafting <span className="tribe-v3-release">NEW DESIGN</span></h1><p>Coordinate your entire tribe's shared production queue in one live workspace.</p></div><section className="panel tribe-v3-signin"><Cloud size={30}/><h2>Connect your tribe</h2><p>Sign in to see shared crafting projects, combined materials and real-time updates from tribe members.</p><button className="primary" onClick={onOpenAccount}><Cloud size={16}/> Open Tribe Cloud</button></section></div>;
 return <div className="craft-workspace tribe-crafting-page tribe-crafting-v3">
  <div className="pagetitle"><span className="eyebrow">COMMAND CENTER / SHARED LOGISTICS</span><h1>Tribe Crafting <span className="tribe-v3-release">NEW DESIGN</span></h1><p>Plan, organize and manage production together. Your tribe sees the same live queue and combined resource requirements.</p></div>
  <section className="tribe-v3-summary" aria-label="Tribe production summary">
   <div className="tribe-v3-stat"><span><ClipboardList size={17}/> Shared Projects</span><strong>{queue.length}</strong><small>Active crafting requests</small></div>
   <div className="tribe-v3-stat"><span><Package size={17}/> Finished Items</span><strong>{fmt.format(totalItems)}</strong><small>Across queued projects</small></div>
   <div className="tribe-v3-stat"><span><Layers size={17}/> Raw Resources</span><strong>{totals.length}</strong><small>{fmt.format(totalUnits)} total units needed</small></div>
   <div className="tribe-v3-stat"><span><Cloud size={17}/> Tribe Sync</span><strong className="tribe-v3-sync-label">{live.status==='live'?'LIVE':live.status==='polling'?'POLLING':live.status==='connecting'?'CONNECTING':'OFFLINE'}</strong><small>{live.status==='live'?'Changes update across accounts':'Cloud refresh is not currently live'}</small></div>
  </section>
  <div className="tribe-v3-top">
   <section className="panel tribe-v3-planner" aria-label="Create shared crafting project">
    <div className="tribe-v3-head"><h2>Shared Recipe Planner</h2><span className="tribe-v3-pill">01 / PLAN</span></div>
    <label className="field"><span>Find a recipe</span><div className="searchbox"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Turret, ammunition, wooden roof..."/></div></label>
    <label className="field"><span>Choose recipe</span><select value={selectedName} onChange={e=>setSelected(e.target.value)}>{!selectedName&&<option value="">Choose a recipe</option>}{matches.map(name=><option value={name} key={name}>{name}</option>)}</select></label>
    {selectedRecipe&&<div className="tribe-v3-recipe-card">
      <strong>{selectedName}</strong>
      <div><span>Category</span><b>{selectedRecipe.category||'Uncategorized'}</b></div>
      <div><span>Crafting station</span><b>{selectedRecipe.station||'Inventory'}</b></div>
      <div><span>Output per craft</span><b>{selectedRecipe.output||1}</b></div>
    </div>}
    <label className="field"><span>Quantity to add</span><input type="number" min="1" max="1000000" value={quantity} onChange={e=>setQuantity(e.target.value)}/></label>
    <button className="primary full" disabled={!selectedName||busy} onClick={add}><Plus size={16}/> Add to Tribe Queue</button>
    <p className="tribe-v3-description">New projects synchronize to the same shared crafting database used by all tribe members.</p>
   </section>
   <section className="panel tribe-v3-material-panel" aria-label="Combined materials for shared projects">
    <div className="tribe-v3-head"><h2>Resource Requirements</h2><span className="tribe-v3-pill">{totals.length} MATERIAL TYPES</span></div>
    <div className="tribe-v3-material-summary"><div><small>Queued projects</small><strong>{queue.length}</strong></div><div><small>Total resource units</small><strong>{fmt.format(totalUnits)}</strong></div><div><small>Intermediate batches</small><strong>{fmt.format(crafts.reduce((sum,[,count])=>sum+count,0))}</strong></div></div>
    {planError&&<div className="notice" role="alert">{planError}</div>}
    {totals.length?<div className="tribe-v3-resources">{totals.map(([name,count],index)=><div className="tribe-v3-resource" key={name}><span className="tribe-v3-resource-icon">{index%2?'◆':'⬡'}</span><strong>{name}</strong><span>{fmt.format(count)} <small>required</small></span></div>)}</div>:<div className="empty">The combined raw resource list appears when the tribe adds its first project.</div>}
    <p className="tribe-v3-description">These totals are calculated from live shared projects. Gathered inventory is not yet recorded or synchronized by the tribe backend.</p>
   </section>
  </div>
  <div className="tribe-v3-bottom">
   <section className="panel tribe-v3-tree-panel" aria-label="Shared crafting dependencies">
    <div className="tribe-v3-head"><h2>Crafting Breakdown</h2><span className="tribe-v3-pill">02 / COMPONENTS</span></div>
    <p className="tribe-v3-description">Expand a branch to see each intermediate craft and raw ingredient. Multiple projects share consolidated material totals.</p>
    {plan?.trees?.length?<div className="tribe-v3-trees">{plan.trees.map(tree=><div className="craft-tree-root" key={tree.name}><Node item={tree}/></div>)}</div>:<div className="empty">Add recipes to see your tribe's complete crafting dependency trees.</div>}
    {!!crafts.length&&<div className="tribe-v3-batches"><h3 className="sectioncap">INTERMEDIATE CRAFTING BATCHES</h3>{crafts.map(([name,count])=><div className="keyrow" key={name}><span>{name}</span><strong>{fmt.format(count)} crafts</strong></div>)}</div>}
   </section>
   <section className="panel tribe-v3-queue-panel" aria-label="Live tribe production queue">
    <div className="tribe-v3-head"><h2>Production Queue</h2><span className="tribe-v3-pill">{queue.length} PROJECTS</span></div>
    {queue.length?<div className="tribe-v3-queue-list">{queue.map(item=><div className="tribe-v3-project" key={item.name}><div className="tribe-v3-project-name"><strong>{item.name}</strong><small>{catalog[item.name]?.station||'Unknown station'}{item.updatedBy?' · Updated by '+item.updatedBy:''}</small></div><Quantity key={item.name+'-'+item.quantity} item={item} onSave={n=>act(()=>live.setCraft(item.name,n,item.quantity),'Updated '+item.name+' for the tribe.')}/><button className="iconbtn" disabled={busy} title={'Remove '+item.name} onClick={()=>act(()=>live.removeCraft(item.name),'Removed '+item.name+' from the tribe queue.')}><Trash2 size={17}/></button></div>)}</div>:<div className="empty">No shared crafting requests yet. Add a recipe to start production planning.</div>}
    <div className="tribe-v3-queue-actions"><button className="ghost" disabled={busy} onClick={()=>act(()=>live.refresh('crafting'),'Shared crafting information refreshed.')}><RefreshCcw size={15}/> Refresh</button>{queue.length>0&&<button className="ghost" disabled={busy} onClick={()=>{if(window.confirm('Clear every tribe crafting project for all members?'))void act(()=>live.clearCraft(),'Cleared the shared crafting queue.');}}><Trash2 size={15}/> Clear Tribe Queue</button>}</div>
    {feedback&&<div className="notice" role="status">{feedback}</div>}
    {live.error&&<div className="notice" role="alert">{live.error}</div>}
    <p className="tribe-v3-description">Edits are saved to the tribe's shared queue. Quantity changes save when you leave the field or press Enter.</p>
   </section>
  </div>
  <div className="notice">Shared across your tribe accounts. The recipe tree uses the official-community-wiki catalog and reviewed starter recipes. Unverified ASA batch yields and map-specific recipes may still need checking. Inventory gathering completion is not currently part of shared tribe crafting.</div>
 </div>;
}
