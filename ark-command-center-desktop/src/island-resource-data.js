/**
 * The Island native atlas catalog.
 * Resource names are sourced from the published ASA The Island map layer list:
 * https://wikily.gg/ark-survival-ascended/maps-old/the-island
 * GPS points: small, manually curated samples from a separate publicly visible
 * guide https://warservers.org/Ark/database/map.php?map=island&section=resources
 * Every point is community-reported/unverified, not a complete node database.
 * We intentionally DO NOT reproduce source map artwork or bulk coordinate sets.
 */
export const islandResources=[
 {name:'Metal',color:'#e3c36f',group:'Ore'},
 {name:'Rich Metal',color:'#ed9659',group:'Ore'},
 {name:'Crystal',color:'#bba4f6',group:'Mineral'},
 {name:'Obsidian',color:'#c67bcf',group:'Mineral'},
 {name:'Oil',color:'#67d3df',group:'Underwater'},
 {name:'Silica Pearls',color:'#77d6b1',group:'Underwater'},
 {name:'Rare Flowers',color:'#f29ac4',group:'Plants'},
 {name:'Rare Mushrooms',color:'#d09f71',group:'Plants'},
 {name:'Mushrooms',color:'#b3b87a',group:'Plants'},
 {name:'Wood Coal',color:'#9ea48d',group:'Misc'},
 {name:'Plant Species X',color:'#8ce38e',group:'Plants'},
 {name:'Beaver Dam',color:'#a8c79f',group:'Harvestables'},
 {name:'Bee Hive',color:'#e9c462',group:'Harvestables'}
];
const seed={
 'Metal':[[24.3,37.0],[35.6,59.2],[56.1,49.0]],
 'Crystal':[[40.7,47.6],[56.7,48.2],[33.8,78.9]],
 'Obsidian':[[39.9,40.5],[68.1,59.9],[34.0,82.2]],
 'Oil':[[17.8,11.4],[47.5,12.6],[90.7,81.1]],
 'Silica Pearls':[[59.0,19.2],[53.1,92.3],[86.7,39.4]]
};
export const islandSeedMarkers=Object.entries(seed).flatMap(([resource,points])=>points.map(([lat,lon],index)=>({
 id:'reference-'+resource.toLowerCase().replace(/\s+/g,'-')+'-'+index,
 resource,lat,lon,origin:'community-sample',verified:false,
 source:'War Servers community GPS guide'
})));
export const islandResourceSources={
 catalog:'https://wikily.gg/ark-survival-ascended/maps-old/the-island',
 samples:'https://warservers.org/Ark/database/map.php?map=island&section=resources',
 wiki:'https://ark.wiki.gg/wiki/Resource_Map/The_Island'
};
export function normalizeIslandMarker(input){
 const resource=String(input?.resource||'');
 const lat=Number(input?.lat),lon=Number(input?.lon);
 if(!islandResources.some(r=>r.name===resource))throw new Error('Select an Island resource.');
 if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat<0||lat>100||lon<0||lon>100)throw new Error('Coordinates must be 0–100.');
 return {resource,lat:Math.round(lat*10)/10,lon:Math.round(lon*10)/10,verified:false,origin:'user-pin',source:'Personal marker'};
}
export function mapPoint(lat,lon){return {x:lon*10,y:lat*10};}
