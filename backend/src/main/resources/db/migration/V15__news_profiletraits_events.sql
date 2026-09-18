create table news_posts (
    id uuid primary key,
    author_id uuid not null references users(id),
    author_name varchar(255) not null,
    author_initial varchar(8) not null,
    category varchar(32) not null,
    pinned boolean not null default false,
    title varchar(512) not null,
    body text not null,
    image_labels jsonb not null default '[]',
    likes integer not null default 0,
    comments integer not null default 0,
    views integer not null default 0,
    published_at timestamptz not null default now()
);

create index idx_news_posts_category on news_posts(category);

create table profile_traits (
    id uuid primary key,
    student_id uuid not null unique references users(id),
    professional_tags jsonb not null default '[]',
    interests jsonb not null default '[]',
    motivations jsonb not null default '[]',
    abilities jsonb not null default '[]',
    self_rated_skills jsonb not null default '[]',
    psychotype_completed boolean not null default false
);

create table events (
    id uuid primary key,
    author_id uuid not null references users(id),
    title varchar(512) not null,
    location varchar(255) not null,
    starts_at timestamptz not null,
    created_at timestamptz not null default now()
);

create index idx_events_starts_at on events(starts_at);
