"""Import all available ASA creature spawn map habitat rectangles with source revision.
Weights are relative within wiki spawn containers, NOT observed probability or
a guarantee of seeing a creature. Preserve source containers and point geometry.
"""
from pathlib import Path
import requests,json,re,collections
S=requests.Session()
S.headers.update({"User-Agent":"ARKTribeHQ/1.0 wiki licensed-source-attributed spawn atlas; Mozilla/5.0","Referer":"https://ark.wiki.gg/wiki/Spawn_Map/The_Island"})
API="https://ark.wiki.gg/api.php"
maps=[
 ("The Island","the-island"),("Scorched Earth","scorched-earth"),
 ("The Center","the-center"),("Aberration","aberration"),
 ("Extinction","extinction"),("Ragnarok","ragnarok"),
 ("Valguero","valguero"),("Astraeos","astraeos"),
 ("Lost Colony","lost-colony"),("Genesis: Part 1","genesis-part-1"),
 ("Genesis: Part 1 Ocean","genesis-part-1-ocean")
]
dir=Path("ark-command-center-desktop/src/spawn-source")
dir.mkdir(parents=True,exist_ok=True)
manifest={}
for map_name,slug in maps:
 title="Data:Spawn Map/"+map_name+"/ASA"
 candidates=[title,"Data:Spawn Map/"+map_name] if map_name=="Lost Colony" else [title]
 for candidate in candidates:
  r=S.get(API,params={"action":"query","titles":candidate,"prop":"revisions","rvprop":"content|ids","rvslots":"main","format":"json"},timeout=35);r.raise_for_status()
  page=list(r.json()["query"]["pages"].values())[0]
  if "revisions" not in page:continue
  revision=page["revisions"][0];raw=revision["slots"]["main"]["*"]
  if raw.startswith("#REDIRECT"):continue
  try:records=json.loads(raw)
  except Exception:continue
  if not isinstance(records,list):continue
  title=candidate;break
 else:
  manifest[map_name]={"status":"unavailable","species":0,"regions":0,"source":title}
  print("NO SOURCE",map_name,flush=True)
  continue
 indexed=collections.defaultdict(list)
 raw_rects=0;invalid=0;source_species=set()
 for container in records:
  groups=container.get("e",[])
  valid_groups=[g for g in groups if isinstance(g,dict) and isinstance(g.get("s"),list)]
  group_total=sum(max(0,float(g.get("c",0))) for g in valid_groups)
  if not group_total:continue
  regions=container.get("s",[])
  for group in valid_groups:
   members=group["s"]
   total_member_weight=sum(max(0,float(m.get("c",0))) for m in members if isinstance(m,dict) and m.get("n"))
   if total_member_weight<=0:continue
   by_species=collections.Counter()
   for m in members:
    if isinstance(m,dict) and isinstance(m.get("n"),str) and m["n"].strip():
     by_species[m["n"].strip()]+=max(0,float(m.get("c",0)))
   for species,w in by_species.items():
    # Combination of group choice and species relative selection, not an
    # absolute creature appearance probability; no population limits inferred.
    weight=round((max(0,float(group.get("c",0)))/group_total)*(w/total_member_weight),6)
    if weight<=0:continue
    source_species.add(species)
    for reg in regions:
     flags=reg.get("f")
     for spot in reg.get("l",[]):
      if not isinstance(spot,list) or len(spot) not in (2,4) or not all(isinstance(x,(float,int)) for x in spot):
       invalid+=1;continue
      if len(spot)==4:
       lat1,lon1,lat2,lon2=map(float,spot)
       if lat1>lat2:lat1,lat2=lat2,lat1
       if lon1>lon2:lon1,lon2=lon2,lon1
       if lat2<0 or lon2<0 or lat1>100 or lon1>100:invalid+=1;continue
       # Clip solely to image viewport; retain original outside-0-100 bounds
       # in source external wiki. A clipped rectangle is not a new node.
       pos=[round(max(0,lat1),3),round(max(0,lon1),3),round(min(100,lat2),3),round(min(100,lon2),3)]
       if pos[0]>=pos[2] or pos[1]>=pos[3]:invalid+=1;continue
      else:
       lat,lon=spot
       if not(0<=lat<=100 and 0<=lon<=100):invalid+=1;continue
       pos=[round(float(lat),3),round(float(lon),3)]
      # Keep each individual source entry weighting + container for audit
      indexed[species].append([pos,weight,container.get("n",""),flags])
      raw_rects+=1
 # Merge exact duplicates from multi-group containers by strongest relative weight
 # only for rendering; never add stacked chances together.
 compact={}
 for species,entries in sorted(indexed.items()):
  dedup={}
  for pos,w,container,flags in entries:
   key=(tuple(pos),str(container),str(flags))
   if key not in dedup or w>dedup[key][1]:
    dedup[key]=[pos,w,container,flags]
  compact[species]=list(dedup.values())
 path=dir/(slug+".json")
 path.write_text(json.dumps({"map":map_name,"source":"https://ark.wiki.gg/wiki/"+title.replace(" ","_"),"revision":revision["revid"],"verifiedASA":title.endswith("/ASA"),
 "weightSemantics":"Relative group and species selection share within individual spawn containers, not observed spawn chance or per-location probability.",
 "species":compact},separators=(",",":"))+"\n")
 summary={"status":"imported","source":title,"revision":revision["revid"],"species":len(compact),"regions":sum(map(len,compact.values())),"skipped":invalid,"size":path.stat().st_size,"verifiedASA":title.endswith("/ASA")}
 manifest[map_name]=summary
 print("IMPORT MAP",map_name,summary,flush=True)
(dir/"manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")
print("TOTAL MAPS",len([x for x in manifest.values() if x["status"]=="imported"]),"TOTAL CREATURE NAMES",len(set(n for p in dir.glob("*.json") if p.name!="manifest.json" for n in json.loads(p.read_text()).get("species",{}))),flush=True)
