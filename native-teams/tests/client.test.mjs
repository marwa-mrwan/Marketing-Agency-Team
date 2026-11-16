// Client registration smoke test, not a visual/browser or navigation test.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

test('client bundle registers under the add-on identity and mounts the roster header slot', async () => {
  const source = await readFile(new URL('../client.js', import.meta.url), 'utf8');
  let registration;
  vm.runInNewContext(source, { window: { __ModuleLoader__: { load: (module) => { registration = module; } } } });
  assert.equal(registration.id, '@marwa-mrwan/agency-team-native');
  const client = registration.factory(() => ({}));
  assert.deepEqual(Array.from(client.inject), ['sessions', 'uiWorkspace', 'slots', 'locale']);
  const slots = [];
  let dictionaries = 0;
  client.apply({
    effect: (fn) => fn(),
    locale: { register: () => { dictionaries++; return () => {}; } },
    sessions: {}, uiWorkspace: {},
    slots: { inject: (_name, fn) => fn(), register: (definition, component) => { slots.push({ definition, component }); return () => {}; } },
  });
  assert.equal(dictionaries, 1);
  assert.equal(slots[0].definition.name, 'conversation.session.header.actions');
  assert.equal(typeof slots[0].component, 'function');
});
