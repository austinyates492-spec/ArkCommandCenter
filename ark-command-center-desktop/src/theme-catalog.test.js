import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
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
 const boot=readFileSync(join(folder,'../public/boot-intro-v817.js'),'utf8');
 const app=read('main.jsx');
 assert.ok(html.indexOf('id="ark-boot-intro"')<html.indexOf('id="root"'));
 assert.ok(html.indexOf('/boot-intro-v817.js')<html.indexOf('/src/main.jsx'));
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
 const intro=readFileSync(join(folder,'../public/boot-intro-v817.js'),'utf8');
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
