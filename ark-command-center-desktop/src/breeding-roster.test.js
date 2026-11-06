import test from 'node:test';
import assert from 'node:assert/strict';
import {species,tameCreatures,asaCoverage,resourceMapUrl,wikiResourceMapUrl} from './data.js';

test('breeding database covers 150+ distinct profiles',()=>{
 assert.ok(Object.keys(species).length>=218);
 assert.ok(tameCreatures.length>=250);
 assert.ok(species.Giganotosaurus.mature>240);
 assert.ok(species.Therizinosaurus.mature>100);
 assert.equal(species['Tek Rex'].mature,species.Rex.mature);
});
test('missing incubation is not silently fabricated',()=>{
 assert.equal(species.Giganotosaurus.hatch,undefined);
 assert.ok(species.Rex.hatch>0);
});
test('resource links are valid provider pages without unsupported filtering parameters',()=>{
 assert.equal(resourceMapUrl('The Island'),'https://wikily.gg/ark-survival-ascended/maps/the-island');
 assert.equal(wikiResourceMapUrl('The Island'),'https://ark.wiki.gg/wiki/Resource_Map/The_Island');
});
test('ASA comparison count excludes the explicit mod, and preserves all 214 names',()=>{
 assert.equal(asaCoverage.reference.listed,215);
 assert.equal(asaCoverage.reference.explicitMods,1);
 assert.equal(asaCoverage.reference.baseOfficial,214);
 assert.equal(asaCoverage.baseInApp,215);
 assert.equal(asaCoverage.variantsInApp,63);
 assert.equal(tameCreatures.length,278);
 assert.equal(tameCreatures.includes('Brachiosaurus [MOD]'),false);
});
