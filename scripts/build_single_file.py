#!/usr/bin/env python3
"""Build the single-file 436 Generator.

Injects prompts/436-scraper-prompt.md into 436-generator.html (the
A36_SCRAPER_PROMPT placeholder) and runs safety checks:

- 0 fetch(, 0 <script src, 0 <link, 0 external URLs in the HTML
- no duplicate top-level function/var declarations in the <script>

Usage:
  python3 scripts/build_single_file.py [--version V]
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "436-generator.html"
PROMPT = ROOT / "prompts" / "436-scraper-prompt.md"


def fail(msg):
    print(f"BUILD FAILED: {msg}", file=sys.stderr)
    sys.exit(1)


def main():
    version = None
    if "--version" in sys.argv:
        i = sys.argv.index("--version")
        if i + 1 >= len(sys.argv):
            fail("--version needs a value")
        version = sys.argv[i + 1]

    html = HTML.read_text(encoding="utf-8")
    prompt = PROMPT.read_text(encoding="utf-8")

    # 1. Inject the prompt between the PROMPT markers (idempotent —
    # re-running replaces the previously injected string).
    start = html.find("/* PROMPT-START */")
    end = html.find("/* PROMPT-END */")
    if start < 0 or end < 0 or end <= start:
        fail("prompt markers not found in 436-generator.html")
    end += len("/* PROMPT-END */")
    replacement = (
        "/* PROMPT-START */\nvar A36_SCRAPER_PROMPT = "
        + json.dumps(prompt)
        + ";\n/* PROMPT-END */"
    )
    html = html[:start] + replacement + html[end:]

    # 2. Version bump, if requested.
    if version:
        html = re.sub(
            r'var A36_VERSION = "[^"]*";',
            f'var A36_VERSION = "{version}";',
            html,
            count=1,
        )
        html = html.replace("v0.1.0", f"v{version}")

    # 3. No duplicate top-level function/var declarations.
    m = re.search(r"<script>(.*)</script>", html, re.S)
    if not m:
        fail("no <script> block found")
    script = m.group(1)
    seen = {}
    for line in script.splitlines():
        fm = re.match(r"^(?:function|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)", line)
        if fm:
            name = fm.group(1)
            if name in seen:
                fail(f"duplicate top-level declaration: {name}")
            seen[name] = True

    # 4. No external references.
    if "fetch(" in script:
        fail("script contains fetch(")
    if "<script src" in html or "<link" in html:
        fail("HTML contains <script src or <link")
    # OOXML namespace URIs (schemas.openxmlformats.org) are identifiers
    # inside the .docx strings, not fetches — strip them before checking.
    clean = html.replace("http://schemas.openxmlformats.org/", "")
    for pat in ("http://", "https://"):
        if pat in clean:
            fail(f"HTML contains external URL ({pat})")

    HTML.write_text(html, encoding="utf-8")
    print(f"Built {HTML.name}: {len(html)} bytes, prompt embedded ({len(prompt)} chars)")


if __name__ == "__main__":
    main()
