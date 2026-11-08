import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';

test('all 25 themes include complete backgrounds, panels, text and input palettes',()=>{
 const folder=dirname(fileURLToPath(import.meta.url));
 const picker=readFileSync(join(folder,'ThemePicker.jsx'),'utf8');
 const css=readFileSync(join(folder,'themes.css'),'utf8');
 const ids=[...picker.matchAll(/\{id:'([a-z]+)',label:/g)].map(match=>match[1]);
 assert.equal(ids.length,25);
 assert.equal(new Set(ids).size,25);
 const required=['--ark-accent','--ark-bg','--ark-sidebar','--ark-surface','--ark-surface-2','--ark-input','--ark-muted','--ark-line','--ark-heading','--ark-backdrop-top','--ark-backdrop-bottom','--ark-form-text','--ark-form-placeholder','--ark-form-focus'];
 for(const id of ids){
  const selector=id==='emerald'?/\.shell\{([^}]*)\}/g:new RegExp(`\\.shell\\[data-theme=${id}\\]\\{([^}]*)\\}`,'g');
  const definitions=[...css.matchAll(selector)].map(match=>match[1]).join(';');
  assert.ok(definitions.length>0,`${id} has a palette`);
  for(const property of required)assert.ok(definitions.includes(`${property}:`),`${id} missing ${property}`);
 }
});

test('rainbow recolors the entire UI; black and white stays grayscale',()=>{
 const folder=dirname(fileURLToPath(import.meta.url));
 const picker=readFileSync(join(folder,'ThemePicker.jsx'),'utf8');
 const css=readFileSync(join(folder,'themes.css'),'utf8');
 assert.match(picker,/id:'rainbow',label:'Rainbow Spectrum'/);
 assert.match(picker,/id:'monochrome',label:'Black & White'/);
 assert.match(css,/\.shell\[data-theme=rainbow\] \.sidebar\{background:linear-gradient/);
 assert.match(css,/\.shell\[data-theme=rainbow\] \.primary\{background:linear-gradient/);
 assert.match(css,/\.shell\[data-theme=monochrome\] input[^\n]*[\s\S]*?color-scheme:light/);
 const monochrome=[...css.matchAll(/\.shell\[data-theme=monochrome\]\{([^}]*)\}/g)].map(match=>match[1]).join(';');
 const colors=[...monochrome.matchAll(/#[0-9a-f]{6}\b/gi)].map(match=>match[0].slice(1).toLowerCase());
 assert.ok(colors.length>10);
 for(const hex of colors)assert.equal(hex.slice(0,2),hex.slice(2,4));
 for(const hex of colors)assert.equal(hex.slice(2,4),hex.slice(4,6));
});
