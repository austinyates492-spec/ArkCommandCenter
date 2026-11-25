/** Source-grounded ASA spawn zone projection.
 * Source spawn records encode a container, group weight and creature weight,
 * with rectangles in [latitude 1, longitude 1, latitude 2, longitude 2].
 * Relative share is NOT the probability of a living creature at this point.
 */
export const spawnTierColors={
 higher:'#47e1a1',
 moderate:'#f4d16c',
 lower:'#fb9749',
 rare:'#ed7185'
};
export const spawnTierNames={
 higher:'Higher relative weight',
 moderate:'Moderate relative weight',
 lower:'Lower relative weight',
 rare:'Very low relative weight'
};
export const spawnTierOptions=[
 {value:'all',label:'All likelihood levels'},
 {value:'higher',label:'Higher (green)'},
 {value:'moderate',label:'Moderate (yellow)'},
 {value:'lower',label:'Lower (orange)'},
 {value:'rare',label:'Very low (red)'}
];
export const terrainForSpawnMap={
 'The Island':'/maps/the-island-asa.jpg',
 'Scorched Earth':'/maps/scorched-earth-asa.jpg',
 'The Center':'/maps/the-center-asa.jpg',
 'Aberration':'/maps/aberration-asa.jpg',
 'Extinction':'/maps/extinction-asa.jpg',
 'Ragnarok':'/maps/ragnarok-asa.jpg',
 'Valguero':'/maps/valguero-asa.jpg',
 'Astraeos':'/maps/astraeos-asa.jpg',
 'Lost Colony':'/maps/lost-colony-asa.jpg',
 'Genesis: Part 1':'/maps/genesis-part-1-asa.jpg',
 'Genesis: Part 1 Ocean':'/maps/genesis-part-1-ocean-asa.jpg'
};
export const availableSpawnMapNames=Object.keys(terrainForSpawnMap);
export const spawnLoaders={
 'The Island':()=>import('./spawn-source/the-island.json',{with:{type:'json'}}),
 'Scorched Earth':()=>import('./spawn-source/scorched-earth.json',{with:{type:'json'}}),
 'The Center':()=>import('./spawn-source/the-center.json',{with:{type:'json'}}),
 'Aberration':()=>import('./spawn-source/aberration.json',{with:{type:'json'}}),
 'Extinction':()=>import('./spawn-source/extinction.json',{with:{type:'json'}}),
 'Ragnarok':()=>import('./spawn-source/ragnarok.json',{with:{type:'json'}}),
 'Valguero':()=>import('./spawn-source/valguero.json',{with:{type:'json'}}),
 'Astraeos':()=>import('./spawn-source/astraeos.json',{with:{type:'json'}}),
 'Lost Colony':()=>import('./spawn-source/lost-colony.json',{with:{type:'json'}}),
 'Genesis: Part 1':()=>import('./spawn-source/genesis-part-1.json',{with:{type:'json'}}),
 'Genesis: Part 1 Ocean':()=>import('./spawn-source/genesis-part-1-ocean.json',{with:{type:'json'}})
};
const aliasNames={
 Rex:['T-Rex'],Triceratops:['Trike'],Plesiosaur:['Plesiosaurus'],
 Pulmonoscorpius:['Scorpion'],Dung Beetle:['Dungbeetle'],
 Anglerfish:['Angler'],Sarcosuchus:['Sarco'],Megalosaurus:['Megalo'],
 'Arthropluera':['Arthropleura']
};
const normalized=x=>String(x||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/gi,'').toLowerCase();
export function findSpawnSpecies(dataset,creature,map){
 if(!dataset?.species||!creature)return [];
 const names=Object.keys(dataset.species);
 const wanted=normalized(creature);
 const exact=names.filter(n=>normalized(n)===wanted);
 if(exact.length)return exact;
 const alias=(aliasNames[creature]||[]).map(normalized);
 const aliases=names.filter(n=>alias.includes(normalized(n)));
 if(aliases.length)return aliases;
 // When the plain species name isn't present, an explicitly named native
 // variant may be documented in its own map; show which was selected.
 const nativePrefix=map==='Aberration'?'Aberrant ':map==='Genesis: Part 1'||map==='Genesis: Part 1 Ocean'?'X-':null;
 if(nativePrefix)return names.filter(n=>normalized(n)===normalized(nativePrefix+creature));
 return [];
}
export function relativeSpawnTier(weight){
 if(weight>=.45)return 'higher';
 if(weight>=.15)return 'moderate';
 if(weight>=.04)return 'lower';
 return 'rare';
}
export function spawnZonesForCreature(dataset,creature,map,layer='all'){
 const matched=findSpawnSpecies(dataset,creature,map);
 const zones=[];
 for(const species of matched){
  for(const row of dataset.species[species]||[]){
   const [pos,weight,container,flags]=row;
   if(!Array.isArray(pos)||(pos.length!==2&&pos.length!==4)||!Number.isFinite(weight))continue;
   const tier=relativeSpawnTier(weight);
   if(layer!=='all'&&tier!==layer)continue;
   zones.push({pos,weight,tier,species,container,flags});
  }
 }
 return {matched,zones,count:zones.length,verifiedASA:dataset?.verifiedASA===true};
}
export function spawnLocationCoverage(dataset,creature,map){
 const matched=findSpawnSpecies(dataset,creature,map);
 return {matched,documented:matched.some(name=>(dataset.species[name]||[]).length>0),source:dataset?.source||null,revision:dataset?.revision||null};
}
