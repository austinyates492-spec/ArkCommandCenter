import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const css=readFileSync(new URL('./mobile-polish.css',import.meta.url),'utf8');
const app=readFileSync(new URL('./main.jsx',import.meta.url),'utf8');
const standards=readFileSync(new URL('../../MOBILE_DESIGN_STANDARDS.md',import.meta.url),'utf8');

test('mobile polish comes after all baseline/personality styles',()=>{
 const i=app.indexOf("import './mobile-polish.css'");
 assert.ok(i>app.indexOf("import './personality.css'"));
 assert.ok(i>app.indexOf("import './premium.css'"));
 assert.ok(i>app.indexOf("import './mobile.css'"));
});
test('mobile nav remains keyboard accessible and locks background scroll',()=>{
 for(const fragment of ['if(!mobileNavOpen)return',"document.body.style.overflow='hidden'","document.body.style.overflow=previous","event.key==='Escape'","setMobileNavOpen(false)","aria-expanded={mobileNavOpen}","mobile-nav-backdrop"])assert.ok(app.includes(fragment),fragment);
 for(const fragment of ['position:sticky','overscroll-behavior:contain','safe-area-inset-top','safe-area-inset-bottom','min-height:48px'])assert.ok(css.includes(fragment),fragment);
});
test('mobile polish covers narrow widths and avoids iOS form zoom',()=>{
 for(const fragment of ['@media(max-width:800px)','@media(max-width:430px)','font-size:16px','min-height:44px','max-width:100%','overflow-x:clip','--ark-accent','--ark-surface','--ark-border'])assert.ok(css.includes(fragment),fragment);
});
test('redesigned workspaces stack, remain tappable, and retain compact KPIs',()=>{
 for(const fragment of ['.craftv3-upper','.craftv3-lower','.tribe-v3-top','.tribe-v3-bottom','.intel-v2-layout','.breeding-top-grid','.intel-v2-quick-status','.craftv3-gather-button','.tribe-v3-project','.timer-alerts','.tablewrap','.metrics'])assert.ok(css.includes(fragment),fragment);
 assert.ok(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))'));
});
test('future pages use a mobile-first acceptance standard',()=>{
 for(const fragment of ['375px','390px','430px','44 × 44','No page-wide horizontal scrolling','Visual QA','Regress'])assert.ok(standards.includes(fragment),fragment);
});
