-- Fete Full Demo Seed
-- 10 venues · 20 spaces · 10 bookers · 13 conversations · messages
-- Run AFTER migrations/001_demo_schema.sql
-- Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING

-- ── 1. VENUES ─────────────────────────────────────────────────────────────────

INSERT INTO venues (name, slug, neighbourhood, description, capacity_min, capacity_max, price_estimate, event_types, photos, website)
VALUES
  ('Morchella', 'morchella', 'Shoreditch',
   'A stunning private dining destination in the heart of Shoreditch. Morchella blends industrial-chic interiors with seasonal, ingredient-led menus. Two versatile private spaces make it ideal for alumni dinners, corporate celebrations, and intimate birthday gatherings.',
   20, 80, '£££',
   ARRAY['Alumni dinner','Corporate','Birthday','Party'],
   ARRAY['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80','https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80','https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80'],
   'https://morchella.co.uk'),

  ('Boxcar', 'boxcar', 'Hackney',
   'Boxcar is a converted railway arch venue in Hackney with two distinct event spaces. The Main Hall holds up to 120 for large parties and corporate events, while the intimate Wine Cellar seats 20 for private tastings and dinners.',
   20, 120, '££',
   ARRAY['Party','Corporate','Workshop','Exhibition'],
   ARRAY['https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80','https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80','https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80'],
   'https://boxcarhackney.co.uk'),

  ('Tamila', 'tamila', 'Brixton',
   'Tamila is a vibrant, multi-level event space in the heart of Brixton. With a buzzing ground floor bar and a moody basement perfect for intimate events, it brings energy and soul to every gathering.',
   20, 100, '££',
   ARRAY['Party','Birthday','Alumni dinner','Corporate'],
   ARRAY['https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800&q=80','https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80','https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=800&q=80'],
   'https://tamila.co.uk'),

  ('The Culpeper', 'the-culpeper', 'Spitalfields',
   'A beloved Spitalfields landmark across four floors. The rooftop greenhouse is a unique setting for intimate dinners; The Vault below street level suits moody suppers and tastings. One of East London''s most characterful event venues.',
   15, 60, '£££',
   ARRAY['Birthday','Alumni dinner','Corporate','Party'],
   ARRAY['https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&q=80','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80','https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80'],
   'https://theculpeper.com'),

  ('Lardo', 'lardo', 'London Fields',
   'Lardo is a neighbourhood Italian gem in London Fields. The private dining room fits 35 for intimate suppers; the terrace spills onto the canal path for relaxed summer events. Known for natural wine and handmade pasta.',
   20, 60, '££',
   ARRAY['Birthday','Alumni dinner','Corporate'],
   ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80','https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'],
   'https://lardo.co.uk'),

  ('Studio 9294', 'studio-9294', 'Hackney Wick',
   'Studio 9294 is a creative multiplex in Hackney Wick across three raw industrial spaces. Studio A and B suit photography, film, workshops, and brand activations; The Yard is an open-air courtyard perfect for product launches and large parties.',
   30, 200, '££',
   ARRAY['Corporate','Workshop','Party','Exhibition'],
   ARRAY['https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80','https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80','https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80'],
   'https://studio9294.co.uk'),

  ('The Exhibitionist', 'the-exhibitionist', 'South Kensington',
   'The Exhibitionist is a boutique hotel and arts venue steps from the V&A. The Gallery Room features rotating contemporary art and seats 45 for private dinners; the Drawing Room is an intimate salon for 25 seated or 50 standing.',
   15, 80, '££££',
   ARRAY['Corporate','Birthday','Alumni dinner','Wedding'],
   ARRAY['https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80','https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&q=80','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'],
   'https://theexhibitionisthotel.com'),

  ('Ottolenghi Islington', 'ottolenghi-islington', 'Islington',
   'The original Ottolenghi. Iconic white counter, open kitchen, and the unmistakeable Ottolenghi aesthetic. Available for exclusive hire for 60 guests — a dream setting for milestone birthdays, alumni dinners, and corporate suppers.',
   30, 65, '£££',
   ARRAY['Birthday','Alumni dinner','Corporate'],
   ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80','https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80'],
   'https://ottolenghi.co.uk'),

  ('Printworks London', 'printworks-london', 'Surrey Quays',
   'Europe''s most iconic industrial events venue. The former printing press of the Daily Mail, transformed into a world-class multi-room cultural destination. Press Halls accommodate 3,000; the Dark Room is a cavernous intimate space.',
   50, 3000, '£££',
   ARRAY['Corporate','Party','Exhibition','Workshop'],
   ARRAY['https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80','https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80','https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80'],
   'https://printworkslondon.co.uk'),

  ('Pergola on the Roof', 'pergola-on-the-roof', 'White City',
   'An indoor-outdoor Mediterranean paradise perched on the rooftop of the Westfield complex. The Roof Terrace accommodates 150 under vine-draped trellises; The Loft is a private dining room for 60 with panoramic views.',
   40, 200, '£££',
   ARRAY['Party','Wedding','Corporate','Birthday'],
   ARRAY['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80','https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800&q=80','https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=800&q=80'],
   'https://pergolaontherooftop.co.uk')

ON CONFLICT (slug) DO NOTHING;

-- ── 2. SPACES (20 total) ──────────────────────────────────────────────────────

