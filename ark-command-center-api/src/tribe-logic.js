export function normalizeTimer(input,now=Date.now()){
 const name=String(input?.name||'').trim();
 const type=String(input?.type||'Custom').trim();
 const minutes=Number(input?.minutes);
 if(name.length<1||name.length>120)throw new Error('Timer name must be 1–120 characters.');
 if(type.length<1||type.length>60)throw new Error('Timer type must be 1–60 characters.');
 if(!Number.isFinite(minutes)||minutes<=0||minutes>525600)throw new Error('Timer must be between 1 second and one year.');
 return {name,type,created:now,end:now+Math.round(minutes*60000)};
}
/** Validate a tribe-wide countdown correction. The duration remains the timer's baseline. */
export function normalizeTimerAdjustment(input){
 const remainingMinutes=Number(input?.remainingMinutes);
 if(!Number.isFinite(remainingMinutes)||remainingMinutes<0||remainingMinutes>525600)throw new Error('Remaining time must be between 0 and one year.');
 const expectedEnd=Number(input?.expectedEnd);
 if(!Number.isSafeInteger(expectedEnd)||expectedEnd<=0)throw new Error('Refresh this timer before changing it.');
 return {remainingMinutes,expectedEnd};
}
/** Edit an existing shared timer without changing its ID or sound preferences. */
export function normalizeTimerEdit(input){
 const expectedEnd=Number(input?.expectedEnd);
 if(!Number.isSafeInteger(expectedEnd)||expectedEnd<=0)throw new Error('Refresh this timer before editing.');
 const mode=String(input?.mode||'');
 if(!['remaining','total','extend'].includes(mode))throw new Error('Choose remaining time, total duration, or an extension.');
 const minutes=Number(input?.minutes);
 if(!Number.isFinite(minutes)||minutes<=0||minutes>525600)throw new Error('Duration must be between 1 second and one year.');
 const name=String(input?.name||'').trim();
 const type=String(input?.type||'Custom').trim();
 if(name.length<1||name.length>120)throw new Error('Timer name must be 1–120 characters.');
 if(type.length<1||type.length>60)throw new Error('Timer category must be 1–60 characters.');
 return {expectedEnd,mode,minutes,name,type,reopen:input?.reopen===true};
}
/** A sound preference always belongs to the signed-in member, not the shared timer. */
export function normalizeTimerSound(input){
 if(typeof input?.enabled!=='boolean')throw new Error('Timer sound must be enabled or disabled.');
 return {enabled:input.enabled};
}
export function normalizeCrafting(input){
 const name=String(input?.name||'').trim();
 const quantity=Number(input?.quantity);
 if(name.length<1||name.length>160)throw new Error('Choose a valid recipe name.');
 if(!Number.isSafeInteger(quantity)||quantity<1||quantity>1000000)throw new Error('Quantity must be 1–1,000,000.');
 return {name,quantity};
}
export function normalizeServer(input){
 const map=String(input?.map||'').trim();
 const name=String(input?.name||'').trim();
 const status=String(input?.status||'Unscouted');
 const notes=String(input?.notes||'').trim();
 if(map.length<1||map.length>80||name.length<1||name.length>120)throw new Error('Map and server name are required.');
 if(!['Available','Contested','Locked Down','Unscouted'].includes(status))throw new Error('Unknown server status.');
 if(notes.length>3000)throw new Error('Server notes cannot exceed 3,000 characters.');
 return {map,name,status,notes,serverKey:`${map.toLowerCase()}|${name.toLowerCase()}`};
}
export function serializeTimer(row){return {id:row.id,name:row.name,type:row.type,created:Number(row.created_ms),end:Number(row.end_ms),createdBy:row.display_name||null};}
export function serializeServer(row){return {id:row.id,map:row.map,name:row.name,status:row.status,notes:row.notes,updated:Number(row.updated_ms),updatedBy:row.display_name||null};}
export function serializeCraft(row){return {name:row.name,quantity:row.quantity,updatedBy:row.display_name||null};}
