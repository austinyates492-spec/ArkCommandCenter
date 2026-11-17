import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {vanillaKnockoutRoster,vanillaTamesByMethod} from './vanilla-tame-picker.js';

const source=name=>readFileSync(new URL('./'+name,import.meta.url),'utf8');

test('passive and specialty pages use the same searchable artwork-first workspace as knockout',()=>{
 const knockout=source('TamingLab.jsx');
 const css=source('taming-lab-art.css');
 for(const name of ['PassiveLab.jsx','SpecialtyLab.jsx']){
  const lab=source(name);
  for(const cls of ['pagetitle taming-compact-title','taming-workspace','panel taming-combined-panel','taming-picker-bar','taming-plan-layout','taming-visual-column','taming-art-stage','taming-plan-content','taming-compact-fields','taming-plan-notes','taming-compact-links','panel taming-sibling-panel','taming-ko-headline','taming-start-btn']){
   assert.ok(lab.includes(cls),name+' missing shared layout '+cls);
   assert.ok(knockout.includes(cls)||cls.includes('sibling'),name+' diverges from knockout markup for '+cls);
  }
  assert.ok(lab.indexOf('taming-picker-bar')<lab.indexOf('taming-art-stage'),name+' places selection after artwork');
  assert.ok(lab.indexOf('taming-art-stage')<lab.indexOf('taming-sibling-panel'),name+' puts planner before artwork');
  assert.ok(lab.includes('<CreatureLineArt creature={creature}'),name+' lost creature artwork');
  assert.ok(lab.includes('<TameSpawnAtlas creature={creature} map={map}/>'),name+' lost spawn map');
  assert.ok(lab.includes('matches.map(name=>'),name+' lost full searchable dropdown');
  assert.match(lab,/useMemo\(\(\)=>\w+Roster\.filter\(/);
 }
 assert.match(css,/\.taming-workspace \.taming-sibling-panel/);
 assert.match(css,/@media\(max-width:600px\)/);
});

test('passive feeding models and observed duration logic stay attached to the new layout',()=>{
 const s=source('PassiveLab.jsx');
 assert.match(s,/const passiveRoster=vanillaTamesByMethod\.passive/);
 assert.match(s,/passiveFoodPlan\(\{creature,level,food:selectedFood,tamingRate:rates\.taming,foodDrainRate:rates\.food\}\)/);
 assert.match(s,/const duration=plan\.ok&&plan\.seconds>0\?plan\.seconds\/60:Number\(minutes\)/);
 assert.match(s,/disabled=\{!canTimer\}/);
 assert.match(s,/onTimer\(creature\+' passive Lv '\+level/);
 assert.match(s,/previewArthropluera=\{artPreview==='arthropluera'\}/);
 assert.ok(vanillaTamesByMethod.passive.includes('Arthropluera'));
 assert.ok(!vanillaKnockoutRoster.includes('Arthropluera'));
});

test('specialty ammo, food, fixed supply, observations and timers survive the layout change',()=>{
 const s=source('SpecialtyLab.jsx');
 assert.match(s,/const specialtyRoster=vanillaTamesByMethod\.specialty/);
 assert.match(s,/estimateSpecialtyKnockout\(\{creature,level,ammo:activeAmmo\}\)/);
 assert.match(s,/specialtyFeeding\(\{creature,level,food:activeFood,tamingRate:rates\.taming,foodDrainRate:rates\.food\}\)/);
 assert.match(s,/specialtyFixedSupply\(creature\)/);
 assert.match(s,/setManualCount\(/);
 assert.match(s,/setMinutes\(/);
 assert.match(s,/disabled=\{!canTimer\}/);
 assert.match(s,/onTimer\(creature\+' Lv '\+level/);
 assert.match(s,/previewAstrocetus=\{artPreview==='astrocetus'\}/);
 assert.ok(vanillaTamesByMethod.specialty.includes('Astrocetus'));
 assert.ok(!vanillaKnockoutRoster.includes('Astrocetus'));
 assert.ok(vanillaKnockoutRoster.includes('Rex'),'knockout roster must remain intact');
});
