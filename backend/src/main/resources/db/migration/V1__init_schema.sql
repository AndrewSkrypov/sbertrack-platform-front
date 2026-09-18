create table users (
    id uuid primary key,
    full_name varchar(255) not null,
    email varchar(255) not null unique,
    role varchar(32) not null,
    organization_name varchar(255),
    student_type varchar(32) not null default 'NONE',
    status varchar(32) not null default 'ACTIVE',
    password_hash varchar(255) not null,
    created_at timestamptz not null default now()
);

create table tracks (
    id uuid primary key,
    title varchar(255) not null,
    description text not null,
    customer_id uuid not null references users(id),
    customer_name varchar(255) not null,
    difficulty varchar(32) not null,
    status varchar(32) not null default 'DRAFT',
    target_audience varchar(255) not null,
    case_ids jsonb not null default '[]',
    created_at timestamptz not null default now()
);

create index idx_tracks_customer_id on tracks(customer_id);

create table submissions (
    id uuid primary key,
    case_id uuid not null,
    student_id uuid not null references users(id),
    team_name varchar(255),
    title varchar(255) not null,
    description text not null,
    artifact_url varchar(1024),
    status varchar(32) not null default 'DRAFT',
    competency_scores jsonb not null default '{}',
    feedback_ids jsonb not null default '[]',
    reflection_id uuid,
    submitted_at timestamptz
);

create index idx_submissions_student_id on submissions(student_id);
create index idx_submissions_case_id on submissions(case_id);
