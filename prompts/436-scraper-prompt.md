# 436 — Section 436 Limitations Scraper Prompt

Use this prompt with an LLM of your choice. Attach the plan documents
**and** the other associated documents — plan document, amendments,
restatements, SPD, trust agreement, actuarial valuation reports (AVR),
AFTAP certifications, Form 5500 Schedule SB, TWG memo, trusteeship
agreement, prior administrator data, collective bargaining agreement,
anything about the plan — together with this prompt. The LLM must return
**only** the JSON payload described below. That JSON is a *proposal*: it
is fed back into the 436 Generator app, validated against
`schema/436.schema.json`, reviewed by a human, and only approved JSON is
used to write the §436 Evaluation Word document. The LLM never fills the
Word document and never certifies an AFTAP. PBGC will not calculate or
certify a plan's AFTAP.

## Your task

You are gathering the inputs for a §436 Evaluation for a terminated
single-employer defined-benefit pension plan. Find:

1. **Case header.** Plan name, EIN/PIN, PBGC case number, DOPT, DOTR,
   BPD, DOBF (plan date of benefit freeze), FD-PY, plan year start
   (month-day), plan adoption date.
2. **AFTAP history.** For each plan year from the later of the plan
   adoption date and PY2007: the certified AFTAP %, the signed
   certification date, the source, and the Image Viewer document number.
   Where no certification exists, give the AFTAP stated in the AVR or
   Form 5500 Schedule SB and say so. Flag range certifications (give
   the range), late certifications (certified on/after Oct 1 of that
   plan year), and recertifications (original value and date, amended
   value and date, whether the change was material).
3. **Part 1 answers.** For each of (b), (c), (d), (e), answer No, N/A,
   or Yes, and give the facts behind the answer:
   - (b) Did the plan provide a UCEB (early unreduced benefits or
     temporary supplements due to a plant shutdown) for an event on or
     after FD-PY2008 and before DOPT? Describe the UCEB, the group,
     the event dates, and whether the plan paid it.
   - (c) Did amendments increasing benefit liabilities have an adoption
     or effective date on or after the later of the plan's adoption date
     and FD-PY2008 and before DOPT? Give each amendment's dates,
     description, and whether it took effect. Note the N/A reasons:
     plan in effect less than five full plan years; increase only for
     future periods (on or after DOPT); mandatory vesting increase;
     only §401(a)(17) compensation limits.
   - (d) Did the plan provide prohibited payments (non-de minimis lump
     sums, period-certain benefits, non-life-annuity forms) with an ASD
     or BCD on or after the later of the plan's adoption date and
     FD-PY2008? List each payment and its date. Note if benefits did
     not accrue on or after 09/01/2005 (state the date accruals ceased).
   - (e) Did benefits accrue for any participant on or after the later
     of the plan's adoption date and FD-PY2008? Give the accrual freeze
     date and whether accruals were restored.
4. **CBA.** Was the plan maintained under a collective bargaining
   agreement ratified before 01/01/2008 and in effect on 01/01/2008?
   Give the ratification, effective, and expiration dates and the IPS
   document number.
5. **Other facts.** Sponsor bankruptcy status and dates (for §436(d)(2)).
   Whether the plan was a fully-insured §412(e)(3) plan and, if so, the
   date it converted to a traditional defined benefit plan. The PBGC
   maximum guarantee amount for any participant with a prohibited
   payment (for the (d)(3) cap), if known.

## Rules

- **Summarise, do not copy verbatim — ASD STE 100 minimal style.**
  Every value must be the **smallest string that conveys the meaning**.
  Keep ages, service years, percentages, dollar amounts, and dates
  **exact**. If stripping verbiage would lose meaning (a condition, an
  exception, a date), keep the longer form.
- **Dates are ISO format `YYYY-MM-DD`. Case number is text, with
  leading zeros preserved (never a number).**
