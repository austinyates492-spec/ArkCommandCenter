import React from 'react';

/**
 * Original ARK Tribe HQ cartographic illustration, NOT a wiki image trace.
 * Decorative geographic concept only. Coastline, terrain and biomes are approximate;
 * do not interpret this art as calibrated GPS geography.
 * The parent viewport owns pin coordinates and zoom.
 */
const outline='M 169 212 C 215 146 298 119 362 146 L 404 115 460 130 500 111 C 579 126 647 90 704 146 L 746 154 801 217 822 281 874 324 869 384 893 428 872 477 889 530 861 575 840 638 810 667 802 742 750 768 715 805 655 789 616 837 562 815 516 846 470 821 416 844 371 806 313 820 277 770 222 761 201 705 161 677 144 623 112 578 136 535 113 480 127 434 107 390 126 340 117 282 Z';
const contourLines=[
 'M175 275 C290 185 372 200 445 175 S630 160 748 250 S850 416 809 540 S742 743 608 771 S350 752 253 665 S151 430 175 275',
 'M220 287 C300 222 382 228 467 215 S630 217 709 284 S803 430 773 533 S694 702 591 723 S394 714 300 633 S196 409 220 287',
 'M261 306 C342 247 435 265 507 255 S650 290 707 358 S752 462 725 547 S642 653 568 667 S414 656 346 580 S238 415 261 306',
 'M306 326 C374 278 461 295 518 305 S642 346 671 399 S702 486 676 544 S604 605 540 606 S420 580 378 531 S292 405 306 326',
 'M342 353 C400 320 470 327 526 359 S612 388 624 449 S613 518 570 550 S459 542 423 507 S339 424 342 353',
 'M394 371 C437 344 488 371 527 399 S580 449 561 485 S483 507 452 482 S403 417 394 371'
];
export default function IslandContourTerrain(){
 return <g aria-label="Original stylized Island terrain artwork; approximate geography" role="group" pointerEvents="none">
  <defs>
   <linearGradient id="hq-island-water" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#10283b"/><stop offset=".55" stopColor="#071c2c"/><stop offset="1" stopColor="#0c1a31"/></linearGradient>
   <linearGradient id="hq-island-land" x1="0" y1="0" x2=".85" y2="1"><stop stopColor="#294d57"/><stop offset=".4" stopColor="#254c43"/><stop offset=".73" stopColor="#315544"/><stop offset="1" stopColor="#193f39"/></linearGradient>
   <linearGradient id="hq-island-ice" x1="0" y1="0" x2=".4" y2="1"><stop stopColor="#d9e9e8"/><stop offset=".65" stopColor="#8fb9bd"/><stop offset="1" stopColor="#497888"/></linearGradient>
   <pattern id="hq-island-wave" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M0 36 Q21 29 42 36" stroke="#2b5367" strokeWidth="1" fill="none" opacity=".25"/></pattern>
   <clipPath id="hq-island-clip"><path d={outline}/></clipPath>
   <filter id="hq-island-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#000" floodOpacity=".7"/></filter>
  </defs>
  <rect width="1000" height="1000" fill="url(#hq-island-water)"/>
  <rect width="1000" height="1000" fill="url(#hq-island-wave)"/>
  <g filter="url(#hq-island-shadow)"><path d={outline} fill="url(#hq-island-land)" stroke="#87b6a3" strokeWidth="7"/></g>
  <g clipPath="url(#hq-island-clip)">
   <path d="M90 0 H910 V304 Q836 285 766 253 Q680 300 600 270 Q514 313 437 260 Q320 274 230 322 L90 285Z" fill="url(#hq-island-ice)" opacity=".94"/>
   <path d="M400 290 Q475 220 554 282 Q603 330 579 403 Q538 445 478 416 Q427 386 400 290Z" fill="#61716f" opacity=".8"/>
   <path d="M390 470 Q441 425 518 457 Q588 487 570 558 Q538 637 455 635 Q401 596 390 470Z" fill="#173d35" opacity=".8"/>
   <path d="M131 625 Q310 589 427 704 T813 676 L917 890 H90Z" fill="#60704d" opacity=".45"/>
   <path d="M585 363 Q620 390 608 429 T669 500 Q687 538 731 558" fill="none" stroke="#75bec1" strokeWidth="18" opacity=".55" strokeLinecap="round"/>
   <path d="M312 274 Q336 345 324 416 T369 544 Q370 603 428 667" fill="none" stroke="#77c4bd" strokeWidth="13" opacity=".6" strokeLinecap="round"/>
   {contourLines.map((d,i)=><path key={i} d={d} fill="none" stroke={i%2?'#c5d1ab':'#a5d2b0'} opacity={.18+i*.035} strokeWidth="3"/>)}
   <path d="M462 352 L503 279 548 344 562 389 521 419 476 400Z" fill="#5f6b65" stroke="#b7b5a2" strokeWidth="6"/>
   <path d="M489 355 L503 314 522 357 511 386Z" fill="#a4aaa5" opacity=".8"/>
   <g fill="#d1e3d5" fontSize="22" fontWeight="700" opacity=".85" letterSpacing="3"><text x="271" y="222">SNOW</text><text x="433" y="568">REDWOODS</text><text x="248" y="681">SOUTHERN COAST</text></g>
  </g>
  <g fill="#416253" stroke="#7fae99" strokeWidth="4">
   <path d="M320 872 Q351 847 374 869 L386 895 352 919 316 901Z"/>
   <path d="M590 893 Q618 868 642 891 L655 919 613 933 588 913Z"/>
   <path d="M754 815 Q774 802 787 825 L779 853 751 845Z"/>
   <path d="M880 692 Q904 683 914 708 L896 725 879 715Z"/>
  </g>
  <g fontSize="23" fill="#b4dae4" letterSpacing="4" opacity=".5"><text x="378" y="950">THE ISLAND</text></g>
 </g>;
}
