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

export function imageSpeciesNames(creature){
 if(typeof creature!=='string'||creature.length>100||!/^[\w\s:'’\-().,]+$/u.test(creature))return [];
 const parent=breedingVariants[creature]||creature.replace(/^(?:Aberrant |Tek |X-|R-)/,'');
 return [...new Set([creature,parent,ALIASES[parent]].filter(Boolean))];
}

export function portraitCandidates(creature){
 return imageSpeciesNames(creature).flatMap(name=>[
  `${IMAGE_BASE}${encodeURIComponent(name)}_ASA.png`,
  `${IMAGE_BASE}${encodeURIComponent(name)}.png`
 ]);
}
