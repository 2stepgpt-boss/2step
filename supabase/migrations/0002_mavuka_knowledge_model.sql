alter table knowledge_documents drop constraint if exists knowledge_documents_approval_status_check;
alter table knowledge_documents add constraint knowledge_documents_approval_status_check check (approval_status in ('draft','under_review','approved','rejected','archived','expired','withdrawn'));
alter table knowledge_documents add column if not exists answer_summary text;
alter table knowledge_documents add column if not exists key_points jsonb not null default '[]'::jsonb;
alter table knowledge_documents add column if not exists approved_insight text;
alter table knowledge_documents add column if not exists related_questions jsonb not null default '[]'::jsonb;
alter table knowledge_documents add column if not exists suggested_actions jsonb not null default '[]'::jsonb;
