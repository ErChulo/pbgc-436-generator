# How It Works

End-to-end mechanics, in ASD STE 100 minimal language.

## The app

One HTML file. Open it from disk (file://). No server, no network.
The app never sends data anywhere. All data stays in the browser.

## Steps

### 1. Case

Type the header fields: plan name, EIN/PIN, case number, DOPT, DOTR,
BPD, DOBF, FD-PY, plan year start, plan adoption date, TO, FROM, memo
date. The case number is text, with leading zeros kept. The adoption
date sets the first effective plan year for the April 1 step-down rule.

### 2. AFTAP history

Type the certification history in the grid. One row per plan year,
from the later of the plan adoption date and PY2007. Columns: plan
year, AFTAP %, certification date, source (Certification, AVR,
5500 SB), kind (Certified, Range, Late, Recertified), IPS reference
number. Paste from Excel: copy cells, paste into the grid. The app
splits tab/newline and validates as you type.

Kinds that need more open a detail row under the row:

- Range: the specific AFTAP % and certification date that superseded
  the range, if any. Blank means no specific certification by
  year-end: the AFTAP is then deemed below 60% from Oct 1.
- Late: a checkbox for the (h)(1)(ii)(B) proviso — the certification
  took into account UCEBs and amendments that became effective during
  the plan year before the certification.
- Recertified: the original AFTAP %, the original certification date,
  and whether the change was material (Yes/No). Material applies
  retroactively to the original date; immaterial applies from the
  amended date.

Or: download the scraper prompt, feed it with the plan documents to an
LLM, and paste the JSON back. The app validates it against the schema,
shows a summary, and loads it only when you approve. Loading fills the
forms — the steps themselves are the review. Invalid JSON and bad
values are rejected with the errors shown, and nothing loads.

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

The app computes the AFTAP periods from the history, per Reg.
§1.436-1(h):

- AFTAP at plan year start: if the prior year was certified during
  that year, the certified value; otherwise the presumption in effect
  on the last day of the prior year. A year with no certification
  breaks the chain.
- −10 points from the first day of the 4th month, only when the
  prior-year AFTAP is in [60,70) or [80,90) — or [70,80) in the first
  effective plan year — and only if no certification for the current
  year was made by that date. It starts April 1, or on the date of the
  prior-year certification if that came on/after April 1.
- Conclusive below 60% from the first day of the 10th month if no
  certification for the current year was made by then.
- A certification dated on or after October 1 of its plan year is
  late: it does not apply to its own year. Unless the proviso is met,
  it does not supply the next year's start either.
- A range certification governs at the floor of the range. A specific
  certification supersedes it from its own date. With no specific
  certification by year-end, the AFTAP is deemed below 60% from
  October 1.
- A recertification applies retroactively to the original date if the
  change was material, prospectively from the amended date if
  immaterial. Materiality is stated by the actuary.
- The table runs from the 2008 plan year (or the adoption year) to
  DOPT.
- (e) only: WRERA §203 — for the single plan year beginning Oct 1,
  2008–Sep 30, 2009, the (e) test uses the greater of the
  current-year and prior-year AFTAP (freeze only if both are below
  60%). PRA 2010 lookback — for plan years beginning Oct 1,
  2008–Sep 30, 2010, the (e) test uses the greater of the
  current-year AFTAP and the AFTAP for the plan year beginning Oct 1,
  2007–Sep 30, 2008. The Part 3 AFTAP values are unchanged; only the
  (e) determination changes, and the Limits column names the rule
  when it changes the outcome. The prior-year AFTAP is taken as
  determined under §436 (certified if certified, else the presumed
  value) — the actuary confirms it; Reg. §1.436-1(e)(3) is
  [Reserved], so no regulation settles it.

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
  plan's AFTAP. The app takes certified/stated AFTAPs as inputs. The
  92/94/96% fully-funded transition (IRC §436(j)(3)(B), Reg.
  §1.436-1(j)(1)(ii)(D)) is a rule about how the enrolled actuary
  computes a certified AFTAP — whether funding balances reduce
  assets — so it lives in that computation, not in this app. The
  (d)(2) bankruptcy threshold stays 100%.
- The PRA 2010 lookback also applies to (d) social-security-leveling
  payments; the app does not encode that piece, because it needs a
  fact the app does not collect (whether a payment is a
  social-security-leveling payment). The actuary applies it by hand
  for leveling payments.
- Part 5 Reviewer Concurrence is a human signature.
- Three facts the numbers cannot settle: was the UCEB paid, were
  accruals restored, and the 4022 maximum amount for the (d)(3) cap.
  You confirm them.
