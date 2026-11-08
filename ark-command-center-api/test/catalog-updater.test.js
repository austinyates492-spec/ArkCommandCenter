import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeRecipeRows,normalizeCreatures,normalizeRecipeCandidates,creatureYearCategories} from '../src/live-catalog.js';
import {versionCompare,trustedWorkflowClaims} from '../src/updater.js';

test('new wiki craftables become unverified calculations and reject invalid data',()=>{
 const recipes=normalizeRecipeRows([{title:{Page:'Practical Widget',ingredient1:'Wood',quantity1:'4',craftedIn:'Smithy'}},{title:{Page:'Invalid',ingredient1:'Stone',quantity1:'-1'}},{title:{Page:'Mod: Fake',ingredient1:'Wood',quantity1:'2'}}]);
 assert.equal(Object.keys(recipes).length,1);
 assert.equal(recipes['Practical Widget'].ingredients.Wood,4);
 assert.equal(recipes['Practical Widget'].verification,'wiki-asa-unconfirmed');
});
test('new creature discovery never interprets pages as verified mechanics',()=>{
 assert.deepEqual(normalizeCreatures([{title:'Bloodstalker'},{title:'New Creature'},{title:'Mod: Fake'},{title:'New Creature'}]),['Bloodstalker','New Creature']);
 assert.deepEqual(creatureYearCategories(2026),['Category:Creatures released in 2025','Category:Creatures released in 2026','Category:Creatures released in 2027']);
 assert.equal(creatureYearCategories(2029).at(-1),'Category:Creatures released in 2030');
});
test('wiki crafting page discoveries stay names only when ingredient data is unavailable',()=>{
 assert.deepEqual(normalizeRecipeCandidates([{title:'New Tek Device'},{title:'Mod: Fake Recipe'},{title:'New Tek Device'}]),['New Tek Device']);
});
test('updater uses strict semantic version ordering',()=>{
 assert.equal(versionCompare('0.8.5','0.8.4'),1);
 assert.equal(versionCompare('0.9.0','0.8.99'),1);
 assert.equal(versionCompare('0.8.4','0.8.4'),0);
 assert.equal(versionCompare('0.8.3','0.8.4'),-1);
 assert.equal(versionCompare('v0.8.4','0.8.3'),1);
 assert.equal(versionCompare('latest','0.8.4'),null);
});
test('only main-branch repository workflow can obtain release signing capability',()=>{
 const now=Math.floor(Date.now()/1000);
 const valid={iss:'https://token.actions.githubusercontent.com',aud:'ark-command-center-updates',repository:'austinyates492-spec/ArkCommandCenter',ref:'refs/heads/main',sub:'repo:austinyates492-spec@353126816/ArkCommandCenter@1447716209:ref:refs/heads/main',workflow_ref:'austinyates492-spec/ArkCommandCenter/.github/workflows/build-windows.yml@refs/heads/main',iat:now-5,exp:now+120};
 assert.equal(trustedWorkflowClaims(valid,now),true);
 assert.equal(trustedWorkflowClaims({...valid,ref:'refs/heads/feature'},now),false);
 assert.equal(trustedWorkflowClaims({...valid,sub:'repo:austinyates492-spec/ArkCommandCenter:ref:refs/heads/main'},now),false);
 assert.equal(trustedWorkflowClaims({...valid,aud:'other'},now),false);
 assert.equal(trustedWorkflowClaims({...valid,exp:now-1},now),false);
});
