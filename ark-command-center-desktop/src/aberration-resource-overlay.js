import wiki from './aberration-wiki-resources.json' with {type:'json'};
/** The community wiki has a shared Aberration resource map with an ASA artwork option,
 * but no separate /ASA marker revision. Never claim individual markers are verified ASA.
 */
const categories={
 'black-pearl':'Black Pearls',
 'crystal cave':'Crystal (Cave)',
 'crystal':'Crystal',
 'charge-node':'Charge Node',
 'gas-vein':'Gas Vein',
 'element-ore':'Element Ore',
 'gem-blue cave':'Blue Gems (Cave)',
 'gem-blue':'Blue Gems',
 'gem-green cave':'Green Gems (Cave)',
 'gem-green':'Green Gems',
 'gem-red':'Red Gems',
 'keratin':'Keratin',
 'metal cave':'Metal (Cave)',
 'metal-rich cave':'Rich Metal (Cave)',
 'metal-rich':'Rich Metal',
 'metal':'Metal',
 'obsidian cave':'Obsidian (Cave)',
 'obsidian':'Obsidian',
 'oil-rock':'Oil',
 'organic-polymer':'Organic Polymer',
 'silica':'Silica Pearls'
};
export const aberrationWikiSource={
 url:wiki.source,revision:wiki.revision,
 verifiedASA:wiki.verifiedASA,
 omittedOutOfBoundsCount:wiki.omittedOutOfBoundsCount
};
export const aberrationWikiResources=wiki.points.map(p=>({
 id:p.id,resource:categories[p.category],lat:p.lat,lon:p.lon,
 name:p.name||'',category:p.category,cave:p.category.endsWith(' cave'),
 kind:'wiki',source:'ARK Official Community Wiki shared Aberration reference (ASA nodes unverified)'
})).filter(p=>Boolean(p.resource));
export const aberrationWikiAvailableResources=Object.values(categories);
