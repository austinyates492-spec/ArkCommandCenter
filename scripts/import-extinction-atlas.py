"""Import verified provenance Extinction game terrain and wiki resource/OSD records."""
import io,json,requests
from pathlib import Path
from PIL import Image
S=requests.Session()
S.headers.update({"User-Agent":"ARKTribeHQ/1.0 (noncommercial fan atlas; wiki attribution) Mozilla/5.0","Referer":"https://ark.wiki.gg/wiki/Resource_Map/Extinction"})
API="https://ark.wiki.gg/api.php"
for title in ["Data:Maps/Resources/Extinction/ASA","Data:Maps/Resources/Extinction"]:
 r=S.get(API,params={"action":"query","titles":title,"prop":"revisions","rvprop":"content|ids","rvslots":"main","format":"json"},timeout=30);r.raise_for_status()
 page=list(r.json()["query"]["pages"].values())[0]
 if "revisions" in page:
  revision=page["revisions"][0]; data=json.loads(revision["slots"]["main"]["*"])
  print("SOURCE",title,"REVISION",revision["revid"],"FIELDS",list(data),"BACKGROUND",data.get("background",data.get("backgrounds")),flush=True)
  print("CATEGORIES",[(key,len(v)) for key,v in data.get("markers",{}).items()],flush=True)
  break
 print("MISSING",title,flush=True)
else:raise RuntimeError("No wiki Extinction resource coordinates found")
points=[];skipped=[]
for category,items in data["markers"].items():
 for i,p in enumerate(items):
  lon=p.get("lon",p.get("x"));lat=p.get("lat",p.get("y"))
  if not isinstance(lon,(float,int)) or not isinstance(lat,(float,int)) or not(0<=lon<=100 and 0<=lat<=100):
   skipped.append((category,i));continue
  points.append({"id":f"wiki-{category}-{i}","category":category,"lon":round(lon,3),"lat":round(lat,3),"name":str(p.get("name",""))[:95]})
assert len(points)>40
Path("ark-command-center-desktop/src/extinction-wiki-resources.json").write_text(json.dumps({
 "source":"https://ark.wiki.gg/wiki/"+title.replace(" ","_"),"revision":revision["revid"],"verifiedASA":title.endswith("/ASA"),
 "omittedOutOfBoundsCount":len(skipped),"points":points},separators=(",",":"))+"\n")
print("SOURCED GPS",len(points),"SKIPPED",len(skipped),flush=True)
title="File:Extinction map ASA.jpg"
r=S.get(API,params={"action":"query","titles":title,"prop":"imageinfo","iiprop":"url|size","format":"json"},timeout=30);r.raise_for_status()
item=list(r.json()["query"]["pages"].values())[0]
print("IMAGE META",item,flush=True)
info=item.get("imageinfo",[None])[0]
assert info and info["width"]==2048 and info["height"]==2048,"Expected exact ASA artwork, not older game image"
r=S.get(info["url"],timeout=50,headers={"Referer":"https://ark.wiki.gg/wiki/File:Extinction_map_ASA.jpg"});r.raise_for_status()
with Image.open(io.BytesIO(r.content)) as img:
 img.load();assert img.format=="JPEG" and img.size==(2048,2048)
out=Path("ark-command-center-desktop/public/maps/extinction-asa.jpg");out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(r.content)
print("TERRAIN SAVED",len(r.content),flush=True)

# Review separately published OSD/Element Vein coordinate sources; never
# merge third-party candidates into wiki resource markers without provenance.
for url in [
 "https://wikily.gg/ark-survival-ascended/maps/extinction/",
 "https://www.dinoindex.com/maps/extinction",
]:
 try:
  response=S.get(url,timeout=25)
  body=response.text
  print("EVENT SOURCE",url,"STATUS",response.status_code,"HTML LENGTH",len(body),flush=True)
  for keyword in ["Orbital supply drops","element-vein","osd-spawn","Element Node Sites","orbital_supply_drop"]:
   i=body.lower().find(keyword.lower())
   if i>=0:print("EVENT KEY",keyword,"POS",i,"EXCERPT",body[max(0,i-120):i+420].replace("\\n"," ")[:540],flush=True)
  for raw in ["__NEXT_DATA__","application/ld+json","__next_f.push","osdLocations"]:
   print("EVENT SCRIPT MARKER",raw,body.find(raw),flush=True)
 except Exception as e:print("EVENT SOURCE ERROR",repr(e),flush=True)
