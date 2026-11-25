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
  if(a.lon===b.lon&&a.lat===b.lat){if(x===a.lon&&y===a.lat)return true;continue;}
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

/** A route may require boundary waypoints when the user draws a concave region.
 * This keeps the *illustrated GPS path* inside the region, without claiming
 * terrain walkability, realistic travel time or a navigable flight corridor.
 */
const orientation=(a,b,c)=>(b.lon-a.lon)*(c.lat-a.lat)-(b.lat-a.lat)*(c.lon-a.lon);
export function gpsSegmentInsideArea(a,b,polygon){
 if(!insideFarmingArea(a,polygon)||!insideFarmingArea(b,polygon))return false;
 for(let i=0;i<polygon.length;i++){
  const c=polygon[i],d=polygon[(i+1)%polygon.length];
  const abC=orientation(a,b,c),abD=orientation(a,b,d);
  const cdA=orientation(c,d,a),cdB=orientation(c,d,b);
  // Proper crossing excludes touching a polygon corner.
  if(abC*abD<-1e-10&&cdA*cdB<-1e-10)return false;
 }
 for(const fraction of [.2,.4,.6,.8]){
  const p={lat:a.lat+(b.lat-a.lat)*fraction,lon:a.lon+(b.lon-a.lon)*fraction};
  if(!insideFarmingArea(p,polygon))return false;
 }
 return true;
}
function withinAreaLeg(start,end,polygon){
 if(gpsSegmentInsideArea(start,end,polygon))return [start,end];
 const nodes=[start,end,...polygon],n=nodes.length;
 const costs=Array(n).fill(Infinity),prev=Array(n).fill(-1),visited=new Set();
 costs[0]=0;
 for(let step=0;step<n;step++){
  let u=-1;
  for(let i=0;i<n;i++)if(!visited.has(i)&&(u===-1||costs[i]<costs[u]))u=i;
  if(u===-1||!Number.isFinite(costs[u])||u===1)break;
  visited.add(u);
  for(let v=0;v<n;v++){
   if(v===u||visited.has(v)||!gpsSegmentInsideArea(nodes[u],nodes[v],polygon))continue;
   const alt=costs[u]+Math.sqrt(dist2(nodes[u],nodes[v]));
   if(alt<costs[v]){costs[v]=alt;prev[v]=u;}
  }
 }
 if(!Number.isFinite(costs[1]))return [start,end]; // Should only occur for a malformed polygon.
 const order=[];for(let i=1;i!==-1;i=prev[i])order.push(nodes[i]);
 return order.reverse();
}
export function areaRoutePolyline(stops,polygon){
 if(!Array.isArray(stops)||!stops.length)return [];
 if(!Array.isArray(polygon)||polygon.length<3)return stops.slice();
 const result=[stops[0]];
 for(let i=1;i<stops.length;i++){
  const leg=withinAreaLeg(stops[i-1],stops[i],polygon);
  result.push(...leg.slice(1));
 }
 return result;
}
