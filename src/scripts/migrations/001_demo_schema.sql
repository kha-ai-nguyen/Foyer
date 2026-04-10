-- Fete Migration 001 — Demo Schema Extensions
-- Run in Supabase SQL editor before seeding demo data
-- Safe to run multiple times (uses IF NOT EXISTS / DO NOTHING patterns)

-- ── conversations: add status + last_message_at ───────────────────────────────

ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'incoming';

ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ;

-- Back-fill last_message_at from messages table
UPDATE conversations c
SET last_message_at = (
  SELECT MAX(m.sent_at)
  FROM messages m
  WHERE m.conversation_id = c.id
)
WHERE last_message_at IS NULL;

-- ── proposals: proper schema ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS proposals (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  UUID REFERENCES conversations(id) ON DELETE CASCADE,
  venue_id         UUID REFERENCES venues(id) ON DELETE CASCADE,
  event_id         UUID REFERENCES events(id) ON DELETE CASCADE,
  status           TEXT NOT NULL DEFAULT 'draft',  -- draft | sent | accepted | declined
  price_per_head   NUMERIC(10,2),
  total_estimate   NUMERIC(10,2),
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at          TIMESTAMPTZ,
  accepted_at      TIMESTAMPTZ
);

-- ── events: add booker_email if missing ───────────────────────────────────────

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS booker_email TEXT;

-- ── Verify ────────────────────────────────────────────────────────────────────

SELECT
  column_name, data_type
FROM information_schema.columns
WHERE table_name = 'conversations'
  AND column_name IN ('status', 'last_message_at')
ORDER BY column_name;
