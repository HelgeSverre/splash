"""Release invariants without GitHub writes or credentials."""
import hashlib
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import release_pipeline as pipeline


class PipelineTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.addCleanup(patch.stopall)
        patch.dict(os.environ, GITHUB_REPOSITORY='test/splash', GITHUB_REF_NAME='v1.2.3').start()

    def manifests(self, v='1.2.3'):
        (self.root / 'Cargo.toml').write_text(f'[package]\nversion="{v}"\n')
        (self.root / 'elyra.toml').write_text(f'[bundle]\nversion="{v}"\nidentifier="no.helgesverre.splash"\n')
        (self.root / 'Cargo.lock').write_text(f'[[package]]\nname="splash"\nversion="{v}"\n')

    def assets(self):
        for name in pipeline.expected_assets('1.2.3'):
            (self.root / name).write_bytes(b'fixture package')
            (self.root / (name + '.sha256')).write_text(hashlib.sha256(b'fixture package').hexdigest() + '  ' + name)

    def test_version_mismatch_and_invalid_tag_fail(self):
        self.manifests()
        self.assertEqual(pipeline.version(self.root, 'v1.2.3'), '1.2.3')
        with self.assertRaisesRegex(ValueError, 'Tag must match'):
            pipeline.version(self.root, 'v1.2.4')
        (self.root / 'Cargo.lock').write_text('[[package]]\nname="splash"\nversion="1.2.2"')
        with self.assertRaisesRegex(ValueError, 'versions must agree'):
            pipeline.version(self.root)

    def test_bad_version_rejected(self):
        self.manifests('1.2')
        with self.assertRaises(ValueError):
            pipeline.version(self.root)

    def test_prerelease_version_supported(self):
        self.manifests('1.2.3-rc.1')
        self.assertEqual(pipeline.version(self.root, 'v1.2.3-rc.1'), '1.2.3-rc.1')

    def test_complete_assets_and_checksums_required(self):
        self.assets()
        self.assertEqual(len(pipeline.verify_assets(self.root, '1.2.3')), 22)
        first = self.root / sorted(pipeline.expected_assets('1.2.3'))[0]
        first.write_bytes(b'corrupt')
        with self.assertRaisesRegex(ValueError, 'Invalid checksum'):
            pipeline.verify_assets(self.root, '1.2.3')
        first.unlink()
        with self.assertRaisesRegex(ValueError, 'missing'):
            pipeline.verify_assets(self.root, '1.2.3')

    def test_existing_version_tag_is_never_moved(self):
        patch.object(pipeline, 'version', return_value='1.2.3').start()
        for refs in ('old refs/tags/v1.2.3', 'tagobject refs/tags/v1.2.3\nold refs/tags/v1.2.3^{}'):
            with patch.object(pipeline, 'run', side_effect=['new', refs]) as run:
                pipeline.auto_tag()
                self.assertEqual(run.call_count, 2)

    def test_new_tag_dispatches_without_pat(self):
        patch.object(pipeline, 'version', return_value='1.2.3').start()
        patch.object(pipeline, 'release_for', return_value=None).start()
        with patch.object(pipeline, 'run', side_effect=['sha', '', '', '']) as run:
            pipeline.auto_tag()
            self.assertIn('sha=sha', run.call_args_list[2].args)
            self.assertEqual(run.call_args_list[3].args, ('gh', 'workflow', 'run', 'release.yml', '--ref', 'v1.2.3'))

    def test_existing_tag_resumes_failed_dispatch(self):
        patch.object(pipeline, 'version', return_value='1.2.3').start()
        patch.object(pipeline, 'release_for', return_value=None).start()
        with patch.object(pipeline, 'run', side_effect=['sha', 'sha refs/tags/v1.2.3', '']) as run:
            pipeline.auto_tag()
            self.assertEqual(run.call_count, 3)
            self.assertIn('workflow', run.call_args.args)

    def test_published_release_never_overwritten(self):
        patch.object(pipeline, 'version', return_value='1.2.3').start()
        patch.object(pipeline, 'release_for', return_value={'draft': False}).start()
        with patch.object(pipeline, 'run') as run, patch.object(pipeline, 'verify_assets') as verify:
            pipeline.publish()
            run.assert_not_called()
            verify.assert_not_called()

    def test_publish_waits_for_complete_remote_inventory(self):
        patch.object(pipeline, 'version', return_value='1.2.3').start()
        patch.object(pipeline, 'verify_assets', return_value=[Path('one.zip')]).start()
        patch.object(pipeline, 'release_for', side_effect=[{'draft': True}, {'assets': []}]).start()
        with patch.object(pipeline, 'run') as run:
            with self.assertRaisesRegex(ValueError, 'inventory'):
                pipeline.publish()
            self.assertEqual(run.call_count, 1)
            self.assertIn('upload', run.call_args.args)

    def test_new_release_generates_notes_and_publishes_last(self):
        patch.object(pipeline, 'version', return_value='1.2.3').start()
        patch.object(pipeline, 'verify_assets', return_value=[Path('one.zip')]).start()
        patch.object(pipeline, 'release_for', side_effect=[None, {'assets': [{'name': 'one.zip', 'state': 'uploaded'}]}, {'id': 42}]).start()
        with patch.object(pipeline, 'run') as run:
            pipeline.publish()
            create, upload, publish = [c.args for c in run.call_args_list]
            self.assertIn('--generate-notes', create)
            self.assertIn('--draft', create)
            self.assertIn('--verify-tag', create)
            self.assertIn('upload', upload)
            self.assertIn('draft=false', publish)
            self.assertIn('make_latest=legacy', publish)

    def test_draft_retry_uploads_before_publication(self):
        patch.object(pipeline, 'version', return_value='1.2.3-rc.1').start()
        patch.object(pipeline, 'verify_assets', return_value=[Path('one.zip')]).start()
        patch.object(pipeline, 'release_for', side_effect=[{'draft': True}, {'assets': [{'name': 'one.zip', 'state': 'uploaded'}]}, {'id': 42}]).start()
        with patch.object(pipeline, 'run') as run:
            pipeline.publish()
            self.assertIn('upload', run.call_args_list[0].args)
            self.assertIn('draft=false', run.call_args_list[1].args)
            self.assertIn('make_latest=false', run.call_args_list[1].args)


if __name__ == '__main__':
    unittest.main()
