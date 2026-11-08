// Run once on each device after the public relaunch. The server resets its
// accounts separately; this clears credentials and stale offline workspaces.
export const LAUNCH_RESET_EPOCH='arktribehq-public-launch-2026-11-08';
const MARKER='ark.launchResetEpoch';

export function resetLocalWorkspaceOnce(local=globalThis.localStorage,session=globalThis.sessionStorage){
 try{
  if(local.getItem(MARKER)===LAUNCH_RESET_EPOCH)return false;
  for(const storage of [local,session]){
   const keys=[];
   for(let i=0;i<storage.length;i++){
    const key=storage.key(i);
    if(key?.startsWith('ark.'))keys.push(key);
   }
   for(const key of keys)storage.removeItem(key);
  }
  local.setItem(MARKER,LAUNCH_RESET_EPOCH);
  return true;
 }catch{return false;}
}
