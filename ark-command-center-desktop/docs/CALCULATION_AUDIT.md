# ARK Command Center — calculation verification register

Updated: 2026-11-06 (America/Chicago), release v0.6.5. Status: **breeding reference values cross-checked against the current ASA source snapshot; specialty methods cross-referenced against ARK wiki pages, but most special-tame item quantities still lack numerical formulas; NomadARK taming, egg hatch, maturation and mating rates integrated, with creature food-drain and imprint rates unverified**.

## NomadARK.net server-specific source check

The [NomadARK owner website](https://nomadark.net/) publicly confirms **10× taming and 10× harvesting**. On November 6, the user supplied a direct NomadARK server rates/rules list specifying **10× XP, 0.2× mating interval, 8× baby mature, 25× egg hatch, 5× crops**, plus caps and player settings. This direct rate list supersedes generic secondary listing defaults and resolves the website FAQ's inconsistent XP claim.

Two secondary listings conflict: [Arkwipe](https://arkwipe.com/asa-clusters/nomadark-net-3b6893) marks breeding broadly "10×", while [Fusey](https://ark.fusey.gg/ark-survival-ascended/clusters/fie1714bj4t87) separately lists 1× maturation, hatching, mating and cuddle settings. Neither displays verified, current NomadARK Game.ini evidence. **We cannot infer exact breeding multipliers from these sites.**

The app now sets new-install defaults to **10× taming, 25× egg hatch, 8× maturation, 0.2× mating interval**, and safely migrates only the old untouched 10× working profile (preserving customization). **Imprint interval 0.1× and dinosaur food drain 1× remain estimates.** User-listed *player* food drain 0.5× cannot be substituted for dinosaur hunger. NomadARK also lists **300% Longneck buff**; knockout dart counts show the effect of an editable **3× assumed damage modifier** separate from blueprint quality. The precise meaning of "buff 300%" should still be confirmed. NomadARK's custom 15× Jungle map is not included in the official-map preset.

## What the automated tests verify

- All 279 catalog entries are placed in exactly one of: 133 conventional, 72 specialty, 39 passive or 35 untameable. Cerberax's three-trial process was correctly moved to specialty.
- Every supported conventional food option returns finite positive counts and durations at wild levels 1, 30, 90, 150 and 300. The test checks 1×/10× taming and 1×/2× food drain and validates direction of multiplier effects.
- Every currently modeled heavy-projectile option reports valid, level-scaled minimum hit counts. The ordinary tranquilizer engine rejects the special knockout method.
- Every specialty food/egg offering either produces a positive count from its available model or gives an explicit unverified response, never a fabricated value. Bloodstalker and Palaeoctopus counts intentionally have **no automatically invented completion timer**.
- All 39 passive roster entries either produce a nonzero estimated count or explicitly decline an unsupported calculation.
- All 220 breeding baselines have positive **source-recorded 1× maturation and incubation or gestation** times, plus a minimum/maximum mating cooldown. The v0.6.3 snapshot had only 52 incubation/gestation records. The October 22, 2026 DinoIndex dataset (ARK Smart Breeding ASA version 94.7.2) fills the missing baselines and the previously omitted Yutyrannus and X-Yutyrannus entries. Tests compare every base record to the source snapshot rather than inferring a generic timer.
- All 1,143 imported wiki recipes and 22 reviewed starter recipes pass cycle and structural validation; each can expand into a finite crafting tree for quantities 1 and 1,000.
- The ten full-surface themes are represented in the settings UI and have background and form-field variables.

Run with `npm test`. Important: these tests validate invariants, imported values, and known reference examples. They cannot prove that third-party source tables match the latest game build.

## Coverage matrix

| Function | Entries with generated estimates | Remaining accuracy requirements |
|---|---:|---|
| Conventional food count/duration | 122 of 133 | 11 have no supported automatic food model; the others still require current ASA and cluster comparison |
| Conventional projectile counts | Model for standard knockouts, including inherited/assumed values | Species-specific projectile resistance, head multipliers, torpor tick/decay and projectile availability |
| Heavy specialty projectile count | 3 creatures: Karkinos, Rock Elemental, Titanosaur | Real hit-location behavior, patch changes, effective damage and torpor decay |
| Specialty item/food counts | 8 of 72 have a modeled feeding/special-application count, and 12 of 72 have a single capture egg/seed/basket supply | Bloodstalker uses a wiki 10-packs/level baseline scaled to 10× (wild melee variability); Palaeoctopus has a theoretical minimum of 800 torpor per bite, excluding torpor decay; the other 52+ specialty interactions may have no level-only formula |
| Passive food estimates | 31 of 39 | Passive feeding intervals and conditions are not captured by hunger-only time formulas |
| Maturation durations | 220 of 220 listed breeding forms | Source review (156 base + 64 inherited form timings), server multipliers and special raising mechanics |
| Egg hatch/gestation duration | 220 of 220 listed breeding forms | Imported source-provided base times; uncommon host/impregnation reproduction remains unsupported |
| Mating cooldown min/max | 220 of 220 listed breeding forms | Source intervals × NomadARK's 0.2 setting, excluding unusual mating rules and possible event overrides |
| Crafting ingredient trees | 1,143 wiki-derived entries + 22 reviewed recipes | Individual ASA availability, output amounts, alternates, station efficiencies, event/mod differences; **not 1,143 individually game-verified recipes** |

## Bugs found and fixed in this pass

- The UI displayed **Vegetables** for some species while the imported creature list used **Crops** and the base food table used **Vegetables**. This made 32 selected food choices fail to calculate. The resolver now searches both source and display names, and exhaustive tests cover the entire selectable set.
- **v0.6.4 breeding completeness fix:** The earlier breeding list omitted Yutyrannus and X-Yutyrannus, and only 52 of 218 had explicit hatch/gestation data. A reproducible source import now matches 156 current DinoIndex ASA breeding profiles and 64 verified forms. The raising UI shows source-backed durations to the nearest second, 10%/50% juvenile milestones, and a min/max mating cooldown adjusted by 0.2×.
- **v0.6.5 specialty roster method audit:** The 72 specialty dropdown entries now have explicit linked procedures: 69 documented, 2 announced/unreleased (Enigmasaur, Xeranox), and 1 event-only/not ordinarily tameable (DodoRex). Previously absent Bloodstalker and other special methods have usable item lists. Cosmo now correctly lists Plant Species Z Seeds and Chitin. Palaeoctopus uses Bio Toxin for a bite-triggered knockout; its Black Pearls, Exceptional Kibble and Raw Prime Fish Meat are separate post-knockout choices. Level-150 Bloodstalker at 10× is estimated at 150 packs, with a suggested 188-pack supply; level-150 Palaeoctopus requires at least 25 successful 800-torpor Bio Toxin applications before torpor decay. Neither offers a fake exact duration. Encounter mechanics, source data vintage, release availability and NomadARK overrides remain limits to full validation.
- **NomadARK worked example (Rex):** 1× incubation 4h 59m 59s becomes approximately **12m 0s** at 25×; 1× maturation 3d 20h 35m 33s becomes **11h 34m 27s** at 8×; 1× mating cooldown 18–48 hours becomes **3h 36m – 9h 36m** at 0.2×. These are mathematical estimates from the published baselines, not in-game recordings.

## Current published sources

- [Official community wiki taming data module](https://ark.wiki.gg/wiki/Module:TamingTable/creatures) and [food module](https://ark.wiki.gg/wiki/Module:TamingTable/food). Some values reflect older game releases and have not been independently certified for every ASA creature.
- [Official community wiki heavy knockout values](https://ark.wiki.gg/wiki/Cannon_Ball).
- [ASA breeding baseline provider](https://www.dinoindex.com/breeding) (cites ARK Smart Breeding data).
- [Wiki item/crafting database](https://ark.wiki.gg/wiki/Special:CargoTables/Craftables). Record inclusion does not imply ASA-only availability.
- [Official community wiki server configuration](https://ark.wiki.gg/wiki/Server_configuration) for separate taming, hatch, maturation, imprint and food-consumption multipliers.

## Blockers to an honest 'every detail verified' certification

1. **Server profile:** NomadARK confirms `TamingSpeedMultiplier` 10× on its own site; user-supplied settings add `EggHatchSpeedMultiplier` 25×, `BabyMatureSpeedMultiplier` 8×, `MatingIntervalMultiplier` 0.2×. Still obtain `DinoCharacterFoodDrainMultiplier`, `BabyCuddleIntervalMultiplier`, `BabyImprintAmountMultiplier`, exact Longneck buff semantics and per-species overrides/events. The unconfirmed inputs are not evidence of the server's values.
2. **Game build:** Identify the current ASA patch and all official DLC/map additions included on the target cluster. Source tables have different release coverage.
3. **Source authority:** Obtain current game-data/DevKit or audited recent tables for every missing species, food affinity, special tame behavior, headshot/resistance, and breeding interval. Do not extrapolate a formula where the game uses interactive mechanics.
4. **Ground-truth cases:** Compare multiple species and levels against a current calculator and at least several actual in-game test results; mark each record `reviewed`, `source-only`, `variant-assumed`, or `unsupported`.
5. **Crafting output/restrictions:** Verify every recipe's current ASA ingredient list, output yield and crafting station/alternate behavior before claiming an exhaustive official crafting database.

## Proposed shared-tribe v1.0 deployment (not yet live)

Once the math audit is accepted, keep the existing Windows Tauri app and add a separate authenticated Railway API with a persistent PostgreSQL database. Use invitation-only account creation for five tribe members; each user has a private session and belongs to one shared tribe. Keep tables for users, tribe memberships/roles, scouting records, shared crafting projects, breeding/taming records, timers and audit logs. Store password hashes with Argon2id, require HTTPS, enforce per-tribe authorization on every API query, rate-limit auth, and secure client tokens. Never embed a Discord bot token or database password in the installer.

Before moving local users online, provide a one-time local-data import/merge flow so existing server notes and saved timers are not lost. Test account creation, login/logout, invalid-token handling, cross-account access, persistence across fresh installs, backups and recovery. Publishing requires access to the user's GitHub/Railway projects and their choice of how invitation codes will be issued.
