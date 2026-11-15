# Taming Lab Creature Artwork Rollout

> Live production checklist, ordered by taming method. A checked box indicates dedicated species-specific traced vector artwork integrated into the **searchable Taming Lab**, not final human visual approval.

**Scope:** 214 official-base catalog creatures plus 64 variants; 278 dossier entries in total.
**Release waves:** 1 Knockout, 2 Passive, 3 Specialty, 4 Variants / Untameable / final QA.
**Baseline:** Rex's approved detailed anatomical outline; original creature artwork for each completed species, tinted by the active theme.
**Existing functionality:** Taming Lab is the searchable knockout planner; passive and specialty retain their own searchable labs. The separate Creature Dossiers page was removed in v0.8.25 at the user's request. This checklist tracks unique artwork upgrades, not calculator coverage.
**Interim knockout linework:** v0.8.26 adds individually keyed anatomical accents to all remaining knockout body-plan studies. These are provisional—not counted as completed high-detail drawings. The Rex and initial nine remain separately traced.
**Backup:** `backup/v0.8.23-before-creature-wave1`.

## All-creature linework coverage — v0.8.27

**Functional art coverage: 278/278 catalog entries.** All listed base creatures and variants have locally rendered, theme-colored anatomical field sketches in the existing searchable Taming Lab or the linked passive/specialty planners. Each study combines an appropriate body plan, anatomy landmarks, and a deterministic named-creature contour trace. No remote photos or image CDN is required.

**Individually illustrated vector entries: 19/278** (Rex, the first nine approved line drawings, and nine new large predators). The remaining 259 are **stylized anatomy studies** sharing 27 body-plan families; they are **not** claimed to be individually commissioned, hand-traced, or reviewed to Rex-level detail. The unchecked boxes below track that higher-quality art review.

**Taming Lab UX:** The separate Dossiers page remains removed. Taming Lab search now finds every species. Only knockout creatures receive ordinary tranquilizer math; passive and specialty selections can open their correct search-based planners, and untameables cannot start a tame timer.

**Source preservation:** `backup/v0.8.26-before-full-creature-rollout`.

## Large predators artwork upgrade — v0.8.28

Nine newly illustrated species have their own original SVG traces: Giganotosaurus, Carcharodontosaurus, Spinosaurus, Yutyrannus, Megalosaurus, Therizinosaurus, Acrocanthosaurus, Cryolophosaurus and Megaraptor. These illustrations replace family templates on the existing Taming Lab / Specialty Lab. They are stylized reconstructions, subject to visual and anatomical review, not direct copies of ARK game models. **Thylacoleo remains pending** a properly distinguished quadrupedal marsupial-lion illustration; generic feline artwork is not marked complete.

Backup: `backup/v0.8.27-before-predator-art`.


## Knockout artwork quality gate

**[Full species-by-species outline requirements](./KNOCKOUT_UNIQUE_SILHOUETTE_SPECS.md)** cover all 84 historical Phase 1 entries. Every creature has required outer proportions, defining anatomical strokes and a specific anti-template-clone check.

**Status distinction:** The first ten Rex-era drawings received positive feedback; seven further historical Phase 1 species received unique vector illustrations in v0.8.28 and still need visual acceptance. The other 67 require new individual artwork. In the master checklist, a checked box denotes **integrated artwork, not necessarily user-verified or anatomically approved**. The dedicated QA specification retains every not-yet-approved entry as unchecked.

**Taming method caution:** Historical artwork groupings are not authority for game mechanics. Continue to use runtime taming classification for all calculations.

## Individual artwork rollout — v0.8.32

**18 of the 67 historically pending knockout-art entries are newly illustrated and integrated.** Two nine-creature batches use original detailed ink drawings, vectorized into local, theme-color SVG masks. Distinct source artwork was verified by automated tests; **human inspection of likeness, crop, mobile clarity, and anatomy remains pending**. The remaining **49 entries are NOT finished**; they remain on their previous provisional body-plan studies rather than shipping clipped or incomplete tracings.

**Review list:** [67-creature visual QA checklist](./KNOCKOUT_ARTWORK_REVIEW_67.md). No separate Dossiers route was added. Existing Taming Lab art-left compact layout, calculators, classification, themes and timers remain unchanged.

**Backup:** `backup/v0.8.31-before-67-unique-linework`.

## Phase 1 - Knockout species

### 1A - Core carnivores (10)

- [x] Rex — unique artwork integrated; visual approval pending
- [x] Raptor — unique artwork integrated; visual approval pending
- [x] Carnotaurus — unique artwork integrated; visual approval pending
- [x] Allosaurus — unique artwork integrated; visual approval pending
- [x] Baryonyx — unique artwork integrated; visual approval pending
- [x] Sabertooth — unique artwork integrated; visual approval pending
- [x] Direwolf — unique artwork integrated; visual approval pending
- [x] Terror Bird — unique artwork integrated; visual approval pending
- [x] Dilophosaur — unique artwork integrated; visual approval pending
- [x] Compy — unique artwork integrated; visual approval pending

