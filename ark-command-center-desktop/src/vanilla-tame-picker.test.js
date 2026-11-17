import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import asaMethods from './asa-taming-methods.json' with {type:'json'};
import {asaBaseCreatures} from './asa-official-catalog.js';
import {breedingVariants} from './breeding-variants.js';
import {tameCreatures} from './data.js';
import {vanillaTameRoster,vanillaTamesByMethod,vanillaKnockoutRoster,knockoutPickerCreatures} from './vanilla-tame-picker.js';
import {tamingCategory,getTamingMethod} from './special-taming-methods.js';

test('official category rosters exclude mod-only, unavailable, unreleased and untameable creatures',()=>{
 const whitelist=new Set([...asaBaseCreatures,'Ferox']);
 const groups=Object.values(vanillaTamesByMethod);
 assert.ok(vanillaTameRoster.length>100,'Official tame roster unexpectedly empty');
 assert.deepEqual(new Set(groups.flat()),new Set(vanillaTameRoster),'every released tame appears in exactly one method category');
 assert.equal(groups.flat().length,new Set(groups.flat()).size,'no duplicates across method categories');
 for(const name of vanillaTameRoster){
  assert.ok(whitelist.has(breedingVariants[name]||name),name+' is not official ASA content');
  assert.ok(['knockout','passive','specialty'].includes(tamingCategory(name)),name);
  assert.ok(!['unavailable','unreleased','untameable'].includes(getTamingMethod(name)?.status),name);
 }
 for(const name of ['Ammonite','DodoRex','Broodmother Lysrix','Revenant','Not A Vanilla Mod Creature'])
  assert.ok(!vanillaTameRoster.includes(name),name+' is not a normal tame');
});

test('Taming Lab includes every official knockout-tagged tame, even if it uses special knockout mechanics',()=>{
 const whitelist=new Set([...asaBaseCreatures,'Ferox']);
 const expected=tameCreatures.filter(name=>{
  const base=breedingVariants[name]||name;
  const methods=asaMethods[name]?.methods||asaMethods[base]?.methods||[];
  return whitelist.has(base)&&methods.includes('knockout')&&!methods.includes('untameable')&&!['unavailable','unreleased','untameable'].includes(getTamingMethod(name)?.status);
 });
 assert.deepEqual(vanillaKnockoutRoster,expected,'every official knockout should appear in Taming Lab without omissions');
 assert.ok(vanillaKnockoutRoster.length>90,'the complete knockout roster should include official creature variants');
 for(const name of ['Rex','Allosaurus','Acrocanthosaurus','Achatina','Giganotosaurus','Karkinos','Rock Elemental','Titanosaur','Fasolasuchus'])
  assert.ok(vanillaKnockoutRoster.includes(name),name+' must be in Taming Lab');
 for(const name of ['Ovis','Basilisk','Ammonite','Carcharodontosaurus','DodoRex','Not A Vanilla Mod Creature'])
  assert.ok(!vanillaKnockoutRoster.includes(name),name+' is not an eligible knockout');
 assert.ok(vanillaKnockoutRoster.some(name=>name.startsWith('Aberrant ')),'official aberrant knockout forms should remain');
 assert.ok(vanillaKnockoutRoster.some(name=>name.startsWith('X-')),'official X-variant knockout forms should remain');
});

test('Taming Lab is dedicated to knockout tames; passive and specialty remain in their own tabs',()=>{
 const lab=readFileSync(new URL('./TamingLab.jsx',import.meta.url),'utf8');
 const passive=readFileSync(new URL('./PassiveLab.jsx',import.meta.url),'utf8');
 const special=readFileSync(new URL('./SpecialtyLab.jsx',import.meta.url),'utf8');
 const app=readFileSync(new URL('./main.jsx',import.meta.url),'utf8');
 assert.match(lab,/vanillaKnockoutRoster/);
 assert.match(lab,/Search all knockout creatures and variants/);
 assert.match(lab,/matchingCreatures\.map/);
 assert.doesNotMatch(lab,/Taming type|changeTamingMethod|vanillaTamesByMethod\[tamingMethod\]/);
 assert.doesNotMatch(lab,/\.\.\.discoveredCreatures/);
 assert.match(lab,/artPreview==='ammonite'\?'Ammonite'/);
 assert.match(lab,/isKnockout\?calculateTame/);
 assert.match(lab,/isKnockout\?knockoutEstimate/);
 assert.doesNotMatch(app,/discoveredCreatures=\{catalog\.creatures\}/);
 assert.match(passive,/const passiveRoster=vanillaTamesByMethod\.passive/);
 assert.match(special,/const specialtyRoster=vanillaTamesByMethod\.specialty/);
});

test('all artwork preview routes preserve the entire knockout picker, with only review exceptions added',()=>{
 const normal=knockoutPickerCreatures();
 assert.deepEqual(normal,vanillaKnockoutRoster);
 for(const creature of ['Anglerfish','Ankylosaurus','Ammonite','Amargasaurus']){
  const preview=knockoutPickerCreatures(creature);
  assert.ok(preview.includes(creature),creature+' must remain available for review');
  for(const knockout of vanillaKnockoutRoster)assert.ok(preview.includes(knockout),creature+' preview hid '+knockout);
  assert.equal(preview.length,vanillaKnockoutRoster.length+(vanillaKnockoutRoster.includes(creature)?0:1),'review must not add duplicates or drop knockouts');
  assert.ok(preview.length>90,'art review must never switch dropdown to single-species mode');
 }
 assert.ok(knockoutPickerCreatures('Anglerfish').includes('Rex'));
 assert.ok(knockoutPickerCreatures('Anglerfish').includes('Karkinos'));
});

test('Taming Lab uses the full knockout roster in preview and normal modes, never a review-only array',()=>{
 const lab=readFileSync(new URL('./TamingLab.jsx',import.meta.url),'utf8');
 const app=readFileSync(new URL('./main.jsx',import.meta.url),'utf8');
 assert.match(lab,/knockoutPickerCreatures\(reviewCreature\)\.filter/);
 assert.doesNotMatch(lab,/reviewCreature\?\[reviewCreature\]:vanillaKnockoutRoster/);
 assert.match(lab,/matchingCreatures\.map/);
 assert.match(app,/reviewAnglerArtwork\?'Anglerfish'/);
 assert.match(app,/reviewAmmoniteArtwork\?'Ammonite'/);
});
