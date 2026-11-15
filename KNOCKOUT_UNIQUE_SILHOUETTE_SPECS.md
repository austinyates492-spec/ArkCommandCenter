# Knockout Creature Art — Unique-Silhouette Build Specifications

**Status:** Build-ready requirements, **not a claim that illustrations have been redrawn or deployed.**  
**Source:** `CREATURE_DOSSIER_ROLLOUT.md`, the actual 84-name historical Phase 1 list; runtime `knockoutRoster` must be used before treating any entry as a standard knockout tame.  
**Current artwork:** Rex + the first nine have user-liked traced art. Seven more historically listed knockout species have newly integrated custom vector silhouettes in v0.8.28, **pending visual approval**. Another 67 listed creatures still need dedicated drawings. All 74 remaining entries are pending sign-off.  
**Responsibility:** The searchable **Taming Lab stays the only knockout UI**. No new Creature Dossiers page; preserve food, torpor, weapon quality, ammo and timer calculations.

## Deliverable acceptance rules

1. **Unique outer shape.** Every creature receives a genuinely distinct silhouette path, not the same body-family contour with a different title or randomly seeded creases. Its black-filled outline remains recognizable with every interior line hidden.
2. **Anatomy fidelity.** The outer contour must incorporate the species-defining head profile, limb number/length, body mass, tail structure, wings/fins and distinctive anatomy. Explicit `OUTER` and `LINES` requirements below are mandatory.
3. **Linework system.** Side/three-quarter view on a consistent `1000×560` viewBox, full creature visible, comfortable perimeter margin. Major contour 4–6 units, structural contour 2–3 units, identifying details 1–2 units. Avoid dense hatching; prioritize 1 dominant line layer and two restrained detail layers.
4. **Theme integration.** Artwork is vector-based, follows the signed-in user's accent color and has legible contrast in all supported themes. No off-site image dependency.
5. **Desktop and mobile QA.** Check recognizable shape at 320px phone width and 1200px desktop width; inspect the actual rendered Taming Lab, not only the source SVG.
6. **No mathematical changes.** Art cannot alter `calculateTame`, `knockoutEstimate` or live timer persistence. Missing taming profiles stay unknown; do not fabricate values.
7. **Unambiguous status.** A checked box means a unique source illustration is integrated **and visually approved**; all otherwise-pending rows remain unchecked. Existing first ten are listed separately as **reference art**, not new work.
8. **Variants.** Tek, Aberrant and X-/R-forms inherit the approved base anatomy *only after* base review; add any real geometry changes distinctly. Recoloring or identical base art alone does not count as a new variant illustration.

**Release synchronization:** v0.8.28 separately published vector traces for Spinosaurus, Yutyrannus, Megalosaurus, Therizinosaurus, Acrocanthosaurus, Cryolophosaurus and Megaraptor. Giganotosaurus and Carcharodontosaurus also received newly illustrated art in the *specialty* category. Thylacoleo has not received an accepted custom silhouette. This document is the **QA acceptance specification**, so those seven newly drawn Phase 1 entries are still unchecked until inspected.

## Known source-category discrepancies

This historical knockout artwork inventory contains some species handled as **specialty taming** in the current app. **Fasolasuchus** requires an explosive encounter, while the official community wiki describes **Shastasaurus** as a special passive tame. Their silhouette specs stay here for illustration planning, but they **must not** be shown standard tranquilizer calculations unless the live source data supports it. In addition, Giganotosaurus appears in the 90-name external knockout-method source but is classified as specialty in the app; reconcile that separately instead of silently changing calculator behavior. Source references: https://ark.wiki.gg/wiki/Shastasaurus and https://ark.wiki.gg/wiki/Fasolasuchus .

## Creature-by-creature requirements

### 1A — approved reference designs (preserve existing artwork) (10)

- [x] **Rex** — **OUTER:** Huge rectangular skull and heavy lower jaw, barrel torso, very short arms, thick counterbalancing tail and pillar-like hind legs. **LINES:** Deep skull cavity, triangular teeth, powerful hip and calf contours, three large weight-bearing toes. **NOT A CLONE:** Do not reshape into a long-snouted Spino or lithe Allosaurus. *Reference artwork already integrated; visual inspection remains recommended.*

- [x] **Raptor** — **OUTER:** Compact slender torso, swept-back feathered head/neck, raised sickle claw on each hind foot and long straight balancing tail. **LINES:** Short feather layering, flexible wrist/hand fingers, bent-running hock, sickle-claw sheath. **NOT A CLONE:** Must not become a miniature Rex or plain Compy. *Reference artwork already integrated; visual inspection remains recommended.*

