import wiki from './center-asa-wiki-resources.json' with {type:'json'};

/** ARK Official Community Wiki Center community source; NOT ASA-specific.
 * We do not pretend these are verified ASA spawn coordinates.
 * These x/y GPS entries are inherited from the wiki's community Center map.
 * Displayed on genuine ASA terrain with explicit provenance warning.
 */
const categories={
 'crystal':'Crystal',
 'crystal cave':'Crystal (Cave)',
 'metal':'Metal',
 'metal cave':'Metal (Cave)',
 'metal-rich':'Rich Metal',
 'metal-rich cave':'Rich Metal (Cave)',
 'obsidian':'Obsidian',
 'obsidian cave':'Obsidian (Cave)',
 'oil-rock':'Oil',
 'oil-rock cave':'Oil (Cave)',
 'silica':'Silica Pearls',
 'silica cave':'Silica Pearls (Cave)'
};
export const centerWikiSource={
 url:wiki.source,revision:wiki.revision,
 verifiedASA:false,omittedOutOfBoundsCount:wiki.omittedOutOfBoundsCount
};
export const centerWikiAvailableResources=Object.values(categories);
export const centerWikiResources=wiki.points.map(p=>({
 id:p.id,kind:'wiki',source:'ARK Official Community Wiki — historical Center community coordinates (ASA unverified)',
 resource:categories[p.category],lat:p.lat,lon:p.lon,name:p.name||'',
 cave:p.category.endsWith(' cave'),category:p.category
})).filter(p=>Boolean(p.resource));
