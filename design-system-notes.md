# PBGC Design System — notes for the 436 generator

Source: ErChulo/pbgc-design-system (public), read 2026-11-11.
Do NOT change the design system. These notes are a read-only summary for the 436 app.
Spec file is `design.md` at the repo root (there is no `docs/` folder; no `docs/DESIGN.md`).
Single source of truth: `tokens/tokens.json`. `tokens.css` and `contrast-report.md` are generated from it.

## Version and status

- **Version: 1.1.0** (2026-11-07, `package.json` + `CHANGELOG.md`).
- **Status: DRAFT for COLA and Section 508 review. NOT approved.**
- **No newer version exists.** No git tags, no releases. Latest commit `84a7149` ("Add Badge, Accordion, SearchBar, and Footer") is after the 1.1.0 commit and adds components only — `git diff` on `tokens/` is empty, so tokens are unchanged. Use v1.1.0.
- v1.0.0 is superseded (missing color tokens, non-brand blue and fonts, drawn substitute logo, untested accessibility claims).
- Verified: 59 color-pair contrast checks pass (computed); axe-core 0 violations on 49 stories x 2 themes; reference page passes at 1200px and 375px, 0 external requests.
- NOT verified: keyboard and screen-reader testing (NVDA, JAWS, VoiceOver) — not done; Windows High Contrast visual check — not done; logo variant mapping — not confirmed; COLA / Section 508 review — not done.
- Known gaps (CRITIQUE.md "What v1.1.0 does NOT solve"): automated tests catch only part of accessibility; logo files not bundled; several values are derived, not sourced; style guide contradicts itself on blue/red HEX vs RGB; Garamond set from print spec with no design review; no real PBGC page built with this yet.

## Tokens

### Brand palette (style guide)

| Token | HEX | Use |
|---|---|---|
| `brand.blue` | `#002D72` | Primary. Headers, primary actions, links. Pantone 288 C. |
| `brand.red` | `#E4002B` | Accent only. Rules, highlights. Never an error state. |

### Secondary palette

| Token | HEX | Text use |
|---|---|---|
| Medium Blue | `#004B8D` | Text and UI (8.78:1 vs white) |
| Medium Green | `#008065` | Text and UI (4.91:1) |
| PBGC Red | `#E4002B` | Text on white only (4.85:1; fails on `#F2F2F2`) |
| Support Gray 1 | `#58585B` | Text and UI (7.09:1) |
| Gray 425 | `#81807F` | UI boundaries and icons, not text (3.94:1) |
| Support Blue 3 | `#4A7DBA` | UI and large text only (4.26:1) |
| Light Blue Gray | `#6E93C2` | UI and large graphics only (3.17:1) |
| Teal | `#00A9A1` | Decorative only (2.92:1) |
| Light Green | `#88B672` | Decorative only (2.34:1) |

Support tints/shades: teal-1 `#4DC3BD`, teal-2 `#B3E5E3`, teal-3 `#D9F2F1`, green-1 `#4DA693`, green-2 `#B8D3A7`, green-3 `#DBE7D1`, blue-1 `#BEC6DF`, blue-2 `#8B9FC7`, blue-3 `#4A7DBA`, gray-1 `#58585B`, gray-2 `#D2D2D2`, gray-3 `#E0E0E0`, gray-4 `#F2F2F2`.

### Derived values (pass contrast, NOT PBGC-approved — OPEN-QUESTIONS.md Q5)

White `#FFFFFF`, ink `#1A1A1A` (body text), error `#B3001B` (deliberately darker than brand red so accent and failure are never confused), error-tint `#FDECEF`, warning `#8A5700`, warning-tint `#FFF4D6`, info-tint `#EAF0F8`, success-tint `#E6F2EF`, night-0 `#0B1B36`, night-1 `#12294D`, night-2 `#1B3866`.

### Light theme semantic tokens (what components use — never raw palette values)

- Surface: `bg-page` `#FFFFFF`, `bg-subtle` `#F2F2F2`, `bg-inverse` `#002D72`
- Text: `text-default` `#1A1A1A`, `text-muted` `#58585B`, `text-inverse` `#FFFFFF`, `text-link` `#002D72`, `text-link-hover` `#004B8D`
- Border: `border-input` `#81807F` (3.94:1, meets WCAG 1.4.11), `border-decorative` `#D2D2D2` (not for controls), `border-accent` `#E4002B`
- Action: primary bg `#002D72` fg `#FFFFFF`, hover `#004B8D`; secondary bg `#FFFFFF` fg `#002D72` border `#002D72`, hover `#F2F2F2`; danger bg `#B3001B` fg `#FFFFFF`, hover `#8F0016`
- Focus: `focus-ring` `#004B8D`, `focus-ring-on-inverse` `#FFFFFF`
- Status: info bg `#EAF0F8` accent `#004B8D`; success bg `#E6F2EF` accent `#008065`; warning bg `#FFF4D6` accent `#8A5700`; error bg `#FDECEF` accent `#B3001B`

