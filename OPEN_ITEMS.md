# 436 Generator — Open Items

Items left open in v0.2.0. Each needs a decision, a check, or a later
version. Resolved items stay listed with their decision.

## Open

### 11. WRERA (e)(1) 2008/2009 transition quirk — NOT ENCODED

The Worker, Retiree, and Employer Recovery Act of 2008 (Pub. L.
110–458, §203) provides that for the first plan year beginning
Oct 1, 2008–Sep 30, 2009, §436(e)(1) is applied by substituting the
prior-year AFTAP if greater. It affects only the (e) accrual-freeze
limit in that one-year window, not the Part 3 AFTAP table. The app
does not encode it. Decide in v0.3.0 whether to encode it or leave it
as an actuary note.

### 12. Fully-funded transition 92/94/96% — NOT ENCODED

Reg. §1.436-1(j)(1)(ii)(D) preserves a transition: the fully-funded
threshold is 92% for 2008, 94% for 2009, 96% for 2010. It affects
only the fully-funded edge (100% threshold), not the 60/80 limits.
The app does not encode it.

### 13. ERISA parallel not read — BELT-AND-BRACES CHECK

The v0.2.0 rule research read IRC §436, Reg. §1.436-1, and DB Answer
Book Ch. 22, but did not read ERISA 29 USC §1056(g). It was not
needed: the IRC text plus the regulation fully determine every rule
the app encodes, and ERISA §206(g) mirrors §436 for these purposes.
A belt-and-braces read is still open if wanted.

## Resolved

### 1. April 1 step-down: the "within 10 points" condition — RESOLVED (v0.2.0)

Verified against Reg. §1.436-1(h)(2) and DB Answer Book Q 22:18–22:19.
The step-down applies only when the prior-year AFTAP is in [60,70)
or [80,90) — or [70,80) in the first effective plan year (2008, or
the adoption year) — and only if no certification for the current
year was made by April 1. It starts April 1 if the prior-year
certification predates April 1, else on the date of that prior-year
certification (h)(2)(iii)–(iv). The demo fixture was re-derived:
14 periods (2012 now starts <60%).

### 2. (d)(3) second prong: 4022 maximum — DECIDED: input (v0.2.0)

The 4022 maximum guarantee amount stays an actuary input
(`facts.f4022Max`). Computing it needs the participant's age, benefit
form, and the full 4022 phase-in and guarantee rules — that is V1
calculation work, not the 436 evaluation's job. The 436 app applies
the cap given the amount, and the Part 4 (d) draft tells the actuary
to add the cap applied. No change to the app.

### 3. DOBF name collision — DECIDED: plan-level only (v0.2.0)

The evaluation's DOBF is a plan-level date (date of benefit freeze).
The BCV Data Dictionary field BCV1.DOBF is participant-level. The app
keeps its DOBF plan-level only and does NOT map it to BCV1.DOBF. If a
later module needs the plan-level freeze date in BCV terms, that is a
new dictionary-level decision.

### 4. Elided statute paragraphs — READ IN FULL (v0.2.0)

(d)(1), (e)(1), (h)(1), (j) were read in full at uscode.house.gov
(the Cornell LII text extraction omits them). (d)(1) and (e)(1)
confirm the <60% thresholds the app already encodes — no change.
(h)(1) changed the builder: the carry-forward rule (see item 6).
(j) defines what AFTAP is; it sets no threshold — no change, except
the 92/94/96% transition noted in item 12.

### 5. Grid kind column — BUILT (v0.2.0)

The AFTAP grid now has a Kind column (Certified / Range / Late /
Recertified). Lateness is still auto-detected from the certification
date as well. Paste from Excel takes a 6th column for kind; 5 columns
still paste as before.

### 6. Range and recertification handling in the builder — BUILT (v0.2.0)

Per Reg. §1.436-1(h)(1), (h)(2), (h)(4):

- Carry-forward: a year with no certification breaks the chain. The
  next year starts at the presumption in effect on the last day of
  the prior year, not at the most recent certified value. Demo 2012
  re-derived: <60% Jan 1–Apr 30, then 85% Actual from May 1.
- Range: governs at the floor of the range; prevents the (h)(2)
  step-down if issued before April 1; a specific certification
  supersedes it from its own date; with no specific certification by
  year-end the AFTAP is retroactively deemed <60% from Oct 1.
- Recertification: material applies retroactively to the earlier
  certification date; immaterial applies prospectively from the later
  date. Materiality is stated by the actuary in the grid detail row.
- Late: a certification dated on/after Oct 1 is no certification for
  its own year. It supplies the next year's start only if the
  (h)(1)(ii)(B) proviso is met (lateCounts checkbox). The (h)(2) band
  test still uses the certified prior-year value even when late —
  see the code comment in `a36BuildPeriods`.

### 7. Dark background: #000 vs system night-0 #0B1B36 — DECIDED

The PBGC Design System v1.1.0 DRAFT gives a provisional dark page
background of night-0 #0B1B36. The DEL app uses #000, by Herick's
decision (2026-11-11). This app follows DEL: dark page background is
#000.

### 8. Scraper prompt download / JSON import in the UI — BUILT (v0.2.0)

Step 2 now has a "Download scraper prompt" button, a JSON file picker,
a paste box, Validate, and Load. The app validates the JSON against
the schema rules, shows a summary, and loads only on approval. Loading
fills the editable forms — the steps themselves are the review. Invalid
JSON and bad schema values are rejected with the errors shown, and
nothing loads.

### 9. Template version check — VERIFIED (v0.2.0)

Checked 2026-11-11: 436_Evaluation_Template_v0.2.0.docx (2026-07-27)
is still the newest blank 436 Evaluation template. No newer version
exists in Drive. Check again before the next release, per the version
rule.

### 10. No data from the partially filled Nov 2025 file — RULE (ongoing)

No values, case numbers, or IVS numbers from the partially filled Nov
2025 file are used anywhere in this repo. The demo case is invented.
The example Part 3 table's structure informed the period algorithm
only. This rule stays in force for every later version.
