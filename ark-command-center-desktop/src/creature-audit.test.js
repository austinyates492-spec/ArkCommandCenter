import test from 'node:test';
import assert from 'node:assert/strict';
import {creatureAudit,auditTotals} from './creature-audit.js';
test('full catalog has explicit per-creature validation states',()=>{
 const rows=creatureAudit(),totals=auditTotals(rows);
 assert.equal(totals.catalog,278);
 assert.equal(totals.autoKnockout,100);
 assert.equal(totals.foodCalculators,14);
 assert.ok(totals.breeding>=218);
 assert.equal(rows.find(x=>x.name==='Rex').knockout,true);
 assert.equal(rows.find(x=>x.name==='Wyvern').knockout,false);
});
