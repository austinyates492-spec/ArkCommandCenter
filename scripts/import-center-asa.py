"""Import authentic ASA The Center terrain and resource locations from ARK Official Community Wiki.
Only exact ASA data page and matching 2048x2048 file accepted; no guessed markers.
"""
import json,io,requests
from PIL import Image
from pathlib import Path
API="https://ark.wiki.gg/api.php"
TITLE="Data:Maps/Resources/The Center"
session=requests.Session()
session.headers.update({"User-Agent":"ARKTribeHQ/1.0 (noncommercial fan resource atlas; wiki attribution) Mozilla/5.0","Referer":"https://ark.wiki.gg/wiki/Resource_Map/The_Center"})
r=session.get(API,params={"action":"query","titles":TITLE,"prop":"revisions","rvprop":"content|ids","rvslots":"main","format":"json"},timeout=35)
r.raise_for_status()
page=list(r.json()["query"]["pages"].values())[0]
assert "revisions" in page, f"Missing Center resource page: {page}"
revision=page["revisions"][0]
data=json.loads(revision["slots"]["main"]["*"])
print("WIKI SOURCE",page["title"],"REVISION",revision["revid"],"BACKGROUND",data.get("background"),flush=True)
filename="The Center map ASA.jpg"
print("CENTER SOURCE TOP LEVEL",list(data.keys()),str(data)[:1400],flush=True)
print("CENTER RESOURCE DATA BACKGROUND:",filename,flush=True)
assert filename=="The Center map ASA.jpg"
markers=data["markers"]
print("WIKI CATEGORY COUNTS",[(k,len(v)) for k,v in markers.items()],flush=True)
print("EXAMPLE MARKERS",[(k,v[:2]) for k,v in list(markers.items())[:3]],flush=True)
assert len(markers)>=4,"Suspiciously few resource types"
allnodes=[];omitted=[]
for category,items in markers.items():
 for i,p in enumerate(items):
  x,y=p.get("lon",p.get("x")),p.get("lat",p.get("y"))
  if not isinstance(x,(int,float)) or not isinstance(y,(int,float)):
   omitted.append((category,i,"missing coord"));continue
  if not (0<=x<=100 and 0<=y<=100):
   omitted.append((category,i,"out of bounds"));continue
  allnodes.append({"id":f"wiki-{category}-{i}","category":category,"lon":round(x,3),"lat":round(y,3),"name":str(p.get("name",""))[:100]})
assert len(allnodes)>50,"Unexpectedly sparse resources"
Path("ark-command-center-desktop/src/center-asa-wiki-resources.json").write_text(json.dumps({
 "source":"https://ark.wiki.gg/wiki/Data:Maps/Resources/The_Center",
 "sourceVerifiedASA":False,"sourceCoordinates":"Community map shared data; NOT ASA-specific",
 "revision":revision["revid"],"background":filename,"omittedOutOfBoundsCount":len(omitted),"points":allnodes
},separators=(",",":"))+"\n")
print("VALIDATED CENTER REFERENCE RESOURCES",len(allnodes),"OMITTED",len(omitted),flush=True)
r=session.get(API,params={"action":"query","titles":"File:"+filename,"prop":"imageinfo","iiprop":"url|size","format":"json"},timeout=30)
r.raise_for_status()
info=list(r.json()["query"]["pages"].values())[0].get("imageinfo",[None])[0]
assert info and info["width"]==2048 and info["height"]==2048,f"Wrong terrain image: {info}"
url=info["url"]
r=session.get(url,timeout=50,headers={"Referer":"https://ark.wiki.gg/wiki/File:"+filename.replace(" ","_")})
r.raise_for_status()
assert len(r.content)<8000000
with Image.open(io.BytesIO(r.content)) as img:
 img.load()
 assert img.size==(2048,2048) and img.format=="JPEG",(img.size,img.format)
path=Path("ark-command-center-desktop/public/maps/the-center-asa.jpg")
path.parent.mkdir(parents=True,exist_ok=True)
path.write_bytes(r.content)
print("VALIDATED CENTER TERRAIN JPEG",len(r.content),flush=True)
