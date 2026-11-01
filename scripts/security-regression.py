#!/usr/bin/env python3
"""Deterministic Batch 1 checks for the static website."""

from hashlib import sha256
from html.parser import HTMLParser
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
WRITEUPS = (ROOT / "writeups.html").read_text(encoding="utf-8")
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")


class ReferenceParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ("href", "src"):
            if key in attrs:
                self.references.append(attrs[key])


def check(condition, message):
    if not condition:
        raise AssertionError(message)


check("https://cdn.jsdelivr.net/npm/marked" not in WRITEUPS, "marked CDN remains")
check("assets/vendor/marked/marked.min.js" in WRITEUPS, "local marked bundle is not loaded")
check("assets/vendor/dompurify/purify.min.js" in WRITEUPS, "local DOMPurify bundle is not loaded")
check("markdownContent.replaceChildren(DOMPurify.sanitize(marked.parse(text), sanitizerConfig))" in WRITEUPS, "Markdown is not sanitized before DOM insertion")
check("err.message" not in WRITEUPS, "error details still enter the page")
check("l.innerHTML" not in INDEX, "terminal input still enters innerHTML")
check("tOut.innerHTML" not in INDEX, "terminal clear still uses innerHTML")
check("insertAdjacentHTML" not in WRITEUPS + INDEX, "unsafe HTML insertion API remains")
check("javascript:" not in WRITEUPS + INDEX, "javascript URL remains in page source")

for path, expected_hash in {
    ROOT / "assets/vendor/marked/marked.min.js": "15fabce5b65898b32b03f5ed25e9f891a729ad4c0d6d877110a7744aa847a894",
    ROOT / "assets/vendor/dompurify/purify.min.js": "89e1fa7647cb495370d3a997ace4387f5d15d9f4c5af12352c53daa400956287",
}.items():
    check(path.is_file(), f"missing dependency: {path}")
    check(sha256(path.read_bytes()).hexdigest() == expected_hash, f"hash mismatch: {path}")

posts = {path.stem for path in (ROOT / "posts").glob("*.md")}
linked = set(re.findall(r"writeups\.html\?post=([a-z0-9-]+)", WRITEUPS))
allowed_match = re.search(r"availablePosts = new Set\(\[([^\]]+)\]\)", WRITEUPS)
allowed = set(re.findall(r"'([a-z0-9-]+)'", allowed_match.group(1)))
check(posts == linked == allowed, "post files, links, and allowlist differ")
for post in (ROOT / "posts").glob("*.md"):
    check(post.read_text(encoding="utf-8").count("```") % 2 == 0, f"unbalanced fence: {post}")

parser = ReferenceParser()
for page in ROOT.glob("*.html"):
    parser.feed(page.read_text(encoding="utf-8"))
for reference in parser.references:
    if reference in {"/", ""} or reference.startswith(("#", "http:", "https:", "mailto:", "data:")):
        continue
    local = ROOT / reference.split("?", 1)[0].split("#", 1)[0]
    check(local.is_file(), f"missing local reference: {reference}")

ET.parse(ROOT / "sitemap.xml")
robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
check("Sitemap: https://andarmax.github.io/sitemap.xml" in robots, "robots sitemap is missing")

for source in ROOT.rglob("*"):
    if (
        not source.is_file()
        or ".git" in source.parts
        or "__pycache__" in source.parts
        or source == Path(__file__).resolve()
        or "assets/vendor" in str(source)
        or source.suffix in {".js", ".pyc", ".webp"}
    ):
        continue
    text = source.read_text(encoding="utf-8", errors="ignore")
    check("BEGIN OPENSSH PRIVATE KEY" not in text, f"private key marker: {source}")
    check("BEGIN RSA PRIVATE KEY" not in text, f"private key marker: {source}")
    check("ghp_" not in text and "github_pat_" not in text, f"token marker: {source}")

print("security regression checks: passed")
