# 436 Template Inventory — BLANK template only

Source file: `436_Evaluation_Template_v0.2.0.docx`
Local copy: `~/workspace/pbgc_review/436/436_Evaluation_Template_v0.2.0.docx`
Method: python-docx (python-docx 1.1.0) + raw XML cross-check of all `.xml` parts.
Date of extraction: 2026-11-11.

**Do NOT use the Nov 2025 partially filled evaluation files for data.**
The blank template is the only source for layout and tags. The Nov 2025 files
contain example values and real case numbers; none of that data is in this file.

## 1. Document facts

- Core properties: title `Microsoft Word - 436 Evaluation (ASTD Updates Nov 2025).docx`,
  author `iotpd84`, created 2026-01-12 10:53, modified 2026-01-12 10:53, revision 2.
- Page: US Letter, 612 x 792 pt. Margins: left/right 54 pt, bottom 54 pt.
  Top margin varies by section: 27 pt (section 0), 68 pt (most sections),
  84–85 pt (sections 6, 8), 81 pt (section 10).
- 12 sections (0–11). Headers empty in all sections.
- Footers (in a text box, all sections): `§436 Evaluation` + TAB + PAGE field,
  second line `Version of 11/25/2025`.
  Cached PAGE value is `1` (footer1) and `3` (first-page footer, footer2);
  the PAGE field updates in Word. Footer version stamp: **11/25/2025**.
- Body: 295 paragraphs, 4 tables. No content controls (`w:sdt` = 0), no bookmarks.
- Styles used: Body Text 213, Normal 41, List Paragraph 31, Heading 1 × 8, Heading 2 × 2.
- No real Word footnotes: `word/footnotes.xml` has no text. The notes marked
  `1`, `2`, `3` in the body are plain text paragraphs, not footnote references.
- Drawings: 1 picture + 8 horizontal line shapes (DrawingML `wps` shapes with `a:ln`).
  - Picture: PBGC logo in Table 0, cell C0. Size 2353881 x 603503 EMU (~2.57 in x 0.66 in).
  - Line shapes (thin horizontal rules, height ~6350–10160 EMU):
    - ~2 in wide: near footnote 1 (P25), in Part 5 (P103, P108, P145), near footnote 3 (P227).
    - ~4.95 in wide (356.4 pt) × 2: signature lines in Part 5.
    - ~1.5 in wide (109.05 pt) × 2: date lines in Part 5.
    - ~0.04 in wide: small mark in Part 1(d) N/A paragraph (P42), at the
      `[provide the date]` fill-in.
  - Consequence for the build: Part 5 signature/date lines are **shapes, not text**.
    The app must not delete them when it fills Part 5; it writes names/dates
    into the blank space above or beside them.

## 2. All [[tags]] — 31 occurrences, 30 distinct names, in document order

Raw XML cross-check confirms: all 31 tags are in `word/document.xml` only.
No tags in headers, footers, or any other part.

| # | Tag | Location |
|---|-----|----------|
| 1 | `[[to_name]]` | P1 (memo TO line) |
| 2 | `[[to_section]]` | P1 (memo TO line) |
| 3 | `[[from_name]]` | P1 (memo FROM line) |
| 4 | `[[from_section]]` | P1 (memo FROM line) |
| 5 | `[[memo_date]]` | P2 |
| 6 | `[[subject]]` | P4 |
| 7 | `[[plan_name]]` | P6 |
| 8 | `[[ein_pin]]` | P7 |
| 9 | `[[pbgc_case_number]]` | P8 |
| 10 | `[[dopt]]` | P9 |
| 11 | `[[dotr]]` | P10 |
| 12 | `[[bpd]]` | P11 |
| 13 | `[[dobf]]` | P11 |
| 14 | `[[fd_py]]` | P12 |
| 15 | `[[#aftap_rows]]` | Table 1, row 1, col 0 (loop open) |
| 16 | `[[plan_year]]` | Table 1, row 1, col 0 |
| 17 | `[[aftap_display]]` | Table 1, row 1, col 1 |
| 18 | `[[cert_date]]` | Table 1, row 1, col 2 |
| 19 | `[[ips_ref]]` | Table 1, row 1, col 3 |
| 20 | `[[/aftap_rows]]` | Table 1, row 1, col 3 (loop close) |
| 21 | `[[#aftap_periods]]` | Table 2, row 1, col 0 (loop open) |
| 22 | `[[period]]` | Table 2, row 1, col 0 |
| 23 | `[[plan_year]]` | Table 2, row 1, col 1 (2nd use of same name) |
| 24 | `[[aftap_pct]]` | Table 2, row 1, col 2 |
| 25 | `[[basis]]` | Table 2, row 1, col 3 |
| 26 | `[[effective_dates]]` | Table 2, row 1, col 4 |
| 27 | `[[/aftap_periods]]` | Table 2, row 1, col 4 (loop close) |
| 28 | `[[cba_ratification_date]]` | Table 3, row 1, col 0 |
| 29 | `[[cba_effective_date]]` | Table 3, row 1, col 1 |
| 30 | `[[cba_expiration_date]]` | Table 3, row 1, col 2 |
| 31 | `[[cba_ips_ref]]` | Table 3, row 1, col 3 |