-- Morchella (2 spaces)
INSERT INTO spaces (venue_id, name, capacity, base_price, photos, payment_deposit_pct, payment_min_spend, payment_pay_ahead)
SELECT v.id, s.name, s.capacity, s.base_price, s.photos, s.dep, s.mins, s.payahead
FROM venues v CROSS JOIN (VALUES
  ('Private Dining Room', 30, 85,
   ARRAY['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80','https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'],
   25, 2000, false),
  ('Garden Room', 55, 75,
   ARRAY['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80','https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80'],
   25, 3000, false)
) AS s(name, capacity, base_price, photos, dep, mins, payahead)
WHERE v.slug = 'morchella'
  AND NOT EXISTS (SELECT 1 FROM spaces sp WHERE sp.venue_id = v.id AND sp.name = s.name);

-- Boxcar (2 spaces)
INSERT INTO spaces (venue_id, name, capacity, base_price, photos, payment_deposit_pct, payment_min_spend, payment_pay_ahead)
SELECT v.id, s.name, s.capacity, s.base_price, s.photos, s.dep, s.mins, s.payahead
FROM venues v CROSS JOIN (VALUES
  ('Main Hall', 120, 65,
   ARRAY['https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80','https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80'],
   30, 5000, false),
  ('Wine Cellar', 20, 95,
   ARRAY['https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80'],
   50, 1500, true)
) AS s(name, capacity, base_price, photos, dep, mins, payahead)
WHERE v.slug = 'boxcar'
  AND NOT EXISTS (SELECT 1 FROM spaces sp WHERE sp.venue_id = v.id AND sp.name = s.name);

-- Tamila (2 spaces)
INSERT INTO spaces (venue_id, name, capacity, base_price, photos, payment_deposit_pct, payment_min_spend, payment_pay_ahead)
SELECT v.id, s.name, s.capacity, s.base_price, s.photos, s.dep, s.mins, s.payahead
FROM venues v CROSS JOIN (VALUES
  ('Ground Floor', 80, 70,
   ARRAY['https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800&q=80','https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80'],
   25, 4000, false),
  ('Basement', 40, 80,
   ARRAY['https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=800&q=80'],
   30, 2500, false)
) AS s(name, capacity, base_price, photos, dep, mins, payahead)
WHERE v.slug = 'tamila'
  AND NOT EXISTS (SELECT 1 FROM spaces sp WHERE sp.venue_id = v.id AND sp.name = s.name);

-- The Culpeper (2 spaces)
INSERT INTO spaces (venue_id, name, capacity, base_price, photos, payment_deposit_pct, payment_min_spend, payment_pay_ahead)
SELECT v.id, s.name, s.capacity, s.base_price, s.photos, s.dep, s.mins, s.payahead
FROM venues v CROSS JOIN (VALUES
  ('Rooftop Greenhouse', 30, 95,
   ARRAY['https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&q=80','https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80'],
   30, 2500, false),
  ('The Vault', 25, 110,
   ARRAY['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'],
   50, 2000, true)
) AS s(name, capacity, base_price, photos, dep, mins, payahead)
WHERE v.slug = 'the-culpeper'
  AND NOT EXISTS (SELECT 1 FROM spaces sp WHERE sp.venue_id = v.id AND sp.name = s.name);

-- Lardo (2 spaces)
INSERT INTO spaces (venue_id, name, capacity, base_price, photos, payment_deposit_pct, payment_min_spend, payment_pay_ahead)
SELECT v.id, s.name, s.capacity, s.base_price, s.photos, s.dep, s.mins, s.payahead
FROM venues v CROSS JOIN (VALUES
  ('Private Dining Room', 35, 75,
   ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80','https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80'],
   25, 2000, false),
  ('Canal Terrace', 55, 65,
   ARRAY['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80'],
   20, 2500, false)
) AS s(name, capacity, base_price, photos, dep, mins, payahead)
WHERE v.slug = 'lardo'
  AND NOT EXISTS (SELECT 1 FROM spaces sp WHERE sp.venue_id = v.id AND sp.name = s.name);

-- Studio 9294 (3 spaces)
INSERT INTO spaces (venue_id, name, capacity, base_price, photos, payment_deposit_pct, payment_min_spend, payment_pay_ahead)
SELECT v.id, s.name, s.capacity, s.base_price, s.photos, s.dep, s.mins, s.payahead
FROM venues v CROSS JOIN (VALUES
  ('Studio A', 80, 55,
   ARRAY['https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80','https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80'],
   25, 3000, false),
  ('Studio B', 40, 60,
   ARRAY['https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80'],
   25, 2000, false),
  ('The Yard', 150, 45,
   ARRAY['https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80','https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80'],
   30, 5000, false)
) AS s(name, capacity, base_price, photos, dep, mins, payahead)
WHERE v.slug = 'studio-9294'
  AND NOT EXISTS (SELECT 1 FROM spaces sp WHERE sp.venue_id = v.id AND sp.name = s.name);

-- The Exhibitionist (2 spaces)
INSERT INTO spaces (venue_id, name, capacity, base_price, photos, payment_deposit_pct, payment_min_spend, payment_pay_ahead)
SELECT v.id, s.name, s.capacity, s.base_price, s.photos, s.dep, s.mins, s.payahead
FROM venues v CROSS JOIN (VALUES
  ('Gallery Room', 45, 95,
   ARRAY['https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80','https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&q=80'],
   30, 3500, false),
  ('Drawing Room', 25, 120,
   ARRAY['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'],
   50, 2500, false)
) AS s(name, capacity, base_price, photos, dep, mins, payahead)
WHERE v.slug = 'the-exhibitionist'
  AND NOT EXISTS (SELECT 1 FROM spaces sp WHERE sp.venue_id = v.id AND sp.name = s.name);

