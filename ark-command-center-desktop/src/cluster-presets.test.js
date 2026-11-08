import test from 'node:test';
import assert from 'node:assert/strict';
import {clusterPresets,ratesForPreset,presetById} from './cluster-presets.js';

test('cluster selector includes official modes and custom',()=>{
 const ids=clusterPresets.map(profile=>profile.id);
 assert.equal(new Set(ids).size,ids.length);
 for(const mode of ['nomadark','official-pvp','official-pve','small-tribes','arkpocalypse','conquest','classic','official-evo','custom'])assert.ok(ids.includes(mode));
});
test('official small tribes and NomadARK rate profiles are accurate',()=>{
 assert.deepEqual(ratesForPreset('small-tribes',{}),{taming:2.5,hatch:2,mature:2,breeding:0.5,cuddle:0.5,food:1});
 assert.deepEqual(ratesForPreset('nomadark',{}),{taming:10,hatch:25,mature:8,breeding:0.2,cuddle:0.1,food:1});
 assert.equal(presetById('official-pve').rates.taming,1);
 assert.deepEqual(ratesForPreset('conquest',{}),{taming:5,hatch:5,mature:5,breeding:0.5,cuddle:0.2,food:1});
 assert.equal(presetById('conquest').verified,true);
 assert.equal(presetById('arkpocalypse').verified,false);
});
test('custom cluster keeps existing rates unchanged',()=>{
 const custom={taming:7,mature:12,hatch:15,breeding:0.25,cuddle:0.1,food:0.5};
 assert.deepEqual(ratesForPreset('custom',custom),custom);
 assert.notEqual(ratesForPreset('custom',custom),custom);
});
