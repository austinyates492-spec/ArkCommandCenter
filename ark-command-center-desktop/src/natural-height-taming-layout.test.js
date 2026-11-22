import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('two-column knockout workspace allows independently sized cards',()=>{
 const css=readFileSync(new URL('./taming-lab-art.css',import.meta.url),'utf8');
 const src=readFileSync(new URL('./TamingLab.jsx',import.meta.url),'utf8');
 assert.equal((src.match(/className="panel (?:taming-combined-panel|knockout-panel taming-knockout-card)"/g)||[]).length,2);
 const lastPanelRule=css.lastIndexOf('.taming-workspace>.panel{');
 assert.ok(lastPanelRule>0,'independent height override exists');
 const rule=css.slice(lastPanelRule,lastPanelRule+120);
 assert.match(rule,/height:auto/);
 assert.match(rule,/align-self:start/);
 assert.match(css,/\.taming-workspace \.taming-combined-panel \.taming-art-stage\{\s*aspect-ratio:1\.55 \/ 1/);
 assert.ok(src.indexOf('className="taming-maintenance-inline"')>src.indexOf('className="panel knockout-panel taming-knockout-card"'));
});
