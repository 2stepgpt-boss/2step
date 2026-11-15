create table knowledge_resources (
  id uuid primary key default gen_random_uuid(),
  installation_id uuid not null references installations(id) on delete cascade,
  document_id text not null,
  question_title text,
  title text not null,
  resource_type text not null check (resource_type in ('pdf','video','audio','image','checklist','comparison','external_link')),
  resource_url text not null,
  description text,
  approval_status text not null default 'draft' check (approval_status in ('draft','under_review','approved','rejected','archived','expired','withdrawn')),
  access_level text not null default 'public' check (access_level in ('public','internal','restricted')),
  effective_date date,
  expiry_date date,
  created_at timestamptz not null default now(),
  unique (installation_id, document_id, resource_url)
);

create index knowledge_resources_lookup_idx on knowledge_resources (installation_id, document_id, question_title, resource_type);

alter table knowledge_resources enable row level security;
revoke all on knowledge_resources from anon, authenticated;
