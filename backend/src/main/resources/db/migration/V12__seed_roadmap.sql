-- Mirrors MockPlatformDataStore.seedRoadmaps() for the backend trajectory only
-- (the only one with a seeded student roadmap).
insert into roadmaps (id, student_id, trajectory_id, title, current_node_id, progress_percent, selected_at, expected_finish_date) values
('071bd5d0-e894-3a51-967a-a3358a385c47', '1252bd86-4b43-3453-9706-e48ddeaa484b', '77e5bdc7-b955-3d6e-8e2c-3b29dd28a032', 'Дорожная карта: Маяк backend-разработки', '2707ed82-1eb6-3cd2-9791-4c1e83496b32', 24, '2026-06-01T09:00:00Z', '2026-10-10');

insert into roadmap_steps (id, roadmap_id, node_id, title, description, status, case_id, order_index) values
('4c26a3ad-c3bb-3022-8d91-d6c187eab6c6', '071bd5d0-e894-3a51-967a-a3358a385c47', 'c7442ae2-4520-3011-8645-ca1573862f0e', 'Основы проектирования сервисов', 'Этап траектории: Основы проектирования сервисов.', 'COMPLETED', null, 0),
('0a3ba275-8653-3308-be74-370fbf7362db', '071bd5d0-e894-3a51-967a-a3358a385c47', '2707ed82-1eb6-3cd2-9791-4c1e83496b32', 'REST-контракты и OpenAPI', 'Этап траектории: REST-контракты и OpenAPI.', 'IN_PROGRESS', null, 1),
('135a22d1-0c83-3a9a-ab1b-2be2710da6d5', '071bd5d0-e894-3a51-967a-a3358a385c47', '5a712fff-583c-3e12-9c98-2c70d20ee5ee', 'Авторизация и роли', 'Этап траектории: Авторизация и роли.', 'AVAILABLE', '26de51a4-d00a-39ec-b759-dd7f2574a6f1', 2),
('b56eb67a-9df2-3642-a690-b58611fa195d', '071bd5d0-e894-3a51-967a-a3358a385c47', '54d62cc4-0bdc-383a-90d2-58fb44a18476', 'Работа с данными', 'Этап траектории: Работа с данными.', 'LOCKED', '26de51a4-d00a-39ec-b759-dd7f2574a6f1', 3),
('e5a69d24-4d77-3cfa-94da-29420ada9644', '071bd5d0-e894-3a51-967a-a3358a385c47', 'ebee7da9-00de-3f50-88ca-74257b6d48e1', 'Очереди и интеграции', 'Этап траектории: Очереди и интеграции.', 'LOCKED', '5b145a47-029d-3b12-8de5-f8d690d4fe8a', 4),
('1b765709-879d-30ba-a6e5-ad15008ea54b', '071bd5d0-e894-3a51-967a-a3358a385c47', '958616ed-5ea6-3487-8aa0-898584818fa1', 'Наблюдаемость', 'Этап траектории: Наблюдаемость.', 'LOCKED', '26de51a4-d00a-39ec-b759-dd7f2574a6f1', 5),
('28eae1f6-26bd-32f6-abdd-34e5dd27c410', '071bd5d0-e894-3a51-967a-a3358a385c47', '0a125b65-16be-3176-a8b6-18da3aa0eb76', 'Маяк профессии', 'Специалист, который уверенно проектирует сервисы, API, роли, данные и наблюдаемость.', 'LOCKED', null, 6);
