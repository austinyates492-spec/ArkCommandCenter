import test from 'node:test';
import assert from 'node:assert/strict';
import {starterRecipes} from './crafting-recipes.js';
import wikiRecipes from './wiki-crafting-recipes.json' with {type:'json'};
import {calculateCraftingCart,buildTree,validateRecipes} from './crafting-engine.js';

test('a thousand wood roofs calculate base wood, thatch and fiber',()=>{
 const result=calculateCraftingCart([{name:'Sloped Wooden Roof',quantity:1000}],starterRecipes);
 assert.deepEqual(result.materials,{Wood:60000,Thatch:15000,Fiber:10000});
 assert.equal(result.crafts['Sloped Wooden Roof'],1000);
});
test('different recipes combine shared resource totals',()=>{
 const result=calculateCraftingCart([{name:'Wooden Ceiling',quantity:1000},{name:'Wooden Wall',quantity:20}],starterRecipes);
 assert.equal(result.materials.Wood,60800);
 assert.equal(result.materials.Thatch,15200);
 assert.equal(result.materials.Fiber,10140);
});
test('intermediate crafting tree expands to raw materials',()=>{
 const tree=buildTree('Tranq Arrow',1,starterRecipes);
 assert.equal(tree.children.length,2);
 assert.equal(tree.children[0].name,'Stone Arrow');
 assert.ok(tree.children[0].children.some(x=>x.name==='Thatch'&&x.raw));
});
test('batch yields apply after aggregating all demand',()=>{
 const result=calculateCraftingCart([{name:'Tranq Arrow',quantity:1},{name:'Gunpowder',quantity:1}],starterRecipes);
 assert.equal(result.crafts.Gunpowder,1);
 assert.equal(result.crafts.Sparkpowder,1);
 assert.equal(result.produced.Sparkpowder,2);
 assert.equal(result.materials.Flint,3);
 assert.equal(result.materials.Wood,1);
});
test('cycle and malformed quantities are rejected',()=>{
 assert.throws(()=>validateRecipes({A:{output:1,ingredients:{B:1}},B:{output:1,ingredients:{A:1}}}),/cycle/i);
 assert.throws(()=>calculateCraftingCart([{name:'Wooden Ceiling',quantity:-3}],starterRecipes),/quantity/i);
});
test('official community wiki crafting export parses as valid recipes',()=>{
 assert.ok(Object.keys(wikiRecipes).length>1000);
 assert.equal(validateRecipes({...wikiRecipes,...starterRecipes}),true);
});
