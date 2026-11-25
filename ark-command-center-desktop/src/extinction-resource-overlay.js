import wiki from './extinction-wiki-resources.json' with {type:'json'};
import events from './extinction-event-sites.json' with {type:'json'};
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

/** Event locations published by ARKCademy. These are historical/reference
 * candidate spawns, not guaranteed live ASA events or exclusive event types.
 * Each shared OSD + Element Vein location appears in BOTH independently
 * selectable filters, with the original source coordinates unchanged.
 */
export const extinctionEventSource={
 url:events.source,
 verifiedASA:events.verifiedASA,
 waypointCount:events.points.length
};
export const extinctionEventSites=events.points.flatMap(p=>[
 ...(p.osd?[{
  id:p.id+'-osd',resource:'OSD (Orbital Supply Drop)',
  category:'event-osd',lat:p.lat,lon:p.lon,
  name:p.difficulty+' Orbital Supply Drop candidate'+(p.vein?' (shared site)':''),
  eventDifficulty:p.difficulty,kind:'event',source:events.sourceName,
  sourceUrl:events.source,verifiedASA:false
 }]:[]),
 ...(p.vein?[{
  id:p.id+'-vein',resource:'Element Vein',
  category:'event-vein',lat:p.lat,lon:p.lon,
  name:p.difficulty+' Element Vein/Node candidate'+(p.osd?' (shared site)':''),
  eventDifficulty:p.difficulty,kind:'event',source:events.sourceName,
  sourceUrl:events.source,verifiedASA:false
 }]:[])
]);
export const extinctionAtlasPoints=[...extinctionWikiResources,...extinctionEventSites];
export const extinctionAtlasAvailableResources=[...extinctionWikiAvailableResources,'OSD (Orbital Supply Drop)','Element Vein'];
