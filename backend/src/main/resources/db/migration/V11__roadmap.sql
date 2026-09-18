create table roadmaps (
    id uuid primary key,
    student_id uuid not null unique references users(id),
    trajectory_id uuid not null references trajectories(id),
    title varchar(255) not null,
    current_node_id uuid not null,
    progress_percent integer not null default 0,
    selected_at timestamptz not null default now(),
    expected_finish_date date not null
);

create table roadmap_steps (
    id uuid primary key,
    roadmap_id uuid not null references roadmaps(id),
    node_id uuid not null references trajectory_nodes(id),
    title varchar(255) not null,
    description text not null,
    status varchar(32) not null default 'LOCKED',
    case_id uuid references cases(id),
    order_index integer not null
);

create index idx_roadmap_steps_roadmap_id on roadmap_steps(roadmap_id);
