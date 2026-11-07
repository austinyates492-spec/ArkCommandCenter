import {randomUUID} from 'node:crypto';
import {Client} from 'pg';
import {normalizeTimer,normalizeCrafting,normalizeServer,serializeTimer,serializeServer,serializeCraft} from './tribe-logic.js';

const clients=new Set();
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const send=(res,event,data)=>res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

export async function initializeTribeTables(pool){
 await pool.query(`CREATE TABLE IF NOT EXISTS tribe_timers (
   id UUID PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL,
   created_ms BIGINT NOT NULL, end_ms BIGINT NOT NULL,
   created_by UUID REFERENCES members(id) ON DELETE SET NULL
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
  await client.query('COMMIT');
 }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
}

export async function startTribeBroadcast(databaseUrl){
 let reconnectTimer=null;
 async function connect(){
  const listener=new Client({connectionString:databaseUrl});
  listener.on('notification',message=>{
   if(message.channel!=='tribe_updates')return;
   for(const res of clients){try{send(res,'tribe',{topic:message.payload});}catch{clients.delete(res);}}
  });
  listener.on('error',error=>console.error('Tribe live listener error:',error.code||error.message));
  listener.on('end',()=>{if(!reconnectTimer)reconnectTimer=setTimeout(()=>{reconnectTimer=null;void connect();},2500);});
  try{await listener.connect();await listener.query('LISTEN tribe_updates');console.info('Tribe live events connected');}
  catch(error){console.error('Tribe live listener unavailable:',error.code||error.message);await listener.end().catch(()=>{});if(!reconnectTimer)reconnectTimer=setTimeout(()=>{reconnectTimer=null;void connect();},2500);}
 }
 await connect();
}

async function notify(pool,topic){await pool.query('SELECT pg_notify($1,$2)',['tribe_updates',topic]);}
function bad(message){throw Object.assign(new Error(message),{status:400});}
function validated(fn,input){try{return fn(input);}catch(e){bad(e.message);}}
function listOf(rows,serializer){return rows.map(serializer);}

export async function handleTribe(req,res,options){
 const {pool,authorize,bodyJson,json}=options;
 const path=new URL(req.url,'http://localhost').pathname;
 const method=req.method;
 if(path==='/api/v1/events'&&method==='GET'){
  await authorize(req);
  res.writeHead(200,{'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'});
  send(res,'connected',{ok:true});clients.add(res);
  const heartbeat=setInterval(()=>{if(!res.writableEnded)res.write(': heartbeat\n\n');},20000);
  res.on('close',()=>{clients.delete(res);clearInterval(heartbeat);});
  return true;
 }
 if(!path.startsWith('/api/v1/tribe/'))return false;
 const user=await authorize(req);

 if(path==='/api/v1/tribe/timers'){
  if(method==='GET'){
   const {rows}=await pool.query(`SELECT t.*,m.display_name FROM tribe_timers t LEFT JOIN members m ON m.id=t.created_by ORDER BY t.end_ms ASC LIMIT 1000`);
   return json(res,200,{timers:listOf(rows,serializeTimer)})||true;
  }
  if(method==='POST'){
   const timer=validated(normalizeTimer,await bodyJson(req));const id=randomUUID();
   const {rows}=await pool.query(`INSERT INTO tribe_timers(id,name,type,created_ms,end_ms,created_by)
     VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,[id,timer.name,timer.type,timer.created,timer.end,user.id]);
   await notify(pool,'timers');json(res,201,{timer:serializeTimer({...rows[0],display_name:user.display_name})});return true;
  }
 }
 const timerMatch=/^\/api\/v1\/tribe\/timers\/([a-f0-9-]{36})$/i.exec(path);
 if(method==='DELETE'&&timerMatch){
  if(!UUID.test(timerMatch[1]))bad('Invalid timer ID.');
  await pool.query('DELETE FROM tribe_timers WHERE id=$1',[timerMatch[1]]);
  await notify(pool,'timers');json(res,200,{ok:true});return true;
 }

 if(path==='/api/v1/tribe/crafting'){
  if(method==='GET'){
   const {rows}=await pool.query(`SELECT c.*,m.display_name FROM tribe_crafting c LEFT JOIN members m ON m.id=c.updated_by ORDER BY c.name`);
   json(res,200,{items:listOf(rows,serializeCraft)});return true;
  }
  if(method==='POST'||method==='PUT'){
   const input=await bodyJson(req);
   const item=validated(normalizeCrafting,input);
   if(method==='POST'){
    await pool.query(`INSERT INTO tribe_crafting(name,quantity,updated_by) VALUES($1,$2,$3)
     ON CONFLICT(name) DO UPDATE SET quantity=tribe_crafting.quantity+EXCLUDED.quantity,
     updated_by=$3,updated_at=NOW()`,[item.name,item.quantity,user.id]);
   }else{
     const expected=Number(input.expectedQuantity);
     if(!Number.isSafeInteger(expected)||expected<0||expected>1000000)bad('Invalid previous quantity. Refresh and retry.');
     const result=expected===0
       ?await pool.query(`INSERT INTO tribe_crafting(name,quantity,updated_by)
         VALUES($1,$2,$3) ON CONFLICT(name) DO NOTHING RETURNING name`,
         [item.name,item.quantity,user.id])
       :await pool.query(`UPDATE tribe_crafting SET quantity=$2,updated_by=$3,updated_at=NOW()
         WHERE name=$1 AND quantity=$4 RETURNING name`,
         [item.name,item.quantity,user.id,expected]);
     if(!result.rows.length)throw Object.assign(new Error('Another member changed this quantity. Refresh and retry.'),{status:409});
   }
   await notify(pool,'crafting');json(res,200,{ok:true});return true;
  }
  if(method==='DELETE'){
   await pool.query('DELETE FROM tribe_crafting');await notify(pool,'crafting');json(res,200,{ok:true});return true;
  }
 }
 if(method==='DELETE'&&path.startsWith('/api/v1/tribe/crafting/')){
  let name;try{name=decodeURIComponent(path.slice('/api/v1/tribe/crafting/'.length));}catch{bad('Invalid recipe name.');}
  if(!name||name.length>160)bad('Invalid recipe name.');
  await pool.query('DELETE FROM tribe_crafting WHERE name=$1',[name]);
  await notify(pool,'crafting');json(res,200,{ok:true});return true;
 }

 if(path==='/api/v1/tribe/servers/live'){
  if(method==='GET'){
   const {rows}=await pool.query(`SELECT s.*,m.display_name FROM tribe_servers s LEFT JOIN members m ON m.id=s.updated_by ORDER BY s.updated_ms DESC`);
   json(res,200,{servers:listOf(rows,serializeServer)});return true;
  }
  if(method==='POST'){
   const input=validated(normalizeServer,await bodyJson(req));const id=randomUUID();
   await pool.query(`INSERT INTO tribe_servers(id,server_key,map,name,status,notes,updated_ms,updated_by)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(server_key) DO UPDATE SET
     status=EXCLUDED.status,notes=EXCLUDED.notes,updated_ms=EXCLUDED.updated_ms,updated_by=EXCLUDED.updated_by`,
     [id,input.serverKey,input.map,input.name,input.status,input.notes,Date.now(),user.id]);
   await notify(pool,'servers');json(res,200,{ok:true});return true;
  }
 }
 const serverMatch=/^\/api\/v1\/tribe\/servers\/live\/([a-f0-9-]{36})$/i.exec(path);
 if(method==='DELETE'&&serverMatch){
  if(!UUID.test(serverMatch[1]))bad('Invalid server ID.');
  await pool.query('DELETE FROM tribe_servers WHERE id=$1',[serverMatch[1]]);
  await notify(pool,'servers');json(res,200,{ok:true});return true;
 }
 return false;
}
