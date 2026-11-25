"""Acquire the exact official wiki ASA Genesis Ocean background used by spawn maps."""
import io,requests
from pathlib import Path
from PIL import Image
S=requests.Session();S.headers.update({"User-Agent":"ARKTribeHQ/1.0 source-credited map import Mozilla/5.0","Referer":"https://ark.wiki.gg/wiki/Spawn_Map/Genesis:_Part_1"})
api="https://ark.wiki.gg/api.php"
title="File:Genesis Part 1 Map ASA Ocean.jpg"
r=S.get(api,params={"action":"query","titles":title,"prop":"imageinfo","iiprop":"url|size","format":"json"},timeout=30);r.raise_for_status()
p=list(r.json()["query"]["pages"].values())[0]
info=p.get("imageinfo",[None])[0]
assert info and info["width"]==2048 and info["height"]==2048,"Exact Genesis Ocean ASA source map is unavailable"
r=S.get(info["url"],timeout=50);r.raise_for_status()
with Image.open(io.BytesIO(r.content)) as img:
 img.load();assert img.size==(2048,2048) and img.format=="JPEG"
dest=Path("ark-command-center-desktop/public/maps/genesis-part-1-ocean-asa.jpg")
dest.write_bytes(r.content)
print("GENESIS OCEAN ASA TERRAIN IMPORTED",len(r.content),flush=True)
