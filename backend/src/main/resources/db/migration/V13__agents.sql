create table agents (
    id uuid primary key,
    code varchar(255) not null unique,
    name varchar(255) not null,
    description text not null,
    specialization varchar(32) not null,
    status varchar(32) not null default 'ACTIVE',
    master_prompt_id uuid,
    capabilities jsonb not null default '[]'
);

create table master_prompts (
    id uuid primary key,
    agent_id uuid not null references agents(id),
    title varchar(255) not null,
    prompt_text text not null,
    version integer not null default 1,
    status varchar(32) not null default 'DRAFT',
    created_by uuid not null references users(id),
    updated_at timestamptz not null default now()
);

alter table agents add constraint fk_agents_master_prompt foreign key (master_prompt_id) references master_prompts(id);

create table agent_sessions (
    id uuid primary key,
    student_id uuid not null references users(id),
    case_id uuid references cases(id),
    agent_id uuid not null references agents(id),
    created_at timestamptz not null default now()
);

create table agent_messages (
    id uuid primary key,
    session_id uuid not null references agent_sessions(id),
    role varchar(16) not null,
    content text not null,
    created_at timestamptz not null default now()
);

create index idx_agent_messages_session_id on agent_messages(session_id);
create index idx_agent_sessions_student_id on agent_sessions(student_id);
