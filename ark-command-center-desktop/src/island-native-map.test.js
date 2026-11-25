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
 assert.ok(native.includes('href="/maps/the-island-asa.jpg"'));
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
 assert.ok(native.includes('ARK Official Community Wiki'));
 assert.ok(native.includes('<image href="/maps/the-island-asa.jpg"'));
 assert.ok(native.includes('onError={()=>setTerrainFailed(true)}'));
 assert.ok(!native.includes('<iframe'));
 assert.ok(native.includes('Resource sites are published estimates'));
 assert.ok(native.includes('visibleWikiSites(islandWikiResources'));
});
test('mobile layout has touch sized controls',()=>{
 assert.ok(css.includes('@media(max-width:750px)'));
 assert.ok(css.includes('width:44px;height:44px'));
 assert.ok(css.includes('aspect-ratio:1'));
});

test('GPS calibration inspection follows same 1000 square coordinate plane as plotted pins',()=>{
 assert.ok(native.includes('(offsetX+px*extent)/10'));
 assert.ok(native.includes('(offsetY+py*extent)/10'));
 assert.ok(native.includes('inspected.lon*10'));
 assert.ok(native.includes('inspected.lat*10'));
 assert.ok(native.includes('Inspected location'));
});

test('inspector below map creates a named custom pin through ResourcePage',()=>{
 assert.ok(native.indexOf('className="island-map-inspection"')>native.indexOf('className="island-map-frame"'));
 assert.ok(native.includes('onSaveAt(inspected)'));
 assert.ok(page.includes('onSaveAt={saveAtMapPoint}'));
 assert.ok(css.includes('.island-map-inspection'));
});
