import { spawnSync } from 'node:child_process';

const forwarded = process.argv.slice(2);
const result = spawnSync(process.execPath, ['--test', ...forwarded, 'site/tests/claims.test.mjs'], {
  stdio: 'inherit',
  env: process.env
});
process.exit(result.status ?? 1);
