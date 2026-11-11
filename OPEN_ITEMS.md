# 436 Generator — Open Items

Items left open in v0.1.0. Each needs a decision, a check, or a later
version.

## 1. April 1 step-down: the "within 10 points" condition

The app applies the −10 point step-down whenever no certification was
made by April 1. The statute (§436(h)(3)(A)(ii) / Reg. §1.436-1(h))
applies it only when the presumed AFTAP is "within 10 points" of the
applicable threshold (60% or 80%). The filled file's example Part 3
table applies the step-down broadly. **To check:** the DB Answer Book
Ch. 22, before encoding the condition. Until then the app steps down
unconditionally and the open item stays.

## 2. (d)(3) second prong: 4022 maximum — compute or input

The (d)(3) cap is the lesser of 50% of the payment or the present value
of the PBGC maximum guarantee. The 4022 maximum amount is currently a
`facts.f4022Max` input. Open: compute it in the app from the BCV
maximum-guarantee logic, or keep it as an actuary input. The amount
needs the participant's age, benefit form, and guarantee rules.

## 3. DOBF name collision

The evaluation's DOBF is a plan-level date (date of benefit freeze).
The BCV Data Dictionary has a participant-level field BCV1.DOBF. The
app keeps them separate (the app's DOBF is plan-level only). The
dictionary mapping for the evaluation's DOBF is open.

## 4. Elided statute paragraphs

Some §436 paragraphs in the Cornell extract were elided: (d)(1),
(e)(1), (h)(1), (j). The substance rests on the ERISA parallel text,
PBGC guidance, and the DB Answer Book. **To check:** the full statute
text for these paragraphs before v0.2.0.

## 5. Grid kind column

The AFTAP grid UI has no kind column. The kind (certified / range /
late / recertified) is JSON-only. Lateness is auto-detected from the
certification date. A kind column in the grid UI is a v0.2.0 item.

## 6. Range and recertification handling in the builder

The schema and validation accept range and recertified kinds. The
builder treats a range like a specific % (the low bound). A range
certification has no single AFTAP value; the builder should surface
the range, not collapse it. A recertification changes a prior value
only if material. Both need builder logic in v0.2.0.

## 7. Dark background: #000 vs system night-0 #0B1B36

The PBGC Design System v1.1.0 DRAFT gives a provisional dark page
background of night-0 #0B1B36. The DEL app uses #000, by Herick's
decision (2026-11-11). This app follows DEL: dark page background is
#000.

## 8. Scraper prompt download / JSON import in the UI

The prompt exists (`prompts/436-scraper-prompt.md`, embedded in the
HTML by `scripts/build_single_file.py`). The UI step for downloading
the prompt and importing the LLM JSON is not built yet. The workflow
step exists as a decision, not yet in the UI. v0.2.0.

## 9. Template version check

The blank template used is 436_Evaluation_Template_v0.2.0.docx
(2026-07-27). Check for a newer version before the next release, per
the version rule: always fetch the most current version.

## 10. No data from the partially filled Nov 2025 file

No values, case numbers, or IVS numbers from the partially filled Nov
2025 file are used anywhere in this repo. The demo case is invented.
The example Part 3 table's structure informed the period algorithm
only. This rule stays in force for every later version.
