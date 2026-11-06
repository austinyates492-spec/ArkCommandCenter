import {species,tameCreatures} from './data.js';
import {knockoutProfiles} from './taming-engine.js';
import {passiveProfiles} from './passive-taming.js';
import {knockoutSpecies} from './knockout-engine.js';
import {knockoutEstimate} from './knockout-engine.js';

export function creatureAudit(){
 return tameCreatures.map(name=>({
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
 return {catalog:rows.length,autoKnockout:rows.filter(x=>x.knockout).length,torporReferences:rows.filter(x=>x.torporReference).length,foodCalculators:rows.filter(x=>x.food).length,passiveGuides:rows.filter(x=>x.passive).length,breeding:rows.filter(x=>x.maturation).length,verifiedHatch:rows.filter(x=>x.incubation).length};
}
