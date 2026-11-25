import test from 'node:test';
import assert from 'node:assert/strict';
import {statSync,readFileSync} from 'node:fs';
import {resourcesForMap,checkAtlasPin,mapsWithOilVeins} from './atlas-resource-model.js';
import {genesisPart1WikiResources,genesisPart1WikiAvailableResources,genesisPart1WikiSource} from './genesis-part-1-resource-overlay.js';
import {candidateFarmingSites,generateFarmingRoute} from './island-area-route-planner.js';
import {maps} from './data.js';

test('Genesis: Part 1 has genuine locally served ASA terrain, historical community Wiki resource positions and an explicit map option',()=>{
 assert.ok(statSync(new URL('../public/maps/genesis-part-1-asa.jpg',import.meta.url)).size>1000000);
 assert.equal(genesisPart1WikiSource.revision,548214);
 assert.equal(genesisPart1WikiSource.verifiedASA,false);
 assert.equal(genesisPart1WikiSource.omittedOutOfBoundsCount,0);
 assert.equal(genesisPart1WikiResources.length,6990);
 assert.equal(genesisPart1WikiAvailableResources.length,23);
 assert.equal(maps[maps.length-1],'Genesis: Part 1');
 for(const p of genesisPart1WikiResources){
  assert.ok(p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100,p.id);
  assert.match(p.source,/ASA not verified/);
 }
});
test('Genesis: Part 1 resource catalog exposes Ambergris, Element Shards, Gas, gem, sulfur, silica, rich metal and oil vein layers',()=>{
 const types=resourcesForMap('Genesis: Part 1').map(p=>p.id);
 for(const kind of ['Metal','Rich Metal','Crystal','Obsidian','Oil','Silica Pearls','Ambergris','Black Pearls (Cave)','Element Shards','Element Shards (Cave)','Gas Vein','Gas','Blue Gems','Green Gems','Red Gems','Sulfur','Oil Vein / Oil Well'])assert.ok(types.includes(kind),kind);
 assert.ok(mapsWithOilVeins.includes('Genesis: Part 1'));
 for(const kind of genesisPart1WikiAvailableResources)assert.ok(types.includes(kind),kind);
 assert.equal(genesisPart1WikiResources.filter(p=>p.resource==='Oil Vein / Oil Well').length,28);
 assert.equal(genesisPart1WikiResources.filter(p=>p.resource==='Gas Vein').length,336);
 assert.equal(genesisPart1WikiResources.filter(p=>p.resource==='Element Shards').length,1886);
 assert.equal(genesisPart1WikiResources.filter(p=>p.resource==='Ambergris').length,528);
 assert.equal(checkAtlasPin({resource:'Element Shards',lat:44.5,lon:78.4},'Genesis: Part 1').resource,'Element Shards');
});
test('Genesis resource farming route selects only sourced areas inside user polygon',()=>{
 const polygon=[{lat:0,lon:0},{lat:0,lon:100},{lat:100,lon:100},{lat:100,lon:0}];
 const sites=candidateFarmingSites(genesisPart1WikiResources,polygon,['Oil Vein / Oil Well']);
 assert.equal(sites.length,28);
 const planned=generateFarmingRoute({points:genesisPart1WikiResources,polygon,types:['Oil Vein / Oil Well'],maxStops:12,mode:'shortest'});
 assert.equal(planned.stops.length,12);
 for(const p of planned.stops)assert.ok(sites.some(s=>s.id===p.id&&s.lat===p.lat&&s.lon===p.lon));
});
test('Genesis Part 1 uses native map controls and does not inherit Aberration-only Zone Focus',()=>{
 const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');
 const viewer=readFileSync(new URL('./IslandNativeMap.jsx',import.meta.url),'utf8');
 assert.ok(page.includes("map==='Genesis: Part 1'?genesisPart1WikiResources"));
 assert.ok(page.includes("map==='Genesis: Part 1'?'/maps/genesis-part-1-asa.jpg'"));
 assert.ok(page.includes("map==='Genesis: Part 1'?'Authentic Genesis: Part 1 ASA composite terrain"));
 assert.ok(page.includes('Straight-line farming routes are GPS guides'));
 assert.ok(page.includes('savedPlans.filter(p=>p.map===map)'));
 assert.ok(page.includes('plannedStops={generated?.stops||[]}'));
 assert.ok(viewer.includes("mapName==='Genesis: Part 1'?'https://ark.wiki.gg/wiki/Data:Maps/Resources/Genesis:_Part_1'"));
 assert.ok(viewer.includes("mapName==='Aberration'&&<label className=\"island-zone-select\""));
 assert.ok(viewer.includes('onSaveAt(inspected)'));
 assert.ok(viewer.includes('pointers.current.size===2'));
});
