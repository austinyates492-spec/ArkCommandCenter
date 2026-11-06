// Torpor stats: ARK Official Community Wiki Module:TamingTable/creatures.
// Ammo base torpor: https://ark.wiki.gg/wiki/Tranquilizer_Comparison_Table
// Head modifiers: https://ark.wiki.gg/wiki/T._rex and /wiki/Allosaurus
// Argentavis has NO post-TLC headshot bonus; projectile multiplier is 1.5x.
export const knockoutSpecies={
  Rex:{torpor:1550,perLevel:93,head:1.5,projectile:1},
  Argentavis:{torpor:600,perLevel:36,head:1,projectile:1.5},
  Allosaurus:{torpor:1000,perLevel:60,head:1.5,projectile:1}
};
export const tranqs=[
 {id:'bow',label:'Tranq Arrow · Bow',torpor:90},
 {id:'crossbow',label:'Tranq Arrow · Crossbow',torpor:157.5},
 {id:'compound',label:'Tranq Arrow · Compound Bow',torpor:121.5},
 {id:'dart',label:'Tranq Dart · Longneck',torpor:221},
 {id:'shocking',label:'Shocking Dart · Longneck',torpor:442}
];
export function knockoutEstimate({creature,level,weaponQuality=100}){
 const entry=knockoutSpecies[creature];
 if(!entry)return {ok:false,reason:'Verified torpor stats are not available for this creature.'};
 const lvl=Number(level),quality=Number(weaponQuality);
 if(!Number.isInteger(lvl)||lvl<1||lvl>1000)return {ok:false,reason:'Enter a wild level from 1 to 1000.'};
 if(!Number.isFinite(quality)||quality<1||quality>1000)return {ok:false,reason:'Enter weapon damage between 1% and 1000%.'};
 const totalTorpor=entry.torpor+(lvl-1)*entry.perLevel;
 const rows=tranqs.map(item=>{
  const bodyPerShot=item.torpor*quality/100*entry.projectile;
  const body=Math.ceil(totalTorpor/bodyPerShot);
  const head=entry.head>1?Math.ceil(totalTorpor/(bodyPerShot*entry.head)):null;
  return {...item,body,head};
 });
 return {ok:true,totalTorpor,headMultiplier:entry.head,projectileMultiplier:entry.projectile,rows};
}
