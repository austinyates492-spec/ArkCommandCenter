import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');
const data=readFileSync(new URL('./data.js',import.meta.url),'utf8');
const style=readFileSync(new URL('./atlas-production.css',import.meta.url),'utf8');
const embedded=readFileSync(new URL('./EmbeddedMap.jsx',import.meta.url),'utf8');
test('resource atlas uses authentic provider maps and no fictional terrain or fabricated pins',()=>{
 assert.ok(page.includes('resourceMapUrl(map)'));
 assert.ok(page.includes('wikiResourceMapUrl(map)'));
 assert.ok(page.includes("map==='The Island'?<IslandNativeMap"));
 assert.ok(page.includes(":<EmbeddedMap key={map}"));
 assert.ok(data.includes('https://wikily.gg/ark-survival-ascended/maps/'));
 assert.ok(data.includes('https://ark.wiki.gg/wiki/Resource_Map/'));
 assert.ok(!page.includes('islandSeedMarkers'));
 assert.ok(!page.includes('SCHEMATIC TERRAIN'));
 assert.ok(!page.includes('<image href='));
});
test('provider resource overlays remain separate from the local filter controls',()=>{
 assert.ok(page.includes('genuine ASA terrain artwork from the ARK Official Community Wiki'));
 assert.ok(page.includes('Published resource nodes are not imported yet.'));
 assert.ok(page.includes('These filters immediately change which of your saved GPS markers'));
 assert.ok(page.includes('Open detailed map'));
 assert.ok(page.includes('Official community wiki map'));
 assert.ok(embedded.includes('Open Full Map'));
 assert.ok(embedded.includes('allow-scripts allow-same-origin'));
});
test('official map selector and personal GPS tools are available without replacing source data',()=>{
 assert.ok(page.includes('maps.map(m=><option key={m}>{m}</option>)'));
 assert.ok(page.includes('changeMap(e.target.value)'));
 assert.ok(page.includes('checkAtlasPin(form,map)'));
 assert.ok(page.includes('Add to Farming Route'));
});
test('authentic map keeps theme-aware mobile layout and external links',()=>{
 for(const expected of ['.atlas-v3-source-explainer','.atlas-v3-main .embedded-atlas iframe','@media(max-width:420px)','--ark-accent','--ark-border'])assert.ok(style.includes(expected));
});
