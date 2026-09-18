/*
# Create card_text table for editable scrapbook card text

1. New Tables
- `card_text`
  - `id` (uuid, primary key)
  - `card_id` (text, not null, unique — e.g. "memories-card-0", "memories-card-1", ...)
  - `date_label` (text — e.g. "21 August 2025")
  - `title` (text — e.g. "Our First Movie Date")
  - `message` (text — custom description / story)
  - `tag` (text — e.g. "Photo", "Moment", "Inside Joke")
  - `updated_at` (timestamptz, default now)

2. Security
- Enable RLS on `card_text`.
- Allow anon + authenticated CRUD — single-tenant romantic site with no sign-in.
  Data is intentionally shared, so `USING (true)` is appropriate.

3. Important Notes
- No user_id column (no auth on this site).
- All four CRUD policies use `TO anon, authenticated` so the anon-key frontend can operate.
- If a row doesn't exist for a card_id, the frontend falls back to default text.
*/

CREATE TABLE IF NOT EXISTS card_text (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id text UNIQUE NOT NULL,
  date_label text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE card_text ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_card_text" ON card_text;
CREATE POLICY "anon_select_card_text" ON card_text FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_card_text" ON card_text;
CREATE POLICY "anon_insert_card_text" ON card_text FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_card_text" ON card_text;
CREATE POLICY "anon_update_card_text" ON card_text FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_card_text" ON card_text;
CREATE POLICY "anon_delete_card_text" ON card_text FOR DELETE
  TO anon, authenticated USING (true);