-- Ottolenghi Islington (1 space)
INSERT INTO spaces (venue_id, name, capacity, base_price, photos, payment_deposit_pct, payment_min_spend, payment_pay_ahead)
SELECT v.id, s.name, s.capacity, s.base_price, s.photos, s.dep, s.mins, s.payahead
FROM venues v CROSS JOIN (VALUES
  ('Exclusive Hire', 65, 85,
   ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'],
   25, 4000, false)
) AS s(name, capacity, base_price, photos, dep, mins, payahead)
WHERE v.slug = 'ottolenghi-islington'
  AND NOT EXISTS (SELECT 1 FROM spaces sp WHERE sp.venue_id = v.id AND sp.name = s.name);

-- Printworks London (2 spaces)
INSERT INTO spaces (venue_id, name, capacity, base_price, photos, payment_deposit_pct, payment_min_spend, payment_pay_ahead)
SELECT v.id, s.name, s.capacity, s.base_price, s.photos, s.dep, s.mins, s.payahead
FROM venues v CROSS JOIN (VALUES
  ('Press Hall', 300, 75,
   ARRAY['https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80','https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80'],
   30, 15000, false),
  ('Dark Room', 80, 85,
   ARRAY['https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80'],
   30, 5000, false)
) AS s(name, capacity, base_price, photos, dep, mins, payahead)
WHERE v.slug = 'printworks-london'
  AND NOT EXISTS (SELECT 1 FROM spaces sp WHERE sp.venue_id = v.id AND sp.name = s.name);

-- Pergola on the Roof (2 spaces)
INSERT INTO spaces (venue_id, name, capacity, base_price, photos, payment_deposit_pct, payment_min_spend, payment_pay_ahead)
SELECT v.id, s.name, s.capacity, s.base_price, s.photos, s.dep, s.mins, s.payahead
FROM venues v CROSS JOIN (VALUES
  ('Roof Terrace', 150, 80,
   ARRAY['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80','https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800&q=80'],
   25, 8000, false),
  ('The Loft', 60, 90,
   ARRAY['https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=800&q=80'],
   25, 4000, false)
) AS s(name, capacity, base_price, photos, dep, mins, payahead)
WHERE v.slug = 'pergola-on-the-roof'
  AND NOT EXISTS (SELECT 1 FROM spaces sp WHERE sp.venue_id = v.id AND sp.name = s.name);

-- ── 3. EVENTS (10 bookers, fixed UUIDs for TopNav) ────────────────────────────

INSERT INTO events (id, event_type, headcount, budget_per_head_max, date_from, postcode, radius_km, booker_name, booker_email, venue_name, venue_email, event_date)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'Alumni dinner', 60, 90, '2026-05-15', 'EC2A 1DX', 3, 'Sophie Chen', 'sophie.chen@gmail.com', '', '', '2026-05-15'),
  ('11111111-0000-0000-0000-000000000002', 'Corporate', 40, 70, '2026-05-22', 'E8 1LD', 3, 'James Hartley', 'james.hartley@corp.com', '', '', '2026-05-22'),
  ('11111111-0000-0000-0000-000000000003', 'Birthday', 80, 65, '2026-06-14', 'SW2 1RN', 3, 'Priya Patel', 'priya.patel@gmail.com', '', '', '2026-06-14'),
  ('11111111-0000-0000-0000-000000000004', 'Workshop', 30, 55, '2026-06-08', 'N1 2TT', 3, 'Tom Williams', 'tom.williams@studio.co.uk', '', '', '2026-06-08'),
  ('11111111-0000-0000-0000-000000000005', 'Wedding', 100, 95, '2026-07-19', 'SE1 8XX', 5, 'Emma Davis', 'emma.davis@gmail.com', '', '', '2026-07-19'),
  ('11111111-0000-0000-0000-000000000006', 'Corporate', 120, 75, '2026-05-27', 'E9 5LN', 3, 'Marcus Johnson', 'marcus.johnson@venture.io', '', '', '2026-05-27'),
  ('11111111-0000-0000-0000-000000000007', 'Birthday', 25, 80, '2026-06-03', 'EC1A 1BB', 3, 'Natasha Ivanova', 'natasha.ivanova@gmail.com', '', '', '2026-06-03'),
  ('11111111-0000-0000-0000-000000000008', 'Corporate', 45, 85, '2026-05-12', 'SW7 2RL', 3, 'Oliver Grant', 'oliver.grant@law.co.uk', '', '', '2026-05-12'),
  ('11111111-0000-0000-0000-000000000009', 'Exhibition', 60, 70, '2026-06-26', 'E8 4DA', 3, 'Zara Ahmed', 'zara.ahmed@studio.com', '', '', '2026-06-26'),
  ('11111111-0000-0000-0000-000000000010', 'Alumni dinner', 50, 80, '2026-07-05', 'E8 1LD', 3, 'Ben Clarke', 'ben.clarke@cambridge.ac.uk', '', '', '2026-07-05')
ON CONFLICT (id) DO NOTHING;

-- ── 4. CONVERSATIONS (with real status spread) ────────────────────────────────
-- Uses CTEs to look up venue/space IDs by slug/name

DO $$
DECLARE
  v_morchella_id UUID;
  v_boxcar_id UUID;
  v_tamila_id UUID;
  v_culpeper_id UUID;
  v_lardo_id UUID;
  v_studio_id UUID;
  v_exhibitionist_id UUID;
  v_ottolenghi_id UUID;
  v_printworks_id UUID;
  v_pergola_id UUID;

  sp_morchella_pdr UUID;
  sp_morchella_garden UUID;
  sp_boxcar_main UUID;
  sp_boxcar_cellar UUID;
  sp_tamila_ground UUID;
  sp_tamila_basement UUID;
  sp_culpeper_vault UUID;
  sp_lardo_pdr UUID;
  sp_lardo_terrace UUID;
  sp_studio_a UUID;
  sp_studio_yard UUID;
  sp_exhibitionist_gallery UUID;
  sp_exhibitionist_drawing UUID;
  sp_ottolenghi_exclusive UUID;
  sp_printworks_press UUID;
  sp_pergola_roof UUID;
  sp_pergola_loft UUID;
