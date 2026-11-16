#!/usr/bin/env python3
"""فحص محلي حتمي؛ لا شبكة ولا تنفيذ أوامر من البيانات ولا كتابة ملفات."""
import argparse
import copy
import json
from pathlib import Path
import sys


DOCS = ('AGENTS.md', 'README.md', 'agency-team/README.md',
        'agency-team/roles/lead.md', 'agency-team/templates.md',
        'agency-team/skill-routing.md', 'agency-team/local-workflow.md')
ACTIVE = ('running', 'report_received', 'complete')
# Structural heuristics only: they cannot detect a fabricated human answer.
TOOL_ONLY_MARKERS = ('delegate_choose_model', 'default lane', 'default model', 'fleet',
                     'availability', 'tool-reported', 'tool reported', 'auto-select',
                     'auto select', 'inherited')
BROAD_SCOPES = ('global', 'all', 'any', 'default', 'permanent', 'all roles',
                'future roles', 'all tasks')


def require(condition, message):
    if not condition:
        raise ValueError(message)


def text(value):
    return isinstance(value, str) and bool(value.strip())


def strings(value):
    return isinstance(value, list) and all(text(x) for x in value)


def confirmation_problem(task, allow_synthetic=False):
    """Why an active record lacks direct human-answer provenance, else None."""
    human = task['selection'].get('human_confirmation')
    if human is None:
        return 'no selection.human_confirmation (tool-only or legacy approval)'
    if not isinstance(human, dict):
        return 'human_confirmation must be an object'
    if human.get('source') != 'direct_user_answer':
        return 'human_confirmation.source is not direct_user_answer'
    for key in ('reference', 'role', 'scope'):
        if not text(human.get(key)):
            return 'missing human_confirmation.' + key
    if human['role'].strip().lower() != task['role'].strip().lower():
        return 'confirmation role differs from task role'
    if human['scope'].strip().lower() in BROAD_SCOPES:
        return 'confirmation scope is global/future, not task-scoped'
    if any(marker in human['reference'].lower() for marker in TOOL_ONLY_MARKERS):
        return 'reference cites tool/routing output, not a human answer'
    synthetic = human.get('synthetic', False)
    if type(synthetic) is not bool:
        return 'human_confirmation.synthetic must be boolean'
    if synthetic and not allow_synthetic:
        return 'synthetic fixture is not a real approval'
    return None


def readiness(data, allow_synthetic=False):
    """Dispatch-readiness: every active record needs direct human-answer provenance."""
    problems = validate(data, allow_synthetic)
    require(not problems, 'not dispatch-ready: ' + '; '.join(
        task_id + ': ' + problem for task_id, problem in problems))


def validate(data, allow_synthetic=False):
    """Structural check. Returns legacy (schema 1) records lacking human provenance."""
    require(isinstance(data, dict), 'ledger object')
    require(type(data.get('schema_version')) is int and data['schema_version'] in (1, 2),
            'schema version')
    legacy = data['schema_version'] == 1
    warnings = []
    require(data.get('owner') == 'Lead', 'Lead owner')
    tasks = data.get('tasks')
    require(isinstance(tasks, list), 'tasks list')
    index = {}
    for task in tasks:
        require(isinstance(task, dict), 'task object')
        for key in ('id', 'role', 'approval_reference', 'backend', 'results'):
            require(text(task.get(key)), 'missing ' + key)
        require(task['id'] not in index, 'duplicate id')
        index[task['id']] = task
        require(task.get('approved_route') in
                ('delegate', 'named_subagent', 'official_team', 'direct'), 'route')
        require(task.get('state') in ('pending', 'running', 'report_received',
                                     'complete', 'blocked', 'failed', 'cancelled'), 'state')
        for key in ('attempt_id', 'agent_id'):
            require(key in task and (task[key] is None or text(task[key])), key)
        for key in ('blocked_by', 'write_scopes', 'acceptance', 'evidence'):
            require(strings(task.get(key)), key)
        require(task['acceptance'], 'acceptance empty')
        require(len(set(task['blocked_by'])) == len(task['blocked_by']), 'duplicate dependency')
        selection = task.get('selection')
        require(isinstance(selection, dict), 'selection')
        require(text(selection.get('approval_reference')), 'selection approval')
        require(selection.get('status') in ('pending', 'confirmed', 'approved_fallback'),
                'selection status')
        for key in ('requested', 'applied'):
            require(key in selection and (selection[key] is None or text(selection[key])), key)
        if selection['status'] == 'confirmed':
            require(text(selection['requested']) and text(selection['applied']), 'confirmed model')
        human = selection.get('human_confirmation')
        require(human is None or isinstance(human, dict), 'human_confirmation object')
        if task['state'] in ACTIVE:
            require(selection['status'] != 'pending', 'missing model approval')
            problem = confirmation_problem(task, allow_synthetic)
            if problem and legacy:
                warnings.append((task['id'], problem))
            else:
                require(problem is None, 'human confirmation: ' + str(problem))
        checks = task.get('checks')
        require(isinstance(checks, list), 'checks list')
        for check in checks:
            require(isinstance(check, dict) and text(check.get('command')) and
                    text(check.get('evidence')) and
                    check.get('result') in ('passed', 'failed', 'not_run'), 'check record')
        review = task.get('lead_verification')
        require(isinstance(review, dict) and review.get('status') in
                ('pending', 'verified', 'rejected') and strings(review.get('evidence')), 'review')
        if review['status'] == 'verified':
            require(review['evidence'], 'verification evidence')
        if task['state'] == 'complete':
            require(review['status'] == 'verified' and task['evidence'], 'unverified completion')
    visiting, visited = set(), set()

    def visit(task_id):
        require(task_id not in visiting, 'dependency cycle')
        if task_id in visited:
            return
        visiting.add(task_id)
        task = index[task_id]
        for dependency in task['blocked_by']:
            require(dependency in index, 'missing dependency')
            if task['state'] in ('running', 'report_received', 'complete'):
                require(index[dependency]['state'] == 'complete', 'premature dependency')
            visit(dependency)
        visiting.remove(task_id)
        visited.add(task_id)

    for task_id in index:
        visit(task_id)
    return warnings


