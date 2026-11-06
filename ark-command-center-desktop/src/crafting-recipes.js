// Vanilla ASA/ARK Community Wiki recipes. Data values are per crafting batch.
// Where alternative ingredients are allowed, one default is selected; the
// calculator does not currently model user-chosen substitutions.
const recipe=(category,station,ingredients,output=1)=>({category,station,ingredients,output,source:'https://ark.wiki.gg/wiki/'});
export const starterRecipes={
 'Wooden Ceiling':recipe('Structures','Inventory',{'Wood':60,'Thatch':15,'Fiber':10}),
 'Sloped Wooden Roof':recipe('Structures','Inventory',{'Wood':60,'Thatch':15,'Fiber':10}),
 'Wooden Foundation':recipe('Structures','Inventory',{'Wood':80,'Thatch':20,'Fiber':15}),
 'Wooden Wall':recipe('Structures','Inventory',{'Wood':40,'Thatch':10,'Fiber':7}),
 'Wooden Door':recipe('Structures','Inventory',{'Wood':20,'Thatch':7,'Fiber':4}),
 'Stone Foundation':recipe('Structures','Inventory',{'Stone':80,'Wood':40,'Thatch':30}),
 'Stone Wall':recipe('Structures','Inventory',{'Stone':40,'Wood':20,'Thatch':15}),
 'Stone Ceiling':recipe('Structures','Inventory',{'Stone':60,'Wood':30,'Thatch':20}),
 'Metal Ceiling':recipe('Structures','Smithy',{'Metal Ingot':35,'Cementing Paste':10}),
 'Metal Foundation':recipe('Structures','Smithy',{'Metal Ingot':50,'Cementing Paste':15}),
 'Metal Ingot':recipe('Refining','Refining Forge',{'Metal':2}),
 'Charcoal':recipe('Refining','Campfire / Forge',{'Wood':1}),
 'Sparkpowder':recipe('Resources','Mortar and Pestle',{'Flint':2,'Stone':1},2),
 'Gunpowder':recipe('Resources','Mortar and Pestle',{'Sparkpowder':1,'Charcoal':1}),
 'Polymer':recipe('Resources','Fabricator',{'Obsidian':2,'Cementing Paste':2}),
 'Cementing Paste':recipe('Resources','Mortar and Pestle',{'Chitin':4,'Stone':8}),
 'Narcotic':recipe('Consumables','Mortar and Pestle',{'Narcoberry':5,'Spoiled Meat':1}),
 'Stone Arrow':recipe('Ammunition','Inventory',{'Thatch':2,'Fiber':2,'Flint':1}),
 'Tranq Arrow':recipe('Ammunition','Inventory',{'Stone Arrow':1,'Narcotic':1}),
 'Simple Rifle Ammo':recipe('Ammunition','Smithy',{'Metal Ingot':2,'Gunpowder':12},2),
 'Tranquilizer Dart':recipe('Ammunition','Smithy',{'Narcotic':3,'Metal Ingot':2,'Simple Rifle Ammo':1}),
 'Shocking Tranquilizer Dart':recipe('Ammunition','Smithy',{'Bio Toxin':3,'Metal Ingot':2,'Tranquilizer Dart':1})
};

// Names that resolve the user's ARK terminology without duplicate recipes.
export const recipeAliases={'Wood Roof':'Sloped Wooden Roof','Wood Ceiling':'Wooden Ceiling','Wood Roof Flat':'Wooden Ceiling','Tranq Dart':'Tranquilizer Dart','Shocking Dart':'Shocking Tranquilizer Dart'};
