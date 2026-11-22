import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('dashboard places unconscious upkeep after ammo in the knockout module',()=>{
 const src=readFileSync(new URL('./TamingLab.jsx',import.meta.url),'utf8');
 const profile=src.indexOf('className="panel taming-combined-panel"');
 const tools=src.indexOf('className="taming-dashboard-tools"');
 const tame=src.indexOf('className="panel taming-dashboard-tame"');
 const knockout=src.indexOf('className="panel knockout-panel taming-knockout-card"');
 const ammo=src.indexOf('<h3>Tranquilizer Options</h3>');
 const upkeep=src.indexOf('className="taming-maintenance-inline"');
 const knockoutEnd=src.indexOf('   </section>}',knockout);
 assert.ok(profile>=0&&profile<tools&&tools<tame&&tame<knockout&&knockout<ammo&&ammo<upkeep&&upkeep<knockoutEnd);
 assert.doesNotMatch(src,/className="panel knockout-panel taming-torpor-maintenance-card"/);
 for(const text of ['Wild torpor drain multiplier','Current torpor','Tame duration override','maintenance.rows.map','Keep It Unconscious'])assert.ok(src.includes(text),text);
});
