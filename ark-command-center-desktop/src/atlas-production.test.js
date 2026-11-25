import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resourcesForMap,mapsWithOilVeins,checkAtlasPin} from './atlas-resource-model.js';
const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');
const css=readFileSync(new URL('./atlas-production.css',import.meta.url),'utf8');
test('Island catalog includes 13 documented gatherable resource filters but no pump wells',()=>{
 const island=resourcesForMap('The Island').map(r=>r.id);
 assert.equal(island.length,13);
 for(const r of ['Oil','Metal','Rich Metal','Silica Pearls','Beaver Dam','Bee Hive'])assert.ok(island.includes(r));
 assert.ok(!island.includes('Oil Vein / Oil Well'));
});
test('only explicitly supported maps offer an oil vein / oil pump filter',()=>{
 for(const map of mapsWithOilVeins)assert.ok(resourcesForMap(map).some(r=>r.id==='Oil Vein / Oil Well'));
 for(const map of ['The Island','Extinction','Aberration','The Center'])assert.ok(!resourcesForMap(map).some(r=>r.id==='Oil Vein / Oil Well'));
});
test('GPS pins require real user inputs and per-map valid resource types',()=>{
 assert.deepEqual(checkAtlasPin({resource:'Oil',lat:'42.48',lon:'69.97',note:'Underwater'},'The Island'),{resource:'Oil',lat:42.5,lon:70,note:'Underwater',title:''});
 assert.throws(()=>checkAtlasPin({resource:'Oil Vein / Oil Well',lat:45,lon:20},'The Island'),/supported resource/);
 assert.throws(()=>checkAtlasPin({resource:'Metal',lat:'',lon:42},'The Island'),/between 0 and 100/);
 assert.throws(()=>checkAtlasPin({resource:'Metal',lat:200,lon:40},'The Island'),/between 0 and 100/);
 assert.throws(()=>checkAtlasPin({resource:'Metal',lat:44,lon:-10},'The Island'),/between 0 and 100/);
});
test('native V3 overlays are honest about source map independence',()=>{
 for(const s of ['Select All','Deselect All','Farming Routes','My Pins',"map==='The Island'?<IslandNativeMap",'Wiki ASA resource sites are overlaid','authentic ASA terrain from the ARK Official Community Wiki','Your GPS entry','saveLocal(STORE','Add to Farming Route','BROWSER-LOCAL'])assert.ok(page.includes(s),s);
 assert.ok(!page.includes('islandSeedMarkers'));
 assert.ok(!page.includes('SCHEMATIC TERRAIN'));
 assert.ok(!page.includes('Map terrain is an original schematic'));
});
test('V3 remains themed with phone-appropriate stacked controls',()=>{
 for(const s of ['--ark-bright','--ark-deep','--ark-border','@media(max-width:750px)','@media(max-width:420px)','min-height:44px','.atlas-v3-filters'])assert.ok(css.includes(s),s);
});

test('custom user labels and manual GPS coordinates validate without fabricating wiki points',()=>{
 const custom=checkAtlasPin({resource:'Custom',title:'Safe cave',lat:'33.4',lon:'51.2'},'The Island');
 assert.equal(custom.title,'Safe cave');
 assert.equal(custom.lat,33.4);assert.equal(custom.lon,51.2);
 assert.throws(()=>checkAtlasPin({resource:'Custom',title:'',lat:33,lon:51},'The Island'),/name/);
 assert.ok(page.includes('saveAtMapPoint'));
});
