# 436 Generator

![Tests: 172 passing](https://img.shields.io/badge/tests-172%20passing-brightgreen)
![Unit tests: 107 passing](https://img.shields.io/badge/unit%20tests-107%20passing-brightgreen)
![Browser tests: 65 passing](https://img.shields.io/badge/browser%20tests-65%20passing-brightgreen)
![DOCX checks: passing](https://img.shields.io/badge/docx%20checks-passing-brightgreen)
![Network calls: 0](https://img.shields.io/badge/network%20calls-0-brightgreen)
![Version: v0.2.2](https://img.shields.io/badge/version-v0.2.2-blue)

Badges show grades measured on v0.2.2. Update badges when tests change.

## Purpose

Decide if any IRC §436 funding-based limitation applied to the plan
before DOPT, and how it affects the benefits PBGC calculates, values,
and pays. Four limitations: (b) UCEB, (c) amendments, (d) prohibited
payments, (e) benefit accruals.

## End result

A filled §436 Evaluation Word document: `<case>436.docx`, e.g.
`11223344436.docx`. Memo header, Part 1 with checked answers,
preliminary determination, AFTAP certifications table, Part 3 AFTAP
table, Part 4 draft conclusions, Part 5 signature lines. Plus the
inputs JSON (`436_inputs_<case>.json`) to reload the session.

## How to use

Open `436-generator.html` in a browser, straight from disk (`file://`).
No server. No install. No data leaves the page. One HTML file. Theme
toggle in the header: dark or light.

1. **Case** — type the header fields (plan name, case number, DOPT,
   DOTR, BPD, DOBF, FD-PY).
2. **AFTAP history** — type the certification history in the grid, or
   paste it from Excel. One row per plan year. The app validates as
   you type.
3. **Part 1** — answer the four questions (No, N/A, Yes).
4. **Part 3 table** — the app computes the AFTAP periods from the
   history.
5. **Review** — check the table and edit the draft Part 4 conclusions.
6. **Download** — the filled `<case>436.docx` + inputs JSON.

Or: download the scraper prompt (Step 2), feed it with the plan
documents to an LLM, and paste the JSON back. The app validates it.
You review it. Only approved JSON writes the .docx.

## What the app computes

- Presumed AFTAP: prior-year certified AFTAP; −10 points from the
  first day of the 4th month if no certification by then; conclusively
  below 60% from the first day of the 10th month if none by then.
- Part 3 table: periods from the certification history, bounded by
  plan year starts, certification dates, April 1, October 1, DOPT.
- Thresholds per period: 60% / 80% / 100%, with the new-plan, CBA,
  and 2008 transition exceptions.
- Part 1 logic: all No/N/A means no limitation; any Yes means Part 2.
- CBA exception: from the CBA table dates.
- Part 4 draft: conclusions from Parts 1–3. You review the draft.

## What the app does NOT do

- It never certifies an AFTAP. PBGC will not calculate or certify a
  plan's AFTAP. The app takes certified/stated AFTAPs as inputs.
- Part 5 Reviewer Concurrence is a human signature. The app only
  pre-fills names and dates and flags when ATR concurrence is needed.
- Three facts the numbers cannot settle: was the UCEB paid, were
  accruals restored, and the 4022 maximum amount for the (d)(3) cap.
  You confirm them.

## Design system

PBGC Design System v1.1.0 DRAFT (not approved). Same tokens, fonts,
and component rules as the DEL generator: brand blue #002D72, Helvetica
Neue / Arial, 4px radius, 44px targets, skip link first, nav links
(not buttons) with aria-current, dark page background #000 (DEL
decision, overrides the system's provisional night-0 #0B1B36), white
PBGC logo on the blue header in both themes.

## Files

| File | What it is |
| --- | --- |
| `436-generator.html` | The app. Single file. |
| `prompts/436-scraper-prompt.md` | Prompt for the LLM. |
| `schema/436.schema.json` | Input JSON schema. |
| `tests/run.cjs`, `tests/browser.cjs` | Tests. Run `npm test`. |
| `scripts/build_single_file.py` | Injects the prompt, checks safety. |
| `docs/HOW_IT_WORKS.md` | End-to-end mechanics. |
| `template-inventory.md` | Tag inventory of the blank template. |
| `design-system-notes.md` | Design system version and tokens. |
| `OPEN_ITEMS.md` | Open items and decisions. |

## Version

v0.2.0. Template: 436_Evaluation_Template_v0.2.0.docx (blank,
2026-07-27). No data from the partially filled Nov 2025 file is used
anywhere in this repo.

### v0.2.2 — what changed

- PRA 2010 lookback, (d) leveling piece, now encoded: for payments
  under a social-security-leveling option in plan years beginning
  Oct 1, 2008–Sep 30, 2010, the (d) test uses the greater of the
  current-year AFTAP and the base-year AFTAP. Mark a payment as
  leveling in the import JSON (`paymentDates[].leveling`); the Part 4
  (d) draft cites the lookback AFTAP for leveling payments. The
  WRERA prior-year value never applies to (d).
- PRA windows verified against PRA 2010 §203(a)(2): the lookback
  years are "beginning on or after October 1, 2008, and before
  October 1, 2010" (exact match). The base year is "beginning after
  October 1, 2007, and before October 1, 2008" — the app reads it as
  Oct 1, 2007–Sep 30, 2008, which matches for every plan-year start
  except Oct 1, where the strict reading gives no base year and the
  app uses the Oct 1, 2007 year (the pre-crisis year).
- Tests: 172 passing (107 unit, 65 browser). Demo .docx verified
  (14 periods, unchanged).

### v0.2.1 — what changed

- WRERA §203 encoded (verified against the enrolled bill and the
  JCT explanation): for the single plan year beginning Oct 1,
  2008–Sep 30, 2009, the (e) accrual-freeze test uses the greater of
  the current-year and prior-year AFTAP — the freeze applies only if
  both are below 60%. The PRA 2010 lookback is encoded with it: for
  plan years beginning Oct 1, 2008–Sep 30, 2010, the (e) test uses
  the greater of the current-year AFTAP and the AFTAP for the plan
  year beginning Oct 1, 2007–Sep 30, 2008. The Part 3 AFTAP values
  are unchanged; only the (e) determination changes, and the Limits
  column names the rule when it changes the outcome. (b), (c), (d)
  always use the period's own AFTAP.
- ERISA 29 USC §1056(g) read in full and verified as a verbatim
  mirror of IRC §436 for every rule the app encodes — no change
  needed. The 92/94/96% fully-funded transition is a rule about how
  the enrolled actuary computes a certified AFTAP, not a limitation
  threshold, so the app takes the certified AFTAP as given; a note
  in Step 2 says so. The (d)(2) bankruptcy threshold stays 100%.
- Tests: 165 passing (100 unit, 65 browser). Demo .docx verified
  (14 periods, unchanged).

### v0.2.0 — what changed

- Part 3 period rules corrected to Reg. §1.436-1(h), verified against
  the regulation, IRC §436, and DB Answer Book Ch. 22: April 1
  step-down only in the [60,70) and [80,90) bands ([70,80) in the
  first effective year), with the start on the prior-cert date when
  that certification came on/after April 1; a year with no
  certification breaks the chain (the next year starts at the
  presumption on the last day of the prior year); range certifications
  govern at the floor, with retroactive &lt;60% from Oct 1 if no
  specific certification by year-end; recertifications apply
  retroactively if material, prospectively if immaterial; a late
  certification counts as no certification for its own year unless
  the (h)(1)(ii)(B) proviso is met.
- Demo fixture re-derived: 14 periods (2012 now starts &lt;60%).
- AFTAP grid: Kind column, plus a detail row for range, late, and
  recertified rows (specific certification, late-counts proviso,
  original certification and materiality).
- Step 2: download scraper prompt, paste or upload LLM JSON, validate,
  load on approval.
- Plan adoption date in the case header (sets the first effective plan
  year for the step-down rule).
- Tests: 146 passing (85 unit, 61 browser). Demo .docx verified
  (14 periods).
