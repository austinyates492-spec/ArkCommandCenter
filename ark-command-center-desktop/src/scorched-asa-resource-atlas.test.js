import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {resourcesForMap,checkAtlasPin} from './atlas-resource-model.js';
import {scorchedWikiAvailableResources,scorchedWikiResources,scorchedWikiSource} from './scorched-asa-resource-overlay.js';
import {islandWikiResources} from './island-wiki-resource-overlay.js';
import {candidateFarmingSites,generateFarmingRoute} from './island-area-route-planner.js';

test('Scorched Earth uses independently validated genuine 2048 pixel ASA terrain and wiki revision',()=>{
 const path=new URL('../public/maps/scorched-earth-asa.jpg',import.meta.url);
 assert.ok(statSync(path).size>100000);
 assert.equal(scorchedWikiSource.revision,548220);
 assert.match(scorchedWikiSource.url,/Scorched_Earth\/ASA/);
 assert.equal(scorchedWikiResources.length,3447);
 assert.equal(scorchedWikiSource.omittedOutOfBoundsCount,0);
});
test('Scorched Earth has its own resource layers, never substituting Island source nodes',()=>{
 const catalog=resourcesForMap('Scorched Earth').map(x=>x.id);
 for(const name of ['Metal','Rich Metal','Crystal','Obsidian','Silk','Salt','Sulfur','Silica Pearls','Water Vein','Oil Vein / Oil Well','Plant Species Y'])assert.ok(catalog.includes(name),name);
 assert.ok(!resourcesForMap('The Island').some(x=>x.id==='Water Vein'));
 assert.equal(scorchedWikiAvailableResources.length,13);
 assert.equal(scorchedWikiResources.filter(x=>x.resource==='Oil Vein / Oil Well').length,23);
 assert.ok(scorchedWikiResources.some(x=>x.resource==='Water Vein'));
 for(const p of scorchedWikiResources){
  assert.ok(p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100,p.id);
  assert.equal(p.source,'ARK Official Community Wiki');
  assert.ok(scorchedWikiAvailableResources.includes(p.resource),p.category);
 }
 assert.ok(islandWikiResources.length>0);
});
test('Scorched custom GPS pins and area routes work using its own GPS source',()=>{
 const pin=checkAtlasPin({resource:'Water Vein',lat:'44.4',lon:'22.2'},'Scorched Earth');
 assert.equal(pin.resource,'Water Vein');
 const poly=[{lat:10,lon:10},{lat:10,lon:90},{lat:90,lon:90},{lat:90,lon:10}];
 const types=['Oil Vein / Oil Well','Silk','Sulfur'];
 const candidates=candidateFarmingSites(scorchedWikiResources,poly,types);
 assert.ok(candidates.length>25);
 const result=generateFarmingRoute({points:scorchedWikiResources,polygon:poly,types,maxStops:12,mode:'balanced'});
 assert.equal(result.stops.length,12);
 for(const s of result.stops){assert.ok(candidates.some(p=>p.id===s.id));}
});
test('Scorched resource map and polygon tools are enabled without breaking Island map',()=>{
 const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');
 const native=readFileSync(new URL('./IslandNativeMap.jsx',import.meta.url),'utf8');
 assert.ok(page.includes("map==='Scorched Earth'?scorchedWikiResources"));
 assert.ok(page.includes("map==='Scorched Earth'?'/maps/scorched-earth-asa.jpg'"));
 assert.ok(page.includes("map==='The Island'||map==='Scorched Earth'"));
 assert.ok(page.includes('nativeAtlas&&<section'));
 assert.ok(page.includes('points:wikiPoints'));
 assert.ok(page.includes('savedPlans.filter(p=>p.map===map)'));
 assert.ok(native.includes('resourcePoints=islandWikiResources'));
 assert.ok(native.includes('resourceSource=islandWikiSource'));
 assert.ok(native.includes('terrainSrc}'));
});
