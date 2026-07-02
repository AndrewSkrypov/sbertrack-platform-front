import axios from 'axios';
import {
  AdminAnalytics,
  AgentSession,
  CustomerAnalytics,
  ModeratorAnalytics,
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
      post<AgentSession>(`/agents/sessions/${sessionId}/messages`, body)
  }
};
