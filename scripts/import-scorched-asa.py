"""Import genuine ASA Scorched Earth terrain and GPS resources from ARK Official Community Wiki.
Fail closed if Wiki page, terrain dimension, or source background does not match.
Attribution: ARK Official Community Wiki; ARK game artwork © Studio Wildcard.
"""
import json,io,requests
from PIL import Image
from pathlib import Path
API="https://ark.wiki.gg/api.php"
TITLE="Data:Maps/Resources/Scorched Earth/ASA"
session=requests.Session()
session.headers.update({"User-Agent":"ARKTribeHQ/1.0 (noncommercial fan resource atlas; source attribution) Mozilla/5.0","Referer":"https://ark.wiki.gg/wiki/Resource_Map/Scorched_Earth"})
r=session.get(API,params={"action":"query","titles":TITLE,"prop":"revisions","rvprop":"content|ids","rvslots":"main","format":"json"},timeout=35)
r.raise_for_status()
page=list(r.json()["query"]["pages"].values())[0]
assert "revisions" in page, f"Missing exact ASA data page: {page}"
revision=page["revisions"][0]
data=json.loads(revision["slots"]["main"]["*"])
print("Source",page["title"],"revision",revision["revid"],"background",data.get("background"),flush=True)
filename=data.get("background",{}).get("image")
assert filename and "Scorched" in filename and "ASA" in filename, f"Incorrect map background {filename}"
markers=data["markers"]
print("Resource marker categories:",[(k,len(v)) for k,v in markers.items()],flush=True)
assert len(markers)>=4,"Not enough resource groups; do not substitute ASE resource page"
allnodes=[];rejected=[]
for category,items in markers.items():
 for i,p in enumerate(items):
  x,y=p.get("x"),p.get("y")
  if not isinstance(x,(int,float)) or not isinstance(y,(int,float)):
   rejected.append((category,i,"missing GPS"));continue
  if not(0<=x<=100 and 0<=y<=100):
   rejected.append((category,i,"out of frame"));continue
  allnodes.append({"id":f"wiki-{category}-{i}","category":category,"lon":round(x,3),"lat":round(y,3),"name":str(p.get("name",""))[:100]})
assert len(allnodes)>50,f"Suspiciously few ASA resource points: {len(allnodes)}"
Path("ark-command-center-desktop/src/scorched-asa-wiki-resources.json").write_text(json.dumps({
 "source":"https://ark.wiki.gg/wiki/Data:Maps/Resources/Scorched_Earth/ASA",
 "revision":revision["revid"],"background":filename,"omittedOutOfBoundsCount":len(rejected),"points":allnodes
},separators=(",",":"))+"\n")
print("Validated sourced GPS locations",len(allnodes),"omitted",len(rejected),flush=True)
imgtitle="File:"+filename
r=session.get(API,params={"action":"query","titles":imgtitle,"prop":"imageinfo","iiprop":"url|size","format":"json"},timeout=30)
r.raise_for_status()
info=list(r.json()["query"]["pages"].values())[0].get("imageinfo",[None])[0]
assert info and info["width"]==2048 and info["height"]==2048,f"Expected genuine 2048x2048 ASA map: {info}"
url=info["url"];r=session.get(url,timeout=50,headers={"Referer":"https://ark.wiki.gg/wiki/File:"+filename.replace(" ","_")})
r.raise_for_status()
assert len(r.content)<8000000
with Image.open(io.BytesIO(r.content)) as img:
 img.load()
 assert img.size==(2048,2048) and img.format=="JPEG",(img.size,img.format)
out=Path("ark-command-center-desktop/public/maps/scorched-earth-asa.jpg")
out.parent.mkdir(parents=True,exist_ok=True)
out.write_bytes(r.content)
print("Validated & downloaded genuine 2048x2048 Scorched Earth JPEG:",len(r.content),flush=True)
