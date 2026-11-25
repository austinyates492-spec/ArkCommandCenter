/** Source-grounded ASA spawn zone projection.
 * Source spawn records encode a container, group weight and creature weight,
 * with rectangles in [latitude 1, longitude 1, latitude 2, longitude 2].
 * Relative share is NOT the probability of a living creature at this point.
 */
export const spawnTierColors={veryHigh:'#22c55e',higher:'#84cc16',moderate:'#eab308',lower:'#f97316',rare:'#ef4444',unverified:'#737373'};
export const spawnTierNames={veryHigh:'Very common',higher:'Common',moderate:'Uncommon',lower:'Rare',rare:'Very rare',unverified:'Unverified rarity'};
export const spawnTierOptions=[{value:'all',label:'All documented regions'},...Object.entries(spawnTierNames).filter(([key])=>key!=='unverified').map(([value,label])=>({value,label:label+' relative weight'}))];
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
 Pulmonoscorpius:['Scorpion'],'Dung Beetle':['Dungbeetle'],
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
 if(weight>=.75)return 'veryHigh';
 if(weight>=.45)return 'higher';
 if(weight>=.15)return 'moderate';
 if(weight>=.04)return 'lower';
 return 'rare';
}
// Reviewed ASA DevKit extraction (2026-11-04) and cooked zone survey (2026-10-09).
// Shares and caps are percentages of container populations, not encounter probabilities.
const beach={Dodo:[32.602,60],Dilophosaur:[11.162,10],Carbonemys:[9.203,30],Ichthyornis:[9.061,12.5],Lystrosaurus:[8.372,25],Pteranodon:[6.277,25],Compy:[5.619,14],Parasaur:[5.229,20],Triceratops:[4.182,20],Moschops:[3.414,10],Pegomastax:[2.049,12],Oviraptor:[1.396,10],Deinotherium:[.735,2],Brontosaurus:[.698,5]};
const jungle={Meganeura:[24.837,null],'Titanomyrma Drone':[9.314,30],Dilophosaur:[7.762,25],Parasaur:[7.376,25],Compy:[6.495,16],'Titanomyrma Soldier':[6.209,30],Dodo:[4.663,15],Carbonemys:[4.657,12],Dimorphodon:[3.109,10],Triceratops:[3.109,15],Raptor:[3.029,20],Lystrosaurus:[2.915,20],Troodon:[2.439,10],Iguanodon:[2.175,10],Mesopithecus:[1.9,13.5],Phiomia:[1.749,20],Pachy:[1.737,15],Therizinosaur:[1.554,10],Moschops:[1.36,10],Oviraptor:[.853,10],Stegosaurus:[.583,10],Tapejara:[.545,3],Chalicotherium:[.465,5],Diplodocus:[.465,8.5],Carnotaurus:[.389,5],Gigantoraptor:[.313,2]};
const sparseMaps=new Set(['The Island','The Center','Astraeos','Ragnarok','Valguero']);
export function regionalRarity(species,container,map){
 const source='https://hypernatrema.com/ark/browse/spawns/';
 // Dedicated containers aim for only 2–7 creatures across entire surveyed maps.
 if(sparseMaps.has(map)&&((container==='DinoSpawnEntriesQuetz'&&species==='Quetzal')||(container==='DinoSpawnEntriesGigant'&&species==='Giganotosaurus')))return {tier:'rare',basis:'Sparse dedicated population target',source:source+container.toLowerCase()};
 const table=map==='The Island'?(container==='DinoSpawnEntriesBeach'?beach:container==='DinoSpawnEntriesJungle'?jungle:null):null;
 const row=table&&Object.hasOwn(table,species)?table[species]:null;
 if(!row)return {tier:'unverified',basis:'Regional abundance evidence unavailable'};
 const [share,cap]=row;
 const score=Math.min(share,cap??share);
 // Fixed modeled population-share bands, not measured presence/encounter percentages.
 const tier=score>=25?'veryHigh':score>=10?'higher':score>=3?'moderate':score>=1?'lower':'rare';
 return {tier,basis:'Modeled spawn composition and cap',source:source+container.toLowerCase()};
}

export function spawnZonesForCreature(dataset,creature,map,layer='all',mode='rarity'){
 const matched=findSpawnSpecies(dataset,creature,map);
 const zones=[];
 for(const species of matched){
  for(const row of dataset.species[species]||[]){
   const [pos,weight,container,flags]=row;
   if(!Array.isArray(pos)||(pos.length!==2&&pos.length!==4)||!Number.isFinite(weight))continue;
   if(/CaveTek|TekCave|Mission|Gauntlet/i.test(container))continue;
   const classification=regionalRarity(species,container,map);
   const tier=mode==='weight'?relativeSpawnTier(weight):mode==='documented'?'unverified':classification.tier;
   if(layer!=='all'&&tier!==layer)continue;
   zones.push({pos,weight,tier,species,container,flags,basis:classification.basis,source:classification.source});
  }
 }
 return {matched,zones,count:zones.length,verifiedASA:dataset?.verifiedASA===true};
}
export function spawnLocationCoverage(dataset,creature,map){
 const matched=findSpawnSpecies(dataset,creature,map);
 return {matched,documented:matched.some(name=>(dataset.species[name]||[]).length>0),source:dataset?.source||null,revision:dataset?.revision||null};
}
