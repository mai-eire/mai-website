// Creates or updates a newsroom account.
//
//   npm run create-admin -- you@mai.ie "Your Name" ADMIN
//
// The password is read from stdin rather than taken as an argument, so it
// never lands in your shell history or in the process list.

const readline = require('readline');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

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
  const [email, name, role = 'ADMIN'] = process.argv.slice(2);

  if (!email) {
    console.error('Usage: npm run create-admin -- <email> "<name>" [ADMIN|EDITOR]');
    process.exit(1);
  }
  if (!['ADMIN', 'EDITOR'].includes(role)) {
    console.error('Unknown role "' + role + '". Use ADMIN or EDITOR.');
    process.exit(1);
  }

  const password = await ask('Password for ' + email + ': ');
  if (!password || password.length < 10) {
    console.error('Password must be at least 10 characters.');
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashed, role, name: name || undefined },
    create: { email, password: hashed, role, name: name || null },
  });

  console.log('');
  console.log('Done. ' + user.email + ' is ready as ' + user.role + '.');
  console.log('Sign in at /admin/login');
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error(e.message);
  await prisma.$disconnect();
  process.exit(1);
});
