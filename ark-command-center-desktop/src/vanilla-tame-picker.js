import {asaBaseCreatures} from './asa-official-catalog.js';
import {breedingVariants} from './breeding-variants.js';
import {tameCreatures} from './data.js';
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
