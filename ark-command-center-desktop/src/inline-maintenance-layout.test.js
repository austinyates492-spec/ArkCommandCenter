import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('unconscious maintenance sits directly below dinosaur artwork in left card, not a third card',()=>{
 const src=readFileSync(new URL('./TamingLab.jsx',import.meta.url),'utf8');
 const loadout=src.indexOf('className="panel taming-combined-panel"');
 const photo=src.indexOf('className="taming-visual-column"');
 const artwork=src.indexOf('taming-art-stage');
 const metadata=src.indexOf('className="taming-creature-meta"');
 const maintenance=src.indexOf('className="taming-maintenance-inline"');
 const planContent=src.indexOf('className="taming-plan-content"');
 const planner=src.indexOf('className="panel knockout-panel taming-knockout-card"');
 assert.ok(loadout>=0 && loadout<photo && photo<artwork && artwork<metadata && metadata<maintenance && maintenance<planContent && planContent<planner, 'maintenance must be after photo metadata and before plan fields');
 assert.equal((src.match(/className="panel (?:taming-combined-panel|knockout-panel taming-knockout-card)"/g)||[]).length,2,'exactly two main cards');
 assert.doesNotMatch(src,/className="panel knockout-panel taming-torpor-maintenance-card"/);
 assert.match(src, /className="taming-creature-meta"[^\n]*<\/div>\s*\{isKnockout&&!special&&<div className="taming-maintenance-inline"/);
 for(const important of ['Wild torpor drain multiplier','Current torpor','Tame duration override','maintenance.rows.map','Keep It Unconscious']){
  assert.ok(src.includes(important),important+' is preserved');
 }
});