- [x] **Carnotaurus** — **OUTER:** Short blunt snout, two pronounced brow horns, surprisingly small forearms, robust hips and straight tapered tail. **LINES:** Heavy neck folds, sharply defined cheek and jaw line, pebbled osteoderms. **NOT A CLONE:** Not a hornless Allosaurus or three-horned Trike. *Reference artwork already integrated; visual inspection remains recommended.*

- [x] **Allosaurus** — **OUTER:** Long low skull with brow crests and powerful jaws, deeper chest, three-fingered arms, slim tail taper. **LINES:** Brow ridge, hand claws, neck folds, hip and thigh tendons. **NOT A CLONE:** Brow crest is not Carnotaurus paired horns; no high Spino sail. *Reference artwork already integrated; visual inspection remains recommended.*

- [x] **Baryonyx** — **OUTER:** Elongated narrow crocodilian jaws, low sloped head, heavier forearms with enormous first-finger hook claw, long tail. **LINES:** Conical tooth row, jaw separation, powerful wrist and hand structure, shallow back ridge. **NOT A CLONE:** Not a small Spinosaurus with a sail. *Reference artwork already integrated; visual inspection remains recommended.*

- [x] **Sabertooth** — **OUTER:** Long low feline spine, thick shoulders, short muzzle with two enormous exposed downward canines, muscular haunches. **LINES:** Cat shoulder blade, whisker pads, large paws and claws, ear profile. **NOT A CLONE:** No wolf's narrow muzzle, flowing bushy tail or generalized dog silhouette. *Reference artwork already integrated; visual inspection remains recommended.*

- [x] **Direwolf** — **OUTER:** Broad lupine head with tall triangular ears and pointed snout, long-legged quadruped with bushy tail. **LINES:** Layered fur ruff, shoulder and haunch tufts, paw/toe separations, muzzle line. **NOT A CLONE:** Not a big cat with saber teeth or a bear. *Reference artwork already integrated; visual inspection remains recommended.*

- [x] **Terror Bird** — **OUTER:** Upright deep-chested flightless bird with enormous hooked beak, short vestigial wings and powerful ostrich-like legs. **LINES:** Overlapping breast/neck feathers, beak ridge, large three-toed feet and talons. **NOT A CLONE:** Not a theropod with reptilian jaws or long forelimbs. *Reference artwork already integrated; visual inspection remains recommended.*

- [x] **Dilophosaur** — **OUTER:** Small-bodied biped with two crown crests, light chest, slender snout and long delicate tail. **LINES:** Separate twin head crests, distinctive frill if depicting the ARK model, small clawed hands. **NOT A CLONE:** Must not resemble uncrested Compy. *Reference artwork already integrated; visual inspection remains recommended.*

- [x] **Compy** — **OUTER:** Tiny narrow-chested biped, delicate neck and thin pointed skull, wiry hind legs and extremely slim tapering tail. **LINES:** Fine ribs, toe tips, small jaw, lightweight hands. **NOT A CLONE:** Keep the frail proportions; never a scaled-down bulky Raptor. *Reference artwork already integrated; visual inspection remains recommended.*

### 1B — large predators (8)

- [ ] **Spinosaurus** — **OUTER:** Long crocodilian head held low, strongly tapering lower jaw, prominent tall dorsal sail beginning behind neck and ending over hip, long muscular tail. **LINES:** Sail rib struts following curved top, tooth spacing, strong forearm claws and tail muscle bands. **NOT A CLONE:** Must not look like Rex with triangular spikes glued along back. *Separate vector artwork integrated in v0.8.28; **anatomical and mobile visual sign-off still pending**.*

- [ ] **Yutyrannus** — **OUTER:** High deep feathered neck and shoulder ruff framing long tyrannosaur skull, sizeable three-clawed arms and heavy hind limbs. **LINES:** Distinct individual feather rows on mantle and forearms, sharp teeth, mane boundary and large toes. **NOT A CLONE:** Unlike the smooth Rex, the feather mass changes the outer neck and back silhouette. *Separate vector artwork integrated in v0.8.28; **anatomical and mobile visual sign-off still pending**.*

- [ ] **Megalosaurus** — **OUTER:** Long lower skull and heavy brow, rounded back/shoulder, robust arms, tucked stalking posture and broad upper tail. **LINES:** Subtle scale/skin folds, three-fingered hands, jaw teeth and neck-to-shoulder pivot. **NOT A CLONE:** Must not share Rex skull width or Allosaurus brow/leg ratio. *Separate vector artwork integrated in v0.8.28; **anatomical and mobile visual sign-off still pending**.*

- [ ] **Therizinosaurus** — **OUTER:** Small beaked head atop a very tall S-shaped neck, deep shaggy potbelly and extremely long extended forearms terminating in three scythe claws. **LINES:** Individual giant claw curvature, feather/fur mantle, slender legs and distinctive beak/eye. **NOT A CLONE:** Those arms and claws must dominate the silhouette, not merely be drawn inside a theropod body. *Separate vector artwork integrated in v0.8.28; **anatomical and mobile visual sign-off still pending**.*

