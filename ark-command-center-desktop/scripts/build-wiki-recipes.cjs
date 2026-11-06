// Source: ARK Official Community Wiki Cargo `Craftables` table, CC BY-NC-SA.
// Input: saved API response pages (offset 0, 500, 1000, ...).
// This data covers ARK wiki content across game editions; it is NOT an ASA
// official-only manifest. We exclude known incompatible editions and mark the
// remainder as requiring ASA availability and batch-yield confirmation.
const fs=require('node:fs');
const path=require('node:path');
const inputs=process.argv.slice(2);
if(!inputs.length)throw Error('Pass Craftables cargoquery JSON files.');
const recipes={};let excluded=0;
const editionPattern=/\b(?:Primitive Plus|ARK Mobile|Mobile:|Survival Evolved Mobile|PixARK)\b/i;
for(const filename of inputs){
  const doc=JSON.parse(fs.readFileSync(filename,'utf8'));
  if(!Array.isArray(doc.cargoquery))throw Error(`Invalid Cargo export ${filename}`);
  for(const record of doc.cargoquery){
    const row=record.title||{};const name=String(row.Page||'').trim();
    if(!name||editionPattern.test(name)){excluded++;continue;}
    const ingredients={};let valid=true;
    for(let i=1;i<=15;i++){
      const ingredient=String(row[`ingredient${i}`]||'').trim();
      if(!ingredient)continue;
      if(editionPattern.test(ingredient)){valid=false;break;}
      const quantity=Number(row[`quantity${i}`]);
      if(!Number.isSafeInteger(quantity)||quantity<1){valid=false;break;}
      ingredients[ingredient]=(ingredients[ingredient]||0)+quantity;
    }
    if(!valid||!Object.keys(ingredients).length||Object.hasOwn(ingredients,name)){excluded++;continue;}
    recipes[name]={category:'Wiki craftables',station:row.craftedIn||'Check station',ingredients,output:1,
      source:`https://ark.wiki.gg/wiki/${encodeURIComponent(name.replaceAll(' ','_'))}`,
      verification:'wiki-asa-unconfirmed'};
  }
}
let removedCycles=0;
while(true){
  const done=new Set(),active=new Set();let cycle=null;
  const visit=name=>{
    if(cycle||!recipes[name]||done.has(name))return;
    if(active.has(name)){cycle=name;return;}
    active.add(name);
    for(const dep of Object.keys(recipes[name].ingredients))visit(dep);
    active.delete(name);done.add(name);
  };
  for(const name of Object.keys(recipes)){visit(name);if(cycle)break;}
  if(!cycle)break;
  delete recipes[cycle];removedCycles++;
}
const target=path.join(__dirname,'../src/wiki-crafting-recipes.json');
fs.writeFileSync(target,JSON.stringify(recipes));
console.log(`Wiki recipes ${Object.keys(recipes).length}, exclusions ${excluded}, cycle exclusions ${removedCycles}`);
