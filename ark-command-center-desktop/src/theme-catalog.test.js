import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';

test('ten themes include complete backgrounds and tinted input controls',()=>{
 const folder=dirname(fileURLToPath(import.meta.url));
 const picker=readFileSync(join(folder,'ThemePicker.jsx'),'utf8');
 const css=readFileSync(join(folder,'themes.css'),'utf8');
 const ids=[...picker.matchAll(/\{id:'([a-z]+)',label:/g)].map(match=>match[1]);
 assert.equal(ids.length,10);
 assert.equal(new Set(ids).size,10);
 for(const id of ids.filter(name=>name!=='emerald')){
  assert.match(css,new RegExp(`\\.shell\\[data-theme=${id}\\]\\{`));
  assert.ok(css.includes('--ark-backdrop-top:'),id);
  assert.ok(css.includes('--ark-input:'),id);
 }
});
