# 436 Generator

![Tests: 86 passing](https://img.shields.io/badge/tests-86%20passing-brightgreen)
![Unit tests: 53 passing](https://img.shields.io/badge/unit%20tests-53%20passing-brightgreen)
![Browser tests: 33 passing](https://img.shields.io/badge/browser%20tests-33%20passing-brightgreen)
![DOCX checks: passing](https://img.shields.io/badge/docx%20checks-passing-brightgreen)
![Network calls: 0](https://img.shields.io/badge/network%20calls-0-brightgreen)
![Version: v0.1.0](https://img.shields.io/badge/version-v0.1.0-blue)

Badges show grades measured on v0.1.0. Update badges when tests change.

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

v0.1.0. Template: 436_Evaluation_Template_v0.2.0.docx (blank,
2026-07-27). No data from the partially filled Nov 2025 file is used
anywhere in this repo.
