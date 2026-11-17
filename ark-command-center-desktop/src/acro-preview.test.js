import test from 'node:test';
import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {acroPreviewOutline} from './acro-preview-outline-data.js';
import {alloPreviewOutline} from './allo-preview-outline-data.js';

const dir=dirname(fileURLToPath(import.meta.url));
const read=name=>readFileSync(join(dir,name),'utf8');

test('Acro review art is a locally embedded, margin-padded vector silhouette',()=>{
 const svg=gunzipSync(Buffer.from(acroPreviewOutline,'base64')).toString('utf8');
 assert.match(svg,/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="/);
 assert.match(svg,/fill-rule="evenodd"/);
 assert.ok(svg.length>12000,'The illustration should retain original cutout detail');
 assert.doesNotMatch(svg,/<image\b|\bhref=/);
});
test('Allosaurus preview is isolated local woodcut vector with full creature silhouette',()=>{
 const svg=gunzipSync(Buffer.from(alloPreviewOutline,'base64')).toString('utf8');
 assert.match(svg,/<svg xmlns="http:\/\/www.w3.org\/2000\/svg" viewBox="/);
 assert.match(svg,/fill-rule="evenodd"/);
 assert.ok(svg.length>15000,'Keep detailed three-clawed limbs, brow crests and skin-cutout shapes');
 assert.doesNotMatch(svg,/<image\b|\bhref=/);
});
test('Acro becomes approved default; Allo preview opens real unchanged Taming Lab',()=>{
 const app=read('main.jsx'),lab=read('TamingLab.jsx'),art=read('IndividualCreatureLineArt.jsx'),renderer=read('CreatureLineArt.jsx');
 assert.match(art,/Achatina:approvedAchatinaOutline,Acrocanthosaurus:acroPreviewOutline/);
 assert.match(app,/get\('artPreview'\)/);
 assert.match(app,/reviewAlloArtwork=artworkPreview==='allo'/);
 assert.match(app,/reviewAlloArtwork\?'Allosaurus'/);
 assert.match(lab,/initialCreature='Rex'/);
 assert.match(lab,/artPreview==='allo'&&creature==='Allosaurus'/);
 assert.match(lab,/REVIEW ONLY/);
 assert.match(art,/previewAllo&&creature==='Allosaurus'\?alloPreviewOutline:tracedOutlines\[creature\]/);
 assert.match(renderer,/previewAllo=\{props\.previewAllo\}/);
 assert.match(art,/\[creature,previewAllo\]/);
 assert.doesNotMatch(app,/page==='dossiers'/);
});