**Tags that do NOT exist in this template (build note):** there are NO tags in
Part 1 (checkboxes are literal `[ ]` text), NO tags in Part 4 (blank paragraphs),
NO tags in Part 5 (blank paragraphs + line shapes), and NO conditional tags
(`[[#...]]` conditionals) anywhere — only the two loops above. The generator
must fill Part 1 checkboxes, Part 4 text, and Part 5 names/dates by direct
document manipulation, not by tag substitution.

## 3. Memo header fields (P0–P13)

- P0: `MEMORANDUM` (no tag).
- P1 (one line, TO and FROM): `TO: [[to_name]], Supervisory Actuary, ASD/[[to_section]]`
  + TAB + `FROM: [[from_name]], Actuary, ASD/[[from_section]]`
- P2: `DATE: [[memo_date]]`
- P4: `SUBJECT: [[subject]]`
- P6: `Plan Name: [[plan_name]]`
- P7: `EIN/PIN: [[ein_pin]]`
- P8: `PBGC Case Number: [[pbgc_case_number]]`
- P9: `DOPT: [[dopt]]`
- P10: `DOTR: [[dotr]]`
- P11 (one line, two tags): `BPD: [[bpd]]  DOBF: [[dobf]]`
- P12: `FD-PY: [[fd_py]]`

Note: DOBF here is plan-level (date of benefit freeze). Do not conflate with
dictionary field BCV1.DOBF (participant-level).

## 4. Tables

### Table 0 — letterhead (1 row x 2 cols, first element in the body)

| Cell | Content |
|------|---------|
| R0 C0 | Empty text; contains the PBGC logo picture |
| R0 C1 | `445 12th Street SW` / `Washington, DC 20024-2101` / `202-229-4000` / `PBGC.gov` (4 paragraphs) |

No tags. No page header exists (`word/header*.xml` empty); this table is the
only letterhead. There is NO `word/header*.xml` content with plan info.

### Table 1 — AFTAP certifications (Part 2; 2 rows x 4 cols)

Header row (R0, style Table Paragraph):
`Plan Year | AFTAP | Certification Date | IPS Reference Number`

Template row (R1, loop `[[#aftap_rows]]` … `[[/aftap_rows]]`):
- C0: `[[#aftap_rows]][[plan_year]]`
- C1: `[[aftap_display]]`
- C2: `[[cert_date]]`
- C3: `[[ips_ref]][[/aftap_rows]]`

Note: loop opens in C0 and closes in C3. One row per plan year.
`[[aftap_display]]` is the display form of the AFTAP (the template does not
define its format; the app decides, e.g. `65.48%` or a range).

### Table 2 — AFTAP table (Part 3; 2 rows x 5 cols)

Header row (R0, style Table Paragraph):
`Period | Plan Year | AFTAP % | Actual/Presumed | Effective Dates`

Template row (R1, loop `[[#aftap_periods]]` … `[[/aftap_periods]]`):
- C0: `[[#aftap_periods]][[period]]`
- C1: `[[plan_year]]`
- C2: `[[aftap_pct]]`
- C3: `[[basis]]`
- C4: `[[effective_dates]][[/aftap_periods]]`

