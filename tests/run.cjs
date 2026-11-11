"use strict";
/* 436 Generator v0.1.0 — test runner.
   Loads the single <script> block of 436-generator.html into a Node vm
   (no DOM — the pure logic only) and checks the AFTAP period builder,
   thresholds, Part 1 logic, CBA exception, Part 4 draft, validation,
   and the .docx bytes.
   Run: node tests/run.cjs   (exits non-zero on any failure) */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "436-generator.html"), "utf-8");
const m = html.match(/<script>([\s\S]*)<\/script>/);
if (!m) { console.error("FAIL: no <script> block in 436-generator.html"); process.exit(1); }
const script = m[1];

const sandbox = {
  console,
  TextEncoder,
  Blob: class {},
  URL: { createObjectURL: () => "", revokeObjectURL: () => {} },
  File: class {},
  setTimeout,
};
vm.createContext(sandbox);
try {
  vm.runInContext(script, sandbox, { filename: "436-generator.html" });
} catch (e) {
  console.error("FAIL: script did not load:", e.message);
  process.exit(1);
}
const A36 = sandbox.A36;
if (!A36) { console.error("FAIL: globalThis.A36 not exported"); process.exit(1); }

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log("  ok  " + name); }
  else { fail++; console.log("FAIL  " + name + (extra ? " — " + extra : "")); }
}
function clone(o) { return JSON.parse(JSON.stringify(o)); }

console.log("436 Generator v" + A36.VERSION + " — tests");

/* --- 1. Demo data + validation --- */
check("demo case is the synthetic Summit plan", A36.DEMO_CASE.planName === "Summit Manufacturing Pension Plan");
check("demo case number is text 11223344", A36.DEMO_CASE.caseNumber === "11223344");
check("demo DOPT is 2013-06-30", A36.DEMO_CASE.dopt === "2013-06-30");
check("demo history has 4 rows", A36.DEMO_HISTORY.length === 4);
check("demo history validates", A36.validateHistory(A36.DEMO_HISTORY).errors.length === 0);
check("demo case validates", A36.validateCase(A36.DEMO_CASE).errors.length === 0);
check("empty history is rejected", A36.validateHistory([]).errors.length > 0);
check("AFTAP over 100 is rejected", A36.validateHistory([{ planYear: 2008, aftap: 101, certDate: "2008-09-15", source: "Certification" }]).errors.length > 0);
check("duplicate plan year is rejected", A36.validateHistory([
  { planYear: 2008, aftap: 70, certDate: "2008-09-15", source: "Certification" },
  { planYear: 2008, aftap: 71, certDate: "2008-09-15", source: "Certification" }
]).errors.length > 0);
check("bad source is rejected", A36.validateHistory([{ planYear: 2008, aftap: 70, certDate: "2008-09-15", source: "Word of mouth" }]).errors.length > 0);
check("case without DOPT is rejected", A36.validateCase({ planName: "X", caseNumber: "1" }).errors.length > 0);

/* --- 2. Part 3 table — demo fixture (14 periods, hand-computed) ---
   2012 re-derived per Reg. (h)(1)(iii)(A): 2011 was never certified and
   ended conclusively <60%, so 2012 starts <60% (the chain breaks) until
   the 85% certification on 2012-05-01. */
