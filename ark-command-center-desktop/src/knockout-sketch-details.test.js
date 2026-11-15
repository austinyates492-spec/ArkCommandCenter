import test from 'node:test';
import assert from 'node:assert/strict';
import {knockoutRoster,tamingCategory} from './special-taming-methods.js';
import {knockoutSketchTraits,knockoutDetailSketch} from './knockout-sketch-details.js';
import {creatureArtProfile} from './creature-art-profile.js';
import {individualOutlines} from './individual-outline-data.js';
import {readFileSync} from 'node:fs';

test('all knockout species and official forms receive curated anatomy instead of a blank field sketch',()=>{
 const missing=knockoutRoster.filter(name=>name!=='Rex'&&!individualOutlines[name]&&!knockoutSketchTraits[creatureArtProfile(name).base]);
 assert.deepEqual(missing,[],'Missing anatomical study signatures: '+missing.join(', '));
 for(const name of knockoutRoster){
  const sketches=knockoutDetailSketch(name);
  assert.ok(sketches.length>=8,name+' needs individual anatomical line marks');
  assert.ok(sketches.every(path=>typeof path==='string'&&path.startsWith('M')),name+' has invalid path');
 }
});
test('signatures are knockout-specific, and do not generate fake species detail on special/passive tames',()=>{
 for(const name of ['Bloodstalker','Rock Drake','Ovis','Karkinos']){
  assert.notEqual(tamingCategory(name),'knockout');
  assert.deepEqual(knockoutDetailSketch(name),[]);
 }
 const solo=['Spinosaurus','Yutyrannus','Ankylosaurus','Mammoth','Megalodon'];
 const signatures=solo.map(name=>knockoutDetailSketch(name).slice(0,3).join('|'));
 assert.equal(new Set(signatures).size,solo.length);
});
test('Taming Lab shows curated art inline and always retains creature search',()=>{
 const c=readFileSync(new URL('./TamingLab.jsx',import.meta.url),'utf8');
 assert.match(c,/Search all creatures and variants/);
 assert.match(c,/CreatureLineArt creature=\{creature\}/);
 assert.doesNotMatch(c,/showRexDossier/);
});
