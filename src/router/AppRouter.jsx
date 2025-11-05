import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Login from '../pages/Login';
import useAuthStore from '../store/authStore';
import { Suspense, lazy } from 'react';
import AddProjectModal from '../components/AddProjectModal'; 
import useProjectStore from '../store/projectStore';      
import TaskDetailModal from '../components/TaskDetailModal'; 

const Dashboard = lazy(() => import('../pages/Dashboard'));
const MyTasks = lazy(() => import('../pages/MyTasks'));
const CalendarPage = lazy(() => import('../pages/CalendarPage'));
const Team = lazy(() => import('../pages/Team'));
const Settings = lazy(() => import('../pages/Settings'));
const ProjectKanban = lazy(() => import('../pages/ProjectKanban'));
const ProjectOverview = lazy(() => import('../pages/ProjectOverview'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const AuthCallback = lazy(() => import('../pages/AuthCallback'));
const Reports = lazy(() => import('../pages/Reports'));


const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
    // This component assumes ProtectedRoute has already run
    // It relies on the user object being loaded into the authStore
    const { user } = useAuthStore(); 

    if (user?.role !== 'ADMIN') {
        // If user is not an admin, boot them back to the home page
        return <Navigate to="/" replace />; 
    }
    
    return children; // User is an admin, render the admin page
};

const AppLayout = ({ children }) => (
  <Layout>
    {children}
  </Layout>
);

export default function AppRouter() {
  const { token } = useAuthStore();
  const { isAddingProject } = useProjectStore(); 

  return (
    <> {/*  */}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password/:token" element={
            <Suspense fallback={<div className="p-8 text-black dark:text-white">Loading...</div>}>
                 <ResetPasswordPage />
            </Suspense>
        } />
        <Route path="/auth/callback" element={
            <Suspense fallback={<div className="p-8 text-black dark:text-white">Processing...</div>}>
                 <AuthCallback />
            </Suspense>
        } />

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

      <AddProjectModal />
      <TaskDetailModal /> 
    </>
  );
}

