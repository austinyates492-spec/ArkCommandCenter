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
