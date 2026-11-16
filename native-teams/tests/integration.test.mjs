// Integration with real DSH core, real Agents and temporary JSONL persistence.
// Two deterministic in-process adapters replace paid/network model calls.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Context } from '@deepseek-ai/cordis';
import LlmRuntime, { LlmAdapter } from '@deepseek-ai/dsh-llm';
import Sessions from '@deepseek-ai/dsh-session';
import Projections from '@deepseek-ai/dsh-session-projection';
import Prompt from '@deepseek-ai/dsh-system-prompt';
import Tools from '@deepseek-ai/dsh-tools';
import Agents from '@deepseek-ai/dsh-agent';
import AgentLoop from '@deepseek-ai/dsh-agent-loop';
import FsLocal from '@deepseek-ai/dsh-fs-local';
import Directory from '@deepseek-ai/dsh-working-directory';
import Subagents, { foldSubagentDescriptor } from '@deepseek-ai/dsh-subagent';
import SessionQuery from '@deepseek-ai/dsh-session-query';
import * as Spawn from '@deepseek-ai/dsh-subagent-spawn-in-process';
import * as Fork from '@deepseek-ai/dsh-subagent-fork-in-process';
import * as Persistence from '@deepseek-ai/dsh-session-persistence-jsonl';
import * as Executor from '@deepseek-ai/dsh-tool-executor-native';
import { pathToFileURL } from 'node:url';
const Addon = await import(process.env.AGENCY_TEST_ADDON_DIR
  ? pathToFileURL(join(process.env.AGENCY_TEST_ADDON_DIR, 'index.js')).href
  : new URL('../index.js', import.meta.url).href);

const calls = [];
const gate = Promise.withResolvers();
const started = { seo: Promise.withResolvers(), ads: Promise.withResolvers() };
class SyntheticAdapter extends LlmAdapter {
  async resolveModel(provider, model) {
    if (!['lead', 'seo', 'ads'].includes(model)) throw new Error('Synthetic model unavailable');
    return { provider, id: model, name: model, contextWindow: 32000, maxOutputTokens: 1000 };
  }
  async *stream(options) {
    calls.push({ provider: options.provider, model: options.model });
    started[options.model]?.resolve();
    if (options.signal?.aborted) throw new Error('Synthetic request aborted');
    let abort;
    const cancelled = new Promise((resolve) => {
      abort = resolve;
      options.signal?.addEventListener('abort', abort, { once: true });
    });
    await Promise.race([gate.promise, cancelled]);
    options.signal?.removeEventListener('abort', abort);
    if (options.signal?.aborted) throw new Error('Synthetic request aborted');
    yield { type: 'text-delta', index: 0, text: `synthetic:${options.provider}:${options.model}` };
    yield { type: 'finish', reason: { kind: 'stop' } };
  }
}

async function setup(directory) {
  const ctx = new Context();
  try {
    await ctx.plugin(LlmRuntime);
    await ctx.plugin(Sessions);
    await ctx.plugin(Projections);
    await ctx.plugin(Prompt);
    await ctx.plugin(FsLocal);
    await ctx.plugin(Directory, { defaultDirectory: directory });
    await ctx.plugin(Tools);
    await ctx.plugin(Executor);
    await ctx.plugin(Agents);
    await ctx.plugin(Persistence, { root: join(directory, 'logs'), compression: 'none' });
    await ctx.plugin(SessionQuery);
    await ctx.plugin(Subagents);
    await ctx.plugin(Spawn);
    await ctx.plugin(Fork);
    ctx.llm.registerAdapter(['synthetic-a', 'synthetic-b'], new SyntheticAdapter());
    await ctx.plugin(AgentLoop, { agents: [] });
    await ctx.plugin(Addon);
    return ctx;
  } catch (error) {
    await ctx.fiber.dispose();
    throw error;
  }
}

