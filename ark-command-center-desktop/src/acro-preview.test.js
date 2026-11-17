import test from 'node:test';
import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {acroPreviewOutline} from './acro-preview-outline-data.js';

const dir=dirname(fileURLToPath(import.meta.url));
const read=name=>readFileSync(join(dir,name),'utf8');

test('Acro review art is a locally embedded, margin-padded vector silhouette',()=>{
 const svg=gunzipSync(Buffer.from(acroPreviewOutline,'base64')).toString('utf8');
 assert.match(svg,/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="/);
 assert.match(svg,/fill-rule="evenodd"/);
 assert.ok(svg.length>12000,'The illustration should retain original cutout detail');
 assert.doesNotMatch(svg,/<image\b|\bhref=/);
});
test('opt-in preview directly opens real Taming Lab without replacing public artwork',()=>{
 const app=read('main.jsx'),lab=read('TamingLab.jsx'),art=read('IndividualCreatureLineArt.jsx'),renderer=read('CreatureLineArt.jsx');
 assert.match(app,/searchParams|new URLSearchParams/);
 assert.match(app,/get\('artPreview'\)==='acro'/);
 assert.match(app,/reviewAcroArtwork\?'taming':'overview'/);
 assert.match(lab,/initialCreature='Rex'/);
 assert.match(lab,/artPreview===('acro'|"acro")/);
 assert.match(lab,/REVIEW ONLY/);
 assert.match(art,/previewAcro&&creature==='Acrocanthosaurus'\?acroPreviewOutline:tracedOutlines\[creature\]/);
 assert.match(renderer,/previewAcro=\{props\.previewAcro\}/);
 assert.match(art,/\[creature,previewAcro\]/);
 assert.doesNotMatch(app,/page==='dossiers'/);
});