BEGIN
  -- Get venue IDs
  SELECT id INTO v_morchella_id FROM venues WHERE slug = 'morchella';
  SELECT id INTO v_boxcar_id FROM venues WHERE slug = 'boxcar';
  SELECT id INTO v_tamila_id FROM venues WHERE slug = 'tamila';
  SELECT id INTO v_culpeper_id FROM venues WHERE slug = 'the-culpeper';
  SELECT id INTO v_lardo_id FROM venues WHERE slug = 'lardo';
  SELECT id INTO v_studio_id FROM venues WHERE slug = 'studio-9294';
  SELECT id INTO v_exhibitionist_id FROM venues WHERE slug = 'the-exhibitionist';
  SELECT id INTO v_ottolenghi_id FROM venues WHERE slug = 'ottolenghi-islington';
  SELECT id INTO v_printworks_id FROM venues WHERE slug = 'printworks-london';
  SELECT id INTO v_pergola_id FROM venues WHERE slug = 'pergola-on-the-roof';

  -- Get space IDs
  SELECT id INTO sp_morchella_pdr FROM spaces WHERE venue_id = v_morchella_id AND name = 'Private Dining Room';
  SELECT id INTO sp_morchella_garden FROM spaces WHERE venue_id = v_morchella_id AND name = 'Garden Room';
  SELECT id INTO sp_boxcar_main FROM spaces WHERE venue_id = v_boxcar_id AND name = 'Main Hall';
  SELECT id INTO sp_boxcar_cellar FROM spaces WHERE venue_id = v_boxcar_id AND name = 'Wine Cellar';
  SELECT id INTO sp_tamila_ground FROM spaces WHERE venue_id = v_tamila_id AND name = 'Ground Floor';
  SELECT id INTO sp_tamila_basement FROM spaces WHERE venue_id = v_tamila_id AND name = 'Basement';
  SELECT id INTO sp_culpeper_vault FROM spaces WHERE venue_id = v_culpeper_id AND name = 'The Vault';
  SELECT id INTO sp_lardo_pdr FROM spaces WHERE venue_id = v_lardo_id AND name = 'Private Dining Room';
  SELECT id INTO sp_lardo_terrace FROM spaces WHERE venue_id = v_lardo_id AND name = 'Canal Terrace';
  SELECT id INTO sp_studio_a FROM spaces WHERE venue_id = v_studio_id AND name = 'Studio A';
  SELECT id INTO sp_studio_yard FROM spaces WHERE venue_id = v_studio_id AND name = 'The Yard';
  SELECT id INTO sp_exhibitionist_gallery FROM spaces WHERE venue_id = v_exhibitionist_id AND name = 'Gallery Room';
  SELECT id INTO sp_exhibitionist_drawing FROM spaces WHERE venue_id = v_exhibitionist_id AND name = 'Drawing Room';
  SELECT id INTO sp_ottolenghi_exclusive FROM spaces WHERE venue_id = v_ottolenghi_id AND name = 'Exclusive Hire';
  SELECT id INTO sp_printworks_press FROM spaces WHERE venue_id = v_printworks_id AND name = 'Press Hall';
  SELECT id INTO sp_pergola_roof FROM spaces WHERE venue_id = v_pergola_id AND name = 'Roof Terrace';
  SELECT id INTO sp_pergola_loft FROM spaces WHERE venue_id = v_pergola_id AND name = 'The Loft';

  -- Insert conversations
  -- Sophie (1): Morchella Garden Room → incoming
  INSERT INTO conversations (id, event_id, venue_id, space_id, status, last_message_at)
  VALUES ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', v_morchella_id, sp_morchella_garden, 'incoming', NOW() - INTERVAL '1 hour')
  ON CONFLICT (id) DO NOTHING;

  -- Sophie (2): The Culpeper Vault → awaiting_response
  INSERT INTO conversations (id, event_id, venue_id, space_id, status, last_message_at)
  VALUES ('aaaaaaaa-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', v_culpeper_id, sp_culpeper_vault, 'awaiting_response', NOW() - INTERVAL '6 hours')
  ON CONFLICT (id) DO NOTHING;

  -- James (3): Lardo Private Dining → in_negotiation
  INSERT INTO conversations (id, event_id, venue_id, space_id, status, last_message_at)
  VALUES ('aaaaaaaa-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000002', v_lardo_id, sp_lardo_pdr, 'in_negotiation', NOW() - INTERVAL '3 hours')
  ON CONFLICT (id) DO NOTHING;

  -- Priya (4): Tamila Ground Floor → confirmed
  INSERT INTO conversations (id, event_id, venue_id, space_id, status, last_message_at)
  VALUES ('aaaaaaaa-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000003', v_tamila_id, sp_tamila_ground, 'confirmed', NOW() - INTERVAL '2 days')
  ON CONFLICT (id) DO NOTHING;

  -- Priya (5): Studio 9294 Studio A → incoming
  INSERT INTO conversations (id, event_id, venue_id, space_id, status, last_message_at)
  VALUES ('aaaaaaaa-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000003', v_studio_id, sp_studio_a, 'incoming', NOW() - INTERVAL '30 minutes')
  ON CONFLICT (id) DO NOTHING;

  -- Tom (6): Ottolenghi → awaiting_response
  INSERT INTO conversations (id, event_id, venue_id, space_id, status, last_message_at)
  VALUES ('aaaaaaaa-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000004', v_ottolenghi_id, sp_ottolenghi_exclusive, 'awaiting_response', NOW() - INTERVAL '18 hours')
  ON CONFLICT (id) DO NOTHING;

  -- Emma (7): Printworks Press Hall → in_negotiation
  INSERT INTO conversations (id, event_id, venue_id, space_id, status, last_message_at)
  VALUES ('aaaaaaaa-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000005', v_printworks_id, sp_printworks_press, 'in_negotiation', NOW() - INTERVAL '5 hours')
  ON CONFLICT (id) DO NOTHING;

  -- Emma (8): Pergola Roof Terrace → incoming
  INSERT INTO conversations (id, event_id, venue_id, space_id, status, last_message_at)
  VALUES ('aaaaaaaa-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000005', v_pergola_id, sp_pergola_roof, 'incoming', NOW() - INTERVAL '2 hours')
  ON CONFLICT (id) DO NOTHING;

  -- Marcus (9): Studio 9294 The Yard → confirmed
  INSERT INTO conversations (id, event_id, venue_id, space_id, status, last_message_at)
  VALUES ('aaaaaaaa-0000-0000-0000-000000000009', '11111111-0000-0000-0000-000000000006', v_studio_id, sp_studio_yard, 'confirmed', NOW() - INTERVAL '3 days')
  ON CONFLICT (id) DO NOTHING;

  -- Natasha (10): Boxcar Wine Cellar → incoming
  INSERT INTO conversations (id, event_id, venue_id, space_id, status, last_message_at)
  VALUES ('aaaaaaaa-0000-0000-0000-000000000010', '11111111-0000-0000-0000-000000000007', v_boxcar_id, sp_boxcar_cellar, 'incoming', NOW() - INTERVAL '45 minutes')
  ON CONFLICT (id) DO NOTHING;

  -- Oliver (11): Exhibitionist Gallery Room → in_negotiation
  INSERT INTO conversations (id, event_id, venue_id, space_id, status, last_message_at)
  VALUES ('aaaaaaaa-0000-0000-0000-000000000011', '11111111-0000-0000-0000-000000000008', v_exhibitionist_id, sp_exhibitionist_gallery, 'in_negotiation', NOW() - INTERVAL '4 hours')
  ON CONFLICT (id) DO NOTHING;

  -- Zara (12): Boxcar Main Hall → incoming
  INSERT INTO conversations (id, event_id, venue_id, space_id, status, last_message_at)
  VALUES ('aaaaaaaa-0000-0000-0000-000000000012', '11111111-0000-0000-0000-000000000009', v_boxcar_id, sp_boxcar_main, 'incoming', NOW() - INTERVAL '3 hours')
  ON CONFLICT (id) DO NOTHING;

  -- Ben (13): Lardo Canal Terrace → confirmed
  INSERT INTO conversations (id, event_id, venue_id, space_id, status, last_message_at)
  VALUES ('aaaaaaaa-0000-0000-0000-000000000013', '11111111-0000-0000-0000-000000000010', v_lardo_id, sp_lardo_terrace, 'confirmed', NOW() - INTERVAL '4 days')
  ON CONFLICT (id) DO NOTHING;

