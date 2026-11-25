// SVG's screen CTM includes viewBox, CSS size, letterboxing and scroll.
export function screenToMap(svg,x,y){
 try{
  const matrix=svg.getScreenCTM();
  if(!matrix)return null;
  const p=svg.createSVGPoint();p.x=x;p.y=y;
  const mapped=p.matrixTransform(matrix.inverse());
  return Number.isFinite(mapped.x)&&Number.isFinite(mapped.y)?{x:mapped.x,y:mapped.y}:null;
 }catch{return null;}
}
export function mapFraction(svg,x,y,viewport){
 const p=screenToMap(svg,x,y);
 if(!p||!viewport.extent)return null;
 return {x:(p.x-viewport.x)/viewport.extent,y:(p.y-viewport.y)/viewport.extent};
}
export function gpsAtScreen(svg,x,y,viewport){
 const p=screenToMap(svg,x,y);
 if(!p)return null;
 const epsilon=.001;
 if(p.x<viewport.x-epsilon||p.x>viewport.x+viewport.extent+epsilon||p.y<viewport.y-epsilon||p.y>viewport.y+viewport.extent+epsilon)return null;
 return {lat:Math.max(0,Math.min(100,p.y/10)),lon:Math.max(0,Math.min(100,p.x/10))};
}
export function centeredMapViewport(x,y,extent){
 return {x:Math.max(0,Math.min(1000-extent,x-extent/2)),y:Math.max(0,Math.min(1000-extent,y-extent/2)),extent};
}

/** Square map viewport for a farming area, with padding for route labels. */
export function fitMapPoints(points){
 const valid=(points||[]).filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100);
 if(!valid.length)return null;
 const xs=valid.map(p=>p.lon*10),ys=valid.map(p=>p.lat*10);
 const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
 const extent=Math.min(1000,Math.max(125,Math.max(maxX-minX,maxY-minY)*1.24));
 const v=centeredMapViewport((minX+maxX)/2,(minY+maxY)/2,extent);
 return {zoom:1000/extent,center:{x:v.x+extent/2,y:v.y+extent/2}};
}
