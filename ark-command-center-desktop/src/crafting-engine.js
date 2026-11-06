const finitePositiveInt=n=>Number.isSafeInteger(Number(n))&&Number(n)>0;

export function validateRecipes(recipes){
 if(!recipes||typeof recipes!=='object'||Array.isArray(recipes))throw new Error('Recipe catalog must be a keyed object.');
 for(const [name,recipe] of Object.entries(recipes)){
  if(!name||!recipe||!finitePositiveInt(recipe.output)||!recipe.ingredients||typeof recipe.ingredients!=='object'||Array.isArray(recipe.ingredients))throw new Error(`Invalid recipe for ${name}.`);
  for(const [ingredient,quantity] of Object.entries(recipe.ingredients))if(!ingredient||!finitePositiveInt(quantity))throw new Error(`Invalid ingredient ${ingredient} in ${name}.`);
 }
 const done=new Set(),active=new Set();
 function visit(name){
  if(active.has(name))throw new Error(`Crafting cycle detected at ${name}.`);
  if(done.has(name)||!recipes[name])return;
  active.add(name);
  for(const child of Object.keys(recipes[name].ingredients))visit(child);
  active.delete(name);done.add(name);
 }
 Object.keys(recipes).forEach(visit);
 return true;
}

function depth(name,recipes,memo={}){
 if(memo[name]!==undefined)return memo[name];
 if(!recipes[name])return 0;
 memo[name]=1+Math.max(0,...Object.keys(recipes[name].ingredients).map(child=>depth(child,recipes,memo)));
 return memo[name];
}

export function buildTree(name,quantity,recipes){
 if(!finitePositiveInt(quantity))throw new Error('Quantity must be a positive whole number.');
 const recipe=recipes[name];
 if(!recipe)return {name,quantity,raw:true,children:[]};
 const batches=Math.ceil(quantity/recipe.output);
 return {name,quantity,batches,output:recipe.output,produced:batches*recipe.output,station:recipe.station,children:Object.entries(recipe.ingredients).map(([part,amount])=>buildTree(part,amount*batches,recipes))};
}

export function calculateCraftingCart(cart,recipes){
 validateRecipes(recipes);
 const pending={};
 for(const entry of cart){
  if(!recipes[entry.name])throw new Error(`Unknown recipe: ${entry.name}`);
  if(!finitePositiveInt(entry.quantity))throw new Error(`Invalid quantity for ${entry.name}`);
  pending[entry.name]=(pending[entry.name]||0)+Number(entry.quantity);
 }
 const allNames=new Set(Object.keys(pending));
 const recipeDepths={};
 for(const name of Object.keys(recipes))depth(name,recipes,recipeDepths);
 const crafts={},materials={},produced={};
 // Process every crafted component after accumulating all demand from parents.
 while(allNames.size){
  const name=[...allNames].sort((a,b)=>(recipeDepths[b]||0)-(recipeDepths[a]||0))[0];
  allNames.delete(name);
  const needed=pending[name];
  if(!recipes[name]){materials[name]=(materials[name]||0)+needed;continue;}
  const r=recipes[name],batches=Math.ceil(needed/r.output);
  crafts[name]=batches;produced[name]=batches*r.output;
  for(const [ingredient,amount] of Object.entries(r.ingredients)){
   pending[ingredient]=(pending[ingredient]||0)+amount*batches;
   allNames.add(ingredient);
  }
 }
 return {materials,crafts,produced,trees:cart.map(e=>buildTree(e.name,Number(e.quantity),recipes))};
}
