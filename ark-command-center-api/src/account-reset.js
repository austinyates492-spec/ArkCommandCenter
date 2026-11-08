/** Explicit one-time, idempotent account reset; passwords are never archived. */
export async function resetAccountsOnce(pool,key=process.env.RESET_ACCOUNT_EPOCH){
 const epoch=String(key||'').trim();
 if(!epoch)return {reset:false,reason:'disabled'};
 if(!/^[a-z0-9-]{6,80}$/.test(epoch))throw new Error('Invalid account reset identifier.');
 const client=await pool.connect();const marker=`accounts-reset:${epoch}`;
 try{
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock(728313)');
  const previous=await client.query('SELECT key FROM schema_meta WHERE key=$1',[marker]);
  if(previous.rows.length){await client.query('COMMIT');console.info(`Account reset ${epoch} already applied`);return {reset:false,reason:'already-applied'};}
  await client.query(`CREATE TABLE IF NOT EXISTS account_reset_archive (
    reset_key TEXT NOT NULL,former_member_id UUID NOT NULL,email TEXT NOT NULL,
    display_name TEXT NOT NULL,personal_state JSONB NOT NULL,personal_version INTEGER NOT NULL,
    archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(reset_key,former_member_id)
  )`);
  const archived=await client.query(`INSERT INTO account_reset_archive
    (reset_key,former_member_id,email,display_name,personal_state,personal_version)
    SELECT $1,m.id,m.email,m.display_name,COALESCE(s.data,'{}'::jsonb),COALESCE(s.version,0)
    FROM members m LEFT JOIN member_state s ON s.member_id=m.id`,[epoch]);
  await client.query('DELETE FROM members');
  await client.query('INSERT INTO schema_meta(key) VALUES($1)',[marker]);
  await client.query('COMMIT');
  const count=archived.rowCount;
  console.info(`Account reset ${epoch}: archived ${count} personal profiles and removed all active accounts; shared tribe records retained.`);
  return {reset:true,count};
 }catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}
}

/** One-time public launch reset. Clears ALL accounts and tribe workspaces, but
 * never touches the signed installer or the global creature/recipe catalog.
 * Old archived account profiles are deleted as well. This is irreversible. */
export async function resetAllAccountDataOnce(pool,key=process.env.RESET_ALL_DATA_EPOCH){
 const epoch=String(key||'').trim();
 if(!epoch)return {reset:false,reason:'disabled'};
 if(!/^[a-z0-9-]{12,80}$/.test(epoch))throw new Error('Invalid full-reset identifier.');
 const client=await pool.connect();
 const marker=`full-account-reset:${epoch}`;
 try{
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock(728314)');
  const previous=await client.query('SELECT key FROM schema_meta WHERE key=$1',[marker]);
  if(previous.rows.length){
   await client.query('COMMIT');
   console.info(`Full account reset ${epoch} already applied`);
   return {reset:false,reason:'already-applied'};
  }

  const existing=await client.query('SELECT COUNT(*)::int AS count FROM members');
  const count=Number(existing.rows[0]?.count||0);
  // Delete child records explicitly; never use CASCADE on a broad schema.
  for(const table of [
   'member_timer_sounds_v2','member_timer_sounds','tribe_timers_v2','tribe_timers',
   'tribe_crafting_v2','tribe_crafting','tribe_servers_v2','tribe_servers',
   'tribe_server_snapshots','tribe_state','member_state','member_sessions','members'
  ])await client.query(`DELETE FROM ${table}`);

  // New tribe records have been emptied; the legacy row stays as a disabled
  // migration anchor so future boots cannot regenerate the old shared tribe.
  await client.query('DELETE FROM tribes WHERE legacy=FALSE');
  await client.query(`UPDATE tribes SET invite_code='RETIRED-'||id::text,
    name='Retired Legacy Tribe',member_limit=0 WHERE legacy=TRUE`);
  await client.query(`DO $$ BEGIN
    IF to_regclass('public.account_reset_archive') IS NOT NULL THEN
      DELETE FROM account_reset_archive;
    END IF;
  END $$`);
  await client.query('INSERT INTO schema_meta(key) VALUES($1)',[marker]);
  await client.query('COMMIT');
  console.info(`Full account reset ${epoch}: erased ${count} accounts, all shared tribe data and archived profiles.`);
  return {reset:true,count};
 }catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}
}
