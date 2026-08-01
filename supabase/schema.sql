create table if not exists public.fortune_draws (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  fortune text not null,
  lucky_item text not null,
  lucky_number int not null
);

alter table public.fortune_draws enable row level security;

create policy "Anyone can read fortune draws"
  on public.fortune_draws for select
  using (true);

create policy "Anyone can insert fortune draws"
  on public.fortune_draws for insert
  with check (true);
