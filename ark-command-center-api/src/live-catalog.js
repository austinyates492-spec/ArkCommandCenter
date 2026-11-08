// Catalog updates are data-only. Never execute wiki text or overwrite bundled
// validated records. New species remain unverified until their mechanics are known.
const WIKI='https://ark.wiki.gg/api.php';
const EDITION_BLOCK=/\b(?:Primitive Plus|ARK Mobile|Mobile:|Survival Evolved Mobile|PixARK|Mod:|Modded)/i;
const MAX_RECIPES=4000;
const MAX_CREATURES=1600;
const FETCH_TIMEOUT=25_000;
const API_ORIGIN='https://ark.wiki.gg';

function safeName(value){return typeof value==='string'&&value.length<=100&&/^[\w\s:'’\-().,]+$/u.test(value)&&!EDITION_BLOCK.test(value);}
export function normalizeRecipeRows(rows){
 const recipes={};
 for(const record of rows){
  const row=record?.title||record;const name=String(row?.Page||'').trim();
  if(!safeName(name))continue;
  const ingredients={};let valid=true;
  for(let n=1;n<=15;n++){
   const ingredient=String(row[`ingredient${n}`]||'').trim();if(!ingredient)continue;
   const quantity=Number(row[`quantity${n}`]);
   if(!safeName(ingredient)||!Number.isSafeInteger(quantity)||quantity<1||quantity>1_000_000){valid=false;break;}
   ingredients[ingredient]=(ingredients[ingredient]||0)+quantity;
  }
  if(!valid||!Object.keys(ingredients).length||ingredients[name])continue;
  recipes[name]={category:'Live wiki candidate',station:String(row.craftedIn||'Verify station').slice(0,90),ingredients,output:1,
   verification:'wiki-asa-unconfirmed',source:`${API_ORIGIN}/wiki/${encodeURIComponent(name.replaceAll(' ','_'))}`};
 }
 // Discard cycles so a new wiki row cannot break the crafting calculator.
 const processed=new Set(),visiting=new Set();
 function visit(name){if(!recipes[name]||processed.has(name))return false;if(visiting.has(name))return true;visiting.add(name);
  for(const child of Object.keys(recipes[name].ingredients))if(visit(child)){visiting.delete(name);delete recipes[name];return false;}
  visiting.delete(name);processed.add(name);return false;}
 Object.keys(recipes).forEach(visit);
 return recipes;
}
export function normalizeCreatures(pages){
 const names=new Set();
 for(const entry of pages){let name=String(entry?.title||'').replace(/^Category:/,'').trim();
  if(safeName(name)&&!/^(?:List of|Category:|Template:|File:|Creature|Creatures|Dinosaur|Dinosaurs)$/i.test(name))names.add(name);
 }
 return [...names].sort().slice(0,MAX_CREATURES);
}
// Release-year categories keep discovery focused on recently introduced
// creatures. Using the calendar year avoids requiring a new desktop build in
// January when the Wiki creates next year's category.
export function creatureYearCategories(year=new Date().getUTCFullYear()){
 const latest=Math.max(2025,Math.min(2100,Math.floor(Number(year)||2025)));
 return Array.from({length:latest-2025+2},(_,i)=>`Category:Creatures released in ${2025+i}`);
}
async function wiki(params){
 const url=new URL(WIKI);
 for(const [k,v] of Object.entries({action:'query',format:'json',formatversion:'2',...params}))url.searchParams.set(k,v);
 const res=await fetch(url,{headers:{'accept':'application/json','user-agent':'ArkCommandCenter/0.8.4 (data discovery; contact via source repository)'},signal:AbortSignal.timeout(FETCH_TIMEOUT)});
 if(!res.ok)throw Error(`Wiki HTTP ${res.status}`);
 const length=Number(res.headers.get('content-length')||0);if(length>3_000_000)throw Error('Wiki response is too large');
 const data=await res.json();if(data?.error)throw Error(`Wiki API error: ${data.error.code||'unknown'}`);return data;
}
const craftFields=['Page','craftedIn',...Array.from({length:15},(_,i)=>[`ingredient${i+1}`,`quantity${i+1}`]).flat()].join(',');
export async function fetchWikiCatalog(previous=null){
 let recipes=previous?.recipes||{},creatures=previous?.creatures||[];
 const sourceStatus={recipes:'cached',creatures:'cached'};
 const sourceErrors=[];
 try{
  // Try smaller Cargo batches if the Wiki extension rejects a large query.
  let recipeRows=[];let lastError;
  for(const batchSize of [500,100]){
   try{
    const rows=[];
    for(let offset=0;offset<MAX_RECIPES;offset+=batchSize){
     const page=await wiki({action:'cargoquery',tables:'Craftables',fields:craftFields,limit:String(batchSize),offset:String(offset)});
     if(!Array.isArray(page?.cargoquery))throw Error('Wiki Craftables response format changed');
     rows.push(...page.cargoquery);if(page.cargoquery.length<batchSize)break;
    }
    recipeRows=rows;lastError=null;break;
   }catch(error){lastError=error;}
  }
  if(lastError)throw lastError;
  if(recipeRows.length<100)throw Error('Wiki Craftables returned too few rows');
  recipes=normalizeRecipeRows(recipeRows);sourceStatus.recipes='updated';
 }catch(error){sourceErrors.push(`Recipes: ${error.message}`);}
 try{
  const pages=[];
  for(const category of creatureYearCategories()){
   let cmcontinue;
   do{
    const result=await wiki({action:'query',list:'categorymembers',cmtitle:category,cmlimit:'500',cmtype:'page',...(cmcontinue?{cmcontinue}:{})});
    if(!Array.isArray(result?.query?.categorymembers))throw Error('Wiki creature release category changed');
    pages.push(...result.query.categorymembers);cmcontinue=result?.continue?.cmcontinue;
   }while(cmcontinue&&pages.length<MAX_CREATURES);
   if(pages.length>=MAX_CREATURES)break;
  }
  const found=normalizeCreatures(pages);
  if(found.length<10)throw Error('Wiki release categories returned too few creature pages');
  creatures=found;sourceStatus.creatures='updated';
 }catch(error){sourceErrors.push(`Creatures: ${error.message}`);}
 if(!Object.values(sourceStatus).includes('updated')&&!previous)throw Error(sourceErrors.join('; '));
 return {source:'ARK Official Community Wiki',sourceUrl:WIKI,checkedAt:new Date().toISOString(),recipes,creatures,sourceStatus,sourceErrors};
}

export async function initializeLiveCatalog(pool){
 await pool.query(`CREATE TABLE IF NOT EXISTS live_catalog (
  key TEXT PRIMARY KEY,data JSONB NOT NULL,updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`);
}
export async function latestLiveCatalog(pool){
 const {rows}=await pool.query("SELECT data FROM live_catalog WHERE key='wiki' LIMIT 1");
 return rows[0]?.data||null;
}
export function startCatalogRefresh(pool,{fetchSource=fetchWikiCatalog,intervalMs=6*60*60*1000}={}){
 let busy=false;
 const refresh=async()=>{
  if(busy)return;busy=true;
  try{const catalog=await fetchSource(await latestLiveCatalog(pool));
   await pool.query("INSERT INTO live_catalog(key,data,updated_at) VALUES('wiki',$1::jsonb,NOW()) ON CONFLICT(key) DO UPDATE SET data=EXCLUDED.data,updated_at=NOW()",[JSON.stringify(catalog)]);
   console.info(`Live wiki catalog checked: ${Object.keys(catalog.recipes).length} recipes, ${catalog.creatures.length} candidate pages; sources ${JSON.stringify(catalog.sourceStatus)}`);
   if(catalog.sourceErrors?.length)console.warn('Wiki source partially unavailable:',catalog.sourceErrors.join('; '));
  }catch(error){console.warn('Live wiki refresh unsuccessful; retaining prior snapshot:',error.message);}
  finally{busy=false;}
 };
 void refresh();const interval=setInterval(()=>void refresh(),intervalMs);interval.unref?.();return ()=>clearInterval(interval);
}