Note: loop opens in C0 and closes in C4. One row per period.
`[[basis]]` takes `Actual` or `Presumed`.

### Table 3 — CBA (CBA section; 2 rows x 4 cols, NOT a loop)

Header row (R0, style Table Paragraph):
`Ratification Date | Effective Date | Expiration Date | IPS Document Number`

Data row (R1, single row, no loop):
- C0: `[[cba_ratification_date]]`
- C1: `[[cba_effective_date]]`
- C2: `[[cba_expiration_date]]`
- C3: `[[cba_ips_ref]]`

Single CBA only. If more than one CBA applies, the template has no loop for it
(build decision needed).

## 5. Part 1 — Determine if §436 Limitations Potentially Apply (P14–P60)

Heading 1 (P14): `Part 1 Determine if §436 Limitations Potentially Apply`

### (b) UCEB — P15

Question (List Paragraph):
> §436(b) limitation: Did the plan provide for the payment of a UCEB (for
> example, early unreduced benefits or temporary supplements due to a partial
> or full plant shutdown) with respect to any participant due to an event
> occurring on or after the FD-PY2008 and prior to DOPT?

Options (literal `[ ]` text, no tags):
- `[ ] No` — Further evaluation of the applicability of §436(b) is not required.
- `[ ] N/A` — Further evaluation of the applicability of §436(b) is not required
  because the plan was not in effect five full plan years, in aggregate with
  any predecessor plan, as of DOPT.
- `[ ] Yes` — Further evaluation of the applicability of §436(b) is required.
  (Describe the UCEB, identify the group of participants to whom the UCEB was
  due, provide the dates of the event(s), and confirm whether or not the plan
  paid the UCEB.)

### (c) Amendments — P23

Question (List Paragraph):
> §436(c) limitation: Did plan amendments increasing benefit liabilities have
> an adoption date or effective date on or after the later¹ of the plan's
> adoption date and the FD-PY2008 and prior to DOPT?

Footnote 1 (P26, plain text, not a real footnote):
> 1 This date could also be when a fully insured 412(e)(3) plan converts to a
> traditional plan. Please contact AskASD if you have this type of plan.

Options:
- `[ ] No` — Further evaluation of the applicability of §436(c) is not required.
- `[ ] N/A` — …because the plan was not in effect five full plan years, in
  aggregate with any predecessor plan, as of DOPT.
- `[ ] N/A` — …because the amendment(s): (Select all that apply.)
  - `[ ]` Increased benefits only for future periods (that is, on or after DOPT).
  - `[ ]` Are the result of a mandatory increase in vesting of benefits under
    the IRC or ERISA (that is not in excess of the amount necessary for the
    plan to remain qualified).
  - `[ ]` Only increased the §401(a)(17) compensation limits applicable to the plan.
- `[ ] Yes` — Further evaluation of the applicability of §436(c) is required.
  (Provide the effective date and adoption date of the amendment(s), describe
  the provisions of the amendment(s), and confirm whether or not the plan
  allowed the amendment to take effect.)

### (d) Prohibited payments — P37

Question (List Paragraph):
> §436(d) limitation: Did the plan provide prohibited payments (that is
> accelerated benefit distributions, such as non-de minimis lump sums, period
> certain benefits or benefits that are not life annuities, or benefits in
> which the payment amount exceeds the amount of the plan's automatic
> single-life form including any social security supplement, etc.) with an ASD
> or BCD (if the ASD was retroactive) on or after the later of the plan's
> adoption date and the FD-PY2008?

Options:
- `[ ] No` — Further evaluation of the applicability of §436(d) is not required.
- `[ ] N/A` — …because benefits did not accrue with respect to any participant
  under the terms of the plan on and after 09/01/2005.
  - Follow-on line (P42): `Benefit accruals ceased under the terms of the plan
    on [provide the date].` (literal bracket text, no tag; small line shape
    present in this paragraph.)
- `[ ] Yes` — Further evaluation of the applicability of §436(d) is required.
  (Describe the prohibited payments provided by the plan. Identify if any plan
  applications have not been paid.)

Reminder (P45, body text, always present):
> Reminder: The exception for new plans (plans which have been in effect for
> less than five full plan years) does not apply to §436(d).

