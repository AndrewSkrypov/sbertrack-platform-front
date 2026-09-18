-- Password for every seeded account is "password" (BCrypt hash, cost 10).
-- UUIDs are deterministic and must match MockPlatformDataStore.id("user-*")
-- so that not-yet-migrated modules (which still reference these ids from
-- the in-memory store) keep working during the incremental migration.
insert into users (id, full_name, email, role, organization_name, student_type, status, password_hash, created_at) values
('1252bd86-4b43-3453-9706-e48ddeaa484b', 'Иван Петров', 'student@example.com', 'STUDENT', 'ИТМО', 'UNIVERSITY_STUDENT', 'ACTIVE', '$2a$10$7V8Lo9whxJhOHwsgO88tseH/Ys.u5eHr370qGDBm0pxTTVp.LTWUu', '2026-01-15T09:00:00Z'),
('4da21b81-b116-3e41-b6d6-75700866a740', 'Анна Смирнова', 'school@example.com', 'STUDENT', 'Школа 1535', 'SCHOOL_STUDENT', 'ACTIVE', '$2a$10$7V8Lo9whxJhOHwsgO88tseH/Ys.u5eHr370qGDBm0pxTTVp.LTWUu', '2026-02-02T09:00:00Z'),
('b7053d6a-a811-32c4-bc0a-45672c473627', 'Мария Соколова', 'customer@example.com', 'CUSTOMER', 'Сбер', 'NONE', 'ACTIVE', '$2a$10$7V8Lo9whxJhOHwsgO88tseH/Ys.u5eHr370qGDBm0pxTTVp.LTWUu', '2026-01-20T09:00:00Z'),
('c73e1bfb-5ec9-32ee-a132-124e0621a9b7', 'Алексей Орлов', 'partner@example.com', 'CUSTOMER', 'Индустриальный партнёр', 'NONE', 'ACTIVE', '$2a$10$7V8Lo9whxJhOHwsgO88tseH/Ys.u5eHr370qGDBm0pxTTVp.LTWUu', '2026-01-25T09:00:00Z'),
('340b0d1f-2204-3f9d-952f-f617b2f4f16a', 'Модератор платформы', 'moderator@example.com', 'MODERATOR', null, 'NONE', 'ACTIVE', '$2a$10$7V8Lo9whxJhOHwsgO88tseH/Ys.u5eHr370qGDBm0pxTTVp.LTWUu', '2026-01-05T09:00:00Z'),
('301187e9-124a-32c9-8ce9-a8a8df9f7303', 'Администратор', 'admin@example.com', 'ADMIN', null, 'NONE', 'ACTIVE', '$2a$10$7V8Lo9whxJhOHwsgO88tseH/Ys.u5eHr370qGDBm0pxTTVp.LTWUu', '2026-01-01T09:00:00Z');
