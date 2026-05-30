-- SB Studio — Subscribers table
-- Run in your Supabase SQL editor

create table if not exists subscribers (
  id               bigint generated always as identity primary key,
  email            text        not null,
  subscription_id  text        not null unique,
  customer_id      text,
  status           text        not null default 'ACTIVE',
  tier             text        not null default 'premium',
  livemode         boolean     not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists subscribers_email_idx on subscribers (email);
create index if not exists subscribers_subscription_id_idx on subscribers (subscription_id);

-- RLS: only service role can read/write
alter table subscribers enable row level security;
