"""Inspect Genesis Part 1 ASA resource maps and actual terrain images. Five biome submaps may require custom selector."""
import json,requests
API="https://ark.wiki.gg/api.php"
S=requests.Session();S.headers.update({"User-Agent":"ARKTribeHQ/1.0 (wiki attribution) Mozilla/5.0","Referer":"https://ark.wiki.gg/wiki/Resource_Map/Genesis:_Part_1"})
pages=[
 "Resource Map/Genesis: Part 1",
 "Data:Maps/Resources/Genesis Part 1/ASA","Data:Maps/Resources/Genesis: Part 1/ASA",
 "Data:Maps/Resources/Genesis 1/ASA","Data:Maps/Resources/Genesis: Part 1",
 "Data:Maps/Resources/Genesis 1","Data:Maps/Resources/Genesis Part 1",
 "Data:Maps/Resources/Genesis Part 1 Ocean/ASA",
 "Data:Maps/Resources/Genesis Ocean/ASA",
 "Data:Maps/Resources/Genesis: Part 1/Ocean/ASA",
 "Data:Maps/Resources/Genesis: Part 1 Ocean",
]
for name in pages:
 try:
  r=S.get(API,params={"action":"query","titles":name,"prop":"revisions","rvprop":"content|ids","rvslots":"main","format":"json"},timeout=25);r.raise_for_status()
  page=list(r.json()["query"]["pages"].values())[0]
  if "revisions" not in page:print("DATA MISSING",name,flush=True);continue
  rev=page["revisions"][0];src=rev["slots"]["main"]["*"]
  if name.startswith("Resource Map/"):
   print("RESOURCE PAGE",name,"REV",rev["revid"],"WIKITEXT",src[:6000],flush=True);continue
  data=json.loads(src)
  print("DATA FOUND",name,"REV",rev["revid"],"KEYS",list(data),"BACKGROUND",data.get("background",data.get("backgrounds")),flush=True)
  print("CATEGORIES",[(k,len(v)) for k,v in data.get("markers",{}).items()],flush=True)
 except Exception as e:print("DATA ERROR",name,repr(e),flush=True)
for filename in [
 "Genesis Part 1 Map ASA.jpg","Genesis Part 1 map ASA.jpg",
 "Genesis 1 Map ASA.jpg","Genesis 1 map ASA.jpg",
 "Genesis Part 1 Ocean Map ASA.jpg","Genesis Part 1 Ocean map ASA.jpg",
 "Genesis Part 1 Topographic Map ASA.jpg","Genesis 1 Topographic Map ASA.jpg",
 "Genesis Part 1 Map.jpg","Genesis Part 1 Map.png","Genesis Map ASA.jpg",
 "Genesis Part 1 Ocean Map.jpg","Genesis Ocean Map ASA.jpg",
 "Genesis Part 1 Ocean Map.png"
]:
 try:
  r=S.get(API,params={"action":"query","titles":"File:"+filename,"prop":"imageinfo","iiprop":"url|size|mime","format":"json"},timeout=25);r.raise_for_status()
  p=list(r.json()["query"]["pages"].values())[0];info=p.get("imageinfo",[None])[0]
  if info:print("IMAGE FOUND",filename,info,flush=True)
 except Exception as e:print("IMAGE ERROR",filename,str(e),flush=True)
