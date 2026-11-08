// Baseline profiles, not a live event-rate feed. Official events can override
// these values temporarily; the Custom profile is available for any cluster.
export const OFFICIAL_MODES_SOURCE='https://support.survivetheark.com/hc/en-us/articles/18374796351767-Different-types-of-game-modes';
export const CONQUEST_SOURCE='https://survivetheark.com/index.php?/forums/topic/774323-community-crunch-531-unreal-engine-58-enigmasaur-and-giga-tlc-out-now/';
const rates=(taming,hatch,mature,breeding,cuddle=1)=>({taming,hatch,mature,breeding,cuddle,food:1});
export const clusterPresets=[
 {id:'nomadark',label:'NOMADARK 10×',description:'User-supplied NomadARK rules; imprint and creature hunger are estimates.',rates:rates(10,25,8,0.2,0.1),harvest:10,xp:10,verified:true},
 {id:'official-pve',label:'OFFICIAL PvE',description:'Standard official baseline; temporary Evolution Events are not included.',rates:rates(1,1,1,1),harvest:1,xp:1,verified:true},
 {id:'official-pvp',label:'OFFICIAL PvP',description:'Standard official baseline; temporary Evolution Events are not included.',rates:rates(1,1,1,1),harvest:1,xp:1,verified:true},
 {id:'small-tribes',label:'OFFICIAL Small Tribes',description:'Six players, no alliances; 2.5× taming, 2× breeding, half mating interval.',rates:rates(2.5,2,2,0.5,0.5),harvest:2.5,xp:2.5,verified:true},
 {id:'arkpocalypse',label:'OFFICIAL ARKpocalypse',description:'Monthly-wipe mode. The 3× base settings are a provisional reference; Wildcard lists 5× rates during the current event. Confirm your live server.',rates:rates(3,3,3,0.34,0.5),harvest:3,xp:3,verified:false},
 {id:'conquest',label:'OFFICIAL Conquest',description:'Wildcard Community Crunch 531 (November 2026): 5× harvesting, XP, tame, imprint, hatch, growth, breeding and gestation; 0.5× mating interval. Events may increase individual rates.',rates:rates(5,5,5,0.5,0.2),harvest:5,xp:5,verified:true,source:CONQUEST_SOURCE},
 {id:'classic',label:'OFFICIAL Classic PvP',description:'Legacy rotating format; rates not confirmed for a current ASA instance. Adjust manually.',rates:rates(1,1,1,1),harvest:1,xp:1,verified:false},
 {id:'official-evo',label:'OFFICIAL Event (2×)',description:'Example event preset, not a current live event reading. Confirm the current event.',rates:rates(2,2,2,1),harvest:2,xp:2,verified:false},
 {id:'custom',label:'CUSTOM / Other Cluster',description:'Enter server-specific multipliers on the Settings page.',rates:null,verified:false}
];
export const presetById=id=>clusterPresets.find(p=>p.id===id)||clusterPresets[0];
export function ratesForPreset(id,current){return id==='custom'?{...current}:{...presetById(id).rates};}
