import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {herbOutlines} from './herb-outline-data.js';
import {herbOutlinesB} from './herb-outline-data-b.js';
import {tamingCategory} from './special-taming-methods.js';

const groupOne=['Thylacoleo','Ankylosaurus','Doedicurus','Mammoth','Triceratops','Stegosaurus','Pachyrhinosaurus','Iguanodon','Parasaur'];
const groupTwo=['Brontosaurus','Diplodocus','Carbonemys','Paraceratherium','Gallimimus','Morellatops','Woolly Rhino','Argentavis','Pteranodon'];

test('18 additional species have self-contained unique black-ink vector illustrations',()=>{
 assert.deepEqual(Object.keys(herbOutlines).sort(),[...groupOne].sort());
 assert.deepEqual(Object.keys(herbOutlinesB).sort(),[...groupTwo].sort());
 const seen=new Set();
 for(const [species,payload] of Object.entries({...herbOutlines,...herbOutlinesB})){
  assert.ok(typeof payload==='string'&&payload.length>3000,species+' asset payload missing');
  const svg=gunzipSync(Buffer.from(payload,'base64')).toString('utf8');
  assert.match(svg,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/,species+' is not standalone SVG');
  assert.match(svg,/fill-rule="evenodd"/,species+' image lost separate interior strokes');
  assert.ok(svg.length>5000,species+' sketch has insufficient detail');
  assert.doesNotMatch(svg,/<image|https?:\/\//,species+' must not fetch remote images');
  const hash=createHash('sha256').update(svg).digest('hex');
  assert.ok(!seen.has(hash),species+' reused another creature\'s drawing');
  seen.add(hash);
 }
});
test('Taming Lab can display new traced art without changing tame methods',()=>{
 const renderer=readFileSync(new URL('./IndividualCreatureLineArt.jsx',import.meta.url),'utf8');
 assert.match(renderer,/\.\.\.herbOutlines,\.\.\.herbOutlinesB/);
 assert.match(renderer,/maskImage/);
 assert.match(renderer,/WebkitMaskImage/);
 for(const name of groupOne.concat(groupTwo))
  assert.ok(['knockout','specialty','passive','untameable'].includes(tamingCategory(name)),name+' method classification missing');
 const lab=readFileSync(new URL('./TamingLab.jsx',import.meta.url),'utf8');
 assert.match(lab,/Search all creatures and variants/);
 assert.match(lab,/calculateTame\(/);
 assert.match(lab,/knockoutEstimate\(/);
 assert.match(lab,/taming-workspace/);
 assert.doesNotMatch(lab,/page==='dossiers'/);
});
