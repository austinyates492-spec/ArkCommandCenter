import test from 'node:test';
import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {approvedAchatinaOutline} from './achatina-approved-data.js';

test('approved Achatina is a fully isolated, detail-preserving compressed SVG',()=>{
 const svg=gunzipSync(Buffer.from(approvedAchatinaOutline,'base64')).toString('utf8');
 assert.match(svg,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
 assert.match(svg,/viewBox="0 0 \d+ \d+"/);
 assert.match(svg,/fill-rule="evenodd"/);
 assert.match(svg,/<path fill="black"/);
 assert.ok(svg.length>18000,'Do not replace approved art with a generic, low-detail sketch');
 assert.doesNotMatch(svg,/<image\b|(?:href|xlink:href)="https?:\/\/|<text\b|<script\b/);
});

test('approved Achatina overrides the older sketch in the real Taming Lab artwork renderer',()=>{
 const src=readFileSync(new URL('./IndividualCreatureLineArt.jsx',import.meta.url),'utf8');
 const lab=readFileSync(new URL('./TamingLab.jsx',import.meta.url),'utf8');
 const css=readFileSync(new URL('./taming-lab-art.css',import.meta.url),'utf8');
 assert.match(src,/Achatina:approvedAchatinaOutline/);
 assert.match(src,/maskImage/);
 assert.match(src,/WebkitMaskImage/);
 assert.match(css,/background:currentColor/);
 assert.match(lab,/CreatureLineArt creature=\{creature\}/);
 assert.match(lab,/Search all knockout creatures and variants/);
 assert.match(lab,/Plan Notes/);
 assert.match(lab,/TameSpawnAtlas creature=\{creature\} map=\{map\}/);
});
