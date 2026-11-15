create table question_feedback (
  id uuid primary key default gen_random_uuid(),
  installation_id uuid not null references installations(id) on delete cascade,
  question text not null,
  helpful boolean not null,
  created_at timestamptz not null default now()
);

create index question_feedback_installation_created_idx on question_feedback (installation_id, created_at desc);

alter table question_feedback enable row level security;
revoke all on question_feedback from anon, authenticated;
