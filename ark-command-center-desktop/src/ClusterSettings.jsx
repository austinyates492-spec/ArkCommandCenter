import React from 'react';
import {Activity,ExternalLink,Save,Shield} from 'lucide-react';
import {NOMADARK_SOURCE} from './nomadark-profile.js';
import {clusterPresets,presetById,OFFICIAL_MODES_SOURCE} from './cluster-presets.js';
import './nomadark.css';

const labels={taming:'Taming speed',hatch:'Egg hatch / gestation speed',mature:'Baby maturation',cuddle:'Imprint cuddle interval',breeding:'Mating interval',food:'Dinosaur food drain'};
export default function ClusterSettings({rates,setRates,clusterId,onClusterChange}){
 const preset=presetById(clusterId);
 return <>
  <div className="pagetitle"><span className="eyebrow">CONFIGURATION / SERVER PROFILES</span><h1>Cluster Settings</h1><p>Switch between official game modes and your private cluster in the top-right menu. Multipliers immediately update the taming and breeding calculators.</p></div>
  <div className="two wideleft">
   <section className="panel"><div className="panelhead"><h2>{preset.label} · Rates</h2><span className={`badge ${preset.verified?'green':'gold'}`}>{preset.verified?'BASELINE SOURCE':'VERIFY WITH SERVER'}</span></div>
    <label className="field"><span>Active cluster</span><select value={clusterId} onChange={event=>onClusterChange(event.target.value)}>{clusterPresets.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
    <div className="notice">{preset.description} Official server rates may temporarily change for events. Source: <a href={preset.source||OFFICIAL_MODES_SOURCE} target="_blank" rel="noreferrer">Wildcard's published server rules <ExternalLink size={13}/></a>.</div>
    <div className="formgrid">{Object.entries(labels).map(([key,label])=><label className="field server-rate-field" key={key}><span>{label}</span><input type="number" min="0.001" step="0.1" value={rates[key]} onChange={event=>setRates(previous=>({...previous,[key]:Number(event.target.value)}))}/><small className="rate-source-note">{preset.rates&&Number(rates[key])===Number(preset.rates[key])?'Preset baseline':'Manual override'}{key==='food'||key==='cuddle'?' · confirm server-specific mechanics':''}</small></label>)}</div>
    <div className="actionrow"><button className="primary" onClick={()=>onClusterChange(clusterId)}>Restore {preset.label} Rates</button><button className="ghost" onClick={()=>onClusterChange('custom')}>Use Current Rates as Custom</button></div>
    <div className="notice">Your per-account active profile syncs with Tribe Cloud. Tribe timers and crafting queues remain shared between members; changing rates does not rewrite timers already running.</div>
   </section>
   <section className="panel"><div className="panelhead"><h2>Tribe Cloud</h2></div>
    <div className="milestone"><Shield/><div><strong>Your account stays private</strong><small>Login and theme are personal; you decide which cluster profile to use.</small></div></div>
    <div className="milestone"><Save/><div><strong>Saved across sessions</strong><small>Your rates and profile are stored locally and in your signed-in profile.</small></div></div>
    <div className="milestone"><Activity/><div><strong>Live shared workspace</strong><small>Tribe timers, scouting records and shared crafting synchronize from Railway.</small></div></div>
    <div className="notice">Cluster profiles change calculations only. They do not connect to game server administration or read private Game.ini settings.</div>
   </section>
  </div>
  {clusterId==='nomadark'&&<section className="panel nomad-rules"><div className="panelhead"><h2>NomadARK Gameplay Rules</h2><span className="badge gold">REFERENCE</span></div><div className="nomad-rules-grid">
   <div className="keyrow"><span>Tribe / alliances</span><strong>6 · No alliances</strong></div>
   <div className="keyrow"><span>Tame / turret cap</span><strong>500 / 100</strong></div>
   <div className="keyrow"><span>Weapon / armor</span><strong>354% weapon cap · official armor</strong></div>
   <div className="keyrow"><span>Longneck / flamethrower</span><strong>300% buff / 20% nerf</strong></div>
   <div className="keyrow"><span>Harvest / XP / crops</span><strong>10× / 10× / 5×</strong></div>
   <div className="keyrow"><span>Stack / weight</span><strong>2,000 / 50% reduction</strong></div>
   <div className="keyrow"><span>Structure limits</span><strong>8,000 snap / 70,000 global</strong></div>
   <div className="keyrow"><span>Transfer retention</span><strong>72h</strong></div>
  </div><div className="notice">Server rules supplied by your tribe, with <a href={NOMADARK_SOURCE} target="_blank" rel="noreferrer">NomadARK.net <ExternalLink size={13}/></a>. The published 0.5× food drain is PLAYER food drain, not dinosaur food drain. Weapon buffs can differ from tooltip damage.</div></section>}
 </>;
}