- [ ] **Thylacoleo** — **OUTER:** Long low marsupial cat body, heavy forward-facing shoulders, short muzzle, strong grasping forepaws and thick tail. **LINES:** Marsupial jaw, catlike ear, large paw pads, pronounced climbing forearm muscles. **NOT A CLONE:** Not Sabertooth's long exposed fangs or Direwolf's narrow head. *Bespoke redraw and visual acceptance pending.*

- [ ] **Acrocanthosaurus** — **OUTER:** Deep-bodied large theropod with a continuous low ridge of raised spinal processes across the back, long angular skull and thick thighs. **LINES:** Individual raised neck/back spines, brow/cheek lines and three-fingered grasping hands. **NOT A CLONE:** Distinguish from Spino: back ridge is comparatively low, not a broad sail. *Separate vector artwork integrated in v0.8.28; **anatomical and mobile visual sign-off still pending**.*

- [ ] **Cryolophosaurus** — **OUTER:** Medium slender theropod with a distinctive sideways comb-like crest spanning the brow/crown, long neck and balanced upright posture. **LINES:** Crest cross-ridges, narrow snout, finger and toe claws, lighter limb proportions. **NOT A CLONE:** Not a Dilophosaur with two parallel crests; show the singular transverse head comb. *Separate vector artwork integrated in v0.8.28; **anatomical and mobile visual sign-off still pending**.*

- [ ] **Megaraptor** — **OUTER:** Graceful narrow-chested theropod, proportionately long forelimbs with huge curved hand claws, narrow low head and high stride. **LINES:** Hand anatomy and hooked thumb claws must read separately from hind toes, tendons and mouth. **NOT A CLONE:** No Therizinosaurus potbelly or generic tiny theropod arms. *Separate vector artwork integrated in v0.8.28; **anatomical and mobile visual sign-off still pending**.*

### 1C — herbivores and workhorses (15)

- [ ] **Ankylosaurus** — **OUTER:** Wide low tanklike body tapering into a short horned head, sprawling short legs, full armored dome and huge tail club. **LINES:** Rows of asymmetric osteoderms, bony facial horns, segmented tail taper into club. **NOT A CLONE:** Unlike Doedicurus, show flattened scutes and low torso instead of rounded ball-shell. *Bespoke redraw and visual acceptance pending.*

- [ ] **Doedicurus** — **OUTER:** Nearly hemispherical rolling shell covering most of body, tucked head, sturdy low feet and massive spiked tail mace. **LINES:** Shell plate seams and raised boss nodules, articulated mace/spikes, distinct little ear and face. **NOT A CLONE:** Do not reuse Ankylosaurus long low scute layout. *Bespoke redraw and visual acceptance pending.*

- [ ] **Mammoth** — **OUTER:** Tall shaggy elephant with sharply arched shoulder hump, pronounced trunk and two sweeping long upturned tusks. **LINES:** Hair curtain over forehead/chest, trunk wrinkles and ring segments, broad padded feet. **NOT A CLONE:** Must never look like a horse or rhino with added tusks. *Bespoke redraw and visual acceptance pending.*

- [ ] **Triceratops** — **OUTER:** Massive quadruped with broad shield-shaped neck frill, two long brow horns, small nose horn and short beaked snout. **LINES:** Frill edge and internal plate radii, horn roots, heavy hooves and neck folds. **NOT A CLONE:** Do not resemble Pachyrhinosaurus's rounded nasal boss. *Bespoke redraw and visual acceptance pending.*

- [ ] **Stegosaurus** — **OUTER:** Broad arched back carrying large alternating diamond plates, small low beaked head, long thick tail ending in multiple spikes. **LINES:** Plate thickness, pelvis articulation, four thagomizer spikes and heavy rounded feet. **NOT A CLONE:** Not Kentrosaurus's many slimmer tall spikes or Ankylosaurus scute armor. *Bespoke redraw and visual acceptance pending.*

- [ ] **Pachyrhinosaurus** — **OUTER:** Sturdy hornless-looking centrosaur with broad frill, huge solid nasal bone boss and shorter face. **LINES:** Frill scallops, solid nasal pad, short cheek spikes, heavy forefeet. **NOT A CLONE:** The blunt nose boss must replace Triceratops's three long horns. *Bespoke redraw and visual acceptance pending.*

- [ ] **Iguanodon** — **OUTER:** Large strong-legged beaked herbivore with long sturdy tail, switchable biped/quadruped stance and prominent thumb spike. **LINES:** Separate spike from other fingers, beak edge, strong shoulder, broad three-toed hind feet. **NOT A CLONE:** Not Parasaur's projecting tubular skull crest or generic long-neck herbivore. *Bespoke redraw and visual acceptance pending.*

