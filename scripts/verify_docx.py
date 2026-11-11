#!/usr/bin/env python3
"""Verify the demo .docx: tables, header fields, Part 1 checks, Part 4 draft, Part 5 lines.
Usage: python3 scripts/gen_demo_docx.cjs && python3 scripts/verify_docx.py
"""
import sys
from pathlib import Path

from docx import Document

ROOT = Path(__file__).resolve().parent.parent
PATH = ROOT / "11223344436-demo.docx"

failures = []


def check(name, cond, extra=""):
    print(("  ok  " if cond else "FAIL  ") + name + ((" — " + extra) if extra and not cond else ""))
    if not cond:
        failures.append(name)


d = Document(str(PATH))
check("2 tables", len(d.tables) == 2, f"got {len(d.tables)}")
t0, t1 = d.tables
check("Table 0 is the AFTAP certifications table (5 rows)", len(t0.rows) == 5, f"got {len(t0.rows)}")
check("Table 0 header", [c.text for c in t0.rows[0].cells] == ["Plan Year", "AFTAP", "Certification Date", "IPS Reference Number"])
check("Table 1 is the Part 3 table (16 rows)", len(t1.rows) == 16, f"got {len(t1.rows)}")
check("Table 1 header", [c.text for c in t1.rows[0].cells] == ["Period", "Plan Year", "AFTAP %", "Actual/Presumed", "Effective Dates"])
check("Table 1 has 15 periods", len(t1.rows) - 1 == 15)
check("Table 1 period 1 is N/A", t1.rows[1].cells[2].text == "N/A")
check("Table 1 has a <60% row", any(c.text == "< 60%" for row in t1.rows for c in row.cells))
check("Table 1 last period ends 06/30/2013", "06/30/2013" in t1.rows[-1].cells[4].text)
text = "\n".join(p.text for p in d.paragraphs)
check("plan name present", "Summit Manufacturing Pension Plan" in text)
check("case number present", "11223344" in text)
check("(d) Yes is checked", "[X] Yes" in text)
check("preliminary determination is Yes", "Continue to Part 2" in text)
check("Part 4 draft present", "Section 436(d): the plan provided prohibited payments." in text)
check("Part 5 signature lines present", "Actuarial Reviewer" in text and "Actuarial Technical Reviewer" in text)

print(f"\n{len(failures)} failing" if failures else "\nDemo .docx verified")
sys.exit(1 if failures else 0)
