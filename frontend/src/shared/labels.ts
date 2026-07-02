import {
  AgentSpecialization,
  AgentStatus,
  CaseStatus,
  Competency,
  Difficulty,
  FeedbackMode,
  PriorityStatus,
  RoadmapStatus,
  Role,
  SubmissionStatus,
  TrackStatus,
  TrajectoryNodeType,
  UserStatus
} from '../types';

export const roleLabels: Record<Role, string> = {
  STUDENT: 'Студент',
  CUSTOMER: 'Заказчик',
  MODERATOR: 'Модератор',
  ADMIN: 'Администратор'
};

export const competencyLabels: Record<Competency, string> = {
  ABSTRACT_THINKING: 'Абстрактное мышление',
  AUTONOMY: 'Самостоятельность',
  COLLABORATION: 'Командная работа',
  HUMAN_AI_SYNERGY: 'Синергия с ИИ',
  HYPOTHESIS_AND_PRODUCT_THINKING: 'Гипотезы и продукт'
};

export const competencyDescriptions: Record<Competency, string> = {
  ABSTRACT_THINKING: 'Умение видеть структуру задачи, выделять главное, строить модели и находить связи.',
  AUTONOMY: 'Умение выбирать подход, планировать работу и принимать решения без постоянной внешней инструкции.',
  COLLABORATION: 'Умение работать с людьми, распределять роли, принимать обратную связь и доводить результат вместе.',
  HUMAN_AI_SYNERGY: 'Умение использовать ИИ-наставников как инструмент мышления, проверки и ускорения рутинных действий.',
  HYPOTHESIS_AND_PRODUCT_THINKING: 'Умение выдвигать идеи, проверять гипотезы и превращать решение в продуктовый результат.'
};

export const feedbackModeLabels: Record<FeedbackMode, string> = {
  LIVE: 'Живая обратная связь',
  AGENT: 'Обратная связь ИИ-наставника',
  MIXED: 'Смешанный формат'
};

export const submissionStatusLabels: Record<SubmissionStatus, string> = {
  DRAFT: 'Черновик',
  SUBMITTED: 'Отправлено на проверку',
  NEEDS_IMPROVEMENT: 'Требует доработки',
  ACCEPTED: 'Принято',
  REJECTED: 'Отклонено',
  PRIORITY_CANDIDATE: 'Приоритетный кандидат'
};

export const caseStatusLabels: Record<CaseStatus, string> = {
  DRAFT: 'Черновик',
  MODERATION: 'На модерации',
  PUBLISHED: 'Опубликован',
  ARCHIVED: 'В архиве'
};

export const trackStatusLabels: Record<TrackStatus, string> = {
  DRAFT: 'Черновик',
  ACTIVE: 'Активен',
  ARCHIVED: 'В архиве'
};

export const masterPromptStatusLabels: Record<string, string> = {
  DRAFT: 'Черновик',
  ACTIVE: 'Активен',
  ARCHIVED: 'В архиве'
};

export const userStatusLabels: Record<UserStatus, string> = {
  ACTIVE: 'Активен',
  BLOCKED: 'Заблокирован',
  ARCHIVED: 'В архиве'
};

export const priorityStatusLabels: Record<PriorityStatus, string> = {
  REGULAR: 'Обычный профиль',
  PRIORITY: 'Приоритетный кандидат'
};

export const agentCapabilityLabels: Record<string, string> = {
  STRUCTURE_SOLUTION: 'Структурирование решения',
  ASK_CHECK_QUESTIONS: 'Проверочные вопросы',
  SUGGEST_NEXT_STEPS: 'Следующие шаги',
  REVIEW_ASSUMPTIONS: 'Проверка предположений',
  FORM_FEEDBACK: 'Помощь с обратной связью'
};

export const agentSpecializationLabels: Record<AgentSpecialization, string> = {
  BACKEND_ARCHITECTURE: 'Архитектура backend',
  FRONTEND_INTERFACE: 'Frontend и интерфейсы',
  PRODUCT_HYPOTHESIS: 'Продуктовые гипотезы',
  FINANCIAL_MODELING: 'Финансовая модель',
  MARKET_RESEARCH: 'Исследование рынка',
  REFLECTION: 'Рефлексия',
  FEEDBACK: 'Обратная связь'
};

export const agentStatusLabels: Record<AgentStatus, string> = {
  ACTIVE: 'Активен',
  DISABLED: 'Отключён',
  ARCHIVED: 'В архиве'
};

export const difficultyLabels: Record<Difficulty, string> = {
  BEGINNER: 'Начальный',
  INTERMEDIATE: 'Средний',
  ADVANCED: 'Сложный'
};

export const roadmapStatusLabels: Record<RoadmapStatus, string> = {
  LOCKED: 'Заблокировано',
  AVAILABLE: 'Доступно',
  IN_PROGRESS: 'В работе',
  COMPLETED: 'Завершено'
};

export const trajectoryNodeTypeLabels: Record<TrajectoryNodeType, string> = {
  START: 'Вводный этап',
  TRACK: 'Трек',
  CASE: 'Кейс',
  CHECKPOINT: 'Контрольная точка',
  MENTOR_REVIEW: 'Встреча с наставником',
  FINAL_PROJECT: 'Итоговая защита'
};

export const displayStatus = (status: string): string =>
  submissionStatusLabels[status as SubmissionStatus]
  ?? caseStatusLabels[status as CaseStatus]
  ?? trackStatusLabels[status as TrackStatus]
  ?? masterPromptStatusLabels[status]
  ?? roadmapStatusLabels[status as RoadmapStatus]
  ?? userStatusLabels[status as UserStatus]
  ?? priorityStatusLabels[status as PriorityStatus]
  ?? agentStatusLabels[status as AgentStatus]
  ?? status;