### Dark theme: PROVISIONAL — do not ship without COLA approval (Q6)

- Style guide defines no dark theme. Provided via `data-theme="dark"` or `prefers-color-scheme: dark`.
- Page bg `night-0` `#0B1B36`, subtle `night-1` `#12294D`, text `#F2F2F2`, link `#BEC6DF`, primary bg `#BEC6DF` fg `#002D72`.
- PBGC Blue cannot be foreground on dark surfaces (1.38:1); dark theme uses supporting blues instead.
- **Header stays PBGC Blue in both themes.**
- DEL precedent (user decision, 2026-11-11): dark page background `#000`, overriding provisional `night-0`. Flag for the user whether 436 follows the system value or the DEL decision.

### Type

- Sans (UI/body): `"Helvetica Neue", Arial, sans-serif`. Serif (long-form): `Garamond, "Adobe Garamond Pro", "Times New Roman", serif`. Mono: `Consolas, "Courier New", monospace`.
- **No web fonts.** System fonts only; nothing is downloaded.
- Weights 400 and 700 only (Arial has no 600; browsers would fake it). No negative letter-spacing.
- Sizes: H1 2.25rem (36px), H2 1.75rem (28px), H3 1.375rem (22px), Lead 1.125rem (18px), Body 1rem (16px), Small 0.875rem (14px), serif long-form 1.25rem (20px). Line height 1.25 headings, 1.5 body.
- Prose line length capped at 60ch. Minimum body size 10 pt (~13.3px); nothing below 14px carries content.
- Numbers in tables and forms: tabular figures (`font-variant-numeric: tabular-nums`), right-aligned.

### Spacing, radii, layout, motion

- Spacing (8-point grid): `--pbgc-space-1` 0.5rem, `-2` 1rem, `-3` 1.5rem, `-4` 2rem, `-6` 3rem, `-8` 4rem.
- Radius: 4px. Touch/click targets: at least 44 x 44px (`--pbgc-target-min`). No "small" button. (WCAG 2.2 AA needs 24px; 44px is the stricter house standard.)
- Breakpoints: mobile < 640px, tablet 640–1023px, desktop 1024–1439px, wide 1440px+. Content container max 1400px.
- Motion: CSS transitions only, 150 ms state changes, 250 ms elevation. `prefers-reduced-motion: reduce` collapses durations to 0.01 ms at the token level. No autoplay, parallax, or looping animation.
- Reflow: works at 320px wide and 400% zoom without horizontal scrolling (data tables scroll inside a labelled region).

## Component rules (single-file HTML app)

Components are plain CSS in `src/styles/components.css` (257 lines, tokens only, no framework). Copy the needed rules into the single HTML file. Class prefix `.pbgc-*`. The single-file reference page `reference/pbgc-design-system-reference.html` (zero dependencies, opens from disk) is the pattern for an offline single-file app.

### Header / nav (`HeaderNav`)

- Slim blue header (`background: var(--pbgc-bg-inverse)`), white logo on blue, compact title.
- Skip link first. Nav items are links, not buttons. Current page: `aria-current="page"` + 4px red bar under the link (inset box-shadow; in forced-colors mode, a 4px `LinkText` bottom border instead).
- Disclosure menu with Escape + focus return. Nav collapses below 1024px; toggle button hidden at desktop.
- Header bar: max-width 1400px, centered, padding 0.5rem 1rem, flex with gap 1rem.
- DEL precedent: 640px breakpoint was used there (two links fit on a tablet); the system says 1024px. Follow the system unless the user says otherwise.

### Logo

