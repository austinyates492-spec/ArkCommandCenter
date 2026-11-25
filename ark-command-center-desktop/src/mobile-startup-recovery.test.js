import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const mobile=readFileSync(new URL('./MobileInstall.jsx',import.meta.url),'utf8');
const main=readFileSync(new URL('./main.jsx',import.meta.url),'utf8');
const page=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const sw=readFileSync(new URL('../public/sw.js',import.meta.url),'utf8');
test('mobile install banner never crashes when Safari blocks session storage',()=>{
 assert.ok(mobile.includes("try{return sessionStorage.getItem('ark.mobileInstallDismissed')"));
 assert.ok(mobile.includes('catch{return false;}'));
 assert.ok(mobile.includes("window.matchMedia?.("));
 assert.ok(mobile.includes('}catch{/* Storage can be unavailable'));
});
test('React renders a recoverable error rather than an empty root',()=>{
 assert.ok(main.includes('class AppErrorBoundary extends React.Component'));
 assert.ok(main.includes('static getDerivedStateFromError(error)'));
 assert.ok(main.includes('<AppErrorBoundary><App/></AppErrorBoundary>'));
 assert.ok(main.includes("couldn't load"));
});
test('independent startup watchdog explains blank screen and allows cache repair',()=>{
 for(const part of ['renderRecovery','ARK Tribe HQ could not start','Refresh App Files','getRegistrations','caches.keys()','location.replace','root.replaceChildren(wrapper)','window.setTimeout(renderRecovery,12000)'])assert.ok(page.includes(part),part);
});
test('service worker cannot serve obsolete cached HTML after a release',()=>{
 assert.ok(sw.includes("OLD_CACHE_PREFIX='arktribehq-'"));
 assert.ok(sw.includes('caches.delete'));
 assert.ok(!sw.includes("caches.match('/')"));
 assert.ok(!sw.includes("cache.put('/')"));
 assert.ok(!sw.includes("addEventListener('fetch'"));
});
