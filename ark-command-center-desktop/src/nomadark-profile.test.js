import test from 'node:test';
import assert from 'node:assert/strict';
import {NOMADARK_PROFILE,NOMADARK_RATE_FIELDS,applyNomadarkConfirmedRates,migrateOldRatePreset,rateDescription} from './nomadark-profile.js';
import {defaults,species} from './data.js';

test('NomadARK supplied rates are correctly classified',()=>{
 assert.equal(NOMADARK_PROFILE.published.taming,10);
 assert.equal(NOMADARK_PROFILE.published.hatch,25);
 assert.equal(NOMADARK_PROFILE.published.mature,8);
 assert.equal(NOMADARK_PROFILE.published.breeding,0.2);
 for(const [key,value] of [['taming',10],['hatch',25],['mature',8],['breeding',0.2]]){
  assert.equal(NOMADARK_RATE_FIELDS[key].status,'confirmed',key);
  assert.equal(NOMADARK_RATE_FIELDS[key].value,value,key);
  assert.match(rateDescription(key,value),/NomadARK|from your/);
 }
 for(const key of ['cuddle','food']){
  assert.equal(NOMADARK_RATE_FIELDS[key].status,'unpublished',key);
  assert.match(rateDescription(key,10),/assumption/i);
 }
 assert.equal(NOMADARK_PROFILE.player.foodDrain,0.5);
 assert.equal(defaults.food,1,'player food drain must not overwrite dinosaur food drain');
});

test('applying confirmed rates preserves unverified overrides',()=>{
 const current={taming:5,hatch:80,mature:60,cuddle:0.04,breeding:0.2,food:1.5};
 const next=applyNomadarkConfirmedRates(current);
 assert.deepEqual(next,{...current,taming:10,hatch:25,mature:8,breeding:0.2});
 assert.deepEqual(current,{taming:5,hatch:80,mature:60,cuddle:0.04,breeding:0.2,food:1.5});
 assert.match(rateDescription('taming',5),/override/i);
});

test('old untouched default rates migrate while customized profiles survive',()=>{
 const old={taming:10,hatch:10,mature:10,cuddle:0.1,breeding:0.1,food:1};
 assert.deepEqual(migrateOldRatePreset(old,defaults),defaults);
 const custom={...old,mature:12};
 assert.deepEqual(migrateOldRatePreset(custom,defaults),custom);
 assert.deepEqual(migrateOldRatePreset(undefined,defaults),defaults);
});

test('NomadARK rate scaling for a Rex is 8x raising and 25x incubation',()=>{
 const rex=species.Rex;
 const matureHours=rex.mature/defaults.mature;
 const hatchMinutes=rex.hatch/defaults.hatch*60;
 assert.ok(matureHours>11&&matureHours<12,`Maturity was ${matureHours}h`);
 assert.ok(hatchMinutes>11&&hatchMinutes<13,`Hatching was ${hatchMinutes}m`);
 assert.equal(defaults.breeding,0.2);
});
