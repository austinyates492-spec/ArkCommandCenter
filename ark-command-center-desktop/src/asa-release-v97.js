// Studio Wildcard's November 6, 2026 ASA v97 release notes are authoritative
// for release status and availability; the wiki's older tame data may lag.
export const ASA_V97_SOURCE='https://survivetheark.com/index.php?/forums/topic/773786-asa-server-patch-notes-server-v97-updated-11062026/';
export const ASA_V97_RELEASE_DATE='2026-11-06';
export const ASA_V97_NEW_CREATURES=Object.freeze(['Enigmasaur']);
export const ASA_V97_REWORKED_TAMES=Object.freeze(['Giganotosaurus']);
export const ASA_V97_ENIGMASAUR_MAPS=Object.freeze([
 'The Center','Scorched Earth','Aberration','Ragnarok',
 'Extinction','Valguero','Lost Colony','Astraeos'
]);

// The v97 Giga Apex Challenge replaces its former projectile knockout.
// This also applies to variants using the same Giganotosaurus taming method.
export const ASA_V97_NONSTANDARD_KNOCKOUTS=new Set(ASA_V97_REWORKED_TAMES);

export function officialReleaseMapAvailability(creature,map){
 if(creature!=='Enigmasaur')return null;
 return {
  available:ASA_V97_ENIGMASAUR_MAPS.includes(map),
  maps:ASA_V97_ENIGMASAUR_MAPS,
  source:ASA_V97_SOURCE
 };
}
