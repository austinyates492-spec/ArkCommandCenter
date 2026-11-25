import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {resourcesForMap,checkAtlasPin} from './atlas-resource-model.js';
import {astraeosAtlasPoints,astraeosAtlasAvailableResources,astraeosAtlasSource,astraeosWikiVeins,astraeosHotspots,astraeosWikiVeinSource} from './astraeos-resource-overlay.js';
import {candidateFarmingSites,generateFarmingRoute} from './island-area-route-planner.js';

test('Astraeos uses locally stored genuine 2048 square ASA map and genuine explorer data',()=>{
 assert.ok(statSync(new URL('../public/maps/astraeos-asa.jpg',import.meta.url)).size>1000000);
 assert.equal(astraeosWikiVeinSource.revision,601078);
 assert.equal(astraeosWikiVeinSource.verifiedASA,true);
 assert.equal(astraeosWikiVeinSource.omittedOutOfBoundsCount,6);
 assert.equal(astraeosAtlasSource.verifiedASA,false); // Composite source includes non-wiki hotspots.
 assert.equal(astraeosWikiVeins.length,102);
 assert.equal(astraeosHotspots.length,72);
 assert.equal(astraeosAtlasPoints.length,174);
 for(const p of astraeosAtlasPoints)assert.ok(p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100,p.id);
});
test('Wiki Astraeos explorers provide distinct pumpable oil, water and gas veins',()=>{
 const count=type=>astraeosWikiVeins.filter(p=>p.resource===type).length;
 assert.equal(count('Oil Vein / Oil Well'),58);
 assert.equal(count('Water Vein'),20);
 assert.equal(count('Gas Vein'),24);
 assert.equal(new Set(astraeosWikiVeins.map(p=>p.id)).size,102);
 assert.ok(astraeosWikiVeins.every(p=>p.verifiedASA===true));
});
test('Astraeos material hotspots are correctly labeled approximate, no fabricated dense resource survey',()=>{
 assert.ok(astraeosHotspots.every(p=>p.kind==='hotspot'&&p.verifiedASA===false&&/approximate/.test(p.name)));
 const catalog=resourcesForMap('Astraeos').map(x=>x.id);
 for(const resource of ['Metal','Rich Metal','Crystal','Obsidian','Oil','Silica Pearls','Black Pearls','Sulfur','Silk','Gas Vein','Water Vein','Oil Vein / Oil Well'])assert.ok(catalog.includes(resource),resource);
 for(const r of astraeosAtlasAvailableResources)assert.ok(catalog.includes(r),r);
 assert.ok(!resourcesForMap('The Island').some(p=>p.id==='Water Vein'));
 assert.equal(checkAtlasPin({resource:'Gas Vein',lat:63.5,lon:61.9},'Astraeos').resource,'Gas Vein');
});
test('Astraeos area route planner uses only source-referenced approximate resource locations',()=>{
 const polygon=[{lat:0,lon:0},{lat:0,lon:100},{lat:100,lon:100},{lat:100,lon:0}];
 const eligible=candidateFarmingSites(astraeosAtlasPoints,polygon,['Oil Vein / Oil Well','Gas Vein']);
 assert.equal(eligible.length,82);
 const route=generateFarmingRoute({points:astraeosAtlasPoints,polygon,types:['Oil Vein / Oil Well','Gas Vein'],maxStops:12,mode:'shortest'});
 assert.equal(route.stops.length,12);
 for(const p of route.stops)assert.ok(eligible.some(e=>e.id===p.id&&e.lat===p.lat&&e.lon===p.lon));
});
test('Astraeos native map preserves standalone zoom/GPS and Aberration-only zone focus',()=>{
 const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');
 const viewer=readFileSync(new URL('./IslandNativeMap.jsx',import.meta.url),'utf8');
 assert.ok(page.includes("map==='Astraeos'?astraeosAtlasPoints"));
 assert.ok(page.includes("map==='Astraeos'?'/maps/astraeos-asa.jpg'"));
 assert.ok(page.includes("map==='Astraeos'?'Authentic Astraeos ASA terrain"));
 assert.ok(page.includes('savedPlans.filter(p=>p.map===map)'));
 assert.ok(page.includes('plannedStops={generated?.stops||[]}'));
 assert.ok(page.includes('Source')); 
 assert.ok(viewer.includes('mapName===\'Astraeos\''));
 assert.ok(viewer.includes("mapName==='Aberration'&&<label className=\"island-zone-select\""));
 assert.ok(viewer.includes('onSaveAt(inspected)'));
 assert.ok(viewer.includes('pointers.current.size===2'));
});
