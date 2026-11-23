export const scoutingNoteCategories=Object.freeze(['Major Tribe','Dangerous Area','General Intel']);
export function normalizeScoutingNote(input){
 const type=String(input?.type||'').trim();
 const text=String(input?.text||'').trim();
 if(!scoutingNoteCategories.includes(type))throw new Error('Choose a valid scouting note category.');
 if(!text||text.length>1500)throw new Error('Scouting note must be 1–1,500 characters.');
 return {type,text};
}
export function serializeScoutingNote(row){
 return {id:row.id,serverId:row.server_id,type:row.type,text:row.text,
  created:Number(row.created_ms),updatedBy:row.display_name||null};
}
