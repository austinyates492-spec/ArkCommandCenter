import test from 'node:test';
import assert from 'node:assert/strict';
import {statSync,readFileSync} from 'node:fs';
import {aberrationWikiAvailableResources,aberrationWikiResources,aberrationWikiSource} from './aberration-resource-overlay.js';
import {aberrationZones,aberrationZoneOptions,aberrationZoneOpacity,zoneById,zoneContains} from './aberration-zone-focus.js';
import {resourcesForMap} from './atlas-resource-model.js';
import {candidateFarmingSites,generateFarmingRoute} from './island-area-route-planner.js';

test('Aberration uses genuine ASA image and explicitly attributed shared Wiki source',()=>{
 assert.ok(statSync(new URL('../public/maps/aberration-asa.jpg',import.meta.url)).size>1000000);
 assert.equal(aberrationWikiSource.revision,571822);
 assert.equal(aberrationWikiSource.verifiedASA,false);
 assert.equal(aberrationWikiSource.omittedOutOfBoundsCount,0);
 assert.equal(aberrationWikiResources.length,4500);
 for(const p of aberrationWikiResources){
  assert.ok(p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100);
  assert.match(p.source,/ASA nodes unverified/);
 }
});
test('Aberration resource selections include gems, gas, charges and element ore, with no obelisks treated as a farm',()=>{
 const all=resourcesForMap('Aberration').map(p=>p.id);
 for(const resource of ['Blue Gems','Green Gems','Red Gems','Element Ore','Gas Vein','Charge Node','Black Pearls','Organic Polymer','Metal','Rich Metal'])assert.ok(all.includes(resource),resource);
 assert.equal(aberrationWikiAvailableResources.length,21);
 assert.ok(!aberrationWikiAvailableResources.some(v=>/Obelisk/.test(v)));
 assert.ok(aberrationWikiResources.some(p=>p.resource==='Blue Gems'));
 assert.ok(aberrationWikiResources.some(p=>p.resource==='Gas Vein'));
});
test('Zone dropdown includes 3 named focus modes and ALL, all polygon vertices map into GPS space',()=>{
 assert.deepEqual(aberrationZoneOptions.map(z=>z.id),['all','green','blue','red']);
 assert.equal(aberrationZoneOpacity,0.15);
 for(const zone of aberrationZones){
  assert.ok(zone.polygon.length>=12);
  for(const p of zone.polygon)assert.ok(p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100);
  assert.ok(zoneContains(zone,zone.polygon[3]));
 }
 assert.equal(zoneById('all'),null);
 assert.ok(zoneById('green'));
 assert.ok(zoneById('blue'));
 assert.ok(zoneById('red'));
});
test('Aberration region selection fades only background and wiki points, retaining pin and route tools',()=>{
 const viewer=readFileSync(new URL('./IslandNativeMap.jsx',import.meta.url),'utf8');
 const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');
 const style=readFileSync(new URL('./island-native-map.css',import.meta.url),'utf8');
 for(const marker of ['Aberration Zone Focus','zoneFocus','aberrationZoneOptions.map','clipPath="url(#aberration-active-zone)"','opacity={activeZone?aberrationZoneOpacity:1}','opacity={nodeOpacity(p)}','onSaveAt(inspected)','plannedStops.map','pointers.current.size===2'])assert.ok(viewer.includes(marker),marker);
 assert.ok(page.includes("map==='Aberration'?aberrationWikiResources"));
 assert.ok(page.includes("map==='Aberration'?'/maps/aberration-asa.jpg'"));
 assert.ok(style.includes('.island-zone-select'));
});
test('Aberration farming route uses only published source IDs inside selected user polygon',()=>{
 const poly=[{lat:5,lon:5},{lat:5,lon:95},{lat:95,lon:95},{lat:95,lon:5}];
 const types=['Metal','Blue Gems','Element Ore'];
 const eligible=candidateFarmingSites(aberrationWikiResources,poly,types);
 assert.ok(eligible.length>30);
 const plan=generateFarmingRoute({points:aberrationWikiResources,polygon:poly,types,maxStops:12,mode:'balanced'});
 assert.equal(plan.stops.length,12);
 for(const p of plan.stops)assert.ok(eligible.some(n=>n.id===p.id&&n.lat===p.lat&&n.lon===p.lon));
});
