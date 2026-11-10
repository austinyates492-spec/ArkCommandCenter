import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';

const root=new URL('../',import.meta.url);
const read=file=>readFileSync(new URL(file,root),'utf8');

test('mobile site and installable app use a collapsible accessible navigation drawer',()=>{
 const jsx=read('src/main.jsx');
 const css=read('src/mobile.css');
 assert.match(jsx,/aria-label="Open navigation menu"/);
 assert.match(jsx,/aria-expanded=\{mobileNavOpen\}/);
 assert.match(jsx,/aria-controls="ark-primary-nav"/);
 assert.match(jsx,/setMobileNavOpen\(false\)/);
 assert.match(css,/\.shell:not\(\.tauri-desktop\) \.sidebar\.mobile-open/);
 assert.match(css,/translateX\(-105%\)/);
 assert.match(css,/\.shell:not\(\.tauri-desktop\)/);
});

test('web app has standalone install manifest, icons, and a network-first offline shell',()=>{
 const manifest=JSON.parse(read('public/manifest.webmanifest'));
 assert.equal(manifest.display,'standalone');
 assert.equal(manifest.orientation,'any');
 assert.equal(manifest.start_url,'/');
 for(const size of [192,512]){
  assert.ok(manifest.icons.some(icon=>icon.sizes===`${size}x${size}`));
  assert.ok(existsSync(new URL(`public/icons/arktribehq-${size}.png`,root)));
 }
 const sw=read('public/sw.js');
 assert.match(sw,/request\.mode==='navigate'/);
 assert.match(sw,/fetch\(request\)/);
 assert.match(sw,/caches\.match\('\/'\)/);
});

test('ads stay inactive without approval, account details, and explicit enablement',()=>{
 const ad=read('src/AdPlacement.jsx');
 assert.match(ad,/VITE_ADSENSE_ENABLED==='true'/);
 assert.match(ad,/VITE_ADSENSE_CLIENT_ID/);
 assert.match(ad,/VITE_ADSENSE_SLOT_ID/);
 assert.match(ad,/if\(!enabled\)return null/);
});

test('SEO and mobile app URLs canonicalize to the www host',()=>{
 const html=read('index.html');
 assert.match(html,/rel="canonical" href="https:\/\/www\.arktribehq\.com\/"/);
 assert.match(html,/rel="manifest" href="\/manifest\.webmanifest"/);
 assert.match(read('public/sitemap.xml'),/https:\/\/www\.arktribehq\.com\//);
});
