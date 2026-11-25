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
