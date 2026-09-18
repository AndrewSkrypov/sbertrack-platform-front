import axios from 'axios';
import {
  AdminAnalytics,
  AgentSession,
  CustomerAnalytics,
  ModeratorAnalytics,
  NewsCategory,
  NewsPost,
  PlatformEvent,
  ProfileTraits,
  SearchResult,
  UploadedFile,
  Streak,
  StudentAnalytics,
  StudentRoadmap,
  Trajectory,
  TrajectoryNode,
  UserSession
} from '../types';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('sbertrack.session');
  if (raw) {
    const session = JSON.parse(raw) as UserSession;
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const backendMessage = error?.response?.data?.message;
    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return Promise.reject(new Error(backendMessage));
    }
    if (error?.response?.status === 401) {
      return Promise.reject(new Error('Сессия истекла — войдите заново'));
    }
    if (!error?.response) {
      return Promise.reject(new Error('Нет соединения с сервером'));
    }
    return Promise.reject(error);
  }
);

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await api.get<T>(url, { params });
  return response.data;
}

export async function post<T>(url: string, body?: unknown): Promise<T> {
  const response = await api.post<T>(url, body ?? {});
  return response.data;
}

export async function put<T>(url: string, body: unknown): Promise<T> {
  const response = await api.put<T>(url, body);
  return response.data;
}

export const platformApi = {
  trajectories: {
    list: () => get<Trajectory[]>('/trajectories'),
    get: (id: string) => get<Trajectory>(`/trajectories/${id}`),
    nodes: (id: string) => get<TrajectoryNode[]>(`/trajectories/${id}/nodes`),
    select: (id: string) => post<StudentRoadmap>(`/trajectories/${id}/select`)
  },
  roadmaps: {
    me: () => get<StudentRoadmap>('/roadmaps/me'),
    get: (id: string) => get<StudentRoadmap>(`/roadmaps/${id}`),
    startStep: (roadmapId: string, stepId: string) => post<StudentRoadmap>(`/roadmaps/${roadmapId}/steps/${stepId}/start`),
    completeStep: (roadmapId: string, stepId: string) => post<StudentRoadmap>(`/roadmaps/${roadmapId}/steps/${stepId}/complete`)
  },
  analytics: {
    studentDashboard: () => get<StudentAnalytics>('/analytics/student/dashboard'),
    customerDashboard: () => get<CustomerAnalytics>('/analytics/customer/dashboard'),
    customerCandidates: () => get<CustomerAnalytics>('/analytics/customer/candidates'),
    moderatorDashboard: () => get<ModeratorAnalytics>('/analytics/moderator/dashboard'),
    adminDashboard: () => get<AdminAnalytics>('/analytics/admin/dashboard')
  },
  agents: {
    sendMessage: (sessionId: string, body: { content: string; caseTitle?: string; artifacts?: string[] }) =>
      post<AgentSession>(`/agents/sessions/${sessionId}/messages`, body),
    latestSession: (agentId: string, caseId?: string) =>
      get<AgentSession | null>('/agents/sessions/latest', caseId ? { agentId, caseId } : { agentId })
  },
  news: {
    list: (category?: NewsCategory) => get<NewsPost[]>('/news', category ? { category } : undefined)
  },
  profileTraits: {
    me: () => get<ProfileTraits>('/profile-traits/me'),
    updateMe: (body: { professionalTags: string[]; interests: string[]; motivations: string[] }) =>
      put<ProfileTraits>('/profile-traits/me', body)
  },
  streak: {
    me: () => get<Streak>('/streak/me')
  },
  events: {
    listUpcoming: () => get<PlatformEvent[]>('/events')
  },
  search: {
    run: (query: string) => get<SearchResult[]>('/search', { query })
  },
  files: {
    upload: async (file: File): Promise<UploadedFile> => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post<UploadedFile>('/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
  }
};
