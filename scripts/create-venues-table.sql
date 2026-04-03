create table venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  neighbourhood text not null,
  capacity_min int,
  capacity_max int,
  price_estimate text,
  event_types text[],
  description text,
  photos text[],
  website text,
  last_confirmed_at timestamptz,
  created_at timestamptz default now()
);
