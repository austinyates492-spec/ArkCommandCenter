import {randomUUID} from 'node:crypto';
import {Client} from 'pg';
import {normalizeTimer,normalizeTimerAdjustment,normalizeTimerEdit,normalizeTimerSound,normalizeCrafting,normalizeServer,serializeTimer,serializeServer,serializeCraft} from './tribe-logic.js';

// Every stream is bound to its authenticated tribe. Never broadcast other tribes' events.
const clients=new Map();
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const send=(res,event,data)=>res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

export function parseTribeEvent(raw){
 let event;try{event=JSON.parse(raw);}catch{return null;}
 if(!event||typeof event.tribeId!=='string'||typeof event.topic!=='string')return null;
 if(!UUID.test(event.tribeId)||!['timers','timer-sounds','crafting','servers'].includes(event.topic))return null;
 return {tribeId:event.tribeId,topic:event.topic};
}

export async function initializeTribeTables(pool){
 await pool.query(`CREATE TABLE IF NOT EXISTS tribe_timers (
   id UUID PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL,
   created_ms BIGINT NOT NULL, end_ms BIGINT NOT NULL,
   created_by UUID REFERENCES members(id) ON DELETE SET NULL
 )`);
 await pool.query(`CREATE TABLE IF NOT EXISTS member_timer_sounds (
   member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
   timer_id UUID NOT NULL REFERENCES tribe_timers(id) ON DELETE CASCADE,
   enabled BOOLEAN NOT NULL DEFAULT TRUE,
   PRIMARY KEY(member_id,timer_id)
 )`);
 await pool.query(`CREATE TABLE IF NOT EXISTS tribe_crafting (
   name TEXT PRIMARY KEY, quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 1000000),
   updated_by UUID REFERENCES members(id) ON DELETE SET NULL,
   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`);
 await pool.query(`CREATE TABLE IF NOT EXISTS tribe_servers (
   id UUID PRIMARY KEY, server_key TEXT UNIQUE NOT NULL,
   map TEXT NOT NULL,name TEXT NOT NULL,status TEXT NOT NULL,notes TEXT NOT NULL,
   updated_ms BIGINT NOT NULL,
   updated_by UUID REFERENCES members(id) ON DELETE SET NULL
 )`);
 await pool.query('CREATE TABLE IF NOT EXISTS schema_meta (key TEXT PRIMARY KEY, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');
 await pool.query(`CREATE TABLE IF NOT EXISTS tribe_timers_v2 (
   id UUID PRIMARY KEY, tribe_id UUID NOT NULL REFERENCES tribes(id),
   name TEXT NOT NULL,type TEXT NOT NULL,created_ms BIGINT NOT NULL,end_ms BIGINT NOT NULL,
   created_by UUID REFERENCES members(id) ON DELETE SET NULL
 )`);
 await pool.query('CREATE INDEX IF NOT EXISTS tribe_timers_v2_by_tribe ON tribe_timers_v2(tribe_id,end_ms)');
 await pool.query(`CREATE TABLE IF NOT EXISTS member_timer_sounds_v2 (
   member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
   timer_id UUID NOT NULL REFERENCES tribe_timers_v2(id) ON DELETE CASCADE,
   enabled BOOLEAN NOT NULL DEFAULT TRUE,PRIMARY KEY(member_id,timer_id)
 )`);
 await pool.query(`CREATE TABLE IF NOT EXISTS tribe_crafting_v2 (
   tribe_id UUID NOT NULL REFERENCES tribes(id),name TEXT NOT NULL,
   quantity INTEGER NOT NULL CHECK(quantity BETWEEN 1 AND 1000000),
   updated_by UUID REFERENCES members(id) ON DELETE SET NULL,
   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),PRIMARY KEY(tribe_id,name)
 )`);
 await pool.query(`CREATE TABLE IF NOT EXISTS tribe_servers_v2 (
   id UUID PRIMARY KEY,tribe_id UUID NOT NULL REFERENCES tribes(id),
   server_key TEXT NOT NULL,map TEXT NOT NULL,name TEXT NOT NULL,status TEXT NOT NULL,
   notes TEXT NOT NULL,updated_ms BIGINT NOT NULL,
   updated_by UUID REFERENCES members(id) ON DELETE SET NULL,UNIQUE(tribe_id,server_key)
 )`);

 // Import the old shared server snapshot exactly once; repeated deploys never resurrect deleted entries.
 const client=await pool.connect();
 try{
  await client.query('BEGIN');await client.query('SELECT pg_advisory_xact_lock(728312)');
  const marker=await client.query("SELECT key FROM schema_meta WHERE key='migrate-servers-live-v1'");
  if(!marker.rows.length){
   const old=await client.query("SELECT data FROM tribe_state WHERE name='servers'");
   const legacy=old.rows[0]?.data?.servers||[];
   if(Array.isArray(legacy))for(const entry of legacy){
    let data;try{data=normalizeServer(entry);}catch{continue;}
    const id=UUID.test(entry.id||'')?entry.id:randomUUID();
    await client.query(`INSERT INTO tribe_servers(id,server_key,map,name,status,notes,updated_ms)
      VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(server_key) DO NOTHING`,
      [id,data.serverKey,data.map,data.name,data.status,data.notes,Number(entry.updated)||Date.now()]);
   }
   await client.query("INSERT INTO schema_meta(key) VALUES('migrate-servers-live-v1')");
  }
   const v2=await client.query("SELECT key FROM schema_meta WHERE key='migrate-tribes-v2'");
   if(!v2.rows.length){
    const {rows}=await client.query('SELECT id FROM tribes WHERE legacy=TRUE LIMIT 1');
    if(!rows.length)throw new Error('Original tribe migration record missing.');
    const tribeId=rows[0].id;
    await client.query(`INSERT INTO tribe_timers_v2(id,tribe_id,name,type,created_ms,end_ms,created_by)
       SELECT id,$1,name,type,created_ms,end_ms,created_by FROM tribe_timers WHERE TRUE ON CONFLICT(id) DO NOTHING`,[tribeId]);
    await client.query(`INSERT INTO member_timer_sounds_v2(member_id,timer_id,enabled)
       SELECT m.member_id,m.timer_id,m.enabled FROM member_timer_sounds m
       WHERE EXISTS(SELECT 1 FROM tribe_timers_v2 t WHERE t.id=m.timer_id)
       ON CONFLICT(member_id,timer_id) DO NOTHING`);
    await client.query(`INSERT INTO tribe_crafting_v2(tribe_id,name,quantity,updated_by,updated_at)
       SELECT $1,name,quantity,updated_by,updated_at FROM tribe_crafting WHERE TRUE
       ON CONFLICT(tribe_id,name) DO NOTHING`,[tribeId]);
    await client.query(`INSERT INTO tribe_servers_v2(id,tribe_id,server_key,map,name,status,notes,updated_ms,updated_by)
       SELECT id,$1,server_key,map,name,status,notes,updated_ms,updated_by FROM tribe_servers WHERE TRUE
       ON CONFLICT(id) DO NOTHING`,[tribeId]);
    await client.query(`INSERT INTO tribe_server_snapshots(tribe_id,data,version,updated_at)
       SELECT $1,data,version,updated_at FROM tribe_state WHERE name='servers'
       ON CONFLICT(tribe_id) DO NOTHING`,[tribeId]);
    await client.query("INSERT INTO schema_meta(key) VALUES('migrate-tribes-v2')");
   }
   await client.query('COMMIT');
 }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
}

