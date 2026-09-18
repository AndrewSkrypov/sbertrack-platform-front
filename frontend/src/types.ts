export type Role = 'STUDENT' | 'CUSTOMER' | 'MODERATOR' | 'ADMIN';
export type StudentType = 'SCHOOL_STUDENT' | 'UNIVERSITY_STUDENT' | 'NONE';
export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'ARCHIVED';
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type TrackStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type CaseStatus = 'DRAFT' | 'MODERATION' | 'PUBLISHED' | 'ARCHIVED';
export type FeedbackMode = 'LIVE' | 'AGENT' | 'MIXED';
export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'NEEDS_IMPROVEMENT' | 'ACCEPTED' | 'REJECTED' | 'PRIORITY_CANDIDATE';
export type Competency = 'ABSTRACT_THINKING' | 'AUTONOMY' | 'COLLABORATION' | 'HUMAN_AI_SYNERGY' | 'HYPOTHESIS_AND_PRODUCT_THINKING';
export type PriorityStatus = 'REGULAR' | 'PRIORITY';
export type AgentStatus = 'ACTIVE' | 'DISABLED' | 'ARCHIVED';
export type AgentSpecialization = 'BACKEND_ARCHITECTURE' | 'FRONTEND_INTERFACE' | 'PRODUCT_HYPOTHESIS' | 'FINANCIAL_MODELING' | 'MARKET_RESEARCH' | 'REFLECTION' | 'FEEDBACK';
export type AgentMessageRole = 'USER' | 'AGENT';
export type FeedbackAuthorType = 'CUSTOMER' | 'AGENT' | 'MODERATOR';
export type TrajectoryNodeType = 'START' | 'TRACK' | 'CASE' | 'CHECKPOINT' | 'MENTOR_REVIEW' | 'FINAL_PROJECT';
export type RoadmapStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  organizationName?: string | null;
  studentType: StudentType;
  status: UserStatus;
  createdAt: string;
}

export interface UserSession {
  token: string;
  user: User;
}

export interface Track {
  id: string;
  title: string;
  description: string;
  customerId: string;
  customerName: string;
  difficulty: Difficulty;
  status: TrackStatus;
  targetAudience: string;
  caseIds: string[];
  createdAt: string;
}

export interface PracticalCase {
  id: string;
  trackId: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  customerId: string;
  customerName: string;
  status: CaseStatus;
  difficulty: Difficulty;
  participantLimit: number;
  expectedResult: string;
  feedbackMode: FeedbackMode;
  competencyWeights: Record<Competency, number>;
  tags: string[];
  deadline: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  caseId: string;
  studentId: string;
  teamName?: string | null;
  title: string;
  description: string;
  artifactUrl?: string | null;
  status: SubmissionStatus;
  competencyScores: Partial<Record<Competency, number>>;
  feedbackIds: string[];
  reflectionId?: string | null;
  submittedAt?: string | null;
}

export interface Portfolio {
  id: string;
  studentId: string;
  summary: string;
  completedCases: string[];
  competencyProfile: Record<Competency, number>;
  artifacts: string[];
  feedbackHighlights: string[];
  cvBookIncluded: boolean;
}

export interface CvBookCandidate {
  id: string;
  studentId: string;
  fullName: string;
  organizationName?: string | null;
  completedCasesCount: number;
  averageScore: number;
  competencyProfile: Record<Competency, number>;
  tags: string[];
  priorityStatus: PriorityStatus;
  lastActivityAt: string;
}

export interface AgentDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  specialization: AgentSpecialization;
  status: AgentStatus;
  masterPromptId?: string | null;
  capabilities: string[];
}

export interface AgentMessage {
  id: string;
  sessionId: string;
  role: AgentMessageRole;
  content: string;
  createdAt: string;
}

export interface AgentSession {
  id: string;
  studentId: string;
  caseId?: string | null;
  agentId: string;
  messages: AgentMessage[];
  createdAt: string;
}

export interface Trajectory {
  id: string;
  title: string;
  description: string;
  targetRoleTitle: string;
  targetRoleDescription: string;
  direction: string;
  difficulty: Difficulty;
  estimatedDurationWeeks: number;
  nodeIds: string[];
  createdAt: string;
}

