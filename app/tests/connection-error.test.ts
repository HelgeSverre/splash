import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { CommandError, ForbiddenError } from '@elyra/runtime';
import { connectionError, errorMessage } from '../src/lib/format.ts';

const RESTARTED = 'The server restarted. Try again in a moment.';
const RECONNECTING = 'Reconnecting to the server. Try again in a moment.';
// What the server bridge throws when a request never reached the server.
const unreachable = () => Object.assign(new Error('Could not reach the Splash server', { cause: new TypeError('Failed to fetch') }), { name: 'ServerUnreachableError' });
const staleToken = () => new ForbiddenError('elyra://localhost/__cmd/restart_session', 'missing or invalid x-elyra-token');

test('a restarted server or a lost one reads as plain words in the web version', () => {
  assert.equal(connectionError(staleToken(), true), RESTARTED);
  assert.equal(connectionError(unreachable(), true), RECONNECTING);
  // A gate that refused for another reason is not a connection problem.
  assert.equal(connectionError(new ForbiddenError('elyra://localhost/__cmd/x', 'command `x` requires the `admin` ability'), true), undefined);
  assert.equal(connectionError(new CommandError('send_prompt', 'rate limited', 'forbidden'), true), undefined);
  assert.equal(connectionError(new TypeError('Cannot read properties of undefined'), true), undefined);
  assert.equal(connectionError('missing or invalid x-elyra-token', true), undefined);
});

test('the desktop app keeps every error as it is', () => {
  assert.equal(connectionError(staleToken(), false), undefined);
  assert.equal(connectionError(unreachable(), false), undefined);
  assert.match(errorMessage(staleToken()), /^elyra IPC rejected \(403\)/);
});

test('errorMessage maps connection errors only when served by a Splash server', () => {
  globalThis.__SPLASH_SERVER__ = { name: 'Test', instance: 'one', token: 'old' };
  try {
    assert.equal(errorMessage(staleToken()), RESTARTED);
    assert.equal(errorMessage(unreachable()), RECONNECTING);
    assert.equal(errorMessage(new CommandError('restart_session', 'Session not found')), 'Session not found');
  } finally {
    delete globalThis.__SPLASH_SERVER__;
  }
  assert.equal(errorMessage(new CommandError('restart_session', 'Session not found')), 'Session not found');
});