export async function startTribeBroadcast(databaseUrl){
 let reconnectTimer=null;
 async function connect(){
  const listener=new Client({connectionString:databaseUrl});
  listener.on('notification',message=>{
   if(message.channel!=='tribe_updates')return;
   const event=parseTribeEvent(message.payload);
   if(!event)return;
   for(const [res,tribeId] of clients){
    if(tribeId!==event.tribeId)continue;
    try{send(res,'tribe',{topic:event.topic});}catch{clients.delete(res);}
   }
  });
  listener.on('error',error=>console.error('Tribe live listener error:',error.code||error.message));
  listener.on('end',()=>{if(!reconnectTimer)reconnectTimer=setTimeout(()=>{reconnectTimer=null;void connect();},2500);});
  try{await listener.connect();await listener.query('LISTEN tribe_updates');console.info('Tribe live events connected');}
  catch(error){console.error('Tribe live listener unavailable:',error.code||error.message);await listener.end().catch(()=>{});if(!reconnectTimer)reconnectTimer=setTimeout(()=>{reconnectTimer=null;void connect();},2500);}
 }
 await connect();
}

async function notify(pool,tribeId,topic){await pool.query('SELECT pg_notify($1,$2)',['tribe_updates',JSON.stringify({tribeId,topic})]);}
function bad(message){throw Object.assign(new Error(message),{status:400});}
function validated(fn,input){try{return fn(input);}catch(e){bad(e.message);}}
function listOf(rows,serializer){return rows.map(serializer);}

