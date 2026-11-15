import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {knockoutRoster,tamingCategory} from './special-taming-methods.js';
import {breedingVariants} from './breeding-variants.js';
import {knockoutSketchTraits} from './knockout-sketch-details.js';

const folder=dirname(fileURLToPath(import.meta.url));
const spec=readFileSync(join(folder,'../../KNOCKOUT_UNIQUE_SILHOUETTE_SPECS.md'),'utf8').replace(/\r\n/g,'\n');
const roadmap=readFileSync(join(folder,'../../CREATURE_DOSSIER_ROLLOUT.md'),'utf8').replace(/\r\n/g,'\n');
const rows=[...spec.matchAll(/^- \[([x ])\] \*\*(.+?)\*\* — \*\*OUTER:\*\*/gm)].map(x=>({checked:x[1]==='x',name:x[2],line:spec.slice(x.index,spec.indexOf('\n',x.index))}));
const roadmapKnockout=roadmap.split('## Phase 1 - Knockout species')[1].split('## Phase 2 - Passive creatures')[0];
const sourceNames=[...roadmapKnockout.matchAll(/^- \[[x ]\] ([^—\n]+)/gm)].map(x=>x[1].trim());

test('every historical Phase 1 creature has a precise species-specific silhouette design brief',()=>{
 assert.equal(sourceNames.length,84,'Historical knockout artwork inventory changed: review additions/removals');
 assert.equal(rows.length,sourceNames.length,'Each species needs a silhouette requirements row');
 assert.deepEqual(rows.map(x=>x.name).sort(),sourceNames.slice().sort());
 for(const row of rows){
  assert.ok(row.line.includes('**LINES:**'),row.name+' lacks internal anatomy requirements');
  assert.ok(row.line.includes('**NOT A CLONE:**'),row.name+' lacks anti-template acceptance criterion');
  assert.ok(row.line.length>=185,row.name+' has insufficient anatomical detail');
 }
});

test('all currently classified standard knockout tames and variants have a base-species brief',()=>{
 const documented=new Set(rows.map(x=>x.name));
 assert.ok(knockoutRoster.length>=84,'Unexpected knockout roster shrinkage');
 for(const creature of knockoutRoster){
  const base=breedingVariants[creature]||creature;
  assert.ok(documented.has(base),creature+' knockout has no required unique base silhouette');
  assert.equal(tamingCategory(creature),'knockout');
 }
});

test('do not mark adaptive procedural studies as bespoke completed artwork',()=>{
 const integrated=new Set(['Rex','Raptor','Carnotaurus','Allosaurus','Baryonyx','Sabertooth','Direwolf','Terror Bird','Dilophosaur','Compy']);
 const checked=rows.filter(x=>x.checked).map(x=>x.name).sort();
 assert.deepEqual(checked,[...integrated].sort(),'Only separately traced species may be marked done');
 assert.equal(rows.filter(x=>!x.checked).length,74);
 assert.match(spec,/does not count as a new variant illustration/);
 assert.match(spec,/silhouette path/);
});

test('historically mislabeled special encounters are explicitly flagged in the brief',()=>{
 assert.match(spec,/Fasolasuchus.*explosive/);
 assert.match(spec,/Shastasaurus.*special passive/);
 assert.match(spec,/must not.*standard tranquilizer calculations/i);
});
