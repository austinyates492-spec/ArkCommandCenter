// Reproducible converter for ARK Official Community Wiki Lua data modules:
// curl -L 'https://ark.wiki.gg/wiki/Module:TamingTable/creatures?action=raw' -o /tmp/ark_taming_creatures.lua
// curl -L 'https://ark.wiki.gg/wiki/Module:TamingTable/food?action=raw' -o /tmp/ark_taming_food.lua
// node scripts/build-taming-data.cjs /tmp/ark_taming_creatures.lua /tmp/ark_taming_food.lua > src/wiki-taming-data.json
const fs=require('node:fs');
function parseLua(text){
 const t=text.replace(/--\[\[[\s\S]*?\]\]/g,'').replace(/--[^\n]*/g,'');
 const tokens=[];
 const re=/\s*(\{|\}|\[|\]|=|,|;|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[A-Za-z_][A-Za-z_0-9]*)/gy;
 let i=0;while(i<t.length){re.lastIndex=i;const m=re.exec(t);if(!m)throw Error(`Unexpected Lua input at ${i}: ${t.slice(i,i+60)}`);tokens.push(m[1]);i=re.lastIndex;}
 let p=0;const peek=()=>tokens[p],pop=()=>tokens[p++];
 const value=()=>{
  const q=pop();
  if(q==='{'){
   const entries=[],arr=[];
   while(peek()!=='}'){
    if(peek()==='['){pop();const k=value();if(pop()!==']'||pop()!=='=')throw Error('Malformed keyed table');entries.push([k,value()]);}
    else if(peek()&&tokens[p+1]==='='){const k=pop();pop();entries.push([k,value()]);}
    else arr.push(value());
    if(peek()===','||peek()===';')pop();
   }
   pop();if(entries.length&&arr.length)throw Error('Mixed Lua arrays not supported');return entries.length?Object.fromEntries(entries):arr;
  }
  if(q==='true')return true;if(q==='false')return false;if(q==='nil')return null;
  if(q.startsWith('"'))return JSON.parse(q);
  if(q.startsWith("'"))return q.slice(1,-1).replace(/\\'/g,"'");
  if(/^-?\d/.test(q))return Number(q);
  throw Error(`Unexpected Lua atom ${q}`);
 };
 if(pop()!=='return')throw Error('Expected module return');
 const parsed=value();if(p!==tokens.length)throw Error(`Unparsed tokens: ${tokens.slice(p,p+10)}`);
 return parsed;
}
const creatures=parseLua(fs.readFileSync(process.argv[2],'utf8'));
const food=parseLua(fs.readFileSync(process.argv[3],'utf8'));
const result={source:'https://ark.wiki.gg/wiki/Module:TamingTable/creatures',foodSource:'https://ark.wiki.gg/wiki/Module:TamingTable/food',note:'Wiki community tables may lag current ASA patches; estimates are based on the published baseline.',creatures,food};
console.log(JSON.stringify(result));
