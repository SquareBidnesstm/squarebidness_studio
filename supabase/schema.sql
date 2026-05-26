-- =========================================================
-- SQUARE BIDNESS STUDIO
-- studio.squarebidness.com
-- =========================================================

-- ── VIDEOS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.videos (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               text NOT NULL UNIQUE,
  title              text NOT NULL,
  description        text,

  -- Cloudflare Stream
  cf_video_id        text NOT NULL UNIQUE,
  cf_thumbnail_url   text,

  -- Metadata
  category           text DEFAULT 'shorts'
    CHECK (category IN ('shorts','culture','music','events','comedy','documentary','promo','other')),
  tags               text[] DEFAULT '{}',
  duration_seconds   integer,

  -- Visibility
  status             text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','published','unlisted')),
  is_featured        boolean NOT NULL DEFAULT false,

  -- Future monetization
  access             text NOT NULL DEFAULT 'free'
    CHECK (access IN ('free','premium','ppv')),

  -- Stats
  view_count         integer NOT NULL DEFAULT 0,

  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- Index for public browsing
CREATE INDEX IF NOT EXISTS videos_status_created ON public.videos (status, created_at DESC);
CREATE INDEX IF NOT EXISTS videos_category ON public.videos (category) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS videos_featured ON public.videos (is_featured) WHERE status = 'published';

-- ── RPC: atomic view increment ─────────────────────────────
CREATE OR REPLACE FUNCTION increment_video_views(video_slug text)
RETURNS void LANGUAGE sql AS $$
  UPDATE public.videos
  SET view_count = view_count + 1
  WHERE slug = video_slug AND status = 'published';
$$;

-- ── RLS ───────────────────────────────────────────────────
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Public can read published videos
CREATE POLICY "public_read_published" ON public.videos
  FOR SELECT USING (status = 'published');

-- Service role bypasses RLS (used by admin API routes)
-- No additional policy needed — service role key ignores RLS

-- ── updated_at trigger ────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
