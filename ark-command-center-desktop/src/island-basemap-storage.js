/** Browser-local Island map artwork. No third-party images are shipped or uploaded. */
const DB_NAME='arktribehq-atlas-images';
const STORE='basemaps';
const KEY='island-user-map';
export const MAX_ISLAND_MAP_BYTES=12*1024*1024;
export function validateIslandMapFile(file){
 if(!file||!['image/png','image/jpeg','image/webp'].includes(file.type))throw new Error('Choose a PNG, JPG or WebP map image.');
 if(file.size<=0||file.size>MAX_ISLAND_MAP_BYTES)throw new Error('Map images must be 12 MB or smaller.');
 return file;
}
function database(){
 return new Promise((resolve,reject)=>{
  if(typeof indexedDB==='undefined'){reject(new Error('Your browser does not support persistent map images.'));return;}
  const request=indexedDB.open(DB_NAME,1);
  request.onupgradeneeded=()=>request.result.createObjectStore(STORE);
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error||new Error('Unable to open map storage.'));
 });
}
async function transact(mode,operation){
 const db=await database();
 try{return await new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE,mode);
  const request=operation(tx.objectStore(STORE));
  request.onsuccess=()=>resolve(request.result??null);
  request.onerror=()=>reject(request.error||new Error('Map storage failed.'));
  tx.onerror=()=>reject(tx.error||new Error('Map storage transaction failed.'));
 });}finally{db.close();}
}
export async function loadIslandBasemap(){return transact('readonly',store=>store.get(KEY));}
export async function saveIslandBasemap(file){
 validateIslandMapFile(file);
 return transact('readwrite',store=>store.put(file,KEY));
}
export async function clearIslandBasemap(){return transact('readwrite',store=>store.delete(KEY));}
