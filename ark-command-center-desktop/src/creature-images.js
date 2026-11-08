import {breedingVariants} from './breeding-variants.js';

// ARK Utils publishes species images under the MIT license. Their ASA images
// render without ARK Wiki's bot-protected media requests, and each is named
// after its species. Do not cache or redistribute Wildcard/Wiki fair-use art.
export const PORTRAIT_SOURCE='https://github.com/arkutils/species-images';
export const PORTRAIT_LICENSE='https://github.com/arkutils/species-images/blob/main/LICENSE';
const IMAGE_BASE='https://raw.githubusercontent.com/arkutils/species-images/main/images/';

const ALIASES={
 'Sarcosuchus':'Sarco',
 'Spinosaurus':'Spino',
 'Triceratops':'Trike',
 'Direbear':'Dire Bear'
};

// Several official creature families have only a named form in the image
// collection. These are verified filenames, not generic dinosaur substitutes.
// Keep them ahead of the speculative filename fallback so they render without
// waiting for a sequence of failed requests.
const VERIFIED_FORMS={
 'Cat':['Cat_ASA_p1.png'],
 'Drakeling':['Drakeling (Spring)_ASA.png'],
 'Grendel':['Grendel (Alpha)_ASA.png'],
 'Hydraskos':['Hydraskos the Unbroken_ASA.png'],
 'Jug Bug':['Element Jug Bug.png'],
 'Manticore':['Manticore Alpha.png'],
 'Megapithecus':['Megapithecus Alpha.png'],
 'Reaper':['Reaper King_ASA.png'],
 'Revenant':['Revenant Rex_ASA.png'],
 'Therizinosaurus':['Therizinosaur_ASA.png'],
 'Tidepup':['Tidepup (Small)_ASA.png'],
 'Titanomyrma':['Titanomyrma Soldier.png'],
 'Wyvern':['Fire Wyvern_ASA.png']
};

export function imageSpeciesNames(creature){
 if(typeof creature!=='string'||creature.length>100||!/^[\w\s:'’\-().,]+$/u.test(creature))return [];
 const parent=breedingVariants[creature]||creature.replace(/^(?:Aberrant |Tek |X-|R-)/,'');
 return [...new Set([creature,parent,ALIASES[parent]].filter(Boolean))];
}

export function portraitCandidates(creature){
 const names=imageSpeciesNames(creature);
 if(!names.length)return [];
 return [...new Set([...(VERIFIED_FORMS[creature]||[]).map(file=>`${IMAGE_BASE}${encodeURIComponent(file)}`),...names.flatMap(name=>[
  `${IMAGE_BASE}${encodeURIComponent(name)}_ASA.png`,
  `${IMAGE_BASE}${encodeURIComponent(name)}.png`
 ])])];
}
