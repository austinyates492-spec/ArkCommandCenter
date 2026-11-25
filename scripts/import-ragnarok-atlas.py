"""Import genuine Ragnarok ASA artwork and accurately attributed wiki resource positions."""
import io,json,requests
from PIL import Image
from pathlib import Path
API="https://ark.wiki.gg/api.php"
S=requests.Session();S.headers.update({"User-Agent":"ARKTribeHQ/1.0 fan atlas (source attributed) Mozilla/5.0","Referer":"https://ark.wiki.gg/wiki/Resource_Map/Ragnarok"})
for title in ["Data:Maps/Resources/Ragnarok/ASA","Data:Maps/Resources/Ragnarok"]:
 r=S.get(API,params={"action":"query","titles":title,"prop":"revisions","rvprop":"content|ids","rvslots":"main","format":"json"},timeout=30);r.raise_for_status()
 page=list(r.json()["query"]["pages"].values())[0]
 if "revisions" not in page:print("MISSING",title,flush=True);continue
 rev=page["revisions"][0];data=json.loads(rev["slots"]["main"]["*"])
 print("SOURCE",title,"REVISION",rev["revid"],"BACKGROUNDS",data.get("backgrounds",data.get("background")),flush=True)
 print("CATEGORIES",[(k,len(v)) for k,v in data.get("markers",{}).items()],flush=True)
 break
else:raise RuntimeError("No wiki Ragnarok DataMaps resource positions")
points=[];skipped=[]
for cat,items in data.get("markers",{}).items():
 for i,p in enumerate(items):
  lat=p.get("lat",p.get("y"));lon=p.get("lon",p.get("x"))
  if not isinstance(lat,(float,int)) or not isinstance(lon,(float,int)) or not(0<=lat<=100 and 0<=lon<=100):
   skipped.append((cat,i));continue
  points.append({"id":f"wiki-{cat}-{i}","category":cat,"lat":round(lat,3),"lon":round(lon,3),"name":str(p.get("name",""))[:100]})
assert len(points)>50
Path("ark-command-center-desktop/src/ragnarok-wiki-resources.json").write_text(json.dumps({
 "source":"https://ark.wiki.gg/wiki/"+title.replace(" ","_"),"revision":rev["revid"],"verifiedASA":title.endswith("/ASA"),
 "omittedOutOfBoundsCount":len(skipped),"points":points},separators=(",",":"))+"\n")
print("VALID RESOURCES",len(points),"OMITTED",len(skipped),flush=True)
for filename in ["Ragnarok map ASA.jpg","Ragnarok Map ASA.jpg","Ragnarok ASA map.jpg"]:
 r=S.get(API,params={"action":"query","titles":"File:"+filename,"prop":"imageinfo","iiprop":"url|size","format":"json"},timeout=30);r.raise_for_status()
 page=list(r.json()["query"]["pages"].values())[0];info=page.get("imageinfo",[None])[0]
 print("IMAGE SEARCH",filename,info,flush=True)
 if info and info["width"]==2048 and info["height"]==2048:break
else:raise RuntimeError("No exact genuine 2048px Ragnarok ASA terrain in wiki candidate list")
r=S.get(info["url"],timeout=50,headers={"Referer":"https://ark.wiki.gg/wiki/File:"+filename.replace(" ","_")});r.raise_for_status()
with Image.open(io.BytesIO(r.content)) as img:
 img.load();assert img.size==(2048,2048) and img.format=="JPEG",(img.size,img.format)
path=Path("ark-command-center-desktop/public/maps/ragnarok-asa.jpg")
path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(r.content)
print("TERRAIN SAVED",len(r.content),filename,flush=True)
