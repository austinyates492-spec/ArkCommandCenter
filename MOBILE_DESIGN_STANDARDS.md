# Mobile-first design standard — ARK Tribe HQ

Every new or redesigned UI must be reviewed at **375px, 390px, 430px, 768px**, as well as desktop. Do not treat responsive support as a post-release add-on.

## Acceptance checklist

1. **Navigation:** At phone widths, the sidebar is an accessible hamburger drawer; it closes on selection, backdrop tap and Escape. The page remains navigable with keyboard and screen readers. The content behind the drawer does not scroll while open.
2. **Themes:** Use existing `--ark-*` / `--personality-*` variables. Don't hard-code purple, green or orange for theme UI. Meaningful status colors are allowed when universally consistent (green = available, amber = contested, red = locked).
3. **Sizing and layout:** Use `minmax(0,1fr)` for flexible columns and `min-width:0` for grid children. At 430px and below, the core content panels stack; dashboards can retain compact 2-column counters if readable.
4. **Controls:** Aim for at least 44 × 44 CSS pixels for touch buttons. Form fields use at least 16px text on phones to avoid browser zoom on focus. Provide visible focus outlines and accessible names.
5. **Viewport:** No page-wide horizontal scrolling at 375px. Long tables, maps or deeply nested dependencies can scroll inside a labeled bounded region. Handle safe-area insets at screen edges.
6. **Information density:** Summary metrics are compact; put long crafting trees, scouting notes and advanced controls behind clear expanders when appropriate. Never hide critical data or introduce fake calculations.
7. **Theme and motion:** Test with different themes and reduced-motion preferences. Avoid animations that prevent button interaction.
8. **Persistence:** Reuse existing cloud data APIs; mobile UI must not invent local-only behavior for features that claim to be shared. Document any limitations explicitly.
9. **Regression:** Add or update tests for breakpoints, functionality, keyboard interactions and styling whenever a page changes. Verify the production frontend and API deployments after merging.
10. **Visual QA:** Review representative 375px, 390px and 430px screenshots (or a real browser at those widths) before treating a visual redesign as fully phone-verified.

This is the default UI design acceptance standard for all future pages: Overview, Taming, Breeding, Timers, Crafting, Tribe Crafting, Server Intel, Resource Atlas, Spawn Maps, Account and Settings.