### 1B - Large predators (8)

- [x] Spinosaurus — individual vector artwork integrated; visual review pending
- [x] Yutyrannus — individual vector artwork integrated; visual review pending
- [x] Megalosaurus — individual vector artwork integrated; visual review pending
- [x] Therizinosaurus — individual vector artwork integrated; visual review pending
- [x] Thylacoleo — individual line-art illustration integrated in v0.8.32; awaiting user visual QA
- [x] Acrocanthosaurus — individual vector artwork integrated; visual review pending
- [x] Cryolophosaurus — individual vector artwork integrated; visual review pending
- [x] Megaraptor — individual vector artwork integrated; visual review pending

### 1C - Herbivores / workhorses (15)

- [x] Ankylosaurus — individual line-art illustration integrated in v0.8.32; awaiting user visual QA
- [x] Doedicurus — individual line-art illustration integrated in v0.8.32; awaiting user visual QA
- [x] Mammoth — individual line-art illustration integrated in v0.8.32; awaiting user visual QA
- [x] Triceratops — individual line-art illustration integrated in v0.8.32; awaiting user visual QA
- [x] Stegosaurus — individual line-art illustration integrated in v0.8.32; awaiting user visual QA
- [x] Pachyrhinosaurus — individual line-art illustration integrated in v0.8.32; awaiting user visual QA
- [x] Iguanodon — individual line-art illustration integrated in v0.8.32; awaiting user visual QA
- [x] Parasaur — individual line-art illustration integrated in v0.8.32; awaiting user visual QA
- [x] Brontosaurus — individual line-art illustration integrated in v0.8.32; awaiting user visual QA
- [x] Diplodocus — individual line-art illustration integrated in v0.8.32; awaiting user visual QA
- [x] Carbonemys — individual line-art illustration integrated in v0.8.32; awaiting user visual QA
- [x] Paraceratherium — individual line-art illustration integrated in v0.8.32; awaiting user visual QA
- [x] Gallimimus — individual line-art illustration integrated in v0.8.32; awaiting user visual QA
- [x] Morellatops — individual line-art illustration integrated in v0.8.32; awaiting user visual QA
- [x] Woolly Rhino — individual line-art illustration integrated in v0.8.32; awaiting user visual QA

### 1D - Flyers (8)

- [x] Argentavis — individual line-art illustration integrated in v0.8.32; awaiting user visual QA
- [x] Pteranodon — individual line-art illustration integrated in v0.8.32; awaiting user visual QA
- [ ] Tapejara
- [ ] Quetzal
- [ ] Snow Owl
- [ ] Dimorphodon
- [ ] Pelagornis
- [ ] Lymantria

### 1E - Aquatic and semi-aquatic (8)

- [ ] Megalodon
- [ ] Dunkleosteus
- [ ] Mosasaurus
- [ ] Plesiosaur
- [ ] Anglerfish
- [ ] Sarcosuchus
- [ ] Kaprosuchus
- [ ] Xiphactinus

### 1F - Remaining knockout species (35)

- [ ] Achatina
- [ ] Archaeopteryx
- [ ] Beelzebufo
- [ ] Bison
- [ ] Boaratos
- [ ] Castoroides
- [ ] Daeodon
- [ ] Dimetrodon
- [ ] Diplocaulus
- [ ] Direbear
- [ ] Dodo
- [ ] Fasolasuchus
- [ ] Gasbags
- [ ] Grand Tortugar
- [ ] Griffin
- [ ] Ichthyornis
- [ ] Jerboa
- [ ] Kairuku
- [ ] Kentrosaurus
- [ ] Maeguana
- [ ] Managarmr
- [ ] Megalania
- [ ] Megaloceros
- [ ] Megatherium
- [ ] Microraptor
- [ ] Oviraptor
- [ ] Pachy
- [ ] Phiomia
- [ ] Procoptodon
- [ ] Pulmonoscorpius
- [ ] Purlovia
- [ ] Ravager
- [ ] Shastasaurus
- [ ] Thorny Dragon
- [ ] Velonasaur

## Phase 2 - Passive creatures (29)