- [ ] **Parasaur** — **OUTER:** Streamlined long-tailed hadrosaur, backward-projecting curved tubular crest extending from back of skull and light forelimbs. **LINES:** Crest root and inner opening, duck beak line, hind-toe spread, shoulder contour. **NOT A CLONE:** Crest silhouette must be prominent; not Iguanodon's uncrested head. *Bespoke redraw and visual acceptance pending.*

- [ ] **Brontosaurus** — **OUTER:** Extremely high shoulders, huge elephantine body, very long near-vertical neck, small blunt head and long tapering whip tail. **LINES:** Long vertical neck tendons, shoulder/hip folds, columnar four legs and toes. **NOT A CLONE:** More massive/high-shouldered than Diplodocus; tail less dominant than neck. *Bespoke redraw and visual acceptance pending.*

- [ ] **Diplodocus** — **OUTER:** Long low torso, very long horizontally projecting neck with little low head, exceptionally long pencil-thin whip tail. **LINES:** Separate thin tail extension, long vertebrae rhythm and narrow ribcage, four pillar feet. **NOT A CLONE:** Avoid Brontosaurus's huge tall-shouldered upright-neck outline. *Bespoke redraw and visual acceptance pending.*

- [ ] **Carbonemys** — **OUTER:** Medium squat turtle with large oval scute shell, small beaked head, short tail and splayed clawed legs. **LINES:** Scute divisions that follow shell curvature, head neck wrinkles, scaled clawed feet. **NOT A CLONE:** Not Grand Tortugar's elevated opening shell or Doedicurus's mammalian armor. *Bespoke redraw and visual acceptance pending.*

- [ ] **Paraceratherium** — **OUTER:** Very large long-legged rhino-like ungulate without a horn, long giraffelike neck and heavy barrel torso. **LINES:** Rhino upper lip, long neck fold rhythm, broad toes and pillar legs. **NOT A CLONE:** Must not look like an equine, short-necked rhino or Bronto. *Bespoke redraw and visual acceptance pending.*

- [ ] **Gallimimus** — **OUTER:** Ostrichlike upright slender theropod with tiny toothless head, very long neck, extremely long racing shins and long flat tail. **LINES:** Beak and eye profile, long ankle and three-toed feet, small forearms. **NOT A CLONE:** Not Raptor: no sickle claws and far longer legs/neck. *Bespoke redraw and visual acceptance pending.*

- [ ] **Morellatops** — **OUTER:** Bulky low camel-like desert quadruped with humped shoulders, broad horned/frilled snout and thick long tail. **LINES:** Facial prongs, hump folds, stiff limbs and broad hooves. **NOT A CLONE:** Not Parasaur's tall smooth cranial tube or a horned Trike. *Bespoke redraw and visual acceptance pending.*

- [ ] **Woolly Rhino** — **OUTER:** Deep stocky barrel torso carried on four short powerful legs, shaggy with one large forward nasal horn. **LINES:** Fur layers covering shoulder and haunch, heavy snout, cloven toes and horn base. **NOT A CLONE:** Unlike Mammoth, no trunk or giant curved tusks; unlike Paracer, short neck. *Bespoke redraw and visual acceptance pending.*

### 1D — flying creatures (8)

- [ ] **Argentavis** — **OUTER:** Huge eagle/vulture raptor with hooked beak, broad layered feather wings and fan tail; stout bird legs. **LINES:** Individual primary/secondary feathers and hooked talons, tail vane structure and eye brow. **NOT A CLONE:** Not Pteranodon's smooth membranous triangular wings. *Bespoke redraw and visual acceptance pending.*

- [ ] **Pteranodon** — **OUTER:** Long pointed stiff skull crest reaching far behind head, needle beak and huge narrow stretched membrane wings. **LINES:** Membrane attachment from long finger to hind leg, elongated shoulder/finger bones and hind claws. **NOT A CLONE:** Not Tapejara's tall forward crest or feathered Argentavis. *Bespoke redraw and visual acceptance pending.*

- [ ] **Tapejara** — **OUTER:** Distinct tall blade-like head crest above beak, short compact skull, four-limbed flying pose and broad folded wings. **LINES:** Forward-oriented crest blade, wing-finger joints, clawed hands and pointed toes. **NOT A CLONE:** Not Quetzal's very long neck and gigantic slender body. *Bespoke redraw and visual acceptance pending.*

- [ ] **Quetzal** — **OUTER:** Very long narrow neck, oversized long beak, small upper skull crest, enormous ground-striding wings and tall hind legs. **LINES:** Delicate wing membrane, folded wrist joints, narrow feet and beak profile. **NOT A CLONE:** Much taller/longer-necked than Tapejara or Pteranodon. *Bespoke redraw and visual acceptance pending.*

