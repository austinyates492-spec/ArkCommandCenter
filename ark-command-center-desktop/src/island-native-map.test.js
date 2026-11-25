import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');
const native=readFileSync(new URL('./IslandNativeMap.jsx',import.meta.url),'utf8');
const css=readFileSync(new URL('./island-native-map.css',import.meta.url),'utf8');
test('The Island selects first-party map instead of provider iframe',()=>{
 assert.ok(page.includes('nativeAtlas?<IslandNativeMap'));
 assert.match(page,/:<EmbeddedMap key=\{map\}/);
 assert.match(page,/onSelect=\{setSelection\}/);
 assert.ok(!native.includes('<iframe'));
 assert.ok(!native.includes('wikily.gg'));
 assert.ok(page.includes("'/maps/the-island-asa.jpg'"));
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
 assert.ok(native.includes('<image href={terrainSrc}'));
 assert.ok(native.includes('onError={()=>setTerrainFailed(true)}'));
 assert.ok(!native.includes('<iframe'));
 assert.ok(native.includes('Resource sites are published estimates'));
 assert.ok(native.includes('visibleWikiSites(resourcePoints'));
});
test('mobile layout has touch sized controls',()=>{
 assert.ok(css.includes('@media(max-width:750px)'));
 assert.ok(css.includes('width:44px;height:44px'));
 assert.ok(css.includes('aspect-ratio:1'));
});

test('GPS calibration inspection follows same 1000 square coordinate plane as plotted pins',()=>{
 assert.ok(native.includes('gpsAtScreen(event.currentTarget,event.clientX,event.clientY,viewport)'));
 assert.ok(native.includes('setInspected(position)'));
 assert.ok(native.includes('inspected.lon.toFixed(1)'));
 assert.ok(native.includes('inspected.lat.toFixed(1)'));
 assert.ok(native.includes('Inspected location'));
});

test('inspector below map creates a named custom pin through ResourcePage',()=>{
 assert.ok(native.indexOf('className="island-map-inspection"')>native.indexOf('className="island-map-frame"'));
 assert.ok(native.includes('onSaveAt(inspected)'));
 assert.ok(page.includes('onSaveAt={saveAtMapPoint}'));
 assert.ok(css.includes('.island-map-inspection'));
});

test('native Island viewport supports direct mouse wheel and multi-touch zoom',()=>{
 assert.ok(native.includes("svg.addEventListener('wheel',wheel,{passive:false})"));
 assert.ok(native.includes('e.preventDefault()'));
 assert.ok(native.includes('pointers.current.size===2'));
 assert.ok(native.includes('Math.hypot(a.x-b.x,a.y-b.y)'));
 assert.ok(native.includes('pinch.current.anchorX'));
 assert.ok(native.includes('onPointerMove={duringDrag}'));
 assert.ok(native.includes('onPointerCancel={finishDrag}'));
 assert.ok(native.includes('Math.min(8'));
});
test('image contains only terrain, GPS layers and markers, no movement box or floating inspector',()=>{
 assert.ok(!native.includes('island-map-watermark'));
 assert.ok(!native.includes('<Move '));
 assert.ok(!css.includes('.island-map-watermark'));
 assert.ok(!native.includes('<ZoomIn'));
 assert.ok(!native.includes('<ZoomOut'));
 assert.ok(native.includes('className="island-map-inspection"'));
 assert.ok(native.includes('onSaveAt(inspected)'));
 assert.ok(css.includes('touch-action:none'));
});
