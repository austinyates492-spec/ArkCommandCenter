"""Import documented ARK Official Community Wiki ASA The Island resource positions.

The source MediaWiki DataMaps page is explicitly ASA; never use ASE or
invent missing category markers. Wiki contributor data CC BY-NC-SA 4.0;
game marks and terrain separately owned by rights holders.
"""
import json
from pathlib import Path
import requests

SOURCE = "Data:Maps/Resources/The Island/ASA"
URL = "https://ark.wiki.gg/wiki/Data:Maps/Resources/The_Island/ASA"
REVISION = 548223
API = "https://ark.wiki.gg/api.php"
session = requests.Session()
session.headers.update({
  "User-Agent":"ARKTribeHQ/1.0 (noncommercial fan resource atlas; attribution to ARK Official Community Wiki) Mozilla/5.0",
  "Referer":"https://ark.wiki.gg/wiki/Resource_Map/The_Island"
})
response=session.get(API,params={
  "action":"query","titles":SOURCE,"prop":"revisions","rvprop":"content|ids",
  "rvslots":"main","format":"json"
},timeout=30)
response.raise_for_status()
pages=list(response.json()["query"]["pages"].values())
assert len(pages)==1 and "revisions" in pages[0], "ASA wiki data page not available"
revision=pages[0]["revisions"][0]
assert revision["revid"]==REVISION, "Source revision changed; manual review needed"
data=json.loads(revision["slots"]["main"]["*"])
assert data["background"]["image"]=="The Island map ASA.jpg", "Wrong source terrain"
markers=data["markers"]
print("WIKI SOURCE CATEGORY COUNTS",[(k,len(v)) for k,v in markers.items()])
for k,arr in markers.items():
 print("SAMPLE",k,arr[0] if arr else None)
assert len(markers)>=5, "Unexpectedly few resource types"
outfile=Path("ark-command-center-desktop/src/island-asa-wiki-resources.json")
transformed=[]
skipped=[]
for category,points in markers.items():
 for i,node in enumerate(points):
  lat,lon=node.get("y"),node.get("x")
  if not isinstance(lat,(int,float)) or not isinstance(lon,(int,float)):
   raise ValueError(f"Invalid resource location: {category} index {i}: {node}")
  if not (0<=lat<=100 and 0<=lon<=100):
   skipped.append((category,i,lat,lon))
   continue
  transformed.append({
    "id":f"wiki-{category}-{i}",
    "category":category,
    "lat":round(lat,3),
    "lon":round(lon,3),
    "name":str(node.get("name",""))[:100]
  })
assert len(transformed)>=100, "Unexpectedly sparse dataset"
outfile.write_text(json.dumps({
  "source":URL,"revision":REVISION,
  "coordinateSystem":"ASA wiki resource map / in-game minimap",
  "omittedOutOfBoundsCount":len(skipped),
  "points":transformed
},separators=(",",":"))+"\n")
print("SUCCESS wiki points",len(transformed),"skipped out-of-bounds",len(skipped),"output",outfile)
