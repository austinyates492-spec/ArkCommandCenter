/** Tracks expirations that were actually observed counting down while this account was open. */
export function createTimerAlarmTracker(){
 return {memberId:null,seenActive:new Set(),completed:new Set()};
}

export function collectDueTimerAlarms(tracker,{memberId,timers=[],now,sounds={},ready=false}){
 if(tracker.memberId!==memberId){
  tracker.memberId=memberId;
  tracker.seenActive.clear();
  tracker.completed.clear();
 }
 if(!memberId||!ready)return [];
 const present=new Set(),due=[];
 for(const timer of timers){
  if(!timer?.id||!Number.isFinite(timer.end))continue;
  present.add(timer.id);
  if(timer.end>now){tracker.seenActive.add(timer.id);continue;}
  if(!tracker.seenActive.has(timer.id)||tracker.completed.has(timer.id))continue;
  tracker.completed.add(timer.id);
  if(sounds[timer.id]!==false)due.push(timer);
 }
 for(const id of tracker.seenActive)if(!present.has(id))tracker.seenActive.delete(id);
 for(const id of tracker.completed)if(!present.has(id))tracker.completed.delete(id);
 return due;
}
