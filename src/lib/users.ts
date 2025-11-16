import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'users.json');
const MAX_FAILED = 5;
const LOCK_MS = 15 * 60 * 1000; 

export type User = {
  id: string;
  name?: string | null;
  email: string;
  hashedPassword?: string | null;
  failedAttempts?: number;
  lockUntil?: number | null;
  providerAccounts?: Array<{ provider: string; providerAccountId: string }>;
};

async function readUsers(): Promise<User[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw) as User[];
  } catch (e) {
    return [];
  }
}

async function writeUsers(users: User[]) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2), 'utf-8');
}

export async function findUserByEmail(email: string) {
  const users = await readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findUserByProvider(provider: string, providerAccountId: string) {
  const users = await readUsers();
  return (
    users.find((u) => (u.providerAccounts || []).some((p) => p.provider === provider && p.providerAccountId === providerAccountId)) ||
    null
  );
}

export async function createUser({ name, email, password }: { name?: string; email: string; password: string }) {
  const users = await readUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return { ok: false, message: 'User already exists' };
  const hash = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: Date.now().toString(),
    name: name || null,
    email,
    hashedPassword: hash,
    failedAttempts: 0,
    lockUntil: null,
    providerAccounts: [],
  };
  users.push(newUser);
  await writeUsers(users);
  return { ok: true, user: { id: newUser.id, email: newUser.email, name: newUser.name } };
}

export async function verifyUser(email: string, password: string) {
  const users = await readUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { ok: false, message: 'No user found' };
  const now = Date.now();
  if (user.lockUntil && user.lockUntil > now) {
    return { ok: false, message: `Account locked until ${new Date(user.lockUntil).toLocaleString()}` };
  }
  if (!user.hashedPassword) return { ok: false, message: 'No password set for this account' };
  const match = await bcrypt.compare(password, user.hashedPassword);
  if (!match) {
    user.failedAttempts = (user.failedAttempts || 0) + 1;
    if ((user.failedAttempts || 0) >= MAX_FAILED) {
      user.lockUntil = Date.now() + LOCK_MS;
    }
    await writeUsers(users);
    const remaining = Math.max(0, MAX_FAILED - (user.failedAttempts || 0));
    return { ok: false, message: `Invalid credentials. ${remaining} attempts left.` };
  }
  user.failedAttempts = 0;
  user.lockUntil = null;
  await writeUsers(users);
  return { ok: true, user: { id: user.id, email: user.email, name: user.name } };
}

export async function createOrLinkOAuth({ email, name, provider, providerAccountId }: { email: string; name?: string; provider: string; providerAccountId: string }) {
  const users = await readUsers();
  // find by provider first
  let u = users.find((x) => (x.providerAccounts || []).some((p) => p.provider === provider && p.providerAccountId === providerAccountId));
  if (u) return { ok: true, user: { id: u.id, email: u.email, name: u.name } };
  u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
  if (u) {
    u.providerAccounts = u.providerAccounts || [];
    u.providerAccounts.push({ provider, providerAccountId });
    await writeUsers(users);
    return { ok: true, user: { id: u.id, email: u.email, name: u.name } };
  }
  const newUser: User = {
    id: Date.now().toString(),
    name: name || null,
    email,
    hashedPassword: null,
    failedAttempts: 0,
    lockUntil: null,
    providerAccounts: [{ provider, providerAccountId }],
  };
  users.push(newUser);
  await writeUsers(users);
  return { ok: true, user: { id: newUser.id, email: newUser.email, name: newUser.name } };
}

export async function linkProviderToUser(userId: string, provider: string, providerAccountId: string) {
  const users = await readUsers();
  const u = users.find((x) => x.id === userId);
  if (!u) return { ok: false, message: 'User not found' };
  u.providerAccounts = u.providerAccounts || [];
  if (!u.providerAccounts.some((p) => p.provider === provider && p.providerAccountId === providerAccountId)) {
    u.providerAccounts.push({ provider, providerAccountId });
    await writeUsers(users);
  }
  return { ok: true };
}

export async function getAllUsers() {
  return await readUsers();
}
