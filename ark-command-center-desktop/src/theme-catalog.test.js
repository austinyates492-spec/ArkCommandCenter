import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {rexOutlineGzip} from './rex-outline-data.js';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
const folder=dirname(fileURLToPath(import.meta.url));
const read=file=>readFileSync(join(folder,file),'utf8');
const ids=[...read('ThemePicker.jsx').matchAll(/\{id:'([a-z]+)',label:/g)].map(match=>match[1]);

test('ten curated themes keep complete backgrounds, panels and form palettes',()=>{
 const css=read('themes.css');
 assert.equal(ids.length,10);
 assert.equal(new Set(ids).size,10);
 const required=['--ark-accent','--ark-bg','--ark-sidebar','--ark-surface','--ark-surface-2','--ark-input','--ark-muted','--ark-line','--ark-heading','--ark-backdrop-top','--ark-backdrop-bottom','--ark-form-text','--ark-form-placeholder','--ark-form-focus'];
 for(const id of ids){
  const selector=new RegExp('\\.shell\\[data-theme='+id+'\\]\\{([^}]*)\\}','g');
  const definitions=[...css.matchAll(selector)].map(match=>match[1]).join(';');
  assert.ok(definitions.length>0,id+' has an existing complete palette');
  for(const property of required)assert.ok(definitions.includes(property+':'),id+' missing '+property);
 }
});
test('all signature themes have their own geometry and atmosphere',()=>{
 const css=read('personality.css');
 for(const id of ids){
  const selector=new RegExp('\\.shell\\[data-theme='+id+'\\]\\{([^}]*)\\}');
  const block=css.match(selector);
  assert.ok(block,id+' has signature styling');
  assert.match(block[1],/--personality-radius:/);
  assert.match(block[1],/--personality-hero:/);
 }
 assert.match(css,/@media\(max-width:460px\)/);
});
test('prismatic uses full spectrum while monolith remains grayscale',()=>{
 const picker=read('ThemePicker.jsx'),css=read('themes.css');
 assert.match(picker,/id:'rainbow',label:'Prismatic'/);
 assert.match(picker,/id:'monochrome',label:'Monolith'/);
 assert.match(css,/\.shell\[data-theme=rainbow\] \.sidebar\{background:linear-gradient/);
 assert.match(css,/\.shell\[data-theme=rainbow\] \.primary\{background:linear-gradient/);
 assert.match(css,/\.shell\[data-theme=monochrome\] input[^\n]*[\s\S]*?color-scheme:light/);
 const monochrome=[...css.matchAll(/\.shell\[data-theme=monochrome\]\{([^}]*)\}/g)].map(match=>match[1]).join(';');
 const colors=[...monochrome.matchAll(/#[0-9a-f]{6}\b/gi)].map(match=>match[0].slice(1).toLowerCase());
 assert.ok(colors.length>10);
 for(const hex of colors){assert.equal(hex.slice(0,2),hex.slice(2,4));assert.equal(hex.slice(2,4),hex.slice(4,6));}
});
test('startup splash is available in first HTML paint, before React bundle',()=>{
 const html=readFileSync(join(folder,'../index.html'),'utf8');
 const boot=readFileSync(join(folder,'../public/boot-intro-v818.js'),'utf8');
 const app=read('main.jsx');
 assert.ok(html.indexOf('id="ark-boot-intro"')<html.indexOf('id="root"'));
 assert.ok(html.indexOf('/boot-intro-v818.js')<html.indexOf('/src/main.jsx'));
 assert.match(html,/arkBootEmblem/);
 assert.match(boot,/DOMContentLoaded/);
 assert.match(boot,/ark:replay-intro/);
 assert.match(boot,/ark.showStartup/);
 assert.match(boot,/arkTribeHQReplayIntro/);
 assert.match(boot,/play\(true\)/);
 assert.doesNotMatch(html,/#ark-boot-intro\{display:none!important\}/);
 assert.match(app,/Replay opening animation/);
 assert.doesNotMatch(app,/<StartupSequence/);
});

test('boot intro matches the saved user theme and cloud-hydrated theme changes',()=>{
 const html=readFileSync(join(folder,'../index.html'),'utf8');
 const intro=readFileSync(join(folder,'../public/boot-intro-v818.js'),'utf8');
 const app=read('main.jsx');
 for(const id of ids)assert.ok(intro.includes(id+':{accent:'),id+' opening palette missing');
 assert.match(intro,/localStorage\.getItem\('ark\.theme'\)/);
 assert.match(intro,/ark:theme-changed/);
 assert.match(intro,/--boot-accent/);
 assert.match(intro,/spectrum:/);
 assert.match(html,/var\(--boot-accent/);
 assert.match(html,/var\(--boot-line/);
 assert.match(app,/new CustomEvent\('ark:theme-changed'/);
});

test('themed intro welcomes authenticated survivor and tribe, with guest fallback',()=>{
 const html=readFileSync(join(folder,'../index.html'),'utf8');
 const boot=readFileSync(join(folder,'../public/boot-intro-v818.js'),'utf8');
 const main=read('main.jsx');
 const saved=read('saved-login.js');
 assert.match(html,/data-boot-welcome/);
 assert.match(html,/data-boot-tribe/);
 assert.match(boot,/WELCOME BACK, /);
 assert.match(boot,/WELCOME, SURVIVOR/);
 assert.match(boot,/sessionStorage\.getItem\('ark\.cloudSession'\)/);
 assert.match(boot,/localStorage\.getItem\('ark\.cloudRememberToken'\)/);
 assert.match(boot,/ark:identity-changed/);
 assert.match(main,/new CustomEvent\('ark:identity-changed'/);
 assert.match(main,/ark\.bootIdentity/);
 assert.match(saved,/storage\.removeItem\('ark\.bootIdentity'\)/);
});

test('remembered users retain their personalized intro while session restores',()=>{
 const app=read('main.jsx');
 assert.match(app,/else if\(!localStorage\.getItem\('ark\.cloudRememberToken'\)\)/);
 assert.match(app,/Avoid replacing the remembered welcome/);
});

test('original Rex art and verified model are available alongside searchable Taming Lab',()=>{
 const dossier=read('RexDossier.jsx');
 const css=read('rex-dossier.css');
 const lab=read('TamingLab.jsx');
 assert.match(lab,/import \{RexArtwork\} from '.\/RexDossier.jsx'/);
 assert.match(lab,/Search all knockout creatures and variants/);
 assert.match(lab,/RexArtwork/);
 assert.match(lab,/calculateTame\(/);
 assert.match(lab,/knockoutEstimate\(/);
 assert.match(dossier,/result\.foodPieces/);
 assert.match(dossier,/result\.seconds/);
 assert.match(dossier,/knockout\.totalTorpor/);
 assert.match(dossier,/knockout\.rows/);
 assert.match(dossier,/setWeaponQuality/);
 assert.match(dossier,/setLongneckBuffPercent/);
 assert.match(dossier,/result\.caveat/);
 assert.match(css,/--rd-accent:var\(--ark-accent/);
 assert.match(css,/@media\(max-width:420px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});

test('Rex has self-contained detailed technical outline with no remote art dependency',()=>{
 const jsx=read('RexDossier.jsx'),css=read('rex-dossier.css');
 const svg=gunzipSync(Buffer.from(rexOutlineGzip,'base64')).toString('utf8');
 assert.match(svg,/<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
 assert.match(svg,/fill-rule="evenodd"/);
 assert.ok(svg.length>8000,'Anatomical Rex linework should be detailed, not a generic icon');
 assert.match(jsx,/DecompressionStream\('gzip'\)/);
 assert.match(jsx,/data:image\/svg\+xml;base64/);
 assert.match(jsx,/maskImage/);
 assert.match(jsx,/WebkitMaskImage/);
 assert.match(css,/\.rex-outline-art/);
 assert.match(css,/background:var\(--rd-accent\)/);
 assert.doesNotMatch(jsx,/Tyrannosaurus_rex_3D_render/);
 assert.doesNotMatch(jsx,/thumb\.wikimedia\.org/);
 assert.match(css,/@media\(max-width:420px\)/);
});
