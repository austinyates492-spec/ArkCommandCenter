# ARK Command Center — Private Windows Desktop Preview

An ARK: Survival Ascended companion app built for a small private tribe. This is a source project for a Windows **Tauri 2** application, **not yet a compiled `.exe`**.

## What works now

- Cinematic desktop control center with sidebar and quick-access dashboards.
- Scouting board: add, search, filter, and remove server statuses with notes and map names.
- Raising planner: **155 named ASA base species plus 63 documented shared-timing variants (218 selectable entries)** with vanilla 1× maturation durations, scaled to your configured 10× maturation profile. This uses the DinoIndex ASA raising roster (which cites ARK Smart Breeding data). Incubation/gestation is displayed only for the smaller subset with separately recorded values; unknown values are labeled "Not verified" instead of inventing a timer.
- Taming species catalog: **278 selectable official-reference creatures and documented variants**, with search. The comparison baseline is Dododex's ASA category (215 listed, including one explicitly [MOD] entry excluded here): all 214 non-mod reference names are included, plus Ferox from the separate ASA breeding source and 63 documented shared-timing variant forms. A catalog entry is not a promise that a creature is tamable or has an audited calculator profile.
- Three separate taming tabs with mutually exclusive lists: **Taming Lab** for 133 conventional knockout entries (including forms); **Specialty Taming Lab** for 71 special/interaction entries; and **Passive Taming Lab** for 39 nonviolent entries. Another 35 catalog selections are classified as untameable. These are category counts, not fully audited taming profiles.
- Specialty Taming Lab calculates **Karkinos** boulders/cannonballs, **Rock Elemental** cannonballs, and **Titanosaur** boulders/cannonballs from wiki-sourced heavy-projectile torpor at the selected wild level. For example, level-150 Karkinos theoretically needs **16 boulders or 1 cannonball**, with body hits required. The app shows compatible feeding options and 10× counts for Karkinos, Rock Elemental, Basilisk eggs, Titanoboa eggs, Roll Rat honey, and Gacha offerings where published data exists. Egg theft, pheromones, special encounters and other taming interactions are listed without inventing unverified requirements.
- Passive Taming Lab includes creature-specific food options and estimates based on published wiki affinity/food tables where possible; actual feed prompts may substantially change timing. Ovis remains one Sweet Vegetable Cake, regardless of level. Interactive/pet/request tames continue to require manually verified timers.
- Crafting Calculator: choose an item, enter any finished quantity, add it to a persistent tribe-planning queue, and see an expandable prerequisite crafting tree **above** the tribe queue and combined raw totals. It properly handles reviewed batch yields (e.g., Sparkpowder or Simple Rifle Ammo) and consolidates materials across different projects.
- Crafting now includes **1,143 entries from the ARK Official Community Wiki Craftables table**, of which **22 starter recipes** were independently reviewed. Obvious Primitive Plus and mobile-only entries were excluded. Because the wiki covers multiple ARK editions, the remaining entries require individual current-ASA availability and output-yield verification. An optional, third-party community catalog adds mixed game/mod candidates. Custom recipes can be saved locally or imported from JSON.
- Ten full-surface themes: Original Emerald, Black & Red, Deep Purple & Black, Ember Orange, Neon Pink, Royal Gold, Sapphire Blue, Cyber Cyan, Radioactive Lime, and Frost Silver. Backdrops, sidebar, panels, text, inputs, map controls and accents recolor together; the choice persists locally.
- Settings includes a searchable per-creature audit listing taming-method categories, knockout/food data, passive/special methods, untameable creatures, maturation, and hatch/gestation validation flags. Methods are classified against Dododex's ASA knockout/passive/non-tamable filters, with variant inheritance clearly identified.
- Taming Lab: automatic food quantities and approximate duration for **121 of the 133 displayed conventional knockout species/forms**. The underlying profile registry has 123 entries, including some now separated into special/passive tabs. Fourteen original species were individually modeled; the rest rely on older published wiki source values or inherited parent-species values. Each lab filters its species dropdown to the relevant taming method.
- Spawn map launcher for supported official maps.
- Resource Atlas tab: choose a resource and map, then use a **native Windows browser opener** to display the actual Wikily resource map or the official wiki alternative. The old embedded iframe and unsupported query-string filters were removed. A copyable URL remains visible if a site fails. Enable your selected resource layer on the provider's website.
- Knockout ammo planner: **137 published category-supported creature/form profiles** provide level-scaled torpor and conventional tranq estimates. Specialized tames are excluded even when a manual torpor override is entered. Estimates still assume full torpor-over-time, minimal torpor decay and correct hit multipliers; only a subset are individually reviewed.
- Maps page includes a creature dropdown and an embedded community-wiki spawn-map preview, with a direct external map link as fallback. Embedded display depends on whether the wiki allows framing; it may not load in every installation. The map displays *possible spawn areas*, not guaranteed live positions.
- Live countdown list with completion status while the app is open.
- Rate settings default to 10× taming, hatching and maturation; 0.1× mating/cuddle intervals; 1× food drain.
- Local persistence between app sessions using WebView local storage.

## Important limitations

- **Not shared yet:** Every Windows installation keeps its own scouting records and timers. The current Railway Discord bot is a separate system; this desktop preview does not connect to its database.
- **No background alerts:** Timers display completion in the app when opened, but do not send Windows or Discord notifications while the application is closed.
- **Published baseline versus ASA:** The imported `Module:TamingTable/creatures` and `Module:TamingTable/food` data covers 110 wiki species and 23 base food types; this module may predate changes introduced in ARK: Survival Ascended. The 123 accessible conventional food profiles include variant inheritance. Species not covered, and most item quantities for unusual taming mechanics, are **not** automatically calculated. Heavy-projectile figures are theoretical minimum successful hits, not promised quantities, and do not include misses, torpor decay or unintended damage. Confirm on your unofficial cluster before spending expensive resources. Passive times are theoretical hunger-based estimates, not verified intervals.
- **Embedded maps are provider-dependent:** Resource Atlas and Spawn Navigator attempt to embed external interactive maps in the application and allow reload, source switching, larger default canvas, an app-filling Large Map mode, and full external opening. Third-party maps may refuse iframe embedding; a working interactive map is **not guaranteed** inside the desktop WebView. Resource and creature selections in the app are reference labels, not guaranteed direct provider filters. Use the provider's own filter controls.
- **Partial hatch/gestation coverage:** The 155 base species and 63 variants provide maturation data, but only the original subset has independent hatch or gestation values. No unverified countdown is displayed. Some unusual raising mechanics (e.g., host pregnancy) require a dedicated model.
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

The crafting tests additionally verify nested components, 1-vs-1000 wood roofing, quantity aggregation, batch rounding, and cycle detection.

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

The app's Settings page includes a live coverage table: **214 of 214 names from the published unmodded Dododex ASA category**, one extra Ferox entry, and **63 documented variant names**. That is **278 selections**. The three lab dropdowns now contain **133 conventional, 71 specialty, and 39 passive**, with **35 untameable** excluded. **137 species/form torpor profiles** hold ordinary tranq data (not all belong in the conventional tab), **123 species/form food profiles** use published or inherited food values, and **3 heavy knockout species** have specialized heavy projectile values. These are different confidence levels, not exhaustive in-game validation. The source list can lag new DLCs and variants.
