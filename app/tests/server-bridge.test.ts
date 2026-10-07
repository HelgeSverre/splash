import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('../../src/server/bridge.js', import.meta.url), 'utf8');

test('bridge renews IPC headers without replaying mutations after connection loss', async () => {
  const calls: {url: string; headers?: Headers}[] = [];
  const events: string[] = [];
  let fail = false;
  const context = vm.createContext({ Headers, Response, Event, location: {origin:'http://localhost:4780'}, dispatchEvent: (e: Event) => events.push(e.type), fetch: async (url: string, init?: RequestInit) => {
    calls.push({url, headers: init?.headers as Headers});
    if (url === '/__server/state') return Response.json({name:'Test',instance:'one',token:'initial'});
    if (fail) throw new Error('Tunnel disconnected');
    return new Response('ok');
  }});
  vm.runInContext(source, context);
  await context.fetch('elyra://localhost/__cmd/list_sessions', {method:'POST'});
  assert.equal(calls[1].url, 'http://localhost:4780/__cmd/list_sessions');
  assert.equal(calls[1].headers?.get('x-elyra-token'), 'initial');
  context.__SPLASH_SERVER__.token = 'after-restart';
  fail = true;
  const before = calls.length;
  await assert.rejects(context.fetch('elyra://localhost/__cmd/send_prompt', {method:'POST'}));
  assert.equal(calls.length, before + 1);
  assert.equal(calls.at(-1)?.headers?.get('x-elyra-token'), 'after-restart');
  assert.deepEqual(events, ['splash:offline']);
});

test('stale-token event polling remains retryable after server restart', async () => {
  const context = vm.createContext({ Headers, Response, Event, location: {origin:'http://localhost'}, dispatchEvent: () => {}, fetch: async (url: string) => {
    if (url === '/__server/state') return Response.json({token:'old'});
    return new Response('invalid token', {status:403,headers:{'x-elyra-error-kind':'forbidden'}});
  }});
  vm.runInContext(source, context);
  const events = await context.fetch('elyra://localhost/__events');
  assert.equal(events.status, 503);
  assert.equal(events.headers.get('x-elyra-error-kind'), null);
  const command = await context.fetch('elyra://localhost/__cmd/send_prompt', {method:'POST'});
  assert.equal(command.status, 403);
});