const expected = [
  [1, 2008, "N/A", "N/A", "2008-01-01", "2008-09-14"],
  [2, 2008, "72.5%", "Actual", "2008-09-15", "2008-12-31"],
  [3, 2009, "72.5%", "Presumed", "2009-01-01", "2009-02-19"],
  [4, 2009, "81.25%", "Actual", "2009-02-20", "2009-12-31"],
  [5, 2010, "81.25%", "Presumed", "2010-01-01", "2010-03-31"],
  [6, 2010, "71.25%", "Presumed", "2010-04-01", "2010-09-14"],
  [7, 2010, "69.8%", "Actual", "2010-09-15", "2010-12-31"],
  [8, 2011, "69.8%", "Presumed", "2011-01-01", "2011-03-31"],
  [9, 2011, "59.8%", "Presumed", "2011-04-01", "2011-09-30"],
  [10, 2011, "< 60%", "Presumed", "2011-10-01", "2011-12-31"],
  [11, 2012, "< 60%", "Presumed", "2012-01-01", "2012-04-30"],
  [12, 2012, "85%", "Actual", "2012-05-01", "2012-12-31"],
  [13, 2013, "85%", "Presumed", "2013-01-01", "2013-03-31"],
  [14, 2013, "75%", "Presumed", "2013-04-01", "2013-06-30"],
];
const res = A36.buildPeriods(clone(A36.DEMO_HISTORY), "01-01", "2013-06-30", null);
check("demo builds 14 periods", res.periods.length === 14, "got " + res.periods.length);
check("demo builds with no errors", res.errors.length === 0, res.errors.join("; "));
let fixtureOk = res.periods.length === expected.length;
expected.forEach((e, i) => {
  const p = res.periods[i];
  if (!p || p.period !== e[0] || p.planYear !== e[1] || p.aftapDisplay !== e[2] || p.basis !== e[3] || p.startDate !== e[4] || p.endDate !== e[5]) fixtureOk = false;
});
check("demo periods match the hand-computed fixture (14/14)", fixtureOk);
check("periods are contiguous (each starts the day after the last ends)", res.periods.every((p, i) => {
  if (i === 0) return p.startDate === "2008-01-01";
  const prev = res.periods[i - 1];
  const d = new Date(prev.endDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + 1);
  return p.startDate === d.toISOString().slice(0, 10);
}));
check("last period ends at DOPT", res.periods[res.periods.length - 1].endDate === "2013-06-30");

/* --- 3. Late certification ---
   Reg. (h)(1)(ii)(B): a certification dated on/after Oct 1 of its plan
   year is treated as no certification for its own year. The next year
   starts at the presumption on the last day of the prior year (<60%),
   NOT at the late certified value. The (h)(2) band test still uses the
   certified value, so April steps down to 53.36%. With the proviso
   (lateCounts: the cert took UCEBs/amendments into account), the late
   value DOES supply the next year's start. */
const late = A36.buildPeriods([
  { planYear: 2009, aftap: 88.67, certDate: "2009-03-12", source: "Certification", kind: "certified" },
  { planYear: 2010, aftap: 63.36, certDate: "2010-11-29", source: "Certification", kind: "certified" },
], "01-01", "2011-12-31", null);
check("late cert: 2010 has no Actual period", !late.periods.some((p) => p.planYear === 2010 && p.basis === "Actual"));
check("late cert: 2010 Oct–Dec is conclusively <60%", late.periods.some((p) => p.planYear === 2010 && p.aftapDisplay === "< 60%" && p.startDate === "2010-10-01"));
check("late cert: 2011 starts <60% (chain breaks)", late.periods.some((p) => p.planYear === 2011 && p.aftapDisplay === "< 60%" && p.startDate === "2011-01-01" && p.endDate === "2011-03-31"));
check("late cert: 2011 steps down to 53.36% in April", late.periods.some((p) => p.planYear === 2011 && p.aftapDisplay === "53.36%" && p.startDate === "2011-04-01"));
check("late cert: 2011 Oct–Dec is conclusively <60%", late.periods.some((p) => p.planYear === 2011 && p.aftapDisplay === "< 60%" && p.startDate === "2011-10-01"));
const lateProviso = A36.buildPeriods([
  { planYear: 2009, aftap: 88.67, certDate: "2009-03-12", source: "Certification", kind: "certified" },
  { planYear: 2010, aftap: 63.36, certDate: "2010-11-29", source: "Certification", kind: "certified", lateCounts: true },
], "01-01", "2011-12-31", null);
check("late proviso: 2011 starts at the late 63.36%", lateProviso.periods.some((p) => p.planYear === 2011 && p.aftapDisplay === "63.36%" && p.basis === "Presumed" && p.startDate === "2011-01-01"));
check("late proviso: 2011 steps down to 53.36% in April", lateProviso.periods.some((p) => p.planYear === 2011 && p.aftapDisplay === "53.36%" && p.startDate === "2011-04-01"));

/* --- 3b. April 1 step-down bands (Reg. (h)(2)) ---
   The step-down applies only when the prior-year AFTAP is in [60,70)
   or [80,90) — or [70,80) in the first effective plan year. */