END $$;

-- ── 5. MESSAGES ───────────────────────────────────────────────────────────────

-- Conv 1: Sophie → Morchella Garden Room (incoming — Felicity only)
INSERT INTO messages (conversation_id, from_type, message_text, sent_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'booker',
   'Hi, I''m organising an alumni dinner for about 60 people on 15 May. Is the Garden Room available? Budget is around £90/head.',
   NOW() - INTERVAL '62 minutes'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'felicity',
   E'Hi Sophie!\n\nGreat news — the Garden Room at Morchella is available on 15 May and fits your party of 60 perfectly (capacity up to 55 seated, so this is an ideal fit).\n\nHere''s a quick summary:\n\n📍 Garden Room at Morchella · Shoreditch\n• Capacity: up to 55 guests\n• Price: £75/head · estimated total £4,500 for 60 guests\n• 25% deposit to confirm · £3,000 minimum spend\n\nShall I ask the venue to put together a formal proposal for you?\n\nFelicity, Fete',
   NOW() - INTERVAL '61 minutes')
ON CONFLICT DO NOTHING;

-- Conv 2: Sophie → The Culpeper Vault (awaiting_response — venue replied)
INSERT INTO messages (conversation_id, from_type, message_text, sent_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000002', 'booker',
   'Interested in The Vault for an alumni dinner, 60 guests, 15 May. What''s the availability and pricing?',
   NOW() - INTERVAL '8 hours'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'felicity',
   E'Hi Sophie!\n\nThe Vault at The Culpeper is a wonderful choice for an alumni dinner — it''s a beautifully moody underground space in Spitalfields.\n\nOne thing to flag: The Vault seats up to 25 guests, so it may be a little snug for 60. You might want to consider the Rooftop Greenhouse instead (30 seated) or explore a different venue altogether.\n\nWould you like me to check availability for the Rooftop Greenhouse, or shall I flag this enquiry to the venue team anyway?\n\nFelicity, Fete',
   NOW() - INTERVAL '7 hours 55 minutes'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'venue',
   E'Hi Sophie,\n\nFelicity is right that The Vault is best for up to 25. However, we can also offer a combined hire of The Vault + our private dining room on the first floor for up to 60 guests. This would be priced at £110/head with a £5,000 minimum spend.\n\nHappy to arrange a site visit if you''d like to see both spaces?\n\nBest,\nThe Culpeper Events Team',
   NOW() - INTERVAL '6 hours')
