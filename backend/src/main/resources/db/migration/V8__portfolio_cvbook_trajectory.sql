create table portfolios (
    id uuid primary key,
    student_id uuid not null unique references users(id),
    summary text not null,
    completed_cases jsonb not null default '[]',
    competency_profile jsonb not null default '{}',
    artifacts jsonb not null default '[]',
    feedback_highlights jsonb not null default '[]',
    cv_book_included boolean not null default false
);

create table cvbook_candidates (
    id uuid primary key,
    student_id uuid not null unique references users(id),
    full_name varchar(255) not null,
    organization_name varchar(255),
    completed_cases_count integer not null default 0,
    average_score integer not null default 0,
    competency_profile jsonb not null default '{}',
    tags jsonb not null default '[]',
    priority_status varchar(32) not null default 'REGULAR',
    last_activity_at timestamptz not null default now()
);

create table trajectories (
    id uuid primary key,
    title varchar(255) not null,
    description text not null,
    target_role_title varchar(255) not null,
    target_role_description text not null,
    direction varchar(255) not null,
    difficulty varchar(32) not null,
    estimated_duration_weeks integer not null,
    created_at timestamptz not null default now()
);

create table trajectory_nodes (
    id uuid primary key,
    trajectory_id uuid not null references trajectories(id),
    title varchar(255) not null,
    description text not null,
    type varchar(32) not null,
    position_x integer not null,
    position_y integer not null,
    track_id uuid,
    case_id uuid references cases(id),
    required_competencies jsonb not null default '{}',
    status varchar(32) not null default 'LOCKED',
    next_node_ids jsonb not null default '[]'
);

create index idx_trajectory_nodes_trajectory_id on trajectory_nodes(trajectory_id);
