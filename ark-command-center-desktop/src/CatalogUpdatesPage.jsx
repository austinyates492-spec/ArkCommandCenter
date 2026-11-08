import React from 'react';
import {Cloud,ExternalLink,CheckCircle2} from 'lucide-react';
export default function CatalogUpdatesPage({catalog}){
 return <div><div className="pagetitle"><span className="eyebrow">ARK KNOWLEDGE / LIVE SOURCES</span><h1>Creature & Recipe Updates</h1><p>The live wiki feed checks for new content every six hours on the server and the app checks hourly and on launch.</p></div>
 <section className="panel"><div className="panelhead"><h2>Live Data Status</h2><span className={`badge ${catalog.status==='live'?'green':'gold'}`}>{catalog.status.toUpperCase()}</span></div>
  <div className="milestone"><Cloud/><div><strong>{catalog.catalog?'Source snapshot available':'Awaiting first source snapshot'}</strong><small>{catalog.catalog?.checkedAt?`Last source check: ${new Date(catalog.catalog.checkedAt).toLocaleString()}`:'Bundled offline content remains available.'}</small></div></div>
  <div className="keyrow"><span>Additional recipe candidates</span><strong>{Object.keys(catalog.recipes).length}</strong></div>
  <div className="keyrow"><span>New creature page candidates</span><strong>{catalog.creatures.length}</strong></div>
  {catalog.isCached&&<div className="notice">The last snapshot is older than twelve hours; cached data will continue working while the source is unavailable.</div>}
  {catalog.error&&<div className="notice">Latest refresh: {catalog.error}</div>}
  <div className="notice">Live content is detected from the ARK Official Community Wiki, not from a direct connection to the game. Newly found creatures are searchable in Taming Lab with manual timers, but their taming method and quantities remain **unverified** until reviewed. New recipe candidates can be selected in the crafting tools; verify their ASA availability and output yield.</div>
 </section>
 <div className="two"><section className="panel"><div className="panelhead"><h2>New Creature Pages</h2><span className="badge gold">UNVERIFIED</span></div>{catalog.creatures.length?catalog.creatures.slice(0,80).map(name=><div className="keyrow" key={name}><span>{name}</span><a href={`https://ark.wiki.gg/wiki/${encodeURIComponent(name.replaceAll(' ','_'))}`} target="_blank" rel="noreferrer">Wiki <ExternalLink size={12}/></a></div>):<div className="empty">No new creature candidates currently available.</div>}</section>
  <section className="panel"><div className="panelhead"><h2>New Recipe Candidates</h2><span className="badge gold">CHECK ASA</span></div>{Object.keys(catalog.recipes).length?Object.keys(catalog.recipes).sort().slice(0,80).map(name=><div className="keyrow" key={name}><span>{name}</span><CheckCircle2 size={13}/></div>):<div className="empty">No additional recipe candidates currently available.</div>}</section></div>
 </div>;
}
