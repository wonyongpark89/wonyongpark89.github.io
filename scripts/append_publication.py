#!/usr/bin/env python3
"""
Append a publication entry into publications.html under the chosen category heading.

Designed to run in GitHub Actions. It:
- reads publications.html
- finds <h2 class=\"category-heading\">...</h2> matching category
- inserts a new <div class=\"item\">...</div> immediately after that heading (at top of that category)
"""

from __future__ import annotations

import argparse
import html
import re
from pathlib import Path


CATEGORIES = {
    "Edited Special Issues",
    "Articles",
    "Books",
    "Book Chapters",
    "Opinions and Practitioner Pieces",
    "Technical Reports",
}


def build_item_block(label: str, entry_html: str) -> str:
    # label is plain text; entry_html can contain HTML (trusted by repo owner)
    safe_label = html.escape(label.strip() or "New")
    entry = entry_html.strip()

    block = (
        "\n        <div class=\"item\">\n"
        f"            <span class=\"item-meta\">{safe_label}</span>\n"
        f"            <p class=\"pub-text\">{entry}</p>\n"
        "        </div>\n"
    )
    return block


def insert_after_heading(doc: str, heading: str, item_block: str) -> str:
    # Match the first occurrence of that category heading exactly
    pattern = rf"(<h2 class=\"category-heading\">{re.escape(heading)}</h2>)"
    m = re.search(pattern, doc)
    if not m:
        raise SystemExit(f'Could not find category heading: "{heading}"')

    insert_pos = m.end(1)
    return doc[:insert_pos] + item_block + doc[insert_pos:]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--file", default="publications.html", help="Path to publications.html")
    ap.add_argument("--category", required=True, help="One of the category headings")
    ap.add_argument("--label", default="New", help="e.g. 2026 / In Press / Under Review")
    ap.add_argument("--entry", required=True, help="HTML for a single <p class='pub-text'>...</p> body (without outer <p>)")
    args = ap.parse_args()

    category = args.category.strip()
    if category not in CATEGORIES:
        raise SystemExit(f"Unknown category: {category}. Allowed: {sorted(CATEGORIES)}")

    path = Path(args.file)
    doc = path.read_text(encoding="utf-8")

    item_block = build_item_block(args.label, args.entry)
    updated = insert_after_heading(doc, category, item_block)

    path.write_text(updated, encoding="utf-8")


if __name__ == "__main__":
    main()
