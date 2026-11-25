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
 assert.ok(native.includes('IslandContourTerrain'));
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
 assert.ok(native.includes('original stylized Island-inspired terrain'));
 assert.ok(native.includes('<IslandContourTerrain/>'));
 assert.ok(!native.includes('terrainFailed'));
 assert.ok(!native.includes('<iframe'));
 assert.ok(native.includes('No third-party image or iframe'));
 assert.ok(native.includes('Only your saved GPS pins and routes are shown'));
});
test('mobile layout has touch sized controls',()=>{
 assert.ok(css.includes('@media(max-width:750px)'));
 assert.ok(css.includes('width:44px;height:44px'));
 assert.ok(css.includes('aspect-ratio:1'));
});

test('GPS calibration inspection follows same 1000 square coordinate plane as plotted pins',()=>{
 assert.ok(native.includes('const x=offset+(event.clientX-rect.left)/rect.width*extent'));
 assert.ok(native.includes('const y=offset+(event.clientY-rect.top)/rect.height*extent'));
 assert.ok(native.includes('inspected.lon*10'));
 assert.ok(native.includes('inspected.lat*10'));
 assert.ok(native.includes('Tap the map to inspect grid coordinates'));
});
