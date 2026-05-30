-- SB Studio — Promo Inquiries table
-- Run in Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.promo_inquiries (
  id               bigint generated always as identity primary key,
  business_name    text        NOT NULL,
  contact_name     text        NOT NULL,
  email            text        NOT NULL,
  phone            text,
  business_type    text,
  location         text,
  what_to_promote  text,
  has_footage      boolean     NOT NULL DEFAULT false,
  status           text        NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','contacted','booked','complete','passed')),
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS promo_inquiries_status ON public.promo_inquiries (status);

ALTER TABLE public.promo_inquiries ENABLE ROW LEVEL SECURITY;
-- No public read — service role only
