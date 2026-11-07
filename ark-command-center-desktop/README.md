# ARK Command Center — Windows Tribe Live Edition

An ARK: Survival Ascended companion app built for a small private tribe. The **Tauri 2** Windows installer is distributed from GitHub Releases; version 0.8 connects to a private PostgreSQL-backed Railway API.

## Tribe Live v0.8

- Up to six invite-only accounts with personal cloud saves for themes, rate settings, and individual crafting projects.
- **Tribe Live Timers** are stored as shared database rows, with server-calculated end times. Any signed-in member can create and remove them; everyone sees changes through authenticated server-sent events (SSE) with a 12-second polling fallback.
- **Tribe Crafting** is a separate tab from the personal calculator. Adding, setting, removing, or clearing an item changes a single shared queue for all six members. Additions are atomic to avoid lost increments. Dependency trees are at the top, resource totals follow, and tribe queue controls are below.
- **Server Intel** uses shared, individually updatable database records with duplicate name protection. A one-time server migration imports the old cloud snapshot; users can optionally import additional unsynced local records.
- Older, local-only timers can be imported once into the new shared timer board at the member's request. They are not exposed automatically or deleted from local backup.
- Shared functionality requires sign-in and connectivity. If live SSE disconnects, the app refreshes every 12 seconds; while offline, shared writes are not queued or silently lost.

## What works now

