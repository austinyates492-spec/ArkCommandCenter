import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {aureliaxPreviewOutline} from './aureliax-preview-svg-data.js';
import {baryonyxPreviewOutline} from './baryonyx-preview-svg-data.js';
import {basiliskPreviewOutline} from './basilisk-preview-svg-data.js';
import {vanillaKnockoutRoster,vanillaTamesByMethod} from './vanilla-tame-picker.js';
import {tamingCategory} from './special-taming-methods.js';
const read=name=>readFileSync(new URL('./'+name,import.meta.url),'utf8');

test('alphabetically next three official tames have separate transparent black-on-alpha SVG masks',()=>{
 for(const [name,b64] of [['Aureliax',aureliaxPreviewOutline],['Baryonyx',baryonyxPreviewOutline],['Basilisk',basiliskPreviewOutline]]){
  const svg=gunzipSync(Buffer.from(b64,'base64')).toString('utf8');
  assert.match(svg,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 1000 620">/);
  assert.match(svg,/<path fill="black" fill-rule="evenodd"/);
  assert.ok(svg.length>=1700,name+' was replaced with a generic placeholder');
  assert.doesNotMatch(svg,/<image\b|<rect\b|(?:xlink:)?href=/);
  assert.match(svg,/<\/svg>$/);
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
 assert.match(art,/const payload=previewAureliax&&creature==='Aureliax'/);
 assert.match(art,/new DecompressionStream\('gzip'\)/);
 assert.doesNotMatch(art,/Aureliax:aureliaxPreviewOutline|Baryonyx:baryonyxPreviewOutline|Basilisk:basiliskPreviewOutline/);
});

test('approved Arthropluera/Astrocetus are default; discarded Armadoggo artwork remains unapproved',()=>{
 const art=read('IndividualCreatureLineArt.jsx');
 assert.match(art,/Arthropluera:arthroplueraPreviewOutline/);
 assert.match(art,/Astrocetus:astrocetusPreviewOutline/);
 assert.doesNotMatch(art,/Armadoggo:armadoggoPreviewOutline/);
});
