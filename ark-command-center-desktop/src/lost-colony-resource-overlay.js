import resources from './lost-colony-wiki-resources.json' with {type:'json'};
import outposts from './lost-colony-explorer-outposts.json' with {type:'json'};

/** ARK Official Community Wiki Lost Colony ASA resource DataMap rev 593948;
 * genuine ASA node survey. Outpost references from separate ASA explorer data
 * rev 600802, not treated as gatherable rock nodes or live availability.
 */
const categories={
 'black-pearl':'Black Pearls',
 'metal':'Metal',
 'metal-rich':'Rich Metal',
 'plant-r':'Plant Species R',
 'organic-polymer':'Organic Polymer',
 'sulfur':'Sulfur',
 'crystal':'Crystal',
 'obsidian':'Obsidian',
 'oil':'Oil',
 'silica':'Silica Pearls'
};
export const lostColonyWikiSource={
 url:resources.source,revision:resources.revision,
 verifiedASA:resources.verifiedASA,
 omittedOutOfBoundsCount:resources.omittedOutOfBoundsCount
};
export const lostColonyOutpostSource={
 url:outposts.source,revision:outposts.revision,
 verifiedASA:outposts.verifiedASA,
 omittedOutOfBoundsCount:outposts.omittedOutOfBoundsCount
};
export const lostColonyWikiResources=resources.points.map(p=>({
 id:p.id,resource:categories[p.category],
 category:p.category,lat:p.lat,lon:p.lon,name:p.name||'',
 source:'ARK Official Community Wiki — Lost Colony ASA resource survey',
 kind:'wiki',verifiedASA:true
})).filter(p=>Boolean(p.resource));
export const lostColonyResourceOutposts=outposts.points.map(p=>({
 id:p.id,resource:'Resource Outpost',category:p.category,
 lat:p.lat,lon:p.lon,name:'Resource Outpost (explorer reference)',
 source:'ARK Official Community Wiki — Lost Colony ASA explorer outpost',
 kind:'outpost',verifiedASA:true
}));
export const lostColonyAtlasPoints=[...lostColonyWikiResources,...lostColonyResourceOutposts];
export const lostColonyAtlasAvailableResources=[...Object.values(categories),'Resource Outpost'];
