import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const src=readFileSync(new URL('./LiveTimersPage.jsx',import.meta.url),'utf8');
const live=readFileSync(new URL('./tribe-live.js',import.meta.url),'utf8');

test('new timers use a synced slider and hours/minutes/seconds fields',()=>{
 for(const entry of ['Quick duration','quick slider','Hours','Minutes','Seconds','CreateTimer','timer-category-choices','live.addTimer','sound'])assert.ok(src.includes(entry),entry);
});
test('existing timer cards edit their own ID and preserve sound toggle',()=>{
 for(const entry of ['TimerAdjustment','Time remaining','Total duration','Growth %','m===60','editTimer(timer.id','expectedEnd:timer.end','reopen','setTimerSound(timer.id'])assert.ok(src.includes(entry),entry);
 assert.match(live,/editTimer:\(id,edit\)=>perform/);
});
test('timer category colors and responsive progress are present',()=>{
 const css=readFileSync(new URL('./live-timer-redesign.css',import.meta.url),'utf8');
 for(const entry of ['timer-tone-breeding','timer-tone-taming','timer-tone-crafting','timer-tone-custom','timer-progress-track','timer-page-grid'])assert.ok(css.includes(entry),entry);
 assert.match(css,/@media\(max-width:650px\)/);
});

test('timer cards show one overall completion percent and breeding maturity phase markers',()=>{
 const css=readFileSync(new URL('./live-timer-redesign.css',import.meta.url),'utf8');
 assert.match(src,/className="timer-overall-progress"/);
 assert.match(src,/progress\.toFixed\(1\)/);
 assert.match(src,/maturation&&<div className="timer-phase-header"/);
 for(const label of ['10%</b> Juvenile','50%</b> Adolescent','100%</b> Adult','Current phase: '])assert.ok(src.includes(label),label);
 assert.match(src,/maturation\?\x27 timer-progress-phased\x27/);
 assert.match(css,/\.timer-milestone-juvenile\{left:10%\}/);
 assert.match(css,/\.timer-milestone-adolescent\{left:50%\}/);
 assert.match(css,/\.timer-phase-header/);
 assert.match(src,/aria-valuenow=\{Number\(progress\.toFixed\(1\)\)\}/);
 assert.doesNotMatch(src,/phaseProgress|babyProgress|juvenileProgress|adolescentProgress/);
});
test('incubation does not receive creature maturation milestones',()=>{
 assert.ok(src.includes("timer.type==='Maturation'"));
 assert.ok(src.includes('/incubat|hatch|gestat|mating|cooldown/i'));
});
