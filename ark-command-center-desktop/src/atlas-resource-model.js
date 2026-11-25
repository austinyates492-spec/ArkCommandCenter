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
export const centerCaveResources=[
 {id:'Crystal (Cave)',color:'#d4b6ff'},
 {id:'Metal (Cave)',color:'#dce4ee'},
 {id:'Rich Metal (Cave)',color:'#ffdf9d'},
 {id:'Obsidian (Cave)',color:'#a3a0e1'},
 {id:'Oil (Cave)',color:'#a3e6f0'},
 {id:'Silica Pearls (Cave)',color:'#efffff'}
];
export const lostColonySpecificResources=[
 {id:'Black Pearls',color:'#363a52'},
 {id:'Plant Species R',color:'#8bdc88'},
 {id:'Organic Polymer',color:'#d7a9ec'},
 {id:'Sulfur',color:'#e7d86a'},
 {id:'Resource Outpost',color:'#ffad65'}
];
export const astraeosSpecificResources=[
 {id:'Black Pearls',color:'#252b42'},
 {id:'Rich Metal',color:'#f1c05c'},
 {id:'Sulfur',color:'#e6db64'},
 {id:'Silk',color:'#f3ceaf'},
 {id:'Gas Vein',color:'#b9ed8b'},
 {id:'Water Vein',color:'#67c9f5'}
];
export const valgueroSpecificResources=[
 {id:'Black Pearls',color:'#323b53'},
 {id:'Cactus Sap',color:'#b3d38b'},
 {id:'Clay',color:'#cfa58c'},
 {id:'Crystal (Cave)',color:'#d8baff'},
 {id:'Gas Vein',color:'#e8a5e9'},
 {id:'Blue Gems',color:'#579bff'},
 {id:'Green Gems',color:'#66dfac'},
 {id:'Red Gems',color:'#f07b88'},
 {id:'Keratin',color:'#c6bba2'},
 {id:'Metal (Cave)',color:'#c8d0dd'},
 {id:'Rich Metal (Cave)',color:'#fce1a2'},
 {id:'Obsidian (Cave)',color:'#afa9d8'},
 {id:'Oil (Cave)',color:'#7acadd'},
 {id:'Organic Polymer',color:'#f6b9dc'},
 {id:'Rockarrot',color:'#eeb17f'},
 {id:'Salt',color:'#e5d4b5'},
 {id:'Savoroot',color:'#b1d79c'},
 {id:'Silica Pearls (Cave)',color:'#e8faff'},
 {id:'Sulfur',color:'#d8d67a'},
 {id:'Sulfur (Cave)',color:'#eff0ad'},
 {id:'Water Vein',color:'#65cafa'}
];
export const ragnarokSpecificResources=[
 {id:'Black Pearls',color:'#33384a'},
 {id:'Cactus Sap',color:'#b5d48b'},
 {id:'Clay',color:'#d6a783'},
 {id:'Crystal (Cave)',color:'#dac1ff'},
 {id:'Metal (Cave)',color:'#d5dce7'},
 {id:'Rich Metal (Cave)',color:'#ffdd9f'},
 {id:'Obsidian (Cave)',color:'#a6a0d5'},
 {id:'Rockarrot',color:'#ef985d'},
 {id:'Salt',color:'#e1c5b0'},
 {id:'Savoroot',color:'#d9ce89'},
 {id:'Silica Pearls (Cave)',color:'#f3faff'},
 {id:'Sulfur',color:'#e6dc66'},
 {id:'Water Vein',color:'#60c2ef'}
];
export const extinctionSpecificResources=[
 {id:'Cactus Sap',color:'#b6d388'},
 {id:'Crystal (Cave)',color:'#d2b8ff'},
 {id:'Element Dust',color:'#c9a3e6'},
 {id:'Green Gems',color:'#5ddf9b'},
 {id:'Green Gems (Cave)',color:'#8ae9b4'},
 {id:'Rich Metal (Cave)',color:'#ffd89a'},
 {id:'Obsidian (Cave)',color:'#a8a4d6'},
 {id:'Silk',color:'#f3d9aa'},
 {id:'Silk (Cave)',color:'#ffe4c4'},
 {id:'Sulfur',color:'#e5de79'},
 {id:'OSD (Orbital Supply Drop)',color:'#89baff'},
 {id:'Element Vein',color:'#df8cff'}
];
export const aberrationSpecificResources=[
 {id:'Black Pearls',color:'#2b3048'},
 {id:'Crystal (Cave)',color:'#d4b6ff'},
 {id:'Charge Node',color:'#69f5d8'},
 {id:'Gas Vein',color:'#c1e875'},
 {id:'Element Ore',color:'#cf5fa9'},
 {id:'Blue Gems (Cave)',color:'#8daeff'},
 {id:'Blue Gems',color:'#438cf5'},
 {id:'Green Gems (Cave)',color:'#93efba'},
 {id:'Green Gems',color:'#4be09a'},
 {id:'Red Gems',color:'#e75d7a'},
 {id:'Keratin',color:'#c9b39b'},
 {id:'Metal (Cave)',color:'#ccd2e1'},
 {id:'Rich Metal (Cave)',color:'#f5d398'},
 {id:'Obsidian (Cave)',color:'#aea9da'},
 {id:'Organic Polymer',color:'#d6b2ff'}
];
export const scorchedSpecificResources=[
 {id:'Silk',color:'#f4d6a1'},
 {id:'Salt',color:'#e1c1a9'},
 {id:'Sulfur',color:'#e0de63'},
 {id:'Plant Species Y',color:'#9ad67f'},
 {id:'Water Vein',color:'#51baf4'}
];
export function resourcesForMap(map){
 if(map==='Lost Colony')return [...islandResourceTypes,...lostColonySpecificResources];
 if(map==='Astraeos')return [...islandResourceTypes.filter(r=>r.id!=='Rich Metal'),...astraeosSpecificResources,oilVeinResource];
 if(map==='Valguero')return [...islandResourceTypes,...valgueroSpecificResources,oilVeinResource];
 if(map==='Ragnarok')return [...islandResourceTypes,...ragnarokSpecificResources,oilVeinResource];
 if(map==='Extinction')return [...islandResourceTypes,...extinctionSpecificResources];
 if(map==='Aberration')return [...islandResourceTypes,...aberrationSpecificResources];
 if(map==='The Center')return [...islandResourceTypes,...centerCaveResources];
 if(map==='Scorched Earth')return [...islandResourceTypes,...scorchedSpecificResources,oilVeinResource];
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
