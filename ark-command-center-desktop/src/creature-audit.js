import {species,tameCreatures} from './data.js';
import {knockoutProfiles} from './taming-engine.js';
import {passiveProfiles} from './passive-taming.js';
import {knockoutSpecies} from './knockout-engine.js';
import {knockoutEstimate} from './knockout-engine.js';
import {breedingVariants} from './breeding-variants.js';
import asaMethods from './asa-taming-methods.json' with {type:'json'};

function methodStatus(name){
 const parent=breedingVariants[name];
 const row=asaMethods[name]||(parent&&asaMethods[parent]);
 const methods=row?.methods||[];
 if(methods.includes('untameable'))return {method:'Untameable',methodSource:parent?'Inherited from base':'ASA category'};
 if(methods.includes('knockout')&&methods.includes('passive-or-special'))return {method:'Knockout + alternative',methodSource:parent?'Inherited from base':'ASA category'};
 if(methods.includes('knockout'))return {method:'Knockout category',methodSource:parent?'Inherited from base':'ASA category'};
 if(methods.includes('passive-or-special'))return {method:'Passive / special',methodSource:parent?'Inherited from base':'ASA category'};
 return {method:'Special / unclassified',methodSource:row?'ASA category has no standard method':'No ASA method record'};
}

export function creatureAudit(){
 return tameCreatures.map(name=>({
  ...methodStatus(name),
  name,
  food:!!knockoutProfiles[name],
  knockout:!!knockoutSpecies[name],
  torporReference:knockoutEstimate({creature:name,level:1}).referenceOnly===true,
  passive:!!passiveProfiles[name],
  maturation:!!species[name],
  incubation:!!species[name]&&(Number.isFinite(species[name].hatch)||Number.isFinite(species[name].gestation)),
  variant:!!species[name]?.variantOf
 }));
}
export function auditTotals(rows=creatureAudit()){
 return {catalog:rows.length,autoKnockout:rows.filter(x=>x.knockout).length,torporReferences:rows.filter(x=>x.torporReference).length,foodCalculators:rows.filter(x=>x.food).length,passiveGuides:rows.filter(x=>x.passive).length,breeding:rows.filter(x=>x.maturation).length,verifiedHatch:rows.filter(x=>x.incubation).length,methodUnclassified:rows.filter(x=>x.method==='Special / unclassified').length};
}
