import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {asaBaseCreatures} from './asa-official-catalog.js';
import {breedingVariants} from './breeding-variants.js';
import {vanillaTameRoster,vanillaTamesByMethod} from './vanilla-tame-picker.js';
import {tamingCategory,getTamingMethod} from './special-taming-methods.js';

test('vanilla chooser never leaks unknown wiki names, bosses, unreleased or untameable entries',()=>{
 const whitelist=new Set([...asaBaseCreatures,'Ferox']);
 const groups=Object.values(vanillaTamesByMethod);
 assert.ok(vanillaTameRoster.length>100,'Official tame roster unexpectedly empty');
 assert.deepEqual(new Set(groups.flat()),new Set(vanillaTameRoster),'every released tame appears in exactly one category');
 assert.equal(groups.flat().length,new Set(groups.flat()).size,'no duplicate names across methods');
 for(const name of vanillaTameRoster){
  assert.ok(whitelist.has(breedingVariants[name]||name),name+' is not official ASA content');
  assert.ok(['knockout','passive','specialty'].includes(tamingCategory(name)),name);
  assert.notEqual(tamingCategory(name),'untameable',name);
  assert.ok(!['unavailable','unreleased','untameable'].includes(getTamingMethod(name)?.status),name);
 }
 for(const name of ['Ammonite','DodoRex','Broodmother Lysrix','Revenant','Not A Vanilla Mod Creature'])
  assert.ok(!vanillaTameRoster.includes(name),name+' is not a normal tame');
 for(const name of ['Allosaurus','Acrocanthosaurus','Achatina','Rex','Karkinos'])
  assert.ok(vanillaTameRoster.includes(name),name+' should remain an official tame');
});
test('main Taming Lab only uses whitelist and has a meaningful method selector',()=>{
 const lab=readFileSync(new URL('./TamingLab.jsx',import.meta.url),'utf8');
 const passive=readFileSync(new URL('./PassiveLab.jsx',import.meta.url),'utf8');
 const special=readFileSync(new URL('./SpecialtyLab.jsx',import.meta.url),'utf8');
 const app=readFileSync(new URL('./main.jsx',import.meta.url),'utf8');
 assert.match(lab,/vanillaTamesByMethod\[tamingMethod\]/);
 assert.match(lab,/<option value="knockout">Knockout/);
 assert.match(lab,/<option value="passive">Passive/);
 assert.match(lab,/<option value="specialty">Specialty/);
 assert.match(lab,/reviewCreature=artPreview==='ammonite'\?'Ammonite'/);
 assert.doesNotMatch(lab,/\.\.\.discoveredCreatures/);
 assert.doesNotMatch(app,/discoveredCreatures=\{catalog\.creatures\}/);
 assert.match(passive,/const passiveRoster=vanillaTamesByMethod\.passive/);
 assert.match(special,/const specialtyRoster=vanillaTamesByMethod\.specialty/);
});