function bandCase(priorAftap, year) {
  return A36.buildPeriods([
    { planYear: year - 1, aftap: priorAftap, certDate: (year - 1) + "-02-01", source: "Certification", kind: "certified" },
  ], "01-01", year + "-12-31", null).periods.filter((p) => p.planYear === year);
}
check("band: prior 75% does NOT step down", bandCase(75, 2010).every((p) => p.aftapDisplay !== "65%"));
check("band: prior 85% steps down to 75% in April", bandCase(85, 2010).some((p) => p.aftapDisplay === "75%" && p.startDate === "2010-04-01"));
check("band: prior 65% steps down to 55% in April", bandCase(65, 2010).some((p) => p.aftapDisplay === "55%" && p.startDate === "2010-04-01"));
check("band: prior 95% does NOT step down", bandCase(95, 2010).every((p) => p.aftapDisplay !== "85%"));
check("band: prior exactly 70% does NOT step down", bandCase(70, 2010).every((p) => p.aftapDisplay !== "60%"));
check("band: prior exactly 80% steps down to 70%", bandCase(80, 2010).some((p) => p.aftapDisplay === "70%" && p.startDate === "2010-04-01"));
check("band: prior exactly 60% steps down to 50%", bandCase(60, 2010).some((p) => p.aftapDisplay === "50%" && p.startDate === "2010-04-01"));
check("band: first effective year 2008, prior 75% steps down", (() => {
  const ps = A36.buildPeriods([
    { planYear: 2007, aftap: 75, certDate: "2007-06-01", source: "Certification", kind: "certified" },
  ], "01-01", "2008-12-31", null).periods.filter((p) => p.planYear === 2008);
  return ps.some((p) => p.aftapDisplay === "65%" && p.startDate === "2008-04-01");
})());

/* --- 3c. Step-down timing (Reg. (h)(2)(iii)–(iv)) ---
   Prior-year certification issued on/after April 1 of the current year:
   the step-down starts on that certification date, not April 1. */
check("timing: step-down starts on the late prior cert date", (() => {
  const ps = A36.buildPeriods([
    { planYear: 2009, aftap: 88, certDate: "2009-02-01", source: "Certification", kind: "certified" },
    { planYear: 2010, aftap: 85, certDate: "2011-05-15", source: "Certification", kind: "certified" },
  ], "01-01", "2011-12-31", null).periods.filter((p) => p.planYear === 2011);
  /* 2011 starts <60% (2010 ended <60%); band test on the certified 85%
     gives a step-down to 75% starting on the prior cert date 2011-05-15. */
  return ps.some((p) => p.aftapDisplay === "75%" && p.startDate === "2011-05-15");
})());

/* --- 3d. Range certifications (Reg. (h)(4)(ii)) ---
   A range governs at its floor; it prevents the step-down if issued
   before April 1; with no specific certification by year-end the AFTAP
   is deemed <60% from October 1. A specific certification supersedes it
   from its own date. */
const rangeStood = A36.buildPeriods([
  { planYear: 2009, aftap: 65, certDate: "2009-02-01", source: "Certification", kind: "certified" },
  { planYear: 2010, aftap: 60, certDate: "2010-03-15", source: "Certification", kind: "range" },
], "01-01", "2010-12-31", null);
check("range: floor governs as 60% (range)", rangeStood.periods.some((p) => p.planYear === 2010 && p.aftapDisplay === "60% (range)" && p.basis === "Actual"));
check("range: no step-down on top of a pre-April-1 range cert", !rangeStood.periods.some((p) => p.planYear === 2010 && p.aftapDisplay === "55%"));
check("range: deemed <60% from Oct 1 with no specific cert", rangeStood.periods.some((p) => p.planYear === 2010 && p.aftapDisplay === "< 60%" && p.startDate === "2010-10-01"));
const rangeSuper = A36.buildPeriods([
  { planYear: 2009, aftap: 65, certDate: "2009-02-01", source: "Certification", kind: "certified" },
  { planYear: 2010, aftap: 60, certDate: "2010-03-15", source: "Certification", kind: "range", specificAftap: 72, specificCertDate: "2010-08-01" },
], "01-01", "2010-12-31", null);
check("range superseded: specific 72% governs from Aug 1", rangeSuper.periods.some((p) => p.planYear === 2010 && p.aftapDisplay === "72%" && p.startDate === "2010-08-01"));
check("range superseded: no Oct 1 <60% (specific by year-end)", !rangeSuper.periods.some((p) => p.planYear === 2010 && p.aftapDisplay === "< 60%"));

/* --- 3e. Recertifications (Reg. (h)(4)(iii)–(iv)) ---
   Material: the amended value applies retroactively to the earlier
   certification date. Immaterial: the original value governs until the
   amended certification date. */