def self_test():
    # Fixtures are SYNTHETIC, labeled synthetic=True, and are not real approvals.
    human = dict(source='direct_user_answer', role='reader', scope='synthetic task only',
                 reference='SYNTHETIC FIXTURE: not a real user answer', synthetic=True)
    task = dict(id='a', role='reader', approved_route='delegate',
                approval_reference='synthetic explicit approval', backend='synthetic',
                selection=dict(requested=None, applied=None, status='approved_fallback',
                               approval_reference='synthetic fallback approval',
                               human_confirmation=human),
                attempt_id=None, agent_id=None, state='report_received', blocked_by=[],
                write_scopes=[], acceptance=['Read harmless definition'], evidence=['Read result'],
                checks=[], results='Awaiting Lead',
                lead_verification=dict(status='pending', evidence=[]))
    base = dict(schema_version=2, owner='Lead', tasks=[task])
    readiness(base, allow_synthetic=True)
    valid = copy.deepcopy(base)
    valid['tasks'][0]['state'] = 'complete'
    valid['tasks'][0]['lead_verification'] = dict(status='verified', evidence=['Parent reviewed'])
    child = copy.deepcopy(task)
    child.update(id='b', state='running', blocked_by=['a'])
    valid['tasks'].append(child)
    readiness(valid, allow_synthetic=True)
    readiness(dict(schema_version=2, owner='Lead', tasks=[]))
    # Honest pending record: no human answer yet, not dispatched.
    pending = copy.deepcopy(base)
    pending['tasks'][0].update(state='pending')
    pending['tasks'][0]['selection'].update(status='pending', human_confirmation=None)
    readiness(pending)
    # Legacy schema 1, tool-only "confirmed" complete record: structurally accepted
    # with a warning, but the separate readiness validator must reject it.
    legacy = copy.deepcopy(valid)
    legacy['schema_version'] = 1
    legacy['tasks'] = legacy['tasks'][:1]
    legacy['tasks'][0]['selection'].update(
        requested='Synthetic Model', applied='synthetic/model', status='confirmed',
        approval_reference='delegate_choose_model returned a lane', human_confirmation=None)
    require(len(validate(legacy)) == 1, 'legacy warning missing')
    # (allow_synthetic, sample): legacy tool-only record and an unlabeled-for-production
    # synthetic fixture must both fail readiness.
    cases = [(False, legacy), (False, copy.deepcopy(base))]
    legacy_tool_source = copy.deepcopy(base)
    legacy_tool_source['schema_version'] = 1

    def invalid(change, sample_base=base):
        sample = copy.deepcopy(sample_base)
        change(sample)
        cases.append((True, sample))

    def human_update(**fields):
        return lambda d: d['tasks'][0]['selection']['human_confirmation'].update(fields)

    model = dict(requested='Synthetic Model', applied='synthetic/model', status='confirmed')
    # Tool-only provenance cannot satisfy readiness even with a selected/default model.
    invalid(lambda d: d['tasks'][0]['selection'].update(human_confirmation=None, **model))
    invalid(lambda d: d['tasks'][0]['selection'].update(human_confirmation='yes', **model))
    invalid(human_update(source='delegate_choose_model'))
    invalid(human_update(source='tool_confirmed'))
    invalid(human_update(reference='delegate_choose_model returned lane-x; confirmed'))
    invalid(human_update(reference='default lane from fleet routing'))
    invalid(human_update(reference=' '))
    invalid(human_update(role='reviewer'))
    invalid(human_update(scope='global'))
    invalid(human_update(synthetic='no'))
    invalid(human_update(source='delegate_choose_model'), legacy_tool_source)
    invalid(lambda d: d.update(schema_version=3))
    invalid(lambda d: d.update(tasks=None))
    invalid(lambda d: d.update(owner='worker'))
    invalid(lambda d: d['tasks'][0]['selection'].update(status='confirmed'))

    invalid(lambda d: d['tasks'][0].pop('approval_reference'))
    invalid(lambda d: d['tasks'][0]['selection'].update(approval_reference=''))
    invalid(lambda d: d['tasks'][0]['selection'].update(status='pending'))
    invalid(lambda d: d['tasks'][0].update(state='complete'))
    invalid(lambda d: d['tasks'][0].update(state='invented'))
    invalid(lambda d: d['tasks'][0].update(blocked_by=['missing']))
    invalid(lambda d: d['tasks'][0].update(blocked_by=['a']))
    invalid(lambda d: d['tasks'].append(copy.deepcopy(child)))
    invalid(lambda d: d['tasks'].append(copy.deepcopy(task)))
    invalid(lambda d: d['tasks'][0].update(checks=[dict(command='test', result='passed')]))
    cycle = copy.deepcopy(base)
    cycle['tasks'][0].update(state='pending', blocked_by=['b'])
    other = copy.deepcopy(task)
    other.update(id='b', state='pending', blocked_by=['a'])
    cycle['tasks'].append(other)
    cases.append((True, cycle))
    for number, (allow_synthetic, sample) in enumerate(cases, 1):
        try:
            readiness(sample, allow_synthetic)
        except ValueError:
            continue
        raise ValueError('invalid fixture accepted: ' + str(number))
    return len(cases)


