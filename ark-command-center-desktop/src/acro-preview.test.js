import test from 'node:test';
import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {acroPreviewOutline} from './acro-preview-outline-data.js';
import {alloPreviewOutline} from './allo-preview-outline-data.js';
import {amargaPreviewOutline} from './amarga-preview-outline-data.js';
import {ammonitePreviewOutline} from './ammonite-preview-outline-data.js';
import {anglerPreviewOutline} from './angler-preview-outline-data.js';
import {ankyPreviewOutline} from './anky-preview-outline-data.js';
import {araneoPreviewOutline} from './araneo-preview-outline-data.js';
import {archaeopteryxPreviewOutline} from './archaeopteryx-preview-outline-data.js';

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
test('Amargasaurus preview is a local padded vector mask with carved detail',()=>{
 const svg=gunzipSync(Buffer.from(amargaPreviewOutline,'base64')).toString('utf8');
 assert.match(svg,/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="/);
 assert.match(svg,/fill-rule="evenodd"/);
 assert.ok(svg.length>10000,'Retain the neck spines, muscular body, four feet and woodcut details');
 assert.doesNotMatch(svg,/<image\b|\bhref=/);
});
test('Acro and Allo are default; Amargasaurus alone is an opt-in artwork review',()=>{
 const app=read('main.jsx'),lab=read('TamingLab.jsx'),art=read('IndividualCreatureLineArt.jsx'),renderer=read('CreatureLineArt.jsx');
 assert.match(art,/Acrocanthosaurus:acroPreviewOutline,Allosaurus:alloPreviewOutline/);
 assert.match(app,/get\('artPreview'\)/);
 assert.match(app,/reviewAmargaArtwork=artworkPreview==='amarga'/);
 assert.match(app,/reviewAmargaArtwork\?'Amargasaurus'/);
 assert.match(lab,/initialCreature='Rex'/);
 assert.match(lab,/artPreview==='amarga'&&creature==='Amargasaurus'/);
 assert.match(lab,/REVIEW ONLY/);
 assert.match(art,/previewAmarga&&creature==='Amargasaurus'\?amargaPreviewOutline:tracedOutlines\[creature\]/);
 assert.match(renderer,/previewAmarga=\{props\.previewAmarga\}/);
 assert.match(art,/\[creature,previewAmarga,previewAmmonite,previewAngler,previewAnky,previewAraneo,previewArchaeopteryx\]/);
 assert.doesNotMatch(app,/page==='dossiers'/);
});
test('Ammonite is available only through the dedicated preview URL and is not the default',()=>{
 const svg=gunzipSync(Buffer.from(ammonitePreviewOutline,'base64')).toString('utf8');
 assert.match(svg,/<svg xmlns="http:\/\/www.w3.org\/2000\/svg" viewBox="0 0 900 560"/);
 assert.match(svg,/fill-rule="evenodd"/);
 assert.ok(svg.length>7500,'Retain distinct shell ribs and tentacles');
 assert.doesNotMatch(svg,/<image\b|\bhref=/);
 const app=read('main.jsx'),lab=read('TamingLab.jsx'),art=read('IndividualCreatureLineArt.jsx'),renderer=read('CreatureLineArt.jsx');
 assert.match(app,/reviewAmmoniteArtwork=artworkPreview==='ammonite'/);
 assert.match(app,/reviewAmmoniteArtwork\?'Ammonite'/);
 assert.match(lab,/artPreview==='ammonite'&&creature==='Ammonite'/);
 assert.match(art,/previewAmmonite&&creature==='Ammonite'\?ammonitePreviewOutline/);
 assert.match(renderer,/previewAmmonite=\{props\.previewAmmonite\}/);
 assert.doesNotMatch(art,/Ammonite:ammonitePreviewOutline/);
});

test('Anglerfish original SVG is a self-contained margin-padded three-lure woodcut',()=>{
 const svg=gunzipSync(Buffer.from(anglerPreviewOutline,'base64')).toString('utf8');
 assert.match(svg,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 1000 620">/);
 assert.match(svg,/fill-rule="evenodd"/);
 assert.ok(svg.length>12000,'Maintain creature fins, jaw and lure detail in vector art');
 assert.doesNotMatch(svg,/<image\b|(?:href|xlink:href)=/);
});
test('approved Anglerfish is the default image and its old preview route remains compatible',()=>{
 const app=read('main.jsx'),lab=read('TamingLab.jsx'),art=read('IndividualCreatureLineArt.jsx'),renderer=read('CreatureLineArt.jsx');
 assert.match(app,/reviewAnglerArtwork=artworkPreview==='angler'/);
 assert.match(app,/reviewAnglerArtwork\?'Anglerfish'/);
 assert.match(lab,/artPreview==='angler'\?'Anglerfish'/);
 assert.match(lab,/previewAngler=\{artPreview==='angler'\}/);
 assert.doesNotMatch(lab,/artPreview==='angler'&&creature==='Anglerfish'/);
 assert.match(art,/previewAngler&&creature==='Anglerfish'\?anglerPreviewOutline/);
 assert.match(renderer,/previewAngler=\{props\.previewAngler\}/);
 assert.match(art,/Anglerfish:anglerPreviewOutline/);
 assert.match(lab,/vanillaKnockoutRoster/);
});


test('Ankylosaurus preview artwork is a local theme-tintable vector with intact armor detail',()=>{
 const svg=gunzipSync(Buffer.from(ankyPreviewOutline,'base64')).toString('utf8');
 assert.match(svg,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 1000 620">/);
 assert.match(svg,/fill-rule="evenodd"/);
 assert.ok(svg.length>16000,'Retain the armored body, four legs, head spikes and clubbed tail');
 assert.doesNotMatch(svg,/<image\b|(?:href|xlink:href)=/);
});

test('approved Ankylosaurus remains selectable and uses the default artwork',()=>{
 const app=read('main.jsx'),lab=read('TamingLab.jsx'),art=read('IndividualCreatureLineArt.jsx'),renderer=read('CreatureLineArt.jsx');
 assert.match(app,/reviewAnkyArtwork=artworkPreview==='anky'/);
 assert.match(app,/reviewAnkyArtwork\?'Ankylosaurus'/);
 assert.match(lab,/artPreview==='anky'\?'Ankylosaurus'/);
 assert.match(lab,/knockoutPickerCreatures\(reviewCreature\)\.filter/);
 assert.match(lab,/previewAnky=\{artPreview==='anky'\}/);
 assert.doesNotMatch(lab,/artPreview==='anky'&&creature==='Ankylosaurus'/);
 assert.match(art,/previewAnky&&creature==='Ankylosaurus'\?ankyPreviewOutline/);
 assert.match(renderer,/previewAnky=\{props\.previewAnky\}/);
 assert.match(art,/Ankylosaurus:ankyPreviewOutline/);
});


test('Araneo review artwork is a self-contained, margin-padded ink vector',()=>{
 const svg=gunzipSync(Buffer.from(araneoPreviewOutline,'base64')).toString('utf8');
 assert.match(svg,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 1000 620"/);
 assert.match(svg,/fill-rule="evenodd"/);
 assert.ok(svg.length>12000,'Retain Araneo abdominal plates and articulated legs');
 assert.doesNotMatch(svg,/<image\b|(?:href|xlink:href)=/);
});

test('approved Araneo is the default art and legacy review route leaves knockout dropdown intact',()=>{
 const app=read('main.jsx'),lab=read('TamingLab.jsx'),art=read('IndividualCreatureLineArt.jsx'),renderer=read('CreatureLineArt.jsx');
 assert.match(app,/reviewAraneoArtwork=artworkPreview==='araneo'/);
 assert.match(app,/reviewAraneoArtwork\?'Araneo'/);
 assert.match(lab,/artPreview==='araneo'\?'Araneo'/);
 assert.match(lab,/previewAraneo=\{artPreview==='araneo'\}/);
 assert.doesNotMatch(lab,/artPreview==='araneo'&&creature==='Araneo'/);
 assert.match(lab,/knockoutPickerCreatures\(reviewCreature\)\.filter/);
 assert.match(art,/previewAraneo&&creature==='Araneo'\?araneoPreviewOutline/);
 assert.match(renderer,/previewAraneo=\{props\.previewAraneo\}/);
 assert.match(art,/Araneo:araneoPreviewOutline/);
});


test('Archaeopteryx review asset is an embedded original feathered-dinosaur vector',()=>{
 const svg=gunzipSync(Buffer.from(archaeopteryxPreviewOutline,'base64')).toString('utf8');
 assert.match(svg,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 1000 620">/);
 assert.match(svg,/fill-rule="evenodd"/);
 assert.ok(svg.length>11000,'Preserve toothed head, feathered wings, primitive claws and long tail');
 assert.doesNotMatch(svg,/<image\b|(?:href|xlink:href)=/);
});

test('Archaeopteryx review route preselects art and retains all knockout tames',()=>{
 const app=read('main.jsx'),lab=read('TamingLab.jsx'),art=read('IndividualCreatureLineArt.jsx'),renderer=read('CreatureLineArt.jsx');
 assert.match(app,/reviewArchaeopteryxArtwork=artworkPreview==='archaeopteryx'/);
 assert.match(app,/reviewArchaeopteryxArtwork\?'Archaeopteryx'/);
 assert.match(lab,/artPreview==='archaeopteryx'\?'Archaeopteryx'/);
 assert.match(lab,/previewArchaeopteryx=\{artPreview==='archaeopteryx'\}/);
 assert.match(lab,/artPreview==='archaeopteryx'&&creature==='Archaeopteryx'/);
 assert.match(lab,/knockoutPickerCreatures\(reviewCreature\)\.filter/);
 assert.match(art,/previewArchaeopteryx&&creature==='Archaeopteryx'\?archaeopteryxPreviewOutline/);
 assert.match(renderer,/previewArchaeopteryx=\{props\.previewArchaeopteryx\}/);
 assert.doesNotMatch(art,/Archaeopteryx:archaeopteryxPreviewOutline/);
});
