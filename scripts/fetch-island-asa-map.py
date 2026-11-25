"""Retrieve the verified 2048px ASA Island background; abort on denial or wrong bytes.

This script is intentionally fail-closed. It never substitutes some other map.
Attribution: ARK Official Community Wiki / Studio Wildcard.
Original file: https://ark.wiki.gg/wiki/File:The_Island_map_ASA.jpg
Use of game artwork remains subject to relevant rights-holder policies.
"""
import io
from pathlib import Path
from urllib.parse import quote
import requests
from PIL import Image

DEST = Path("ark-command-center-desktop/public/maps/the-island-asa.jpg")
if DEST.exists():
    with Image.open(DEST) as img:
        assert img.size == (2048, 2048), img.size
        assert img.format == "JPEG", img.format
    print("Verified asset already committed", DEST)
    raise SystemExit(0)

api = "https://ark.wiki.gg/api.php"
file = "File:The Island map ASA.jpg"
urls = [
    "https://ark.wiki.gg/wiki/Special:Redirect/file/The_Island_map_ASA.jpg",
    "https://ark.wiki.gg/wiki/Special:Redirect/file/" + quote("The Island map ASA.jpg"),
]
session = requests.Session()
session.headers.update({
 "User-Agent": "ARKTribeHQResourceAtlas/1.0 (noncommercial fan site; source attribution on page) Mozilla/5.0",
 "Accept": "image/jpeg,image/*;q=0.9,*/*;q=0.8",
 "Referer": "https://ark.wiki.gg/wiki/File:The_Island_map_ASA.jpg",
})
try:
    res = session.get(api, params={
        "action":"query", "titles":file, "prop":"imageinfo",
        "iiprop":"url", "format":"json", "formatversion":"2"
    }, timeout=20)
    if res.ok:
        pages=res.json().get("query",{}).get("pages",[])
        for page in pages:
            for info in page.get("imageinfo",[]):
                for key in ("url", "thumburl"):
                    url=info.get(key)
                    if url and url not in urls: urls.insert(0,url)
        print("Wiki API yielded",len(urls),"candidate URLs")
    else:
        print("Wiki API denied with status",res.status_code)
except Exception as exc:
    print("Wiki API lookup failed:",type(exc).__name__,str(exc)[:180])

for url in urls:
    try:
        print("Trying",url[:160])
        response=session.get(url,timeout=30,allow_redirects=True)
        print("HTTP",response.status_code,"bytes",len(response.content),
              "type",response.headers.get("Content-Type"),"at",response.url[:160])
        if response.status_code != 200 or len(response.content)>8000000:continue
        with Image.open(io.BytesIO(response.content)) as img:
            img.load()
            if img.size != (2048,2048):
                print("Incorrect size",img.size);continue
            if img.format != "JPEG":
                print("Incorrect image format",img.format);continue
        DEST.parent.mkdir(parents=True,exist_ok=True)
        DEST.write_bytes(response.content)
        print("Downloaded verified 2048 x 2048 JPEG to",DEST)
        break
    except Exception as exc:
        print("Download failed:",type(exc).__name__,str(exc)[:180])
else:
    raise SystemExit("Unable to retrieve verified wiki image; refusing placeholder or alternative.")
