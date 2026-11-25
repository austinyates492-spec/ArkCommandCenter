import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=name=>readFileSync(new URL('./'+name,import.meta.url),'utf8');

test('sidebar presents exactly one Taming Lab destination',()=>{
 const main=src('main.jsx');
 const nav=main.match(/const nav=(\[[^\n]+\]);/)?.[1]||'';
 assert.match(nav,/\['taming','Taming Lab',Calculator\]/);
 assert.doesNotMatch(nav,/\['specialty','Specialty Taming Lab'/);
 assert.doesNotMatch(nav,/\['passive','Passive Taming Lab'/);
 assert.match(main,/key==='taming'\?isTamingPage\(page\):page===key/);
 assert.match(main,/setPage\(key==='taming'\?lastTamingMode:key\)/);
 assert.match(main,/const pageName=isTamingPage\(page\)\?'Taming Lab'/);
});

test('all three methods are reachable from the same top tab bar with accessible controls',()=>{
 const main=src('main.jsx');
 assert.match(main,/const tamingModes=\[\['taming','Knockout Tames',Crosshair\],\['passive','Passive Tames',Hand\],\['specialty','Specialty Taming',Wrench\]\]/);
 assert.match(main,/isTamingPage\(page\)&&<section className="taming-hub"/);
 assert.match(main,/<nav className="taming-mode-tabs" role="tablist"/);
 assert.match(main,/role="tab" id=\{'taming-mode-tab-'\+key\}/);
 assert.match(main,/aria-selected=\{page===key\}/);
 assert.match(main,/tabIndex=\{page===key\?0:-1\}/);
 assert.match(main,/onClick=\{\(\)=>setPage\(key\)\}/);
 assert.match(main,/ArrowLeft','ArrowRight','Home','End/);
 assert.match(main,/role="tabpanel" aria-labelledby=\{'taming-mode-tab-'\+page\}/);
 assert.match(main,/<\/div><\/section>\}/);
});

test('existing knockout, passive, and specialty calculators render under the top tabs unchanged',()=>{
 const main=src('main.jsx');
 assert.match(main,/page==='taming'&&<TamingLab rates=\{rates\}/);
 assert.match(main,/page==='passive'&&<PassiveLab rates=\{rates\}/);
 assert.match(main,/page==='specialty'&&<SpecialtyLab rates=\{rates\}/);
 assert.match(main,/const openCreaturePlanner=\(targetPage,creature\)=>\{setCrossLabCreature\(creature\);setPage\(targetPage\)\}/);
 for(const review of ['Baryonyx','Arthropluera','Astrocetus','Aureliax','Basilisk']){
   assert.match(main,new RegExp('review'+review+'Artwork=artworkPreview==='));
 }
 assert.match(src('TamingLab.jsx'),/knockoutPickerCreatures\(reviewCreature\)/);
 assert.match(src('PassiveLab.jsx'),/passiveFoodPlan\(/);
 assert.match(src('SpecialtyLab.jsx'),/estimateSpecialtyKnockout\(/);
});

test('top selector styling is theme-aware and usable on small screens',()=>{
 const css=src('taming-lab-art.css');
 assert.match(css,/\.taming-mode-tabs\{display:grid;grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
 assert.match(css,/\.taming-mode-tab\.active\{/);
 assert.match(css,/--ark-accent/);
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css,/\.taming-mode-tab:focus-visible/);
});

test('spawn atlas is only exposed within creature taming pages',()=>{
 const main=src('main.jsx');
 assert.doesNotMatch(main,/Spawn Maps|SpawnPage|page==='maps'/);
 for(const name of ['TamingLab.jsx','PassiveLab.jsx','SpecialtyLab.jsx']){
  assert.match(src(name),/<TameSpawnAtlas creature=\{creature\} map=\{map\}\/>/);
 }
 assert.match(main,/\['resources','Resource Atlas',Layers\]/);
});
