import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync(new URL('./OverviewDashboard.jsx',import.meta.url),'utf8');
const css=readFileSync(new URL('./overview-dashboard.css',import.meta.url),'utf8');
const app=readFileSync(new URL('./main.jsx',import.meta.url),'utf8');

test('Overview is the real dashboard wired to existing shared data and navigation',()=>{
 for(const feature of ["<OverviewDashboard","user={cloud.user}","live={live}","servers={servers}","onNavigate={key=>setPage(key)}","onOpenTaming={()=>setPage(lastTamingMode)}","onOpenTimer={()=>setPage(cloud.user?'timers':'cloud')}"])
  assert.ok(app.includes(feature),feature);
 for(const feature of ['live.timers','live.crafting','servers.filter','statusClass','ActiveTimer','ServerCard','onNavigate','onOpenTimer','onOpenTaming'])
  assert.ok(page.includes(feature),feature);
});
test('Overview reads real timer progress and maturation milestones without fake statistics',()=>{
 for(const feature of ["timer.created","timer.end","progress.toFixed(1)","10% Juvenile","50% Adolescent","100% Adult"])
  assert.ok(page.includes(feature),feature);
 assert.ok(page.includes("timers.filter(t=>t.end>now)"));
 assert.ok(page.includes("active.filter(t=>isMaturation(t)).length"));
 assert.ok(page.includes("crafting.length"));
 assert.ok(page.includes("servers.filter(s=>s.status==='Available').length"));
 assert.doesNotMatch(page,/Math\.random\(|mockServers|fakeTimers/);
});
test('Theme-aware dashboard inherits all theme tokens while semantic operations retain colors',()=>{
 for(const token of ['--ark-accent','--ark-heading','--ark-surface','--ark-muted','--ark-line','--personality-hero','--personality-border'])
  assert.ok(css.includes(token),token);
 for(const category of ['breeding','taming','crafting','custom'])assert.ok(css.includes(category),category);
 assert.ok(css.includes('@media(max-width:480px)'));
 assert.ok(css.includes('prefers-reduced-motion'));
});
test('Recent activity presents records, not a fictional event history',()=>{
 assert.ok(page.includes('Recent Shared Items'));
 assert.ok(page.includes('A full event-history feed is not yet available.'));
 assert.ok(page.includes('timers.filter(t=>Number.isFinite(t.created))'));
 assert.ok(page.includes('servers.filter(s=>Number.isFinite(s.updated))'));
});
