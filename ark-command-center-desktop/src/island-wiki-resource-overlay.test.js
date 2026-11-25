import test from 'node:test';
import assert from 'node:assert/strict';
import {islandWikiResources,islandWikiSource,islandWikiAvailableResources,visibleWikiSites} from './island-wiki-resource-overlay.js';

test('imported Island ASA resource points retain exact source lineage and bounded GPS',()=>{
 assert.equal(islandWikiSource.revision,548223);
 assert.match(islandWikiSource.url,/Data:Maps\/Resources\/The_Island\/ASA/);
 assert.equal(islandWikiResources.length,2797);
 assert.equal(islandWikiSource.omittedOutOfBoundsCount,25);
 assert.deepEqual(islandWikiAvailableResources.sort(),['Metal','Rich Metal','Crystal','Obsidian','Oil','Silica Pearls'].sort());
 for(const p of islandWikiResources){
  assert.ok(Number.isFinite(p.lat)&&p.lat>=0&&p.lat<=100);
  assert.ok(Number.isFinite(p.lon)&&p.lon>=0&&p.lon<=100);
  assert.equal(p.source,'ARK Official Community Wiki');
 }
});
test('zoomed-out grouping retains every wiki location in its own category',()=>{
 const every=islandWikiAvailableResources;
 for(const zoom of [1,2,3,4]){
  const displayed=visibleWikiSites(islandWikiResources,every,zoom);
  assert.equal(displayed.reduce((total,p)=>total+p.count,0),islandWikiResources.length);
 }
 assert.ok(visibleWikiSites(islandWikiResources,['Oil'],1).every(p=>p.resource==='Oil'));
 assert.equal(visibleWikiSites(islandWikiResources,[],1).length,0);
});
