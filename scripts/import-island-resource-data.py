"""Import ASA Island resource nodes from ARK Official Community Wiki MediaWiki data page.
Do not substitute ASE coordinates, guessed nodes, or another map.
Source: https://ark.wiki.gg/wiki/Data:Maps/Resources/The_Island/ASA
License: CC BY-NC-SA 4.0 for wiki-contributed data; original ARK game IP separate.
"""
import requests,json
s=requests.Session()
s.headers.update({"User-Agent":"ARKTribeHQ/1.0 (noncommercial fan atlas; wiki attribution); Mozilla/5.0","Referer":"https://ark.wiki.gg/wiki/Resource_Map/The_Island","Accept":"application/json,text/plain,*/*"})
title="Data:Maps/Resources/The Island/ASA"
api="https://ark.wiki.gg/api.php"
queries=[
 {"action":"query","titles":title,"prop":"revisions","rvprop":"content|ids","rvslots":"main","format":"json"},
 {"action":"parse","page":title,"prop":"wikitext","format":"json"},
]
for params in queries:
 try:
  r=s.get(api,params=params,timeout=25)
  print("STATUS",r.status_code,"URL",r.url,"HEAD",r.text[:2000])
 except Exception as e:print("ERROR",str(e))
