# ARK Command Center — Private Windows Desktop Preview

An ARK: Survival Ascended companion app built for a small private tribe. This is a source project for a Windows **Tauri 2** application, **not yet a compiled `.exe`**.

## What works now

- Cinematic desktop control center with sidebar and quick-access dashboards.
- Scouting board: add, search, filter, and remove server statuses with notes and map names.
- Raising planner: 34 species with vanilla breeding baselines, scaled to your 10× maturation/hatching profile. Start a local countdown for hatching or adulthood. In particular, added many mammals and popular egg-laying species. Data source: community wiki breeding tables; special mods and ASA version changes can differ.
- Taming Lab: automatic knockout-tame food quantities and estimated feeding duration for **Rex, Argentavis, and Allosaurus**, using species-specific affinity/food-drain profiles sourced from the ARK Official Community Wiki. Choose a supported food, wild level, and custom rates; start a countdown from the computed estimate.
- The creature dropdown still has 100+ species. Creatures without audited knockout profiles explicitly require a manually verified time; the app will not invent a result. Every species links to Dododex for cross-checking.
- Spawn map launcher for supported official maps.
- Resource Atlas tab: choose a resource and map, then open the real interactive Wikily resource map or the official wiki alternative. The old embedded iframe and unsupported query-string filters were removed. Enable your selected resource layer on the provider's website.
- Knockout ammo planner: Rex, Argentavis and Allosaurus have level-scaled torpor and estimates for bow, crossbow and compound-bow tranq arrows, tranq darts and shocking darts. Weapon damage percentage is adjustable. Verified 1.5× headshot bonus is displayed for Rex and Allosaurus; Argentavis correctly does not use its obsolete pre-TLC headshot bonus.
- Maps page includes a creature dropdown and an embedded community-wiki spawn-map preview, with a direct external map link as fallback. Embedded display depends on whether the wiki allows framing; it may not load in every installation. The map displays *possible spawn areas*, not guaranteed live positions.
- Live countdown list with completion status while the app is open.
- Rate settings default to 10× taming, hatching and maturation; 0.1× mating/cuddle intervals; 1× food drain.
- Local persistence between app sessions using WebView local storage.

## Important limitations

- **Not shared yet:** Every Windows installation keeps its own scouting records and timers. The current Railway Discord bot is a separate system; this desktop preview does not connect to its database.
- **No background alerts:** Timers display completion in the app when opened, but do not send Windows or Discord notifications while the application is closed.
- **Taming and knockout models are limited:** Only three knockout species currently have audited built-in data. Their results use the community wiki's vanilla model (including its 4× taming baseline). Knockout ammo estimates assume every shot lands and full torpor-over-time is delivered; live torpor depletion and target health/survival are not modeled. Values may differ for ASA revisions, server overrides, mods, feeding delays or special mechanics. Treat calculations as estimates and verify before expensive tames. No Dododex scraping or unsupported API is used.
- **Limited baby species:** 34 baseline entries. The wiki's 1× values may differ with patches, traits, events, or mods. Some special gestation/hatching mechanics are not modeled.
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

Run `npm test` to verify food selection, level/rate scaling, torpor totals, weapon damage scaling, headshot support, and unsupported creature handling. The formulas and their data references are documented in `src/taming-engine.js` and `src/knockout-engine.js`.

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
