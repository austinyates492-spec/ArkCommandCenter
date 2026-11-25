import test from 'node:test';
import assert from 'node:assert/strict';
import {statSync,readFileSync} from 'node:fs';
import {resourcesForMap} from './atlas-resource-model.js';
import {extinctionWikiResources,extinctionWikiSource,extinctionAtlasPoints,extinctionAtlasAvailableResources,extinctionEventSites,extinctionEventSource} from './extinction-resource-overlay.js';
import {candidateFarmingSites,generateFarmingRoute} from './island-area-route-planner.js';

test('Extinction original ASA map art is locally hosted, community wiki points are not mislabeled ASA verified',()=>{
 assert.ok(statSync(new URL('../public/maps/extinction-asa.jpg',import.meta.url)).size>1000000);
 assert.equal(extinctionWikiSource.revision,548208);
 assert.equal(extinctionWikiSource.verifiedASA,false);
 assert.equal(extinctionWikiResources.length,3565);
 assert.equal(extinctionWikiSource.omittedOutOfBoundsCount,113);
 for(const p of extinctionWikiResources){
  assert.ok(p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100,p.id);
  assert.match(p.source,/ASA verification pending/);
 }
});
test('Event reference coordinates preserve 40 published sites, overlapping categories, and correct counts',()=>{
 assert.equal(extinctionEventSource.waypointCount,40);
 assert.equal(extinctionEventSource.verifiedASA,false);
 assert.equal(extinctionEventSites.length,63);
 const osd=extinctionEventSites.filter(x=>x.resource==='OSD (Orbital Supply Drop)');
 const veins=extinctionEventSites.filter(x=>x.resource==='Element Vein');
 assert.equal(osd.length,37);
 assert.equal(veins.length,26);
 assert.equal(extinctionAtlasPoints.length,3628);
 assert.match(extinctionEventSource.url,/arkcademy.com/);
 assert.equal(new Set(extinctionEventSites.map(p=>p.lat+','+p.lon)).size,40);
 for(const p of extinctionEventSites){
  assert.ok(p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100,p.id);
  assert.equal(p.verifiedASA,false);
  assert.match(p.source,/ARKCademy/);
 }
});
test('Extinction has separate OSD and Element Vein selectors and all supported resource filters',()=>{
 const catalog=resourcesForMap('Extinction').map(x=>x.id);
 for(const resource of ['Element Dust','Metal','Rich Metal','Crystal','Obsidian','Green Gems','Sulfur','Oil','Silk','OSD (Orbital Supply Drop)','Element Vein'])
  assert.ok(catalog.includes(resource),resource);
 assert.ok(extinctionAtlasAvailableResources.includes('OSD (Orbital Supply Drop)'));
 assert.ok(extinctionAtlasAvailableResources.includes('Element Vein'));
 assert.ok(!resourcesForMap('The Island').some(x=>x.id==='OSD (Orbital Supply Drop)'));
});
test('Planning with either event layer retains only real sourced reference sites in polygon',()=>{
 const boundary=[{lat:10,lon:10},{lat:10,lon:95},{lat:95,lon:95},{lat:95,lon:10}];
 const types=['OSD (Orbital Supply Drop)','Element Vein'];
 const eligible=candidateFarmingSites(extinctionAtlasPoints,boundary,types);
 assert.equal(eligible.length,63);
 const route=generateFarmingRoute({points:extinctionAtlasPoints,polygon:boundary,types,maxStops:12,mode:'balanced'});
 assert.equal(route.stops.length,12);
 for(const stop of route.stops)assert.ok(eligible.some(p=>p.id===stop.id&&p.lat===stop.lat&&p.lon===stop.lon));
});
test('Extinction is native without Aberration biome focus and includes source warning',()=>{
 const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');
 const map=readFileSync(new URL('./IslandNativeMap.jsx',import.meta.url),'utf8');
 assert.ok(page.includes("map==='Extinction'?extinctionAtlasPoints"));
 assert.ok(page.includes("map==='Extinction'?'/maps/extinction-asa.jpg'"));
 assert.ok(page.includes("map==='Extinction'?'Authentic Extinction ASA terrain"));
 assert.ok(page.includes('OSD and Element Vein markers use separate ARKCademy'));
 assert.ok(page.includes('savedPlans.filter(p=>p.map===map)'));
 assert.ok(map.includes("mapName==='Aberration'&&<label className=\"island-zone-select\""));
 assert.ok(map.includes('selectedWiki.kind===\'event\''));
 assert.ok(map.includes('onSaveAt(inspected)'));
});