def check_docs(root):
    docs = {name: (root / name).read_text(encoding='utf-8') for name in DOCS}
    for name, content in docs.items():
        require('local-workflow.md' in content or name.endswith('local-workflow.md'),
                'missing local routing link: ' + name)
    combined = '\n'.join(docs.values())
    for phrase in ('Delegate', 'blocked_by', 'write_scopes', 'report_received',
                   'approval_reference', 'lead_verification', 'human_confirmation',
                   'direct_user_answer'):
        require(phrase in combined, 'missing contract term: ' + phrase)
    require('delegate_choose_model' in docs['AGENTS.md'],
            'missing tool-output-is-not-consent rule')
    for name, content in docs.items():
        for line in content.splitlines():
            require(not (line.lstrip().startswith(('- استخدم spawn_teammate',
                                                '- افحص list_agents'))),
                    'unconditional native Team invocation: ' + name)
            require('التفويض المؤقت ليس بديلًا' not in line,
                    'contradictory fallback rule: ' + name)
    require('ليست native-teams شرطًا' in docs['AGENTS.md'], 'missing native optional rule')
    require('ليست locks' in combined and 'لا تشغيل تلقائي' in combined,
            'missing scope/start safeguards')


def report_legacy(warnings):
    for task_id, problem in warnings:
        print(f'WARNING: legacy schema-1 record {task_id} is historical/unverified ({problem}); '
              'structurally accepted only, NOT current human consent, excluded from '
              'dispatch readiness and not reusable for any role.', file=sys.stderr)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('root', nargs='?', type=Path,
                        default=Path(__file__).resolve().parents[1])
    parser.add_argument('--ledger', type=Path,
                        help='Explicit private ledger; default is the empty public template')
    parser.add_argument('--require-ready', action='store_true',
                        help='Also fail unless every active record has direct human-answer '
                             'provenance (rejects legacy tool-only records)')
    args = parser.parse_args()
    root = args.root.resolve()
    rejected = self_test()
    ledger_path = (args.ledger if args.ledger is not None
                   else root / 'agency-team/templates/tasks.example.json')
    ledger = json.loads(ledger_path.read_text(encoding='utf-8'))
    warnings = validate(ledger)
    report_legacy(warnings)
    if args.require_ready:
        readiness(ledger)
    check_docs(root)
    print('PASS: ledger schema/state/dependencies; 5 valid fixtures (synthetic, including '
          'empty; not approvals); '
          f'{rejected} invalid fixtures rejected; 7 scoped documents checked. '
          f'Readiness: {"verified" if args.require_ready else "not requested"}; '
          f'{len(warnings)} legacy unverified record(s). Structural only: cannot detect a '
          'fabricated human answer. Lead verification remains separate.')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, TypeError, KeyError) as error:
        print('FAIL: ' + str(error), file=sys.stderr)
        sys.exit(1)
