#!/usr/bin/env python3
"""Build a deterministic npm-compatible add-on tarball; no code execution or install."""
import gzip
import hashlib
import io
import json
from pathlib import Path
import tarfile

ROOT = Path(__file__).resolve().parent
FILES = (
    'package.json', 'index.js', 'host-contract.js', 'model-route.js', 'client.js',
    'vendor/service.js', 'vendor/tools.js', 'cordis.patch.yml', 'README.md', 'TESTING.md', 'NOTICE.md', 'LICENSE',
)


def main():
    package = json.loads((ROOT / 'package.json').read_text())
    assert package['name'] == '@marwa-mrwan/agency-team-native'
    assert package['version'] == '0.1.0'
    assert not package.get('scripts'), 'No lifecycle scripts permitted'
    assert not any('dsh-experimental-' in name for section in ('dependencies', 'peerDependencies') for name in package.get(section, {}))
    assert package['engines']['dsh'] == '0.2.2-rc.1'
    buffer = io.BytesIO()
    with gzip.GzipFile(fileobj=buffer, mode='wb', filename='', mtime=0) as gz:
        with tarfile.open(fileobj=gz, mode='w') as tar:
            for name in FILES:
                path = ROOT / name
                assert path.is_file() and not path.is_symlink()
                data = path.read_bytes()
                info = tarfile.TarInfo('package/' + name)
                info.mode = 0o644
                info.size = len(data)
                info.mtime = 0
                tar.addfile(info, io.BytesIO(data))
    data = buffer.getvalue()
    dest = ROOT / 'dist'
    dest.mkdir(exist_ok=True)
    archive = dest / 'agency-team-native-0.1.0.tgz'
    # Rebuilding deliberately replaces only this fixed generated output, never source.
    archive.write_bytes(data)
    (dest / 'SHA256SUMS').write_text(hashlib.sha256(data).hexdigest() + '  ' + archive.name + '\n')
    print(f'PASS: {len(FILES)} package files; {len(data)} bytes; sha256 {hashlib.sha256(data).hexdigest()}')


if __name__ == '__main__':
    main()
