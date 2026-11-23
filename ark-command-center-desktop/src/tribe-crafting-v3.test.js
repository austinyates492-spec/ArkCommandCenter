import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const page=readFileSync(new URL('./TribeCraftingPage.jsx',import.meta.url),'utf8');
const css=readFileSync(new URL('./tribe-crafting-v3.css',import.meta.url),'utf8');

test('Tribe Crafting matches image-free premium workspace and keeps all shared screens',()=>{
 for(const part of ['tribe-crafting-v3','NEW DESIGN','Shared Recipe Planner','Resource Requirements','Crafting Breakdown','Production Queue','tribe-v3-summary','tribe-v3-top','tribe-v3-bottom'])assert.ok(page.includes(part),part);
 assert.doesNotMatch(page,/<img\b|portrait|artwork/i);
});
test('Shared data calculations and synchronized actions preserve existing contracts',()=>{
 for(const part of ['calculateCraftingCart(queue,catalog)','live.crafting','live.addCraft(selectedName,n)','live.setCraft(item.name,n,item.quantity)','live.removeCraft(item.name)','live.clearCraft()',"live.refresh('crafting')","onOpenAccount","item.updatedBy","live.status"])assert.ok(page.includes(part),part);
 assert.match(page,/window\.confirm\('Clear every tribe crafting project for all members\?'\)/);
});
test('No simulated gathering completion is presented as synced',()=>{
 assert.ok(page.includes('Gathered inventory is not yet recorded or synchronized'));
 assert.ok(page.includes('Inventory gathering completion is not currently part of shared tribe crafting.'));
 assert.ok(page.includes('totalUnits'));
});
test('Theme selection and mobile layout govern shared crafting',()=>{
 for(const part of ['--ark-accent','--ark-bright','--ark-surface','--ark-muted','--ark-line','--personality-border','@media(max-width:1150px)','@media(max-width:450px)'])assert.ok(css.includes(part),part);
});
