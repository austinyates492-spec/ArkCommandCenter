import test from 'node:test';
import assert from 'node:assert/strict';
import {statSync,readFileSync} from 'node:fs';
import {resourcesForMap,checkAtlasPin} from './atlas-resource-model.js';
import {lostColonyAtlasPoints,lostColonyAtlasAvailableResources,lostColonyWikiResources,lostColonyResourceOutposts,lostColonyWikiSource,lostColonyOutpostSource} from './lost-colony-resource-overlay.js';
import {candidateFarmingSites,generateFarmingRoute} from './island-area-route-planner.js';

test('Lost Colony uses genuine locally hosted ASA terrain and independently published ASA wiki GPS layers',()=>{
 assert.ok(statSync(new URL('../public/maps/lost-colony-asa.jpg',import.meta.url)).size>1000000);
 assert.equal(lostColonyWikiSource.revision,593948);
 assert.equal(lostColonyWikiSource.verifiedASA,true);
 assert.equal(lostColonyWikiSource.omittedOutOfBoundsCount,5);
 assert.equal(lostColonyOutpostSource.revision,600802);
 assert.equal(lostColonyOutpostSource.verifiedASA,true);
 assert.equal(lostColonyOutpostSource.omittedOutOfBoundsCount,0);
 assert.equal(lostColonyWikiResources.length,17966);
 assert.equal(lostColonyResourceOutposts.length,22);
 assert.equal(lostColonyAtlasPoints.length,17988);
 assert.equal(lostColonyAtlasAvailableResources.length,11);
 for(const p of lostColonyAtlasPoints){
  assert.ok(p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100,p.id);
  assert.equal(p.verifiedASA,true);
 }
});
test('Lost Colony resource filters include ASA wiki specialties with explorer-only outposts separate',()=>{
 const catalog=resourcesForMap('Lost Colony').map(x=>x.id);
 for(const kind of ['Metal','Rich Metal','Black Pearls','Crystal','Obsidian','Oil','Silica Pearls','Plant Species R','Organic Polymer','Sulfur','Resource Outpost'])
  assert.ok(catalog.includes(kind),kind);
 for(const kind of lostColonyAtlasAvailableResources)assert.ok(catalog.includes(kind),kind);
 assert.ok(lostColonyWikiResources.every(p=>p.kind==='wiki'));
 assert.ok(lostColonyResourceOutposts.every(p=>p.kind==='outpost'));
 assert.ok(!resourcesForMap('The Island').some(x=>x.id==='Resource Outpost'));
 assert.equal(checkAtlasPin({resource:'Resource Outpost',lat:95.9,lon:27.3},'Lost Colony').resource,'Resource Outpost');
});
test('Lost Colony farming route uses only published resource GPS positions inside drawn polygon',()=>{
 const polygon=[{lat:0,lon:0},{lat:0,lon:100},{lat:100,lon:100},{lat:100,lon:0}];
 const eligible=candidateFarmingSites(lostColonyAtlasPoints,polygon,['Resource Outpost']);
 assert.equal(eligible.length,22);
 const plan=generateFarmingRoute({points:lostColonyAtlasPoints,polygon,types:['Resource Outpost'],maxStops:12,mode:'balanced'});
 assert.equal(plan.stops.length,12);
 for(const p of plan.stops)assert.ok(eligible.some(n=>n.id===p.id&&n.lat===p.lat&&n.lon===p.lon));
});
test('Lost Colony resource atlas uses normal native UI and leaves zone focus only on Aberration',()=>{
 const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');
 const viewer=readFileSync(new URL('./IslandNativeMap.jsx',import.meta.url),'utf8');
 assert.ok(page.includes("map==='Lost Colony'?lostColonyAtlasPoints"));
 assert.ok(page.includes("map==='Lost Colony'?'/maps/lost-colony-asa.jpg'"));
 assert.ok(page.includes("map==='Lost Colony'?'Authentic Lost Colony ASA terrain"));
 assert.ok(page.includes("map==='Lost Colony'?'Resource markers"));
 assert.ok(page.includes('savedPlans.filter(p=>p.map===map)'));
 assert.ok(page.includes('plannedStops={generated?.stops||[]}'));
 assert.ok(viewer.includes("mapName==='Lost Colony'?'https://ark.wiki.gg/wiki/Data:Maps/Resources/Lost_Colony/ASA'"));
 assert.ok(viewer.includes("mapName==='Aberration'&&<label className=\"island-zone-select\""));
 assert.ok(viewer.includes('onSaveAt(inspected)'));
 assert.ok(viewer.includes('pointers.current.size===2'));
});
