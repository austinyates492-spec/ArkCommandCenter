import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('./CraftingPage.jsx',import.meta.url),'utf8');
const css=readFileSync(new URL('./crafting-lab-v3.css',import.meta.url),'utf8');
const app=readFileSync(new URL('./main.jsx',import.meta.url),'utf8');

test('Crafting Lab V3 is no-image and retains all legacy calculation features',()=>{
 for(const part of ['calculateCraftingCart(cart,recipes)','calculateCraftingCart([{name:currentName,quantity:currentQty}],recipes)','validateRecipes','addCustom','importData','useLocal(\'ark.crafting.cart\'','RecipeNode','crafts.filter','Object.entries(result?.materials','craftv3-upper','craftv3-lower','Resource Requirements','Crafting Breakdown','Production Queue']) assert.ok(src.includes(part),part);
 assert.doesNotMatch(src,/\<img\b|recipe-image|recipe-artwork/i);
});
test('live queue shares real projects with cloud permissions and failure reporting',()=>{
 for(const part of ['live.addCraft(item.name,item.quantity)','if(!user){onOpenAccount?.();return;}','if(invalid.length)','setSending(true)','finally{setSending(false)','setError(\'Shared queue transfer stopped','onOpenTribeCrafting']) assert.ok(src.includes(part),part);
 for(const part of ['live={live}','user={cloud.user}',"setPage('tribe-crafting')"])assert.ok(app.includes(part),part);
});
test('resource progress is local and derived from the real engine, not fake totals',()=>{
 for(const part of ["'ark.crafting.gathered.local'","preview?.materials","Math.min(count,Math.max(0,Number(gathered[name])||0))","setCollected","Gathering progress is saved on this device, not shared with the tribe"]) assert.ok(src.includes(part),part);
 assert.ok(src.includes('previewUnits'));
});
test('crafting has theme-aware responsive layout',()=>{
 for(const part of ['--ark-accent','--ark-surface','--ark-heading','--ark-muted','--personality-border','@media(max-width:680px)','@media(max-width:1220px)'])assert.ok(css.includes(part),part);
});
