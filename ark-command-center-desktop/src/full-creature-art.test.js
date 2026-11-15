import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tameCreatures} from './data.js';
import {asaBaseCreatures} from './asa-official-catalog.js';
import {breedingVariants} from './breeding-variants.js';
import {creatureArtProfile} from './creature-art-profile.js';
import {creatureDetailStudy,technicalArtFamilies} from './creature-detail-studies.js';
import {tamingCategory} from './special-taming-methods.js';
import {individualOutlines} from './individual-outline-data.js';
const dir=dirname(fileURLToPath(import.meta.url));
const read=n=>readFileSync(join(dir,n),'utf8');
test('every ASA creature has original locally computed theme-aware anatomical lines',()=>{
 assert.equal(asaBaseCreatures.length,214);
 assert.equal(Object.keys(breedingVariants).length,64);
 assert.ok(tameCreatures.length>=278);
 assert.ok(technicalArtFamilies.length>=27);
 const signatures=new Set();
 for(const name of tameCreatures){
  const spec=creatureArtProfile(name);
  const paths=creatureDetailStudy(name);
  assert.ok(paths.length>=19,name+' has too few species lines');
  assert.ok(paths.every(x=>typeof x==='string'&&x.startsWith('M')),name+' has invalid line segments');
  assert.ok(['knockout','passive','specialty','untameable'].includes(tamingCategory(name)),name+' has unknown category');
  const signature=spec.group+'::'+paths.join('|');
  assert.ok(!signatures.has(signature),name+' has an identical study');
  signatures.add(signature);
 }
});
test('curated first nine traced artworks and Rex remain unchanged',()=>{
 const approved=['Raptor','Carnotaurus','Allosaurus','Baryonyx','Sabertooth','Direwolf','Terror Bird','Dilophosaur','Compy'];
 assert.deepEqual(Object.keys(individualOutlines).sort(),approved.sort());
 const art=read('CreatureLineArt.jsx');
 assert.match(art,/hasDetailedOutline\(props\.creature\)/);
 assert.match(read('TamingLab.jsx'),/RexArtwork/);
});
test('all-creature search retains category-safe calculators and opens correct separate planners',()=>{
 const lab=read('TamingLab.jsx'),app=read('main.jsx');
 assert.match(lab,/tameCreatures,\.\.\.discoveredCreatures/);
 assert.match(lab,/isKnockout\?calculateTame/);
 assert.match(lab,/isKnockout\?knockoutEstimate/);
 assert.match(lab,/isKnockout&&!special&&<section className="panel knockout-panel taming-knockout-card"/);
 assert.match(lab,/onNavigate\?\.\(category==='passive'\?'passive':'specialty',creature\)/);
 assert.match(app,/openCreaturePlanner/);
 assert.match(app,/selectedCreature=\{crossLabCreature\}/);
 assert.doesNotMatch(app,/page==='dossiers'/);
 for(const file of ['PassiveLab.jsx','SpecialtyLab.jsx']){
  const src=read(file);
  assert.match(src,/CreatureLineArt creature=\{creature\}/);
  assert.match(src,/selectedCreature/);
  assert.doesNotMatch(src,/onOpenDossier/);
 }
});
