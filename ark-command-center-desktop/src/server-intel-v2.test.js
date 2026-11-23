import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./ServerIntelPage.jsx',import.meta.url),'utf8');
const css=readFileSync(new URL('./server-intel-v2.css',import.meta.url),'utf8');
const live=readFileSync(new URL('./tribe-live.js',import.meta.url),'utf8');
test('tactical scouting board shows counters, filters, cards and collapsible notes',()=>{
 for(const part of ['Server Intel','NEW DESIGN','Server Scouting Board','Scouting Report','intel-v2-summary','intel-v2-card','intel-v2-notes-toggle','aria-expanded={open}','setExpanded','mapFilter','setFilter','Dangerous Area','Major Tribe','General Intel'])assert.ok(source.includes(part),part);
});
test('shared CRUD actions preserve old notes and server actions',()=>{
 for(const part of ['live.saveServer(form)','live.saveServer({map:server.map,name:server.name,status,notes:server.notes||','live.addScoutingNote(server.id,draft.type,draft.text.trim())','live.removeScoutingNote(server.id,note.id)','live.removeServer(server.id)','importOld','server.notes','server.scoutingNotes','live.refresh(\'servers\')'])assert.ok(source.includes(part),part);
 assert.ok(live.includes('addScoutingNote:(serverId,type,text)'));
 assert.ok(live.includes('removeScoutingNote:(serverId,noteId)'));
});
test('status colors remain distinguishable across themes and mobile',()=>{
 for(const part of ['--ark-accent','--ark-bright','--ark-surface','--personality-border','--intel-tone','#61d8a0','#f5c271','#f38188','@media(max-width:480px)'])assert.ok(css.includes(part),part);
});