- [ ] **Snow Owl** — **OUTER:** Compact rounded owl head with large facial disk, short curved beak, enormous layered broad feathers and thick raptor talons. **LINES:** Concentric facial feather rings, tufted ear region, precise flight-feather fans, sturdy legs. **NOT A CLONE:** No Argentavis elongated hooked vulture face or narrow pointed wing. *Bespoke redraw and visual acceptance pending.*

- [ ] **Dimorphodon** — **OUTER:** Small batlike reptile flyer with large toothed head, disproportionately deep jaw and shorter wings. **LINES:** Tooth detail and mandible hinge, stretched skin between elongated fingers, clawed wing elbow. **NOT A CLONE:** Not Pteranodon: no huge backward head spike or toothless beak. *Bespoke redraw and visual acceptance pending.*

- [ ] **Pelagornis** — **OUTER:** Large seabird with slender long bill, enormous long narrow feather wings and light waterbird legs. **LINES:** Bill ridges/pseudoteeth where appropriate, flight-feather spacing, tail feathers and webbed feet. **NOT A CLONE:** Distinct from heavy broad-winged Argentavis and owl. *Bespoke redraw and visual acceptance pending.*

- [ ] **Lymantria** — **OUTER:** Large moth-like creature, plump segmented body and four broad veined wings, long antennae and delicate legs. **LINES:** Fine mirrored wing vein networks, antenna joint and thoracic segmentation. **NOT A CLONE:** Not a bird: no beak, no feathered wings, six legs instead of two. *Bespoke redraw and visual acceptance pending.*

### 1E — aquatic and semi-aquatic (8)

- [ ] **Megalodon** — **OUTER:** Fast streamlined shark with pointed triangular snout, tall dorsal fin, swept pectorals and asymmetrical crescent tail. **LINES:** Five visible gill slits, saw-toothed jaw, fin cartilage lines and lighter belly edge. **NOT A CLONE:** No broad armored Dunkleosteus jaw or Mosasaur reptilian limbs. *Bespoke redraw and visual acceptance pending.*

- [ ] **Dunkleosteus** — **OUTER:** Massive blunt armored fish head taking up much of body, plated hinged jaw, deep trunk and muscular tail. **LINES:** Articulated skull/bone plate seams, sharp bony biting edges, scale/flipper transitions. **NOT A CLONE:** Not sharklike: large near-rectangular plated head is central silhouette. *Bespoke redraw and visual acceptance pending.*

- [ ] **Mosasaurus** — **OUTER:** Long heavy marine lizard with broad tooth-lined crocodilian snout, four large paddle flippers and muscular flattened tail. **LINES:** Reptilian jaw articulation, neck folds and separated flipper digits. **NOT A CLONE:** Unlike Megalodon, no shark dorsal/pectoral pattern; unlike Plesiosaur, short neck. *Bespoke redraw and visual acceptance pending.*

- [ ] **Plesiosaur** — **OUTER:** Very long thin curving neck with tiny narrow head, rotund body, four large broad paddle flippers and short tail. **LINES:** Long neck vertebrae rhythm, shoulder girdle and fanlike flipper bones. **NOT A CLONE:** The neck dominates the silhouette; cannot resemble Mosasaurus. *Bespoke redraw and visual acceptance pending.*

- [ ] **Anglerfish** — **OUTER:** Bulbous deep-sea fish head/body with enormous gape, long curved lure stalk, small rear tail and broad fins. **LINES:** Needle teeth, lateral gill plates, lure bulb, dorsal fin rays. **NOT A CLONE:** Not a slim shark or regular fish: oversize head and lure must be obvious. *Bespoke redraw and visual acceptance pending.*

- [ ] **Sarcosuchus** — **OUTER:** Long massive low crocodilian quadruped with long narrow interlocking-jaw snout, dorsal armor and thick rowing tail. **LINES:** Rectangular back osteoderms, short splayed muscular legs, eyes near top of skull. **NOT A CLONE:** Unlike Kaprosuchus, not high-legged with projecting boar teeth. *Bespoke redraw and visual acceptance pending.*

- [ ] **Kaprosuchus** — **OUTER:** High-legged sprinting crocodilian with comparatively short broad snout, two oversized projecting tusklike teeth and narrow body. **LINES:** Long front legs and raised chest, exposed upper/lower protruding fangs and dorsal scutes. **NOT A CLONE:** Must look capable of galloping; Sarco remains heavy low amphibious form. *Bespoke redraw and visual acceptance pending.*

- [ ] **Xiphactinus** — **OUTER:** Long torpedo-bodied predatory bony fish, enormous mouth opening to near gill, dorsal fin set back and forked tail. **LINES:** Large fang-like teeth, broad gill cover, slender fin rays and tail keel. **NOT A CLONE:** Unlike Megalodon, tail is a bony-fish fork, not a shark crescent. *Bespoke redraw and visual acceptance pending.*

