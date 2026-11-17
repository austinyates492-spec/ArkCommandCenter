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
import {archelonPreviewOutline} from './archelon-preview-outline-data.js';
import {argentavisPreviewOutline} from './argentavis-preview-outline-data.js';
import {armadoggoPreviewOutline} from './armadoggo-preview-outline-data.js';
import {arthroplueraPreviewOutline} from './arthropluera-preview-outline-data.js';
import {astrocetusPreviewOutline} from './astrocetus-preview-outline-data.js';

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
 assert.match(art,/\[creature,previewAmarga,previewAmmonite,previewAngler,previewAnky,previewAraneo,previewArchaeopteryx,previewArchelon,previewArgentavis,previewArmadoggo,previewArthropluera,previewAstrocetus\]/);
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

test('approved Archaeopteryx defaults and legacy review preserves all knockout tames',()=>{
 const app=read('main.jsx'),lab=read('TamingLab.jsx'),art=read('IndividualCreatureLineArt.jsx'),renderer=read('CreatureLineArt.jsx');
 assert.match(app,/reviewArchaeopteryxArtwork=artworkPreview==='archaeopteryx'/);
 assert.match(app,/reviewArchaeopteryxArtwork\?'Archaeopteryx'/);
 assert.match(lab,/artPreview==='archaeopteryx'\?'Archaeopteryx'/);
 assert.match(lab,/previewArchaeopteryx=\{artPreview==='archaeopteryx'\}/);
 assert.doesNotMatch(lab,/artPreview==='archaeopteryx'&&creature==='Archaeopteryx'/);
 assert.match(lab,/knockoutPickerCreatures\(reviewCreature\)\.filter/);
 assert.match(art,/previewArchaeopteryx&&creature==='Archaeopteryx'\?archaeopteryxPreviewOutline/);
 assert.match(renderer,/previewArchaeopteryx=\{props\.previewArchaeopteryx\}/);
 assert.match(art,/Archaeopteryx:archaeopteryxPreviewOutline/);
});


