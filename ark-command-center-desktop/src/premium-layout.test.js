import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const read=file=>readFileSync(new URL(file,import.meta.url),'utf8');
test('premium layout is fluid from portrait to ultrawide',()=>{
 const css=read('premium.css'),app=read('main.jsx');
 assert.match(app,/import '\.\/premium\.css'/);
 assert.match(css,/max-width:2400px/);
 for(const value of ['430px','800px','980px','1280px','1900px'])assert.ok(css.includes(value));
 assert.match(css,/\.shell \.sidebar\.mobile-open/);
 assert.match(app,/\{mobileNavOpen&&<button/);
});
test('premium layout uses theme palette tokens rather than overriding 25 themes',()=>{
 const css=read('premium.css');
 for(const key of ['--ark-surface','--ark-bg','--ark-accent'])assert.ok(css.includes(key));
 assert.doesNotMatch(css,/data-theme=(emerald|red|purple)/);
});
