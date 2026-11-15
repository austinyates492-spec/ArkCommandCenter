import {breedingVariants} from './breeding-variants.js';

// Deliberately mapped body plans: a Rex is not used as a placeholder for a fish,
// bird, arthropod or boss. Forms inherit their parent's body plan, but get a
// form-specific anatomical trace. This is stylized concept linework, not a
// scientifically verified or extracted in-game mesh.
export const anatomyGroups={
 theropod: 'Acrocanthosaurus|Allosaurus|Baryonyx|Carcharodontosaurus|Carnotaurus|Ceratosaurus|Concavenator|Cryolophosaurus|Dilophosaur|Giganotosaurus|Megalosaurus|Megaraptor|Spinosaurus|Terror Bird|Therizinosaurus|Yutyrannus|Rex|Cerberax|Thanatos|Deinonychus|Raptor|Troodon|Murder Turkey|Cryolophosaurus|Velonasaur|Enigmasaur|Fasolasuchus|Gargantar',
 swift: 'Compy|Gallimimus|Microraptor|Oviraptor|Pegomastax|Archaeopteryx|Yi Ling|Gigantoraptor|Deinonychus|Raptor|Troodon|Deinotherium',
 horned: 'Triceratops|Pachyrhinosaurus|Pachy|Deinotherium|Woolly Rhino|Bison|Morellatops|Ceratosaurus|Boaratos|Minotaur',
 sauropod: 'Brontosaurus|Diplodocus|Dreadnoughtus|Titanosaur|Paraceratherium|Oasisaur|Dreadnoughtus|Gargantar',
 armored: 'Ankylosaurus|Doedicurus|Kentrosaurus|Stegosaurus|Carbonemys|Dunkleosteus',
 hadrosaur: 'Iguanodon|Parasaur|Lystrosaurus|Moschops|Pachy|Morellatops|Pachyrhinosaurus',
 pterosaur: 'Pteranodon|Quetzal|Tapejara|Sinomacrops|Dimorphodon',
 bird: 'Argentavis|Dodo|Featherlight|Hesperornis|Ichthyornis|Kairuku|Parrot|Pelagornis|Phoenix|Snow Owl|Vulture|Terror Bird|Murder Turkey|Microraptor|Archaeopteryx|Yi Ling|Lymantria|Griffin|Glowtail',
 dragon: 'Dragon|Wyvern|Dodo Wyvern|Drakeling|Rock Drake|Griffin|Manticore|Managarmr|Hydraskos|Aureliax|Umbra|Pyromane|Xeranox|Veilwyn|Reaper|Magmasaur',
 canine: 'Armadoggo|Direwolf|Hyaenodon|Ravager|Purlovia|Cerberax|Elderclaw|Grendel|Tidepup|Solwyn|Cat|Sabertooth|Thylacoleo|Pyromane',
 ursine: 'Direbear|Megatherium|Chalicotherium|Gigantopithecus|Megapithecus|Yeti|Nunatak|Gacha|Gasbags|Megatherium',
 ungulate: 'Equus|Unicorn|Ovis|Procoptodon|Megaloceros|Mammoth|Woolly Rhino|Deinotherium|Morellatops|Bison|Daeodon|Phiomia|Castoroides|Megaloceros|Boaratos',
 rodent: 'Jerboa|Bulbdog|Shinehorn|Glowtail|Roll Rat|Castoroides|Otter|Lystrosaurus|Cat|Armadoggo|Burrowbuck|Ossidon|Neophyte|Lumina|Maeguana',
 crocodile: 'Sarcosuchus|Kaprosuchus|Deinosuchus|Megalania|Thorny Dragon|Dimetrodon|Fasolasuchus|Megalania|Diplocaulus',
 turtle: 'Carbonemys|Archelon|Megachelon|Grand Tortugar',
 shark: 'Megalodon|Helicoprion|Dunkleosteus|Xiphactinus|Anglerfish|Piranha|Sabertooth Salmon|Coelacanth|Leedsichthys|Manta|Electrophorus',
 whale: 'Astrocetus|Basilosaurus|Ichthyosaurus|Liopleurodon|Mosasaurus|Plesiosaur|Shastasaurus|Leedsichthys|Xiphactinus|Grand Tortugar',
 cephalopod: 'Palaeoctopus|Tusoteuthis|Cnidaria|Gloon|Aureliax|Lumina',
 serpent: 'Basilisk|Titanoboa|Deathworm|Natrix|Lamprey|Leech|Nameless|Seeker|Eurypterid',
 crab: 'Karkinos|Pulmonoscorpius|Araneo|Bloodstalker|Eurypterid',
 insect: 'Arthropluera|Dung Beetle|Giant Bee|Jug Bug|Glowbug|Meganeura|Rhyniognatha|Titanomyrma|Mantis|Lymantria|Seeker|Reaper|Cosmo',
 amphibian: 'Beelzebufo|Diplocaulus|Bulbdog|Gasbags|Electrophorus|Oasisaur',
 snail: 'Achatina|Ammonite|Trilobite|Oasisaur',
 bat: 'Desmodus|Gigadesmodus|Onyc|Bloodstalker|Dreadmare|Griffin',
 humanoid: 'Defense Unit|Attack Drone|Enforcer|Scout|Overseer|Broodmother Lysrix|Desert Titan|Forest Titan|Ice Titan|King Titan|Megapithecus|Mesopithecus|Rock Elemental|Minotaur|Lost King|Lost Queen|Thrall|Revenant|Neophyte',
 aquatic: 'Manta|Leedsichthys|Anglerfish|Basilosaurus|Beelzebufo|Ichthyosaurus|Liopleurodon|Mosasaurus|Plesiosaur|Shastasaurus|Tusoteuthis|Archelon',
 alien: 'Astrocetus|Aureliax|Dreadmare|Enigmasaur|Gloon|Hydraskos|Lumina|Malwyn|Natrix|Neophyte|Nunatak|Ossidon|Revenant|Solwyn|Thanatos|Thodes|Umbra|Veilwyn|Xeranox|Gargantar'
};
const preferredOrder=['theropod','swift','horned','sauropod','armored','hadrosaur','pterosaur','bird','dragon','canine','ursine','ungulate','rodent','crocodile','turtle','shark','whale','cephalopod','serpent','crab','insect','amphibian','snail','bat','humanoid','aquatic','alien'];
// Explicit overrides preserve the individual physical identity when a creature
// appears in multiple groups because it shares traits with more than one.
const overrides={
 'Terror Bird':'bird','Murder Turkey':'bird','Cryolophosaurus':'theropod','Deinonychus':'swift','Raptor':'swift','Troodon':'swift',
 'Ceratosaurus':'theropod','Deinotherium':'ungulate','Woolly Rhino':'ungulate','Bison':'ungulate','Morellatops':'ungulate','Boaratos':'ungulate',
 'Pachy':'horned','Pachyrhinosaurus':'horned','Carbonemys':'turtle','Dunkleosteus':'shark','Archaeopteryx':'bird','Microraptor':'bird','Yi Ling':'bird',
 'Griffin':'dragon','Glowtail':'rodent','Managarmr':'dragon','Magmasaur':'dragon','Pyromane':'dragon','Reaper':'dragon','Cerberax':'canine','Cat':'canine','Sabertooth':'canine',
 'Gigantopithecus':'ursine','Megapithecus':'humanoid','Yeti':'humanoid','Gacha':'ursine','Gasbags':'amphibian',
 'Woolly Rhino':'ungulate','Megaloceros':'ungulate','Castoroides':'rodent','Otter':'rodent','Lystrosaurus':'rodent','Burrowbuck':'ungulate',
 'Megalania':'crocodile','Thorny Dragon':'crocodile','Dimetrodon':'crocodile','Fasolasuchus':'crocodile',
 'Grand Tortugar':'turtle','Leedsichthys':'whale','Xiphactinus':'shark','Manta':'shark','Electrophorus':'serpent',
 'Aureliax':'alien','Lumina':'alien','Gloon':'cephalopod','Eurypterid':'crab','Bloodstalker':'crab','Araneo':'crab','Pulmonoscorpius':'crab',
 'Mantis':'insect','Lymantria':'insect','Seeker':'bat','Ammonite':'snail','Trilobite':'snail','Oasisaur':'sauropod',
 'Desmodus':'bat','Gigadesmodus':'bat','Onyc':'bat','Dreadmare':'dragon','Astrocetus':'whale','Broodmother Lysrix':'crab',
 'Scorched Earth':'alien','Ravager':'canine','Purlovia':'canine','Phoenix':'bird','Shinehorn':'rodent','DodoRex':'theropod'
};
const groupByName=new Map();
for(const group of preferredOrder)for(const name of anatomyGroups[group].split('|'))if(!groupByName.has(name))groupByName.set(name,group);
export function creatureArtProfile(name){
 const original=String(name||'Unknown');
 const base=breedingVariants[original]||original.replace(/^(Tek |Aberrant |Corrupted |X-|R-|Malfunctioned |Alpha )/,'');
 const group=overrides[base]||groupByName.get(base)||'alien';
 let hash=2166136261;
 for(const char of original){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619)}
 const seed=hash>>>0;
 const variation=seed%7;
 const form=base===original?'':original.slice(0,Math.max(0,original.length-base.length)).trim()||'Variant';
 const speciality={
  Spinosaurus:'sail',Stegosaurus:'plates',Kentrosaurus:'plates',Ankylosaurus:'club',
  Carnotaurus:'horns',Ceratosaurus:'horn',Triceratops:'frill',
  Pachyrhinosaurus:'frill',Dilophosaur:'frill',Cryolophosaurus:'crest',
  Parasaur:'crest',Deinosuchus:'crocodile',Basilisk:'spines',
  Yutyrannus:'feathers',Therizinosaurus:'claws',Megatherium:'claws',
  Mammoth:'tusks','Woolly Rhino':'horn',Megaloceros:'antlers',
  Unicorn:'horn',Dunkleosteus:'armor',Anglerfish:'lure',
  Argentavis:'feathers',Pteranodon:'crest',Quetzal:'crest',
  'Rock Drake':'feathers',Wyvern:'horns',Griffin:'feathers',
  Karkinos:'claws',Rhyniognatha:'wings',Bloodstalker:'legs',
  Mantis:'claws',Carbonemys:'shell',Archelon:'shell',Megachelon:'shell',
  Doedicurus:'club',Oviraptor:'crest',Rex:'rex'
 }[base]||'';
 return {original,base,group,seed,variation,form,speciality,
  traceA:8+seed%13,traceB:21+(seed>>>4)%12,traceC:36+(seed>>>9)%12};
}
export const knownAnatomyNames=new Set([...groupByName.keys(),...Object.keys(overrides)]);
