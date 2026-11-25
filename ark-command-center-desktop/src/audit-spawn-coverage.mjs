import {readFileSync} from 'node:fs';
import {tameCreatures} from './data.js';
import {spawnLoaders,spawnZonesForCreature} from './spawn-zone-model.js';
const result=[];
for(const [map,load] of Object.entries(spawnLoaders)){
 const d=(await load()).default;
 for(const creature of tameCreatures){
  const {zones,matched}=spawnZonesForCreature(d,creature,map);
  const tiers={};for(const z of zones)tiers[z.tier]=(tiers[z.tier]||0)+1;
  result.push({map,creature,matched,regions:zones.length,tiers,unverifiedContainers:[...new Set(zones.filter(z=>z.tier==='unverified').map(z=>z.container))],source:d.source,revision:d.revision});
 }
}
console.log(JSON.stringify(result,null,2));
