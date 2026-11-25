import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');
const native=readFileSync(new URL('./IslandNativeMap.jsx',import.meta.url),'utf8');
const css=readFileSync(new URL('./island-native-map.css',import.meta.url),'utf8');
test('The Island selects first-party map instead of provider iframe',()=>{
 assert.match(page,/map==='The Island'\?<IslandNativeMap/);
 assert.match(page,/:<EmbeddedMap key=\{map\}/);
 assert.match(page,/onSelect=\{setSelection\}/);
 assert.ok(!native.includes('<iframe'));
 assert.ok(!native.includes('wikily.gg'));
 assert.ok(!native.includes('ark.wiki.gg'));
});
test('native pins and routes use ARK GPS coordinate ordering',()=>{
 assert.ok(native.includes('p.lon*10'));
 assert.ok(native.includes('p.lat*10'));
 assert.ok(native.includes('pins.filter'));
 assert.ok(native.includes('selectedId===p.id'));
 assert.ok(native.includes('stops.length>1'));
 assert.ok(native.includes('onSelect(p.id)'));
});
test('native map does not represent incomplete terrain or node coverage as verified',()=>{
 assert.ok(native.includes('The_Island_map_ASA.jpg'));
 assert.ok(native.includes('<image href={ISLAND_ASA_TERRAIN}'));
 assert.ok(native.includes('onError={()=>setTerrainFailed(true)}'));
 assert.ok(!native.includes('<iframe'));
 assert.ok(native.includes('ARK Official Community Wiki'));
 assert.ok(native.includes('Only your own saved GPS locations'));
});
test('mobile layout has touch sized controls',()=>{
 assert.ok(css.includes('@media(max-width:750px)'));
 assert.ok(css.includes('width:44px;height:44px'));
 assert.ok(css.includes('aspect-ratio:1'));
});
