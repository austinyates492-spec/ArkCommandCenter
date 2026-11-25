import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {resourcesForMap,checkAtlasPin} from './atlas-resource-model.js';
import {valgueroWikiResources,valgueroWikiAvailableResources,valgueroWikiSource} from './valguero-resource-overlay.js';
import {candidateFarmingSites,generateFarmingRoute} from './island-area-route-planner.js';

test('Valguero uses genuine locally hosted ASA terrain and shared wiki references labeled accurately',()=>{
 assert.ok(statSync(new URL('../public/maps/valguero-asa.jpg',import.meta.url)).size>1000000);
 assert.equal(valgueroWikiSource.revision,548225);
 assert.equal(valgueroWikiSource.verifiedASA,false);
 assert.equal(valgueroWikiSource.omittedOutOfBoundsCount,0);
 assert.equal(valgueroWikiResources.length,2892); // Original 2895 includes 3 obelisks, not farming nodes.
 assert.equal(valgueroWikiAvailableResources.length,28);
 for(const p of valgueroWikiResources){
  assert.ok(p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100,p.id);
  assert.match(p.source,/ASA location unverified/);
 }
});
test('Valguero has independent oil wells, oil rocks, gas veins and water veins',()=>{
 const catalog=resourcesForMap('Valguero').map(p=>p.id);
 for(const r of ['Metal','Crystal','Oil','Oil (Cave)','Oil Vein / Oil Well','Gas Vein','Water Vein','Black Pearls','Red Gems','Blue Gems','Green Gems','Sulfur','Silica Pearls']) assert.ok(catalog.includes(r),r);
 const count=r=>valgueroWikiResources.filter(p=>p.resource===r).length;
 assert.equal(count('Oil Vein / Oil Well'),44);
 assert.equal(count('Gas Vein'),53);
 assert.equal(count('Oil'),548);
 assert.equal(count('Oil (Cave)'),20);
 assert.equal(count('Water Vein'),3);
 assert.equal(count('Metal'),1017);
 assert.ok(!resourcesForMap('The Island').some(p=>p.id==='Gas Vein'));
 assert.deepEqual(checkAtlasPin({resource:'Oil Vein / Oil Well',lat:28.7,lon:39.3},'Valguero').resource,'Oil Vein / Oil Well');
});
test('Valguero farming route selects only real sourced oil veins inside selected area',()=>{
 const polygon=[{lat:0,lon:0},{lat:0,lon:100},{lat:100,lon:100},{lat:100,lon:0}];
 const candidates=candidateFarmingSites(valgueroWikiResources,polygon,['Oil Vein / Oil Well']);
 assert.equal(candidates.length,44);
 const plan=generateFarmingRoute({points:valgueroWikiResources,polygon,types:['Oil Vein / Oil Well'],mode:'balanced',maxStops:12});
 assert.equal(plan.stops.length,12);
 for(const site of plan.stops) assert.ok(candidates.some(p=>p.id===site.id&&p.lat===site.lat&&p.lon===site.lon));
});
test('Valguero native atlas uses normal controls and retains Aberration-only zone toggle',()=>{
 const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');
 const map=readFileSync(new URL('./IslandNativeMap.jsx',import.meta.url),'utf8');
 assert.ok(page.includes("map==='Valguero'?valgueroWikiResources"));
 assert.ok(page.includes("map==='Valguero'?'/maps/valguero-asa.jpg'"));
 assert.ok(page.includes("map==='Valguero'?'Authentic Valguero ASA terrain"));
 assert.ok(page.includes('44 published oil-vein sites'));
 assert.ok(page.includes('savedPlans.filter(p=>p.map===map)'));
 assert.ok(page.includes('plannedStops={generated?.stops||[]}'));
 assert.ok(map.includes("mapName==='Valguero'?'https://ark.wiki.gg/wiki/Data:Maps/Resources/Valguero'"));
 assert.ok(map.includes("mapName==='Aberration'&&<label className=\"island-zone-select\""));
 assert.ok(map.includes('onSaveAt(inspected)'));
 assert.ok(map.includes('pointers.current.size===2'));
});
