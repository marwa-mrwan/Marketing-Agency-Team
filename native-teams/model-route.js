// Per-teammate route validation. Never mutate the Lead's model selection.
export function resolveTeamRoute(args) {
  const provider = args.provider;
  const model = args.model;
  const effort = args.reasoning_effort;
  const session = args.use_session_model === true;
  const validText = (value) => typeof value === 'string' && value.trim().length > 0 && value === value.trim() && value.length <= 200;
  if (session) {
    if (provider !== undefined || model !== undefined || effort !== undefined) {
      throw new Error('Choose an explicit provider/model OR use_session_model, not both.');
    }
    return undefined;
  }
  if (!validText(provider) || !validText(model)) {
    throw new Error('Ask the user to select this role\'s provider and model, or explicitly approve use_session_model. Both provider and model are required.');
  }
  if (effort !== undefined && !validText(effort)) {
    throw new Error('reasoning_effort must be a non-empty adapter-owned value.');
  }
  // The host resolves availability/capabilities before the child starts. No fallback.
  return { provider, model, ...(effort === undefined ? {} : { reasoningEffort: effort }) };
}
