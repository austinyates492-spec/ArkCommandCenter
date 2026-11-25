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
 "Data:Maps/Resources/Genesis: Part 1/Ocean",
 "Data:Maps/Resources/Genesis: Part 1/Ocean/ASA",
 "Data:Maps/Resources/Genesis: Part 1 (Ocean)",
 "Data:Maps/Resources/Genesis: Part 1 Ocean Map",
 "Data:Maps/Resources/Genesis Part 1 Ocean",
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

# Inspect page's explicit dataset references and ocean-specific file names.
for title in ["Resource Map/Genesis: Part 1","Resource Map/Genesis: Part 1/Ocean","Explorer Map/Genesis: Part 1"]:
 r=S.get(API,params={"action":"query","titles":title,"prop":"revisions","rvprop":"content|ids","rvslots":"main","format":"json"},timeout=25);r.raise_for_status()
 page=list(r.json()["query"]["pages"].values())[0]
 rev=page.get("revisions",[None])[0]
 if rev:print("PAGE REFS",title,rev["slots"]["main"]["*"][:8000],flush=True)

# Import exact shared Wiki resource GPS for the single compound Genesis 1 map.
# The wiki does NOT expose ASA-specific resource site records at this title.
from pathlib import Path
import io
from PIL import Image
title="Data:Maps/Resources/Genesis: Part 1"
r=S.get(API,params={"action":"query","titles":title,"prop":"revisions","rvprop":"content|ids","rvslots":"main","format":"json"},timeout=30);r.raise_for_status()
page=list(r.json()["query"]["pages"].values())[0]
rev=page["revisions"][0];data=json.loads(rev["slots"]["main"]["*"])
points=[];omitted=[]
for category,entries in data.get("markers",{}).items():
 for i,p in enumerate(entries):
  lat=p.get("lat",p.get("y"));lon=p.get("lon",p.get("x"))
  if not isinstance(lat,(int,float)) or not isinstance(lon,(int,float)) or not(0<=lat<=100 and 0<=lon<=100):
   omitted.append((category,i));continue
  points.append({"id":f"wiki-{category}-{i}","category":category,"lat":round(lat,3),"lon":round(lon,3),"name":str(p.get("name",""))[:90]})
assert len(points)>1000
out=Path("ark-command-center-desktop/src/genesis-part-1-wiki-resources.json")
out.write_text(json.dumps({"source":"https://ark.wiki.gg/wiki/Data:Maps/Resources/Genesis:_Part_1","revision":rev["revid"],
"verifiedASA":False,"omittedOutOfBoundsCount":len(omitted),"points":points},separators=(",",":"))+"\n")
print("IMPORT RESOURCES",len(points),"OMITTED",len(omitted),"CATEGORY COUNTS",[(cat,sum(p["category"]==cat for p in points)) for cat in data["markers"]],flush=True)
filetitle="File:Genesis Part 1 Map ASA.jpg"
r=S.get(API,params={"action":"query","titles":filetitle,"prop":"imageinfo","iiprop":"url|size","format":"json"},timeout=30);r.raise_for_status()
info=list(r.json()["query"]["pages"].values())[0]["imageinfo"][0]
assert info["width"]==2048 and info["height"]==2048
r=S.get(info["url"],timeout=50,headers={"Referer":"https://ark.wiki.gg/wiki/File:Genesis_Part_1_Map_ASA.jpg"});r.raise_for_status()
with Image.open(io.BytesIO(r.content)) as im:
 im.load();assert im.format=="JPEG" and im.size==(2048,2048)
out=Path("ark-command-center-desktop/public/maps/genesis-part-1-asa.jpg")
out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(r.content)
print("GENESIS ASA TERRAIN SAVED",len(r.content),flush=True)
