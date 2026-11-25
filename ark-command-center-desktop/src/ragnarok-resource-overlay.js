import wiki from './ragnarok-wiki-resources.json' with {type:'json'};
/** ARK Official Community Wiki shared Ragnarok DataMaps source revision 548218.
 * Not independently verified in ASA; keeps cave and regular locations separate.
 * Oil Vein is pumpable; Oil is gatherable resource, never merge them.
 */
const categories={
 'black-pearl':'Black Pearls','cactus':'Cactus Sap','clay':'Clay',
 'crystal cave':'Crystal (Cave)','crystal':'Crystal',
 'metal cave':'Metal (Cave)','metal-rich cave':'Rich Metal (Cave)',
 'metal-rich':'Rich Metal','metal':'Metal',
 'obsidian cave':'Obsidian (Cave)','obsidian':'Obsidian',
 'oil-rock':'Oil','oil-vein':'Oil Vein / Oil Well',
 'rare-flower':'Rare Flowers','rockarrot':'Rockarrot',
 'salt':'Salt','savoroot':'Savoroot',
 'silica cave':'Silica Pearls (Cave)','silica':'Silica Pearls',
 'sulfur':'Sulfur','water-vein':'Water Vein'
};
export const ragnarokWikiSource={
 url:wiki.source,revision:wiki.revision,
 verifiedASA:wiki.verifiedASA,omittedOutOfBoundsCount:wiki.omittedOutOfBoundsCount
};
export const ragnarokWikiResources=wiki.points.map(p=>({
 id:p.id,resource:categories[p.category],lat:p.lat,lon:p.lon,
 name:p.name||'',category:p.category,cave:p.category.endsWith(' cave'),
 kind:'wiki',source:'ARK Official Community Wiki shared Ragnarok reference (ASA locations unverified)'
})).filter(p=>Boolean(p.resource));
export const ragnarokWikiAvailableResources=Object.values(categories);
