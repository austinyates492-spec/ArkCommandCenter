import React,{useState} from 'react';
import {species,tameCreatures,asaCoverage} from './data';
import {knockoutProfiles} from './taming-engine';
import {passiveProfiles} from './passive-taming';
import {creatureAudit,auditTotals} from './creature-audit';

export default function CoveragePanel(){
 const [search,setSearch]=useState('');
 const [filter,setFilter]=useState('All');
 const rows=creatureAudit(),totals=auditTotals(rows);
 const view=rows.filter(row=>row.name.toLowerCase().includes(search.toLowerCase())&&(filter==='All'||(filter==='Needs knockout data'&&!row.knockout&&!row.passive)||(filter==='Knockout verified'&&row.knockout)||(filter==='Passive guide'&&row.passive)||(filter==='No breeding baseline'&&!row.maturation)));
 const data=[
  ['ASA source entries',asaCoverage.reference.listed,'Includes one explicitly labeled mod'],
  ['ASA baseline excluding labeled mod',asaCoverage.reference.baseOfficial,'Dododex comparison roster'],
  ['Reference names covered',asaCoverage.reference.baseOfficial,'All non-mod names matched'],
  ['Additional ASA breeder listing',1,'Ferox, absent from the comparison roster'],
  ['Documented ASA variant forms',asaCoverage.variantsInApp,'Shared base maturation timing'],
  ['Total catalog selections',totals.catalog,'Also includes non-tameable creatures'],
  ['Breeding profile selections',totals.breeding,'Base species and variants'],
  ['Knockout calculator profiles',totals.autoKnockout,'Includes wiki-derived and variant-assumed torpor values'],
  ['Full taming food/time profiles',totals.foodCalculators,'Independently modeled food requirements and time'],
  ['Passive taming method guides',totals.passiveGuides,'Most still require manual feed timing'],
  ['Hatch / gestation profiles',totals.verifiedHatch,'Separate baseline available']
 ];
 return <section className="panel knockout-panel"><div className="panelhead"><h2>ASA Database Coverage</h2><span className="badge gold">OFFICIAL MAPS + DLC</span></div>
  <div className="tablewrap"><table><thead><tr><th>DATASET</th><th>COUNT</th><th>NOTES</th></tr></thead><tbody>{data.map(([label,count,note])=><tr key={label}><td><strong>{label}</strong></td><td>{count}</td><td>{note}</td></tr>)}</tbody></table></div>
  <div className="notice">Reference: Dododex ASA category, excluding its explicit mod entry. Different sources count variants, bosses and entities differently. A name in the catalog is not itself validation of a taming formula.</div>
  <h3 className="sectioncap">CREATURE-BY-CREATURE AUDIT</h3>
  <div className="formgrid"><label className="field"><span>Search the ASA catalog</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rex, Giga, Wyvern..."/></label><label className="field"><span>Coverage filter</span><select value={filter} onChange={e=>setFilter(e.target.value)}>{['All','Needs knockout data','Knockout verified','Passive guide','No breeding baseline'].map(name=><option key={name}>{name}</option>)}</select></label></div>
  <div className="tablewrap coverage-scroll"><table><thead><tr><th>CREATURE</th><th>KNOCKOUT</th><th>FOOD/TIME</th><th>BREEDING</th><th>HATCH / BIRTH</th></tr></thead><tbody>{view.map(row=><tr key={row.name}><td>{row.name}</td><td>{row.knockout?'Torpor model':'Needs verification'}</td><td>{row.food?'Calculated':row.passive?'Passive guide':'Needs data'}</td><td>{row.maturation?'Maturation timed':'Not verified'}</td><td>{row.incubation?'Baseline':'Not verified'}</td></tr>)}</tbody></table></div>
  <div className="notice">Showing {view.length} of {rows.length}. Use the gaps above as the validation queue. Specialized/untameable creatures must not be forced through ordinary knockout formulas.</div>
 </section>;
}