### (e) Accruals — P48

Question (List Paragraph):
> §436(e) limitation: Did benefits accrue with respect to any participant on
> or after the later of the plan's adoption date and the FD-PY2008?

Options:
- `[ ] No` — …because benefit accrual ceased under the terms of the plan on
  `[provide the date]`; Benefits did not accrue with respect to any participant
  on and after `[provide the date]`. (literal bracket text, no tags.)
- `[ ] N/A` — …because the plan was not in effect five full plan years, in
  aggregate with any predecessor plan, as of DOPT.
- `[ ] Yes` — Further evaluation of the applicability of §436(e) is required.
  (Describe any change in benefit accruals, for example, if they ceased after
  the FD-PY2008.)

### Preliminary determination — P56

Question (List Paragraph):
> Preliminary determination: Was the answer to any of questions 1–4 "Yes?"

Options:
- `[ ] No` — Questions 1–4 are all "N/A" or "No." None of the §436 limitations
  was applicable before DOPT and therefore the calculation, valuation, and
  payment of benefits by PBGC is not affected by IRC §436.
  (Delete Parts 2-4 and proceed to Part 5 Concurrence.)
- `[ ] Yes` — One or more of questions 1–4 are "Yes." One or more of the §436
  limitations may apply. (Continue to Part 2 Further Evaluation.)

## 6. Part 2 — Further Evaluation (P61–P77)

Heading 1 (P61): `Part 2 Further Evaluation`

Instruction list (List Paragraph, P62–P66):
1. AFTAP Certifications: Obtain and identify the certified AFTAP(s) for each
   plan year beginning with the later of the plan's adoption date and PY2007.
2. Obtain signed and dated AFTAP certifications (not just the AFTAP percentage).
3. Include relevant discussions on range certifications, re-certifications, and
   late certifications.
4. Provide the IPS number for the documentation.
5. If an AFTAP certification cannot be obtained, explain why. If another source
   is used, such as an AVR or a 5500 SB, provide the AFTAP stated in the other
   source. If an assumed certification date is used, explain the assumption.

Then Table 1 (see §4 above).

Footnote line (P69, Body Text):
> *Although plans were not required to certify an AFTAP for PY2007, obtain the
> certification if available.

P70–P77 are blank paragraphs (P76, P77 each contain a single tab).

## 7. Part 3 — AFTAP Table (P78–P82)

Heading 1 (P78): `Part 3 AFTAP Table`

Instruction (P79, Normal):
> [Complete the table with the actual and presumed AFTAPs from the beginning
> of the 2008 plan year to DOPT. Include the relevant plan year and period of
> time to which each actual and presumed AFTAP percentage applies. See Example
> on page 8.]

Then Table 2 (see §4 above).

**Build note:** "See Example on page 8" — the example table is NOT in this blank
template. It exists only in the Nov 2025 partially filled file, which must not
be used for data. The app must generate the Part 3 rows from the certification
history; there is no example row in the template to copy.

## 8. Part 4 — 436 Determination (P83–P97)

Heading 1 (P83): `Part 4 436 Determination`

Placeholder instruction (P84, Normal):
> [Discuss how the 436(b), 436(c), 436(d), and 436(e) restrictions impact the
> pension plan. See Sample Language below.]

Four blank subsections, each a List Paragraph heading followed by blank
Body Text paragraphs (no tags, no text):
- P85 `436(b):` + 3 blank paragraphs (P86–P88)
- P89 `436(c):` + 3 blank paragraphs (P90–P92)
- P93 `436(d):` + 2 blank paragraphs (P94–P95)
- P96 `436(e):` + 1 blank paragraph (P97, List Paragraph, empty)

The app writes the determination text into these blank paragraphs. Sample
language for Part 4 is in §11 below.

## 9. Part 5 — Reviewer Concurrence (P98–P147)

Heading 1 (P98): `Part 5 Reviewer Concurrence`

Structure (all blank, no tags):
- P99–P103: 5 blank Body Text paragraphs (P103 has 2 empty bold runs + a
  horizontal line shape).
- P104 (Heading 2): `Actuarial Reviewer or Section Supervisory Actuary` + TAB + `Date`
- P105–P109: 5 blank Body Text paragraphs (P108 has 2 empty bold runs + a
  horizontal line shape).
