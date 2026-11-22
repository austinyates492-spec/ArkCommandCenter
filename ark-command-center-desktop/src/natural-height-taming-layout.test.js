import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('creature dashboard uses independent left rail and stacked right modules',()=>{
 const css=readFileSync(new URL('./taming-lab-art.css',import.meta.url),'utf8');
 const src=readFileSync(new URL('./TamingLab.jsx',import.meta.url),'utf8');
 assert.match(src,/className="taming-dashboard-creature"/);
 assert.match(src,/className="taming-dashboard-key-stats"/);
 assert.match(src,/className="taming-dashboard-tools"/);
 assert.match(src,/className="panel taming-dashboard-tame"/);
 assert.match(src,/className="panel knockout-panel taming-knockout-card"/);
 assert.match(css,/\.taming-dashboard-tools\{[^}]*display:grid/);
 assert.match(css,/\.taming-workspace>\.taming-combined-panel\{[^}]*height:auto/);
 assert.match(css,/@media\(max-width:600px\)/);
 assert.ok(src.indexOf('className="taming-maintenance-inline"')>src.indexOf('className="panel knockout-panel taming-knockout-card"'));
});