### 1F — remaining knockout and historical category-audit entries (35)

- [ ] **Achatina** — **OUTER:** Large low gastropod with towering tightly coiled shell, broad creeping foot and tentacled tiny head. **LINES:** Spiral shell growth ridges, two long eyestalks, mucous foot folds. **NOT A CLONE:** Not Doedicurus or a turtle: no legs or separated shell plates. *Bespoke redraw and visual acceptance pending.*

- [ ] **Archaeopteryx** — **OUTER:** Tiny feathered glider with distinct bird head, wing feathers extending from forelimbs and long bony feathered tail. **LINES:** Individual feather primaries and fan-tail nodes, gripping claws on wings and feet. **NOT A CLONE:** Unlike Microraptor, two wing surfaces rather than four strong feathered limbs. *Bespoke redraw and visual acceptance pending.*

- [ ] **Beelzebufo** — **OUTER:** Short broad frog with massive hind thighs, raised bulging eyes, squat webbed fore/hind toes and no tail. **LINES:** Grooved throat pouch, webbing cutouts, warty skin and bulging orbit rim. **NOT A CLONE:** Not lizardlike Diplocaulus; avoid any long tail. *Bespoke redraw and visual acceptance pending.*

- [ ] **Bison** — **OUTER:** Thick bovine animal with towering shoulder hump, big shaggy frontal mane, two broad horns and tiny tail. **LINES:** Cloven hooves, hump hair curtain, nostril and broad heavy neck. **NOT A CLONE:** Unlike Woolly Rhino, paired horns over forehead rather than solitary nasal horn. *Bespoke redraw and visual acceptance pending.*

- [ ] **Boaratos** — **OUTER:** Gigantic shaggy boar silhouette with round torso, heavy ruff, long curled tail and four oversized curved ivory tusks. **LINES:** Hollow branchlike tusk openings, flame/mane ridge shape, stout hog legs. **NOT A CLONE:** Not Daeodon's simpler short tusks or a woolly rhino; consult official Boaratos reference. *Bespoke redraw and visual acceptance pending.*

- [ ] **Castoroides** — **OUTER:** Broad stout beaver body with short legs, flat broad paddle tail, compact rounded ears and large incisors. **LINES:** Crosshatched flat tail scale pattern, incisors, short fur and webbed hind feet. **NOT A CLONE:** Not a small direbear: massive spatulate tail must be external silhouette. *Bespoke redraw and visual acceptance pending.*

- [ ] **Daeodon** — **OUTER:** Huge piglike quadruped with elongated deep head, protruding tusks, high shoulder crest and short tail. **LINES:** Jaw tusks and bristled back, broad nostrils and cloven feet. **NOT A CLONE:** Not Boaratos: fewer and smaller tusks with no elaborate curled tail. *Bespoke redraw and visual acceptance pending.*

- [ ] **Dimetrodon** — **OUTER:** Long low sprawling synapsid with very tall thin semicircular dorsal sail, small lizardlike head and low legs. **LINES:** Thin sail rib rays, body scales and toes. **NOT A CLONE:** Unlike Spinosaurus it is low four-legged and the sail looks broad and semicircular. *Bespoke redraw and visual acceptance pending.*

- [ ] **Diplocaulus** — **OUTER:** Salamander-like amphibian with a distinctive broad boomerang-shaped flat skull, squat forelimbs, aquatic tail. **LINES:** Winged skull lobes, gill/skin edges, webbed feet and thin torso. **NOT A CLONE:** Not a broad frog or crocodile; the lateral head fans are key. *Bespoke redraw and visual acceptance pending.*

- [ ] **Direbear** — **OUTER:** Hulking bear with elevated shoulder hump, very heavy chest, rounded short ears, short muzzle and powerful plantigrade paws. **LINES:** Claw and paw separation, fur tufts and shoulder musculature. **NOT A CLONE:** Not Sabertooth's thin hips, catlike back or wolf ears. *Bespoke redraw and visual acceptance pending.*

- [ ] **Dodo** — **OUTER:** Round squat short-winged bird with oversized blunt hooked beak, tiny fan tail and short stout feet. **LINES:** Tufted wings, thick neck plume and separated three toe claws. **NOT A CLONE:** Unlike Terror Bird, legs short and round torso dominates. *Bespoke redraw and visual acceptance pending.*

- [ ] **Fasolasuchus** — **OUTER:** Large low-slung archosaur with long narrow toothy head, tall angular spine ridges, four strong splayed legs and long tail. **LINES:** Crocodilelike teeth, thick shoulder musculature, sloping armored back. **NOT A CLONE:** Must not borrow Sarco's uniformly low profile; category warning: explosive-specialty taming. *Bespoke redraw and visual acceptance pending.*

