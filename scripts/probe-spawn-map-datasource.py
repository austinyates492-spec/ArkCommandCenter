import requests,json,re
S=requests.Session();S.headers.update({"User-Agent":"ARKTribeHQ/1.0 wiki-reference-audit Mozilla/5.0","Referer":"https://ark.wiki.gg/wiki/Spawn_Map/The_Island"});api="https://ark.wiki.gg/api.php"
titles=["Spawn Map/The Island","Spawn Map (The Island)","Spawn Map/Aberration","Spawn Map (Aberration)","Data:Maps/Spawns/The Island/ASA","Data:Maps/Spawns/The Island","Data:Maps/Spawn/The Island/ASA","Data:Maps/Spawn/The Island","Data:Spawning/The Island","Data:SpawnMaps/The Island/ASA","Data:Maps/Spawns/Aberration/ASA","Spawn Map/Genesis: Part 1"]
for title in titles:
 try:
  r=S.get(api,params={"action":"query","titles":title,"prop":"revisions","rvprop":"content|ids","rvslots":"main","format":"json"},timeout=20);r.raise_for_status();p=list(r.json()["query"]["pages"].values())[0]
  if "revisions" in p:
   rev=p["revisions"][0];raw=rev["slots"]["main"]["*"]
   print("FOUND",title,"REV",rev["revid"],"LENGTH",len(raw),"RAW",raw[:6000].replace("\n"," "),flush=True)
  else:print("MISSING",title,flush=True)
 except Exception as e:print("ERROR",title,repr(e),flush=True)

for title in ["Data:Maps/Creature Spawns/The Island/ASA","Data:Maps/Creature Spawns/Aberration/ASA","Data:Maps/Creature Spawns/Genesis: Part 1/ASA","Data:Maps/Creature Spawns/Genesis: Part 1 Ocean/ASA","Data:Maps/Creature Spawns/Astraeos/ASA","Data:Maps/Creature Spawns/Lost Colony/ASA"]:
 try:
  r=S.get(api,params={"action":"query","titles":title,"prop":"revisions","rvprop":"content|ids","rvslots":"main","format":"json"},timeout=25);r.raise_for_status()
  page=list(r.json()["query"]["pages"].values())[0]
  if "revisions" not in page:print("SPAWN SOURCE MISSING",title,flush=True);continue
  rev=page["revisions"][0];raw=rev["slots"]["main"]["*"]
  try:
   obj=json.loads(raw)
   print("SPAWN SOURCE",title,"REV",rev["revid"],"LENGTH",len(raw),"KEYS",list(obj),flush=True)
   for key in ["background","backgrounds","groups","markers","regions","creatures","spawnContainers"]:
    val=obj.get(key)
    if val is not None:
     if isinstance(val,dict):
      print("SPAWN DETAIL",title,key,"COUNT",len(val),"SAMPLE",[(k,str(v)[:600]) for k,v in list(val.items())[:3]],flush=True)
     else:print("SPAWN DETAIL",title,key,"TYPE",type(val).__name__,"COUNT",len(val) if isinstance(val,list) else "", "SAMPLE",str(val)[:1500],flush=True)
  except Exception as e:print("SPAWN NONJSON",title,raw[:1200],repr(e),flush=True)
 except Exception as e:print("SPAWN QUERY ERROR",title,repr(e),flush=True)

for title in ["Data:Maps/Creature Spawns/The Island/ASA","Data:Maps/Creature Spawns/Aberration/ASA","Data:Maps/Creature Spawns/Genesis: Part 1/ASA","Data:Maps/Creature Spawns/Lost_Colony/ASA"]:
 r=S.get(api,params={"action":"query","titles":title,"prop":"revisions","rvprop":"content|ids","rvslots":"main","format":"json"},timeout=25);r.raise_for_status()
 p=list(r.json()["query"]["pages"].values())[0]
 if "revisions" in p:print("SPAWN RAW",title,p["revisions"][0]["slots"]["main"]["*"],flush=True)
