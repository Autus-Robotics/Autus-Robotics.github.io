#!/usr/bin/env python3
"""Dependency-free smoke test for the Autus Robotics static site.

Runs with the standard library only (no pip installs, no network), so it is
safe to use as the no-mistakes `commands.test` gate on a plain GitHub Pages
repo. It checks three things that actually break a static site:

  1. Every .html file is parseable and has the basic document scaffolding
     (<!doctype html>, a <title>, and a <meta charset> / viewport tag).
  2. Every local href/src/link target (pages, CSS, JS, images, favicons,
     OG images) resolves to a file that exists on disk.
  3. No duplicate element ids inside a single document.

External links (http/https/mailto/tel), in-page anchors (#...) and
data: URIs are intentionally skipped. Exit code is non-zero when any
problem is found so the gate fails loudly.
"""
from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent.parent

# Attributes that can carry a URL we want to resolve locally.
URL_ATTRS = {"href", "src", "poster", "data-src"}
# Extensions we treat as HTML documents.
HTML_SUFFIXES = {".html", ".htm"}


class SiteParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.refs: list[tuple[str, int]] = []
        self.ids: list[tuple[str, int]] = []
        self.has_title = False
        self._in_title = False
        self.title_text = ""
        self.has_charset = False
        self.has_viewport = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        line = self.getpos()[0]
        adict = {k: (v or "") for k, v in attrs}
        for attr in URL_ATTRS:
            if attr in adict and adict[attr].strip():
                self.refs.append((adict[attr].strip(), line))
        # srcset can hold several comma-separated candidates.
        if "srcset" in adict and adict["srcset"].strip():
            for candidate in adict["srcset"].split(","):
                url = candidate.strip().split(" ")[0].strip()
                if url:
                    self.refs.append((url, line))
        if "id" in adict and adict["id"].strip():
            self.ids.append((adict["id"].strip(), line))
        if tag == "title":
            self._in_title = True
        if tag == "meta":
            if adict.get("charset"):
                self.has_charset = True
            if adict.get("name", "").lower() == "viewport":
                self.has_viewport = True

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title_text += data
            if data.strip():
                self.has_title = True


def is_local_ref(url: str) -> bool:
    if not url:
        return False
    parsed = urlparse(url)
    if parsed.scheme in {"http", "https", "mailto", "tel", "data", "javascript"}:
        return False
    if url.startswith("#"):
        return False
    if parsed.netloc:  # protocol-relative //cdn...
        return False
    return True


def resolve(html_file: Path, url: str) -> Path:
    # Strip query string and fragment, decode %20 etc.
    path_part = unquote(urlparse(url).path)
    if path_part.startswith("/"):
        return (ROOT / path_part.lstrip("/")).resolve()
    return (html_file.parent / path_part).resolve()


def main() -> int:
    html_files = sorted(
        p for p in ROOT.rglob("*")
        if p.suffix.lower() in HTML_SUFFIXES and ".git" not in p.parts
    )
    if not html_files:
        print("ERROR: no HTML files found under", ROOT)
        return 1

    errors: list[str] = []
    checked_refs = 0

    for html_file in html_files:
        rel = html_file.relative_to(ROOT)
        text = html_file.read_text(encoding="utf-8", errors="replace")

        if "<!doctype html>" not in text.lower():
            errors.append(f"{rel}: missing <!doctype html> declaration")

        parser = SiteParser()
        try:
            parser.feed(text)
        except Exception as exc:  # noqa: BLE001 - report any parse failure
            errors.append(f"{rel}: HTML parse error: {exc}")
            continue

        if not parser.has_title:
            errors.append(f"{rel}: missing non-empty <title>")
        if not parser.has_charset:
            errors.append(f"{rel}: missing <meta charset>")
        if not parser.has_viewport:
            errors.append(f"{rel}: missing <meta name=viewport> (mobile)")

        seen_ids: dict[str, int] = {}
        for el_id, line in parser.ids:
            if el_id in seen_ids:
                errors.append(
                    f"{rel}:{line}: duplicate id '{el_id}' "
                    f"(first seen line {seen_ids[el_id]})"
                )
            else:
                seen_ids[el_id] = line

        for url, line in parser.refs:
            if not is_local_ref(url):
                continue
            checked_refs += 1
            target = resolve(html_file, url)
            if not target.exists():
                errors.append(
                    f"{rel}:{line}: broken local reference '{url}' "
                    f"-> {target.relative_to(ROOT) if ROOT in target.parents else target}"
                )

    print(f"Checked {len(html_files)} HTML file(s), {checked_refs} local reference(s).")
    for f in html_files:
        print("  -", f.relative_to(ROOT))

    if errors:
        print(f"\nFAILED: {len(errors)} problem(s) found:")
        for e in errors:
            print("  x", e)
        return 1

    print("\nOK: site smoke test passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
