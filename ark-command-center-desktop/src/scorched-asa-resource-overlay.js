import wiki from './scorched-asa-wiki-resources.json' with {type:'json'};

/** ARK Official Community Wiki ASA Scorched Earth Resource Map, revision 548220.
 * Category tier suffix represents source-defined intensity, not individual deposits.
 * The GPS locations are unaltered; filter names match Resource Atlas UI labels.
 */
const categoryNames={
 'metal':'Metal',
 'metal-rich':'Rich Metal',
 'crystal':'Crystal',
 'obsidian':'Obsidian',
 'silk':'Silk',
 'salt':'Salt',
 'silica':'Silica Pearls',
 'sulfur':'Sulfur',
 'plant-y':'Plant Species Y',
 'mushroom':'Mushrooms',
 'rare-flower':'Rare Flowers',
 'water-vein':'Water Vein',
 'oil-vein':'Oil Vein / Oil Well',
};
export const scorchedWikiSource={
 url:wiki.source,revision:wiki.revision,
 omittedOutOfBoundsCount:wiki.omittedOutOfBoundsCount
};
export const scorchedWikiAvailableResources=Object.values(categoryNames);
export const scorchedWikiResources=wiki.points.map(p=>{
 const sourceCategory=p.category.replace(/ tier-\d+$/,'');
 const tier=/ tier-(\d+)$/.exec(p.category)?.[1];
 return {
  id:p.id,kind:'wiki',source:'ARK Official Community Wiki',
  resource:categoryNames[sourceCategory],
  category:p.category,tier:tier===undefined?null:Number(tier),
  lat:p.lat,lon:p.lon,name:p.name||''
 };
}).filter(p=>Boolean(p.resource));