- [ ] **Gasbags** — **OUTER:** Huge almost spherical inflated belly with small beaked face, tiny legs and abrupt slender tail. **LINES:** Bulging inflation folds, rubbery skin creases, stubby feet. **NOT A CLONE:** Avoid four-leg frog silhouette or long-neck dinosaur; spherical buoyant torso is key. *Bespoke redraw and visual acceptance pending.*

- [ ] **Grand Tortugar** — **OUTER:** Enormous elevated high-domed tortoise shell with conspicuous opening side panels, massive low legs and small turtle head. **LINES:** Movable shell side seams, layered shell architecture, thick reptilian toes. **NOT A CLONE:** Not Carbonemys's plain oval closed shell; verify against official Grand Tortugar art. *Bespoke redraw and visual acceptance pending.*

- [ ] **Griffin** — **OUTER:** Lionlike forechest/head topped with eagle hooked beak, two enormous feathered wings, cat hindquarters and long tufted tail. **LINES:** Distinct eagle feather mane and talons in front, feline back paws, wing layering. **NOT A CLONE:** Avoid dragon membranes or a single bird body; hybrid silhouette mandatory. *Bespoke redraw and visual acceptance pending.*

- [ ] **Ichthyornis** — **OUTER:** Small gull-like seabird with long slender beak, outstretched narrow feather wings and tiny legs. **LINES:** Long beak hook, wing primaries and webbing at feet. **NOT A CLONE:** Unlike Pelagornis it is smaller, more gull-proportioned with less elongated wings. *Bespoke redraw and visual acceptance pending.*

- [ ] **Jerboa** — **OUTER:** Tiny kangaroo-mouse with enormous round ears, tiny forelimbs, long upright rear legs and extremely long tufted tail. **LINES:** Whiskers, huge ears, thin hock and precise tail-tip tuft. **NOT A CLONE:** Not ratlike Lystrosaurus or stocky Procoptodon. *Bespoke redraw and visual acceptance pending.*

- [ ] **Kairuku** — **OUTER:** Upright penguin with plump teardrop body, short beak, flipper wings and small webbed feet. **LINES:** Tummy plume boundary, flipper bases and foot toes. **NOT A CLONE:** No airborne bird wing profile; distinctly upright swimming bird. *Bespoke redraw and visual acceptance pending.*

- [ ] **Kentrosaurus** — **OUTER:** Stockier small stegosaur with many tall narrow shoulder/back spikes and paired tail spikes, low head. **LINES:** Alternating smaller plates and long spikes, pronounced shoulder prongs. **NOT A CLONE:** Not Stegosaurus's few broad kite-shaped back plates. *Bespoke redraw and visual acceptance pending.*

- [ ] **Maeguana** — **OUTER:** Reptilian glider with wide-bodied lizard form, prominent basilisk-like crest, outward stretched patagia and slender gripping limbs. **LINES:** Cross-braces for gliding membranes, scaly tail, hooked toes and crest rays. **NOT A CLONE:** Not a flattened Maewing or running Megalania; official Maeguana profile required. *Bespoke redraw and visual acceptance pending.*

- [ ] **Managarmr** — **OUTER:** Sleek dragon-wolf with narrow canine snout, long forelimbs and hindlegs, wingless aerodynamic torso and trailing tail. **LINES:** Feathered jaw frills, shoulder tufts, four catlike paws and segmented tail. **NOT A CLONE:** Unlike Wyvern, no broad wings; unlike Direwolf, reptilian flightlike silhouette. *Bespoke redraw and visual acceptance pending.*

- [ ] **Megalania** — **OUTER:** Low monitor lizard with long flattened snout, sprawling four legs with hooked gripping claws, extraordinarily long tapering tail. **LINES:** Scaly back, throat folds and long clawed toes. **NOT A CLONE:** Unlike Sarco, no plated crocodile armor or bulky back. *Bespoke redraw and visual acceptance pending.*

- [ ] **Megaloceros** — **OUTER:** Long-legged deer with slender muzzle, enormous branching antlers and slim hooves. **LINES:** Distinct multiple antler tines, shoulder mane and long slender shins. **NOT A CLONE:** Not Woolly Rhino's solid nasal horn or Bison shoulder hump. *Bespoke redraw and visual acceptance pending.*

- [ ] **Megatherium** — **OUTER:** Huge ground sloth with thick nearly upright hind stance, broad hips, high shoulder and elongated hooked foreclaws. **LINES:** Fur over chest and stomach, giant foreclaws and small head. **NOT A CLONE:** Not Direbear: longer upward arms and slothlike muzzle. *Bespoke redraw and visual acceptance pending.*

