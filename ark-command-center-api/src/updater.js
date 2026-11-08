import {createPublicKey,verify as verifySignature} from 'node:crypto';

const OWNER_REPO='austinyates492-spec/ArkCommandCenter';
const AUDIENCE='ark-command-center-updates';
const OIDC_ISSUER='https://token.actions.githubusercontent.com';
const JWKS='https://token.actions.githubusercontent.com/.well-known/jwks';
const MAX_UPDATE_BYTES=80*1024*1024;
let jwksCache={keys:null,expiresAt:0};
const decode=value=>Buffer.from(value,'base64url');
export function versionCompare(a,b){
 const parts=value=>{const text=String(value).replace(/^v/,'');return /^\d+\.\d+\.\d+$/.test(text)?text.split('.').map(Number):null;};
 const x=parts(a),y=parts(b);if(!x||!y)return null;
 for(let i=0;i<3;i++)if(x[i]!==y[i])return x[i]>y[i]?1:-1;
 return 0;
}
async function getJwks(){
 if(jwksCache.keys&&jwksCache.expiresAt>Date.now())return jwksCache.keys;
 const response=await fetch(JWKS,{signal:AbortSignal.timeout(10000)});
 if(!response.ok)throw Error('OIDC key discovery unavailable');
 const data=await response.json();if(!Array.isArray(data.keys))throw Error('Invalid OIDC keys');
 jwksCache={keys:data.keys,expiresAt:Date.now()+60*60_000};return data.keys;
}
export function trustedWorkflowClaims(claims,now=Math.floor(Date.now()/1000)){
 return Boolean(claims&&claims.iss===OIDC_ISSUER&&claims.aud===AUDIENCE&&
  claims.repository===OWNER_REPO&&claims.ref==='refs/heads/main'&&
  claims.sub===`repo:${OWNER_REPO}:ref:refs/heads/main`&&
  claims.workflow_ref===`${OWNER_REPO}/.github/workflows/build-windows.yml@refs/heads/main`&&
  Number.isFinite(claims.iat)&&Number.isFinite(claims.exp)&&claims.iat<=now+60&&claims.exp>now);
}
export async function verifyGithubOidc(token){
 if(typeof token!=='string'||token.length>15000)throw Error('Invalid build credential');
 const parts=token.split('.');if(parts.length!==3)throw Error('Invalid build credential');
 let header,claims;
 try{header=JSON.parse(decode(parts[0]));claims=JSON.parse(decode(parts[1]));}catch{throw Error('Invalid build credential');}
 if(header.alg!=='RS256'||typeof header.kid!=='string'||!trustedWorkflowClaims(claims))throw Error('Build identity rejected');
 const keys=await getJwks();const jwk=keys.find(key=>key.kid===header.kid&&key.kty==='RSA');
 if(!jwk)throw Error('Build signing key unavailable');
 const key=createPublicKey({key:jwk,format:'jwk'});
 if(!verifySignature('RSA-SHA256',Buffer.from(`${parts[0]}.${parts[1]}`),key,decode(parts[2])))throw Error('Invalid build signature');
 return claims;
}
export async function readUpdateUpload(req){
 const size=Number(req.headers['content-length']);if(!Number.isFinite(size)||size<1000||size>MAX_UPDATE_BYTES)throw Error('Invalid update upload size');
 const chunks=[];let total=0;
 for await(const chunk of req){total+=chunk.length;if(total>MAX_UPDATE_BYTES)throw Error('Update upload too large');chunks.push(chunk);}
 if(total!==size)throw Error('Incomplete update upload');
 return Buffer.concat(chunks);
}
export async function initializeUpdater(pool){
 await pool.query(`CREATE TABLE IF NOT EXISTS app_updates (
  platform TEXT NOT NULL,version TEXT NOT NULL,signature TEXT NOT NULL,
  content BYTEA NOT NULL,bytes INTEGER NOT NULL,published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(platform,version)
 )`);
}
export async function handleUpdater(req,res,{url,pool,json}){
 const method=req.method,path=url.pathname;
 if(method==='GET'&&path.startsWith('/api/v1/updates/check/')){
  const match=/^\/api\/v1\/updates\/check\/windows\/x86_64\/(\d+\.\d+\.\d+)$/.exec(path);
  if(!match){res.writeHead(204);res.end();return true;}
  const {rows}=await pool.query("SELECT version,signature,published_at FROM app_updates WHERE platform='windows-x86_64' ORDER BY split_part(version,'.',1)::int DESC,split_part(version,'.',2)::int DESC,split_part(version,'.',3)::int DESC LIMIT 1");
  const latest=rows[0];if(!latest||versionCompare(latest.version,match[1])!==1){res.writeHead(204);res.end();return true;}
  const urlBase=process.env.UPDATE_PUBLIC_ORIGIN||'https://ark-command-center-api-production.up.railway.app';
  json(res,200,{version:latest.version,notes:'ARK Command Center improvements and new features',pub_date:new Date(latest.published_at).toISOString(),url:`${urlBase}/api/v1/updates/download/windows-x86_64/${latest.version}`,signature:latest.signature});return true;
 }
 if(method==='GET'&&path.startsWith('/api/v1/updates/download/')){
  const match=/^\/api\/v1\/updates\/download\/windows-x86_64\/(\d+\.\d+\.\d+)$/.exec(path);
  if(!match){json(res,404,{error:'Update not found'});return true;}
  const {rows}=await pool.query("SELECT content,bytes FROM app_updates WHERE platform='windows-x86_64' AND version=$1",[match[1]]);
  if(!rows.length){json(res,404,{error:'Update not found'});return true;}
  res.writeHead(200,{'content-type':'application/octet-stream','content-length':rows[0].bytes,'cache-control':'private, max-age=3600','x-content-type-options':'nosniff'});res.end(rows[0].content);return true;
 }
 if(method==='POST'&&path==='/api/v1/updates/build-key'){
  await verifyGithubOidc(req.headers.authorization?.replace(/^Bearer /,'')||'');
  const key=process.env.TAURI_SIGNING_PRIVATE_KEY;
  if(!key)throw Object.assign(new Error('Update signer is not configured'),{status:503});
  json(res,200,{privateKey:key});return true;
 }
 if(method==='POST'&&path==='/api/v1/updates/publish'){
  const claims=await verifyGithubOidc(req.headers.authorization?.replace(/^Bearer /,'')||'');
  const version=url.searchParams.get('version');
  const signature=req.headers['x-tauri-signature'];
  if(!/^\d+\.\d+\.\d+$/.test(version||'')||typeof signature!=='string'||signature.length<60||signature.length>1024)throw Object.assign(new Error('Invalid update metadata'),{status:400});
  // Only publish a version named by the trusted workflow's own source.
  if(!claims.sha||!/^([a-f0-9]{40})$/.test(claims.sha))throw Error('Missing source commit identity');
  const bytes=await readUpdateUpload(req);
  await pool.query(`INSERT INTO app_updates(platform,version,signature,content,bytes)
   VALUES('windows-x86_64',$1,$2,$3,$4) ON CONFLICT(platform,version) DO UPDATE
   SET signature=EXCLUDED.signature,content=EXCLUDED.content,bytes=EXCLUDED.bytes,published_at=NOW()`,
   [version,signature,bytes,bytes.length]);
  // Keep a small signed-update history, not an unbounded collection of EXEs.
  await pool.query(`DELETE FROM app_updates WHERE platform='windows-x86_64' AND version NOT IN
   (SELECT version FROM app_updates WHERE platform='windows-x86_64' ORDER BY split_part(version,'.',1)::int DESC,split_part(version,'.',2)::int DESC,split_part(version,'.',3)::int DESC LIMIT 3)`);
  json(res,200,{ok:true,version,bytes:bytes.length});return true;
 }
 return false;
}
