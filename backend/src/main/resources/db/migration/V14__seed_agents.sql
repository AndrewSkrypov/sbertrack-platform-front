-- Mirrors MockPlatformDataStore.seedAgents(). agents/master_prompts have a
-- circular FK: insert agents first without master_prompt_id, then prompts,
-- then backfill agents.master_prompt_id.
insert into agents (id, code, name, description, specialization, status, master_prompt_id, capabilities) values
('40cfe5d7-5b8a-3f88-809b-e71551a097b2', 'backend-architect', 'Архитектор бэкенда', 'Помогает проектировать сервисы, контракты, роли, API и структуру backend.', 'BACKEND_ARCHITECTURE', 'ACTIVE', null, '["STRUCTURE_SOLUTION","ASK_CHECK_QUESTIONS","SUGGEST_NEXT_STEPS","REVIEW_ASSUMPTIONS"]'),
('30b4fd7a-c226-3d97-9bb6-093cdf079aee', 'frontend-mentor', 'Наставник frontend-разработки', 'Помогает продумать интерфейс, Material Design, навигацию, формы и дашборды.', 'FRONTEND_INTERFACE', 'ACTIVE', null, '["STRUCTURE_SOLUTION","ASK_CHECK_QUESTIONS","SUGGEST_NEXT_STEPS","REVIEW_ASSUMPTIONS"]'),
('6d8cc227-63e3-35dc-a38d-b30f894bef1b', 'product-hypothesis', 'Продуктовый наставник', 'Помогает формулировать гипотезы, ценность, аудиторию и метрики.', 'PRODUCT_HYPOTHESIS', 'ACTIVE', null, '["STRUCTURE_SOLUTION","ASK_CHECK_QUESTIONS","SUGGEST_NEXT_STEPS"]'),
('cd276e9b-5b90-33a6-ab69-d142005ae99e', 'financial-model', 'Наставник финансовой модели', 'Помогает структурировать расходы, доходы, unit-экономику и сценарии.', 'FINANCIAL_MODELING', 'ACTIVE', null, '["STRUCTURE_SOLUTION","ASK_CHECK_QUESTIONS","SUGGEST_NEXT_STEPS","REVIEW_ASSUMPTIONS"]'),
('18c7c784-fde7-3c47-9417-ed23b38ef198', 'research', 'Исследовательский наставник', 'Помогает анализировать рынок, аналоги, конкурентов и источники.', 'MARKET_RESEARCH', 'ACTIVE', null, '["STRUCTURE_SOLUTION","ASK_CHECK_QUESTIONS","SUGGEST_NEXT_STEPS"]'),
('a819583f-b6b0-3f07-8e26-1790cb037629', 'reflection', 'Наставник рефлексии', 'Помогает разобрать, что получилось, что было сложно и что улучшить.', 'REFLECTION', 'ACTIVE', null, '["ASK_CHECK_QUESTIONS","SUGGEST_NEXT_STEPS"]'),
('a80246c5-7352-3de3-a388-7d6ed7944547', 'feedback', 'Наставник обратной связи', 'Помогает понять сильные и слабые стороны решения.', 'FEEDBACK', 'ACTIVE', null, '["STRUCTURE_SOLUTION","ASK_CHECK_QUESTIONS","SUGGEST_NEXT_STEPS","FORM_FEEDBACK"]');

insert into master_prompts (id, agent_id, title, prompt_text, version, status, created_by, updated_at) values
('39286219-35d2-32ec-8c83-24490093d411', '40cfe5d7-5b8a-3f88-809b-e71551a097b2', 'Шаблон архитектора бэкенда', 'Помогай проектировать backend через вопросы, границы модулей и контракты.', 1, 'ACTIVE', '340b0d1f-2204-3f9d-952f-f617b2f4f16a', now()),
('34295445-488f-3683-9a82-f066f4aa8e86', '30b4fd7a-c226-3d97-9bb6-093cdf079aee', 'Шаблон наставника интерфейсов', 'Помогай проектировать интерфейс, Material Design, навигацию, формы и дашборды.', 1, 'ACTIVE', '340b0d1f-2204-3f9d-952f-f617b2f4f16a', now()),
('a230aadc-a858-3bba-9168-3c7705c9ee1f', '6d8cc227-63e3-35dc-a38d-b30f894bef1b', 'Шаблон продуктового наставника', 'Помогай формулировать гипотезы, метрики и план проверки.', 1, 'ACTIVE', '340b0d1f-2204-3f9d-952f-f617b2f4f16a', now()),
('455f770c-7aaf-3cf7-9ae4-994ce0c1229d', 'cd276e9b-5b90-33a6-ab69-d142005ae99e', 'Шаблон финансовой модели', 'Помогай строить модель через драйверы, сценарии и проверки предположений.', 1, 'ACTIVE', '340b0d1f-2204-3f9d-952f-f617b2f4f16a', now()),
('79873c42-62a7-36ce-b151-aee8b347a1ef', '18c7c784-fde7-3c47-9417-ed23b38ef198', 'Шаблон исследовательского наставника', 'Помогай структурировать исследование, источники и выводы.', 1, 'ACTIVE', '340b0d1f-2204-3f9d-952f-f617b2f4f16a', now()),
('0bf25d8e-3d63-3d47-9a82-9d62ad2defb3', 'a819583f-b6b0-3f07-8e26-1790cb037629', 'Шаблон рефлексии', 'Помогай участнику провести честную рефлексию собственного вклада.', 1, 'ACTIVE', '340b0d1f-2204-3f9d-952f-f617b2f4f16a', now()),
('964f3063-7e16-34db-85f1-2e7ce8f198cd', 'a80246c5-7352-3de3-a388-7d6ed7944547', 'Шаблон обратной связи', 'Помогай формировать развивающую обратную связь без оценки личности.', 1, 'ACTIVE', '340b0d1f-2204-3f9d-952f-f617b2f4f16a', now());

update agents set master_prompt_id = '39286219-35d2-32ec-8c83-24490093d411' where id = '40cfe5d7-5b8a-3f88-809b-e71551a097b2';
update agents set master_prompt_id = '34295445-488f-3683-9a82-f066f4aa8e86' where id = '30b4fd7a-c226-3d97-9bb6-093cdf079aee';
update agents set master_prompt_id = 'a230aadc-a858-3bba-9168-3c7705c9ee1f' where id = '6d8cc227-63e3-35dc-a38d-b30f894bef1b';
update agents set master_prompt_id = '455f770c-7aaf-3cf7-9ae4-994ce0c1229d' where id = 'cd276e9b-5b90-33a6-ab69-d142005ae99e';
update agents set master_prompt_id = '79873c42-62a7-36ce-b151-aee8b347a1ef' where id = '18c7c784-fde7-3c47-9417-ed23b38ef198';
update agents set master_prompt_id = '0bf25d8e-3d63-3d47-9a82-9d62ad2defb3' where id = 'a819583f-b6b0-3f07-8e26-1790cb037629';
update agents set master_prompt_id = '964f3063-7e16-34db-85f1-2e7ce8f198cd' where id = 'a80246c5-7352-3de3-a388-7d6ed7944547';
