"""Probe genuine Lost Colony map and published wiki GPS source datasets.
Only accept a source image explicitly identified as Lost Colony; never substitute
generic terrain or fabricate resource coordinates.
"""
import io,json,requests
from pathlib import Path
from PIL import Image
API="https://ark.wiki.gg/api.php"
S=requests.Session();S.headers.update({"User-Agent":"ARKTribeHQ/1.0 fan atlas (wiki attribution) Mozilla/5.0","Referer":"https://ark.wiki.gg/wiki/Resource_Map/Lost_Colony"})
for title in ["Data:Maps/Resources/Lost Colony/ASA","Data:Maps/Resources/Lost Colony","Data:Maps/Resources/Lost_Colony/ASA","Data:Maps/Exploration/Lost Colony/ASA","Data:Maps/Exploration/Lost Colony"]:
 try:
  r=S.get(API,params={"action":"query","titles":title,"prop":"revisions","rvprop":"content|ids","rvslots":"main","format":"json"},timeout=25);r.raise_for_status()
  p=list(r.json()["query"]["pages"].values())[0]
  if "revisions" not in p:print("MISSING DATASET",title,flush=True);continue
  rev=p["revisions"][0];obj=json.loads(rev["slots"]["main"]["*"])
  print("FOUND DATASET",title,"REV",rev["revid"],"KEYS",list(obj),"BACKGROUND",obj.get("background",obj.get("backgrounds")),flush=True)
  print("CATEGORIES",[(k,len(v)) for k,v in obj.get("markers",{}).items()],flush=True)
  if "Resources" not in title:continue
  points=[];omitted=[]
  for cat,entries in obj.get("markers",{}).items():
   for i,item in enumerate(entries):
    lat=item.get("lat",item.get("y"));lon=item.get("lon",item.get("x"))
    if not isinstance(lat,(int,float)) or not isinstance(lon,(int,float)) or not (0<=lat<=100 and 0<=lon<=100):
     omitted.append([cat,i]);continue
    points.append({"id":f"wiki-{cat}-{i}","category":cat,"lat":round(lat,3),"lon":round(lon,3),"name":str(item.get("name",""))[:90]})
  if points:
   dest=Path("ark-command-center-desktop/src/lost-colony-wiki-resources.json")
   dest.write_text(json.dumps({"source":"https://ark.wiki.gg/wiki/"+title.replace(" ","_"),"revision":rev["revid"],"verifiedASA":title.endswith("/ASA"),"omittedOutOfBoundsCount":len(omitted),"points":points},separators=(",",":"))+"\n")
   print("SOURCE POINTS",len(points),"OMITTED",len(omitted),flush=True)
 except Exception as e:print("DATASET ERROR",title,str(e),flush=True)
for fn in ["Lost Colony map ASA.jpg","Lost Colony Map ASA.jpg","Lost Colony map.jpg","Lost Colony Map.jpg","Lost Colony map ASA.png","Lost Colony Map ASA.png","Lost Colony map.png","Lost Colony Map.png"]:
 try:
  r=S.get(API,params={"action":"query","titles":"File:"+fn,"prop":"imageinfo","iiprop":"url|size|mime","format":"json"},timeout=25);r.raise_for_status()
  p=list(r.json()["query"]["pages"].values())[0];info=p.get("imageinfo",[None])[0]
  print("IMAGE CANDIDATE",fn,info,flush=True)
  if not info or "ASA" not in fn or info["width"]<1000 or info["height"]<1000:continue
  r=S.get(info["url"],timeout=50,headers={"Referer":"https://ark.wiki.gg/wiki/File:"+fn.replace(" ","_")});r.raise_for_status()
  with Image.open(io.BytesIO(r.content)) as image:
   image.load()
   if image.format=="JPEG":result=r.content
   else:
    b=io.BytesIO();image.convert("RGB").save(b,format="JPEG",quality=90);result=b.getvalue()
  target=Path("ark-command-center-desktop/public/maps/lost-colony-asa.jpg");target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(result)
  print("GENUINE MAP IMPORTED",fn,len(result),flush=True)
  break
 except Exception as e:print("IMAGE ERROR",fn,str(e),flush=True)
else:print("NO VERIFIED ASA TERRAIN FOUND",flush=True)
