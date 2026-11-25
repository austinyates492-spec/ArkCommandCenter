// Search only known catalog rows and real, accessible activity. No generated projects.
export const searchGroups=['Active timers','Tribe crafting','Saved map pins','Creatures','Breeding','Recipes','Resources','Maps','Tools'];
const normalize=s=>String(s??'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,' ').trim();
const aliases={'Giganotosaurus':'giga','Carcharodontosaurus':'carcha carch','Therizinosaurus':'theri tickle chicken','Quetzal':'quetz','Ankylosaurus':'anky','Doedicurus':'doed','Triceratops':'trike','Spinosaurus':'spino','Astraeos':'astreos astraeos','Argentavis':'argy argent','Sarcosuchus':'sarco'};
function score(r,q){
 const title=normalize(r.title), terms=normalize([r.title,r.subtitle,r.keywords,aliases[r.title]].join(' '));
 if(title===q)return 100;
 if(title.startsWith(q))return 85;
 if(title.includes(q))return 70;
 if(q.split(' ').every(x=>terms.includes(x)))return 50;
 // Limited typo tolerance for single words, not broad noisy matches.
 if(q.length>=4&&!q.includes(' ')){
  const near=w=>{if(Math.abs(w.length-q.length)>1)return false;let a=0,b=0,errors=0;while(a<q.length&&b<w.length){if(q[a]===w[b]){a++;b++;continue;}if(++errors>1)return false;if(q.length>=w.length)a++;if(w.length>=q.length)b++;}return errors+(q.length-a)+(w.length-b)<=1;};
  if(title.split(' ').some(near))return 25;
 }
 return 0;
}
export function buildSearchIndex({creatures=[],breeding=[],recipes={},mapResources={},timers=[],crafting=[],pins=[],tools=[],now=Date.now()}={}){
 const rows=[];const add=(group,title,subtitle,page,target={},keywords='')=>{if(typeof title==='string'&&title.trim())rows.push({id:JSON.stringify([group,page,title,target]),group,title,subtitle,page,target,keywords});};
 for(const {name,page} of creatures)add('Creatures',name,'Taming calculator · Spawn locations',page,{creature:name});
 for(const name of breeding)add('Breeding',name+' breeding','Breeding calculator · Incubation & maturation','breeding',{creature:name},aliases[name]);
 for(const [name,recipe] of Object.entries(recipes))add('Recipes',name,[recipe?.category,recipe?.station].filter(Boolean).join(' · ')||'Crafting recipe','crafting',{recipe:name});
 for(const [map,resources] of Object.entries(mapResources)){
  add('Maps',map,'Resource Atlas','resources',{map});
  for(const name of new Set(resources))add('Resources',name,map+' · Resource Atlas','resources',{map,resource:name});
 }
 for(const t of timers)if(t&&t.id!=null&&Number.isFinite(t.end)&&t.end>now){
  const mins=Math.max(1,Math.ceil((t.end-now)/60000));
  add('Active timers',t.name,(t.type||'Timer')+' · '+(mins>=60?Math.floor(mins/60)+'h '+mins%60+'m':mins+'m')+' remaining','timers',{timerId:String(t.id)});
 }
 for(const item of crafting)if(item&&Number.isFinite(item.quantity)&&item.quantity>0)add('Tribe crafting',item.name,item.quantity.toLocaleString()+' requested · Shared queue','tribe-crafting',{project:item.name});
 for(const p of pins)if(p&&typeof p.id==='string'&&Object.hasOwn(mapResources,p.map)&&Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100)add('Saved map pins',p.title||p.resource,p.map+' · Saved on this device','resources',{map:p.map,pinId:p.id,resource:p.resource},p.resource);
 for(const t of tools)add('Tools',t.title,t.subtitle||'Open workspace',t.page);
 return rows;
}
export function searchWorkspace(index,query,limit=5){
 const q=normalize(query);if(!q)return [];
 const ranked=index.map(row=>({row,score:score(row,q)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.row.title.localeCompare(b.row.title)||a.row.subtitle.localeCompare(b.row.subtitle));
 return searchGroups.map(group=>({group,results:ranked.filter(x=>x.row.group===group).slice(0,limit).map(x=>x.row)})).filter(x=>x.results.length);
}
