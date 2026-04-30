-- Schema for saving generated video assets
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  series_id UUID REFERENCES video_series(id) ON DELETE CASCADE,
  title TEXT,
  script TEXT,
  audio_url TEXT,
  captions JSONB,
  scene_images JSONB,
  status TEXT DEFAULT 'ready',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: Make sure your `scene_images` bucket is created and set to Public in Supabase Storage.
-- If you haven't created the bucket yet, run this as well:
insert into storage.buckets (id, name, public) values ('scene_images', 'scene_images', true) on conflict (id) do nothing;
