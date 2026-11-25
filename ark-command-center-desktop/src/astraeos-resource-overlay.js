import veins from './astraeos-wiki-explorer-veins.json' with {type:'json'};
import hotspots from './astraeos-resource-hotspots.json' with {type:'json'};

/** No official Wiki Astraeos resource-node DataMap was available on import.
 * ASA-specific Wiki explorer data covers oil, water and gas veins (revision
 * 601078); ordinary-resource spots are curated approximate cluster centres
 * from ARK Status, not rock-by-rock wiki survey nodes.
 *
 * The native image and viewport are GPS 0..100; some Astraeos locations
 * legitimately extend past 100, and the 6 out-of-bounds explorer markers
 * are intentionally not projected into false in-bounds coordinates.
 */
const veinTypes={'oil-vein':'Oil Vein / Oil Well','water-vein':'Water Vein','gas-vein':'Gas Vein'};
export const astraeosWikiVeinSource={
 url:veins.source,revision:veins.revision,verifiedASA:veins.verifiedASA,
 omittedOutOfBoundsCount:veins.omittedOutOfBoundsCount
};
export const astraeosHotspotSource={
 url:hotspots.source,verifiedASA:hotspots.verifiedASA
};
export const astraeosWikiVeins=veins.points.map(p=>({
 id:p.id,lat:p.lat,lon:p.lon,category:p.category,
 resource:veinTypes[p.category],name:p.name||'',kind:'wiki',
 source:'ARK Official Community Wiki — Astraeos ASA Explorer Map',
 sourceUrl:veins.source,verifiedASA:true
})).filter(p=>Boolean(p.resource));
export const astraeosHotspots=hotspots.points.map(p=>({
 ...p,kind:'hotspot',source:hotspots.sourceName,
 name:p.name||'Published approximate farming hotspot',verifiedASA:false
}));
export const astraeosAtlasPoints=[...astraeosWikiVeins,...astraeosHotspots];
export const astraeosAtlasAvailableResources=[
 ...new Set(astraeosAtlasPoints.map(p=>p.resource))
];
export const astraeosAtlasSource={
 url:veins.source,revision:veins.revision,
 verifiedASA:false,
 omittedOutOfBoundsCount:veins.omittedOutOfBoundsCount
};
