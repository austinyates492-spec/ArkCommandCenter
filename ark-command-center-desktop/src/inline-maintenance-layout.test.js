import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('unconscious maintenance follows tranq ammo inside right knockout card, with only two outer cards',()=>{
 const src=readFileSync(new URL('./TamingLab.jsx',import.meta.url),'utf8');
 const left=src.indexOf('className="panel taming-combined-panel"');
 const photo=src.indexOf('className="taming-visual-column"');
 const right=src.indexOf('className="panel knockout-panel taming-knockout-card"');
 const ammo=src.indexOf('<h3>Tranquilizer Options</h3>');
 const reference=src.indexOf('Ammo calculation reference');
 const maintenance=src.indexOf('className="taming-maintenance-inline"');
 const cardEnd=src.indexOf('   </section>}',right);
 assert.ok(left>=0 && left<photo && photo<right && right<ammo && ammo<reference && reference<maintenance && maintenance<cardEnd,'the torpor section follows ammo inside the right card');
 assert.equal((src.match(/className="panel (?:taming-combined-panel|knockout-panel taming-knockout-card)"/g)||[]).length,2,'exactly two outer cards');
 assert.doesNotMatch(src,/className="panel knockout-panel taming-torpor-maintenance-card"/);
 for(const important of ['Wild torpor drain multiplier','Current torpor','Tame duration override','maintenance.rows.map','Keep It Unconscious']){
  assert.ok(src.includes(important),important+' is preserved');
 }
});
