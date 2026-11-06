// Pull supported conventional knockout creatures from official wiki stat data.
// The selection is deliberately restricted to creatures that can be knocked
// unconscious with conventional torpor weapons. Special/passive/boss entries
// are excluded. Creature-specific headshot bonuses are not inferred.
const fs=require('node:fs');const path=require('node:path');
const lua=fs.readFileSync(process.argv[2],'utf8');
const stats=JSON.parse(fs.readFileSync(process.argv[3],'utf8')).cargoquery.map(x=>x.title);
const manual=['Rex','Argentavis','Allosaurus','Giganotosaurus','Stegosaurus','Therizinosaurus','Pteranodon','Tapejara','Raptor','Sabertooth','Sarcosuchus','Triceratops','Ankylosaurus','Quetzal'];
const displayAliases={'Dire Bear':'Direbear',Sarco:'Sarcosuchus',Spino:'Spinosaurus',Therizinosaur:'Therizinosaurus'};
const eligible=`Achatina,Acrocanthosaurus,Allosaurus,Anglerfish,Ankylosaurus,Araneo,Archaeopteryx,Argentavis,Baryonyx,Beelzebufo,Brontosaurus,Carbonemys,Carnotaurus,Castoroides,Ceratosaurus,Compy,Cryolophosaurus,Daeodon,Dilophosaur,Dimetrodon,Dimorphodon,Diplocaulus,Dire Bear,Direwolf,Dodo,Doedicurus,Dunkleosteus,Electrophorus,Fasolasuchus,Gallimimus,Giganotosaurus,Griffin,Ichthyornis,Iguanodon,Jerboa,Kairuku,Kaprosuchus,Kentrosaurus,Lymantria,Maewing,Mammoth,Managarmr,Megalania,Megaloceros,Megalodon,Megalosaurus,Megaraptor,Megatherium,Microraptor,Morellatops,Mosasaurus,Onyc,Oviraptor,Pachy,Pachyrhinosaurus,Paraceratherium,Parasaur,Pelagornis,Phiomia,Plesiosaur,Procoptodon,Pteranodon,Pulmonoscorpius,Purlovia,Quetzal,Raptor,Ravager,Rex,Sabertooth,Sarco,Snow Owl,Spino,Stegosaurus,Tapejara,Terror Bird,Therizinosaurus,Therizinosaur,Thorny Dragon,Thylacoleo,Triceratops,Tropeognathus,Velonasaur,Woolly Rhino,Xiphactinus,Yutyrannus,Shastasaurus,Carcharodontosaurus,Deinosuchus,Dreadnoughtus,Bison`.split(',');
const statByName=new Map();for(const s of stats)if(!s.variant&&+s.torpor1>0&&!statByName.has(s.Page))statByName.set(s.Page,+s.torpor1);
const moduleRows=[...lua.matchAll(/^  \["([^"]+)"\] = \{/gm)];const moduleByName=new Map();
for(let i=0;i<moduleRows.length;i++){
 const match=moduleRows[i],body=lua.slice(match.index,moduleRows[i+1]?.index??lua.length);
 const base=Number(body.match(/\["torpor1"\] = ([\d.]+)/)?.[1]);
 const growth=Number(body.match(/\["torporIncrease"\] = ([\d.]+)/)?.[1]);
 if(base>0&&growth>0)moduleByName.set(match[1],{base,growth,passive:/\["nonViolentTame"\] = 1/.test(body)});
}
const candidates={};
for(const name of eligible){
 const display=displayAliases[name]||name;
 const mod=moduleByName.get(name),base=mod?.base||statByName.get(name);
 if(!base||mod?.passive||manual.includes(display)||candidates[display]||['Maewing','Tropeognathus','Electrophorus'].includes(display))continue;
 candidates[display]={torpor:base,perLevel:mod?.growth??Math.round(base*0.06*1000)/1000,head:1,projectile:1,
   verification:mod?'wiki-torpor':'wiki-base-6pct',source:mod?'https://ark.wiki.gg/wiki/Module:TamingTable/creatures':'https://ark.wiki.gg/wiki/Special:CargoTables/CreatureStats'};
}
// Include distinct official aberrant/X variants only where a wiki base-stat row exists.
for(const s of stats){
 if(Object.keys(candidates).length+manual.length>=100)break;
 if(!eligible.includes(s.Page)||!s.variant||!['Aberrant','X','R','Tek'].includes(s.variant)||!(+s.torpor1>0))continue;
 const name=`${s.variant} ${s.Page}`;
 if(candidates[name]||manual.includes(name))continue;
 const base=+s.torpor1;
 candidates[name]={torpor:base,perLevel:Math.round(base*0.06*1000)/1000,head:1,projectile:1,verification:'wiki-variant-base-6pct',source:'https://ark.wiki.gg/wiki/Special:CargoTables/CreatureStats'};
}
// Tek forms inherit ordinary species torpor scaling; these are distinct ASA
// creature forms rather than additional base species.
for(const parent of ['Rex','Raptor','Stegosaurus','Triceratops','Parasaur','Quetzal']){
 if(Object.keys(candidates).length+manual.length>=100)break;
 const source=candidates[parent]||(manual.includes(parent)?{torpor:statByName.get(parent),perLevel:(statByName.get(parent)||0)*0.06}:null);
 if(!source?.torpor)continue;
 const name=`Tek ${parent}`;
 if(name==='Tek Triceratops')continue;
 candidates[name]={torpor:source.torpor,perLevel:source.perLevel,head:1,projectile:1,verification:'tek-parent-stat-assumed',source:'https://ark.wiki.gg/wiki/Tek_Creatures'};
}
for(const [name,parent] of Object.entries({'Aberrant Dire Bear':'Direbear','Aberrant Sarco':'Sarcosuchus','Aberrant Spino':'Spinosaurus','X-Spino':'Spinosaurus','X-Rex':'Rex','X-Raptor':'Raptor','X-Sabertooth':'Sabertooth','X-Megalodon':'Megalodon','X-Ankylosaurus':'Ankylosaurus','X-Argentavis':'Argentavis','X-Tapejara':'Tapejara','X-Woolly Rhino':'Woolly Rhino'})){
 if(Object.keys(candidates).length+manual.length>=100)break;
 if(candidates[name])continue;
 const parentEntry=candidates[parent];
 const base=parentEntry?.torpor||statByName.get(parent)||moduleByName.get(parent)?.base;
 if(!base)continue;
 candidates[name]={torpor:base,perLevel:parentEntry?.perLevel||moduleByName.get(parent)?.growth||Math.round(base*0.06*1000)/1000,head:1,projectile:1,verification:'variant-parent-stat-assumed',source:'https://ark.wiki.gg/wiki/Special:CargoTables/CreatureStats'};
}
const count=manual.length+Object.keys(candidates).length;
if(count<100)throw Error(`Only ${count} entries; could not reach 100 safely.`);
const trimmed=Object.fromEntries(Object.entries(candidates).slice(0,100-manual.length));
fs.writeFileSync(path.join(__dirname,'../src/wiki-knockout-profiles.json'),JSON.stringify(trimmed));
console.log(`Generated ${Object.keys(trimmed).length} new wiki profiles + ${manual.length} existing = 100 profiles, including distinct variants.`);
