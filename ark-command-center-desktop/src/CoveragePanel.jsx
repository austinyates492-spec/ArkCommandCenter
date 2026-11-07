import React,{useState} from 'react';
import {species,tameCreatures,asaCoverage} from './data';
import {knockoutProfiles} from './taming-engine';
import {passiveProfiles} from './passive-taming';
import {creatureAudit,auditTotals} from './creature-audit';
import {knockoutRoster,passiveRoster,specialtyRoster} from './special-taming-methods.js';

export default function CoveragePanel(){
 const [search,setSearch]=useState('');
 const [filter,setFilter]=useState('All');
 const rows=creatureAudit(),totals=auditTotals(rows);
 const view=rows.filter(row=>row.name.toLowerCase().includes(search.toLowerCase())&&(filter==='All'||(filter==='Needs knockout data'&&!row.knockout&&!row.torporReference)||(filter==='Knockout profiles'&&row.knockout)||(filter==='Torpor references'&&row.torporReference)||(filter==='Passive / special'&&row.method.includes('Passive'))||(filter==='Untameable'&&row.method==='Untameable')||(filter==='Special / unclassified'&&row.method==='Special / unclassified')||(filter==='No breeding baseline'&&!row.maturation)));
 const data=[
  ['ASA source entries',asaCoverage.reference.listed,'Includes one explicitly labeled mod'],
  ['ASA baseline excluding labeled mod',asaCoverage.reference.baseOfficial,'Dododex comparison roster'],
  ['Reference names covered',asaCoverage.reference.baseOfficial,'All non-mod names matched'],
  ['Additional ASA breeder listing',1,'Ferox, absent from the comparison roster'],
  ['Documented ASA variant forms',asaCoverage.variantsInApp,'Source-documented forms sharing base reproduction times'],
  ['Total catalog selections',totals.catalog,'Also includes non-tameable creatures'],
  ['Conventional Taming Lab species/forms',knockoutRoster.length,'Only tranq knockout methods'],
  ['Specialty Taming Lab species/forms',specialtyRoster.length,'Wiki-documented heavy, egg, offering and encounter methods; some are unreleased or unquantified'],
  ['Passive Taming Lab species/forms',passiveRoster.length,'Nonviolent species with wiki or reviewed feeding methods'],
  ['Knockout-category selections',rows.filter(r=>r.method.includes('Knockout')).length,'Base ASA classification inherited by variants'],
  ['Passive/special-category selections',rows.filter(r=>r.method.includes('Passive')).length,'Not necessarily ordinary passive feeding'],
  ['Untameable selections',rows.filter(r=>r.method==='Untameable').length,'Never shown as ordinary knockout tames'],
  ['Breeding profile selections',totals.breeding,'156 source-reviewed base entries plus 64 forms'],
  ['Knockout calculator profiles',totals.autoKnockout,'Includes wiki-derived and variant-assumed torpor values'],
  ['Special / unclassified method entries',totals.methodUnclassified,'Require individual page or game-specific mechanics review'],
  ['Taming food/time profiles',totals.foodCalculators,'14 previously reviewed; others imported from published wiki baseline'],
  ['Passive taming method guides',totals.passiveGuides,'Most still require manual feed timing'],
  ['Hatch / gestation profiles',totals.verifiedHatch,'Source-reviewed 1× incubation / gestation baseline; special reproduction may differ']
 ];
 return <section className="panel knockout-panel"><div className="panelhead"><h2>ASA Database Coverage</h2><span className="badge gold">OFFICIAL MAPS + DLC</span></div>
  <div className="tablewrap"><table><thead><tr><th>DATASET</th><th>COUNT</th><th>NOTES</th></tr></thead><tbody>{data.map(([label,count,note])=><tr key={label}><td><strong>{label}</strong></td><td>{count}</td><td>{note}</td></tr>)}</tbody></table></div>
  <div className="notice">Reference: Dododex ASA category and its knockout, passive and untameable category filters; base methods are inherited by variants and need individual variant confirmation. Category membership is not verification of ammo efficiency, headshot multipliers, torpor growth, or special tame mechanics.</div>
  <h3 className="sectioncap">CREATURE-BY-CREATURE AUDIT</h3>
  <div className="formgrid"><label className="field"><span>Search the ASA catalog</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rex, Giga, Wyvern..."/></label><label className="field"><span>Coverage filter</span><select value={filter} onChange={e=>setFilter(e.target.value)}>{['All','Needs knockout data','Knockout profiles','Torpor references','Passive / special','Untameable','Special / unclassified','No breeding baseline'].map(name=><option key={name}>{name}</option>)}</select></label></div>
  <div className="tablewrap coverage-scroll"><table><thead><tr><th>CREATURE</th><th>TAMING METHOD</th><th>KNOCKOUT DATA</th><th>FOOD/TIME</th><th>BREEDING</th><th>HATCH / BIRTH</th></tr></thead><tbody>{view.map(row=><tr key={row.name}><td>{row.name}</td><td><strong>{row.method}</strong><small style={{display:'block',opacity:.7}}>{row.methodSource}</small></td><td>{row.knockout?'Torpor profile':row.torporReference?'Theoretical only':'Not applicable / unverified'}</td><td>{row.food?'Calculated':row.passive?'Passive guide':'Needs data'}</td><td>{row.maturation?'Maturation timed':'Not verified'}</td><td>{row.incubation?'Baseline':'Not verified'}</td></tr>)}</tbody></table></div>
  <div className="notice">Showing {view.length} of {rows.length}. Use the gaps above as the validation queue. Specialized/untameable creatures must not be forced through ordinary knockout formulas.</div>
 </section>;
}
