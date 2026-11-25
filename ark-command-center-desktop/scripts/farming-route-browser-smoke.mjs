import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium,webkit,devices} from 'playwright';
const origin='http://127.0.0.1:4173';
const server=spawn(process.execPath,['web-server.js'],{stdio:'inherit',env:{...process.env,PORT:'4173'}});
async function waitServer(){for(let i=0;i<60;i++){try{if((await fetch(origin)).ok)return;}catch{}await new Promise(r=>setTimeout(r,500));}throw Error('Server unavailable');}
try{
 await waitServer();
 for(const [engine,label,opts] of [[chromium,'wide desktop',{viewport:{width:2560,height:1400}}],[webkit,'mobile Safari',{...devices['iPhone 13']}]]) {
  const browser=await engine.launch({headless:true});
  try{
   const page=await browser.newPage(opts);
   page.on('pageerror',error=>console.error(label,error));
   await page.goto(origin);await page.locator('.shell').waitFor();
   await page.locator('#ark-boot-intro').waitFor({state:'hidden'});
   const nav=page.getByRole('button',{name:'Open navigation menu'});
   if(await nav.isVisible())await nav.click();
   await page.locator('.sidebar').getByRole('button',{name:'Resource Atlas',exact:true}).click();
   await page.getByRole('tab',{name:'Farming Routes'}).click();
   const group=page.getByRole('group',{name:'Farming route resources'});
   const map=page.locator('.island-map-frame svg');
   await group.waitFor();
   const planner=page.locator('.atlas-v3-planner');
   await planner.getByRole('button',{name:'Deselect All',exact:true}).click();
   assert.equal(await map.locator('g[aria-label*="mapped site"]').count(),0);
   await group.getByRole('button',{name:'Metal',exact:true}).click();
   const markers=map.locator('g[aria-label*="mapped site"]');
   await markers.first().waitFor();
   assert.ok((await markers.evaluateAll(els=>els.map(x=>x.getAttribute('aria-label')))).every(s=>s.startsWith('Metal at latitude')));
   await group.getByRole('button',{name:'Crystal',exact:true}).click();
   await map.locator('g[aria-label^="Crystal at latitude"]').first().waitFor();
   await group.getByRole('button',{name:'Metal',exact:true}).click();
   assert.equal(await map.locator('g[aria-label^="Metal at latitude"]').count(),0);
   await planner.getByRole('button',{name:'Draw Farming Area'}).click();
   await map.scrollIntoViewIfNeeded();
   async function corner(fx,fy,i){
    const target=await map.evaluate((svg,{fx,fy})=>{
     const v=svg.viewBox.baseVal,p=svg.createSVGPoint();p.x=v.x+v.width*fx;p.y=v.y+v.height*fy;const s=p.matrixTransform(svg.getScreenCTM());return {x:s.x,y:s.y,mx:p.x,my:p.y};
    },{fx,fy});
    if(label==='mobile Safari')await page.touchscreen.tap(target.x,target.y);else await page.mouse.click(target.x,target.y);
    const marker=map.locator('[data-area-corner="'+i+'"] circle');await marker.waitFor();
    const coords=await marker.evaluate(el=>({x:Number(el.getAttribute('cx')),y:Number(el.getAttribute('cy'))}));
    assert.ok(Math.abs(coords.x-target.mx)<4&&Math.abs(coords.y-target.my)<4,label+' corner '+i+' at '+JSON.stringify(coords)+' expected '+JSON.stringify(target));
   }
   await corner(.25,.25,1);await corner(.75,.25,2);await corner(.75,.65,3);
   if(label==='wide desktop'){
    const b=await map.boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.wheel(0,-450);
    await page.waitForFunction(()=>document.querySelector('.island-map-frame svg').viewBox.baseVal.width<900);
    await corner(.35,.55,4);
   }
   console.log('PASS '+label+': selected resources change markers; repeated polygon corners match pointer coordinates.');
  }finally{await browser.close();}
 }
}finally{server.kill();}
