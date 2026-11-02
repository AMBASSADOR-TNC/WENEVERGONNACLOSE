function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
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

export async function onRequestPost({ request, env }) {
  if (!env.DB || !env.IDENTITY_HASH_SECRET) {
    return json({ error: "Entry validation is not configured." }, 503);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "A valid entry token is required." }, 400);
  }

  if (typeof payload.entryToken !== "string" || !["table", "counter"].includes(payload.lane)) {
    return json({ error: "A valid entry token and lane are required." }, 400);
  }

  const tokenHash = await keyedHash(`token:${payload.entryToken}`, env.IDENTITY_HASH_SECRET);
  const now = new Date().toISOString();
  const result = await env.DB.prepare(
    `UPDATE universal_entries
     SET consumed_at = ?
     WHERE token_hash = ?
       AND lane = ?
       AND consumed_at IS NULL
       AND expires_at > ?`
  ).bind(now, tokenHash, payload.lane, now).run();

  if (result.meta.changes !== 1) {
    return json({ error: "This entry is invalid, expired, or already used." }, 403);
  }

  return json({ lane: payload.lane, exit: "estore" });
}
