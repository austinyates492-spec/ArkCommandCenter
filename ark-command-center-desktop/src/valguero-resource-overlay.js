import wiki from './valguero-wiki-resources.json' with {type:'json'};
/** Valguero wiki shared community map (rev 548225), not an ASA-specific
 * resource survey. Source GPS positions are retained without alteration.
 * Obelisks are not resource nodes; Oil rocks and Oil Veins stay separate.
 */
const names={
 'black-pearl':'Black Pearls',
 cactus:'Cactus Sap',clay:'Clay',
 'crystal cave':'Crystal (Cave)',crystal:'Crystal',
 'gas-vein':'Gas Vein',
 'gem-blue':'Blue Gems','gem-green':'Green Gems','gem-red':'Red Gems',
 keratin:'Keratin',
 'metal cave':'Metal (Cave)','metal-rich cave':'Rich Metal (Cave)',
 metal:'Metal',
 'obsidian cave':'Obsidian (Cave)',obsidian:'Obsidian',
 'oil-rock cave':'Oil (Cave)','oil-rock':'Oil','oil-vein':'Oil Vein / Oil Well',
 'organic-polymer':'Organic Polymer','rare-flower':'Rare Flowers',
 rockarrot:'Rockarrot',salt:'Salt',savoroot:'Savoroot',
 'silica cave':'Silica Pearls (Cave)',silica:'Silica Pearls',
 'sulfur cave':'Sulfur (Cave)',sulfur:'Sulfur',
 'water-vein':'Water Vein'
};
export const valgueroWikiSource={
 url:wiki.source,revision:wiki.revision,verifiedASA:wiki.verifiedASA,
 omittedOutOfBoundsCount:wiki.omittedOutOfBoundsCount
};
export const valgueroWikiResources=wiki.points.map(p=>({
 id:p.id,resource:names[p.category],category:p.category,
 lat:p.lat,lon:p.lon,name:p.name||'',cave:p.category.endsWith(' cave'),
 kind:'wiki',source:'ARK Official Community Wiki shared Valguero resource map (ASA location unverified)'
})).filter(p=>Boolean(p.resource));
export const valgueroWikiAvailableResources=Object.values(names);
