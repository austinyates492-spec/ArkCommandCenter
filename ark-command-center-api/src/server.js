import http from 'node:http';
import {Pool} from 'pg';
import {hashPassword,verifyPassword,secureCompare,signAccessToken,verifyAccessToken} from './security.js';

const PORT=Number(process.env.PORT||3000);
const DATABASE_URL=process.env.DATABASE_URL;
const JWT_SECRET=process.env.JWT_SECRET;
const INVITE_CODE=process.env.INVITE_CODE;
const MAX_MEMBERS=Math.max(1,Math.min(50,Number(process.env.MAX_MEMBERS||6)));
if(!DATABASE_URL||!JWT_SECRET||JWT_SECRET.length<32||!INVITE_CODE||INVITE_CODE.length<12){
 console.error('Missing or weak DATABASE_URL, JWT_SECRET or INVITE_CODE.');
 process.exit(1);
}

const pool=new Pool({connectionString:DATABASE_URL,max:5,connectionTimeoutMillis:8000});
const allowedOrigins=new Set(['tauri://localhost','http://tauri.localhost','https://tauri.localhost','http://127.0.0.1:1420','http://localhost:1420']);
const attempts=new Map();
setInterval(()=>{const now=Date.now();for(const [key,entry] of attempts)if(entry.until<now)attempts.delete(key);},15*60_000).unref();

function json(res,status,payload){const body=JSON.stringify(payload);res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','content-length':Buffer.byteLength(body)});res.end(body);}
function rateLimit(req,endpoint){
 const ip=req.socket.remoteAddress||'unknown';const key=`${ip}/${endpoint}`;
 const now=Date.now();const old=attempts.get(key);
 const entry=old&&old.until>now?old:{count:0,until:now+15*60_000};entry.count++;attempts.set(key,entry);
 return entry.count>20;
}
async function bodyJson(req){
 let size=0;const parts=[];
 for await(const part of req){size+=part.length;if(size>200_000)throw Object.assign(new Error('Request too large'),{status:413});parts.push(part);}
 try{return JSON.parse(Buffer.concat(parts).toString('utf8'));}catch{throw Object.assign(new Error('Invalid JSON'),{status:400});}
}
function fail(status,message){throw Object.assign(new Error(message),{status});}
async function authorize(req){
 const match=/^Bearer (\S+)$/.exec(req.headers.authorization||'');
 const claims=verifyAccessToken(match?.[1],JWT_SECRET);
 if(!claims)fail(401,'Sign in required.');
 const {rows}=await pool.query('SELECT id,email,display_name FROM members WHERE id=$1',[claims.sub]);
 if(!rows.length)fail(401,'Account not found.');
 return rows[0];
}
function checkedEmail(email){const value=String(email||'').trim().toLowerCase();if(value.length>254||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value))fail(400,'Enter a valid email.');return value;}
function checkedPassword(password){if(typeof password!=='string'||password.length<12||password.length>128)fail(400,'Password must be 12–128 characters.');return password;}
function validateState(value,type){
 if(!value||typeof value!=='object'||Array.isArray(value))fail(400,'State must be an object.');
 if(type==='private'){
  const keys=['ark.rates','ark.timers','ark.theme','ark.crafting.recipes','ark.crafting.community','ark.crafting.cart'];
  if(Object.keys(value).some(k=>!keys.includes(k)))fail(400,'Unexpected state key.');
 }else if(!Array.isArray(value.servers)||value.servers.length>1000)fail(400,'Invalid server list.');
}
function identity(user){return {id:user.id,email:user.email,displayName:user.display_name};}

