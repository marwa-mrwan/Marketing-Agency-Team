"""Offline regression checks; no runtime or model execution."""
import copy
import importlib.util
import io
import json
from pathlib import Path
import shutil
import tarfile
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('snapshot_doctor', ROOT / 'doctor.py')
doctor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(doctor)


class SnapshotTests(unittest.TestCase):
    def test_real_snapshot(self):
        _, errors, count = doctor.check_snapshot(ROOT)
        self.assertEqual(errors, [])
        self.assertGreater(count, 0)

    def test_missing_runtime_is_not_compatible(self):
        manifest, _, _ = doctor.check_snapshot(ROOT)
        with tempfile.TemporaryDirectory() as tmp:
            self.assertTrue(doctor.compare_runtime(Path(tmp), manifest))

    def test_path_validation(self):
        for name in ('../escape', '/absolute', 'package/../../escape', 'package\\escape'):
            self.assertFalse(doctor.safe_relative(name), name)
        self.assertTrue(doctor.safe_relative('package/lib/index.js'))

    def test_tampered_archive(self):
        with tempfile.TemporaryDirectory() as tmp:
            dest = Path(tmp) / 'snapshot'
            shutil.copytree(ROOT, dest, ignore=shutil.ignore_patterns('__pycache__'))
            manifest = json.loads((dest / 'manifest.json').read_text())
            archive = dest / manifest['packages'][0]['archive']
            archive.write_bytes(archive.read_bytes() + b'corruption')
            _, errors, _ = doctor.check_snapshot(dest)
            self.assertTrue(any('Archive hash mismatch' in error for error in errors))

    def test_unsafe_member_with_updated_hash_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            dest = Path(tmp) / 'snapshot'
            shutil.copytree(ROOT, dest, ignore=shutil.ignore_patterns('__pycache__'))
            manifest = copy.deepcopy(json.loads((dest / 'manifest.json').read_text()))
            package = manifest['packages'][0]
            buf = io.BytesIO()
            with tarfile.open(fileobj=buf, mode='w:gz') as tar:
                item = tarfile.TarInfo('../escape')
                item.size = 1
                tar.addfile(item, io.BytesIO(b'x'))
            data = buf.getvalue()
            (dest / package['archive']).write_bytes(data)
            package['sha256'] = doctor.digest(data)
            package['files'] = {'../escape': {'sha256': doctor.digest(b'x'), 'size': 1, 'origin': 'installed'}}
            (dest / 'manifest.json').write_text(json.dumps(manifest))
            _, errors, _ = doctor.check_snapshot(dest)
            self.assertTrue(any('unsafe archive member' in error for error in errors))


if __name__ == '__main__':
    unittest.main()
