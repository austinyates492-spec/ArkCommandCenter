import React from 'react';
import {MapPin,ExternalLink,Info} from 'lucide-react';
import {creatureSpawnUrl,wikiSpawn} from './data.js';
import EmbeddedMap from './EmbeddedMap.jsx';
import './tame-spawn-atlas.css';

/** Linked to the parent planner selection; no duplicate species selector or map state. */
export default function TameSpawnAtlas({creature,map}){
 const selectedCreature=String(creature||'').trim();
 const selectedMap=String(map||'The Island');
 const source=creatureSpawnUrl(selectedMap,selectedCreature);
 return <section className="panel tame-spawn-atlas" aria-label="Creature spawn locations">
  <div className="panelhead">
   <h2><MapPin size={19}/> Spawn Locations</h2>
   <span className="badge gold">LINKED TO TAME SELECTION</span>
  </div>
  <div className="tame-spawn-summary">
   <div><small>SELECTED CREATURE</small><strong>{selectedCreature||'Choose a creature'}</strong></div>
   <div><small>SELECTED MAP</small><strong>{selectedMap}</strong></div>
   <a href={source} target="_blank" rel="noreferrer">Open spawn map <ExternalLink size={15}/></a>
  </div>
  <p className="tame-spawn-hint"><Info size={15}/> Changing the creature or map above updates this viewer automatically. The Wiki map may require selecting the creature in its own filter if its URL-based preselection is unavailable. Map regions are possible habitats, not guaranteed sightings.</p>
  <EmbeddedMap key={selectedMap+':'+selectedCreature} title={selectedMap+' — '+selectedCreature+' Spawn Map'}
   url={source} alternativeUrl={wikiSpawn(selectedMap)}
   selection={selectedCreature} kind="spawn"/>
 </section>;
}
