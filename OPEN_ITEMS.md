# 436 Generator — Open Items

Items left open in v0.2.2. Resolved items stay listed with their
decision. One item below cannot be closed by research — it is a
judgment call for the actuary, not unfinished work.

## Open

### 15. WRERA prior-year AFTAP: certified vs presumed — JUDGMENT CALL

The WRERA text says "the plan's AFTAP for the preceding plan year"
with no "certified" or "presumed". The app takes the preceding year's
AFTAP as determined under §436 (certified if certified, else the (h)
presumed value in effect). Reg. §1.436-1(e)(3) is [Reserved], so no
regulation settles it. No further research can close this — the
statute, the JCT explanation, and the DB Answer Book (which never
mentions WRERA §203) are all silent. The actuary confirms the value
on the case. In practice it almost never matters: the prior year is
nearly always certified by the time the WRERA-year (e) determination
is made.

## Resolved

### 14. PRA lookback, (d) social-security-leveling piece — ENCODED (v0.2.2)

Yes, it was possible. It needed one new fact: whether a payment is
under a social-security-leveling option. The schema and scraper
prompt now carry `paymentDates[].leveling`. For a leveling payment
in a lookback year, the Part 4 (d) draft cites the lookback AFTAP
(max of the current-year and base-year AFTAP). The WRERA prior-year
value never applies to (d).

### 16. PRA lookback window endpoints — VERIFIED (v0.2.2)

Verified against PRA 2010 §203(a)(2) (Tax Notes summary of the
statute; govinfo U.S. Code notes). The lookback years are "beginning
on or after October 1, 2008, and before October 1, 2010" — an exact
match for the app's window (Oct 1, 2008–Sep 30, 2010). The base year
is "beginning after October 1, 2007, and before October 1, 2008" —
the app reads it as Oct 1, 2007–Sep 30, 2008, which matches for every
plan-year start except Oct 1, where the strict reading gives no base
year and the app uses the Oct 1, 2007 year (the pre-crisis year) as
the base. The app assumes a first-day valuation date; the
alternate-valuation-date variant (plan years beginning after Dec 31,
2007, before Jan 1, 2010) is not modeled.

### 11. WRERA (e)(1) 2008/2009 transition quirk — ENCODED (v0.2.1)

Verified against the WRERA enrolled bill (H.R. 7327 §203, Pub. L.
110–458) and the JCT Technical Explanation (JCX-85-08, pp. 30–31).
For the single plan year beginning Oct 1, 2008–Sep 30, 2009, the (e)
test uses the greater of the current-year and prior-year AFTAP —
freeze only if both are below 60%. (e) only; (b), (c), (d) and the
Part 3 AFTAP values are unaffected. The Limits column names the rule
when it changes the outcome, and the Part 4 (e) draft carries the
note when a freeze date is given.

Encoded with it (same mechanism, adjacent years): the PRA 2010 §203
lookback — for plan years beginning Oct 1, 2008–Sep 30, 2010, the (e)
test uses the greater of the current-year AFTAP and the AFTAP for the
plan year beginning Oct 1, 2007–Sep 30, 2008. In the WRERA year both
apply: the greater of the three. The (d) leveling piece is open
(item 14). The demo is unaffected (2009 prior 72.5% ≥ 60%; 2010
lookback max(69.8%, 72.5%) = 72.5% — no freeze either way).

### 12. Fully-funded transition 92/94/96% — DECIDED: no encoding (v0.2.1)

Verified against IRC §436(j)(3) as enacted and Reg.
§1.436-1(j)(1)(ii)(B), (D), (E). Correction to the earlier reading:
the transition does NOT change the (d)(2) bankruptcy 100%
threshold. "Fully-funded" here means the rule about whether funding
balances reduce assets when computing the AFTAP — a rule that feeds
every §436 determination, and the app takes certified AFTAPs as
inputs. Nothing to encode; a note in Step 2 says so, and the (d)(2)
threshold stays 100%.

### 13. ERISA parallel not read — READ, VERIFIED MIRROR (v0.2.1)

ERISA 29 USC §1056(g) read in full (govinfo 2018 U.S. Code, checked
against the 2007 as-enacted edition). It mirrors IRC §436 for every
rule the app encodes: the 60/80/100 thresholds, the (h) presumption
rules, the (d)(3) cap and one-time rule, and the fully-funded
transition as enacted (struck 2014, same as the Code). No change.
Two notes: the range/late/recertification mechanics live only in
Reg. §1.436-1(h)(4) (no ERISA statutory parallel) — the app's
encoding stands as-is; and the §101(j) notice duty is ERISA-only and
not part of the §436 Evaluation template.

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
