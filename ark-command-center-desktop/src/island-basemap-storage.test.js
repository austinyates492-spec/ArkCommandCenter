import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MAX_ISLAND_MAP_BYTES,validateIslandMapFile} from './island-basemap-storage.js';
const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');
const css=readFileSync(new URL('./resource-atlas-native.css',import.meta.url),'utf8');
test('local Island image import accepts supported image types and caps file size',()=>{
 assert.equal(MAX_ISLAND_MAP_BYTES,12582912);
 for(const type of ['image/png','image/jpeg','image/webp'])assert.equal(validateIslandMapFile({type,size:1024}).type,type);
 assert.throws(()=>validateIslandMapFile({type:'image/svg+xml',size:1024}),/PNG, JPG or WebP/);
 assert.throws(()=>validateIslandMapFile({type:'image/png',size:MAX_ISLAND_MAP_BYTES+1}),/12 MB/);
 assert.throws(()=>validateIslandMapFile({type:'image/png',size:0}),/12 MB/);
});
test('private basemap uses browser storage not server APIs',()=>{
 const storage=readFileSync(new URL('./island-basemap-storage.js',import.meta.url),'utf8');
 for(const part of ['indexedDB.open','createObjectStore','loadIslandBasemap','saveIslandBasemap','clearIslandBasemap','store.put(file,KEY)'])assert.ok(storage.includes(part),part);
 assert.ok(!storage.includes('fetch('));
});
test('Island map viewer overlays user image and retains schematic fallback',()=>{
 for(const part of ['Use Your Island Map Image','Use Schematic Map','Pick GPS on Map','loadIslandBasemap()','saveIslandBasemap(file)','clearIslandBasemap()','URL.createObjectURL','URL.revokeObjectURL','<image href={basemapUrl}','opacity={basemapUrl?0:1}',"setAddForm(v=>({...v,lat:(p.y/10).toFixed(1),lon:(p.x/10).toFixed(1)}))"])assert.ok(page.includes(part),part);
 assert.ok(page.includes('Select All'));
 assert.ok(page.includes('Deselect All'));
});
test('touch-friendly upload UI respects theme and phone widths',()=>{
 for(const part of ['atlas-native-basemap-tools','atlas-native-image-upload','min-height:44px','--ark-accent','@media(max-width:480px)'])assert.ok(css.includes(part),part);
});
