import {asaBaseCreatures} from './asa-official-catalog.js';
import {breedingVariants} from './breeding-variants.js';
import {tameCreatures} from './data.js';
import asaMethods from './asa-taming-methods.json' with {type:'json'};
import {getTamingMethod,tamingCategory} from './special-taming-methods.js';

// The live wiki catalog is discovery-only. It must not add modded, unreleased,
// boss or untameable creatures to the user's Taming Lab dropdowns.
// "Vanilla" includes official ASA base creatures, official DLCs and variants.
const officialBaseNames=new Set([...asaBaseCreatures,'Ferox']);
const unavailableStatuses=new Set(['unavailable','unreleased','untameable']);
export const vanillaTameRoster=Object.freeze(tameCreatures.filter(name=>{
 const base=breedingVariants[name]||name;
 if(!officialBaseNames.has(base))return false;
 const category=tamingCategory(name);
 if(category==='untameable')return false;
 if(!['knockout','passive','specialty'].includes(category))return false;
 return !(category==='specialty'&&unavailableStatuses.has(getTamingMethod(name)?.status));
}));
export const vanillaTamesByMethod=Object.freeze({
 knockout:Object.freeze(vanillaTameRoster.filter(name=>tamingCategory(name)==='knockout')),
 passive:Object.freeze(vanillaTameRoster.filter(name=>tamingCategory(name)==='passive')),
 specialty:Object.freeze(vanillaTameRoster.filter(name=>tamingCategory(name)==='specialty'))
});

// Taming Lab must show EVERY official knockout-method entry, including heavy
// / special knockouts (e.g. Karkinos or post-v97 Giganotosaurus).
// Displaying a species here does not authorize ordinary tranquilizer math;
// the individual calculator still delegates non-standard encounters.
export const vanillaKnockoutRoster=Object.freeze(tameCreatures.filter(name=>{
 const base=breedingVariants[name]||name;
 if(!officialBaseNames.has(base))return false;
 const methods=asaMethods[name]?.methods||asaMethods[base]?.methods||[];
 if(!methods.includes('knockout')||methods.includes('untameable'))return false;
 return !unavailableStatuses.has(getTamingMethod(name)?.status);
}));

// Artwork review routes may preselect a creature, but must never reduce the
// ordinary knockout dropdown to just that creature. The extra review target
// is only exposed on its explicit artPreview URL (e.g. untameable Ammonite).
export function knockoutPickerCreatures(reviewCreature=null){
 if(!reviewCreature||vanillaKnockoutRoster.includes(reviewCreature))return vanillaKnockoutRoster;
 return Object.freeze([...vanillaKnockoutRoster,reviewCreature].sort());
}
