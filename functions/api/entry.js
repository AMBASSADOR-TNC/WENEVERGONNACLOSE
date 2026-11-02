const MAX_GRADUATION_YEAR_OFFSET = 1;
const TOKEN_TTL_MS = 10 * 60 * 1000;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function isValidSequence(sequence) {
  return sequence &&
    ["adult-man", "adult-woman", "youth-boy", "youth-girl"].includes(sequence.base) &&
    ["calm", "overwhelmed", "hopeful"].includes(sequence.presentEmotion) &&
    ["steady", "proud", "peaceful"].includes(sequence.futureEmotion);
}

async function keyedHash(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );
  return Array.from(new Uint8Array(signature), byte =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

function createEntryToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function onRequestPost({ request, env }) {
  if (!env.DB || !env.IDENTITY_HASH_SECRET) {
    return json({ error: "Entry registration is not configured." }, 503);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "A valid registration payload is required." }, 400);
  }

  const email = normalizeEmail(payload.email);
  const graduationYear = Number(payload.graduationYear);
  const currentYear = new Date().getUTCFullYear();
  const lane = payload.lane;
  const underCollegeConfirmed = payload.underCollegeConfirmed === true;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !Number.isInteger(graduationYear) ||
      graduationYear < 1900 || graduationYear > currentYear + MAX_GRADUATION_YEAR_OFFSET ||
      !["table", "counter"].includes(lane) || !isValidSequence(payload.sequence)) {
    return json({ error: "The registration details are invalid." }, 400);
  }

  const expectedLane = graduationYear >= currentYear ? "table" : "counter";
  if (lane !== expectedLane) {
    return json({ error: "The selected lane does not match the graduation year." }, 400);
  }
  if (lane === "table" && !underCollegeConfirmed) {
    return json({ error: "Under-college confirmation is required for The Table." }, 400);
  }

  const ip = request.headers.get("CF-Connecting-IP");
  if (!ip) {
    return json({ error: "A verified source address is required." }, 400);
  }

  const [emailHash, ipHash] = await Promise.all([
    keyedHash(`email:${email}`, env.IDENTITY_HASH_SECRET),
    keyedHash(`ip:${ip}`, env.IDENTITY_HASH_SECRET)
  ]);
  const entryToken = createEntryToken();
  const tokenHash = await keyedHash(`token:${entryToken}`, env.IDENTITY_HASH_SECRET);
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

  try {
    await env.DB.prepare(
      `INSERT INTO universal_entries (
        email_hash, ip_hash, token_hash, lane, graduation_year, sequence_json, created_at, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      emailHash,
      ipHash,
      tokenHash,
      lane,
      graduationYear,
      JSON.stringify(payload.sequence),
      now,
      expiresAt
    ).run();
  } catch (error) {
    if (String(error.message).includes("UNIQUE constraint failed")) {
      return json({ error: "This email address or network has already used universal entry." }, 409);
    }

    return json({ error: "Registration could not be completed." }, 500);
  }

  return json({ entryToken, lane: expectedLane });
}
