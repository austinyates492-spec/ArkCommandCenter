import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {resourcesForMap,checkAtlasPin} from './atlas-resource-model.js';
import {centerWikiAvailableResources,centerWikiResources,centerWikiSource} from './center-asa-resource-overlay.js';
import {candidateFarmingSites,generateFarmingRoute} from './island-area-route-planner.js';

test('The Center uses authentic locally hosted ASA artwork, but historic reference locations clearly marked unverified',()=>{
 assert.ok(statSync(new URL('../public/maps/the-center-asa.jpg',import.meta.url)).size>100000);
 assert.equal(centerWikiSource.revision,564602);
 assert.equal(centerWikiSource.verifiedASA,false);
 assert.equal(centerWikiResources.length,3815);
 assert.equal(centerWikiSource.omittedOutOfBoundsCount,0);
 assert.equal(centerWikiAvailableResources.length,12);
});
test('Center wiki community GPS markers are bounded and labeled as surface or cave, not sourced ASA',()=>{
 const expected=['Crystal','Crystal (Cave)','Metal','Metal (Cave)','Rich Metal','Rich Metal (Cave)','Obsidian','Obsidian (Cave)','Oil','Oil (Cave)','Silica Pearls','Silica Pearls (Cave)'];
 assert.deepEqual([...centerWikiAvailableResources].sort(),expected.sort());
 const catalog=resourcesForMap('The Center').map(p=>p.id);
 for(const r of expected)assert.ok(catalog.includes(r),r);
 for(const p of centerWikiResources){
  assert.ok(p.lat>=0&&p.lat<=100&&p.lon>=0&&p.lon<=100,p.id);
  assert.match(p.source,/ASA unverified/);
  assert.equal(p.cave,p.category.endsWith(' cave'));
 }
 const pin=checkAtlasPin({resource:'Crystal (Cave)',lat:26.5,lon:55.4},'The Center');
 assert.equal(pin.resource,'Crystal (Cave)');
});
test('Center region route filters include cave GPS nodes inside a polygon without fabricating positions',()=>{
 const polygon=[{lat:8,lon:8},{lat:8,lon:92},{lat:92,lon:92},{lat:92,lon:8}];
 const types=['Metal (Cave)','Crystal','Oil'];
 const eligible=candidateFarmingSites(centerWikiResources,polygon,types);
 assert.ok(eligible.length>50);
 const plan=generateFarmingRoute({points:centerWikiResources,polygon,types,maxStops:12,mode:'balanced'});
 assert.equal(plan.stops.length,12);
 for(const p of plan.stops)assert.ok(eligible.some(n=>n.id===p.id&&n.lat===p.lat&&n.lon===p.lon));
});
test('Center native viewer has honest attribution, source layers and saved routes separate by map',()=>{
 const page=readFileSync(new URL('./ResourcePage.jsx',import.meta.url),'utf8');
 const map=readFileSync(new URL('./IslandNativeMap.jsx',import.meta.url),'utf8');
 assert.ok(page.includes("map==='The Center'?centerWikiResources"));
 assert.ok(page.includes("map==='The Center'?'/maps/the-center-asa.jpg'"));
 assert.ok(page.includes("map==='The Island'||map==='Scorched Earth'||map==='The Center'"));
 assert.ok(page.includes("map==='The Center'?'Authentic") || page.includes("map==='The Center'?'These filters"));
 assert.ok(page.includes("savedPlans.filter(p=>p.map===map).map"));
 assert.ok(page.includes('plannedStops={generated?.stops||[]}'));
 assert.ok(map.includes("resourceSource.verifiedASA===false"));
 assert.ok(map.includes('these are NOT ASA-verified positions'));
});