- [ ] Araneo
- [ ] Arthropluera
- [ ] Basilosaurus
- [ ] Bulbdog
- [ ] Chalicotherium
- [ ] Dung Beetle
- [ ] Electrophorus
- [ ] Equus
- [ ] Featherlight
- [ ] Giant Bee
- [ ] Gigantopithecus
- [ ] Glowtail
- [ ] Hyaenodon
- [ ] Ichthyosaurus
- [ ] Liopleurodon
- [ ] Lystrosaurus
- [ ] Manta
- [ ] Mantis
- [ ] Mesopithecus
- [ ] Moschops
- [ ] Onyc
- [ ] Ovis
- [ ] Pegomastax
- [ ] Roll Rat
- [ ] Shinehorn
- [ ] Titanoboa
- [ ] Tusoteuthis
- [ ] Unicorn
- [ ] Vulture

## Phase 3 - Specialty creatures (66)

- [ ] Archelon
- [ ] Armadoggo
- [ ] Astrocetus
- [ ] Aureliax
- [ ] Basilisk
- [ ] Bloodstalker
- [ ] Burrowbuck
- [x] Carcharodontosaurus — individual vector artwork integrated; visual review pending
- [ ] Cat
- [ ] Ceratosaurus
- [ ] Cerberax
- [ ] Coelacanth
- [ ] Concavenator
- [ ] Cosmo
- [ ] Deinonychus
- [ ] Deinosuchus
- [ ] Deinotherium
- [ ] Desert Titan
- [ ] Desmodus
- [ ] DodoRex
- [ ] Drakeling
- [ ] Dreadmare
- [ ] Dreadnoughtus
- [ ] Elderclaw
- [ ] Enforcer
- [ ] Enigmasaur
- [ ] Forest Titan
- [ ] Gacha
- [ ] Gargantar
- [ ] Gigadesmodus
- [x] Giganotosaurus — individual vector artwork integrated; visual review pending
- [ ] Gigantoraptor
- [ ] Gloon
- [ ] Helicoprion
- [ ] Hesperornis
- [ ] Ice Titan
- [ ] Karkinos
- [ ] Lamprey
- [ ] Leech
- [ ] Lumina
- [ ] Magmasaur
- [ ] Malwyn
- [ ] Megachelon
- [ ] Oasisaur
- [ ] Ossidon
- [ ] Otter
- [ ] Palaeoctopus
- [ ] Parrot
- [ ] Phoenix
- [ ] Piranha
- [ ] Pyromane
- [ ] Reaper
- [ ] Rhyniognatha
- [ ] Rock Drake
- [ ] Rock Elemental
- [ ] Sabertooth Salmon
- [ ] Solwyn
- [ ] Tidepup
- [ ] Titanosaur
- [ ] Trilobite
- [ ] Troodon
- [ ] Umbra
- [ ] Veilwyn
- [ ] Wyvern
- [ ] Xeranox
- [ ] Yi Ling

## Phase 4A - Variants and forms (64)

- [ ] Aberrant Achatina (base: Achatina)
- [ ] Aberrant Anglerfish (base: Anglerfish)
- [ ] Aberrant Ankylosaurus (base: Ankylosaurus)
- [ ] Aberrant Araneo (base: Araneo)
- [ ] Aberrant Arthropluera (base: Arthropluera)
- [ ] Aberrant Baryonyx (base: Baryonyx)
- [ ] Aberrant Beelzebufo (base: Beelzebufo)
- [ ] Aberrant Carbonemys (base: Carbonemys)
- [ ] Aberrant Carnotaurus (base: Carnotaurus)
- [ ] Aberrant Dimetrodon (base: Dimetrodon)
- [ ] Aberrant Dimorphodon (base: Dimorphodon)
- [ ] Aberrant Diplocaulus (base: Diplocaulus)
- [ ] Aberrant Diplodocus (base: Diplodocus)
- [ ] Aberrant Dire Bear (base: Direbear)
- [ ] Aberrant Dodo (base: Dodo)
- [ ] Aberrant Doedicurus (base: Doedicurus)
- [ ] Aberrant Electrophorus (base: Electrophorus)
- [ ] Aberrant Equus (base: Equus)
- [ ] Aberrant Fasolasuchus (base: Fasolasuchus)
- [ ] Aberrant Gigantopithecus (base: Gigantopithecus)
- [ ] Aberrant Gigantoraptor (base: Gigantoraptor)
- [ ] Aberrant Iguanodon (base: Iguanodon)
- [ ] Aberrant Lystrosaurus (base: Lystrosaurus)
- [ ] Aberrant Manta (base: Manta)
- [ ] Aberrant Megalania (base: Megalania)
- [ ] Aberrant Megalosaurus (base: Megalosaurus)
- [ ] Aberrant Moschops (base: Moschops)
- [ ] Aberrant Otter (base: Otter)
- [ ] Aberrant Oviraptor (base: Oviraptor)
- [ ] Aberrant Ovis (base: Ovis)
- [ ] Aberrant Paraceratherium (base: Paraceratherium)
- [ ] Aberrant Parasaur (base: Parasaur)
- [ ] Aberrant Pulmonoscorpius (base: Pulmonoscorpius)
- [ ] Aberrant Purlovia (base: Purlovia)
- [ ] Aberrant Raptor (base: Raptor)
- [ ] Aberrant Sarco (base: Sarcosuchus)
- [ ] Aberrant Spino (base: Spinosaurus)
- [ ] Aberrant Stegosaurus (base: Stegosaurus)
- [ ] Aberrant Triceratops (base: Triceratops)
- [ ] Tek Giganotosaurus (base: Giganotosaurus)
- [ ] Tek Parasaur (base: Parasaur)
- [ ] Tek Quetzal (base: Quetzal)
- [ ] Tek Raptor (base: Raptor)
- [ ] Tek Rex (base: Rex)
- [ ] Tek Stegosaurus (base: Stegosaurus)
- [ ] X-Allosaurus (base: Allosaurus)
- [ ] X-Ankylosaurus (base: Ankylosaurus)
- [ ] X-Argentavis (base: Argentavis)
- [ ] X-Basilosaurus (base: Basilosaurus)
- [ ] X-Dunkleosteus (base: Dunkleosteus)
- [ ] X-Ichthyosaurus (base: Ichthyosaurus)
- [ ] X-Megalodon (base: Megalodon)
- [ ] X-Mosasaurus (base: Mosasaurus)
- [ ] X-Otter (base: Otter)
- [ ] X-Paraceratherium (base: Paraceratherium)
- [ ] X-Parasaur (base: Parasaur)
- [ ] X-Raptor (base: Raptor)
- [ ] X-Rex (base: Rex)
- [ ] X-Sabertooth (base: Sabertooth)
- [ ] X-Spino (base: Spinosaurus)
- [ ] X-Tapejara (base: Tapejara)
- [ ] X-Triceratops (base: Triceratops)
- [ ] X-Woolly Rhino (base: Woolly Rhino)
- [ ] X-Yutyrannus (base: Yutyrannus)

