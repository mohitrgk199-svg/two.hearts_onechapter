/*
# Create memories table for Angel's Memory Album

1. New Tables
- `memories`
  - `id` (uuid, primary key)
  - `image_url` (text, not null — URL of the photo)
  - `date` (text, not null — date label for the memory, e.g. "14 Sept 2025")
  - `caption` (text, not null — 2-line caption for the memory)
  - `created_at` (timestamptz, default now)

2. Security
- Enable RLS on `memories`.
- Allow anon + authenticated CRUD — this is a single-tenant romantic site with no sign-in.
  The data is intentionally shared (one couple's album), so `USING (true)` is appropriate.

3. Important Notes
- No user_id column (no auth on this site).
- All four CRUD policies use `TO anon, authenticated` so the anon-key frontend can operate.
*/

CREATE TABLE IF NOT EXISTS memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  date text NOT NULL,
  caption text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_memories" ON memories;
CREATE POLICY "anon_select_memories" ON memories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_memories" ON memories;
CREATE POLICY "anon_insert_memories" ON memories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_memories" ON memories;
CREATE POLICY "anon_update_memories" ON memories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_memories" ON memories;
CREATE POLICY "anon_delete_memories" ON memories FOR DELETE
  TO anon, authenticated USING (true);
