import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const src=readFileSync(new URL('./LiveTimersPage.jsx',import.meta.url),'utf8');
const live=readFileSync(new URL('./tribe-live.js',import.meta.url),'utf8');

test('new timers use a synced slider and hours/minutes/seconds fields',()=>{
 for(const entry of ['Quick duration','quick slider','Hours','Minutes','Seconds','CreateTimer','timer-category-choices','live.addTimer','sound'])assert.ok(src.includes(entry),entry);
});
test('existing timer cards edit their own ID and preserve sound toggle',()=>{
 for(const entry of ['TimerAdjustment','Time remaining','Total duration','Growth %','+1h','editTimer(timer.id','expectedEnd:timer.end','reopen','setTimerSound(timer.id'])assert.ok(src.includes(entry),entry);
 assert.match(live,/editTimer:\(id,edit\)=>perform/);
});
test('timer category colors and responsive progress are present',()=>{
 const css=readFileSync(new URL('./live-timer-redesign.css',import.meta.url),'utf8');
 for(const entry of ['timer-tone-breeding','timer-tone-taming','timer-tone-crafting','timer-tone-custom','timer-progress-track','timer-page-grid'])assert.ok(css.includes(entry),entry);
 assert.match(css,/@media\(max-width:650px\)/);
});
