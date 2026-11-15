// Original, locally generated technical field-sketch detail layers.
// These supplement species-family silhouettes. They are stylistic studies,
// not hand-traced ARK models or claims of 278 bespoke drawings.
import {creatureArtProfile} from './creature-art-profile.js';
import {knockoutDetailSketch} from './knockout-sketch-details.js';

// Every anatomy family has its own surface morphology and landmarks.
const familyDetails={
 theropod:['jaw','teeth','vertebrae','scales','toes'],
 swift:['jaw','featherBarbs','toes','sinew','tailBands'],
 horned:['frill','horn','armorSegments','toes','bellyRibs'],
 sauropod:['neckFolds','bellyRibs','skinPlates','toes','tailBands'],
 armored:['armorSegments','scutes','tailBands','toes','skinPlates'],
 hadrosaur:['neckFolds','sinew','bellyRibs','toes','skinPlates'],
 pterosaur:['wingRays','beak','toes','neckFolds','membrane'],
 bird:['featherBarbs','wingRays','beak','toes','tailBands'],
 dragon:['wingRays','horn','vertebrae','scales','tailBands'],
 canine:['furTufts','fangs','paw','ears','sinew'],
 ursine:['furTufts','paw','bellyRibs','neckFolds','sinew'],
 ungulate:['horn','hooves','neckFolds','sinew','bellyRibs'],
 rodent:['whiskers','ears','paw','tailBands','furTufts'],
 crocodile:['longJaw','scutes','teeth','toes','tailBands'],
 turtle:['shellHexes','scutes','flippers','toes','bellyRibs'],
 shark:['gills','finRays','teeth','tailBands','scales'],
 whale:['blowhole','finRays','bellyRibs','tailBands','gills'],
 cephalopod:['suckers','tendrils','skinPlates','spots','gills'],
 serpent:['scales','bellyRibs','tailBands','fangs','spines'],
 crab:['clawJoints','exoskeleton','legJoints','eyeStalks','scutes'],
 insect:['legJoints','wingRays','exoskeleton','antennae','segments'],
 amphibian:['skinPlates','webbedFeet','folds','spots','gills'],
 snail:['shellSpiral','feelers','folds','spots','bellyRibs'],
 bat:['wingRays','membrane','fangs','ears','tailBands'],
 humanoid:['joints','armorSegments','ribCage','sinew','toes'],
 aquatic:['gills','finRays','scales','tailBands','sinew'],
 alien:['spines','armorSegments','segments','eyeStalks','skinPlates']
};
// Key named creatures have recognizable species landmarks beyond their body plan.
const specialDetails={
 'Giganotosaurus':['jaw','teeth','vertebrae','sinew','scutes'],
 'Carcharodontosaurus':['teeth','longJaw','vertebrae','scutes','toes'],
 'Spinosaurus':['sailRibs','longJaw','toes','gills','scales'],
 'Yutyrannus':['furTufts','featherBarbs','teeth','vertebrae'],
 'Therizinosaurus':['scytheClaws','featherBarbs','neckFolds','toes'],
 'Ankylosaurus':['armorSegments','tailClub','scutes','toes'],
 'Stegosaurus':['backPlates','tailSpikes','scutes','toes'],
 'Doedicurus':['shellHexes','tailClub','scutes','toes'],
 'Triceratops':['frill','horn','scutes','toes'],
 'Brontosaurus':['neckFolds','bellyRibs','tailBands','toes'],
 'Argentavis':['featherBarbs','wingRays','beak','toes'],
 'Pteranodon':['wingRays','membrane','beak','crest'],
 'Quetzal':['wingRays','membrane','beak','crest'],
 'Griffin':['wingRays','featherBarbs','clawJoints','beak'],
 'Mammoth':['tusks','furTufts','neckFolds','trunk'],
 'Parasaur':['crest','neckFolds','bellyRibs','toes'],
 'Dunkleosteus':['armorSegments','gills','finRays','teeth'],
 'Megalodon':['gills','finRays','teeth','scales'],
 'Tusoteuthis':['suckers','tendrils','eyeStalks','gills'],
 'Karkinos':['clawJoints','exoskeleton','eyeStalks','legJoints'],
 'Bloodstalker':['legJoints','tendrils','exoskeleton','eyeStalks'],
 'Rock Drake':['featherBarbs','wingRays','clawJoints','scales'],
 'Wyvern':['membrane','wingRays','horn','teeth'],
 'Reaper':['scutes','spines','armorSegments','clawJoints'],
 'Magmasaur':['scutes','backPlates','armorSegments','spines'],
 'Basilisk':['fangs','spines','scales','bellyRibs'],
 'Rock Elemental':['armorSegments','cracks','joints','scutes'],
 'Phoenix':['featherBarbs','wingRays','beak','tailBands'],
 'Desmodus':['membrane','wingRays','ears','fangs'],
 'Snow Owl':['featherBarbs','wingRays','beak','toes'],
 'Gigantoraptor':['featherBarbs','wingRays','crest','scytheClaws'],
 'Ovis':['furTufts','horn','hooves','bellyRibs'],
 'Equus':['mane','hooves','tailBands','neckFolds'],
 'Unicorn':['horn','mane','hooves','tailBands'],
 'Otter':['whiskers','furTufts','paw','tailBands'],
 'Thylacoleo':['fangs','furTufts','paw','sinew'],
 'Sabertooth':['fangs','furTufts','paw','ears'],
 'Mantis':['clawJoints','exoskeleton','legJoints','segments'],
 'Rhyniognatha':['wingRays','legJoints','antennae','exoskeleton'],
 'Revenant':['armorSegments','joints','cracks','spines'],
 'Titanosaur':['neckFolds','bellyRibs','skinPlates','tailBands']
};
const d={
 jaw:'M641 196 Q695 204 743 201 M658 214 Q698 230 744 213',
 longJaw:'M598 200 Q686 175 769 193 M617 224 Q703 239 771 216',
 teeth:'M654 210 l8 16 9 -14 9 17 9 -17 9 15 10 -17 9 13 10 -11',
 fangs:'M667 217 l12 42 13 -34 M706 220 l7 39 13 -28',
 horn:'M615 177 L619 107 643 172 M663 171 L681 110 703 191',
 crest:'M547 159 L563 88 592 150 M568 106 Q594 98 613 85',
 beak:'M657 192 Q693 180 741 195 L704 215',
 ears:'M583 169 L575 104 603 137 M624 171 L645 105 658 167',
 mane:'M528 155 l-23 24 24 -4 -17 28 25 -14 -7 25 30 -21',
 trunk:'M694 208 Q758 250 722 302 Q696 331 660 302',
 tusks:'M663 214 q-13 56 17 53 M695 218 q-4 52 26 35',
 scytheClaws:'M488 271 L563 350 609 285 M501 260 L590 313 627 255',
 tailClub:'M124 282 Q62 243 44 273 Q60 319 125 311',
 tailSpikes:'M143 282 L85 250 113 285 69 297 127 300',
 backPlates:'M203 221 l21 -62 24 51 28 -78 31 76 32 -86 30 79 29 -67 23 78',
 sailRibs:'M284 217 L305 142 331 75 355 207 M348 203 L381 63 402 201 M409 202 L440 115 465 208',
 frill:'M574 197 Q572 135 634 119 Q704 126 706 197 M597 168 L628 97 663 162',
 gills:'M555 236 q-14 27 -3 45 M576 235 q-14 27 -2 44 M597 237 q-12 26 -2 42',
 blowhole:'M477 202 q12 -15 27 0 M490 198 l2 -23',
 tailBands:'M164 269 q12 17 7 36 M193 254 q13 24 8 43 M223 235 q15 24 10 49',
 scales:'M281 243 q11 -16 25 -2 m25 0 q10 -14 23 -3 m27 -10 q13 -18 24 0 m26 -5 q10 -14 25 -2',
 skinPlates:'M262 255 l18 -18 22 17 24 -17 20 19 28 -17 19 20 31 -11',
 spots:'M310 239 q8 -10 16 0 q-8 11 -16 0 M385 247 q9 -13 18 0 q-9 13 -18 0 M455 249 q8 -10 16 0 q-8 10 -16 0',
 scutes:'M257 214 l15 -24 21 18 17 -27 22 22 21 -29 22 26 23 -24 19 28',
 spines:'M280 199 l22 -35 20 29 19 -45 23 45 22 -40 24 50 21 -29',
 armorSegments:'M238 222 L276 191 314 227 353 190 390 225 432 197 460 236 M292 245 L312 276 347 254 374 282 412 258',
 shellHexes:'M249 233 L300 204 351 229 365 267 323 300 272 275Z M354 229 L396 198 444 230 446 273 404 300 365 267Z',
 shellSpiral:'M308 245 q49 -63 99 -9 q32 36 -8 65 q-29 20 -48 -9 q-15 -26 12 -41 q14 -7 27 10',
 feelers:'M651 208 Q661 142 691 106 M674 218 Q696 165 735 142',
 furTufts:'M252 215 l16 -27 13 22 17 -19 18 26 16 -23 21 25 20 -16 20 22 M419 219 l19 22 23 -16',
 featherBarbs:'M245 215 l26 -39 12 34 29 -48 11 48 25 -42 17 47 29 -39 M373 239 L343 197 M399 239 L380 193',
 wingRays:'M203 292 L341 169 399 237 M230 304 L353 191 M277 297 L369 215',
 membrane:'M172 310 Q283 229 348 162 L413 230 M244 288 L342 195',
 finRays:'M390 218 L425 132 444 221 M412 316 L454 369 463 306',
 flippers:'M395 299 Q358 371 307 392 M527 296 Q563 344 620 370',
 webbedFeet:'M326 380 l-31 37 46 -15 22 19 M512 382 l-25 33 40 -15 31 17',
 bellyRibs:'M298 269 Q378 299 455 282 M321 282 Q380 309 458 293',
 neckFolds:'M534 184 Q546 205 526 221 M561 164 Q576 192 551 207 M576 147 Q591 170 574 189',
 vertebrae:'M260 203 l21 -18 18 22 20 -17 18 20 20 -15 18 19 22 -15 20 19',
 sinew:'M321 247 Q364 270 415 253 M338 284 Q377 269 420 284 M463 286 Q485 316 477 348',
 toes:'M326 388 l-12 18 25 6 10 -9 12 10 16 -7 M490 388 l-9 20 29 4 11 -13 10 15',
 paw:'M331 382 l-21 20 19 14 16 -10 10 14 18 -12 M499 382 l-17 21 19 15 15 -12 14 10',
 hooves:'M328 382 l-9 26 23 6 18 -4 M494 392 l10 23 27 -4',
 whiskers:'M670 215 L731 201 M674 228 L735 232',
 antennae:'M612 183 Q585 113 562 90 M638 175 Q649 115 683 91',
 segments:'M268 229 l18 57 M308 207 l19 80 M352 202 l14 91 M400 209 l11 82',
 legJoints:'M302 280 L252 334 224 378 M368 292 L347 360 314 398 M487 298 L511 359 547 393',
 clawJoints:'M286 224 L198 174 147 126 170 108 209 154 M548 242 L642 194 693 144 711 165',
 eyeStalks:'M595 216 Q604 150 649 131 M625 220 Q642 159 685 144',
 exoskeleton:'M305 228 Q371 210 453 235 M329 272 Q399 284 477 275',
 suckers:'M367 303 q10 -13 20 0 q-10 14 -20 0 M404 336 q10 -13 20 0 q-10 13 -20 0 M446 349 q10 -12 20 0 q-10 13 -20 0',
 tendrils:'M364 265 Q300 335 252 348 M398 281 Q390 374 352 413 M451 282 Q499 383 526 410',
 folds:'M311 250 Q365 278 413 252 M329 266 Q381 290 448 271',
 joints:'M362 176 Q416 192 483 173 M389 291 Q411 316 435 305',
 ribCage:'M376 195 Q418 226 469 198 M375 224 Q422 248 481 227',
 cracks:'M306 215 l28 23 -17 16 31 21 M461 205 l-13 23 22 20 -12 22'
};
const hashName=name=>{let h=2166136261;for(const c of name){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0;};
export function creatureDetailStudy(name){
 const spec=creatureArtProfile(name),base=spec.base,seed=hashName(name);
 const anatomical=knockoutDetailSketch(name);
 const traits=specialDetails[base]||familyDetails[spec.group]||familyDetails.alien;
 const features=traits.map((key,i)=>d[key]||'').filter(Boolean);
 const smallMarks=Array.from({length:16},(_,i)=>{
  const x=282+((seed+37*i)%192);
  const y=228+(((seed>>>(i%7))+i*13)%58);
  const rise=5+(seed+i*3)%13,span=9+((seed>>>(i%11))%10);
  return `M${x} ${y} q${span} -${rise} ${span+7} 3`;
 });
 return [...anatomical,...features,...smallMarks];
}
export const technicalArtFamilies=Object.freeze(Object.keys(familyDetails));
