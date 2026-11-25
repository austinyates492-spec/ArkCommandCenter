import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {resourcesForMap,checkAtlasPin} from './atlas-resource-model.js';
import {ragnarokWikiResources,ragnarokWikiAvailableResources,ragnarokWikiSource} from './ragnarok-resource-overlay.js';
import {candidateFarmingSites,generateFarmingRoute} from './island-area-route-planner.js';

test('Ragnarok uses genuine locally served ASA terrain and attributed wiki GPS reference',()=>{
 assert.ok(statSync(new URL('../public/maps/ragnarok-asa.jpg',import.meta.url)).size>1000000);
 assert.equal(ragnarokWikiSource.revision,548218);
 assert.equal(ragnarokWikiSource.verifiedASA,false);
 assert.equal(ragnarokWikiSource.omittedOutOfBoundsCount,0);
 assert.equal(ragnarokWikiResources.length,5880);
 assert.equal(ragnarokWikiAvailableResources.length,21);
 for(const p of ragnarokWikiResources){
  assert.ok(p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100,p.id);
  assert.match(p.source,/ASA locations unverified/);
 }
});
test('Ragnarok oil wells, water veins and gatherable oil have independent source-backed layers',()=>{
 const catalog=resourcesForMap('Ragnarok').map(x=>x.id);
 for(const name of ['Oil','Oil Vein / Oil Well','Water Vein','Metal','Rich Metal','Black Pearls','Silica Pearls','Crystal (Cave)','Clay','Sulfur'])assert.ok(catalog.includes(name),name);
 assert.equal(ragnarokWikiResources.filter(p=>p.resource==='Oil Vein / Oil Well').length,47);
 assert.equal(ragnarokWikiResources.filter(p=>p.resource==='Water Vein').length,70);
 assert.equal(ragnarokWikiResources.filter(p=>p.resource==='Oil').length,513);
 assert.equal(ragnarokWikiResources.filter(p=>p.resource==='Metal').length,2158);
 assert.ok(!resourcesForMap('The Island').some(p=>p.id==='Oil Vein / Oil Well'));
 const pin=checkAtlasPin({resource:'Oil Vein / Oil Well',lat:45.1,lon:67.2},'Ragnarok');
 assert.equal(pin.resource,'Oil Vein / Oil Well');
});
test('Ragnarok generated route selects only source oil veins in a custom polygon',()=>{
 const poly=[{lat:0,lon:0},{lat:0,lon:100},{lat:100,lon:100},{lat:100,lon:0}];
 const eligible=candidateFarmingSites(ragnarokWikiResources,poly,['Oil Vein / Oil Well']);
 assert.equal(eligible.length,47);
 const plan=generateFarmingRoute({points:ragnarokWikiResources,polygon:poly,types:['Oil Vein / Oil Well'],mode:'shortest',maxStops:12});
 assert.equal(plan.stops.length,12);
 for(const p of plan.stops)assert.ok(eligible.some(n=>n.id===p.id&&n.lat===p.lat&&n.lon===p.lon));
});
test('Ragnarok native map does not inherit Aberration-only zone focus, keeps user pins and source warning',()=>{
 const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');
 const viewer=readFileSync(new URL('./IslandNativeMap.jsx',import.meta.url),'utf8');
 assert.ok(page.includes("map==='Ragnarok'?ragnarokWikiResources"));
 assert.ok(page.includes("map==='Ragnarok'?'/maps/ragnarok-asa.jpg'"));
 assert.ok(page.includes("map==='Ragnarok'?'Authentic Ragnarok ASA terrain"));
 assert.ok(page.includes('47 published oil-vein locations'));
 assert.ok(page.includes('savedPlans.filter(p=>p.map===map)'));
 assert.ok(page.includes('plannedStops={generated?.stops||[]}'));
 assert.ok(viewer.includes("mapName==='Ragnarok'?'https://ark.wiki.gg/wiki/Data:Maps/Resources/Ragnarok'"));
 assert.ok(viewer.includes("mapName==='Aberration'&&<label className=\"island-zone-select\""));
 assert.ok(viewer.includes('onSaveAt(inspected)'));
 assert.ok(viewer.includes('pointers.current.size===2'));
});
