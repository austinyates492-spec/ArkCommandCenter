"""Acquire Valguero's genuine ASA terrain and attributed wiki reference markers.
Do not substitute a legacy map texture or invent missing ASA-specific nodes.
"""
import io,json,requests
from pathlib import Path
from PIL import Image
API="https://ark.wiki.gg/api.php"
S=requests.Session()
S.headers.update({"User-Agent":"ARKTribeHQ/1.0 fan atlas (source credited) Mozilla/5.0","Referer":"https://ark.wiki.gg/wiki/Resource_Map/Valguero"})
for title in ["Data:Maps/Resources/Valguero/ASA","Data:Maps/Resources/Valguero"]:
 r=S.get(API,params={"action":"query","titles":title,"prop":"revisions","rvprop":"content|ids","rvslots":"main","format":"json"},timeout=30);r.raise_for_status()
 page=list(r.json()["query"]["pages"].values())[0]
 if "revisions" not in page:
  print("MISSING RESOURCE PAGE",title,flush=True);continue
 rev=page["revisions"][0];data=json.loads(rev["slots"]["main"]["*"])
 print("RESOURCE SOURCE",title,"REVISION",rev["revid"],"BACKGROUND",data.get("backgrounds",data.get("background")),flush=True)
 print("CATEGORIES",[(k,len(v)) for k,v in data.get("markers",{}).items()],flush=True)
 break
else:raise RuntimeError("No published wiki Valguero resource positions")
points=[];omitted=[]
for cat,items in data.get("markers",{}).items():
 for i,p in enumerate(items):
  lat=p.get("lat",p.get("y"));lon=p.get("lon",p.get("x"))
  if not isinstance(lat,(int,float)) or not isinstance(lon,(int,float)) or not(0<=lat<=100 and 0<=lon<=100):
   omitted.append((cat,i));continue
  points.append({"id":f"wiki-{cat}-{i}","category":cat,"lat":round(lat,3),"lon":round(lon,3),"name":str(p.get("name",""))[:90]})
assert len(points)>50
Path("ark-command-center-desktop/src/valguero-wiki-resources.json").write_text(json.dumps({
 "source":"https://ark.wiki.gg/wiki/"+title.replace(" ","_"),"revision":rev["revid"],"verifiedASA":title.endswith("/ASA"),
 "omittedOutOfBoundsCount":len(omitted),"points":points},separators=(",",":"))+"\n")
print("VALID RESOURCE POINTS",len(points),"OMITTED",len(omitted),flush=True)
for filename in ["Valguero map ASA.jpg","Valguero Map ASA.jpg","Valguero ASA map.jpg","Valguero ASA.jpg"]:
 r=S.get(API,params={"action":"query","titles":"File:"+filename,"prop":"imageinfo","iiprop":"url|size","format":"json"},timeout=30);r.raise_for_status()
 item=list(r.json()["query"]["pages"].values())[0]
 info=item.get("imageinfo",[None])[0]
 print("ASA IMAGE SEARCH",filename,info,flush=True)
 if info and info["width"]>=1000 and info["height"]>=1000:break
else:raise RuntimeError("No authentic Valguero ASA map image located; do not silently use legacy terrain")
r=S.get(info["url"],timeout=60,headers={"Referer":"https://ark.wiki.gg/wiki/File:"+filename.replace(" ","_")});r.raise_for_status()
with Image.open(io.BytesIO(r.content)) as image:
 image.load()
 assert image.size[0]>=1000 and image.size[1]>=1000 and image.format in ("JPEG","PNG"),(image.format,image.size)
 # Convert to consistent native map JPEG if wiki artwork uses PNG.
 if image.format!="JPEG":
  out=io.BytesIO();image.convert("RGB").save(out,format="JPEG",quality=90);content=out.getvalue()
 else:content=r.content
dest=Path("ark-command-center-desktop/public/maps/valguero-asa.jpg")
dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(content)
print("GENUINE ASA TERRAIN SAVED",filename,len(content),flush=True)
