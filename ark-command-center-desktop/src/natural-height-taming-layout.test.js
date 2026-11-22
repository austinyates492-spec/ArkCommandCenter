import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('creature photo and tame calculator match height above full-width knockout',()=>{
 const css=readFileSync(new URL('./taming-lab-art.css',import.meta.url),'utf8');
 const src=readFileSync(new URL('./TamingLab.jsx',import.meta.url),'utf8');
 const current=css.slice(css.lastIndexOf('/* Approved horizontal redesign'));
 for(const cls of ['taming-dashboard-creature','taming-dashboard-key-stats','taming-dashboard-tools','panel taming-dashboard-tame','panel knockout-panel taming-knockout-card'])assert.ok(src.includes(cls),cls);
 assert.match(current,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 assert.match(current,/\.taming-dashboard-tools\{display:contents\}/);
 assert.match(current,/\.taming-workspace>\.taming-combined-panel,\s*\.taming-dashboard-tools>\.taming-dashboard-tame\{\s*height:100%;[\s\S]*?align-self:stretch/);
 assert.match(current,/\.taming-dashboard-tools>\.taming-knockout-card,[\s\S]*?grid-column:1 \/ -1/);
 assert.match(current,/@media\(max-width:900px\)/);
 assert.ok(src.indexOf('className="taming-maintenance-inline"')>src.indexOf('className="panel knockout-panel taming-knockout-card"'));
});
