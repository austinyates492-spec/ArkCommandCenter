"""Inspect and import genuine Astraeos ASA map and source-labeled wiki resource positions."""
import io,json,requests
from pathlib import Path
from PIL import Image
API="https://ark.wiki.gg/api.php"
S=requests.Session();S.headers.update({"User-Agent":"ARKTribeHQ/1.0 fan resource atlas (wiki credited) Mozilla/5.0","Referer":"https://ark.wiki.gg/wiki/Resource_Map/Astraeos"})
for title in ["Data:Maps/Resources/Astraeos/ASA","Data:Maps/Resources/Astraeos","Data:Maps/Resources/Astreos/ASA","Data:Maps/Resources/Astreos"]:
 try:
  r=S.get(API,params={"action":"query","titles":title,"prop":"revisions","rvprop":"content|ids","rvslots":"main","format":"json"},timeout=30);r.raise_for_status()
  page=list(r.json()["query"]["pages"].values())[0]
  if "revisions" not in page: print("MISSING",title,flush=True);continue
  rev=page["revisions"][0];data=json.loads(rev["slots"]["main"]["*"])
  print("FOUND",title,"REV",rev["revid"],"BACKGROUND",data.get("background",data.get("backgrounds")),flush=True)
  print("CATEGORIES",[(k,len(v)) for k,v in data.get("markers",{}).items()],flush=True)
  break
 except Exception as e: print("SOURCE ERROR",title,str(e),flush=True)
else:
 print("NO PUBLIC DATAMAPS RESOURCE SOURCE FOR ASTRAEOS",flush=True)
 data=None
if data:
 points=[];omitted=[]
 for cat,items in data.get("markers",{}).items():
  for i,p in enumerate(items):
   lat=p.get("lat",p.get("y"));lon=p.get("lon",p.get("x"))
   if not isinstance(lat,(int,float)) or not isinstance(lon,(int,float)) or not (0<=lat<=100 and 0<=lon<=100):
    omitted.append((cat,i));continue
   points.append({"id":f"wiki-{cat}-{i}","category":cat,"lat":round(lat,3),"lon":round(lon,3),"name":str(p.get("name",""))[:90]})
 if points:
  Path("ark-command-center-desktop/src/astraeos-wiki-resources.json").write_text(json.dumps({
   "source":"https://ark.wiki.gg/wiki/"+title.replace(" ","_"),"revision":rev["revid"],"verifiedASA":title.endswith("/ASA"),
   "omittedOutOfBoundsCount":len(omitted),"points":points},separators=(",",":"))+"\n")
 print("SOURCE POINTS",len(points),"OMITTED",len(omitted),flush=True)
for fn in ["Astraeos map ASA.jpg","Astraeos Map ASA.jpg","Astraeos map.jpg","Astraeos Map.jpg","Astraeos topographic map.jpg","Astreos map ASA.jpg"]:
 r=S.get(API,params={"action":"query","titles":"File:"+fn,"prop":"imageinfo","iiprop":"url|size|mime","format":"json"},timeout=25);r.raise_for_status()
 p=list(r.json()["query"]["pages"].values())[0]
 info=p.get("imageinfo",[None])[0]
 print("IMAGE CANDIDATE",fn,info,flush=True)
 if info and info["width"]>=1000 and info["height"]>=1000 and "ASA" in fn:break
else:
 print("NO GENUINE ASA ARTWORK CANDIDATE",flush=True)
 info=None
if info:
 r=S.get(info["url"],timeout=45,headers={"Referer":"https://ark.wiki.gg/wiki/File:"+fn.replace(" ","_")});r.raise_for_status()
 with Image.open(io.BytesIO(r.content)) as img:
  img.load();assert img.width>=1000 and img.height>=1000
  if img.format=="JPEG":data_bytes=r.content
  else:
   buf=io.BytesIO();img.convert("RGB").save(buf,format="JPEG",quality=90);data_bytes=buf.getvalue()
 dest=Path("ark-command-center-desktop/public/maps/astraeos-asa.jpg");dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data_bytes)
 print("IMPORTED ASA ART",len(data_bytes),"FORMAT",fn,flush=True)
