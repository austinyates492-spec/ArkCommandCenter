import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import manifest from './spawn-source/manifest.json' with {type:'json'};
import {maps,tameCreatures} from './data.js';
import {availableSpawnMapNames,terrainForSpawnMap,spawnLoaders,spawnZonesForCreature,spawnLocationCoverage,relativeSpawnTier,findSpawnSpecies} from './spawn-zone-model.js';

const slug={
 'The Island':'the-island','Scorched Earth':'scorched-earth','The Center':'the-center',
 'Aberration':'aberration','Extinction':'extinction','Ragnarok':'ragnarok','Valguero':'valguero',
 'Astraeos':'astraeos','Lost Colony':'lost-colony','Genesis: Part 1':'genesis-part-1',
 'Genesis: Part 1 Ocean':'genesis-part-1-ocean'
};
const load=map=>JSON.parse(readFileSync(new URL('./spawn-source/'+slug[map]+'.json',import.meta.url),'utf8'));
test('all ten official Native Resource Atlas maps now have source-backed native creature overlays',()=>{
 assert.equal(maps.length,10);
 assert.equal(availableSpawnMapNames.length,11); // Plus independent Genesis Ocean terrain.
 for(const map of maps){
  assert.equal(manifest[map].status,'imported',map);
  assert.ok(manifest[map].species>=50,map);
  assert.ok(manifest[map].regions>=1000,map);
  assert.equal(typeof spawnLoaders[map],'function',map);
  assert.ok(terrainForSpawnMap[map],map);
  assert.equal(statSync(new URL('../public'+terrainForSpawnMap[map],import.meta.url)).size>100000,true,map);
 }
 assert.equal(manifest['Genesis: Part 1 Ocean'].status,'imported');
 assert.ok(statSync(new URL('../public/maps/genesis-part-1-ocean-asa.jpg',import.meta.url)).size>1000000);
});
test('all imported record regions and selection weights are finite, source-backed and in the 0-100 native viewport',()=>{
 let totalRecords=0,unique=new Set();
 for(const map of availableSpawnMapNames){
  const source=load(map);
  assert.ok(source.revision>500000,map);
  assert.match(source.source,/ark\.wiki\.gg/);
  assert.ok(source.weightSemantics.includes('not observed spawn chance'));
  for(const [name,records] of Object.entries(source.species)){
   unique.add(name);assert.ok(records.length>0,name);
   for(const [coords,weight,container,flags] of records){
    assert.ok(Array.isArray(coords)&&(coords.length===2||coords.length===4),name);
    assert.ok(Number.isFinite(weight)&&weight>0&&weight<=1,name+':'+weight);
    assert.ok(coords.every(x=>Number.isFinite(x)&&x>=0&&x<=100),name);
    if(coords.length===4)assert.ok(coords[0]<coords[2]&&coords[1]<coords[3],name);
    assert.equal(typeof container,'string');
    totalRecords++;
   }
  }
  assert.equal(Object.keys(source.species).length,manifest[map].species,map);
 }
 assert.ok(unique.size>=300,'expected broad wiki creature roster coverage');
 assert.ok(totalRecords>=160000,'expected full spawn rectangles, not only handpicked species');
});
test('relative tiers never claim a real per-creature encounter probability',()=>{
 assert.equal(relativeSpawnTier(.8),'higher');
 assert.equal(relativeSpawnTier(.3),'moderate');
 assert.equal(relativeSpawnTier(.1),'lower');
 assert.equal(relativeSpawnTier(.005),'rare');
 const source=load('The Island');
 const castor=spawnZonesForCreature(source,'Castoroides','The Island');
 assert.ok(castor.count>=6);
 assert.ok(castor.zones.every(p=>p.weight>0&&p.weight<=1));
 assert.equal(spawnLocationCoverage(source,'Nonexistent Creature','The Island').documented,false);
 assert.equal(spawnZonesForCreature(source,'Nonexistent Creature','The Island').count,0);
});
test('every tame in existing roster can be queried on every native map without fabricated fallback zones',()=>{
 assert.ok(tameCreatures.length>=100);
 for(const map of availableSpawnMapNames){
  const source=load(map);
  for(const tame of tameCreatures){
   const coverage=spawnLocationCoverage(source,tame,map);
   const zones=spawnZonesForCreature(source,tame,map);
   assert.ok(Array.isArray(coverage.matched)&&Array.isArray(zones.zones));
   if(!coverage.documented)assert.equal(zones.count,0, `no fabricated ${tame} on ${map}`);
   for(const z of zones.zones)assert.ok(z.species&&source.species[z.species],map+':'+tame);
  }
 }
});
test('Aberration reuses zone focus native source-backed terrain and exposes clickable layer controls',()=>{
 const spawn=readFileSync(new URL('./NativeSpawnAtlas.jsx',import.meta.url),'utf8');
 const viewer=readFileSync(new URL('./IslandNativeMap.jsx',import.meta.url),'utf8');
 const page=readFileSync(new URL('./SpawnPage.jsx',import.meta.url),'utf8');
 const linked=readFileSync(new URL('./TameSpawnAtlas.jsx',import.meta.url),'utf8');
 assert.ok(spawn.includes('spawnTierOptions.map'));
 assert.ok(spawn.includes('map===\'Aberration\''));
 assert.ok(spawn.includes('Ocean simulation'));
 assert.ok(spawn.includes('<IslandNativeMap'));
 assert.ok(viewer.includes("mapName==='Aberration'&&<label className=\"island-zone-select\""));
 assert.ok(viewer.includes('spawnMode&&showResources'));
 assert.ok(viewer.includes('spawnRegions.map'));
 assert.ok(page.includes('tameCreatures'));
 assert.ok(page.includes('<NativeSpawnAtlas'));
 assert.ok(linked.includes('<NativeSpawnAtlas'));
 assert.doesNotMatch(page,/EmbeddedMap|<iframe/i);
 assert.doesNotMatch(linked,/EmbeddedMap|<iframe/i);
});
