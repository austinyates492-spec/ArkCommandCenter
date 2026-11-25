import wiki from './extinction-wiki-resources.json' with {type:'json'};
/** Extinction wiki shared community resource dataset, revision 548208;
 * older than ASA-specific node verification. OSD and element veins are NOT
 * present in this resource data source and must not be fabricated.
 */
const types={
 cactus:'Cactus Sap',crystal:'Crystal','crystal cave':'Crystal (Cave)',
 'element-dust':'Element Dust','gem-green':'Green Gems','gem-green cave':'Green Gems (Cave)',
 'metal-rich':'Rich Metal','metal-rich cave':'Rich Metal (Cave)',
 metal:'Metal','obsidian':'Obsidian','obsidian cave':'Obsidian (Cave)',
 'oil-rock':'Oil',silk:'Silk','silk cave':'Silk (Cave)',sulfur:'Sulfur'
};
export const extinctionWikiSource={url:wiki.source,revision:wiki.revision,verifiedASA:wiki.verifiedASA,omittedOutOfBoundsCount:wiki.omittedOutOfBoundsCount};
export const extinctionWikiAvailableResources=Object.values(types);
export const extinctionWikiResources=wiki.points.map(p=>({
 id:p.id,resource:types[p.category],category:p.category,
 lat:p.lat,lon:p.lon,name:p.name||'',kind:'wiki',
 source:'ARK Official Community Wiki shared Extinction resource data (ASA verification pending)',
 cave:p.category.endsWith(' cave')
})).filter(p=>Boolean(p.resource));
