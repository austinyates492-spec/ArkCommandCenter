import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSearchIndex,searchWorkspace} from './universal-search-model.js';
const args={creatures:[{name:'Rex',page:'taming'},{name:'Giganotosaurus',page:'taming'}],breeding:['Rex'],recipes:{'Rex Saddle':{station:'Smithy'}},mapResources:{'The Island':['Metal']},now:1000};
test('Rex search has no fictitious active groups',()=>{const g=searchWorkspace(buildSearchIndex(args),'rex');assert.deepEqual(g.map(x=>x.group),['Creatures','Breeding','Recipes']);});
test('only active real timers and positive shared projects are searchable',()=>{const g=searchWorkspace(buildSearchIndex({...args,timers:[{id:1,name:'Rex fully grown',type:'Maturation',end:61000},{id:2,name:'Rex old',end:999}],crafting:[{name:'Rex Saddle',quantity:3},{name:'Tek Rex Saddle',quantity:0}]}),'rex');assert.equal(g[0].results.length,1);assert.equal(g[0].results[0].target.timerId,'1');assert.equal(g[1].results.length,1);assert.equal(g[1].results[0].target.project,'Rex Saddle');});
test('aliases, map resources and saved pins navigate with preselected targets',()=>{const idx=buildSearchIndex({...args,pins:[{id:'a',map:'The Island',title:'Metal camp',resource:'Metal',lat:15,lon:23}]});assert.equal(searchWorkspace(idx,'giga')[0].results[0].target.creature,'Giganotosaurus');assert.equal(searchWorkspace(idx,'metal')[0].results[0].target.pinId,'a');assert.equal(searchWorkspace(idx,'metal').find(g=>g.group==='Resources').results[0].target.resource,'Metal');assert.deepEqual(searchWorkspace(idx,''),[]);});

import {readFileSync} from 'node:fs';
test('search icon cannot shadow native Map constructor during startup',()=>{
 const source=readFileSync(new URL('./UniversalSearch.jsx',import.meta.url),'utf8');
 assert.match(source,/Map as MapIcon/);
 assert.match(source,/Maps:MapIcon/);
 assert.match(source,/new globalThis\.Map\(/);
});