- Cinematic desktop control center with sidebar and quick-access dashboards.
- Scouting board: add, search, filter, and remove server statuses with notes and map names.
- Raising planner: **156 ASA breeding-reference base species plus 64 documented variant forms (220 selectable entries)**. The imported, versioned DinoIndex/ARK Smart Breeding ASA dataset provides *per-creature* vanilla 1× maturation, egg incubation **or** gestation, and mating cooldown ranges for all 220 entries; NomadARK's supplied **8× maturation, 25× hatch/birth, 0.2× mating interval** rates are applied. Individual unusual reproduction mechanics can still need special handling; imprint/cuddle interval remains unconfirmed.
- Taming species catalog: **279 selectable official-reference creatures and documented variants**, with search. The comparison baseline is Dododex's ASA category (215 listed, including one explicitly [MOD] entry excluded here): all 214 non-mod reference names are included, plus Ferox from the separate ASA breeding source and 64 documented shared-timing variant forms. A catalog entry is not a promise that a creature is tamable or has an audited calculator profile.
- Three separate taming tabs with mutually exclusive lists: **Taming Lab** for 133 conventional knockout entries (including forms); **Specialty Taming Lab** for 72 special/interaction entries; and **Passive Taming Lab** for 39 nonviolent entries. Another 35 catalog selections are classified as untameable. Cerberax is categorized as a multi-stage special trial, not an ordinary knockout. These are category counts, not fully audited taming profiles.
- Specialty Taming Lab calculates **Karkinos** boulders/cannonballs, **Rock Elemental** cannonballs, and **Titanosaur** boulders/cannonballs from wiki-sourced heavy-projectile torpor at the selected wild level. For example, level-150 Karkinos theoretically needs **16 boulders or 1 cannonball**, with body hits required. The app shows compatible feeding options and 10× counts for Karkinos, Rock Elemental, Basilisk eggs, Titanoboa eggs, Roll Rat honey, and Gacha offerings where published data exists. Egg theft, pheromones, special encounters and other taming interactions are listed without inventing unverified requirements.
- **v0.6.5 specialty-method review:** All 72 specialty selections now resolve to source-linked, creature-specific procedures, including inherited variants: **69 documented interaction entries, two announced/unreleased species (Enigmasaur and Xeranox), and one ordinary-tame-unavailable event creature (DodoRex)**. Bloodstalker now shows a published level-based Blood Pack supply estimate adjusted for 10× NomadARK taming, plus a 25% reserve; level 150 gives a **150-pack reference with 188 packs to bring**, not a guaranteed exact count. Palaeoctopus now shows the **minimum** Bio Toxin bite interactions from its published torpor (25 at level 150), with post-knockout food clearly separated. Cosmo offers both Chitin and Plant Species Z Seeds. Fish-basket catches and one-egg/seed hatches display a fixed one-item minimum. Other special interactions show the required items and instructions but never fabricate an exact level-only quantity.
- Passive Taming Lab includes creature-specific food options and estimates based on published wiki affinity/food tables where possible; actual feed prompts may substantially change timing. Ovis remains one Sweet Vegetable Cake, regardless of level. Interactive/pet/request tames continue to require manually verified timers.
- Crafting Calculator: choose an item, enter any finished quantity, add it to a persistent tribe-planning queue, and see an expandable prerequisite crafting tree **above** the tribe queue and combined raw totals. It properly handles reviewed batch yields (e.g., Sparkpowder or Simple Rifle Ammo) and consolidates materials across different projects.
- Crafting now includes **1,143 entries from the ARK Official Community Wiki Craftables table**, of which **22 starter recipes** were independently reviewed. Obvious Primitive Plus and mobile-only entries were excluded. Because the wiki covers multiple ARK editions, the remaining entries require individual current-ASA availability and output-yield verification. An optional, third-party community catalog adds mixed game/mod candidates. Custom recipes can be saved locally or imported from JSON.
- Ten full-surface themes: Original Emerald, Black & Red, Deep Purple & Black, Ember Orange, Neon Pink, Royal Gold, Sapphire Blue, Cyber Cyan, Radioactive Lime, and Frost Silver. Backdrops, sidebar, panels, text, inputs, map controls and accents recolor together; the choice persists locally.
- Settings includes a searchable per-creature audit listing taming-method categories, knockout/food data, passive/special methods, untameable creatures, maturation, and hatch/gestation validation flags. Methods are classified against Dododex's ASA knockout/passive/non-tamable filters, with variant inheritance clearly identified.
- Taming Lab: automatic food quantities and approximate duration for **122 of the 133 displayed conventional knockout species/forms**. The underlying profile registry has 124 entries, including some now separated into special/passive tabs. Fourteen original species were individually modeled; the rest rely on older published wiki source values or inherited parent-species values. Each lab filters its species dropdown to the relevant taming method.
- Spawn map launcher for supported official maps.
- Resource Atlas tab: choose a resource and map, then use a **native Windows browser opener** to display the actual Wikily resource map or the official wiki alternative. The old embedded iframe and unsupported query-string filters were removed. A copyable URL remains visible if a site fails. Enable your selected resource layer on the provider's website.
- Knockout ammo planner: **138 published category-supported creature/form profiles** provide level-scaled torpor and conventional tranq estimates. Specialized tames are excluded even when a manual torpor override is entered. Estimates still assume full torpor-over-time, minimal torpor decay and correct hit multipliers; only a subset are individually reviewed.
- Maps page includes a creature dropdown and an embedded community-wiki spawn-map preview, with a direct external map link as fallback. Embedded display depends on whether the wiki allows framing; it may not load in every installation. The map displays *possible spawn areas*, not guaranteed live positions.
- Live countdown list with completion status while the app is open.
- **NomadARK.net rate profile (user-provided server settings, November 6, 2026):** 10× taming, 10× harvest, 10× XP, 5× crops, **8× maturation, 25× egg hatch, 0.2× mating interval**. Imprint interval is unconfirmed (0.1× remains a local working assumption). Server rules include 6-person tribe limit, 500 tame cap, 100-turret cap, 354% weapon cap, 2,000 item stacks, and a 300% Longneck buff. Player food drain 0.5× is recorded but **is not treated as creature food drain** (still unverified 1× assumption). Older saved default presets automatically migrate; custom rate settings are preserved until the player clicks Apply Confirmed Rates. The owner's website independently confirms the 10× taming/harvesting settings.
- Local persistence between app sessions using WebView local storage.

## Important limitations

