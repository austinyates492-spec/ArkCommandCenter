import assert from 'node:assert/strict';
import test from 'node:test';
import {collectDueTimerAlarms,createTimerAlarmTracker} from './timer-alarms.js';

const sample={id:'timer-a',name:'Karkinos tame',end:5000};
const due=(tracker,now,sounds={},memberId='tribe-user',ready=true,timers=[sample])=>collectDueTimerAlarms(tracker,{memberId,timers,now,sounds,ready});

test('rings once after an observed timer ends, regardless of which app tab is open',()=>{
 const tracker=createTimerAlarmTracker();
 assert.deepEqual(due(tracker,4000),[]);
 assert.deepEqual(due(tracker,5000).map(x=>x.id),['timer-a']);
 assert.deepEqual(due(tracker,6000),[]);
 assert.deepEqual(due(tracker,7000),[]);
});
test('does not replay historic completed timers on login or reconnect',()=>{
 const tracker=createTimerAlarmTracker();
 assert.deepEqual(due(tracker,8000),[]);
 assert.deepEqual(due(tracker,9000),[]);
});
test('per-user per-timer mute never rings, even if unmuted after expiry',()=>{
 const tracker=createTimerAlarmTracker();
 due(tracker,4000,{'timer-a':false});
 assert.deepEqual(due(tracker,5000,{'timer-a':false}),[]);
 assert.deepEqual(due(tracker,6000,{'timer-a':true}),[]);
});
test('different account gets its own timer tracking and sound choice',()=>{
 const tracker=createTimerAlarmTracker();
 due(tracker,4000,{'timer-a':false},'alice');
 assert.deepEqual(due(tracker,5000,{'timer-a':false},'alice'),[]);
 due(tracker,4000,{},'bob');
 assert.deepEqual(due(tracker,5000,{},'bob').map(x=>x.id),['timer-a']);
});
test('waits for sound preference loading and removes deleted timers',()=>{
 const tracker=createTimerAlarmTracker();
 due(tracker,4000,{},'alice',false);
 assert.deepEqual(due(tracker,4000,{'timer-a':false},'alice'),[]);
 assert.deepEqual(due(tracker,5000,{'timer-a':false},'alice'),[]);
 due(tracker,6000,{},'alice',true,[]);
 assert.equal(tracker.seenActive.size,0);
});
