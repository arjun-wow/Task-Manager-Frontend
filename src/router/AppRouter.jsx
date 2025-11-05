import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "../components/layout/Layout";
import Login from "../pages/Login";
import useAuthStore from "../store/authStore";
import useProjectStore from "../store/projectStore";
import useModalStore from "../store/modalStore";

import AddProjectModal from "../components/AddProjectModal";
import AddTaskModal from "../components/AddTaskModal";
import TaskDetailModal from "../components/TaskDetailModal";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const MyTasks = lazy(() => import("../pages/MyTasks"));
const CalendarPage = lazy(() => import("../pages/CalendarPage"));
const Team = lazy(() => import("../pages/Team"));
const Settings = lazy(() => import("../pages/Settings"));
const ProjectKanban = lazy(() => import("../pages/ProjectKanban"));
const ProjectOverview = lazy(() => import("../pages/ProjectOverview"));
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));
const AuthCallback = lazy(() => import("../pages/AuthCallback"));
const Reports = lazy(() => import("../pages/Reports"));

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }) => (
  <Layout>
    {children}
  </Layout>
);

export default function AppRouter() {
  const { isAddTaskModalOpen } = useModalStore();
  const { isAddingProject } = useProjectStore();

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/reset-password/:token"
          element={
            <Suspense fallback={<div className="p-8 text-black dark:text-white">Loading...</div>}>
              <ResetPasswordPage />
            </Suspense>
          }
        />
        <Route
          path="/auth/callback"
          element={
            <Suspense fallback={<div className="p-8 text-black dark:text-white">Processing...</div>}>
              <AuthCallback />
            </Suspense>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Suspense fallback={<div className="p-8 text-black dark:text-white">Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/tasks" element={<MyTasks />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/projects/:projectId/overview" element={<ProjectOverview />} />
                    <Route path="/projects/:projectId/kanban" element={<ProjectKanban />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* ✅ Global Modals */}
      {isAddTaskModalOpen && <AddTaskModal />}
      {isAddingProject && <AddProjectModal />}
      <TaskDetailModal />
    </>
  );
}