- **AFTAP % is a number 0–100.** A range certification goes in `kind`
  "range" with the low bound as `aftap`; if a specific certification
  later superseded the range, give its value and date in
  `specificAftap` and `specificCertDate`. A late certification goes in
  `kind` "late"; say whether it took into account UCEBs and amendments
  that became effective during the plan year before the certification
  (`lateCounts`: true/false). A recertification goes in `kind`
  "recertified" with the original value and date in `priorAftap` and
  `priorCertDate`, the amended value in `aftap` and `certDate`, and
  whether the change was material in `material` (true/false).
- **Citation for every AFTAP row**: the document and the Image Viewer
  document number where the certification or stated AFTAP appears. No
  citation, no present answer.
- **Do not guess.** A missing answer is a correct answer. A guessed
  value is an error. If a certification cannot be found, say so and
  give the AVR or Schedule SB value instead, with the source named.
- **Never return a full masked value** (no full SSN, no full account
  number). This evaluation lists plan-level facts and AFTAPs, not
  participant values.
- **You do not certify an AFTAP.** You report the AFTAPs the enrolled
  actuary certified or the AVR / Schedule SB states, with dates and
  sources.

## Output format

Return **only** valid JSON, no markdown fences, no commentary, no
explanation. The JSON must have exactly these top-level keys:

```json
{
  "version": "0.2.1",
  "caseData": {
    "planName": "string",
    "einPin": "string or null",
    "caseNumber": "string (text, leading zeros preserved)",
    "dopt": "YYYY-MM-DD",
    "dotr": "YYYY-MM-DD or null",
    "bpd": "YYYY-MM-DD or null",
    "dobf": "YYYY-MM-DD or null",
    "fdPy": "MM/DD or null",
    "planYearStart": "MM-DD or null",
    "adoptionDate": "YYYY-MM-DD or null",
    "toName": "string or null",
    "toSection": "string or null",
    "fromName": "string or null",
    "fromSection": "string or null",
    "memoDate": "YYYY-MM-DD or null",
    "subject": "§436 Evaluation"
  },
  "history": [
    {
      "planYear": 2008,
      "aftap": 72.5,
      "certDate": "YYYY-MM-DD or null",
      "source": "Certification | AVR | 5500 SB",
      "ipsRef": "string or null",
      "kind": "certified | range | late | recertified or null",
      "priorAftap": "number or null (recertified only)",
      "priorCertDate": "YYYY-MM-DD or null (recertified only)",
      "material": "true | false | null (recertified only)",
      "specificAftap": "number or null (range only)",
      "specificCertDate": "YYYY-MM-DD or null (range only)",
      "lateCounts": "true | false | null (late only)"
    }
  ],
  "answers": { "b": "no | na | yes", "c": "no | na | yes", "d": "no | na | yes", "e": "no | na | yes" },
  "cba": {
    "ratificationDate": "YYYY-MM-DD or null",
    "effectiveDate": "YYYY-MM-DD or null",
    "expirationDate": "YYYY-MM-DD or null",
    "ipsRef": "string or null"
  },
  "facts": {
    "ucebPaid": true | false | null,
    "accrualsRestored": true | false | null,
    "accrualFreezeDate": "YYYY-MM-DD or null",
    "f4022Max": "number or null",
    "amendmentDates": [{ "date": "YYYY-MM-DD", "description": "string" }],
    "paymentDates": [{ "date": "YYYY-MM-DD", "description": "string" }]
  }
}
```

## Workflow reminder (for the human, not the LLM)

1. Download this prompt from the 436 Generator app.
2. Feed the plan documents and associated documents + this prompt to
   your LLM (Microsoft Copilot in the office, any LLM at home).
3. Take the JSON the LLM returns and upload / paste it back into the
   436 Generator app.
4. The app validates the JSON against the schema, flags missing /
   uncited items, and you review and approve each one.
5. Only approved JSON writes the filled §436 Evaluation Word document.
   The app computes the Part 3 AFTAP table and drafts the Part 4
   conclusions from the approved data. You review the draft before
   download.
