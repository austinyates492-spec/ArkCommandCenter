import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {candidateFarmingSites,generateFarmingRoute,insideFarmingArea,gpsRouteDistance,areaRoutePolyline,gpsSegmentInsideArea} from './island-area-route-planner.js';
import {islandWikiResources} from './island-wiki-resource-overlay.js';

const square=[{lat:20,lon:20},{lat:20,lon:65},{lat:70,lon:65},{lat:70,lon:20}];
const samples=[
 {id:'a',lat:25,lon:25,resource:'Metal'},
 {id:'b',lat:30,lon:30,resource:'Crystal'},
 {id:'c',lat:40,lon:44,resource:'Metal'},
 {id:'d',lat:49,lon:53,resource:'Obsidian'},
 {id:'e',lat:60,lon:60,resource:'Crystal'},
 {id:'out',lat:92,lon:92,resource:'Metal'},
 {id:'other',lat:30,lon:32,resource:'Oil'}
];
test('polygon selection covers interior and boundary but excludes outside',()=>{
 assert.equal(insideFarmingArea({lat:40,lon:40},square),true);
 assert.equal(insideFarmingArea({lat:20,lon:30},square),true);
 assert.equal(insideFarmingArea({lat:92,lon:92},square),false);
 assert.equal(insideFarmingArea({lat:40,lon:40},square.slice(0,2)),false);
});
test('all planner strategies enforce polygon, resource filters and maximum stops',()=>{
 for(const mode of ['shortest','balanced','coverage']){
  const p=generateFarmingRoute({points:samples,polygon:square,types:['Metal','Crystal'],maxStops:3,mode});
  assert.equal(p.eligible,4);
  assert.equal(p.stops.length,3);
  assert.equal(new Set(p.stops.map(s=>s.id)).size,3);
  for(const stop of p.stops){
   assert.ok(['Metal','Crystal'].includes(stop.resource));
   assert.ok(insideFarmingArea(stop,square));
   assert.notEqual(stop.id,'out');
  }
 }
});
test('no published eligible resource points is transparent rather than made up',()=>{
 const p=generateFarmingRoute({points:samples,polygon:square,types:['Silica Pearls'],maxStops:10,mode:'balanced'});
 assert.deepEqual(p.stops,[]);
 assert.match(p.reason,/No mapped sites/);
});
test('routes preserve source node IDs and coordinates and do not invent distances',()=>{
 const p=generateFarmingRoute({points:islandWikiResources,polygon:square,types:['Metal','Rich Metal','Crystal'],maxStops:12,mode:'balanced'});
 assert.ok(p.stops.length>0);
 assert.ok(gpsRouteDistance(p.stops)>=0);
 for(const s of p.stops){assert.ok(islandWikiResources.some(p=>p.id===s.id&&p.lat===s.lat&&p.lon===s.lon));}
});
test('Island UI exposes polygon draw, route generation, route editing and mobile-compatible overlays',()=>{
 const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');
 const map=readFileSync(new URL('./IslandNativeMap.jsx',import.meta.url),'utf8');
 const style=readFileSync(new URL('./atlas-production.css',import.meta.url),'utf8');
 for(const s of ['Draw Farming Area','Generate Farming Route','Save Farming Route','Undo last corner','insideFarmingArea','onAreaPoint={drawAreaPoint}','plannedStops={generated?.stops||[]}','areaDrawing={areaDrawing}','generatedFarmingRoutes.v1'])assert.ok(page.includes(s),s);
 for(const s of ['areaPolygon.length>=3','<polygon points={areaLine}','plannedStops.map','onAreaPoint(position)','pointerEvents={areaDrawing'])assert.ok(map.includes(s),s);
 assert.ok(style.includes('.atlas-v3-planner'));
});

test('concave region routes use boundary waypoints instead of drawing through excluded terrain',()=>{
 const concave=[
  {lat:10,lon:10},{lat:10,lon:70},{lat:65,lon:70},
  {lat:65,lon:55},{lat:30,lon:55},{lat:30,lon:25},
  {lat:65,lon:25},{lat:65,lon:10}
 ];
 const left={lat:55,lon:16,resource:'Metal',id:'left'};
 const right={lat:55,lon:64,resource:'Metal',id:'right'};
 assert.equal(insideFarmingArea(left,concave),true);
 assert.equal(insideFarmingArea(right,concave),true);
 assert.equal(gpsSegmentInsideArea(left,right,concave),false);
 const route=areaRoutePolyline([left,right],concave);
 assert.ok(route.length>2, 'Expected intermediate polygon-boundary corners');
 for(let i=1;i<route.length;i++)assert.ok(gpsSegmentInsideArea(route[i-1],route[i],concave),'Every visible line segment must stay in area');
});

test('repeated corners do not classify outside sites as inside',()=>{const repeated=[square[0],square[0],...square.slice(1)];assert.equal(insideFarmingArea({lat:92,lon:92},repeated),false);assert.equal(insideFarmingArea({lat:40,lon:40},repeated),true);});
test('route resource selections control live map markers independently of resource atlas filters',()=>{const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');assert.ok(page.includes("const mapEnabled=tab==='routes'?activeRouteTypes:enabled"));assert.ok(page.includes('enabledResources={mapEnabled}'));assert.ok(page.includes('types:activeRouteTypes'));assert.ok(page.includes('aria-label="Farming route resources"'));});

test('generated farming route focuses its area and uses a line rather than oversized numbered circles',()=>{const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');const map=readFileSync(new URL('./IslandNativeMap.jsx',import.meta.url),'utf8');assert.ok(page.includes('setRouteFocusVersion(v=>v+1)'));assert.ok(map.includes('Fit farming route to map'));assert.ok(map.includes('data-farming-route-line="true"'));assert.ok(map.includes('fitMapPoints([...areaPolygon,...plannedStops])'));assert.ok(!map.includes('r="11" fill="#ffe08c"'));});
