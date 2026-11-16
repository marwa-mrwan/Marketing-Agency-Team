// Capability checks complement (not replace) the exact engines.dsh admission gate.
export function assertHost(ctx) {
  if (ctx.get('agentTeams')) {
    throw new Error('Disable the official Agent Teams bundle first; two Team services cannot share one profile.');
  }
  const requirements = [
    ['llm', 'prepareCall'],
    ['agents', 'list'], ['agents', 'get'], ['sessions', 'get'], ['sessions', 'flush'],
    ['sessionPersistence', 'stat'], ['sessionProjections', 'register'],
    ['subagents', 'startActivation'], ['subagents', 'drainChildren'],
    ['subagents', 'interrupt'], ['tools', 'register'],
    ['systemPrompt', 'section'], ['systemPrompt', 'context'],
    ['systemPrompt', 'getSectionOrder'], ['systemPrompt', 'getContextOrder'],
  ];
  for (const [key, method] of requirements) {
    if (typeof ctx.get(key)?.[method] !== 'function') {
      throw new Error(`Incompatible DSH host: missing ${key}.${method}; no application files were changed.`);
    }
  }
}