export async function handleTribe(req,res,options){
 const {pool,authorize,bodyJson,json}=options;
 const path=new URL(req.url,'http://localhost').pathname;
 const method=req.method;
 if(path==='/api/v1/events'&&method==='GET'){
  const user=await authorize(req);
  res.writeHead(200,{'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'});
  send(res,'connected',{ok:true});clients.set(res,user.tribe_id);
  const heartbeat=setInterval(()=>{if(!res.writableEnded)res.write(': heartbeat\n\n');},20000);
  res.on('close',()=>{clients.delete(res);clearInterval(heartbeat);});
  return true;
 }
 if(!path.startsWith('/api/v1/tribe/'))return false;
 const user=await authorize(req);

 if(path==='/api/v1/tribe/timers'){
  if(method==='GET'){
   const {rows}=await pool.query(`SELECT t.*,m.display_name FROM tribe_timers_v2 t LEFT JOIN members m ON m.id=t.created_by
     WHERE t.tribe_id=$1 ORDER BY t.end_ms ASC LIMIT 1000`,[user.tribe_id]);
   return json(res,200,{timers:listOf(rows,serializeTimer),serverTime:Date.now()})||true;
  }
  if(method==='POST'){
   const input=await bodyJson(req),timer=validated(normalizeTimer,input),id=randomUUID();
   const soundEnabled=input.soundEnabledForCreator===undefined?true:validated(normalizeTimerSound,{enabled:input.soundEnabledForCreator}).enabled;
   const client=await pool.connect();let row;
   try{
    await client.query('BEGIN');
    const {rows}=await client.query(`INSERT INTO tribe_timers_v2(id,tribe_id,name,type,created_ms,end_ms,created_by)
      VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,[id,user.tribe_id,timer.name,timer.type,timer.created,timer.end,user.id]);
    row=rows[0];
    if(!soundEnabled)await client.query('INSERT INTO member_timer_sounds_v2(member_id,timer_id,enabled) VALUES($1,$2,FALSE)',[user.id,id]);
    await client.query('COMMIT');
   }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
   await notify(pool,user.tribe_id,'timers');
   if(!soundEnabled)await notify(pool,user.tribe_id,'timer-sounds');
   json(res,201,{timer:serializeTimer({...row,display_name:user.display_name})});return true;
  }
 }
 if(path==='/api/v1/tribe/timers/sounds'&&method==='GET'){
  const {rows}=await pool.query(`SELECT s.timer_id,s.enabled FROM member_timer_sounds_v2 s
    JOIN tribe_timers_v2 t ON t.id=s.timer_id WHERE s.member_id=$1 AND t.tribe_id=$2`,[user.id,user.tribe_id]);
  json(res,200,{sounds:Object.fromEntries(rows.map(row=>[row.timer_id,row.enabled]))});return true;
 }
 const soundMatch=/^\/api\/v1\/tribe\/timers\/([a-f0-9-]{36})\/sound$/i.exec(path);
 if(method==='PUT'&&soundMatch){
  if(!UUID.test(soundMatch[1]))bad('Invalid timer ID.');
  const {enabled}=validated(normalizeTimerSound,await bodyJson(req));
  const {rows}=await pool.query(`INSERT INTO member_timer_sounds_v2(member_id,timer_id,enabled)
    SELECT $1,$2,$3 FROM tribe_timers_v2 WHERE id=$2 AND tribe_id=$4
    ON CONFLICT(member_id,timer_id) DO UPDATE SET enabled=EXCLUDED.enabled
    RETURNING timer_id,enabled`,[user.id,soundMatch[1],enabled,user.tribe_id]);
  if(!rows.length)throw Object.assign(new Error('This timer has been removed.'),{status:404});
  await notify(pool,user.tribe_id,'timer-sounds');json(res,200,{timerId:rows[0].timer_id,enabled:rows[0].enabled});return true;
 }
 const timerMatch=/^\/api\/v1\/tribe\/timers\/([a-f0-9-]{36})$/i.exec(path);
 if(method==='PUT'&&timerMatch){
  if(!UUID.test(timerMatch[1]))bad('Invalid timer ID.');
  const input=await bodyJson(req);
  if(input?.mode){
   const edit=validated(normalizeTimerEdit,input);
   const client=await pool.connect();let row;
   try{
    await client.query('BEGIN');
    const found=await client.query('SELECT * FROM tribe_timers_v2 WHERE id=$1 AND tribe_id=$2 FOR UPDATE',[timerMatch[1],user.tribe_id]);
    if(!found.rows.length)throw Object.assign(new Error('Timer not found.'),{status:404});
    const previous=found.rows[0],now=Date.now();
    if(Number(previous.end_ms)!==edit.expectedEnd)throw Object.assign(new Error('Timer changed on another device. Refresh before saving.'),{status:409});
    if(Number(previous.end_ms)<=now&&!edit.reopen)throw Object.assign(new Error('Completed timers require explicit reopen confirmation.'),{status:409});
    const delta=Math.round(edit.minutes*60000);
    const created=edit.reopen&&Number(previous.end_ms)<=now?now:Number(previous.created_ms);
    const end=edit.mode==='total'?created+delta:edit.mode==='extend'?Math.max(now,Number(previous.end_ms))+delta:now+delta;
    if(end<=now&&!edit.reopen)throw Object.assign(new Error('New duration has already completed. Choose more time.'),{status:400});
    const updated=await client.query('UPDATE tribe_timers_v2 SET name=$1,type=$2,created_ms=$3,end_ms=$4 WHERE id=$5 AND tribe_id=$6 RETURNING *',[edit.name,edit.type,created,end,timerMatch[1],user.tribe_id]);
    row=updated.rows[0];
    await client.query('COMMIT');
   }catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}
   await notify(pool,user.tribe_id,'timers');
   json(res,200,{timer:serializeTimer({...row,display_name:user.display_name})});return true;
  }
  const adjustment=validated(normalizeTimerAdjustment,input);
  const client=await pool.connect();let row;
  try{
   await client.query('BEGIN');
   const found=await client.query('SELECT * FROM tribe_timers_v2 WHERE id=$1 AND tribe_id=$2 FOR UPDATE',[timerMatch[1],user.tribe_id]);
   if(!found.rows.length)throw Object.assign(new Error('Timer not found.'),{status:404});
   const previous=found.rows[0];
   if(Number(previous.end_ms)!==adjustment.expectedEnd)throw Object.assign(new Error('Timer changed on another device. Refresh before saving.'),{status:409});
   const now=Date.now();
   const duration=Math.max(1000,Number(previous.end_ms)-Number(previous.created_ms));
   const remaining=Math.round(adjustment.remainingMinutes*60000);
   const elapsed=Math.max(0,duration-Math.min(duration,remaining));
   const updated=await client.query('UPDATE tribe_timers_v2 SET created_ms=$1,end_ms=$2 WHERE id=$3 AND tribe_id=$4 RETURNING *',[now-elapsed,now+remaining,timerMatch[1],user.tribe_id]);
   row=updated.rows[0];
   await client.query('COMMIT');
  }catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}
  await notify(pool,user.tribe_id,'timers');
  json(res,200,{timer:serializeTimer({...row,display_name:user.display_name})});return true;
 }
 if(method==='DELETE'&&timerMatch){
  if(!UUID.test(timerMatch[1]))bad('Invalid timer ID.');
  await pool.query('DELETE FROM tribe_timers_v2 WHERE id=$1 AND tribe_id=$2',[timerMatch[1],user.tribe_id]);
  await notify(pool,user.tribe_id,'timers');json(res,200,{ok:true});return true;
 }

 if(path==='/api/v1/tribe/crafting'){
  if(method==='GET'){
   const {rows}=await pool.query(`SELECT c.*,m.display_name FROM tribe_crafting_v2 c LEFT JOIN members m ON m.id=c.updated_by
     WHERE c.tribe_id=$1 ORDER BY c.name`,[user.tribe_id]);
   json(res,200,{items:listOf(rows,serializeCraft)});return true;
  }
  if(method==='POST'||method==='PUT'){
   const input=await bodyJson(req);
   const item=validated(normalizeCrafting,input);
   if(method==='POST'){
    await pool.query(`INSERT INTO tribe_crafting_v2(tribe_id,name,quantity,updated_by) VALUES($1,$2,$3,$4)
     ON CONFLICT(tribe_id,name) DO UPDATE SET quantity=tribe_crafting_v2.quantity+EXCLUDED.quantity,
     updated_by=$4,updated_at=NOW()`,[user.tribe_id,item.name,item.quantity,user.id]);
   }else{
     const expected=Number(input.expectedQuantity);
     if(!Number.isSafeInteger(expected)||expected<0||expected>1000000)bad('Invalid previous quantity. Refresh and retry.');
     const result=expected===0
       ?await pool.query(`INSERT INTO tribe_crafting_v2(tribe_id,name,quantity,updated_by)
         VALUES($1,$2,$3,$4) ON CONFLICT(tribe_id,name) DO NOTHING RETURNING name`,
         [user.tribe_id,item.name,item.quantity,user.id])
       :await pool.query(`UPDATE tribe_crafting_v2 SET quantity=$3,updated_by=$4,updated_at=NOW()
         WHERE tribe_id=$1 AND name=$2 AND quantity=$5 RETURNING name`,
         [user.tribe_id,item.name,item.quantity,user.id,expected]);
     if(!result.rows.length)throw Object.assign(new Error('Another member changed this quantity. Refresh and retry.'),{status:409});
   }
   await notify(pool,user.tribe_id,'crafting');json(res,200,{ok:true});return true;
  }
  if(method==='DELETE'){
   await pool.query('DELETE FROM tribe_crafting_v2 WHERE tribe_id=$1',[user.tribe_id]);await notify(pool,user.tribe_id,'crafting');json(res,200,{ok:true});return true;
  }
 }
 if(method==='DELETE'&&path.startsWith('/api/v1/tribe/crafting/')){
  let name;try{name=decodeURIComponent(path.slice('/api/v1/tribe/crafting/'.length));}catch{bad('Invalid recipe name.');}
  if(!name||name.length>160)bad('Invalid recipe name.');
  await pool.query('DELETE FROM tribe_crafting_v2 WHERE tribe_id=$1 AND name=$2',[user.tribe_id,name]);
  await notify(pool,user.tribe_id,'crafting');json(res,200,{ok:true});return true;
 }

 if(path==='/api/v1/tribe/servers/live'){
  if(method==='GET'){
   const {rows}=await pool.query(`SELECT s.*,m.display_name FROM tribe_servers_v2 s LEFT JOIN members m ON m.id=s.updated_by
     WHERE s.tribe_id=$1 ORDER BY s.updated_ms DESC`,[user.tribe_id]);
   json(res,200,{servers:listOf(rows,serializeServer)});return true;
  }
  if(method==='POST'){
   const input=validated(normalizeServer,await bodyJson(req));const id=randomUUID();
   await pool.query(`INSERT INTO tribe_servers_v2(id,tribe_id,server_key,map,name,status,notes,updated_ms,updated_by)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT(tribe_id,server_key) DO UPDATE SET
     status=EXCLUDED.status,notes=EXCLUDED.notes,updated_ms=EXCLUDED.updated_ms,updated_by=EXCLUDED.updated_by`,
     [id,user.tribe_id,input.serverKey,input.map,input.name,input.status,input.notes,Date.now(),user.id]);
   await notify(pool,user.tribe_id,'servers');json(res,200,{ok:true});return true;
  }
 }
 const serverMatch=/^\/api\/v1\/tribe\/servers\/live\/([a-f0-9-]{36})$/i.exec(path);
 if(method==='DELETE'&&serverMatch){
  if(!UUID.test(serverMatch[1]))bad('Invalid server ID.');
  await pool.query('DELETE FROM tribe_servers_v2 WHERE id=$1 AND tribe_id=$2',[serverMatch[1],user.tribe_id]);
  await notify(pool,user.tribe_id,'servers');json(res,200,{ok:true});return true;
 }
 return false;
}
