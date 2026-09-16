/*
# Create storage bucket for memory photos

1. Storage
- Create a public bucket named `memories` for storing memory album photos.
- Set bucket to public so uploaded photos are accessible via public URL.

2. Notes
- The bucket stores photos uploaded by Angel's website for the Memories Album feature.
- Public bucket is appropriate here — this is a single-tenant romantic site with no auth.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('memories', 'memories', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload and read files in the memories bucket
DROP POLICY IF EXISTS "anon_upload_memories" ON storage.objects;
CREATE POLICY "anon_upload_memories" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'memories');

DROP POLICY IF EXISTS "anon_read_memories" ON storage.objects;
CREATE POLICY "anon_read_memories" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'memories');

DROP POLICY IF EXISTS "anon_delete_memories" ON storage.objects;
CREATE POLICY "anon_delete_memories" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'memories');