ON CONFLICT DO NOTHING;

-- Conv 3: James → Lardo Private Dining (in_negotiation)
INSERT INTO messages (conversation_id, from_type, message_text, sent_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000003', 'booker',
   'Looking to book the private dining room for a corporate lunch, 40 people, 22 May. Budget is £70/head. Do you do set menus?',
   NOW() - INTERVAL '2 days'),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'felicity',
   E'Hi James!\n\nThe Private Dining Room at Lardo is available on 22 May and comfortably fits 40 guests (capacity up to 35 seated — just slightly under your headcount).\n\nLardo are known for their handmade pasta and natural wine selection. They do offer set menus for private events starting from £65/head.\n\nI''ve flagged your enquiry to the Lardo events team — they''ll be in touch shortly with menu options.\n\nFelicity, Fete',
   NOW() - INTERVAL '1 day 23 hours'),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'venue',
   E'Hi James,\n\nThank you for your enquiry! We''d love to host your team lunch.\n\nFor 40 guests we''d suggest using both our Private Dining Room and the adjacent Canal Terrace, which we can combine for £68/head (set menu of 3 courses + welcome Negroni). We have dates available on 22 May.\n\nI''ve attached our spring set menu for your review. Does this work for your team?',
   NOW() - INTERVAL '1 day 10 hours'),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'booker',
   'This looks great! Can we tweak the menu to include a vegetarian main? About 8 of our guests don''t eat meat.',
   NOW() - INTERVAL '3 hours')
ON CONFLICT DO NOTHING;

-- Conv 4: Priya → Tamila Ground Floor (confirmed)
INSERT INTO messages (conversation_id, from_type, message_text, sent_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000004', 'booker',
   'Hi, planning a 30th birthday for 80 guests on 14 June. Brixton area. Budget around £65/head. Is the ground floor available?',
   NOW() - INTERVAL '5 days'),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'felicity',
   E'Hi Priya! Happy to help plan your 30th — sounds like it''s going to be a great night!\n\nThe Ground Floor at Tamila is available on 14 June and fits 80 guests perfectly.\n\n📍 Ground Floor at Tamila · Brixton\n• Capacity: up to 80 guests\n• Price: £70/head · estimated total £5,600\n• 25% deposit to confirm · £4,000 minimum spend\n\nI''ve asked the Tamila team to send you a formal proposal.\n\nFelicity, Fete',
   NOW() - INTERVAL '4 days 23 hours'),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'venue',
   E'Hi Priya,\n\nLove the sound of this! We''d be delighted to host your 30th.\n\nI''ve put together a proposal — please see the attached. Headline: £70/head for 80 guests, sharing platters + DJ from 9pm, 25% deposit to confirm (£1,400).\n\nLet us know if you''d like to discuss further or arrange a viewing!',
   NOW() - INTERVAL '4 days'),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'booker',
   'Brilliant! I''m happy to confirm. How do I pay the deposit?',
   NOW() - INTERVAL '3 days'),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'venue',
   'Wonderful! I''ll send over the invoice for the £1,400 deposit by email today. We''re so excited to host you!',
   NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

-- Conv 5: Priya → Studio 9294 Studio A (incoming — fresh)
INSERT INTO messages (conversation_id, from_type, message_text, sent_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000005', 'booker',
   'Is Studio A available on 14 June for a birthday party, 80 guests? Budget £65/head.',
   NOW() - INTERVAL '32 minutes'),
  ('aaaaaaaa-0000-0000-0000-000000000005', 'felicity',
   E'Hi Priya!\n\nStudio A at Studio 9294 in Hackney Wick is available on 14 June and fits 80 guests exactly.\n\n📍 Studio A at Studio 9294 · Hackney Wick\n• Capacity: up to 80 guests\n• Price: £55/head · estimated total £4,400 for 80 guests\n• 25% deposit to confirm · £3,000 minimum spend\n\nGood news: this comes in under your £65/head budget. The raw industrial aesthetic is brilliant for a birthday party.\n\nShall I ask Studio 9294 to prepare a formal proposal?\n\nFelicity, Fete',
   NOW() - INTERVAL '31 minutes')
ON CONFLICT DO NOTHING;

-- Conv 6: Tom → Ottolenghi (awaiting_response)
INSERT INTO messages (conversation_id, from_type, message_text, sent_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000006', 'booker',
   'Would like to book Ottolenghi Islington for a design workshop, 30 people, 8 June. Does it have AV / projector facilities?',
   NOW() - INTERVAL '20 hours'),
  ('aaaaaaaa-0000-0000-0000-000000000006', 'felicity',
   E'Hi Tom!\n\nOttolenghi Islington is available for exclusive hire on 8 June — it''s a stunning space for a creative workshop.\n\n📍 Exclusive Hire at Ottolenghi Islington · Islington\n• Capacity: up to 65 guests (30 is a comfortable fit)\n• Price: £85/head · estimated total £2,550\n• 25% deposit to confirm · £4,000 minimum spend\n\nRegarding AV: Ottolenghi can provide a screen and HDMI connection for presentations. I''ve flagged your AV requirements to the events team and they''ll confirm the specifics.\n\nFelicity, Fete',
   NOW() - INTERVAL '18 hours')
ON CONFLICT DO NOTHING;

