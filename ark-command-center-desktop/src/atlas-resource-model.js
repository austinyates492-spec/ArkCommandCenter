/**
 * ARK Tribe HQ atlas data contract.
 * Official Community Wiki ASA map points are a separately attributed dataset.
 * Custom and personal map pins remain browser-local and distinct from wiki points.
 */
export const CUSTOM_PIN_RESOURCE='Custom';
export const islandResourceTypes=[
 {id:'Metal',color:'#b7bdc8'},
 {id:'Rich Metal',color:'#f1c05c'},
 {id:'Crystal',color:'#b98cff'},
 {id:'Obsidian',color:'#8583ba'},
 {id:'Oil',color:'#4cd8f0'},
 {id:'Silica Pearls',color:'#dbf3ff'},
 {id:'Rare Flowers',color:'#f09ac1'},
 {id:'Rare Mushrooms',color:'#eeb86d'},
 {id:'Mushrooms',color:'#db9b6d'},
 {id:'Wood Coal',color:'#bda988'},
 {id:'Plant Species X',color:'#a9ea72'},
 {id:'Beaver Dam',color:'#79c7ac'},
 {id:'Bee Hive',color:'#f3c94d'}
];
/** These maps have published references for pumpable oil veins; unlike Oil
 * nodes, an oil vein is a structure placement point for an Oil Pump.
 * Specific coordinates still need map-by-map ASA verification. */
export const mapsWithOilVeins=['Scorched Earth','Ragnarok','Valguero','Astraeos'];
export const oilVeinResource={id:'Oil Vein / Oil Well',color:'#df98ff'};
export function resourcesForMap(map){
 return mapsWithOilVeins.includes(map)?[...islandResourceTypes,oilVeinResource]:islandResourceTypes;
}
export function checkAtlasPin(pin,map){
 const resource=String(pin?.resource||'');
 const lat=Number(pin?.lat),lon=Number(pin?.lon);
 const note=String(pin?.note||'').trim().slice(0,180);
 const title=String(pin?.title||'').trim().slice(0,60);
 if(resource!==CUSTOM_PIN_RESOURCE&&!resourcesForMap(map).some(item=>item.id===resource))throw new Error('Choose a supported resource on this map.');
 if(resource===CUSTOM_PIN_RESOURCE&&!title)throw new Error('Give your custom pin a name.');
 if(pin?.lat===''||pin?.lon===''||!Number.isFinite(lat)||!Number.isFinite(lon)||lat<0||lat>100||lon<0||lon>100)throw new Error('Enter GPS latitude and longitude between 0 and 100.');
 return {resource,lat:Math.round(lat*10)/10,lon:Math.round(lon*10)/10,note,title};
}
export const atlasSourceLinks={
 oilVein:'https://ark.wiki.gg/wiki/Oil_Vein',
 officialResourceMap:'https://ark.wiki.gg/wiki/Resource_Map/The_Island',
 communityMap:'https://wikily.gg/ark-survival-ascended/maps-old/the-island'
};
