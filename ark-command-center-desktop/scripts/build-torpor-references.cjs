// Torpor-only reference values from wiki Cargo CreatureStats. These are not
// evidence that conventional tranq weapons can tame a creature.
const fs=require('node:fs');const path=require('node:path');
const stats=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).cargoquery.map(r=>r.title);
const data={};
for(const row of stats){
 if(row.variant||!(Number(row.torpor1)>0))continue;
 data[row.Page]={torpor:Number(row.torpor1),perLevel:Math.round(Number(row.torpor1)*0.06*1000)/1000,head:1,projectile:1,verification:'reference-only',source:'https://ark.wiki.gg/wiki/Special:CargoTables/CreatureStats'};
}
for(const [display,source] of Object.entries({'Direbear':'Dire Bear','Sarcosuchus':'Sarco','Spinosaurus':'Spino','Therizinosaurus':'Therizinosaur'}))if(data[source]&&!data[display])data[display]=data[source];
fs.writeFileSync(path.join(__dirname,'../src/wiki-torpor-references.json'),JSON.stringify(data));
console.log(Object.keys(data).length+' torpor reference records (NOT knockout eligibility).');
