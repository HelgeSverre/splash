import test from 'node:test';
import assert from 'node:assert/strict';
import { configurePaths, rel, home, basename } from '../src/lib/paths.ts';
import { defaultCombo } from '../src/lib/platform.ts';

test('Windows paths, UNC, verbatim paths, home boundaries and POSIX filenames', () => {
  configurePaths({ host_os: 'windows', home_dir: 'C:\\Users\\Alice' });
  assert.equal(rel('C:\\Work\\app\\src\\main.rs', 'c:\\work\\app'), 'src/main.rs');
  assert.equal(rel('\\\\?\\C:\\Work\\app\\main.rs', 'C:\\Work\\app'), 'main.rs');
  assert.equal(rel('\\\\?\\UNC\\server\\share\\app\\main.rs', '\\\\server\\share\\app'), 'main.rs');
  assert.equal(home('C:\\Users\\Alice\\code'), '~/code');
  assert.equal(home('C:\\Users\\Alice2\\code'), 'C:\\Users\\Alice2\\code');
  assert.equal(basename('C:\\Work\\file.rs'), 'file.rs');
  configurePaths({ host_os: 'linux', home_dir: '/home/alice' });
  assert.equal(rel('/tmp/file', '/private/tmp'), '/tmp/file');
  assert.equal(basename('/tmp/a\\b'), 'a\\b');
  assert.equal(home('/home/bob/code'), '/home/bob/code');
  configurePaths({ host_os: 'macos', home_dir: '/Users/alice' });
  assert.equal(rel('/private/tmp/app/file', '/tmp/app'), 'file');
});
test('Client shortcuts stay independent of host paths and avoid browser navigation', () => {
  assert.equal(defaultCombo('Meta+N', false, false), 'Ctrl+N');
  assert.equal(defaultCombo('Meta+N', true, false), 'Meta+N');
  for (const apple of [true, false]) {
    assert.equal(defaultCombo('Meta+N', apple, true), 'Alt+Shift+N');
    assert.equal(defaultCombo('Meta+W', apple, true), 'Alt+Shift+W');
    assert.equal(defaultCombo('Ctrl+Tab', apple, true), 'Alt+Shift+ArrowRight');
  }
});
