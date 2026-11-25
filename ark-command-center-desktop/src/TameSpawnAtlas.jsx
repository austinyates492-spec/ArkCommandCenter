import React from 'react';
import {MapPin,Info} from 'lucide-react';
import NativeSpawnAtlas from './NativeSpawnAtlas.jsx';
import './tame-spawn-atlas.css';

/** Linked directly to Taming Lab selection with no duplicate species or map selector. */
export default function TameSpawnAtlas({creature,map}){
 const selectedCreature=String(creature||'').trim();
 const selectedMap=String(map||'The Island');
 return <section className="panel tame-spawn-atlas" aria-label="Creature spawn locations">
  <div className="panelhead"><h2><MapPin size={19}/> Spawn Locations</h2><span className="badge gold">LINKED TO TAME SELECTION</span></div>
  <div className="tame-spawn-summary">
   <div><small>SELECTED CREATURE</small><strong>{selectedCreature||'Choose a creature'}</strong></div>
   <div><small>SELECTED MAP</small><strong>{selectedMap}</strong></div>
  </div>
  <p className="tame-spawn-hint"><Info size={15}/> Changing the creature or map above updates the native spawn overlay automatically. Regions come from ARK Wiki spawn tables, not sightings. Missing coverage is labeled unverified; no zones are invented.</p>
  <NativeSpawnAtlas key={selectedMap} map={selectedMap} creature={selectedCreature}/>
 </section>;
}