test('native add-on creates two differently routed real Agents and a durable task DAG', { timeout: 20000 }, async () => {
  const directory = await mkdtemp(join(tmpdir(), 'agency-native-test-'));
  let ctx = await setup(directory);
  try {
    const lead = await ctx.agentLoop.create('agency-test-lead', { provider: 'synthetic-a', model: 'lead' });
    const signal = AbortSignal.timeout(15000);
    const names = ctx.tools.schemas(lead).map((tool) => tool.name).sort();
    assert.deepEqual(names, ['spawn_teammate', 'send_message', 'list_agents', 'wait_agent', 'interrupt_agent', 'team_task_create', 'team_task_list', 'team_task_get', 'team_task_update'].sort());
    const spawn = ctx.tools.get('spawn_teammate', lead);
    const exec = { agent: lead, signal };
    await assert.rejects(spawn.execute({ name: 'unselected', description: 'Must not run', prompt: 'Synthetic only' }, exec), /Ask the user/);
    assert.equal(ctx.agentTeams.listMembers(lead).length, 1);
    const seoResult = await spawn.execute({
      name: 'seo', description: 'Synthetic SEO role', prompt: 'Return synthetic acknowledgement only.',
      context: 'fresh', provider: 'synthetic-a', model: 'seo',
    }, exec);
    const adsResult = await spawn.execute({
      name: 'ads', description: 'Synthetic Ads role', prompt: 'Return synthetic acknowledgement only.',
      context: 'fresh', provider: 'synthetic-b', model: 'ads',
    }, exec);
    assert.equal(seoResult.member.target, 'seo');
    assert.equal(adsResult.member.target, 'ads');
    const seo = { member: ctx.agentTeams.listMembers(lead).find((m) => m.name === 'seo') };
    const ads = { member: ctx.agentTeams.listMembers(lead).find((m) => m.name === 'ads') };
    assert.notEqual(seo.member.id, ads.member.id);
    const seoAgent = ctx.agents.get(seo.member.id);
    const adsAgent = ctx.agents.get(ads.member.id);
    assert.equal(seoAgent.options.model, 'seo');
    assert.equal(adsAgent.options.provider, 'synthetic-b');
    assert.equal(adsAgent.options.model, 'ads');
    assert.equal(lead.options.model, 'lead');
    await Promise.all([started.seo.promise, started.ads.promise]);
    assert.ok(calls.some((r) => r.provider === 'synthetic-a' && r.model === 'seo'));
    assert.ok(calls.some((r) => r.provider === 'synthetic-b' && r.model === 'ads'));
    const receipt = await ctx.agentTeams.sendMessage(lead, { target: 'seo', content: [{ type: 'text', text: 'Synthetic follow-up.' }], signal });
    assert.ok(receipt.messageId);
    await assert.rejects(spawn.execute({ name: 'unavailable', description: 'No fallback', prompt: 'Synthetic only', provider: 'missing-provider', model: 'seo' }, exec));
    assert.equal(ctx.agentTeams.listMembers(lead).find((m) => m.name === 'unavailable'), undefined);
    const childSpawn = ctx.tools.get('spawn_teammate', seoAgent);
    await assert.rejects(childSpawn.execute({ name: 'nested', description: 'Forbidden', prompt: 'Synthetic only', provider: 'synthetic-a', model: 'seo' }, { agent: seoAgent, signal }), /Only the Team Lead/);
    const waiting = ctx.agentTeams.waitForChange(lead, 10000, signal);
    const one = await ctx.agentTeams.createTask(lead, { subject: 'Design', description: 'Synthetic only', writeScopes: ['draft'] });
    assert.equal((await waiting).timedOut, false);
    const two = await ctx.agentTeams.createTask(lead, { subject: 'Review', description: 'Synthetic only', blockedBy: [one.id] });
    assert.equal(two.ready, false);
    const claimed = await ctx.agentTeams.updateTask(seoAgent, { taskId: one.id, expectedRevision: one.revision, action: 'claim' });
    await assert.rejects(ctx.agentTeams.updateTask(seoAgent, { taskId: one.id, expectedRevision: one.revision, action: 'complete' }), /stale/);
    await ctx.agentTeams.updateTask(seoAgent, { taskId: one.id, expectedRevision: claimed.revision, action: 'complete' });
    assert.equal(ctx.agentTeams.getTask(lead, two.id).ready, true);
    const events = lead.session.snapshotEvents();
    assert.ok(events.some((event) => event.type === 'team/member'));
    assert.ok(events.some((event) => event.type === 'team/task'));
    await ctx.sessions.flush(lead.session);
    assert.ok(await ctx.sessionPersistence.stat(lead.id));
    assert.equal(ctx.agentTeams.interrupt(lead, 'ads').previousStatus, 'running');
    gate.resolve();
    await Promise.all([seoAgent.whenIdle(), adsAgent.whenIdle()]);
    await lead.whenIdle();
    await ctx.fiber.dispose();
    ctx = await setup(directory);
    const restoredHandle = await ctx.agents.resume({ resumeSessionId: lead.id, agentOptions: { provider: 'synthetic-a', model: 'lead' } });
    const restored = restoredHandle.agent;
    const roster = ctx.agentTeams.listMembers(restored);
    assert.equal(roster.find((m) => m.name === 'seo').id, seo.member.id);
    assert.equal(roster.find((m) => m.name === 'ads').id, ads.member.id);
    assert.equal(ctx.agentTeams.getTask(restored, one.id).status, 'completed');
    assert.equal(ctx.agentTeams.getTask(restored, two.id).ready, true);
    const storedChild = await ctx.sessionQuery.readSession(seo.member.id);
    const descriptor = foldSubagentDescriptor(storedChild.events);
    assert.equal(descriptor.agentProvider, 'synthetic-a');
    assert.equal(descriptor.agentModel, 'seo');
    const resumedMessage = await ctx.agentTeams.sendMessage(restored, { target: 'seo', content: [{ type: 'text', text: 'Synthetic cold resume.' }], signal });
    assert.ok(resumedMessage.messageId);
    await restored.whenIdle();
  } finally {
    gate.resolve();
    await ctx.fiber.dispose();
    // Verify the exact test-owned absolute target before deletion.
    assert.ok(directory.startsWith(join(tmpdir(), 'agency-native-test-')) && directory !== tmpdir());
    await rm(directory, { recursive: true, force: true });
  }
});
