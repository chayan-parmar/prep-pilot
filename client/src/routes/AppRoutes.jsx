import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/landing/LandingPage";
import LoginPage from "../pages/login/LoginPage";
import RegisterPage from "../pages/register/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ResumePage from "../pages/resume/ResumePage";
import QuizPage from "../pages/quiz/QuizPage";
import LearnPage from "../pages/learn/LearnPage";
import InterviewPage from "../pages/interview/InterviewPage";
import SettingsPage from "../pages/settings/SettingsPage";
import ProgressPage from "../pages/progress/ProgressPage";
import RoadmapPage from "../pages/roadmap/RoadmapPage";
import JobAnalyzerPage from "../pages/job-analyzer/JobAnalyzerPage";
import CodingPracticePage from "../pages/coding-practice/CodingPracticePage";
import AIMentorPage from "../pages/ai-mentor/AIMentorPage";
import ResourcesPage from "../pages/resources/ResourcesPage";
import NotFoundPage from "../pages/not-found/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-analyzer"
        element={
          <ProtectedRoute>
            <ResumePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz"
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn"
        element={
          <ProtectedRoute>
            <LearnPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mock-interview"
        element={
          <ProtectedRoute>
            <InterviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <ProgressPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roadmap"
        element={
          <ProtectedRoute>
            <RoadmapPage />
          </ProtectedRoute>
        }
      />
      {/* Coming Soon Pages */}
      <Route
        path="/job-analyzer"
        element={
          <ProtectedRoute>
            <JobAnalyzerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coding-practice"
        element={
          <ProtectedRoute>
            <CodingPracticePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-mentor"
        element={
          <ProtectedRoute>
            <AIMentorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute>
            <ResourcesPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;