const recertMat = A36.buildPeriods([
  { planYear: 2009, aftap: 90, certDate: "2009-02-01", source: "Certification", kind: "certified" },
  { planYear: 2010, aftap: 70, certDate: "2010-09-01", source: "Certification", kind: "recertified", priorAftap: 85, priorCertDate: "2010-02-01", material: true },
], "01-01", "2010-12-31", null);
check("recert material: amended 70% governs from Feb 1", recertMat.periods.some((p) => p.planYear === 2010 && p.aftapDisplay === "70%" && p.startDate === "2010-02-01"));
check("recert material: original 85% never governs", !recertMat.periods.some((p) => p.planYear === 2010 && p.aftapDisplay === "85%"));
const recertImmat = A36.buildPeriods([
  { planYear: 2009, aftap: 90, certDate: "2009-02-01", source: "Certification", kind: "certified" },
  { planYear: 2010, aftap: 70, certDate: "2010-09-01", source: "Certification", kind: "recertified", priorAftap: 85, priorCertDate: "2010-02-01", material: false },
], "01-01", "2010-12-31", null);
check("recert immaterial: original 85% governs Feb–Aug", recertImmat.periods.some((p) => p.planYear === 2010 && p.aftapDisplay === "85%" && p.startDate === "2010-02-01" && p.endDate === "2010-08-31"));
check("recert immaterial: amended 70% governs from Sep 1", recertImmat.periods.some((p) => p.planYear === 2010 && p.aftapDisplay === "70%" && p.startDate === "2010-09-01"));

/* --- 4. Thresholds --- */
function th(aftapDisplay, aftapPct) { return A36.thresholds({ aftapDisplay, aftapPct, basis: "Actual" }); }
check("75% blocks (c) only", (() => { const t = th("75%", 75); return !t.b && t.c && !t.d && t.dCap && !t.e; })());
check("55% blocks (b), (d), (e) and (c)", (() => { const t = th("55%", 55); return t.b && t.c && t.d && !t.dCap && t.e; })());
check("85% blocks nothing", (() => { const t = th("85%", 85); return !t.b && !t.c && !t.d && !t.dCap && !t.e; })());
check("<60% blocks everything", (() => { const t = th("< 60%", null); return t.b && t.c && t.d && t.e; })());
check("N/A blocks nothing (no AFTAP to apply)", (() => { const t = th("N/A", null); return t.na && !t.b && !t.c && !t.d && !t.e; })());
check("aftapAt finds the period for a date", (() => {
  const p = A36.aftapAt(res.periods, "2010-05-01");
  return p && p.planYear === 2010 && p.aftapDisplay === "71.25%";
})());
check("aftapAt returns null outside the table", A36.aftapAt(res.periods, "2007-06-01") === null);

/* --- 5. Part 1 preliminary determination --- */
check("all No/N/A means no limitation", A36.preliminary({ b: "no", c: "na", d: "no", e: "na" }).applies === false);
check("one Yes means continue to Part 2", A36.preliminary({ b: "no", c: "no", d: "yes", e: "no" }).applies === true);
check("demo answers (d Yes) mean continue", A36.preliminary(A36.DEMO_ANSWERS).applies === true);

/* --- 6. CBA exception --- */
check("CBA ratified 2007, in effect 01/01/2008 applies", A36.cbaApplies({ ratificationDate: "2007-06-01", effectiveDate: "2007-01-01", expirationDate: "2009-12-31" }).applies === true);
check("CBA expiring 2009 ends at first plan year after expiration", A36.cbaApplies({ ratificationDate: "2007-06-01", effectiveDate: "2007-01-01", expirationDate: "2009-12-31" }).endDate === "2010-01-01");
check("CBA ratified 2008 does not apply", A36.cbaApplies({ ratificationDate: "2008-03-01", effectiveDate: "2008-01-01", expirationDate: "2010-12-31" }).applies === false);
check("CBA expired before 2008 does not apply", A36.cbaApplies({ ratificationDate: "2004-01-01", effectiveDate: "2004-01-01", expirationDate: "2007-12-31" }).applies === false);
check("CBA missing dates does not apply", A36.cbaApplies({}).applies === false);

/* --- 7. Part 4 draft --- */
const draft = A36.draftPart4({ b: "no", c: "no", d: "yes", e: "no" }, res.periods, {});
check("draft (b) says no UCEB", draft.b.indexOf("did not provide a UCEB") >= 0);
check("draft (d) mentions the 50% cap", draft.d.indexOf("50%") >= 0);
check("draft (d) cites the AFTAP at a payment date", (() => {
  const d2 = A36.draftPart4({ b: "no", c: "no", d: "yes", e: "no" }, res.periods, { paymentDates: [{ date: "2010-05-01", description: "lump sum" }] });
  return d2.d.indexOf("71.25%") >= 0;
})());

