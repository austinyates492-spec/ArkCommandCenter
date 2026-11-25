"""Acquires verified ASA Aberration terrain and provenance-labeled wiki resource locations.
Requires exact ASA file and rejects wrong map assets. Wiki reference markers are never misrepresented as ASA-verified.
"""
import io,json,requests
from pathlib import Path
from PIL import Image
API="https://ark.wiki.gg/api.php"
session=requests.Session()
session.headers.update({"User-Agent":"ARKTribeHQ/1.0 (noncommercial fan atlas, wiki attribution) Mozilla/5.0","Referer":"https://ark.wiki.gg/wiki/Resource_Map/Aberration"})
candidates=["Data:Maps/Resources/Aberration/ASA","Data:Maps/Resources/Aberration"]
chosen=None
for title in candidates:
 response=session.get(API,params={"action":"query","titles":title,"prop":"revisions","rvprop":"content|ids","rvslots":"main","format":"json"},timeout=30)
 response.raise_for_status()
 page=list(response.json()["query"]["pages"].values())[0]
 if "revisions" in page:
  revision=page["revisions"][0]
  data=json.loads(revision["slots"]["main"]["*"])
  print("FOUND",title,"REV",revision["revid"],"FIELDS",list(data.keys()),"BACKGROUND",data.get("background",data.get("backgrounds")),flush=True)
  print("CATEGORIES",[(key,len(items)) for key,items in data.get("markers",{}).items()],flush=True)
  chosen=(title,revision["revid"],data)
  break
 else:print("MISSING",title,flush=True)
assert chosen is not None,"No wiki resource page found"
title,rev,data=chosen
markerlist=[];omitted=[]
for category,items in data.get("markers",{}).items():
 for i,point in enumerate(items):
  lon=point.get("lon",point.get("x"))
  lat=point.get("lat",point.get("y"))
  if not isinstance(lon,(float,int)) or not isinstance(lat,(float,int)) or not 0<=lon<=100 or not 0<=lat<=100:
   omitted.append((category,i));continue
  markerlist.append({"id":f"wiki-{category}-{i}","category":category,"lon":round(lon,3),"lat":round(lat,3),"name":str(point.get("name",""))[:90]})
assert len(markerlist)>50,"Unexpectedly sparse Aberration resource map"
out=Path("ark-command-center-desktop/src/aberration-wiki-resources.json")
out.write_text(json.dumps({"source":"https://ark.wiki.gg/wiki/"+title.replace(" ","_"),"revision":rev,
 "verifiedASA":title.endswith("/ASA"),"omittedOutOfBoundsCount":len(omitted),"points":markerlist},separators=(",",":"))+"\n")
print("RESOURCE COUNT",len(markerlist),"OMITTED",len(omitted),"IS_ASA",title.endswith("/ASA"),flush=True)
filetitle="File:Aberration map ASA.jpg"
r=session.get(API,params={"action":"query","titles":filetitle,"prop":"imageinfo","iiprop":"url|size","format":"json"},timeout=30)
r.raise_for_status()
info=list(r.json()["query"]["pages"].values())[0].get("imageinfo",[None])[0]
assert info and info["width"]==2048 and info["height"]==2048,f"Unexpected image metadata: {info}"
r=session.get(info["url"],timeout=50,headers={"Referer":"https://ark.wiki.gg/wiki/File:Aberration_map_ASA.jpg"})
r.raise_for_status()
assert len(r.content)<8000000
with Image.open(io.BytesIO(r.content)) as img:
 img.load()
 assert img.size==(2048,2048) and img.format=="JPEG"
dest=Path("ark-command-center-desktop/public/maps/aberration-asa.jpg")
dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(r.content)
print("ASA TERRAIN IMPORT SUCCESS",len(r.content),flush=True)