- P110 (Heading 2): `Actuarial Technical Reviewer2` + TAB + `Date`
  (the `2` is a literal superscript-style marker in the text; it refers to
  the note at P146.)
- P111–P145: 35 blank Body Text paragraphs (P145 contains a horizontal line shape).

Footnote 2 (P146, Normal, plain text):
> 2 Please submit the §436 Evaluation to Ask ASD for ATR concurrence if any 436
> limitation affects the benefit payable to any participant after DOPT.

**Build note:** Part 5 has NO `[[tags]]`. The app must insert reviewer names
and dates into the blank paragraphs above the line shapes, and must not delete
the line shapes. Concurrence is a human signature — the app cannot answer it;
it only pre-fills names/dates and flags when ATR concurrence is needed.

## 10. Relief section (P148–P153)

Heading 1 (P148): `Relief from 436 Restrictions from 2008 to 2010 and 2020 Plan Years`

Sub-heading (List Paragraph, P149): `Overview`

Body text (P151):
> PPA 2006 and IRS guidance provided certain transition rules about the dates
> restrictions from Section 436 would first be applied. The financial crisis
> of 2008 resulted in additional legislation which allowed plans not to
> implement Section 436 restrictions in some circumstances in plan years
> beginning in 2009 and 2010 due to asset values which had been depressed by
> the crisis. Please see Benefit Limitations Under PPA 2006 – Section 436 for
> more information. PBGC should only implement restrictions not implemented by
> the plan during this period if there's convincing evidence that the plan
> administrator failed to follow IRC Section 436 properly.

Body text (P153, CARES Act):
> Additional temporary relief was also provided by the Coronavirus Aid, Relief,
> and Economic Security Act (CARES Act). Section 3608(b) of the CARES Act
> provides that for purposes of applying § 436 of the Code (and § 206(g) of
> ERISA), a plan sponsor may elect to treat the plan's AFTAP for the last plan
> year ending before January 1, 2020, as the AFTAP for plan years that include
> calendar year 2020. (Internal Revenue Bulletin 2020-35.)

No tags, no checkboxes in this section. It is fixed reference text.

## 11. CBA section (P154–P172)

Sub-heading (List Paragraph, P154): `Collective Bargaining`

Body text (P156):
> The 436 Evaluation previously contained this section on the Collectively
> Bargained Plan Exception for plan years beginning before January 1, 2010.
> This section now only needs to be included in Part 2 if it is the reason
> that a 436 restriction would not be applied in the 2008 or 2009 Plan Years.

Exception text (P158–P161):
> Collectively Bargained Plan Exception: Under 29 CFR §1.436-1(k)(2),
> application of the §436 limitations was deferred for plans maintained
> pursuant to a collective bargaining agreement (CBA) that was ratified before
> 01/01/2008 and was in effect as of 01/01/2008 (the 'CBA exception').
> This exception applied until the earlier of:
> - the first plan year following the expiration date of the CBA (determined
>   without regard to any extension agreed upon after 08/17/2006), and
> - the plan year beginning in 2010.

Example (P162):
> For example, if the CBA was effective from 04/01/2004 – 03/31/2007, a letter
> of agreement between the company and the bargaining unit extending the CBA to
> 03/31/2010 is not sufficient. A new CBA must have been ratified before
> 01/01/2008.

Guidance pointer (P164):
> For guidance on plans that cover bargaining unit and non-bargaining unit
> employees, see TP 14 §436 Benefit Limitations.

**The CBA question** (P165, List Paragraph):
> Based on plan records, and/or according to the prior plan administrator, was
> the plan maintained pursuant to CBA as described under 26 CFR §1.436-1(k)(2)?

Options (literal `[ ]` text, no tags):
- `[ ] No` (Go to Part 3: AFTAP Table)
- `[ ] Yes` (Discuss any issues regarding the CBA, as needed.)

Instruction (P170, List Paragraph): `Identify the CBA in effect on 01/01/2008.`

Then Table 3 (see §4 above). Table 3 is a single row, not a loop.

