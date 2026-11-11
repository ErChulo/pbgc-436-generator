# How It Works

End-to-end mechanics, in ASD STE 100 minimal language.

## The app

One HTML file. Open it from disk (file://). No server, no network.
The app never sends data anywhere. All data stays in the browser.

## Steps

### 1. Case

Type the header fields: plan name, EIN/PIN, case number, DOPT, DOTR,
BPD, DOBF, FD-PY, plan year start, TO, FROM, memo date. The case number
is text, with leading zeros kept.

### 2. AFTAP history

Type the certification history in the grid. One row per plan year,
from the later of the plan adoption date and PY2007. Columns: plan
year, AFTAP %, certification date, source (Certification, AVR,
5500 SB), IPS reference number. Paste from Excel: copy cells, paste
into the grid. The app splits tab/newline and validates as you type.

Or: download the scraper prompt, feed it with the plan documents to an
LLM, and paste the JSON back. The app validates it against the schema.
You review it. Only approved JSON writes the .docx.

### 3. Part 1

Answer four questions (No, N/A, Yes):

- (b) UCEB — early unreduced benefits or temporary supplements due to
  a plant shutdown.
- (c) Amendments — amendments increasing benefit liabilities.
- (d) Prohibited payments — lump sums, period-certain benefits,
  non-life-annuity forms.
- (e) Benefit accruals — did benefits accrue.

All No/N/A means no limitation. Any Yes means Part 2.

### 4. Part 3 table

The app computes the AFTAP periods from the history:

- AFTAP at plan year start is the most recent certified AFTAP from any
  earlier year.
- −10 points from the first day of the 4th month if no certification
  was made by that date.
- Conclusive below 60% from the first day of the 10th month if none
  by then.
- A certification dated on or after October 1 of its plan year is
  late: it does not apply to its own year, and it becomes the presumed
  AFTAP for the next year.
- The table runs from the 2008 plan year to DOPT.

Each period shows the plan year, the AFTAP %, Actual or Presumed, the
effective dates, and the limits in force.

### 5. Review

The app drafts the Part 4 conclusions from Parts 1–3:

- For each of (b), (c), (d), (e): the Part 1 answer, the AFTAP at the
  relevant date, the threshold, the CBA exception.
- The (d) draft cites the 50% cap: the lesser of 50% of the payment or
  the present value of the PBGC maximum guarantee.

You edit the draft. The draft is a proposal. You approve it.

### 6. Download

The filled §436 Evaluation .docx. File name is the case number plus
436, e.g. `11223344436.docx`. The app also downloads the inputs JSON
(`436_inputs_<case>.json`) so you can reload the session later.

## The .docx

The app writes the Word file from the data, not from template tags.
It writes: the memo header, Part 1 with the checked answers, the
preliminary determination, the AFTAP certifications table, the Part 3
table, the Part 4 draft, the Part 5 signature lines. The template has
no tags in Part 1, Part 4, or Part 5, so the app builds those sections
directly. The Part 5 signature lines are kept as blank lines, not
filled text.

## What the app does not do

- It never certifies an AFTAP. PBGC will not calculate or certify a
  plan's AFTAP. The app takes certified/stated AFTAPs as inputs.
- Part 5 Reviewer Concurrence is a human signature.
- Three facts the numbers cannot settle: was the UCEB paid, were
  accruals restored, and the 4022 maximum amount for the (d)(3) cap.
  You confirm them.
