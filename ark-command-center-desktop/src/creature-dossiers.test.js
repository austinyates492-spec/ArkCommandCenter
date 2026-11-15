import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {readFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tameCreatures} from './data.js';
import {asaBaseCreatures} from './asa-official-catalog.js';
import {breedingVariants} from './breeding-variants.js';
import {creatureArtProfile,knownAnatomyNames} from './creature-art-profile.js';
import {tamingCategory} from './special-taming-methods.js';
import CreatureLineArt from './CreatureLineArt.jsx';

const folder=dirname(fileURLToPath(import.meta.url));
const source=file=>readFileSync(join(folder,file),'utf8');

test('every official ASA baseline creature and variant is present in the dossier roster',()=>{
 assert.equal(asaBaseCreatures.length,214);
 assert.ok(tameCreatures.length>=asaBaseCreatures.length);
 for(const name of asaBaseCreatures)assert.ok(tameCreatures.includes(name),name+' missing from dossier catalog');
 for(const name of Object.keys(breedingVariants))if(tameCreatures.includes(name)){
  assert.ok(breedingVariants[name],name+' missing base species');
 }
 const app=source('main.jsx');
 assert.match(app,/\['dossiers','Creature Dossiers',BookOpen\]/);
 assert.match(app,/page==='dossiers'&&<CreatureDossiers/);
});

test('every base species receives a recognized anatomy family, not an unclassified placeholder',()=>{
 for(const name of asaBaseCreatures){
  assert.ok(knownAnatomyNames.has(name),name+' has no mapped body plan');
  const a=creatureArtProfile(name);
  assert.ok(a.group&&a.group!=='unknown',name+' missing category');
  assert.ok(Number.isInteger(a.seed),name+' missing unique art trace');
 }
});

test('technical outline renderer produces distinct valid vectors for each catalog species',()=>{
 const seen=new Set();
 const families=new Set();
 for(const name of tameCreatures){
  const spec=creatureArtProfile(name);
  const markup=renderToStaticMarkup(React.createElement(CreatureLineArt,{creature:name}));
  assert.match(markup,/<svg /,name+' missing vector');
  assert.match(markup,/viewBox="0 0 850 470"/,name+' wrong canvas');
  assert.match(markup,/cad-outer/,name+' missing outer contour');
  assert.match(markup,/role="img"/,name+' missing accessible name');
  assert.ok(!seen.has(spec.seed),name+' lacks an individual trace');
  seen.add(spec.seed);
  families.add(spec.group);
 }
 assert.ok(families.size>=20,'Expected distinct body plan families');
});

test('every taming category has the right mechanical data flow in the dossier',()=>{
 const src=source('CreatureDossiers.jsx');
 assert.match(src,/category==='knockout'\?calculateTame/);
 assert.match(src,/category==='passive'\?passiveFoodPlan/);
 assert.match(src,/category==='specialty'\?specialtyFeeding/);
 assert.match(src,/category==='specialty'&&heavyOptions.length/);
 assert.match(src,/category==='untameable'\?/);
 assert.match(src,/category!=='untameable'/);
 assert.match(src,/not a precise model of every ASA creature/);
 assert.match(src,/tameCreatures\.filter/);
 assert.match(src,/cad-favorite-btn/);
 assert.match(src,/RexDossier/);
 for(const category of ['knockout','passive','specialty','untameable'])
  assert.ok(tameCreatures.some(name=>tamingCategory(name)===category),'Category '+category+' not represented');
});

test('creature dossier visuals are theme-aware and responsive on mobile',()=>{
 const css=source('creature-dossiers.css');
 assert.match(css,/--cad-accent:var\(--ark-accent/);
 assert.match(css,/@media\(max-width:760px\)/);
 assert.match(css,/@media\(max-width:440px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 const art=source('CreatureLineArt.jsx');
 assert.match(art,/stroke="currentColor"/);
 assert.match(art,/creatureArtProfile/);
});
