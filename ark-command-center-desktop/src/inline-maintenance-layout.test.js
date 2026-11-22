import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('unconscious maintenance lives within Loadout & Sources rather than standalone oversized panel',()=>{
 const src=readFileSync(new URL('./TamingLab.jsx',import.meta.url),'utf8');
 const loadout=src.indexOf('className="panel taming-combined-panel"');
 const maintenance=src.indexOf('className="taming-maintenance-inline"');
 const planner=src.indexOf('className="panel knockout-panel taming-knockout-card"');
 assert.ok(loadout>=0&&maintenance>loadout&&planner>maintenance);
 assert.doesNotMatch(src,/className="panel knockout-panel taming-torpor-maintenance-card"/);
 assert.match(src,/<\/div>\}\s*<\/section>\s*\{isKnockout&&!special&&<section className="panel knockout-panel taming-knockout-card"/);
 for(const important of ['Wild torpor drain multiplier','Current torpor','Tame duration override','maintenance.rows.map','Keep It Unconscious']){
  assert.ok(src.includes(important),important+' is preserved');
 }
});
