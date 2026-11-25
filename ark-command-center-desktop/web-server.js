import http from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {join,resolve,sep,extname} from 'node:path';

const root=resolve('dist');
const port=Number(process.env.PORT||3000);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json',
 '.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg',
 '.ico':'image/x-icon','.webp':'image/webp','.woff2':'font/woff2','.map':'application/json'};

const server=http.createServer(async(req,res)=>{
 if(req.method!=='GET'&&req.method!=='HEAD'){
  res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;
 }
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{
  res.writeHead(400);res.end();return;
 }
 let file=resolve(root,`.${pathname}`);
 if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
 let info=await stat(file).catch(()=>null);
 if(!info?.isFile()){
  // Do not serve the app shell in place of a missing JavaScript/image asset.
  if(pathname.includes('.')||pathname.startsWith('/assets/')){res.writeHead(404);res.end();return;}
  file=join(root,'index.html');info=await stat(file).catch(()=>null);
 }
 if(!info?.isFile()){res.writeHead(503);res.end('Website build not available.');return;}
 const type=mime[extname(file)]||'application/octet-stream';
 res.writeHead(200,{
  'Content-Type':type,'Content-Length':info.size,
  'Cache-Control':file.endsWith('index.html')||file.includes('startup-recovery-')||file.includes('boot-intro-')||file.endsWith('sw.js')||file.endsWith('manifest.webmanifest')||file.endsWith('robots.txt')||file.endsWith('sitemap.xml')?'no-cache':'public, max-age=31536000, immutable',
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'strict-origin-when-cross-origin',
  'X-Frame-Options':'DENY',
  'Content-Security-Policy':"default-src 'self'; connect-src 'self' https://ark-command-center-api-production.up.railway.app; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self'; font-src 'self' https://fonts.gstatic.com data:; frame-src https:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
 });
 if(req.method==='HEAD'){res.end();return;}
 createReadStream(file).pipe(res);
});
server.listen(port,'0.0.0.0',()=>console.info(`ArkTribeHQ web listening on ${port}`));
process.on('SIGTERM',()=>server.close());
