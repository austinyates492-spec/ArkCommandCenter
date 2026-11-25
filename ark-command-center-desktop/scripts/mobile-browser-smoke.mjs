import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium,webkit,devices} from 'playwright';

const origin='http://127.0.0.1:4173';
const server=spawn(process.execPath,['web-server.js'],{stdio:'inherit',env:{...process.env,PORT:'4173'}});
async function waitServer(){
 for(let i=0;i<60;i++){try{if((await fetch(origin)).ok)return;}catch{}await new Promise(r=>setTimeout(r,500));}
 throw Error('Preview server failed to start');
}
async function noOverflow(page,label){
 const dims=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
 assert.ok(dims.scroll<=dims.viewport+2,label+': horizontal overflow '+JSON.stringify(dims));
}
async function openSearch(page,query){
 await page.getByRole('button',{name:'Search ARK Tribe HQ',exact:true}).tap();
 await page.getByRole('dialog',{name:'Search ARK Tribe HQ',exact:true}).waitFor();
 await page.getByRole('combobox',{name:'Search query'}).fill(query);
}
async function pick(page,group,title){
 await page.getByRole('group',{name:group,exact:true}).getByRole('option').filter({has:page.getByText(title,{exact:true})}).first().tap();
 await page.getByRole('dialog',{name:'Search ARK Tribe HQ',exact:true}).waitFor({state:'hidden'});
}
try{
 await waitServer();
 for(const [engine,kind,device,widths] of [[chromium,'Chromium','Pixel 7',[375,390,430]],[webkit,'WebKit','iPhone 13',[390]]]){
  const browser=await engine.launch({headless:true});
  try{
   for(const width of widths){
    const {defaultBrowserType,...profile}=devices[device];
    const ctx=await browser.newContext({...profile,viewport:{width,height:844}});
    try{
     const page=await ctx.newPage(),errors=[];
     page.on('pageerror',e=>{errors.push(String(e));console.error('Browser page error:',e.stack||String(e));});
     page.on('console',msg=>{if(msg.type()==='error')console.error('Browser console:',msg.text());});
     await page.goto(origin,{waitUntil:'domcontentloaded'});
     await page.locator('.shell').waitFor({timeout:25000});
     const skip=page.getByRole('button',{name:'Skip intro',exact:true});
     if(await skip.isVisible())await skip.tap();
     await page.locator('#ark-boot-intro').waitFor({state:'hidden',timeout:15000});
     await noOverflow(page,kind+' '+width+' startup');
     const search=page.getByRole('button',{name:'Search ARK Tribe HQ',exact:true});
     const rect=await search.boundingBox();assert.ok(rect&&rect.width>=44&&rect.height>=44,'Search touch target');
     await page.getByRole('button',{name:'Open navigation menu'}).tap();
     await page.locator('.sidebar.mobile-open').waitFor();
     assert.equal(await page.locator('.sidebar').getByRole('button',{name:'Spawn Maps',exact:true}).count(),0);
     await page.locator('.sidebar').getByRole('button',{name:'Taming Lab',exact:true}).tap();
     await page.getByRole('tab',{name:'Knockout Tames'}).waitFor();
     await page.getByRole('tab',{name:'Passive Tames'}).tap();
     await page.getByRole('region',{name:'Creature spawn locations'}).waitFor();
     await page.getByRole('tab',{name:'Specialty Taming'}).tap();
     await page.getByRole('region',{name:'Creature spawn locations'}).waitFor();
     await openSearch(page,'Rex');
     assert.equal(await page.getByRole('group',{name:'Active timers',exact:true}).count(),0,'Guest must not see timers');
     assert.equal(await page.getByRole('group',{name:'Tribe crafting',exact:true}).count(),0,'Guest must not see projects');
     await noOverflow(page,kind+' '+width+' search');
     await pick(page,'Creatures','Rex');
     assert.equal(await page.locator('.taming-creature-field select').inputValue(),'Rex');
     await page.getByRole('region',{name:'Creature spawn locations'}).getByRole('img',{name:/ASA map with GPS/}).waitFor();
     await page.locator('label.field').filter({has:page.locator('span').filter({hasText:/^Map$/})}).locator('select').selectOption('Aberration');
     await page.getByLabel('Aberration Zone Focus').waitFor();
     const zones=page.getByLabel('Aberration Zone Focus');await zones.selectOption({index:1});
     await page.getByRole('button',{name:'Reset map zoom and position'}).tap();
     await noOverflow(page,kind+' '+width+' tame');
     await openSearch(page,'Rex Saddle');
     await pick(page,'Recipes','Rex Saddle');
     assert.equal(await page.locator('label.field').filter({has:page.locator('span').filter({hasText:/^Choose recipe$/})}).locator('select').inputValue(),'Rex Saddle');
     await noOverflow(page,kind+' '+width+' crafting');
     await openSearch(page,'Rex breeding');
     await pick(page,'Breeding','Rex breeding');
     assert.equal(await page.locator('label.field').filter({has:page.locator('span').filter({hasText:/^Select creature$/})}).locator('select').inputValue(),'Rex');
     await noOverflow(page,kind+' '+width+' breeding');
     await openSearch(page,'The Island');
     await pick(page,'Maps','The Island');
     assert.equal(await page.getByLabel('Select map').inputValue(),'The Island');
     await page.getByRole('img',{name:/ASA map with GPS/}).waitFor();
     await noOverflow(page,kind+' '+width+' atlas');
     const guide=page.getByRole('region',{name:'Farming recommendations'});
     await guide.getByLabel('Resource to farm').selectOption('Metal');
     await guide.getByText('Ankylosaurus',{exact:true}).waitFor();
     await guide.getByLabel('Resource to farm').selectOption('Oil Vein / Oil Well');
     await guide.getByText('Oil Pump',{exact:true}).waitFor();
     assert.equal(await guide.getByRole('button',{name:'The Island',exact:true}).count(),0);
     await guide.getByRole('button',{name:'Scorched Earth',exact:true}).tap();
     assert.equal(await page.getByLabel('Select map').inputValue(),'Scorched Earth');
     await noOverflow(page,kind+' '+width+' farming recommendations');
     await openSearch(page,'Rex');await page.getByRole('button',{name:'Close search'}).tap();
     await page.getByRole('dialog',{name:'Search ARK Tribe HQ',exact:true}).waitFor({state:'hidden'});
     assert.deepEqual(errors,[],kind+' '+width+' unhandled browser errors');
     console.log('PASS '+kind+' '+width+'px: startup, mobile menu, all taming tabs, search, Rex, Aberration zones, crafting, breeding, atlas');
    }catch(error){console.error('Mobile scenario failed:',kind,width, error);throw error;}finally{await ctx.close();}
   }
  }finally{await browser.close();}
 }
}finally{server.kill();}