- Official artwork only; labelled placeholder if a file is missing; never draw a substitute.
- Files: `fc` (full color), `bw`, `wt` (white, for dark and blue surfaces). Web header: horizontal logo with agency name.
- On PBGC Blue: use the white (`wt`) artwork. Minimum width 60px (component clamps). Clear space: width of the "P" in the logo; default 0.5rem padding until measured (Q4).
- Alt text: "Pension Benefit Guaranty Corporation". When the logo is the home link: "PBGC home".
- Never outline, rearrange, recolor, distort, or redraw. PNG for web (transparent). Do not convert EPS masters to SVG without approval.
- Logo files are NOT bundled in the repo (`assets/logos/MANIFEST.md`); copy official PNGs in. Variant-to-filename mapping is inferred and needs a visual check (Q8). `logo-negro.png` is excluded — provenance unconfirmed (Q9). External use needs COLA approval (Q10).

### Buttons

- Real `<button>` or `<a>`. Min 44 x 44px. Bold (700), 2px border, 4px radius, padding 0.625rem 1.5rem.
- Primary: blue bg, white text, hover medium blue. Secondary: white bg, blue text and border, hover `#F2F2F2`. Danger: `#B3001B` bg, white text.
- Disabled: opacity 0.55 + line-through text — not conveyed by opacity/color alone.

### Form inputs (`TextField`, `Select`, `ChoiceGroup`)

- Visible bold label; hint and error both in `aria-describedby`; "(required)" in words, not a red asterisk.
- Input: 2px solid `#81807F` border, 4px radius, min-height 44px, padding 0.5rem 0.75rem, full width, max-width 32rem. Error state: 3px error-red border + bold error text + icon.
- Numeric fields: tabular figures, right-aligned.
- Select: native `<select>`, same label/hint/error contract.
- Radio/checkbox: `<fieldset>` + `<legend>`; 24px native inputs in 44px rows; per-option hints tied by `aria-describedby`; group error announced with the legend, 4px left error border.

### Tables (`DataTable`)

- `<caption>` (bold, lead size, left-aligned, with a small muted description line), `scope="col"`, `aria-sort` on sortable headers, polite announcement, focusable labelled scroll region (`.pbgc-table-region`, horizontal scroll inside, 1px decorative border, 4px radius).
- Header row: PBGC Blue background, white text, no wrapping. Cell padding 0.75rem 1rem. Even body rows `#F2F2F2`. Numbers: right-aligned, tabular figures. Sort control: 44px min-height, focus ring white on blue.

### Alerts and errors

- Alert: no live region by default; `polite` → `role="status"`, `assertive` → `role="alert"`; never both. Heavy 8px left border in the status accent color, tinted background, icon + bold title + body. Status uses a different icon shape, text, and border — never color alone. Errors read "Error: ...".
- ErrorSummary: focus moves to it on mount; each item links to its field; messages match field-level messages. 3px error border, error-tint background.

### Other components

- Badge: text carries the meaning, color only reinforces; pill (999px radius), 2px border, bold small text. Not interactive.
- Accordion: native `<details>/<summary>` (browser supplies keyboard and state); `+` / `−` indicator; optional exclusive mode.
- SearchBar: `<form role="search">`, visible label, GET submit, no JavaScript required.
- Footer: `<footer>` landmark on PBGC Blue; white logo; underlined white links; column headings are `h2`; inner max-width 1400px.
- Breadcrumb: `<nav aria-label="Breadcrumb">` + `<ol>`; current page is text with `aria-current="page"`; separators are CSS `/`.
- Pagination: real links; `aria-current="page"`; "Previous" and "Next" are words; 44px targets.
- FactsheetCard: one real link in the heading stretched over the card; `<time>` for dates; top border 4px red accent.
- Backlog (not built): Sidebar, NavGroup, date input, tabs, modal, charts. Custom widgets need a full APG keyboard model before building (§8: tabs, modal, disclosure, menus).

### Keyboard model

- Native elements first. If a custom widget is unavoidable, implement the WAI-ARIA Authoring Practices pattern completely (tabs: roving tabindex + arrows/Home/End; modal: focus trap + Escape + focus return; disclosure: `aria-expanded`/`aria-controls` + Enter/Space).

## Accessibility rules

