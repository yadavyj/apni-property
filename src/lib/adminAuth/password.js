// Node-only (bcryptjs) — only ever imported from Server Actions, never from
// middleware. Keep this out of jwt.js so the Edge middleware bundle stays
// bcryptjs-free.
import bcrypt from "bcryptjs";

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
