# Архитектура

СберТрек Платформа реализована как демонстрационный MVP с разделением backend и frontend.
Backend построен на Kotlin и Spring Boot в одном модуле `backend`.
Внутри backend используется слоистая структура `Controller -> Application -> Domain <-> Infrastructure`.
REST-контроллеры принимают DTO и не содержат бизнес-логики.
Application-сервисы оркестрируют сценарии: вход, каталог, отправки, обратную связь, портфолио, витрину кандидатов, модерацию, траектории, roadmap, аналитику и ИИ-наставников.
Domain-модели содержат инварианты и поведение: переходы статусов кейсов, отправок, roadmap-шагов и мастер-промптов.
Infrastructure слой реализован in-memory adapters с seed-данными.
Модуль наставников имеет порт будущей интеграции; текущая реализация детерминирована и работает локально.
Frontend построен на React, TypeScript и MUI, с role-based routes и демо-входом.
Swagger UI доступен через springdoc, статический краткий контракт лежит в `contracts/openapi`.
Docker Compose поднимает backend и production frontend через nginx.

```mermaid
flowchart LR
    Frontend[React MUI Frontend] --> Backend[Backend REST API]
    Backend --> App[Application Services]
    App --> Domain[Domain Models]
    App --> Ports[Domain Ports]
    Ports --> Adapters[In-memory Adapters]
    Adapters --> Store[(Seeded In-memory Store)]
    App --> Analytics[Analytics Services]
    App --> MentorPort[Mentor Gateway Port]
    MentorPort --> MentorAdapter[Deterministic Mentor Adapter]
```

```mermaid
sequenceDiagram
    participant Student
    participant Frontend
    participant Backend
    participant Mentor
    participant Customer
    participant Portfolio
    Student->>Frontend: Выбирает траекторию и кейс
    Frontend->>Backend: POST /api/v1/trajectories/{id}/select
    Frontend->>Backend: GET /api/v1/roadmaps/me
    Frontend->>Backend: GET /api/v1/cases/{id}
    Student->>Frontend: Работает в workspace
    Frontend->>Backend: POST /api/v1/agents/sessions
    Frontend->>Mentor: POST /api/v1/agents/sessions/{id}/messages
    Mentor-->>Frontend: Наставнический ответ с контекстом кейса
    Student->>Frontend: Отправляет решение
    Frontend->>Backend: POST /api/v1/submissions/{id}/submit
    Backend->>Portfolio: Обновляет competency profile
    Customer->>Frontend: Проверяет решение
    Frontend->>Backend: POST /api/v1/submissions/{id}/feedback
    Backend->>Portfolio: Добавляет ключевые выводы обратной связи
    Backend->>Portfolio: Обновляет витрину кандидатов при приоритетной отметке
```
