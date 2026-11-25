import wiki from './island-asa-wiki-resources.json';

/** Wiki DataMaps ASA dataset, revision 548223. Values are wiki GPS coordinates.
 * Entries represent reported resource sites/groups, NOT individual ore node totals.
 * This noncommercial derivative of wiki contributor data uses CC BY-NC-SA 4.0.
 */
export const islandWikiSource={
 url:wiki.source,
 revision:wiki.revision,
 omittedOutOfBoundsCount:wiki.omittedOutOfBoundsCount,
};
export const islandWikiResourceKeys={
 metal:'Metal',
 'metal-rich':'Rich Metal',
 crystal:'Crystal',
 obsidian:'Obsidian',
 oil:'Oil',
 silica:'Silica Pearls'
};
export const islandWikiResources=wiki.points.map(p=>({
 id:p.id,resource:islandWikiResourceKeys[p.category],
 lat:p.lat,lon:p.lon,name:p.name||'',source:'ARK Official Community Wiki',kind:'wiki',
})).filter(p=>Boolean(p.resource));
export const islandWikiAvailableResources=Object.values(islandWikiResourceKeys);

/** Preserve every sourced point, but group nearby points by type when zoomed out.
 * Clusters are navigational UI only and do not modify or invent coordinates.
 */
export function visibleWikiSites(points,enabled,zoom){
 const selected=points.filter(p=>enabled.includes(p.resource));
 if(zoom>=3)return selected.map(p=>({...p,count:1}));
 const cell=zoom<1.5?5:zoom<2.5?3:1.5;
 const buckets=new Map();
 for(const p of selected){
  const key=p.resource+'|'+Math.floor(p.lat/cell)+'|'+Math.floor(p.lon/cell);
  const group=buckets.get(key);
  if(group){group.latSum+=p.lat;group.lonSum+=p.lon;group.count+=1;group.sample=group.count===1?p.name:group.sample;}
  else buckets.set(key,{resource:p.resource,latSum:p.lat,lonSum:p.lon,count:1,sample:p.name,id:'cluster-'+key,kind:'wiki'});
 }
 return Array.from(buckets.values(),g=>({
   id:g.id,resource:g.resource,lat:g.latSum/g.count,lon:g.lonSum/g.count,
   count:g.count,name:g.count===1?g.sample:g.count+' mapped sites in this region',
   source:'ARK Official Community Wiki',kind:'wiki'
 }));
}
