-- SB Studio — Music Submissions table
-- Run in Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.music_submissions (
  id            bigint generated always as identity primary key,
  artist_name   text        NOT NULL,
  contact_name  text        NOT NULL,
  email         text        NOT NULL,
  phone         text,
  genre         text,
  location      text,
  bio           text,
  music_link    text,
  instagram     text,
  website       text,
  status        text        NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected')),
  notes         text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS music_submissions_status ON public.music_submissions (status);
CREATE INDEX IF NOT EXISTS music_submissions_email  ON public.music_submissions (email);

ALTER TABLE public.music_submissions ENABLE ROW LEVEL SECURITY;
-- No public read — service role only
