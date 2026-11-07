// Build one ASA creature-method audit from live Dododex category listings.
// The list distinguishes category membership from independently verified
// damage/torpor mathematics. The overlapping categories are intentional.
// Usage: node scripts/build-asa-method-roster.cjs /tmp/dododex-
const fs=require('node:fs');const path=require('node:path');
const prefix=process.argv[2];if(!prefix)throw Error('Pass the path prefix for downloaded category pages.');
const alias={'Angler':'Anglerfish','Dire Bear':'Direbear','Sarco':'Sarcosuchus'};
const normalize=x=>alias[x]||x;
function names(kind){
 const html=fs.readFileSync(`${prefix}${kind}.html`,'utf8');
 const values=[...html.matchAll(/<div class="ccLabel">([^<]+)<\/div>/g)].map(m=>normalize(m[1]));
 if(!values.length)throw Error(`No names found in ${kind}`);
 return new Set(values);
}
const all=names('all'),knockout=names('knockout'),passive=names('passive'),untamable=names('untamable');
const result={};
for(const name of [...all].sort()){
 if(name==='Brachiosaurus [MOD]')continue;
 const methods=[];
 if(knockout.has(name))methods.push('knockout');
 if(passive.has(name))methods.push('passive-or-special');
 if(untamable.has(name))methods.push('untameable');
 result[name]={methods,source:'https://www.dododex.com/dinosaurs/ark-survival-ascended',
  methodSource:'https://www.dododex.com/dinosaurs/',verification:'category-listed',
  note:methods.length?'':'No categorised standard method in the source; inspect creature page.'};
}
const output=path.join(__dirname,'../src/asa-taming-methods.json');
fs.writeFileSync(output,JSON.stringify(result));
console.log({asaNames:Object.keys(result).length,knockout:[...knockout].filter(x=>result[x]).length,passive:[...passive].filter(x=>result[x]).length,untamable:[...untamable].filter(x=>result[x]).length,unclassified:Object.values(result).filter(x=>!x.methods.length).length});
