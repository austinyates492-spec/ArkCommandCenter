let context;

function getContext(){
 if(typeof window==='undefined')return null;
 const AudioContextClass=window.AudioContext||window.webkitAudioContext;
 if(!AudioContextClass)return null;
 if(!context)context=new AudioContextClass();
 return context;
}

/** Browser audio must be unlocked by a click or keyboard event on some devices. */
export async function unlockTimerAudio(){
 const ctx=getContext();
 if(!ctx)return false;
 if(ctx.state==='suspended')await ctx.resume();
 return ctx.state==='running';
}

/** Pleasant, self-contained three-note chime; no external audio or network assets. */
export function playTimerAlarm(delaySeconds=0){
 const ctx=getContext();
 if(!ctx||ctx.state!=='running')return false;
 const start=ctx.currentTime+Math.max(0,delaySeconds)+0.01;
 for(const [index,frequency] of [659.25,880,1174.66].entries()){
  const when=start+index*0.17,oscillator=ctx.createOscillator(),gain=ctx.createGain();
  oscillator.type='sine';oscillator.frequency.value=frequency;
  gain.gain.setValueAtTime(0.0001,when);
  gain.gain.exponentialRampToValueAtTime(0.18,when+0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001,when+0.32);
  oscillator.connect(gain);gain.connect(ctx.destination);
  oscillator.start(when);oscillator.stop(when+0.33);
 }
 return true;
}
