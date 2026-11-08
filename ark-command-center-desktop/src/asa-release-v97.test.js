import test from 'node:test';
import assert from 'node:assert/strict';
import {ASA_V97_NEW_CREATURES,ASA_V97_REWORKED_TAMES,ASA_V97_ENIGMASAUR_MAPS,officialReleaseMapAvailability} from './asa-release-v97.js';
import {tameCreatures} from './data.js';
import {getTamingMethod,knockoutRoster,specialtyRoster} from './special-taming-methods.js';
import {calculateTame,availableFoods} from './taming-engine.js';
import {knockoutEstimate,knockoutSpecies} from './knockout-engine.js';
import {specialtyFeeding} from './specialty-engine.js';

test('ASA v97 live creature is in official catalog and all announced maps',()=>{
 assert.deepEqual(ASA_V97_NEW_CREATURES,['Enigmasaur']);
 assert.ok(tameCreatures.includes('Enigmasaur'));
 assert.equal(ASA_V97_ENIGMASAUR_MAPS.length,8);
 for(const map of ASA_V97_ENIGMASAUR_MAPS)assert.equal(officialReleaseMapAvailability('Enigmasaur',map).available,true,map);
 assert.equal(officialReleaseMapAvailability('Enigmasaur','The Island').available,false);
 assert.equal(officialReleaseMapAvailability('Rex','The Island'),null);
 assert.match(getTamingMethod('Enigmasaur').instructions,/matching|imitating/i);
 assert.ok(specialtyRoster.includes('Enigmasaur'));
});
test('Giga v97 cannot present obsolete knockout or post-knockout food estimates',()=>{
 assert.deepEqual(ASA_V97_REWORKED_TAMES,['Giganotosaurus']);
 for(const name of ['Giganotosaurus','Tek Giganotosaurus']){
  assert.ok(tameCreatures.includes(name),name);
  assert.ok(specialtyRoster.includes(name),name);
  assert.ok(!knockoutRoster.includes(name),name);
  assert.ok(!Object.hasOwn(knockoutSpecies,name),name);
  assert.match(getTamingMethod(name).instructions,/Apex Offering/);
  assert.equal(knockoutEstimate({creature:name,level:150,targetTorpor:25000}).ok,false);
  assert.equal(calculateTame({creature:name,level:150,food:'Exceptional Kibble'}).ok,false);
  assert.deepEqual(availableFoods(name),[]);
  assert.equal(specialtyFeeding({creature:name,level:150,food:'Exceptional Kibble'}).ok,false);
 }
});
