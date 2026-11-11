# 436 Generator

Build the §436 Evaluation. One HTML file. Open it from disk. No server. No data leaves the page.

## Purpose

Decide if any IRC §436 funding-based limitation applied to the plan
before DOPT, and how it affects the benefits PBGC calculates, values,
and pays. Four limitations: (b) UCEB, (c) amendments, (d) prohibited
payments, (e) benefit accruals.

## How to use

1. Case — type the header fields (plan name, case number, DOPT, DOTR,
   BPD, DOBF, FD-PY).
2. AFTAP history — type the certification history in the grid, or paste
   it from Excel. One row per plan year.
3. Part 1 — answer the four questions (No, N/A, Yes).
4. Part 3 table — the app computes the AFTAP periods from the history.
5. Review — check the table and edit the draft Part 4 conclusions.
6. Download — the filled §436 Evaluation .docx. File name is the case
   number plus 436, e.g. `11223344436.docx`.

Or: download the scraper prompt (Step 2), feed it with the plan
documents to an LLM, and paste the JSON back. The app validates it.
You review it. Only approved JSON writes the .docx.

## What the app computes

- Presumed AFTAP: prior-year certified AFTAP; −10 points from the first
  day of the 4th month if no certification by then; conclusively below
  60% from the first day of the 10th month if none by then.
- Part 3 table: periods from the certification history, bounded by plan
  year starts, certification dates, April 1, October 1, DOPT.
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

## Test

| Check | Result |
| --- | --- |
| Unit tests | 53 passing |
| Browser tests | passing |
| Demo .docx checks | passing |
| Network calls | 0 |

## Version

v0.1.0. PBGC Design System v1.1.0 DRAFT (not approved). Template:
436_Evaluation_Template_v0.2.0.docx (blank, 2026-07-27). No data from
the partially filled Nov 2025 file is used anywhere in this repo.