-- Conv 7: Emma → Printworks Press Hall (in_negotiation)
INSERT INTO messages (conversation_id, from_type, message_text, sent_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000007', 'booker',
   'Looking for a venue for a wedding reception, 100 guests, 19 July. Budget £95/head. Is Printworks available?',
   NOW() - INTERVAL '2 days'),
  ('aaaaaaaa-0000-0000-0000-000000000007', 'felicity',
   E'Hi Emma! Congratulations!\n\nThe Press Hall at Printworks London is available on 19 July and can absolutely accommodate 100 guests (capacity up to 300).\n\n📍 Press Hall at Printworks London · Surrey Quays\n• Capacity: up to 300 guests (100 is intimate for this space)\n• Price: £75/head · estimated total £7,500\n• 30% deposit to confirm · £15,000 minimum spend\n\nNote: the minimum spend is £15,000 — at 100 guests that works out to £150/head, which is above your current budget. You may want to consider the Dark Room (80 cap, £85/head) as a more intimate option.\n\nI''ve flagged both options to the Printworks team.\n\nFelicity, Fete',
   NOW() - INTERVAL '1 day 23 hours'),
  ('aaaaaaaa-0000-0000-0000-000000000007', 'venue',
   E'Hi Emma,\n\nWe''d love to host your wedding reception! Felicity makes a great point about the minimum spend.\n\nFor 100 guests in the Press Hall, we can put together a bespoke package at £95/head (all-inclusive: canapés, 3-course dinner, half bottle of wine, 5hr bar). This brings you to £9,500 total — below our usual minimum, which we''re happy to waive for a Saturday in July.\n\nShall I send a full proposal?',
   NOW() - INTERVAL '1 day'),
  ('aaaaaaaa-0000-0000-0000-000000000007', 'booker',
   'Yes please! That sounds perfect. Can you include a note about outside catering options?',
   NOW() - INTERVAL '5 hours')
ON CONFLICT DO NOTHING;

-- Conv 8: Emma → Pergola Roof Terrace (incoming)
INSERT INTO messages (conversation_id, from_type, message_text, sent_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000008', 'booker',
   'Is the Roof Terrace available for a wedding of 100 on 19 July? Budget £95/head.',
   NOW() - INTERVAL '2 hours 5 minutes'),
  ('aaaaaaaa-0000-0000-0000-000000000008', 'felicity',
   E'Hi Emma! What a setting for a wedding!\n\nThe Roof Terrace at Pergola on the Roof is available on 19 July and fits 100 guests comfortably (capacity up to 150).\n\n📍 Roof Terrace at Pergola on the Roof · White City\n• Capacity: up to 150 guests\n• Price: £80/head · estimated total £8,000\n• 25% deposit to confirm · £8,000 minimum spend\n\nThe vine-draped terrace is particularly magical for summer weddings. I''ve notified the Pergola events team and they''ll be in touch shortly.\n\nFelicity, Fete',
   NOW() - INTERVAL '2 hours')
ON CONFLICT DO NOTHING;