## Phase 4B - Untameable / edge-case dossiers (35)

- [ ] Ammonite — informational dossier only, no invented tame timer
- [ ] Attack Drone — informational dossier only, no invented tame timer
- [ ] Broodmother Lysrix — informational dossier only, no invented tame timer
- [ ] Cnidaria — informational dossier only, no invented tame timer
- [ ] Deathworm — informational dossier only, no invented tame timer
- [ ] Defense Unit — informational dossier only, no invented tame timer
- [ ] Dodo Wyvern — informational dossier only, no invented tame timer
- [ ] Dragon — informational dossier only, no invented tame timer
- [ ] Eurypterid — informational dossier only, no invented tame timer
- [ ] Glowbug — informational dossier only, no invented tame timer
- [ ] Grendel — informational dossier only, no invented tame timer
- [ ] Hydraskos — informational dossier only, no invented tame timer
- [ ] Jug Bug — informational dossier only, no invented tame timer
- [ ] King Titan — informational dossier only, no invented tame timer
- [ ] Leedsichthys — informational dossier only, no invented tame timer
- [ ] Lost King — informational dossier only, no invented tame timer
- [ ] Lost Queen — informational dossier only, no invented tame timer
- [ ] Manticore — informational dossier only, no invented tame timer
- [ ] Meganeura — informational dossier only, no invented tame timer
- [ ] Megapithecus — informational dossier only, no invented tame timer
- [ ] Minotaur — informational dossier only, no invented tame timer
- [ ] Murder Turkey — informational dossier only, no invented tame timer
- [ ] Nameless — informational dossier only, no invented tame timer
- [ ] Natrix — informational dossier only, no invented tame timer
- [ ] Neophyte — informational dossier only, no invented tame timer
- [ ] Nunatak — informational dossier only, no invented tame timer
- [ ] Overseer — informational dossier only, no invented tame timer
- [ ] Revenant — informational dossier only, no invented tame timer
- [ ] Scout — informational dossier only, no invented tame timer
- [ ] Seeker — informational dossier only, no invented tame timer
- [ ] Thanatos — informational dossier only, no invented tame timer
- [ ] Thodes — informational dossier only, no invented tame timer
- [ ] Thrall — informational dossier only, no invented tame timer
- [ ] Titanomyrma — informational dossier only, no invented tame timer
- [ ] Yeti — informational dossier only, no invented tame timer

## Quality gates

- [ ] Review every completed drawing for anatomically recognizable species-specific structure.
- [ ] Verify mobile, desktop and all 10 themes.
- [ ] Preserve actual live calculator models; no fabricated taming statistics.
- [ ] Distinguish curated line art from default body-plan studies in the UI.
- [ ] Audit variant inherited anatomy and mechanics individually.
- [ ] Confirm source backups and rollback paths.
