import test from 'node:test';
import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {predatorOutlines} from './predator-outline-data.js';
import {individualOutlines} from './individual-outline-data.js';
import {tameCreatures} from './data.js';
import {tamingCategory} from './special-taming-methods.js';
const names=['Giganotosaurus','Carcharodontosaurus','Spinosaurus','Yutyrannus','Megalosaurus','Therizinosaurus','Acrocanthosaurus','Cryolophosaurus','Megaraptor'];
test('nine large-predator outlines are distinct high-detail local SVG drawings',()=>{
 assert.deepEqual(Object.keys(predatorOutlines).sort(),names.slice().sort());
 const fingerprints=new Set();
 for(const name of names){
  assert.ok(tameCreatures.includes(name),'missing species in catalog: '+name);
  assert.ok(['knockout','specialty'].includes(tamingCategory(name)),name+' should open the correct planner');
  const svg=gunzipSync(Buffer.from(predatorOutlines[name],'base64')).toString('utf8');
  assert.match(svg,/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
  assert.match(svg,/fill-rule="evenodd"/);
  assert.match(svg,/viewBox="0 0/);
  assert.ok(svg.length>5500,name+' artwork is suspiciously sparse');
  const fingerprint=createHash('sha256').update(svg).digest('hex');
  assert.ok(!fingerprints.has(fingerprint),name+' duplicates another drawing');
  fingerprints.add(fingerprint);
  assert.ok(!individualOutlines[name],name+' unexpectedly replaces approved first-wave art');
 }
});
test('predator images are theme-colored in existing searchable labs, not a dossier page',()=>{
 const art=readFileSync(new URL('IndividualCreatureLineArt.jsx',import.meta.url),'utf8');
 const lab=readFileSync(new URL('TamingLab.jsx',import.meta.url),'utf8');
 const specialty=readFileSync(new URL('SpecialtyLab.jsx',import.meta.url),'utf8');
 const root=readFileSync(new URL('main.jsx',import.meta.url),'utf8');
 assert.match(art,/\.\.\.individualOutlines,\.\.\.predatorOutlines/);
 assert.match(art,/maskImage/);
 assert.match(art,/WebkitMaskImage/);
 assert.match(art,/art\.creature!==creature/);
 assert.match(lab,/Search all knockout creatures and variants/);
 assert.match(lab,/CreatureLineArt creature=\{creature\}/);
 assert.match(specialty,/CreatureLineArt creature=\{creature\}/);
 assert.doesNotMatch(root,/\['dossiers','Creature Dossiers'/);
});
