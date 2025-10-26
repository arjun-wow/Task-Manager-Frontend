import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Login from '../pages/Login';
import useAuthStore from '../store/authStore';
import { Suspense, lazy } from 'react';
import AddProjectModal from '../components/AddProjectModal'; // <-- IMPORTED

// Lazily import all your pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const MyTasks = lazy(() => import('../pages/MyTasks'));
const CalendarPage = lazy(() => import('../pages/CalendarPage'));
const Team = lazy(() => import('../pages/Team'));
const Settings = lazy(() => import('../pages/Settings'));
const ProjectKanban = lazy(() => import('../pages/ProjectKanban'));
const ProjectOverview = lazy(() => import('../pages/ProjectOverview'));

// A component to protect routes
const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// A component to handle the main app layout
const AppLayout = ({ children }) => (
  <Layout>
    {children}
  </Layout>
);

export default function AppRouter() {
  const { token } = useAuthStore();
  
  return (
    <> {/* <-- WRAPPED IN FRAGMENT */}
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route 
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Suspense fallback={<div className="p-8">Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/tasks" element={<MyTasks />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* Project-specific routes from your designs */}
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
      
      {/* RENDER THE MODAL GLOBALLY */}
      <AddProjectModal />
    </>
  );
}
