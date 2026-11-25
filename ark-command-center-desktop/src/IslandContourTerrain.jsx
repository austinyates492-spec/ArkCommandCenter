import React from 'react';

/**
 * Original, independently drawn contour interpretation of ARK: ASA The Island.
 * Geographic reference: ARK Official Community Wiki, The Island ASA terrain.
 * Approximate visual correspondence only; not a copy of the source pixels,
 * not a calibrated navigation or published-resource layer.
 * Co-ordinate viewport: 1000x1000, lon increases right, lat increases down.
 */
const mainCoast='M 80 110 Q108 77 150 101 L188 75 Q242 83 271 74 Q326 92 371 77 Q400 102 440 104 L480 142 Q527 159 555 125 L601 102 Q630 77 659 101 L694 136 Q725 160 751 144 Q776 113 789 102 Q825 106 836 151 L848 197 Q825 235 848 268 L875 305 Q884 359 866 406 Q883 448 866 487 L882 542 Q878 598 858 629 L872 690 Q859 757 826 789 Q796 817 759 799 L741 756 Q696 783 677 815 L647 857 Q603 886 573 853 L543 804 Q520 765 485 783 L464 852 Q437 907 392 881 L367 838 Q330 811 296 842 L271 890 Q240 911 218 889 L191 842 Q161 828 145 792 L123 741 Q112 687 122 636 Q109 588 124 543 L111 500 Q127 442 105 407 L119 361 Q103 314 132 274 L119 224 Q88 207 80 175 Z';
const southWest='M 130 742 Q176 707 222 737 Q257 757 259 813 L232 878 Q215 909 172 900 Q128 877 105 834 Q101 783 130 742 Z';
const southMid='M 366 764 Q412 732 448 758 L484 803 Q477 864 443 903 Q406 920 373 882 L352 825 Z';
const southEast='M 610 743 Q651 730 686 757 L729 799 Q735 841 707 879 Q673 901 636 875 L598 829 Z';
const islets=['M 174 900 Q203 891 223 918 Q228 948 193 958 Q158 950 174 900Z','M 464 917 Q495 887 528 913 L542 943 Q513 968 486 957 Z','M 843 879 Q865 868 888 895 L880 927 Q854 928 843 879Z','M 856 104 Q883 83 907 112 Q929 145 899 170 L860 147 Z','M 75 291 Q93 273 105 288 L106 320 82 332Z'];
const heights=[
 {x:235,y:155,rx:95,ry:68,color:'#d0e0dc'},
 {x:470,y:335,rx:96,ry:82,color:'#596b70'},
 {x:624,y:302,rx:78,ry:75,color:'#5c777b'},
 {x:762,y:370,rx:86,ry:104,color:'#6b7563'},
 {x:492,y:588,rx:139,ry:116,color:'#6c5d4d'}
];
const majorContours=[
 'M 96 159 Q227 88 361 121 T597 184 Q730 172 823 284 T795 570 Q741 697 614 724 Q495 763 412 708 T210 617 Q116 467 134 315',
 'M 156 191 Q276 126 368 176 T555 235 Q696 215 779 311 Q834 427 772 538 Q701 626 609 655 Q502 686 421 627 Q343 574 242 569 Q167 466 173 350',
 'M 222 243 Q306 195 392 242 T560 273 Q686 270 729 370 Q773 444 718 518 Q644 580 547 600 Q443 605 379 531 Q292 515 256 420 Q224 336 222 243'
];
const mountainRings=[
 [249,154,82,54],[468,329,77,70],[625,307,57,58],[757,378,62,78],[486,584,107,82]
];
export default function IslandContourTerrain(){
 return <g role="group" aria-label="Original dark contour interpretation of The Island with approximate geography" pointerEvents="none">
  <defs>
   <linearGradient id="hq-island-ocean" x1="0" y1="0" x2=".6" y2="1"><stop stopColor="#11334c"/><stop offset=".5" stopColor="#0b2033"/><stop offset="1" stopColor="#061424"/></linearGradient>
   <linearGradient id="hq-island-ground" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#4b6960"/><stop offset=".45" stopColor="#245145"/><stop offset="1" stopColor="#304c39"/></linearGradient>
   <linearGradient id="hq-island-snow" x1="0" y1="0" x2=".15" y2="1"><stop stopColor="#d8ece9"/><stop offset="1" stopColor="#799aa0"/></linearGradient>
   <pattern id="hq-island-ocean-lines" width="37" height="37" patternUnits="userSpaceOnUse"><path d="M0 29 Q18 20 37 29" fill="none" stroke="#478098" strokeWidth="1" strokeOpacity=".18"/></pattern>
   <clipPath id="hq-island-mainclip"><path d={mainCoast}/></clipPath>
  </defs>
  <rect width="1000" height="1000" fill="url(#hq-island-ocean)"/>
  <rect width="1000" height="1000" fill="url(#hq-island-ocean-lines)"/>
  <g stroke="#9fbca4" strokeWidth="4" strokeLinejoin="round">
   <path d={mainCoast} fill="url(#hq-island-ground)"/>
   {[southWest,southMid,southEast].map((p,i)=><path key={i} d={p} fill="#395b48"/>)}
   {islets.map((p,i)=><path key={i} d={p} fill="#4b6856"/>)}
  </g>
  <g clipPath="url(#hq-island-mainclip)">
   <path d="M65 0 H706 V245 Q645 224 587 199 Q553 256 490 215 Q439 194 396 222 Q317 200 265 230 Q168 228 111 277 L65 250Z" fill="url(#hq-island-snow)" opacity=".93"/>
   <path d="M402 285 Q476 230 540 291 Q584 358 522 409 Q453 441 399 367 Z" fill="#617673" opacity=".88"/>
   <path d="M602 244 Q653 231 701 276 Q722 324 689 372 Q636 382 596 345 Z" fill="#58756b" opacity=".8"/>
   <path d="M713 306 Q781 275 835 320 L884 472 795 559 Q739 531 702 449 Z" fill="#536747" opacity=".55"/>
   <path d="M328 497 Q407 446 529 471 Q626 502 612 617 Q562 689 421 672 Q322 616 328 497 Z" fill="#715e48" opacity=".72"/>
   {heights.map((h,i)=><ellipse key={i} cx={h.x} cy={h.y} rx={h.rx} ry={h.ry} fill={h.color} opacity=".45"/>)}
   <path d="M362 230 Q350 304 327 378 Q329 433 306 467 Q287 500 305 560 Q321 594 292 658 L259 760" fill="none" stroke="#76b6bd" strokeWidth="22" strokeLinecap="round" opacity=".82"/>
   <path d="M551 378 Q598 406 609 465 Q645 507 698 539 Q730 588 714 663 L691 752" fill="none" stroke="#72b3b6" strokeWidth="24" strokeLinecap="round" opacity=".82"/>
   <path d="M173 556 Q286 526 338 538 Q398 540 457 513 Q543 499 617 542 Q698 579 834 550" fill="none" stroke="#6eaeb8" strokeWidth="27" strokeLinecap="round" opacity=".9"/>
   {majorContours.map((p,i)=><path key={i} d={p} fill="none" stroke="#cbd9ad" strokeWidth="2.5" strokeOpacity=".18"/>)}
   {mountainRings.map(([x,y,rx,ry],i)=><g key={i}>{[1,.75,.5,.28].map((v,k)=><ellipse key={k} cx={x} cy={y} rx={rx*v} ry={ry*v} fill="none" stroke="#d5dfc8" strokeWidth={k===0?2.5:3} strokeOpacity={.22+k*.11}/>)}</g>)}
   <path d="M450 325 L471 264 493 309 523 351 494 383Z" fill="#a1aaa2" opacity=".8"/>
   <g fill="#d1e2d8" fontSize="23" fontWeight="700" letterSpacing="2" opacity=".75">
    <text x="195" y="185">SNOWFIELD</text><text x="393" y="613">REDWOODS</text><text x="714" y="460">EAST</text>
   </g>
  </g>
  <g fill="none" stroke="#9ab6a3" strokeWidth="3" opacity=".45">
   <path d="M105 785 Q158 734 230 782"/><path d="M379 815 Q419 776 467 825"/><path d="M622 805 Q665 770 715 817"/>
  </g>
  <text x="400" y="978" fontSize="23" letterSpacing="5" fill="#9bbdc2" opacity=".6">THE ISLAND · CONTOUR STUDY</text>
 </g>;
}
