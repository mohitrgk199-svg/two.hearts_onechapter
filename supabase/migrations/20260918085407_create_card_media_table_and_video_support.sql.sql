/*
# Create card_media table for global photo/video persistence on fixed cards

1. New Tables
- `card_media`
  - `id` (uuid, primary key)
  - `card_id` (text, not null, unique — e.g. "bracelet-card", "dress-card", "memories-card-0")
  - `media_url` (text, not null — public URL of the uploaded file in Supabase Storage)
  - `media_type` (text, not null, default 'image' — either 'image' or 'video')
  - `updated_at` (timestamptz, default now)

2. Modified Tables
- `memories` (existing Memories Album table)
  - Add `media_type` column (text, not null, default 'image') to support video uploads.

3. Storage
- Updates storage policies on the `memories` bucket to also allow UPDATE (for replacing photos).
- Adds an `anon_update_memories` policy on storage.objects.

4. Security
- Enable RLS on `card_media`.
- Allow anon + authenticated CRUD — this is a single-tenant romantic site with no sign-in.
  The data is intentionally shared (one couple's site), so `USING (true)` is appropriate.

5. Important Notes
- No user_id column (no auth on this site).
- All four CRUD policies use `TO anon, authenticated` so the anon-key frontend can operate.
- The `card_media` table lets any visitor see uploaded photos on fixed cards (bracelet, dress,
  scrapbook cards) because the media is stored in Supabase Storage with public URLs saved in the DB.
- The `media_type` column on both tables allows distinguishing photos from videos.
*/

CREATE TABLE IF NOT EXISTS card_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id text UNIQUE NOT NULL,
  media_url text NOT NULL,
  media_type text NOT NULL DEFAULT 'image',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE card_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_card_media" ON card_media;
CREATE POLICY "anon_select_card_media" ON card_media FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_card_media" ON card_media;
CREATE POLICY "anon_insert_card_media" ON card_media FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_card_media" ON card_media;
CREATE POLICY "anon_update_card_media" ON card_media FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_card_media" ON card_media;
CREATE POLICY "anon_delete_card_media" ON card_media FOR DELETE
  TO anon, authenticated USING (true);

-- Add media_type column to existing memories table (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'memories' AND column_name = 'media_type'
  ) THEN
    ALTER TABLE memories ADD COLUMN media_type text NOT NULL DEFAULT 'image';
  END IF;
END $$;

-- Add UPDATE policy to storage.objects for the memories bucket (for replacing files)
DROP POLICY IF EXISTS "anon_update_memories" ON storage.objects;
CREATE POLICY "anon_update_memories" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'memories') WITH CHECK (bucket_id = 'memories');
