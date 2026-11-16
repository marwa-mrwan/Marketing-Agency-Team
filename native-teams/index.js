// Native DSH bundle entry. No provider credentials or application patching.
import * as service from './vendor/service.js';
import * as tools from './vendor/tools.js';

export const name = 'agency-team-native';
export const inject = ['llm', 'agents', 'sessions', 'sessionPersistence', 'sessionProjections', 'subagents', 'tools', 'systemPrompt'];

import { assertHost } from './host-contract.js';

export function apply(ctx) {
  assertHost(ctx);
  // Child plugin scopes own disposal. Core services still belong to the host.
  ctx.plugin(service.default);
  ctx.plugin(tools, { freshProvider: 'spawn', forkProvider: 'fork', interrupt: true });
}