- Target: WCAG 2.2 Level AA. Legal floor: Section 508 (2017 refresh incorporates WCAG 2.0 AA by reference — confirm with Section508ComplianceTeam@pbgc.gov, Q11).
- Text contrast 4.5:1 (3:1 for 18pt+ / 14pt bold). UI boundaries, icons, focus indicators 3:1.
- Focus: `outline: 3px solid var(--pbgc-focus-ring); outline-offset: 2px`. Outline, never box-shadow (outlines survive Windows High Contrast / forced-colors; box-shadows are removed). On blue surfaces the ring is white. Never `outline: none` without replacement.
- Links are always underlined (link blue vs body text is below 3:1, so color alone cannot mark a link).
- Never convey meaning by color alone. Brand red is not "error".
- Manual checklist before any release (design.md §9.4): keyboard-only use; screen reader (NVDA/JAWS/VoiceOver); Windows High Contrast; 200% text zoom and 400% page zoom; text-spacing override; `prefers-reduced-motion`; print preview.
- Automated gate: `npm run tokens:check` (every color pair, both themes, fails below threshold) + Storybook build + `npm run test:a11y` (axe-core, WCAG 2.0–2.2 A/AA + best practices, every story, both themes).

## Content and editorial

- Headlines/subheads (web): sentence case — first word and proper nouns only.
- Dates: spell out month with day or year: "November 1, 2026". No "1st". Abbreviate (Jan, Feb…) only in tables, without periods.
- Numbers: spell out zero to nine; figures for 10 and above. Always figures for ages, percentages (3%), times, dollars.
- Times: "8 a.m.", "noon", never "12 p.m.". Lists: capitalize first word; periods only if items are full sentences. Serial (Oxford) comma required.
- The agency: "PBGC", never "the PBGC". Second reference: "The Corporation" (capitalized) or "the agency" (lowercase).
- "Multiemployer", "defined benefit plan": no hyphen. "use", not "utilize". Web addresses: "PBGC.gov", no "www" or "https://".
- Plain language (legally required for documents that explain a benefit or how to comply). Sample content: obviously fictional; never invent regulations, deadlines, dollar amounts, or program names.

## Print

- Black on white, 12 pt, nav and buttons hidden, link URLs printed after the link text, cards avoid page breaks. Test every template in print preview.

## Governance

- Semantic versioning. Any change to a token value is at least a minor version; any removal is major.
- Single edit point: change `tokens/tokens.json`, run `npm run tokens`. Never edit `tokens.css` or `contrast-report.md`.
- Derived values stay in `OPEN-QUESTIONS.md` until COLA confirms or replaces them.
- Order of authority when sources disagree: (1) PBGC Branding & Editorial Style Guide (Sept 2025) and `pbgc-logo-guidance.pdf`; (2) this specification; (3) the implementation. If code disagrees with the spec, the code is wrong.

## Open questions that affect the 436 app

| # | Issue | What v1.1.0 does |
|---|---|---|
| Q1–Q3 | Style guide contradicts itself: PBGC Blue, PBGC Red, Medium Blue HEX vs RGB | Uses the HEX (`#002D72`, `#E4002B`, `#004B8D`). COLA must settle. |
| Q4 | Logo clear space = width of the "P" | Default 0.5rem until measured. |
| Q5 | Derived values (error red, warning, tints, ink, focus ring, hover red) not approved | Used; they pass contrast but are not PBGC-approved. |
| Q6 | Dark theme not in the guide | Provided as provisional; do not ship without COLA approval. |
| Q7 | Garamond for web apps | Set at 20px on screen; needs design review. |
| Q8 | Logo file-to-variant mapping inferred | Needs visual check. |
| Q9 | `logo-negro.png` provenance unconfirmed | Excluded. |
| Q10 | Approval to store/publish the logo in a repo | Not confirmed. |
| Q11 | Which WCAG version PBGC requires | System targets 2.2 AA; 508 incorporates 2.0 AA. Confirm. |
| Q12–Q16 | GSAP/libraries, official icon set, web templates, UI microcopy rules, next components | Unresolved; see OPEN-QUESTIONS.md. |

## How the 436 app uses this

- Copy `tokens/tokens.css` verbatim into the single HTML file (byte-identical to the system file, as R5 and DEL did).
- Copy the needed rules from `src/styles/components.css` (plain CSS, tokens only).
- Header: slim PBGC Blue header, white (`wt`) logo, links not buttons, `aria-current="page"`, skip link first, disclosure menu under 1024px.
- AFTAP grid and Part 3 table: `DataTable` rules (caption, blue header row, zebra rows, right-aligned tabular numbers, labelled scroll region).
- Form fields: `TextField`/`ChoiceGroup` rules (visible labels, 44px targets, error text + icon + border).
- Dark/light toggle: system provides a provisional dark theme; the DEL app used `#000` dark page background by user decision. Ask the user which dark background the 436 app uses.
- Suggest design-system updates when gaps are found; do not change the system unilaterally.
