import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { RoleGuard } from '../components/RoleGuard';
import { AdminDashboardPage } from '../pages/AdminPages';
import {
  CandidateProfilePage,
  CaseCreatePage,
  CustomerDashboardPage,
  CvBookPage,
  SubmissionReviewPage,
  TrackCreatePage
} from '../pages/CustomerPages';
import { AccessDeniedPage, PublicLandingPage, SignInPage, SignUpPage } from '../pages/PublicPages';
import {
  AgentSandboxPage,
  CaseDetailsPage,
  PortfolioPage,
  ReflectionPage,
  StudentDashboardPage,
  StudentRoadmapPage,
  StudentTrajectoryTreePage,
  StudentWorkspacePage,
  TrackCatalogPage,
  TrackDetailsPage
} from '../pages/StudentPages';
import { AgentManagementPage, MasterPromptManagementPage, ModeratorDashboardPage } from '../pages/ModeratorPages';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLandingPage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />

      <Route element={<RoleGuard roles={['STUDENT', 'CUSTOMER', 'MODERATOR', 'ADMIN']} />}>
        <Route element={<AppShell />}>
          <Route element={<RoleGuard roles={['STUDENT']} />}>
            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            <Route path="/student/tracks" element={<TrackCatalogPage />} />
            <Route path="/student/tracks/:id" element={<TrackDetailsPage />} />
            <Route path="/student/cases/:id" element={<CaseDetailsPage />} />
            <Route path="/student/workspace/:caseId" element={<StudentWorkspacePage />} />
            <Route path="/student/trajectories" element={<StudentTrajectoryTreePage />} />
            <Route path="/student/roadmap" element={<StudentRoadmapPage />} />
            <Route path="/student/agents" element={<AgentSandboxPage />} />
            <Route path="/student/portfolio" element={<PortfolioPage />} />
            <Route path="/student/reflection" element={<ReflectionPage />} />
            <Route path="/student/reflection/:submissionId" element={<ReflectionPage />} />
          </Route>

          <Route element={<RoleGuard roles={['CUSTOMER']} />}>
            <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
            <Route path="/customer/tracks/create" element={<TrackCreatePage />} />
            <Route path="/customer/cases/create" element={<CaseCreatePage />} />
            <Route path="/customer/submissions" element={<SubmissionReviewPage />} />
            <Route path="/customer/cv-book" element={<CvBookPage />} />
            <Route path="/customer/cv-book/:id" element={<CandidateProfilePage />} />
          </Route>

          <Route element={<RoleGuard roles={['MODERATOR']} />}>
            <Route path="/moderator/dashboard" element={<ModeratorDashboardPage />} />
            <Route path="/moderator/agents" element={<AgentManagementPage />} />
            <Route path="/moderator/master-prompts" element={<MasterPromptManagementPage />} />
          </Route>

          <Route element={<RoleGuard roles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