**Build note:** the CBA Yes/No is auto-answerable from the Table 3 dates
(ratified before 01/01/2008 AND in effect on 01/01/2008 → Yes). The app also
computes the exception end date (earlier of first plan year after CBA
expiration, or plan year beginning in 2010).

## 12. Sample language sections (reference text, no tags)

These sections are fixed reference text for the actuary. They contain example
values and real case names/numbers from other cases — **do not copy their data
into the app**. The app uses them only as wording patterns for Part 4 drafts
and Part 2 narrative.

### Sample Additional Information Language for Part 2 (P173–P229)

Heading 1 (P173): `Sample Additional Information Language for Part 2 Further Evaluation`

- P174 (List Paragraph): `AFTAP Certifications`
- P176–P184: 5 sample paragraphs on missing/late/recertified/range AFTAPs.
- P186 (List Paragraph): `Collectively Bargained Plan Exception`
- P188, P190: 2 sample paragraphs on the CBA exception.
- P192–P227: 36 blank Body Text paragraphs (P227 contains a horizontal line shape).
- Footnote 3 (P228, Normal, plain text):
  > 3 If the prior plan sponsor or prior plan actuary cannot provide a complete
  > history of AFTAPs from PY 2008, please search for 5500s at
  > https://www.efast.dol.gov/

### Sample Language for Part 4 436 Determination (P230–P294)

Heading 1 (P230): `Sample Language for Part 4 436 Determination`

- P231: `Sample Language for Section 436(b)` — P233: 1 paragraph.
- P233 (same paragraph, run-on): `Sample Language for Section 436(c)` — P234–P244:
  7 paragraphs (no amendment; 2008 transition rule; CBA exception; amendment
  taken into account by AFTAP; three benefit increases; compensation-based
  increases with wage ranges; five-year rule).
- P246: `Sample Language for Section 436(d)` — P247–P259: 9 paragraphs
  (no prohibited payments; two period-by-period limitation schedules;
  administrator-implemented restriction; lump sums paid while limited,
  referred to OCC).
- P262: `Sample Language for Section 436(e)` — P264–P294: 13 paragraphs
  (freeze dates; 2008 transition rule; WRERA AFTAP substitution; restoration
  assumption under Internal Guidance; CBA exception; five-year rule;
  former 412(e)(3) plans).
- P287: `Sample Language for Former 412(e)(3) plans converted to traditional
  defined benefit plans` — P288–P294: 4 paragraphs.

## 13. Build notes for v0.1.0

1. Only 31 tags exist, all in `word/document.xml`. Tag substitution alone
   fills the memo header + the 3 data tables. Everything else (Part 1
   checkboxes, Part 4 text, Part 5 names/dates, CBA Yes/No) needs direct
   paragraph manipulation.
2. Part 1 checkboxes are literal `[ ]` text. The generator must mark the
   chosen option (e.g. `[X]`) and leave the others, or delete the unchosen
   options — build decision.
3. Part 4 has 9 blank paragraphs (3 + 3 + 2 + 1) under the four subsection
   headings. The app drafts the determination into them.
4. Part 5 has no tags and no text fields. Names/dates go into blank paragraphs
   above the line shapes. Do not delete the line shapes.
5. Table 1 and Table 2 are loops (one row per year / per period). Table 3 is a
   single row, not a loop.
6. `[[plan_year]]` is used in both Table 1 and Table 2 — same name, two loops.
   The data model must keep the two loops' `plan_year` values separate.
7. `[[aftap_display]]` (Table 1) vs `[[aftap_pct]]` (Table 2) are different
   tags. Table 1 shows the certified/stated AFTAP as displayed; Table 2 shows
   the computed AFTAP % per period.
8. The footer version stamp is `Version of 11/25/2025`. The template file was
   modified 2026-07-27. If a newer template appears, re-run this inventory.
9. The "See Example on page 8" reference in Part 3 points to an example table
   that is not in this file. Do not reconstruct it from the Nov 2025 file's data.
10. No tags exist for: Part 1 answers, Part 4 text, Part 5 signatures,
    CBA Yes/No, relief elections (WRERA / CARES Act), bankruptcy flag,
    4022 maximum amount, UCEB details, amendment details, prohibited-payment
    details, accrual dates. All of these are app data or app logic, not
    template tags.
