#!/usr/bin/env python3
"""Validate the public instruction package without network access or dependencies."""
from pathlib import Path
import re
import sys
import hashlib
import tarfile
import json
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = {
    "AGENTS.md", "README.md", "SKILLS.md", ".gitignore",
    "agency-team/README.md", "agency-team/skill-routing.md",
    "agency-team/templates.md", "agency-team/review-notes.md",
    *(f"agency-team/roles/{role}.md" for role in (
        "lead", "seo", "ads", "technical", "implementation", "qa",
        "infrastructure", "laravel", "reviewer", "developer")),
    "agency-team/local-workflow.md", "agency-team/check_local_workflow.py",
    "agency-team/templates/tasks.example.json", "RELEASE-MANIFEST.json",
    "scripts/verify_package.py",
    "runtime-support/README.md", "runtime-support/RESTORE.md",
    "runtime-support/NOTICE.md", "runtime-support/EVIDENCE.md",
    "runtime-support/manifest.json", "runtime-support/installed-vs-npm.patch",
    "runtime-support/doctor.py", "runtime-support/test_doctor.py",
    "runtime-support/licenses/DeepSeek-MIT.txt",
    *(f"runtime-support/snapshots/{package}-0.2.2-rc.1.tar.gz" for package in (
        "agent-team", "tool-agent-team", "client-ui-agent-team", "agent-team-profile")),
    *(f"native-teams/{name}" for name in (
        "README.md", "TESTING.md", "NOTICE.md", "LICENSE", "package.json",
        "index.js", "host-contract.js", "model-route.js", "client.js", "cordis.patch.yml",
        "vendor/service.js", "vendor/tools.js", "pack.py",
        "tests/model-route.test.mjs", "tests/client.test.mjs", "tests/core-loader.mjs",
        "tests/integration.test.mjs", "dist/agency-team-native-0.1.0.tgz", "dist/SHA256SUMS")),
}
errors = []
checked = 0
for name in sorted(REQUIRED):
    path = ROOT / name
    if not path.is_file() or path.is_symlink():
        errors.append(f"Missing or unsafe required file: {name}")

for path in sorted(ROOT.rglob("*")):
    relative = path.relative_to(ROOT)
    # Only top-level repository metadata is outside the public payload.
    if relative.parts[0] == '.git' and not (ROOT / '.git').is_symlink():
        continue
    if '.git' in relative.parts:
        errors.append(f'Nested Git metadata is not publishable: {relative}')
    if path.is_symlink():
        errors.append(f"Symlink is not publishable: {relative}")
    elif path.is_file() and relative.as_posix() not in REQUIRED:
        errors.append(f"Unexpected public file; review before allowlisting: {relative}")

for name in sorted(REQUIRED):
    path = ROOT / name
    if path.suffix != ".md" or not path.is_file():
        continue
    text = path.read_text(encoding="utf-8")
    # Markdown destinations and literal local Markdown paths in inline code.
    references = re.findall(r"\[[^\]]*\]\(<?([^\s)>]+)>?\)", text)
    references += re.findall(r"`((?:\.\.?/)?[\w./-]+\.md)`", text)
    for reference in references:
        parts = urlsplit(reference)
        if parts.scheme or parts.netloc or not parts.path:
            continue
        target = unquote(parts.path)
        # Inline operational paths may be rooted at the package or team root.
        bases = [path.parent] if f"](<{reference}>" in text or f"]({reference})" in text else [path.parent, ROOT, ROOT / "agency-team"]
        candidates = [(base / target).resolve() for base in bases]
        if any(not candidate.is_relative_to(ROOT) for candidate in candidates):
            errors.append(f"Reference escapes package: {name}: {reference}")
        elif not any(candidate.is_file() for candidate in candidates):
            errors.append(f"Broken file reference: {name}: {reference}")
        checked += 1
    # These detect obvious accidental host paths/key material, not all secrets.
    for pattern in (r"/home/[^\s`]+", r"/run/media/[^\s`]+", r"[A-Z]:\\", r"-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----", r"gh[pousr]_[A-Za-z0-9]{20,}"):
        if re.search(pattern, text):
            errors.append(f"Potential private material in {name}: {pattern}")

