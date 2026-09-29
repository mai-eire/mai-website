// Creates or updates a newsroom account.
//
//   npm run create-admin -- you@mai.ie "Your Name" ADMIN            (local)
//   npm run create-admin -- you@mai.ie "Your Name" ADMIN --remote   (production)
//
// The password is read from stdin rather than taken as an argument, so it
// never lands in your shell history or in the process list.
//
// Local by default. Pass --remote to create the account on the deployed D1
// database - that is the one-off step that gives the live site its first
// editor, and it needs `wrangler login` to have been run first.

const readline = require('readline');
const bcrypt = require('bcryptjs');
const { lit, execute, wantsRemote, newId } = require('./d1');

const ask = (question) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });

(async () => {
  const remote = wantsRemote(process.argv);
  const [email, name, role = 'ADMIN'] = process.argv.slice(2).filter((a) => a !== '--remote');

  if (!email) {
    console.error('Usage: npm run create-admin -- <email> "<name>" [ADMIN|EDITOR] [--remote]');
    process.exit(1);
  }
  if (!['ADMIN', 'EDITOR'].includes(role)) {
    console.error('Unknown role "' + role + '". Use ADMIN or EDITOR.');
    process.exit(1);
  }

  const password = await ask('Password for ' + email + (remote ? ' (PRODUCTION)' : '') + ': ');
  if (!password || password.length < 10) {
    console.error('Password must be at least 10 characters.');
    process.exit(1);
  }

  const normalised = String(email).trim().toLowerCase();
  const hashed = await bcrypt.hash(password, 12);
  const now = Date.now();

  // Upsert on the unique email, so re-running this is how you reset a password
  // rather than an error. createdAt is left alone on conflict - an existing
  // account keeps the date it was actually made.
  execute(
    [
      'INSERT INTO "User" (id, email, name, password, role, createdAt, updatedAt)',
      `VALUES (${lit(newId())}, ${lit(normalised)}, ${lit(name || null)}, ${lit(hashed)}, ${lit(role)}, ${now}, ${now})`,
      'ON CONFLICT(email) DO UPDATE SET',
      '  password = excluded.password,',
      '  role = excluded.role,',
      '  name = excluded.name,',
      '  updatedAt = excluded.updatedAt;',
    ],
    { remote }
  );

  console.log('');
  console.log(`Done. ${normalised} is ready as ${role} on the ${remote ? 'remote' : 'local'} database.`);
  console.log('Sign in at /admin/login');
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
