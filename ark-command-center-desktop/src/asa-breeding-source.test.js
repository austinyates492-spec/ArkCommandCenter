import test from 'node:test';
import assert from 'node:assert/strict';
import {species,defaults,durationText} from './data.js';
import source from './asa-breeding-source.json' with {type:'json'};
import {breedingRoster} from './breeding-roster.js';
import {breedingVariants} from './breeding-variants.js';
import {tranqs,knockoutEstimate} from './knockout-engine.js';

const aliases={Direbear:'Dire Bear',Sarcosuchus:'Sarco'};

test('all current 156 DinoIndex ASA base species and 64 variants are included',()=>{
 const references=Object.values(source.creatures);
 assert.equal(references.length,156);
 assert.equal(Object.keys(breedingRoster).length,156);
 assert.equal(Object.keys(breedingVariants).length,64);
 assert.equal(references.reduce((acc,item)=>acc+item.variants.length,0),64);
 const sourceVariants=references.flatMap(item=>item.variants).sort();
 assert.deepEqual(Object.keys(breedingVariants).sort(),sourceVariants);
 assert.equal(Object.keys(species).length,220);
 assert.ok(species.Yutyrannus);
 assert.equal(species['X-Yutyrannus'].variantOf,'Yutyrannus');
});

test('every displayed breeding baseline exactly matches source timings and ranges',()=>{
 for(const name of Object.keys(breedingRoster)){
  const item=source.creatures[aliases[name]||name];
  assert.ok(item,`Missing source for ${name}`);
  const profile=species[name];
  assert.equal(profile.mature,item.matureSeconds/3600,name);
  assert.equal(profile.method,item.method,name);
  assert.equal(profile[item.method==='Egg'?'hatch':'gestation'],item.preSeconds/3600,name);
  assert.equal(profile.cooldownMin,item.cooldownMinSeconds/3600,name);
  assert.equal(profile.cooldownMax,item.cooldownMaxSeconds/3600,name);
  assert.ok(profile.cooldownMax>=profile.cooldownMin,name);
  assert.ok(profile.sourceReview);
 }
 for(const [variant,base] of Object.entries(breedingVariants)){
  assert.equal(species[variant].mature,species[base].mature,variant);
  assert.equal(species[variant].cooldownMin,species[base].cooldownMin,variant);
 }
});

test('NomadARK Rex uses source-exact 25x hatching, 8x growth and 0.2x cooldown',()=>{
 const rex=species.Rex;
 assert.equal(rex.hatch,17998.5601/3600);
 assert.equal(rex.mature,333333.333/3600);
 assert.equal(defaults.hatch,25);
 assert.equal(defaults.mature,8);
 assert.equal(defaults.breeding,0.2);
 assert.equal(durationText(rex.hatch*3600/25),'12m 0s');
 assert.equal(durationText(rex.mature*3600/8),'11h 34m 27s');
 assert.equal(durationText(rex.cooldownMin*3600*0.2),'3h 36m 0s');
 assert.equal(durationText(rex.cooldownMax*3600*0.2),'9h 36m 0s');
});

// Independent published vanilla comparisons: ARK Official Community Wiki's
// Table of Gestation Breeding and Tranquilizer Comparison Table. The wiki
// rounds displayed times to minutes; source precision must be within 60s.
test('breeding times match independently published ARK gestation examples',()=>{
 const examples=[
  ['Achatina',7*3600+56*60,3*86400+20*3600+35*60],
  ['Bulbdog',4*3600+10*60,2*86400+43*60],
  ['Direbear',3*3600+58*60,1*86400+22*3600+17*60],
  ['Direwolf',4*3600+10*60,2*86400+43*60],
  ['Ovis',4*3600+10*60,2*86400+43*60],
  ['Gacha',7*3600+56*60,4*86400+19*3600+44*60]
 ];
 for(const [name,birth,maturation] of examples){
  assert.ok(Math.abs(species[name].gestation*3600-birth)<60,`${name} pregnancy`);
  assert.ok(Math.abs(species[name].mature*3600-maturation)<60,`${name} mature`);
 }
});

test('normal tranq ammo has wiki-published vanilla torpor, then NomadARK Longneck modifier',()=>{
 assert.deepEqual(Object.fromEntries(tranqs.map(item=>[item.id,item.torpor])),{
  bow:90,crossbow:157.5,compound:121.5,dart:221,shocking:442
 });
 const baseline=knockoutEstimate({creature:'Rex',level:150,longneckBuffPercent:100});
 const nomad=knockoutEstimate({creature:'Rex',level:150,longneckBuffPercent:300});
 assert.equal(nomad.rows.find(row=>row.id==='dart').body,Math.ceil(15407/(221*3)));
 assert.equal(nomad.rows.find(row=>row.id==='shocking').body,Math.ceil(15407/(442*3)));
 assert.equal(nomad.rows.find(row=>row.id==='crossbow').body,baseline.rows.find(row=>row.id==='crossbow').body);
});