# The installable artifact must exactly match its reviewed public sources.
addon = ROOT / "native-teams"
archive = addon / "dist/agency-team-native-0.1.0.tgz"
try:
    expected = {"package/" + name.removeprefix("native-teams/") for name in REQUIRED
                if name.startswith("native-teams/")
                and not name.startswith(("native-teams/tests/", "native-teams/dist/"))
                and name != "native-teams/pack.py"}
    checksum = (addon / "dist/SHA256SUMS").read_text().split()[0]
    if hashlib.sha256(archive.read_bytes()).hexdigest() != checksum:
        errors.append("Native add-on archive checksum mismatch")
    with tarfile.open(archive, "r:gz") as packed:
        members = packed.getmembers()
        if len(members) != len(expected) or {m.name for m in members} != expected:
            errors.append("Unexpected native add-on package members")
        else:
            for member in members:
                if not member.isfile() or member.size > 4_000_000:
                    errors.append("Unsafe native add-on package member: " + member.name)
                elif packed.extractfile(member).read() != (addon / member.name.removeprefix("package/")).read_bytes():
                    errors.append("Native archive differs from source: " + member.name)
except (OSError, ValueError, IndexError, tarfile.TarError) as exc:
    errors.append("Native add-on artifact check failed: " + str(exc))

# Scan every exported text file and every archive member, not Markdown alone.
# This catches obvious accidental paths/keys, not all private or proprietary data.
privacy_patterns = (
    r'/(?:home|Users)/[A-Za-z0-9_.-]+/',
    r'/(?:run/media|mnt)/[A-Za-z0-9_.-]+/',
    r'[A-Z]:\\(?:Users|Documents)\\',
    r'-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----',
    r'gh[pousr]_[A-Za-z0-9]{20,}',
    r'github_pat_[A-Za-z0-9_]{30,}',
    r'AKIA[A-Z0-9]{16}',
    r'sk-(?:proj-)?[A-Za-z0-9_-]{32,}',
)
scanned_texts = 0
archive_members = 0


def scan_text(data, label):
    global scanned_texts
    try:
        text = data.decode('utf-8')
    except UnicodeDecodeError:
        errors.append('Unreviewed non-text payload: ' + label)
        return
    scanned_texts += 1
    if any(re.search(pattern, text) for pattern in privacy_patterns):
        errors.append('Potential private material: ' + label)


for name in sorted(REQUIRED):
    path = ROOT / name
    if not path.is_file():
        continue
    if name.endswith(('.tgz', '.tar.gz')):
        try:
            with tarfile.open(path, 'r:gz') as packed:
                for member in packed.getmembers():
                    archive_members += 1
                    parts = Path(member.name)
                    if (not member.isfile() or parts.is_absolute() or '..' in parts.parts
                            or '\\' in member.name or member.size > 4_000_000):
                        errors.append('Unsafe archive member: ' + name + ':' + member.name)
                        continue
                    scan_text(packed.extractfile(member).read(), name + ':' + member.name)
        except (OSError, tarfile.TarError) as exc:
            errors.append('Archive scan failed: ' + name + ': ' + str(exc))
    else:
        scan_text(path.read_bytes(), name)

# The release inventory binds all payload files except itself (no recursive hash).
try:
    manifest = json.loads((ROOT / 'RELEASE-MANIFEST.json').read_text(encoding='utf-8'))
    expected_files = REQUIRED - {'RELEASE-MANIFEST.json'}
    if (manifest.get('format') != 1 or set(manifest['files']) != expected_files
            or manifest.get('file_count') != len(REQUIRED)):
        errors.append('Release inventory differs from strict allowlist')
    for name in sorted(expected_files):
        if hashlib.sha256((ROOT / name).read_bytes()).hexdigest() != manifest['files'].get(name):
            errors.append('Release checksum mismatch: ' + name)
except (OSError, ValueError, KeyError, TypeError) as exc:
    errors.append('Release inventory check failed: ' + str(exc))

if errors:
    print("FAIL\n" + "\n".join(errors))
    sys.exit(1)
print(f"PASS: {len(REQUIRED)} required files; {checked} local file references; no unexpected public files.")
print(f'Privacy pattern scan: {scanned_texts} UTF-8 payloads including {archive_members} archive members; release checksums match.')
print("Structural/pattern checks only; human privacy review and runtime/integration checks remain separate.")
