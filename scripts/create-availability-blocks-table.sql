-- Phase 2: Calendar sync — availability_blocks + venue calendar columns
-- Run after create-venues-table.sql

-- Add calendar connection columns to venues
alter table venues
  add column if not exists calendar_type text check (calendar_type in ('google', 'ical')),
  add column if not exists ical_url text,
  add column if not exists last_synced_at timestamptz;

-- Availability blocks populated by iCal / Google Calendar sync
create table if not exists availability_blocks (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  title text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  all_day boolean not null default false,
  source text not null check (source in ('google', 'ical')),
  uid text,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Fast lookups by venue + date range
create index if not exists idx_availability_blocks_venue_date
  on availability_blocks (venue_id, starts_at, ends_at);

-- Unique constraint on external UID per venue to enable upsert
create unique index if not exists idx_availability_blocks_venue_uid
  on availability_blocks (venue_id, uid) where uid is not null;
