// Shared plumbing for the scripts that write to D1.
//
// These scripts run in plain Node, which means they cannot use lib/prisma.ts:
// that needs a D1 *binding*, and bindings only exist inside a Worker request.
// So they build SQL and hand it to `wrangler d1 execute` instead, which already
// knows how to reach both the local database and the remote one and is already
// authenticated by `wrangler login`. No separate API token to issue or store.
//
// DATES ARE INTEGER MILLISECONDS. Prisma's SQLite connector stores DateTime as
// a unix-millisecond integer, not as a string - the `DEFAULT CURRENT_TIMESTAMP`
// in the generated migration is SQLite's own default and is a different format
// from what the client writes. Insert a date as text and Prisma will fail to
// read the row back. `lit()` below enforces this; do not hand-format dates.

const { execFileSync } = require('node:child_process');
const { writeFileSync, mkdtempSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');

const DATABASE = 'mai-website';

// A SQL literal. Strings get their quotes doubled, which is SQLite's escape and
// the reason none of this needs a separate parameter-binding layer.
const lit = (value) => {
  if (value === null || value === undefined) return 'NULL';
  if (value instanceof Date) return String(value.getTime());
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? '1' : '0';
  return "'" + String(value).replace(/'/g, "''") + "'";
};

// Runs statements against D1. Local by default: a script that reaches for the
// production database unless told otherwise is a script that will one day wipe
// it by accident.
const execute = (statements, { remote = false } = {}) => {
  const sql = statements.filter(Boolean).join('\n');
  const file = join(mkdtempSync(join(tmpdir(), 'mai-d1-')), 'statements.sql');
  writeFileSync(file, sql, 'utf8');

  execFileSync(
    'npx',
    [
      'wrangler',
      'd1',
      'execute',
      DATABASE,
      remote ? '--remote' : '--local',
      `--file=${file}`,
      '--yes',
    ],
    { stdio: 'inherit' }
  );
};

// `--remote` on the command line, anywhere in the arguments.
const wantsRemote = (argv) => argv.includes('--remote');

// The scripts insert rows directly, so they supply their own primary keys.
// The schema's cuid() default is applied by the Prisma client, which is not in
// play here; any unique string satisfies the column.
const newId = () => require('node:crypto').randomUUID();

module.exports = { DATABASE, lit, execute, wantsRemote, newId };
