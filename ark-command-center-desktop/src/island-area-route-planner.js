/** Pure browser-side polygon selection and GPS-distance route approximation.
 * Wiki ASA source markers represent reported resource sites, NOT verified
 * traversable roads, flight paths, node quantities or terrain travel time.
 */
export const dist2=(a,b)=>(a.lon-b.lon)**2+(a.lat-b.lat)**2;
export function insideFarmingArea(point,polygon){
 if(!point||!Array.isArray(polygon)||polygon.length<3)return false;
 const x=Number(point.lon),y=Number(point.lat);
 if(!Number.isFinite(x)||!Number.isFinite(y))return false;
 let inside=false;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const a=polygon[i],b=polygon[j];
  // A point precisely on the drawn boundary counts as inside.
  const cross=(x-a.lon)*(b.lat-a.lat)-(y-a.lat)*(b.lon-a.lon);
  const dot=(x-a.lon)*(x-b.lon)+(y-a.lat)*(y-b.lat);
  if(Math.abs(cross)<1e-8&&dot<=0)return true;
  if((a.lat>y)!==(b.lat>y)&&x<(b.lon-a.lon)*(y-a.lat)/(b.lat-a.lat)+a.lon)inside=!inside;
 }
 return inside;
}
export function candidateFarmingSites(points,polygon,types){
 const allowed=new Set(types);
 return points.filter(p=>allowed.has(p.resource)&&insideFarmingArea(p,polygon));
}
function nearest(pool,from){
 let winner=0,best=Infinity;
 for(let i=0;i<pool.length;i++){
  const d=dist2(pool[i],from);
  if(d<best){best=d;winner=i;}
 }
 return pool.splice(winner,1)[0];
}
function twoOpt(stops,start){
 const ordered=stops.slice();
 for(let pass=0;pass<3;pass++){
  let changed=false;
  for(let i=0;i<ordered.length-1;i++){
   const before=i?ordered[i-1]:start;
   for(let j=i+1;j<ordered.length;j++){
    const after=j+1<ordered.length?ordered[j+1]:null;
    const old=Math.sqrt(dist2(before,ordered[i]))+(after?Math.sqrt(dist2(ordered[j],after)):0);
    const neu=Math.sqrt(dist2(before,ordered[j]))+(after?Math.sqrt(dist2(ordered[i],after)):0);
    if(neu+1e-7<old){ordered.splice(i,j-i+1,...ordered.slice(i,j+1).reverse());changed=true;}
   }
  }
  if(!changed)break;
 }
 return ordered;
}
/**
 * Strategies:
 * shortest: nearest-neighbor order from start (prioritizes proximity)
 * balanced: distribute selected sites across selected resource types
 * coverage: spread stops over selected polygon's source sites
 * Returned stops all preserve exact wiki-provided GPS and source IDs.
 */
export function generateFarmingRoute({points,polygon,types,maxStops=12,mode='balanced',start=null}){
 const candidates=candidateFarmingSites(points,polygon,types);
 if(!candidates.length)return {stops:[],eligible:0,reason:'No mapped sites for those resources within the drawn area.'};
 const limit=Math.min(40,Math.max(1,Math.floor(Number(maxStops)||12)),candidates.length);
 const centroid={lat:polygon.reduce((s,p)=>s+p.lat,0)/polygon.length,
   lon:polygon.reduce((s,p)=>s+p.lon,0)/polygon.length};
 const origin=start&&Number.isFinite(start.lat)&&Number.isFinite(start.lon)?start:centroid;
 const chosen=[];
 if(mode==='balanced'){
  const byType=new Map(types.map(t=>[t,candidates.filter(p=>p.resource===t)]).filter(([,p])=>p.length));
  const typeOrder=[...byType.keys()];
  let current=origin;
  while(chosen.length<limit&&typeOrder.length){
   for(let i=0;i<typeOrder.length&&chosen.length<limit;){
    const pool=byType.get(typeOrder[i]);
    if(!pool.length){typeOrder.splice(i,1);continue;}
    const item=nearest(pool,current);chosen.push(item);current=item;i++;
   }
  }
 }else if(mode==='coverage'){
  const pool=candidates.slice();
  chosen.push(nearest(pool,origin));
  while(chosen.length<limit&&pool.length){
   let winner=0,score=-Infinity;
   for(let i=0;i<pool.length;i++){
    const spread=Math.min(...chosen.map(s=>dist2(s,pool[i])));
    if(spread>score){score=spread;winner=i;}
   }
   chosen.push(pool.splice(winner,1)[0]);
  }
 }else{
  const pool=candidates.slice();let current=origin;
  while(chosen.length<limit&&pool.length){const p=nearest(pool,current);chosen.push(p);current=p;}
 }
 // For geographic map straight lines, optimize Euclidean ordering only.
 const ordered=twoOpt(chosen,origin);
 return {stops:ordered,eligible:candidates.length,reason:null};
}
export function gpsRouteDistance(stops,start=null){
 if(!Array.isArray(stops)||stops.length<2)return 0;
 let total=0,previous=start||stops[0];
 for(const p of start?stops:stops.slice(1)){total+=Math.sqrt(dist2(previous,p));previous=p;}
 return total;
}
