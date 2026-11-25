/** Approximate above-ground 2D biome focus boundaries, not verified ASA game masks.
 * Manually traced from published Aberration green/blue/red biome overview.
 * The underlying world is multi-level; GPS lat/lon alone cannot uniquely
 * identify zone or elevation. Treat overlays as visual orientation only.
 * Reference: https://kamigame.jp/ARK/PS4/アベレーション/エリア.html
 * GPS calibration: overview grid lon 10 at px75, lon 90 at px460;
 * lat 10 at py60, lat 90 at py450. 
 */
const gps=points=>points.map(([x,y])=>({lon:Math.max(0,Math.min(100,(x-75)*80/385+10)),lat:Math.max(0,Math.min(100,(y-60)*80/390+10))}));
export const aberrationZones=[
 {id:'green',label:'Green Zone (Fertile)',color:'#75d895',polygon:gps([
  [156,74],[208,60],[259,52],[283,74],[287,105],[316,117],[354,137],
  [345,154],[302,159],[273,175],[260,199],[235,210],[213,241],
  [178,254],[132,251],[89,241],[62,221],[66,196],[98,181],
  [124,166],[131,146],[150,124],[150,97]
 ])},
 {id:'blue',label:'Blue Zone (Bioluminescent)',color:'#77baff',polygon:gps([
  [257,202],[277,173],[313,162],[359,160],[405,173],[429,194],
  [423,233],[414,279],[394,308],[343,311],[305,309],[277,297],
  [267,279],[258,244],[240,229]
 ])},
 {id:'red',label:'Red Zone (Element)',color:'#f27a9e',polygon:gps([
  [122,326],[146,285],[186,261],[207,253],[232,270],[250,300],
  [280,305],[324,308],[365,313],[401,322],[425,349],[423,390],
  [401,424],[364,445],[323,450],[286,439],[271,412],[252,398],
  [234,402],[211,405],[171,401],[145,391],[120,363]
 ])}
];
export const aberrationZoneOptions=[{id:'all',label:'All Zones'},...aberrationZones];
export const aberrationZoneOpacity=0.15;
export const aberrationZoneNote='Visual reference only: biome outlines are approximate and not calibrated against ASA vertical cave entrances or underground elevations. GPS alone cannot reliably determine a cave layer.';
export function zoneById(id){return aberrationZones.find(z=>z.id===id)||null;}
export function zoneContains(zone,point){
 if(!zone||!point)return false;
 const polygon=zone.polygon,x=point.lon,y=point.lat;
 let result=false;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const a=polygon[i],b=polygon[j];
  const cross=(x-a.lon)*(b.lat-a.lat)-(y-a.lat)*(b.lon-a.lon);
  const dot=(x-a.lon)*(x-b.lon)+(y-a.lat)*(y-b.lat);
  if(Math.abs(cross)<1e-7&&dot<=0)return true;
  if((a.lat>y)!==(b.lat>y)&&x<(b.lon-a.lon)*(y-a.lat)/(b.lat-a.lat)+a.lon)result=!result;
 }
 return result;
}
