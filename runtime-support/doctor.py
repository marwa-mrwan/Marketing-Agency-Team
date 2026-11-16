#!/usr/bin/env python3
"""Read-only snapshot checks. No imports/execution of captured JavaScript."""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import sys
import tarfile

ROOT = Path(__file__).resolve().parent
TOOLS = {
    'spawn_teammate', 'send_message', 'list_agents', 'wait_agent',
    'interrupt_agent', 'team_task_create', 'team_task_list',
    'team_task_get', 'team_task_update',
}


def digest(data):
    return hashlib.sha256(data).hexdigest()


def safe_relative(name):
    p = PurePosixPath(name)
    return bool(name) and not p.is_absolute() and '..' not in p.parts and '\\' not in name


def check_snapshot(root=ROOT):
    manifest = json.loads((root / 'manifest.json').read_text(encoding='utf-8'))
    errors = []
    count = 0
    assert manifest['format'] == 1, 'Unsupported manifest'
    packages = manifest['packages']
    expected = {'@deepseek-ai/dsh-experimental-' + s for s in (
        'agent-team', 'tool-agent-team', 'client-ui-agent-team', 'agent-team-profile')}
    assert {p['name'] for p in packages} == expected and len(packages) == 4
    for package in packages:
        name = package['archive']
        assert safe_relative(name) and name.startswith('snapshots/'), 'Unsafe archive path'
        archive = root / name
        assert not archive.is_symlink(), 'Archive symlink'
        if digest(archive.read_bytes()) != package['sha256']:
            errors.append('Archive hash mismatch: ' + name)
            continue
        with tarfile.open(archive, 'r:gz') as tar:
            members = tar.getmembers()
            names = [m.name for m in members]
            expected_files = package['files']
            if len(set(names)) != len(names) or set(names) != set(expected_files):
                errors.append('Unexpected/missing/duplicate archive members: ' + name)
                continue
            for member in members:
                if not member.isfile() or not safe_relative(member.name):
                    errors.append('Non-regular or unsafe archive member: ' + member.name)
                    continue
                spec = expected_files[member.name]
                if member.size != spec['size'] or member.size > 4_000_000:
                    errors.append('Invalid file size: ' + member.name)
                    continue
                data = tar.extractfile(member).read()
                if digest(data) != spec['sha256']:
                    errors.append('File hash mismatch: ' + member.name)
                count += 1
            if 'tool-agent-team' in package['name']:
                js = tar.extractfile('package/lib/index.js').read().decode('utf-8')
                found = set(re.findall(r'name: "([a-z_]+)"', js)) & TOOLS
                if found != TOOLS:
                    errors.append('Missing Team tool declarations')
    return manifest, errors, count


def compare_runtime(root, manifest):
    errors = []
    root = root.resolve()
    identity = root / 'build-identity.json'
    if not identity.is_file() or json.loads(identity.read_text()) != manifest['build_identity']:
        errors.append('Runtime build identity differs or is missing')
    for package in manifest['packages']:
        directory = root / 'node_modules' / package['name']
        for name, spec in package['files'].items():
            # LICENSE was supplied from the integrity-verified public npm archive.
            if spec['origin'] != 'installed':
                continue
            path = directory / PurePosixPath(name).relative_to('package')
            if path.is_symlink() or not path.resolve().is_relative_to(root):
                errors.append('Unsafe runtime path: ' + package['name'] + '/' + name)
            elif not path.is_file() or digest(path.read_bytes()) != spec['sha256']:
                errors.append('Missing/different runtime file: ' + package['name'] + '/' + name)
    for name, spec in manifest['dependency_inventory'].items():
        path = root / 'node_modules' / name / 'package.json'
        if not path.resolve().is_relative_to(root) or not path.is_file():
            errors.append('Missing/unsafe dependency: ' + name)
        elif digest(path.read_bytes()) != spec['package_json_sha256']:
            errors.append('Dependency manifest differs: ' + name)
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--runtime', type=Path, help='Compare an unpacked runtime; no writes')
    args = parser.parse_args()
    try:
        manifest, errors, count = check_snapshot()
        if args.runtime and not errors:
            errors += compare_runtime(args.runtime, manifest)
    except (OSError, ValueError, KeyError, AssertionError, tarfile.TarError) as exc:
        print('FAIL: ' + str(exc))
        return 1
    if errors:
        print('FAIL:\n' + '\n'.join(errors))
        return 1
    print(f'PASS: four archives; {count} files; nine Team tool declarations.')
    if args.runtime:
        print('PASS: captured files, build identity and dependency manifests match runtime.')
    print('Static integrity only. Not a standalone runtime or an integration/restore test.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
