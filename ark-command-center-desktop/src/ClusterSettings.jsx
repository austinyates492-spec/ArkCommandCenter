import React from 'react';
import {Activity,ExternalLink,Save,Shield} from 'lucide-react';
import {defaults} from './data.js';
import {NOMADARK_SOURCE,NOMADARK_DISCORD,NOMADARK_PROFILE,NOMADARK_RATE_FIELDS,applyNomadarkConfirmedRates,rateDescription} from './nomadark-profile.js';
import './nomadark.css';

const fields=['taming','hatch','mature','cuddle','breeding','food'];

export default function ClusterSettings({rates,setRates}){
 return <>
  <div className="pagetitle"><span className="eyebrow">CONFIGURATION / NOMADARK.NET</span><h1>Cluster Settings</h1><p>Your newly supplied NomadARK rules now drive taming and breeding. Unpublished imprint and dinosaur-hunger settings remain editable estimates.</p></div>
  <div className="two wideleft">
   <section className="panel">
    <div className="panelhead"><h2>NomadARK Multipliers</h2><span className="badge green">NEW CONFIRMED RATES</span></div>
    <div className="notice"><strong>Sources:</strong> <a href={NOMADARK_SOURCE} target="_blank" rel="noreferrer">NomadARK.net <ExternalLink size={13}/></a> plus the server settings you supplied · Updated {NOMADARK_PROFILE.checked}. <strong>10× taming · 8× maturation · 25× egg hatching · 0.2× mating interval · 10× harvesting · 10× XP · 5× crops.</strong></div>
    <div className="formgrid">{fields.map(key=>{
     const info=NOMADARK_RATE_FIELDS[key];
     const isPublished=info.status==='confirmed'&&Number(rates[key])===info.value;
     return <label className="field server-rate-field" key={key}>
      <span>{info.label} <span className={`badge ${isPublished?'green':'gold'}`}>{isPublished?'CONFIRMED':'UNVERIFIED / CUSTOM'}</span></span>
      <input type="number" min="0.001" step="0.1" value={rates[key]} onChange={event=>setRates(previous=>({...previous,[key]:Number(event.target.value)}))}/>
      <small className="rate-source-note">{rateDescription(key,rates[key])}</small>
     </label>;
    })}</div>
    <div className="actionrow"><button className="primary" onClick={()=>setRates(previous=>applyNomadarkConfirmedRates(previous))}>Apply Confirmed NomadARK Rates</button><button className="ghost" onClick={()=>setRates(defaults)}>Restore NomadARK Preset</button></div>
    <div className="notice"><strong>Important:</strong> Player food drain is <strong>0.50×</strong>, but that is NOT dinosaur food drain. Your {rates.food}× dinosaur food-drain and {rates.cuddle}× imprint-interval values remain estimates until administrators confirm them in <a href={NOMADARK_DISCORD} target="_blank" rel="noreferrer">NomadARK Discord <ExternalLink size={13}/></a>.</div>
   </section>
   <section className="panel"><div className="panelhead"><h2>Private Tribe Mode</h2></div>
    <div className="milestone"><Shield/><div><strong>Local-first privacy</strong><small>Your server records and timers stay on this PC.</small></div></div>
    <div className="milestone"><Save/><div><strong>Automatic local saves</strong><small>Inputs, records, and rate overrides are saved locally.</small></div></div>
    <div className="milestone"><Activity/><div><strong>Shared sync — planned</strong><small>Railway API and user accounts will connect tribe PCs after validation.</small></div></div>
    <div className="notice">NomadARK advertises custom server plugins and mods. Those can affect real behavior independently of the public rate multipliers. The app does not connect to NomadARK administration or read its private Game.ini.</div>
   </section>
  </div>
  <section className="panel nomad-rules"><div className="panelhead"><h2>NomadARK Gameplay & Weapon Rules</h2><span className="badge gold">SERVER REFERENCE</span></div>
   <div className="nomad-rules-grid">
    <div className="keyrow"><span>Tribe limit</span><strong>6 players · no alliances</strong></div>
    <div className="keyrow"><span>Tame / turret limit</span><strong>500 tames · 100 turrets</strong></div>
    <div className="keyrow"><span>Weapon cap</span><strong>354%</strong></div>
    <div className="keyrow"><span>Longneck Rifle buff</span><strong>300% (interpretation requires confirmation)</strong></div>
    <div className="keyrow"><span>Flamethrower nerf</span><strong>20%</strong></div>
    <div className="keyrow"><span>Saddles / armor cap</span><strong>Official</strong></div>
    <div className="keyrow"><span>Max stack size</span><strong>2,000</strong></div>
    <div className="keyrow"><span>Item weight reduction</span><strong>50%</strong></div>
    <div className="keyrow"><span>Structure limits</span><strong>8,000 snap · 70,000 global</strong></div>
    <div className="keyrow"><span>Pickup / Mindwipe</span><strong>Unlimited</strong></div>
    <div className="keyrow"><span>Upload retention</span><strong>72 hours</strong></div>
    <div className="keyrow"><span>Element / tribute transfer</span><strong>Enabled</strong></div>
    <div className="keyrow"><span>Player weight / fortitude</span><strong>5× / 2×</strong></div>
    <div className="keyrow"><span>Player food / water drain</span><strong>0.5× / 0.5×</strong></div>
   </div>
   <div className="notice">Longneck 300% is a server weapon-balance modifier, not a guaranteed blueprint weapon-damage percentage. The knockout calculator lets you set it separately and explains the 3× interpretation; avoid double counting if the in-game tooltip already reflects this buff. Nomad Jungle has separately advertised rates, outside our official-map preset.</div>
  </section>
 </>;
}
