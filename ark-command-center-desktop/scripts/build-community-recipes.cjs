// Optional community dataset generator, not an official ASA canonical roster.
// Download DefaultCraftingRecipes.js from:
// https://github.com/zerollor/ARK-Survival-Ascended-Engram-Configuration-Tool
// Run: node scripts/build-community-recipes.cjs path/to/DefaultCraftingRecipes.js
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const input=process.argv[2];
if(!input)throw Error('Supply a local DefaultCraftingRecipes.js path.');
const source=fs.readFileSync(input,'utf8');
const rows=vm.runInNewContext(`${source}\n;DefaultCraftingRecipes`);
const byName={};
for(const row of rows){
  if(!row.name||!Array.isArray(row.ingredients)||!row.ingredients.length)continue;
  const ingredients={};let valid=true;
  for(const part of row.ingredients){
    const qty=Number(part.amount),name=String(part.resource||'').trim();
    if(!name||!Number.isSafeInteger(qty)||qty<=0){valid=false;break;}
    ingredients[name]=(ingredients[name]||0)+qty;
  }
  if(!valid||Object.hasOwn(ingredients,row.name))continue;
  byName[row.name]={category:'Community candidates',station:'Check in game',ingredients,output:1,source:'https://github.com/zerollor/ARK-Survival-Ascended-Engram-Configuration-Tool',verification:'unverified',gameId:row.id};
}
// A mixed community export can contain crafting loops or inconsistent entries.
// Remove the recipe at the loop's origin instead of crashing the calculator.
let removedCycles=0;
while(true){
  const visited=new Set(),active=new Set();let cyclic=null;
  const visit=name=>{
    if(active.has(name)){cyclic=name;return;}
    if(visited.has(name)||!byName[name]||cyclic)return;
    active.add(name);
    for(const dep of Object.keys(byName[name].ingredients)){visit(dep);if(cyclic)break;}
    active.delete(name);visited.add(name);
  };
  for(const name of Object.keys(byName)){visit(name);if(cyclic)break;}
  if(!cyclic)break;
  delete byName[cyclic];removedCycles++;
}
const target=path.join(__dirname,'../src/community-crafting-recipes.json');
fs.writeFileSync(target,JSON.stringify(byName));
console.log(`Generated ${Object.keys(byName).length} community candidates; removed ${removedCycles} cyclic entries. Includes possible mods, not an official-only verified roster.`);