async function handle(req,res){
 const url=new URL(req.url,'http://localhost');const method=req.method;
 const origin=req.headers.origin;
 if(origin&&allowedOrigins.has(origin))res.setHeader('Access-Control-Allow-Origin',origin);
 res.setHeader('Vary','Origin');
 res.setHeader('Access-Control-Allow-Headers','Authorization, Content-Type');
 res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, OPTIONS');
 if(method==='OPTIONS'){
  if(origin&&!allowedOrigins.has(origin))return json(res,403,{error:'Origin not allowed.'});
  return json(res,200,{ok:true});
 }
 if(origin&&!allowedOrigins.has(origin))fail(403,'Origin not allowed.');
 if(method==='GET'&&url.pathname==='/api/v1/health'){
  await pool.query('SELECT 1');return json(res,200,{ok:true,service:'ark-command-center-api'});
 }
 if(method==='POST'&&url.pathname==='/api/v1/auth/register'){
  if(rateLimit(req,'register'))fail(429,'Too many attempts. Try again later.');
  const input=await bodyJson(req);const email=checkedEmail(input.email);const password=checkedPassword(input.password);
  const name=String(input.displayName||'').trim();
  if(name.length<2||name.length>60)fail(400,'Display name must be 2–60 characters.');
  if(!secureCompare(input.inviteCode,INVITE_CODE))fail(403,'Invalid tribe invite code.');
  const hashed=await hashPassword(password);
  const client=await pool.connect();
  try{
   await client.query('BEGIN');
   await client.query('SELECT pg_advisory_xact_lock(728311)');
   const {rows:[count]}=await client.query('SELECT COUNT(*)::int AS count FROM members');
   if(count.count>=MAX_MEMBERS)fail(403,'The tribe account limit has been reached.');
   const result=await client.query('INSERT INTO members(email,display_name,password_hash) VALUES($1,$2,$3) RETURNING id,email,display_name',[email,name,hashed]);
   await client.query('COMMIT');
   const user=result.rows[0];return json(res,201,{user:identity(user),token:signAccessToken(user,JWT_SECRET)});
  }catch(error){await client.query('ROLLBACK');if(error.code==='23505')fail(409,'An account already uses this email.');throw error;}
  finally{client.release();}
 }
 if(method==='POST'&&url.pathname==='/api/v1/auth/login'){
  if(rateLimit(req,'login'))fail(429,'Too many attempts. Try again later.');
  const input=await bodyJson(req);const email=checkedEmail(input.email);
  const {rows}=await pool.query('SELECT id,email,display_name,password_hash FROM members WHERE email=$1',[email]);
  // Always do an expensive hash check to avoid distinguishable account timing.
  const candidate=rows[0]?.password_hash||'scrypt$00000000000000000000000000000000$'+'0'.repeat(128);
  if(typeof input.password!=='string'||!await verifyPassword(input.password,candidate)||!rows.length)fail(401,'Invalid email or password.');
  const user=rows[0];return json(res,200,{user:identity(user),token:signAccessToken(user,JWT_SECRET)});
 }
 if(method==='GET'&&url.pathname==='/api/v1/auth/me')return json(res,200,{user:identity(await authorize(req))});
 if(url.pathname==='/api/v1/state'){
  const user=await authorize(req);
  if(method==='GET'){
   const {rows}=await pool.query('SELECT data,version FROM member_state WHERE member_id=$1',[user.id]);
   return json(res,200,{state:rows[0]?.data||{},version:rows[0]?.version||0});
  }
  if(method==='PUT'){
   const {state,version}=await bodyJson(req);validateState(state,'private');
   if(!Number.isSafeInteger(version)||version<0)fail(400,'Invalid version.');
   const result=await pool.query(`INSERT INTO member_state(member_id,data,version) SELECT $1,$2::jsonb,1 WHERE $3=0
      ON CONFLICT(member_id) DO UPDATE SET data=EXCLUDED.data,version=member_state.version+1,updated_at=NOW()
      WHERE member_state.version=$3 RETURNING version`,[user.id,JSON.stringify(state),version]);
   if(!result.rows.length)fail(409,'Personal data changed on another device. Reload before saving.');
   return json(res,200,{version:result.rows[0].version});
  }
 }
 if(url.pathname==='/api/v1/tribe/servers'){
  await authorize(req);
  if(method==='GET'){
   const {rows}=await pool.query("SELECT data,version FROM tribe_state WHERE name='servers'");
   return json(res,200,{state:rows[0]?.data||{servers:[]},version:rows[0]?.version||0});
  }
  if(method==='PUT'){
   const {state,version}=await bodyJson(req);validateState(state,'shared');
   if(!Number.isSafeInteger(version)||version<0)fail(400,'Invalid version.');
   const result=await pool.query(`INSERT INTO tribe_state(name,data,version) SELECT 'servers',$1::jsonb,1 WHERE $2=0
     ON CONFLICT(name) DO UPDATE SET data=EXCLUDED.data,version=tribe_state.version+1,updated_at=NOW()
     WHERE tribe_state.version=$2 RETURNING version`,[JSON.stringify(state),version]);
   if(!result.rows.length)fail(409,'Tribe server list changed. Reload before saving.');
   return json(res,200,{version:result.rows[0].version});
  }
 }
 fail(404,'Not found.');
}
async function initialize(){
 await pool.query(`CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,display_name TEXT NOT NULL,password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`);
 await pool.query(`CREATE TABLE IF NOT EXISTS member_state (
  member_id UUID PRIMARY KEY REFERENCES members(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,version INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`);
 await pool.query(`CREATE TABLE IF NOT EXISTS tribe_state (
  name TEXT PRIMARY KEY,data JSONB NOT NULL,version INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`);
}

const server=http.createServer((req,res)=>{handle(req,res).catch(error=>{
 if(error.status)return json(res,error.status,{error:error.message});
 console.error('API request failed:',error.code||error.name||'unknown');
 if(!res.headersSent)json(res,500,{error:'Unexpected server error.'});else res.end();
});});
initialize().then(()=>server.listen(PORT,'0.0.0.0',()=>console.info(`ARK API listening on ${PORT}`))).catch(error=>{console.error('Database initialization failed:',error.code||error.message);process.exit(1);});
process.on('SIGTERM',()=>server.close(()=>pool.end()));
