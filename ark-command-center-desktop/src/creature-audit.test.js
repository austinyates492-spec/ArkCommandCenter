import test from 'node:test';
import assert from 'node:assert/strict';
import {creatureAudit,auditTotals} from './creature-audit.js';
test('full catalog has explicit per-creature validation states',()=>{
 const rows=creatureAudit(),totals=auditTotals(rows);
 assert.equal(totals.catalog,278);
 assert.ok(totals.autoKnockout>=130);
 assert.equal(totals.torporReferences,0);
 assert.equal(totals.methodUnclassified,26);
 assert.equal(totals.foodCalculators,14);
 assert.ok(totals.breeding>=218);
 assert.equal(rows.find(x=>x.name==='Rex').knockout,true);
 assert.equal(rows.find(x=>x.name==='Wyvern').knockout,false);
});
