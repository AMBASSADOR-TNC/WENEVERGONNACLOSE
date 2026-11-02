CREATE TABLE universal_entries (
  id INTEGER PRIMARY KEY,
  email_hash TEXT NOT NULL UNIQUE,
  ip_hash TEXT NOT NULL UNIQUE,
  token_hash TEXT NOT NULL UNIQUE,
  lane TEXT NOT NULL CHECK (lane IN ('table', 'counter')),
  graduation_year INTEGER NOT NULL,
  sequence_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT
);
