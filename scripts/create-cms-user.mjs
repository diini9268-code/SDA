import { randomBytes, scryptSync } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import pg from "pg";

const { Client } = pg;
const KEY_LENGTH = 64;
const SCRYPT_COST = 16384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const SUPPORTED_ROLES = new Set(["ADMIN", "BLOGGER"]);

function loadDotEnv() {
  if (!existsSync(".env")) return;

  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;

    const separatorIndex = trimmedLine.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (key && process.env[key] == null) process.env[key] = value;
  }
}

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

function hashPassword(password) {
  const salt = randomBytes(24).toString("base64url");
  const derivedKey = scryptSync(password, salt, KEY_LENGTH, {
    N: SCRYPT_COST,
    r: SCRYPT_BLOCK_SIZE,
    p: SCRYPT_PARALLELIZATION,
  });

  return [
    "scrypt",
    SCRYPT_COST,
    SCRYPT_BLOCK_SIZE,
    SCRYPT_PARALLELIZATION,
    salt,
    derivedKey.toString("base64"),
  ].join("$");
}

loadDotEnv();

const databaseUrl = requiredEnv("DATABASE_URL");
const fullName = requiredEnv("CMS_USER_FULL_NAME");
const email = requiredEnv("CMS_USER_EMAIL").toLowerCase();
const password = requiredEnv("CMS_USER_PASSWORD");
const role = requiredEnv("CMS_USER_ROLE").toUpperCase();

if (!SUPPORTED_ROLES.has(role)) {
  throw new Error("CMS_USER_ROLE must be ADMIN or BLOGGER.");
}

if (password.length < 12) {
  throw new Error("CMS_USER_PASSWORD must be at least 12 characters.");
}

const client = new Client({ connectionString: databaseUrl });
await client.connect();

try {
  const result = await client.query(
    `
      insert into users (full_name, email, password, role, is_active, updated_at)
      values ($1, $2, $3, $4::"UserRole", true, now())
      on conflict (email)
      do update set
        full_name = excluded.full_name,
        password = excluded.password,
        role = excluded.role,
        is_active = true,
        updated_at = now()
      returning email, role, is_active
    `,
    [fullName, email, hashPassword(password), role],
  );

  const user = result.rows[0];
  console.log(
    `CMS user ready: ${user.email} (${user.role}, active=${user.is_active})`,
  );
} finally {
  await client.end();
}