/* --- 8. .docx bytes --- */
const docxData = {
  caseData: clone(A36.DEMO_CASE),
  history: clone(A36.DEMO_HISTORY),
  periods: res.periods,
  answers: clone(A36.DEMO_ANSWERS),
  draft: A36.draftPart4(A36.DEMO_ANSWERS, res.periods, {}),
  cba: clone(A36.DEMO_CBA),
};
const bytes = A36.buildDocxBytes(docxData);
check("docx bytes are a Uint8Array (cross-realm view)", ArrayBuffer.isView(bytes) && bytes.constructor.name === "Uint8Array");
check("docx starts with PK (zip)", bytes[0] === 0x50 && bytes[1] === 0x4B);
const xml = A36.buildDocumentXml(docxData);
check("document.xml has the plan name", xml.indexOf("Summit Manufacturing Pension Plan") >= 0);
check("document.xml has the case number", xml.indexOf("11223344") >= 0);
check("document.xml has Part 1 with the (d) Yes checked", xml.indexOf("[X] Yes") >= 0);
check("document.xml has 15 Part 3 rows", (xml.match(/<w:tr>/g) || []).length >= 15 + 4 + 1);
check("document.xml has the Part 3 AFTAP values", xml.indexOf("71.25%") >= 0 && xml.indexOf("&lt; 60%") >= 0);
check("document.xml has Part 4 draft text", xml.indexOf("Section 436(d):") >= 0);
check("document.xml has Part 5 signature lines", xml.indexOf("Actuarial Reviewer") >= 0 && xml.indexOf("Actuarial Technical Reviewer") >= 0);
check("docx filename is case + 436", A36.docxFilename(A36.DEMO_CASE) === "11223344436.docx");
check("docx filename falls back without a case", A36.docxFilename({}) === "436.docx");

/* --- 9. LLM JSON import validation --- */
function importObj(over){
  var o = {
    version: "0.2.0",
    caseData: clone(A36.DEMO_CASE),
    history: clone(A36.DEMO_HISTORY),
    answers: clone(A36.DEMO_ANSWERS),
    cba: clone(A36.DEMO_CBA),
    facts: {}
  };
  if(over) Object.keys(over).forEach(function(k){ o[k] = over[k]; });
  return o;
}
check("valid import validates with 0 errors", A36.validateImport(importObj()).errors.length === 0);
check("valid import summary has 4 rows", A36.validateImport(importObj()).summary.rows === 4);
check("valid import summary has the case number", A36.validateImport(importObj()).summary.caseNumber === "11223344");
check("import without history is rejected", A36.validateImport(importObj({ history: undefined })).errors.length > 0);
check("import without caseData is rejected", A36.validateImport(importObj({ caseData: undefined })).errors.length > 0);
check("import with a bad answer is rejected", A36.validateImport(importObj({ answers: { b: "no", c: "no", d: "maybe", e: "no" } })).errors.length > 0);
check("import with a bad kind is rejected", A36.validateImport(importObj({ history: [{ planYear: 2008, aftap: 70, certDate: "2008-09-15", source: "Certification", kind: "guess" }] })).errors.length > 0);
check("import with a bad CBA date is rejected", A36.validateImport(importObj({ cba: { ratificationDate: "2008/01/01" } })).errors.length > 0);
check("import with a non-numeric 4022 max is rejected", A36.validateImport(importObj({ facts: { f4022Max: "lots" } })).errors.length > 0);
check("import of a non-object is rejected", A36.validateImport("hello").errors.length > 0);
check("import of null is rejected", A36.validateImport(null).errors.length > 0);

/* --- 10. No external calls in the HTML --- */
check("no fetch( in the HTML", html.indexOf("fetch(") < 0);
check("no <script src in the HTML", html.indexOf("<script src") < 0);
check("no <link in the HTML", html.indexOf("<link") < 0);
const clean = html.replace(/http:\/\/schemas\.openxmlformats\.org\//g, "");
check("no external URLs in the HTML", clean.indexOf("http://") < 0 && clean.indexOf("https://") < 0);

console.log("\n" + pass + " passing, " + fail + " failing");
if (fail) process.exit(1);
