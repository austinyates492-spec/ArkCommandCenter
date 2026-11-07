import asaMethods from './asa-taming-methods.json' with {type:'json'};
import {breedingVariants} from './breeding-variants.js';
import {passiveProfiles} from './passive-taming.js';

// Only list items documented for these particular mechanics. Do not derive
// ammo quantities from generic torpor math for special tames.
export const specialMethods={
 'Rock Elemental':{type:'Heavy knockout',items:['Cannonball · Cannon'],instructions:'Strike the head with cannonballs. Normal tranquilizer arrows and darts do not work.',source:'https://ark.wiki.gg/wiki/Rock_Elemental'},
 Karkinos:{type:'Heavy knockout',items:['Boulder · Catapult Turret','Cannonball · Cannon'],instructions:'Hit the main body with heavy projectiles; avoid the legs. Standard tranqs do not work.',source:'https://ark.wiki.gg/wiki/Karkinos'},
 Titanosaur:{type:'Heavy knockout',items:['Cannonball · Cannon','Boulder · Catapult Turret'],instructions:'Use heavy siege projectiles aimed at the head. Ordinary tranquilizer ammo is ineffective.',source:'https://ark.wiki.gg/wiki/Titanosaur'},
 Basilisk:{type:'Egg feeding',items:['Fertilized Rock Drake Egg','Fertilized Wyvern Egg','Fertilized Magmasaur Egg','Fertilized Voidwyrm Egg'],instructions:'Drop a permitted fertilized egg on the ground for the Basilisk to eat. Do not attempt regular tranq knockout.',source:'https://ark.wiki.gg/wiki/Basilisk'},
 Deinonychus:{type:'Nest egg',items:['Wild Fertilized Deinonychus Egg'],instructions:'Steal a fertilized egg from a wild nest, incubate it and raise the hatchling. Adults cannot be knocked out and tamed.',source:'https://ark.wiki.gg/wiki/Deinonychus'},
 'Rock Drake':{type:'Nest egg',items:['Wild Fertilized Rock Drake Egg'],instructions:'Recover a fertilized egg from a wild nest, then hatch and raise it. Do not use normal tranqs.',source:'https://ark.wiki.gg/wiki/Rock_Drake'},
 Wyvern:{type:'Nest egg',items:['Wild Fertilized Wyvern Egg'],instructions:'Steal a fertilized egg from a wild nest, then hatch and raise it. Wild adults are not standard knockouts.',source:'https://ark.wiki.gg/wiki/Wyvern'},
 Carcharodontosaurus:{type:'Trust taming',items:['Drag an eligible dinosaur corpse'],instructions:'Offer a suitable corpse to build trust, then mount and earn taming progress by killing creatures. No normal tranqs.',source:'https://ark.wiki.gg/wiki/Carcharodontosaurus'},
 Ceratosaurus:{type:'Drunken passive tame',items:['Hemogoblin Cocktail'],instructions:'Apply the cocktail to a tamed creature, allow the Ceratosaurus to attack it until drunk, then feed while it is vulnerable.',source:'https://ark.wiki.gg/wiki/Ceratosaurus'},
 Rhyniognatha:{type:'Host impregnation',items:['Rhyniognatha Pheromone'],instructions:'Use pheromone on a suitable tamed host and follow the female Rhyniognatha impregnation process. Standard tranqs do not produce a tame.',source:'https://ark.wiki.gg/wiki/Rhyniognatha'},
 Reaper:{type:'Queen impregnation',items:['Reaper Queen impregnation encounter'],instructions:'Obtain a Reaper King through impregnation by a Reaper Queen. Ordinary knockout taming is not available.',source:'https://ark.wiki.gg/wiki/Reaper'},
 Gacha:{type:'Ground item feeding',items:['Dropped items / structures'],instructions:'Drop accepted items close to the Gacha so it collects and consumes them. Confirm the optimal item on your server.',source:'https://ark.wiki.gg/wiki/Gacha'}
};

export function getTamingMethod(creature){
 const parent=breedingVariants[creature]||creature;
 const specific=specialMethods[creature]||specialMethods[parent];
 if(specific)return {...specific,status:'documented'};
 const passive=passiveProfiles[creature]||passiveProfiles[parent];
 if(passive)return {type:passive.method==='single'?'Single-item passive tame':'Passive / interaction tame',items:passive.food,instructions:passive.notes,source:`https://ark.wiki.gg/wiki/${encodeURIComponent(parent.replaceAll(' ','_'))}`,status:'documented'};
 const methods=asaMethods[creature]?.methods||asaMethods[parent]?.methods||[];
 if(methods.includes('untameable'))return {type:'Untameable',items:[],instructions:'This creature is classified as untameable. There is no ordinary knockout or feeding loadout.',status:'untameable'};
 if(methods.includes('passive-or-special')&&!methods.includes('knockout'))return {type:'Special / passive tame',items:[],instructions:'This species needs a creature-specific interaction or item that has not yet been individually reviewed. Check the species page before preparing supplies.',status:'needs-review'};
 if(!methods.includes('knockout'))return {type:'Method not confirmed',items:[],instructions:'No standard knockout method has been confirmed for this form. Check the species page; tranq estimates are intentionally withheld.',status:'needs-review'};
 return null;
}
