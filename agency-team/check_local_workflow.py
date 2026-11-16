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


def require(condition, message):
    if not condition:
        raise ValueError(message)


def text(value):
    return isinstance(value, str) and bool(value.strip())


def strings(value):
    return isinstance(value, list) and all(text(x) for x in value)


def validate(data):
    require(isinstance(data, dict), 'ledger object')
    require(type(data.get('schema_version')) is int and data['schema_version'] == 1,
            'schema version')
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
        if task['state'] in ('running', 'report_received', 'complete'):
            require(selection['status'] != 'pending', 'missing model approval')
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


def self_test():
    # Fixtures are synthetic and independent of the operator's ledger.
    validate(dict(schema_version=1, owner='Lead', tasks=[]))
    task = dict(id='a', role='reader', approved_route='delegate',
                approval_reference='synthetic explicit approval', backend='synthetic',
                selection=dict(requested=None, applied=None, status='approved_fallback',
                               approval_reference='synthetic fallback approval'),
                attempt_id=None, agent_id=None, state='report_received', blocked_by=[],
                write_scopes=[], acceptance=['Read harmless definition'], evidence=['Read result'],
                checks=[], results='Awaiting Lead',
                lead_verification=dict(status='pending', evidence=[]))
    base = dict(schema_version=1, owner='Lead', tasks=[task])
    validate(base)
    valid = copy.deepcopy(base)
    valid['tasks'][0]['state'] = 'complete'
    valid['tasks'][0]['lead_verification'] = dict(status='verified', evidence=['Parent reviewed'])
    child = copy.deepcopy(task)
    child.update(id='b', state='running', blocked_by=['a'])
    valid['tasks'].append(child)
    validate(valid)
    cases = []

    def invalid(change):
        sample = copy.deepcopy(base)
        change(sample)
        cases.append(sample)

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
    cases.append(cycle)
    for number, sample in enumerate(cases, 1):
        try:
            validate(sample)
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
                   'approval_reference', 'lead_verification'):
        require(phrase in combined, 'missing contract term: ' + phrase)
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


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('root', nargs='?', type=Path,
                        default=Path(__file__).resolve().parents[1])
    parser.add_argument('--ledger', type=Path,
                        help='Explicit private ledger; default is the empty public template')
    args = parser.parse_args()
    root = args.root.resolve()
    rejected = self_test()
    ledger = args.ledger if args.ledger is not None else root / 'agency-team/templates/tasks.example.json'
    validate(json.loads(ledger.read_text(encoding='utf-8')))
    check_docs(root)
    print('PASS: ledger schema/state/dependencies; 3 valid fixtures (including empty); '
          f'{rejected} invalid fixtures rejected; 7 scoped documents checked. '
          'Lead verification remains separate.')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, TypeError, KeyError) as error:
        print('FAIL: ' + str(error), file=sys.stderr)
        sys.exit(1)
