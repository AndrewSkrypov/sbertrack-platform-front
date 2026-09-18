create table cases (
    id uuid primary key,
    track_id uuid not null,
    title varchar(255) not null,
    short_description varchar(1024) not null,
    full_description text not null,
    customer_id uuid not null references users(id),
    customer_name varchar(255) not null,
    status varchar(32) not null default 'DRAFT',
    difficulty varchar(32) not null,
    participant_limit integer not null,
    expected_result text not null,
    feedback_mode varchar(32) not null,
    competency_weights jsonb not null default '{}',
    tags jsonb not null default '[]',
    deadline date not null,
    created_at timestamptz not null default now()
);

create index idx_cases_track_id on cases(track_id);
create index idx_cases_customer_id on cases(customer_id);

create table reflections (
    id uuid primary key,
    submission_id uuid not null unique,
    student_id uuid not null references users(id),
    answers jsonb not null default '{}',
    summary text not null,
    created_at timestamptz not null default now()
);

create table feedback (
    id uuid primary key,
    submission_id uuid not null,
    author_type varchar(32) not null,
    author_name varchar(255) not null,
    text text not null,
    recommendations jsonb not null default '[]',
    competency_delta jsonb not null default '{}',
    created_at timestamptz not null default now()
);

create index idx_feedback_submission_id on feedback(submission_id);
