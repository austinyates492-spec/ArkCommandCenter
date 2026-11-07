// Import numerical reference facts from DinoIndex's source-attributed ASA
// breeding dataset. Input: a downloaded HTML copy of /breeding. This is a
// build-time snapshot: the installed Windows app never scrapes the website.
// DinoIndex cites the MIT-licensed ARK Smart Breeding datasets for its source.
const fs=require('node:fs');
const path=require('node:path');

const input=process.argv[2];
if(!input)throw new Error('Usage: node scripts/import-asa-breeding.cjs /path/to/dinoindex-breeding.html');
const html=fs.readFileSync(input,'utf8');
const match=html.match(/<script id="breeding-config" type="application\/json">([\s\S]*?)<\/script>/);
if(!match)throw new Error('Expected DinoIndex breeding-config JSON not present');
const {dataset}=JSON.parse(match[1]);
if(!dataset||!dataset.creatures||Object.keys(dataset.creatures).length<156)throw new Error('Breeding dataset is incomplete');
const creatures={};
for(const creature of Object.values(dataset.creatures)){
 if(!['egg','gestation'].includes(creature.mode)||![creature.pre_seconds,creature.mature_seconds,creature.cooldown_min_seconds,creature.cooldown_max_seconds].every(v=>Number.isFinite(v)&&v>0))throw new Error(`Invalid breeding source record: ${creature.name}`);
 creatures[creature.name]={
  method:creature.mode==='egg'?'Egg':'Gestation',
  preSeconds:creature.pre_seconds,
  matureSeconds:creature.mature_seconds,
  cooldownMinSeconds:creature.cooldown_min_seconds,
  cooldownMaxSeconds:creature.cooldown_max_seconds,
  ...(Array.isArray(creature.egg_temp_c)?{eggTempC:creature.egg_temp_c}:{}),
  variants:Object.values(creature.verified_variants||{}).map(v=>v.name)
 };
}
const formCount=Object.values(creatures).reduce((sum,r)=>sum+r.variants.length,0);
if(formCount<64)throw new Error(`Missing verified variants: ${formCount}`);
const result={
 source:'https://www.dinoindex.com/breeding',
 sourceAttribution:'ARK Smart Breeding (MIT-licensed data), crosschecked by DinoIndex for ASA',
 datasetVersion:dataset.version,
 reviewedAt:dataset.reviewed_at,
 asaVersion:dataset.source_asa_version,
 baseVersion:dataset.source_base_version,
 creatures
};
const output=path.join(__dirname,'../src/asa-breeding-source.json');
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
console.log(`Imported ${Object.keys(creatures).length} ASA breeding species + ${formCount} verified variants from ${result.source}`);
