import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeScoutingNote,serializeScoutingNote,scoutingNoteCategories} from '../src/scouting-notes.js';
import {readFileSync} from 'node:fs';
const routes=readFileSync(new URL('../src/tribe-routes.js',import.meta.url),'utf8');
test('typed notes require a supported category and meaningful text',()=>{
 assert.deepEqual(scoutingNoteCategories,['Major Tribe','Dangerous Area','General Intel']);
 assert.deepEqual(normalizeScoutingNote({type:'Dangerous Area',text:'  South cave turret wall  '}),{type:'Dangerous Area',text:'South cave turret wall'});
 assert.throws(()=>normalizeScoutingNote({type:'Unknown',text:'Report'}),/category/);
 assert.throws(()=>normalizeScoutingNote({type:'Major Tribe',text:'  '}),/1–1,500/);
 assert.throws(()=>normalizeScoutingNote({type:'Major Tribe',text:'x'.repeat(1501)}),/1–1,500/);
});
test('shared server notes expose member and time, without personal ids',()=>{
 assert.deepEqual(serializeScoutingNote({id:'a',server_id:'b',type:'Major Tribe',text:'Alpha controls cave',created_ms:'1732332000000',display_name:'Scout'}),{id:'a',serverId:'b',type:'Major Tribe',text:'Alpha controls cave',created:1732332000000,updatedBy:'Scout'});
});
test('server-scoped database notes and tribe events follow existing permissions',()=>{
 for(const fragment of ['CREATE TABLE IF NOT EXISTS tribe_scouting_notes','ON DELETE CASCADE','n.tribe_id=$1','s.id=$3 AND s.tribe_id=$2','id=$1 AND server_id=$2 AND tribe_id=$3',"notify(pool,user.tribe_id,'servers')",'scoutingNotes:byServer.get(row.id)||[]']) assert.ok(routes.includes(fragment),fragment);
 assert.match(routes,/const noteCollection=\/(?:\\\/|.)+notes\$\/i\.exec\(path\)/);
});
