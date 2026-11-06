// Vanilla 1x breeding baseline, sourced from https://ark.wiki.gg/wiki/Breeding
const hr=(d,h,m)=>(d*24+h+m/60);
export const species={
  Rex:{mature:hr(3,20,35),hatch:hr(0,4,59),category:'Carnivore'},
  Argentavis:{mature:hr(2,6,27),hatch:hr(0,2,56),category:'Carnivore'},
  Ankylosaurus:{mature:hr(2,0,43),hatch:hr(0,2,37),category:'Herbivore'},
  Allosaurus:{mature:hr(1,22,17),hatch:hr(0,1,39),category:'Carnivore'},
  Baryonyx:{mature:hr(1,22,17),hatch:hr(0,1,59),category:'Piscivore'},
  Brontosaurus:{mature:hr(3,20,35),hatch:hr(0,4,59),category:'Herbivore'},
  Carbonemys:{mature:hr(0,23,8),hatch:hr(0,1,14),category:'Herbivore'},
  Bulbdog:{mature:hr(2,0,43),gestation:hr(0,4,10),category:'Omnivore'}
};
export const maps=['The Island','Scorched Earth','The Center','Aberration','Extinction','Ragnarok','Valguero','Astraeos','Lost Colony'];
export const defaults={taming:10,hatch:10,mature:10,cuddle:0.1,breeding:0.1,food:1};
export const hoursText=(hours)=>{const minutes=Math.round(hours*60);const days=Math.floor(minutes/1440),h=Math.floor(minutes%1440/60),m=minutes%60;return [days?`${days}d`:null,h?`${h}h`:null,`${m}m`].filter(Boolean).join(' ')};
export const wikiSpawn=(map)=>`https://ark.wiki.gg/wiki/Spawn_Map/${encodeURIComponent(map.replaceAll(' ','_'))}`;
