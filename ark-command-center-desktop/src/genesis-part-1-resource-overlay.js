import wiki from './genesis-part-1-wiki-resources.json' with {type:'json'};
/** Official Community Wiki shared Genesis Part 1 DataMaps survey rev 548214.
 * These GPS markers are not independently ASA-specific. The compound source
 * map covers Bog/Arctic/Volcanic/Lunar resource areas; the separate Ocean biome
 * has incomplete coverage in this source. No fabricated nodes are added.
 */
const categories={
 'ambergris':'Ambergris',
 'black-pearl cave':'Black Pearls (Cave)',
 cactus:'Cactus Sap',
 'crystal cave':'Crystal (Cave)',
 crystal:'Crystal',
 'element-shard cave':'Element Shards (Cave)',
 'element-shard':'Element Shards',
 'gas-vein':'Gas Vein',
 gas:'Gas',
 'gem-blue':'Blue Gems',
 'gem-green':'Green Gems',
 'gem-red':'Red Gems',
 'metal-rich cave':'Rich Metal (Cave)',
 'metal-rich':'Rich Metal',
 metal:'Metal',
 'obsidian cave':'Obsidian (Cave)',
 obsidian:'Obsidian',
 'oil-rock':'Oil',
 'oil-vein':'Oil Vein / Oil Well',
 salt:'Salt',
 silica:'Silica Pearls',
 'sulfur cave':'Sulfur (Cave)',
 sulfur:'Sulfur'
};
export const genesisPart1WikiSource={
 url:wiki.source,revision:wiki.revision,
 verifiedASA:wiki.verifiedASA,
 omittedOutOfBoundsCount:wiki.omittedOutOfBoundsCount
};
export const genesisPart1WikiResources=wiki.points.map(p=>({
 id:p.id,resource:categories[p.category],
 lat:p.lat,lon:p.lon,name:p.name||'',category:p.category,
 cave:p.category.endsWith(' cave'),
 kind:'wiki',source:'ARK Official Community Wiki Genesis Part 1 shared GPS resource references (ASA not verified)'
})).filter(p=>Boolean(p.resource));
export const genesisPart1WikiAvailableResources=Object.values(categories);
