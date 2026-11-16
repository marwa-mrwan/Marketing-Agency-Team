import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveTeamRoute } from '../model-route.js';
import { assertHost } from '../host-contract.js';

test('selection requires a complete explicit route or explicit session approval', () => {
  for (const args of [{}, { provider: 'a' }, { model: 'b' }, { provider: '', model: 'b' }, { provider: ' a', model: 'b' }]) {
    assert.throws(() => resolveTeamRoute(args));
  }
  assert.equal(resolveTeamRoute({ use_session_model: true }), undefined);
  assert.deepEqual(resolveTeamRoute({ provider: 'a', model: 'b' }), { provider: 'a', model: 'b' });
});

test('session inheritance cannot silently override an explicit route', () => {
  for (const values of [{ provider: 'a' }, { model: 'b' }, { reasoning_effort: 'high' }]) {
    assert.throws(() => resolveTeamRoute({ use_session_model: true, ...values }));
  }
});

test('effort stays on the selected child route and input is not mutated', () => {
  const input = Object.freeze({ provider: 'a', model: 'b', reasoning_effort: 'high' });
  assert.deepEqual(resolveTeamRoute(input), { provider: 'a', model: 'b', reasoningEffort: 'high' });
  assert.throws(() => resolveTeamRoute({ provider: 'a', model: 'b', reasoning_effort: '' }));
});

test('host rejects missing core and conflicting existing Team service', () => {
  assert.throws(() => assertHost({ get: () => undefined }), /missing llm.prepareCall/);
  assert.throws(() => assertHost({ get: (name) => name === 'agentTeams' ? {} : undefined }), /Disable the official/);
});
