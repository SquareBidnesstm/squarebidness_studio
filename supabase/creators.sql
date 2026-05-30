-- SB Studio — Creators table
-- Run in Supabase SQL editor AFTER schema.sql

-- ── CREATORS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.creators (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text NOT NULL UNIQUE,
  name         text NOT NULL,
  bio          text,
  location     text,
  photo_url    text,
  instagram    text,
  website      text,
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS creators_slug ON public.creators (slug);
CREATE INDEX IF NOT EXISTS creators_active ON public.creators (is_active);

-- RLS: public can read active creators
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_active_creators" ON public.creators
  FOR SELECT USING (is_active = true);

-- updated_at trigger
CREATE TRIGGER creators_updated_at
  BEFORE UPDATE ON public.creators
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Link videos to creators ────────────────────────────────
ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS creator_id uuid REFERENCES public.creators(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS videos_creator ON public.videos (creator_id);