- **Not shared yet:** Every Windows installation keeps its own scouting records and timers. The current Railway Discord bot is a separate system; this desktop preview does not connect to its database.
- **No background alerts:** Timers display completion in the app when opened, but do not send Windows or Discord notifications while the application is closed.
- **Published baseline versus ASA:** The imported `Module:TamingTable/creatures` and `Module:TamingTable/food` data covers 110 wiki species and 23 base food types; this module may predate changes introduced in ARK: Survival Ascended. The 123 accessible conventional food profiles include variant inheritance. Species not covered, and most item quantities for unusual taming mechanics, are **not** automatically calculated. Heavy-projectile figures are theoretical minimum successful hits, not promised quantities, and do not include misses, torpor decay or unintended damage. Confirm on your unofficial cluster before spending expensive resources. Passive times are theoretical hunger-based estimates, not verified intervals.
- **Specialty method versus exact item count:** The review identifies which species needs which special interaction; it is not 72 independent in-game taming experiments. A verified wiki procedure does **not** imply a verified numerical supply formula. Desmodus Blood Packs, Ferox transformation-dependent Element consumption, Carcharodontosaurus sacrifices, Dreadmare trials and other minigames can depend on mechanics that cannot be inferred from wild level and the server taming multiplier alone. Some listed creatures are unreleased or unavailable as regular tames. The Bloodstalker reserve is a planning allowance, not a guarantee; Palaeoctopus's theoretical minimum excludes torpor decay, timing mistakes and its post-knockout food.
- **Embedded maps are provider-dependent:** Resource Atlas and Spawn Navigator attempt to embed external interactive maps in the application and allow reload, source switching, larger default canvas, an app-filling Large Map mode, and full external opening. Third-party maps may refuse iframe embedding; a working interactive map is **not guaranteed** inside the desktop WebView. Resource and creature selections in the app are reference labels, not guaranteed direct provider filters. Use the provider's own filter controls.
- **Breeding-source coverage is not universal game verification:** All 220 entries now have separate incubation or gestation and maturation values imported from a versioned ASA reference, but that reference is a *156-species breedable roster*, not every creature or interaction in the game. Special mechanics (e.g., Rhyniognatha host impregnation, unusual reproduction, creature-specific event boosts) still need a dedicated model, and non-breedable catalog entries intentionally lack timers.
- **Cluster settings still missing:** The user-supplied NomadARK rules provide hatch, maturation, and mating settings, but **not** `BabyCuddleIntervalMultiplier`, `BabyImprintAmountMultiplier`, `DinoCharacterFoodDrainMultiplier`, per-species overrides or exact in-game interpretation of the Longneck "300% buff". The app assumes a separate 3× Longneck modifier on darts only, allows editing the value, and warns against double-counting blueprint damage. Ask [NomadARK Discord](https://discord.gg/nomadark) to resolve remaining fields. Its exclusive Nomad Jungle is separately advertised as 15×; this tool is focused on official maps.
- **Crafting coverage:** 1,143 wiki-based records (22 separately reviewed), optional third-party candidates. This is NOT proof of a fully verified official ASA-only craftable catalog; some wiki entries can be ASE-only and some crafting yields are not stored in the wiki Cargo table. Unreviewed wiki entries currently assume one unit per batch. Crafting stations (e.g. Chemistry Bench) may have different efficiencies and output batches; alternate resource substitutions and fuel costs are not modeled.
- Tauri and dependencies require local setup; the installer has not been tested in a Windows environment yet.

## Run on Windows

1. Install [Node.js LTS](https://nodejs.org/), [Rust](https://rustup.rs/), Microsoft C++ Build Tools, and the WebView2 runtime (usually present on Windows 11). See the [official Tauri prerequisites](https://tauri.app/start/prerequisites/).
2. Extract this folder.
3. Open PowerShell inside `ark-command-center-desktop` and run `npm install`.
4. To preview the interface in a browser, run `npm run dev` and open `http://127.0.0.1:1420`.
5. To launch as a desktop application, run `npm run desktop`.
6. To package a Windows installer, run `npm run installer`. Build output is in `src-tauri/target/release/bundle/` when successful.

## Build a Windows EXE automatically on GitHub

The included `.github/workflows/build-windows.yml` uses a Windows runner to compile the project, so you don't need Rust or Visual Studio installed on your own PC:

1. Create a private GitHub repository and upload **the contents** of this folder, including the `.github` folder, to its repository root.
2. Open your GitHub repository → **Actions** → **Build Windows Installer** → **Run workflow**.
3. Wait for the workflow to complete. Open its run page and download the `ARK-Command-Center-Windows-Installer` artifact.
4. Extract that artifact ZIP; it contains the built Windows installer `.exe` if compilation succeeds.

The executable produced by this workflow is unsigned. Windows SmartScreen or Smart App Control can warn about or block unsigned apps. Never instruct users to disable Windows security controls just to install a private build. For wider distribution, add trusted code signing.

## Taming calculation tests

Run `npm test` to verify the three roster partitions, special heavy ammo counts, food selection, level/rate scaling, torpor totals, weapon damage scaling, headshot support, and unsupported creature handling. The imported official community wiki Lua tables are converted through `scripts/build-taming-data.cjs`; the formulas are in `src/taming-engine.js`, `src/specialty-engine.js` and `src/knockout-engine.js`.

The expanded cross-species audit also checks **every available conventional food choice** at multiple wild levels and multiplier settings, all published specialty food choices, all passive method entries, all breeding baselines, and all crafting-tree roots at quantities 1 and 1,000. See [`docs/CALCULATION_AUDIT.md`](docs/CALCULATION_AUDIT.md) for exact coverage, remaining unsupported cases, the vegetable-name bug fixed in v0.6.1, and the proposed shared-account launch architecture. Passing these checks does **not** mean every current ASA species or unofficial cluster rate is verified in-game.

The crafting tests additionally verify nested components, 1-vs-1000 wood roofing, quantity aggregation, batch rounding, and cycle detection.

### Rechecking ASA breeding source data

The reproducible numerical snapshot in `src/asa-breeding-source.json` records its source, review date, dataset version and ASA source version. It is generated from the publicly available DinoIndex breeding page (which attributes its data to ARK Smart Breeding) using `scripts/import-asa-breeding.cjs`. To review a later source revision, download that page into a local `.html` file, run `node scripts/import-asa-breeding.cjs path/to/page.html`, and run `npm test`. The tests verify all **156 base records and 64 variant names**, their per-creature hatch/gestation, maturation and cooldown baselines, and published ARK wiki examples.

Source-checked means the app reflects the referenced database accurately; it does **not** certify that every figure has been measured on NomadARK after each ASA patch or server event. Breedable creatures absent from that source are not silently filled with fabricated timers.

## Adding large recipe catalogs

The Crafting Calculator has an **Import JSON Recipe Catalog** control. Its file format is a keyed JSON object:

```json
{
  "Example Item": {
    "category": "Structures",
    "station": "Smithy",
    "output": 1,
    "ingredients": {"Wood": 60, "Thatch": 15, "Fiber": 10}
  }
}
```

Ingredient names that exactly match another recipe become expandable crafted components. Other ingredient names are treated as raw materials. Imported entries are validated for positive integer quantities and dependency cycles. Use an ASA-only data export, not a generic ASE/mod list, and check values before importing.

## Future multiplayer connection

Build an authenticated Railway API separate from the bot's SQLite file, with per-user authorization and a central PostgreSQL database. Both the Discord bot and desktop app should use this API rather than exposing database files or bot tokens. Add server-side timers, notification jobs, audit logs, and synchronization. Do not put Discord bot secrets inside the desktop application.

## Source references

- [NomadARK owner-published rates](https://nomadark.net/) — 10× taming, harvesting, and XP progression section; breeding/hunger details unpublished; XP FAQ conflict.
- [NomadARK cluster listing](https://arkwipe.com/asa-clusters/nomadark-net-3b6893) — lists generic boosted breeding but no individual Game.ini fields; not treated as authoritative.
- [Other community-managed cluster listing](https://ark.fusey.gg/ark-survival-ascended/clusters/fie1714bj4t87) — lists 1× breeding controls, conflicting with the above; not treated as authoritative.
- [ARK official community wiki breeding data](https://ark.wiki.gg/wiki/Breeding)
- [ARK official community wiki spawn maps](https://ark.wiki.gg/wiki/Data_maps)
- [Dododex taming calculator](https://www.dododex.com/)
- [Wiki taming formula](https://ark.wiki.gg/wiki/Module:TamingTable)
- [Wiki creature affinity values](https://ark.wiki.gg/wiki/Module:TamingTable/creatures)
- [Wiki food affinity values](https://ark.wiki.gg/wiki/Module:TamingTable/food)
- [Wiki ammunition comparison table](https://ark.wiki.gg/wiki/Tranquilizer_Comparison_Table)
- [DinoIndex ASA raising roster](https://www.dinoindex.com/breeding)
- [Dododex ASA creature-category comparison](https://www.dododex.com/dinosaurs/ark-survival-ascended)

## Coverage comparison in Settings

The app's Settings page includes a live coverage table: **214 of 214 names from the published unmodded Dododex ASA category**, one extra Ferox entry, and **64 documented variant names**. That is **279 selections**. The three lab dropdowns now contain **133 conventional, 72 specialty, and 39 passive**, with **35 untameable** excluded. **138 species/form torpor profiles** hold ordinary tranq data (not all belong in the conventional tab), **124 species/form food profiles** use published or inherited food values, and **3 heavy knockout species** have specialized heavy projectile values. The breeding lab has **156 source-reviewed base entries plus 64 timed variants**, each with a recorded incubation/gestation baseline and mating cooldown. These are different confidence levels, not exhaustive in-game validation. The source list can lag new DLCs and variants.
