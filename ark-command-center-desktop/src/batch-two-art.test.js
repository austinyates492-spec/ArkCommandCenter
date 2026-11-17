import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {aureliaxPreviewPng} from './aureliax-preview-svg-data.js';
import {baryonyxPreviewPng} from './baryonyx-preview-svg-data.js';
import {basiliskPreviewPng} from './basilisk-preview-svg-data.js';
import {vanillaKnockoutRoster,vanillaTamesByMethod} from './vanilla-tame-picker.js';
import {tamingCategory} from './special-taming-methods.js';
const read=name=>readFileSync(new URL('./'+name,import.meta.url),'utf8');

test('three new previews contain separate smooth transparent PNG masks, not primitive geometric placeholders',()=>{
 for(const [name,b64] of [['Aureliax',aureliaxPreviewPng],['Baryonyx',baryonyxPreviewPng],['Basilisk',basiliskPreviewPng]]){
  const bytes=Buffer.from(b64,'base64');
  assert.deepEqual([...bytes.subarray(0,8)],[137,80,78,71,13,10,26,10],name+' must be PNG');
  assert.ok(bytes.length>40000,name+' high-resolution artwork was replaced with tiny geometric placeholders');
  assert.ok(bytes.length<120000,name+' site illustration is too large');
 }
});

test('Baryonyx stays in full knockout roster; Aureliax and Basilisk use specialty calculations',()=>{
 assert.equal(tamingCategory('Baryonyx'),'knockout');
 assert.equal(tamingCategory('Aureliax'),'specialty');
 assert.equal(tamingCategory('Basilisk'),'specialty');
 assert.ok(vanillaKnockoutRoster.includes('Baryonyx'));
 assert.ok(vanillaKnockoutRoster.includes('Rex'));
 assert.ok(vanillaKnockoutRoster.includes('Argentavis'));
 for(const n of ['Aureliax','Basilisk'])assert.ok(vanillaTamesByMethod.specialty.includes(n),n+' absent from specialty');
 for(const n of ['Aureliax','Basilisk'])assert.ok(!vanillaKnockoutRoster.includes(n),n+' leaked to knockout');
});

test('new review links and artwork flags preserve each lab and the full creature pickers',()=>{
 const app=read('main.jsx'),ko=read('TamingLab.jsx'),special=read('SpecialtyLab.jsx'),art=read('IndividualCreatureLineArt.jsx'),renderer=read('CreatureLineArt.jsx');
 assert.match(app,/reviewAureliaxArtwork=artworkPreview==='aureliax'/);
 assert.match(app,/reviewBaryonyxArtwork=artworkPreview==='baryonyx'/);
 assert.match(app,/reviewBasiliskArtwork=artworkPreview==='basilisk'/);
 assert.match(app,/reviewBaryonyxArtwork\|\|reviewOldAcroLink\?'taming'/);
 assert.match(app,/reviewAstrocetusArtwork\|\|reviewAureliaxArtwork\|\|reviewBasiliskArtwork\?'specialty'/);
 assert.match(ko,/reviewCreature=artPreview==='baryonyx'\?'Baryonyx'/);
 assert.match(ko,/knockoutPickerCreatures\(reviewCreature\)\.filter/);
 assert.match(ko,/previewBaryonyx=\{artPreview==='baryonyx'\}/);
 assert.match(special,/specialtyRoster\.filter/);
 assert.match(special,/previewAureliax=\{artPreview==='aureliax'\}/);
 assert.match(special,/previewBasilisk=\{artPreview==='basilisk'\}/);
 assert.match(renderer,/previewBaryonyx=\{props\.previewBaryonyx\}/);
 assert.match(renderer,/previewAureliax=\{props\.previewAureliax\}/);
 assert.match(renderer,/previewBasilisk=\{props\.previewBasilisk\}/);
 assert.match(art,/const pngPayload=previewAureliax&&creature==='Aureliax'/);
 assert.match(art,/data:image\/png;base64,/);
 assert.doesNotMatch(art,/Aureliax:aureliaxPreviewPng|Baryonyx:baryonyxPreviewPng|Basilisk:basiliskPreviewPng/);
});

test('approved Arthropluera/Astrocetus are default; discarded Armadoggo artwork remains unapproved',()=>{
 const art=read('IndividualCreatureLineArt.jsx');
 assert.match(art,/Arthropluera:arthroplueraPreviewOutline/);
 assert.match(art,/Astrocetus:astrocetusPreviewOutline/);
 assert.doesNotMatch(art,/Armadoggo:armadoggoPreviewOutline/);
});
