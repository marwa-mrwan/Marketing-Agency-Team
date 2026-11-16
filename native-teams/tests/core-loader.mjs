// Test-only resolver: use core packages from an explicit compatible host.
// Reject the feature packages being replaced, proving they are not imported.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve as pathResolve } from 'node:path';
const root = process.env.AGENCY_TEST_RUNTIME;
if (!root) throw new Error('AGENCY_TEST_RUNTIME must name an unpacked compatible DSH runtime.');
const require = createRequire(pathResolve(root, 'package.json'));
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@deepseek-ai/dsh-experimental-') && specifier.includes('agent-team')) {
    throw new Error('Original Agent Teams feature package is forbidden in add-on tests: ' + specifier);
  }
  if (specifier.startsWith('@deepseek-ai/') || specifier === 'zod') {
    return { url: pathToFileURL(require.resolve(specifier)).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
