import test from 'node:test';
import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {knockoutLineArt1} from './knockout-art-1.js';
import {knockoutLineArt2} from './knockout-art-2.js';
import {knockoutCustom14} from './knockout-custom-14.js';
import {herbOutlines} from './herb-outline-data.js';
import {herbOutlinesB} from './herb-outline-data-b.js';
import {creatureSpawnUrl,wikiSpawn} from './data.js';

const source=name=>readFileSync(new URL(name,import.meta.url),'utf8');
const target=[
'Tapejara','Quetzal','Snow Owl','Dimorphodon','Pelagornis','Lymantria','Megalodon','Dunkleosteus','Mosasaurus','Plesiosaur','Anglerfish','Sarcosuchus','Kaprosuchus','Xiphactinus','Achatina','Archaeopteryx','Beelzebufo','Bison','Boaratos','Castoroides','Daeodon','Dimetrodon','Diplocaulus','Direbear','Dodo','Fasolasuchus',
'Gasbags','Grand Tortugar','Griffin','Ichthyornis','Jerboa','Kairuku','Kentrosaurus','Maeguana','Managarmr','Megalania','Megaloceros','Megatherium','Microraptor','Oviraptor'];

test('exactly forty newly registered non-duplicated species-specific SVG studies',()=>{
 const assets={...knockoutLineArt1,...knockoutLineArt2,...knockoutCustom14};
 assert.deepEqual(Object.keys(assets).sort(),target.slice().sort());
 assert.equal(Object.keys(knockoutLineArt1).length,13);
 assert.equal(Object.keys(knockoutLineArt2).length,13);
 assert.equal(Object.keys(knockoutCustom14).length,14);
 const hashes=new Set();
 for(const [species,payload] of Object.entries(assets)){
  assert.ok(payload.length>350,species+' has no vector payload');
  const svg=gunzipSync(Buffer.from(payload,'base64')).toString('utf8');
  assert.match(svg,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/,species+' SVG header missing');
  assert.match(svg,/viewBox="0 0 1000 560"/,species+' image has the wrong padded canvas');
  assert.match(svg,/<path\b/,species+' has no path geometry');
  assert.doesNotMatch(svg,/<image\b|(?:href|xlink:href)="https?:\/\//,species+' attempts remote image loading');
  const sha=createHash('sha256').update(svg).digest('hex');
  assert.ok(!hashes.has(sha),species+' duplicates a previously installed animal');
  hashes.add(sha);
 }
});
test('original eighteen study crops are rebuilt and isolated with padded SVG masks',()=>{
 const all={...herbOutlines,...herbOutlinesB};
 assert.equal(Object.keys(all).length,18);
 for(const [species,payload] of Object.entries(all)){
  const svg=gunzipSync(Buffer.from(payload,'base64')).toString('utf8');
  assert.match(svg,/viewBox="0 0 1000 560"/,species+' repaired drawing missing viewBox');
  assert.match(svg,/fill-rule="evenodd"/,species+' repaired drawing lost its original hatch contour');
  assert.match(svg,/isolated anatomical ink art/,species+' was not rebuilt by silhouette isolation');
 }
});
test('all three taming pages share the bottom spawn atlas, driven by current selection',()=>{
 const atlas=source('TameSpawnAtlas.jsx');
 assert.match(atlas,/creatureSpawnUrl\(selectedMap,selectedCreature\)/);
 assert.match(atlas,/key=\{selectedMap\+':'\+selectedCreature\}/);
 assert.match(atlas,/alternativeUrl=\{wikiSpawn\(selectedMap\)\}/);
 assert.match(atlas,/supports creature selection via URL fragment/);
 for(const file of ['TamingLab.jsx','PassiveLab.jsx','SpecialtyLab.jsx']){
  const code=source(file);
  assert.match(code,/import TameSpawnAtlas from '\.\/TameSpawnAtlas\.jsx'/,file+' atlas import missing');
  assert.match(code,/<TameSpawnAtlas creature=\{creature\} map=\{map\}\/>/,file+' selection not wired to viewer');
  assert.ok(code.lastIndexOf('<TameSpawnAtlas')>code.lastIndexOf('</div>'),file+' atlas should be at the bottom');
 }
 assert.match(creatureSpawnUrl('The Island','Rex'),/#T-Rex$/);
 assert.ok(creatureSpawnUrl('Aberration','Raptor').startsWith(wikiSpawn('Aberration')));
});
test('new art is part of the live detailed renderer, not a detached collection',()=>{
 const renderer=source('IndividualCreatureLineArt.jsx');
 for(const name of ['knockoutLineArt1','knockoutLineArt2','knockoutCustom14'])assert.match(renderer,new RegExp('\\.\\.\\.'+name));
 const css=source('tame-spawn-atlas.css');
 assert.match(css,/\.tame-spawn-atlas\{/);
 assert.match(css,/@media\(max-width:700px\)/);
});
