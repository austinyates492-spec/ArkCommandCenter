import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');
const data=readFileSync(new URL('./data.js',import.meta.url),'utf8');
const style=readFileSync(new URL('./resource-atlas-native.css',import.meta.url),'utf8');
const embedded=readFileSync(new URL('./EmbeddedMap.jsx',import.meta.url),'utf8');
test('The Island displays authentic provider-owned artwork and pins, not a fabricated map',()=>{
 assert.ok(page.includes('resourceMapUrl(map)'));
 assert.ok(page.includes('wikiResourceMapUrl(map)'));
 assert.ok(page.includes('<EmbeddedMap key={map}'));
 assert.ok(page.includes("const island=map==='The Island'"));
 assert.ok(data.includes('https://wikily.gg/ark-survival-ascended/maps/'));
 assert.ok(data.includes('https://ark.wiki.gg/wiki/Resource_Map/'));
 assert.ok(!page.includes('islandSeedMarkers'));
 assert.ok(!page.includes('<svg'));
 assert.ok(!page.includes('<image href='));
 assert.ok(!page.includes('SCHEMATIC TERRAIN'));
});
test('reference map controls are explicit about provider-owned filters and embedding fallback',()=>{
 assert.ok(page.includes("Use the map's <b>Resources</b> layers"));
 assert.ok(page.includes('cannot safely change another site'));
 assert.ok(page.includes('Open genuine Island resource map'));
 assert.ok(page.includes('Official community wiki reference'));
 assert.ok(embedded.includes('Open Full Map'));
 assert.ok(embedded.includes('allow-scripts allow-same-origin'));
});
test('legacy maps remain available with full provider selection and map switching',()=>{
 assert.ok(page.includes('maps.map(m=><option key={m}>{m}</option>)'));
 assert.ok(page.includes('setMap(e.target.value)'));
 assert.ok(page.includes("!island&&"));
});
test('authentic map has theme-matched mobile layout and external fallback',()=>{
 for(const expected of ['.resource-authentic-accuracy','.resource-authentic-panel .embedded-atlas iframe','@media(max-width:430px)','--ark-accent','--ark-border'])assert.ok(style.includes(expected));
});
