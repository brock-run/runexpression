-- RunExpression V1 - Seed Data for Development
-- This creates sample data for local development and testing

-- =====================================================
-- Seed: DWTC Club
-- =====================================================
INSERT INTO public.clubs (id, name, slug, description, manifesto, is_public, is_active) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'Dogs Who Track Club',
    'dwtc',
    'A running community forged in bacon grease and sub-16 efforts',
    '{
        "tagline": "Where lore lives. Where miles turn into memories.",
        "values": ["Community", "Process Over Outcome", "Bacon Rituals"],
        "traditions": [
            "Bacon ritual after hard efforts",
            "Sub-16 mile club initiation",
            "Pre-marathon sticker design sessions"
        ]
    }'::jsonb,
    true,
    true
);

-- =====================================================
-- Seed: Sample Flow Entries (Approved)
-- Note: These won't have user_id set (anonymous submissions)
-- =====================================================
INSERT INTO public.expression_events (type, content, vibe_tags, moderation_status, visibility) VALUES
-- Meditative vibes
('text', 'Today I ran for the quiet. Five miles of just breath and footsteps. No pace pressure, no destination. Just motion.', ARRAY['Meditative', 'Solo Journey', 'Peace'], 'approved', 'public'),
('text', 'The pre-dawn miles hit different. City still sleeping, only sound is my feet finding rhythm. This is my church.', ARRAY['Meditative', 'Morning Miles', 'Flow State'], 'approved', 'public'),

-- Competitive/Race day
('text', 'Mile 20: everything hurts. Mile 22: still here. Mile 24: I''m f***ing doing this. Mile 26.2: I did that.', ARRAY['Defiant', 'Race Day', 'Triumph'], 'approved', 'public'),
('text', 'Sub-16 attempt #7. Failed again. But I''m learning where the edge is. Getting closer.', ARRAY['Competitive', 'Struggle', 'Exploratory'], 'approved', 'public'),

-- Crew energy
('text', 'When the pack goes silent at mile 23, you know everyone is in the pain cave together. That''s when the real running starts.', ARRAY['Crew Energy', 'Suffering', 'Race Day'], 'approved', 'public'),
('text', 'Bacon ritual complete. 16 fasted miles, earned every crispy bite. This is what we do.', ARRAY['Celebratory', 'Crew Energy', 'Morning Miles'], 'approved', 'public'),

-- Grateful/reflective
('text', 'One year ago I couldn''t run a mile. Today I did ten. The body remembers how to heal.', ARRAY['Grateful', 'Injury Comeback', 'Triumph'], 'approved', 'public'),
('text', 'Running doesn''t fix everything. But it gives me a place to put the chaos for a while.', ARRAY['Grateful', 'Solo Journey', 'Peace'], 'approved', 'public'),

-- Discovery/exploration
('text', 'Found a new trail today. Got lost for 8 miles. Best kind of lost.', ARRAY['Exploratory', 'New Territory', 'Discovery'], 'approved', 'public'),
('text', 'The flow state is real. Mile 6-9 I disappeared. Just pure motion.', ARRAY['Flow State', 'Solo Journey', 'Discovery'], 'approved', 'public'),

-- Process vibes
('text', 'Easy pace today felt hard. That''s fine. Tomorrow will be different. Trust the process.', ARRAY['Meditative', 'Solo Journey', 'Struggle'], 'approved', 'public'),
('text', 'Not every run is magic. Today was cement legs and doubt. But I showed up. That counts.', ARRAY['Uncertain', 'Struggle', 'Defiant'], 'approved', 'public'),

-- Celebration
('text', 'PR''d my 5K today! Not by much, but progress is progress. Crew believed in me before I did.', ARRAY['Celebratory', 'Crew Energy', 'Joy'], 'approved', 'public'),
('text', 'First marathon complete. I cried at the finish line. No shame. This meant everything.', ARRAY['Celebratory', 'Race Day', 'Joy'], 'approved', 'public'),

-- Deep cuts
('text', 'Motion creates emotion. Today the motion said: you''re stronger than you think.', ARRAY['Discovery', 'Flow State', 'Triumph'], 'approved', 'public'),
('text', 'We don''t run from something. We run toward who we''re becoming.', ARRAY['Exploratory', 'Discovery', 'Grateful'], 'approved', 'public');

-- =====================================================
-- Seed: Sample Products
-- =====================================================
INSERT INTO public.products (name, slug, description, type, price_cents, images, is_active, is_featured) VALUES
(
    'The Expressive Runner Card Set',
    'expressive-runner-cards',
    'Hand-illustrated greeting cards for runners who feel things. Set of 8 unique designs celebrating the emotional spectrum of running.',
    'physical',
    2400,
    ARRAY['https://placeholder.com/product-cards.jpg'],
    true,
    true
),
(
    'RunExpression T-Shirt',
    'runexpression-tee',
    'Premium cotton tee with hand-drawn "Motion Creates Emotion" design. Soft, breathable, made for post-run coffee rituals.',
    'physical',
    3200,
    ARRAY['https://placeholder.com/product-tee.jpg'],
    true,
    false
),
(
    'The Expressive Runner Handbook (PDF)',
    'expressive-runner-handbook',
    'Digital guide: prompts, exercises, and frameworks for connecting deeper with your running practice. 60 pages of introspection.',
    'digital',
    1500,
    ARRAY['https://placeholder.com/product-handbook.jpg'],
    true,
    false
);

-- =====================================================
-- Notes for developers
-- =====================================================
-- To use this seed data:
-- 1. Connect to your local Supabase instance
-- 2. Run: psql -h localhost -p 54322 -U postgres -d postgres -f supabase/seed/01_seed_data.sql
-- 3. Or use: npx supabase db reset (resets and re-runs all migrations + seed)