-- Conv 9: Marcus → Studio 9294 The Yard (confirmed)
INSERT INTO messages (conversation_id, from_type, message_text, sent_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000009', 'booker',
   'We''re launching a new product and need The Yard for 120 people on 27 May. Budget £75/head. Can you accommodate?',
   NOW() - INTERVAL '6 days'),
  ('aaaaaaaa-0000-0000-0000-000000000009', 'felicity',
   E'Hi Marcus!\n\nThe Yard at Studio 9294 is available on 27 May and comfortably fits 120 guests (capacity up to 150).\n\n📍 The Yard at Studio 9294 · Hackney Wick\n• Capacity: up to 150 guests\n• Price: £45/head · estimated total £5,400 for 120 guests\n• 30% deposit to confirm · £5,000 minimum spend\n\nFor a product launch, The Yard''s raw industrial outdoor aesthetic works brilliantly — great for branding and activations. I''ve flagged your enquiry to the Studio 9294 team.\n\nFelicity, Fete',
   NOW() - INTERVAL '5 days 23 hours'),
  ('aaaaaaaa-0000-0000-0000-000000000009', 'venue',
   E'Hi Marcus,\n\nPerfect timing — The Yard is free on 27 May! We''d be delighted to host your product launch.\n\nFor 120 guests we can put together a package: £50/head (includes staffing, AV setup, 4hr open bar, canape catering). Total: £6,000 + 30% deposit (£1,800) to confirm.\n\nI''ve attached a deck with our production capabilities. Let us know if you''d like a site visit!',
   NOW() - INTERVAL '5 days'),
  ('aaaaaaaa-0000-0000-0000-000000000009', 'booker',
   'Brilliant. Let''s confirm. I''ll pay the deposit today.',
   NOW() - INTERVAL '4 days'),
  ('aaaaaaaa-0000-0000-0000-000000000009', 'venue',
   'Fantastic! Invoice for £1,800 sent to your email. We''re locked in for 27 May — excited to work with you!',
   NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- Conv 10: Natasha → Boxcar Wine Cellar (incoming)
INSERT INTO messages (conversation_id, from_type, message_text, sent_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000010', 'booker',
   'Looking for a venue for a hen party, 25 people, 3 June. Budget £80/head. The Wine Cellar looks perfect!',
   NOW() - INTERVAL '47 minutes'),
  ('aaaaaaaa-0000-0000-0000-000000000010', 'felicity',
   E'Hi Natasha! What a fun occasion!\n\nThe Wine Cellar at Boxcar is available on 3 June and is a perfect fit for 25 guests.\n\n📍 Wine Cellar at Boxcar · Hackney\n• Capacity: up to 20 guests (snug for 25 — worth checking with the venue)\n• Price: £95/head · estimated total £2,375\n• 50% deposit required in advance\n• Full payment required before the event\n\nI''ve flagged your enquiry to the Boxcar team who can confirm if they can accommodate 25 in this space.\n\nFelicity, Fete',
   NOW() - INTERVAL '45 minutes')
ON CONFLICT DO NOTHING;

-- Conv 11: Oliver → Exhibitionist Gallery Room (in_negotiation)
INSERT INTO messages (conversation_id, from_type, message_text, sent_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000011', 'booker',
   'Team dinner for 45, 12 May, South Kensington. The Gallery Room looks ideal. Budget £85/head.',
   NOW() - INTERVAL '1 day'),
  ('aaaaaaaa-0000-0000-0000-000000000011', 'felicity',
   E'Hi Oliver!\n\nThe Gallery Room at The Exhibitionist is available on 12 May and seats exactly 45 guests.\n\n📍 Gallery Room at The Exhibitionist · South Kensington\n• Capacity: up to 45 guests\n• Price: £95/head · estimated total £4,275\n• 30% deposit to confirm · £3,500 minimum spend\n\nNote: the base price of £95/head is slightly above your £85 budget. I''ve flagged this to the events team — they may be able to accommodate you at a preferential rate.\n\nFelicity, Fete',
   NOW() - INTERVAL '23 hours'),
  ('aaaaaaaa-0000-0000-0000-000000000011', 'venue',
   E'Hi Oliver,\n\nThank you for your enquiry! We''d love to host your team dinner.\n\nFor a party of 45 on a Tuesday, we can offer our Gallery Room at £88/head (3 courses + wine pairing, all service included). The current exhibition is a photography series on East Africa — a great conversation starter.\n\nShall I prepare a formal proposal?',
   NOW() - INTERVAL '18 hours'),
  ('aaaaaaaa-0000-0000-0000-000000000011', 'booker',
   'Yes please. Can you also confirm parking options? Several guests are driving from outside London.',
   NOW() - INTERVAL '4 hours')
ON CONFLICT DO NOTHING;

-- Conv 12: Zara → Boxcar Main Hall (incoming)
INSERT INTO messages (conversation_id, from_type, message_text, sent_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000012', 'booker',
   'Enquiring about the Main Hall for a gallery opening, 60 guests, 26 June. Budget £70/head.',
   NOW() - INTERVAL '3 hours 5 minutes'),
  ('aaaaaaaa-0000-0000-0000-000000000012', 'felicity',
   E'Hi Zara!\n\nThe Main Hall at Boxcar in Hackney is available on 26 June and fits 60 guests comfortably (capacity up to 120).\n\n📍 Main Hall at Boxcar · Hackney\n• Capacity: up to 120 guests\n• Price: £65/head · estimated total £3,900 for 60 guests\n• 30% deposit to confirm · £5,000 minimum spend\n\nNote: the minimum spend is £5,000 — at 60 guests that comes to £83/head, which is above your current £70 budget. If you can flex slightly, it''s a brilliant raw space for an opening.\n\nI''ve notified the Boxcar team who will be in touch.\n\nFelicity, Fete',
   NOW() - INTERVAL '3 hours')
ON CONFLICT DO NOTHING;

-- Conv 13: Ben → Lardo Canal Terrace (confirmed)
INSERT INTO messages (conversation_id, from_type, message_text, sent_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000013', 'booker',
   'Looking for the Canal Terrace for an alumni dinner, 50 people, 5 July. Budget £80/head.',
   NOW() - INTERVAL '7 days'),
  ('aaaaaaaa-0000-0000-0000-000000000013', 'felicity',
   E'Hi Ben!\n\nThe Canal Terrace at Lardo in London Fields is available on 5 July and fits your 50 guests perfectly.\n\n📍 Canal Terrace at Lardo · London Fields\n• Capacity: up to 55 guests\n• Price: £65/head · estimated total £3,250\n• 20% deposit to confirm · £2,500 minimum spend\n\nGood news: this is well within your £80/head budget. The terrace overlooking the canal is a wonderful setting for an alumni dinner in July.\n\nFelicity, Fete',
   NOW() - INTERVAL '6 days 23 hours'),
  ('aaaaaaaa-0000-0000-0000-000000000013', 'venue',
   E'Hi Ben,\n\nWe''d be delighted to host your alumni dinner! July on the canal terrace is magical.\n\nI''ve put together a proposal: £68/head for 50 guests (3-course sharing menu + welcome Aperol Spritz). Total: £3,400. 20% deposit (£680) to confirm.\n\nShall I send the formal proposal document?',
   NOW() - INTERVAL '6 days'),
  ('aaaaaaaa-0000-0000-0000-000000000013', 'booker',
   'Perfect, yes please! The alumni committee has approved this.',
   NOW() - INTERVAL '5 days'),
  ('aaaaaaaa-0000-0000-0000-000000000013', 'venue',
   'Wonderful! Proposal and deposit invoice sent. Looking forward to welcoming you all in July!',
   NOW() - INTERVAL '4 days')
ON CONFLICT DO NOTHING;

-- ── 6. VERIFY ─────────────────────────────────────────────────────────────────

SELECT
  v.name AS venue,
  v.slug,
  COUNT(DISTINCT s.id) AS spaces,
  COUNT(DISTINCT c.id) AS conversations
FROM venues v
LEFT JOIN spaces s ON s.venue_id = v.id
LEFT JOIN conversations c ON c.venue_id = v.id
GROUP BY v.id, v.name, v.slug
ORDER BY v.name;
