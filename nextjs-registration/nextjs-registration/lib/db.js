// A tiny JSON-file "database" so students need no extra software.
// In a real project, replace this file with Prisma + PostgreSQL/MySQL/SQLite
// or MongoDB. The rest of the app would not need to change.
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_FILE = path.join(process.cwd(), 'data', 'users.json');

async function readUsers() {
  try {
    const text = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(text);
  } catch (err) {
    if (err.code === 'ENOENT') return []; // file does not exist yet
    throw err;
  }
}

export async function findUserByEmail(email) {
  const users = await readUsers();
  return users.find((u) => u.email === email) || null;
}

export async function createUser({ name, email, passwordHash }) {
  const users = await readUsers();
  if (users.some((u) => u.email === email)) {
    const error = new Error('Email already registered');
    error.code = 'DUPLICATE_EMAIL';
    throw error;
  }
  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(users, null, 2), 'utf8');
  return user;
}
