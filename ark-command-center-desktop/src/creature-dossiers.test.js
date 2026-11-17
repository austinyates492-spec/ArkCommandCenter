import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {individualOutlines} from './individual-outline-data.js';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tameCreatures} from './data.js';
import {asaBaseCreatures} from './asa-official-catalog.js';
import {breedingVariants} from './breeding-variants.js';
import {creatureArtProfile,knownAnatomyNames} from './creature-art-profile.js';
import {tamingCategory} from './special-taming-methods.js';

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
 assert.match(app,/\['taming','Taming Lab',Calculator\]/);
 assert.doesNotMatch(app,/\['dossiers','Creature Dossiers',BookOpen\]/);
 assert.doesNotMatch(app,/page==='dossiers'&&<CreatureDossiers/);
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
  assert.ok(spec.group&&spec.traceA>0&&spec.traceB>0,name+' missing outline geometry');
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
 assert.match(src,/dedicated detailed illustration is still pending review/);
 assert.match(src,/hasDetailedOutline/);
 assert.match(src,/detailedOutlineNames.length\+1/);
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
 assert.match(art,/viewBox="0 0 850 470"/);
 assert.match(art,/cad-outer/);
 assert.match(art,/role="img"/);
});

test('nine wave-one knockout species have distinct, detailed, decodable individual SVG artwork',()=>{
 const completed=['Raptor','Carnotaurus','Allosaurus','Baryonyx','Sabertooth','Direwolf','Terror Bird','Dilophosaur','Compy'];
 assert.deepEqual(Object.keys(individualOutlines).sort(),completed.slice().sort());
 const hashes=new Set();
 for(const species of completed){
  assert.equal(tamingCategory(species),'knockout',species+' should belong to phase one');
  const svg=gunzipSync(Buffer.from(individualOutlines[species],'base64')).toString('utf8');
  assert.match(svg,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(svg,/fill-rule="evenodd"/);
  assert.ok(svg.length>4500,species+' individual art is unusually sparse');
  const hash=createHash('sha256').update(svg).digest('hex');
  assert.ok(!hashes.has(hash),species+' shares the same artwork');
  hashes.add(hash);
 }
 const ui=source('IndividualCreatureLineArt.jsx'),art=source('CreatureLineArt.jsx');
 assert.match(ui,/DecompressionStream\('gzip'\)/);
 assert.match(ui,/WebkitMaskImage/);
 assert.match(art,/hasDetailedOutline\(props\.creature\)/);
 assert.match(source('creature-dossiers.css'),/\.cad-detailed-outline/);
});

test('rollout checklist covers all 214 base entries and 64 variants without claiming fake custom art',()=>{
 const roadmap=readFileSync(join(folder,'../../CREATURE_DOSSIER_ROLLOUT.md'),'utf8').replace(/\r\n/g,'\n');
 for(const species of asaBaseCreatures)assert.ok(roadmap.includes('] '+species+'\n')||roadmap.includes('] '+species+' —'),species+' missing from checklist');
 for(const name of Object.keys(breedingVariants))assert.ok(roadmap.includes('] '+name+' (base: '),name+' variant missing from checklist');
 assert.match(roadmap,/Phase 1 - Knockout/);
 assert.match(roadmap,/Phase 2 - Passive/);
 assert.match(roadmap,/Phase 3 - Specialty/);
 assert.match(roadmap,/Phase 4A - Variants/);
 assert.match(roadmap,/Phase 4B - Untameable/);
 assert.match(roadmap,/unique artwork integrated; visual approval pending/);
});

test('restored Taming Lab keeps visible search and original calculator for Rex and all knockouts',()=>{
 const lab=source('TamingLab.jsx');
 assert.match(lab,/Search official creature names/);
 assert.match(lab,/matchingCreatures\.map/);
 assert.match(lab,/vanillaTamesByMethod\[tamingMethod\]/);
 assert.match(lab,/category==='knockout'/);
 assert.match(lab,/onNavigate/);
 assert.match(lab,/onChange=\{e=>setCreature\(e\.target\.value\)\}/);
 assert.match(lab,/calculateTame\(/);
 assert.match(lab,/knockoutEstimate\(/);
 assert.match(lab,/Start Timer/);
 assert.match(lab,/CreatureLineArt creature=\{creature\}/);
 assert.match(lab,/RexArtwork/);
 assert.doesNotMatch(lab,/if\(creature==='Rex'&&showRexDossier\)return/);
 assert.doesNotMatch(lab,/onOpenDossier/);
 const css=source('taming-lab-art.css');
 assert.match(css,/\.taming-art-stage/);
 assert.match(css,/\.cad-detailed-outline/);
 assert.match(css,/@media\(max-width:480px\)/);
});

test('Taming Lab combines a smaller creature image, dropdown and plan on the left, knockout alongside',()=>{
 const lab=source('TamingLab.jsx'),css=source('taming-lab-art.css');
 assert.match(lab,/className="taming-workspace"/);
 assert.match(lab,/className="panel taming-combined-panel"/);
 assert.match(lab,/className="taming-picker-bar"/);
 assert.ok(lab.indexOf('Loadout & Sources')<lab.indexOf('Taming type'),'Creature selection stays in Loadout & Sources');
 assert.ok(lab.indexOf('Taming type')<lab.indexOf('Plan a Tame'),'Search precedes the plan');
 assert.ok(lab.indexOf('Plan a Tame')<lab.indexOf('Knockout Planner'),'The knockout panel appears alongside the combined loadout');
 assert.match(css,/\.taming-workspace\{display:grid;grid-template-columns/);
 assert.match(css,/\.taming-workspace \.taming-art-stage\{height:258px/);
 assert.match(css,/@media\(max-width:600px\)/);
 assert.match(lab,/Search official creature names/);
 assert.match(lab,/knockoutEstimate\(/);
 assert.match(lab,/taming-ammo-row/);
 assert.match(lab,/Plan Notes/);
 assert.match(lab,/Calculation assumptions/);
 assert.match(lab,/matchin[gG]Creatures\.map/);
});
test('knockout estimates retain exact model fields without inventing ammo counts',()=>{
 const lab=source('TamingLab.jsx');
 assert.match(lab,/knockout\.rows\.map/);
 assert.match(lab,/item\.body/);
 assert.match(lab,/item\.head===null/);
 assert.match(lab,/knockout\.totalTorpor/);
 assert.match(lab,/weaponQuality/);
 assert.match(lab,/longneckBuffPercent/);
 assert.match(lab,/targetTorpor/);
 assert.match(lab,/isKnockout&&!special&&<section className="panel knockout-panel/);
 assert.doesNotMatch(lab,/page==='dossiers'/);
});

test('v0.8.31 gives the artwork the wider internal column and shrinks the creature picker',()=>{
 const css=source('taming-lab-art.css');
 assert.match(css,/\.taming-workspace \.taming-combined-panel \.taming-plan-layout\{\s*grid-template-columns:minmax\(0,1\.7fr\) minmax\(0,\.9fr\)/);
 assert.match(css,/\.taming-workspace \.taming-combined-panel \.taming-picker-bar\{\s*grid-template-columns:minmax\(0,\.76fr\) minmax\(0,1fr\) minmax\(0,1\.12fr\)/);
 assert.match(css,/\.taming-workspace \.taming-combined-panel \.taming-art-stage\{\s*width:100%;\s*height:auto;\s*aspect-ratio:1\.82 \/ 1/);
 assert.match(css,/\.taming-workspace \.taming-combined-panel \.taming-art-stage \.cad-illustration\{\s*width:100%;\s*height:100%/);
 assert.match(css,/\.taming-workspace \.taming-combined-panel \.taming-art-stage \.rex-outline-frame\{\s*inset:0;\s*width:100%;\s*height:100%/);
 assert.match(css,/@media \(max-width:600px\)/);
 const lab=source('TamingLab.jsx');
 assert.match(lab,/className="taming-picker-bar"/);
 assert.match(lab,/Creature \(\{matchingCreatures\.length\} matches\)/);
 assert.match(lab,/taming-plan-content/);
});
test('v0.8.31 knockout console shares the Loadout top edge instead of inheriting the old offset',()=>{
 const css=source('taming-lab-art.css');
 const global=source('style.css');
 assert.match(global,/\.knockout-panel\{margin-top:20px\}/);
 assert.match(css,/\.taming-workspace>\.knockout-panel\{\s*margin-top:0;\s*align-self:stretch/);
 assert.match(css,/@media \(min-width:1191px\) and \(max-width:1320px\)/);
 assert.match(css,/@media \(max-width:1190px\)/);
 const lab=source('TamingLab.jsx');
 assert.match(lab,/className="panel taming-combined-panel"/);
 assert.match(lab,/className="panel knockout-panel taming-knockout-card"/);
});
