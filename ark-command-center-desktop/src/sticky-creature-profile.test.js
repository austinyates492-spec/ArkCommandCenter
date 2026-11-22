import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('horizontal layout removes sticky creature rail and keeps photo height fixed',()=>{
 const css=readFileSync(new URL('./taming-lab-art.css',import.meta.url),'utf8');
 const current=css.slice(css.lastIndexOf('/* Approved horizontal redesign'));
 assert.match(current,/\.taming-dashboard-tools\{display:contents\}/);
 assert.match(current,/\.taming-workspace>\.taming-combined-panel\{[\s\S]*?position:static/);
 assert.match(current,/\.taming-workspace \.taming-combined-panel \.taming-art-stage\{[\s\S]*?height:220px;[\s\S]*?min-height:220px;[\s\S]*?max-height:220px/);
 assert.doesNotMatch(current,/overflow-y:auto/);
 assert.match(current,/@media\(max-width:900px\)/);
});