export interface TrajectoryNode {
  id: string;
  trajectoryId: string;
  title: string;
  description: string;
  type: TrajectoryNodeType;
  positionX: number;
  positionY: number;
  trackId?: string | null;
  caseId?: string | null;
  requiredCompetencies: Partial<Record<Competency, number>>;
  status: RoadmapStatus;
  nextNodeIds: string[];
}

export interface RoadmapStep {
  id: string;
  roadmapId: string;
  nodeId: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  caseId?: string | null;
  orderIndex: number;
}

export interface StudentRoadmap {
  id: string;
  studentId: string;
  trajectoryId: string;
  title: string;
  currentNodeId: string;
  progressPercent: number;
  selectedAt: string;
  expectedFinishDate: string;
  steps: RoadmapStep[];
}

export interface MasterPrompt {
  id: string;
  agentId: string;
  title: string;
  promptText: string;
  version: number;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  createdBy: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  submissionId: string;
  authorType: FeedbackAuthorType;
  authorName: string;
  text: string;
  recommendations: string[];
  competencyDelta: Partial<Record<Competency, number>>;
  createdAt: string;
}

export interface Reflection {
  id: string;
  submissionId: string;
  studentId: string;
  answers: Record<string, string>;
  summary: string;
  createdAt: string;
}

export interface AdminStatistics {
  usersCount: number;
  tracksCount: number;
  casesCount: number;
  submissionsCount: number;
  cvBookCandidatesCount: number;
  activeAgentsCount: number;
  competencyDistribution: Record<Competency, number>;
}

export interface AdminDashboard {
  statistics: AdminStatistics;
  users: User[];
  tracks: Track[];
  cases: PracticalCase[];
  submissions: Submission[];
  agents: AgentDefinition[];
}

export interface Metric {
  label: string;
  value: number;
  unit?: string | null;
  trend?: number | null;
}

export interface ChartPoint {
  label: string;
  value: number;
  secondaryValue?: number | null;
}

export interface CompetencyAnalyticsPoint {
  competency: Competency;
  value: number;
  previousValue?: number | null;
}

export interface StudentAnalytics {
  greeting: string;
  trajectoryTitle: string;
  currentLevel: string;
  goal: string;
  nearestCaseTitle: string;
  roadmapProgress: number;
  metrics: Metric[];
  completedCasesByDirection: ChartPoint[];
  competencyRadar: CompetencyAnalyticsPoint[];
  competencyGrowth: ChartPoint[];
  qualityDynamics: ChartPoint[];
  funnel: ChartPoint[];
  recommendation: string;
}

export interface CustomerAnalytics {
  metrics: Metric[];
  submissionStatuses: ChartPoint[];
  participantsByTrack: ChartPoint[];
  averageCompetencies: CompetencyAnalyticsPoint[];
  activityDynamics: ChartPoint[];
  funnel: ChartPoint[];
}

export interface ModeratorAnalytics {
  metrics: Metric[];
  agentUsage: ChartPoint[];
  agentUsefulness: ChartPoint[];
  recentSessions: string[];
}

export interface AdminAnalytics {
  metrics: Metric[];
  usersByRole: ChartPoint[];
  casesByStatus: ChartPoint[];
  activityDynamics: ChartPoint[];
  platformCompetencies: CompetencyAnalyticsPoint[];
  participationFunnel: ChartPoint[];
}

export type NewsCategory = 'TRACK' | 'EVENT' | 'PRODUCT';

export interface NewsPost {
  id: string;
  authorId: string;
  authorName: string;
  authorInitial: string;
  category: NewsCategory;
  pinned: boolean;
  title: string;
  body: string;
  imageLabels: string[];
  likes: number;
  comments: number;
  views: number;
  publishedAt: string;
}

export interface ProfileTraits {
  id: string;
  studentId: string;
  professionalTags: string[];
  interests: string[];
  motivations: string[];
  abilities: { label: string; percent: number }[];
  selfRatedSkills: { label: string; level: number }[];
  psychotypeCompleted: boolean;
}

export interface Streak {
  currentStreakDays: number;
  lastActiveDate: string | null;
  activeToday: boolean;
}

export interface PlatformEvent {
  id: string;
  authorId: string;
  title: string;
  location: string;
  startsAt: string;
}

export type SearchResultType = 'CASE' | 'TRACK' | 'PERSON';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
}

export interface UploadedFile {
  fileName: string;
  url: string;
  sizeBytes: number;
}
