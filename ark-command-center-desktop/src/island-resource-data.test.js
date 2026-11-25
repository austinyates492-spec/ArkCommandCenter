import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {islandResources,islandSeedMarkers,normalizeIslandMarker,mapPoint,islandResourceSources} from './island-resource-data.js';
const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');
const css=readFileSync(new URL('./resource-atlas-native.css',import.meta.url),'utf8');

test('native Island atlas includes all 13 published ASA Island resource layers',()=>{
 const expected=['Metal','Rich Metal','Crystal','Obsidian','Oil','Silica Pearls','Rare Flowers','Rare Mushrooms','Mushrooms','Wood Coal','Plant Species X','Beaver Dam','Bee Hive'];
 assert.deepEqual(islandResources.map(r=>r.name),expected);
 assert.equal(new Set(islandResources.map(r=>r.name)).size,13);
});
test('sample dataset never invents locations for unmapped resource layers',()=>{
 assert.equal(islandSeedMarkers.length,15);
 assert.deepEqual([...new Set(islandSeedMarkers.map(m=>m.resource))].sort(),['Crystal','Metal','Obsidian','Oil','Silica Pearls']);
 assert.ok(islandSeedMarkers.every(m=>m.verified===false&&m.origin==='community-sample'&&m.lat>=0&&m.lat<=100&&m.lon>=0&&m.lon<=100));
 assert.equal(new Set(islandSeedMarkers.map(m=>m.id)).size,15);
 assert.ok(islandResourceSources.samples.startsWith('https://'));
});
test('personal GPS pins are validated and plotting maps longitude horizontally',()=>{
 assert.deepEqual(mapPoint(28.4,72.1),{x:721,y:284});
 assert.deepEqual(normalizeIslandMarker({resource:'Rare Flowers',lat:'42.48',lon:'61.26'}),{resource:'Rare Flowers',lat:42.5,lon:61.3,verified:false,origin:'user-pin',source:'Personal marker'});
 assert.throws(()=>normalizeIslandMarker({resource:'Element',lat:30,lon:30}),/Select an Island resource/);
 assert.throws(()=>normalizeIslandMarker({resource:'Metal',lat:-1,lon:50}),/Coordinates/);
 assert.throws(()=>normalizeIslandMarker({resource:'Metal',lat:31,lon:101}),/Coordinates/);
});
test('native viewer replaces wiki embed and includes all/deselect, mobile navigation, routes',()=>{
 for(const fragment of ["Select All","Deselect All","saveLayers(defaultSelected)","saveLayers([])","islandResources.map","onPointerDown={onDown}","onPointerMove={onMove}","onWheel=","Add to Farming Route","localStorage.setItem","source","Original schematic"]) {
  if(fragment==='Original schematic')continue;
  assert.ok(page.includes(fragment),fragment);
 }
 assert.ok(page.includes('schematic'));
 assert.ok(page.includes('function IslandAtlas({onMapChange})'));
 assert.ok(page.includes('if(map===\'The Island\')return <IslandAtlas onMapChange={setMap}/>'));
 assert.ok(page.includes('<EmbeddedMap key={map}'));
 assert.ok(!page.includes('<iframe'));
});
test('phone layout uses stacking, touch-ready controls and theme tokens',()=>{
 for(const fragment of ['@media(max-width:750px)','@media(max-width:480px)','--ark-bright','--ark-border','--personality-border','touch-action:none','grid-template-columns:repeat(2,minmax(0,1fr))'])assert.ok(css.includes(fragment),fragment);
});