- [ ] **Microraptor** — **OUTER:** Small four-winged feathered dinosaur with strong feather fans attached to both arms and hind legs, long trailing tail. **LINES:** Distinct four separate wing surfaces, central beaklike skull and claws. **NOT A CLONE:** Not Archaeopteryx's two principal wings or ordinary Raptor. *Bespoke redraw and visual acceptance pending.*

- [ ] **Oviraptor** — **OUTER:** Slim upright theropod with large casque head crest, toothless parrotlike beak, long neck and flowing tail. **LINES:** Crest edge, feathers on arms and tail, long slender grasping hands. **NOT A CLONE:** No toothed Raptor face or Gallimimus tiny smooth head. *Bespoke redraw and visual acceptance pending.*

- [ ] **Pachy** — **OUTER:** Short bulky dome-headed biped with a single smooth exaggerated skull dome, stout neck and short forearms. **LINES:** Dome boundary, small head knobs, sturdy leg toes. **NOT A CLONE:** Not Triceratops horns or Parasaur elongated tube crest. *Bespoke redraw and visual acceptance pending.*

- [ ] **Phiomia** — **OUTER:** Small stocky primitive elephant/boar-like quadruped with short downward-curved trunk, two small tusks and squat legs. **LINES:** Ear edge, nostrils at trunk tip, narrow tusks and rounded feet. **NOT A CLONE:** Not giant shaggy Mammoth; much smaller tusks and short trunk. *Bespoke redraw and visual acceptance pending.*

- [ ] **Procoptodon** — **OUTER:** Giant kangaroo with compact forearms, enormous muscular hind thighs/feet, tall pointed ears and broad balancing tail. **LINES:** Long spring-like hock, prominent foot toe and small front paws. **NOT A CLONE:** Not Jerboa: much heavier hind body and tail. *Bespoke redraw and visual acceptance pending.*

- [ ] **Pulmonoscorpius** — **OUTER:** Long low giant scorpion with two oversized frontal pincers, segmented low body, eight jointed legs and high curved stinger. **LINES:** Leg joint segments, tail plates, pincers with two fingers, sting needle. **NOT A CLONE:** Not Karkinos crab: raised venom tail must be silhouette-defining. *Bespoke redraw and visual acceptance pending.*

- [ ] **Purlovia** — **OUTER:** Squat low burrowing mammal with catlike rounded head, broad shoulders, oversized digging foreclaws and short tail. **LINES:** Thick fur tufts, powerful wrist joint, gripping forepaws. **NOT A CLONE:** Unlike Direwolf, very short powerful digging build; not a generic cat. *Bespoke redraw and visual acceptance pending.*

- [ ] **Ravager** — **OUTER:** Lean six-limbed Aberration predator with feral elongated muzzle, pronounced spined ridge, powerful front claws and pointed tail. **LINES:** Show the extra limb/stance anatomy accurately from in-game references, mane spines and sharp cheek. **NOT A CLONE:** Must not be rendered as a four-legged Direwolf with spikes. *Bespoke redraw and visual acceptance pending.*

- [ ] **Shastasaurus** — **OUTER:** Giant streamlined ichthyosaur, long tapered snout, thick forward chest, two big pectoral flippers, vertical torso and fishlike tail. **LINES:** Flipper bones, lateral eye, broad body transitions and tail fluke. **NOT A CLONE:** Not Mosasaurus's four-flipper reptile; category warning: special passive tame. *Bespoke redraw and visual acceptance pending.*

- [ ] **Thorny Dragon** — **OUTER:** Low thick spiky lizard with broad triangular reptile skull, flattened body, all-over tall thorny spines and heavy short legs. **LINES:** Spine clumps around head and shoulders, belly scales, long hooked claws. **NOT A CLONE:** Not Megalania's smooth back or a mini Stegosaurus. *Bespoke redraw and visual acceptance pending.*

- [ ] **Velonasaur** — **OUTER:** Bipedal slim reptile with dramatic retractable long quill crown across neck and shoulders, compact muzzle and medium tail. **LINES:** Radiating quill shafts, chest folds, clawed limbs and distinct toes. **NOT A CLONE:** Spine distribution differs from Thorny Dragon: mostly collar/neck rather than body. *Bespoke redraw and visual acceptance pending.*

## Delivery gate

Do not mark a pending row complete unless a dedicated local illustration exists, its outer contour is a distinguishable species-specific shape, every required feature survives an outline-only review, the correct creature is displayed in Taming Lab, all theme palettes remain readable, and automated art/calculator regression checks plus human visual QA pass.

**Artwork status at specification freeze:** 10 reference illustrations with user-positive feedback / 7 further newly integrated silhouettes requiring visual QA / 67 requiring bespoke source silhouettes / 84 historically listed knockout-art entries. Runtime classification is authoritative for which taming calculator shows.