test('Archelon review asset is a local standalone shell-and-four-flipper SVG',()=>{
 const svg=gunzipSync(Buffer.from(archelonPreviewOutline,'base64')).toString('utf8');
 assert.match(svg,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 1000 660">/);
 assert.match(svg,/fill-rule="evenodd"/);
 assert.ok(svg.length>10000,'Keep shell, head and four flippers in original vector');
 assert.doesNotMatch(svg,/<image\b|(?:href|xlink:href)=/);
});

test('Approved Archelon remains default in Passive Lab and its preview URL works',()=>{
 const app=read('main.jsx'),passive=read('PassiveLab.jsx'),knockout=read('TamingLab.jsx'),art=read('IndividualCreatureLineArt.jsx'),renderer=read('CreatureLineArt.jsx');
 assert.match(app,/reviewArchelonArtwork=artworkPreview==='archelon'/);
 assert.match(app,/reviewArthroplueraArtwork\|\|reviewArchelonArtwork\?'passive'/);
 assert.match(app,/selectedCreature=\{reviewArthroplueraArtwork\?'Arthropluera':reviewArchelonArtwork\?'Archelon':crossLabCreature\}/);
 assert.match(app,/artPreview=\{reviewArthroplueraArtwork\?'arthropluera':reviewArchelonArtwork\?'archelon':null\}/);
 assert.match(passive,/const passiveRoster=vanillaTamesByMethod\.passive/);
 assert.match(passive,/passiveRoster\.filter/);
 assert.match(passive,/previewArchelon=\{artPreview==='archelon'\}/);
 assert.doesNotMatch(passive,/artPreview==='archelon'&&creature==='Archelon'/);
 assert.match(art,/previewArchelon&&creature==='Archelon'\?archelonPreviewOutline/);
 assert.match(renderer,/previewArchelon=\{props\.previewArchelon\}/);
 assert.match(art,/Archelon:archelonPreviewOutline/);
 assert.match(knockout,/knockoutPickerCreatures\(reviewCreature\)/);
});


test('Argentavis preview asset is an original embedded ink vector with wing and talon detail',()=>{
 const svg=gunzipSync(Buffer.from(argentavisPreviewOutline,'base64')).toString('utf8');
 assert.match(svg,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 1000 660">/);
 assert.match(svg,/fill-rule="evenodd"/);
 assert.ok(svg.length>7000,'Retain natural dark eye, folded wings, standing feet and layered tail');
 assert.ok(argentavisPreviewOutline.length<6000,'Keep standing species art lightweight for website loading');
 assert.doesNotMatch(svg,/<image\b|(?:href|xlink:href)=/);
});

test('Approved Argentavis remains selectable via legacy preview route and full knockout roster',()=>{
 const app=read('main.jsx'),lab=read('TamingLab.jsx'),art=read('IndividualCreatureLineArt.jsx'),renderer=read('CreatureLineArt.jsx');
 assert.match(app,/reviewArgentavisArtwork=artworkPreview==='argentavis'/);
 assert.match(app,/reviewArgentavisArtwork\?'Argentavis'/);
 assert.match(lab,/artPreview==='argentavis'\?'Argentavis'/);
 assert.match(lab,/previewArgentavis=\{artPreview==='argentavis'\}/);
 assert.doesNotMatch(lab,/artPreview==='argentavis'&&creature==='Argentavis'/);
 assert.match(lab,/knockoutPickerCreatures\(reviewCreature\)\.filter/);
 assert.match(art,/previewArgentavis&&creature==='Argentavis'\?argentavisPreviewOutline/);
 assert.match(renderer,/previewArgentavis=\{props\.previewArgentavis\}/);
 assert.match(art,/Argentavis:argentavisPreviewOutline/);
});


test('three alphabetic batch illustrations are independent theme masks, not raster images',()=>{
 const group=[['Armadoggo',armadoggoPreviewOutline],['Arthropluera',arthroplueraPreviewOutline],['Astrocetus',astrocetusPreviewOutline]];
 for(const [name,b64] of group){
  const svg=gunzipSync(Buffer.from(b64,'base64')).toString('utf8');
  assert.match(svg,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 1000 620">/);
  assert.match(svg,/fill-rule="evenodd"/);
  assert.ok(svg.length>4000,name+' silhouette was accidentally simplified too much');
  assert.doesNotMatch(svg,/<image\b|(?:href|xlink:href)=/);
  assert.ok(b64.length<10000,name+' preview should stay lightweight');
 }
});

test('alphabetical batch art is review-only in each lab and original default art remains intact',()=>{
 const app=read('main.jsx'),passive=read('PassiveLab.jsx'),special=read('SpecialtyLab.jsx'),
  renderer=read('CreatureLineArt.jsx'),art=read('IndividualCreatureLineArt.jsx'),knockout=read('TamingLab.jsx');
 assert.match(app,/reviewArmadoggoArtwork=artworkPreview==='armadoggo'/);
 assert.match(app,/reviewArthroplueraArtwork=artworkPreview==='arthropluera'/);
 assert.match(app,/reviewAstrocetusArtwork=artworkPreview==='astrocetus'/);
 assert.match(app,/reviewArmadoggoArtwork\|\|reviewAstrocetusArtwork\?'specialty'/);
 assert.match(app,/reviewArthroplueraArtwork\|\|reviewArchelonArtwork\?'passive'/);
 assert.match(app,/selectedCreature=\{reviewArmadoggoArtwork\?'Armadoggo':reviewAstrocetusArtwork\?'Astrocetus':crossLabCreature\}/);
 assert.match(app,/selectedCreature=\{reviewArthroplueraArtwork\?'Arthropluera':reviewArchelonArtwork\?'Archelon':crossLabCreature\}/);
 assert.match(special,/previewArmadoggo=\{artPreview==='armadoggo'\}/);
 assert.match(special,/previewAstrocetus=\{artPreview==='astrocetus'\}/);
 assert.match(passive,/previewArthropluera=\{artPreview==='arthropluera'\}/);
 assert.match(special,/specialtyRoster\.filter/);
 assert.match(passive,/passiveRoster\.filter/);
 for(const [name,prop] of [['Armadoggo','armadoggoPreviewOutline'],['Arthropluera','arthroplueraPreviewOutline'],['Astrocetus','astrocetusPreviewOutline']]){
  assert.match(art,new RegExp("preview"+name+"&&creature==='"+name+"'\\?"+prop));
  assert.doesNotMatch(art,new RegExp(name+":"+prop));
 }
 assert.match(renderer,/previewArmadoggo=\{props\.previewArmadoggo\}/);
 assert.match(renderer,/previewArthropluera=\{props\.previewArthropluera\}/);
 assert.match(renderer,/previewAstrocetus=\{props\.previewAstrocetus\}/);
 assert.match(knockout,/knockoutPickerCreatures\(reviewCreature\)\.filter/);
});
