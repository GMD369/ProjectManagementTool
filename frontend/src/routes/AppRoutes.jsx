import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/auth/Login";
import Home from "../pages/Home";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks";
import Projects from "../pages/Projects";
import ProjectDetails from "../pages/ProjectDetails";
import Profile from "../pages/Profile";
import TeamManagement from "../pages/TeamManagement";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import AdminProjects from "../pages/admin/AdminProjects";
import AdminTasks from "../pages/admin/AdminTasks";
import ProtectedRoute from "../components/ProtectedRoute";

// Helper component to redirect authenticated users based on their role
const AuthRedirect = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return children;
  }
  
  // Redirect based on user role
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <AuthRedirect>
          <Home />
        </AuthRedirect>
      } />
      <Route path="/login" element={
        <AuthRedirect>
          <Login />
        </AuthRedirect>
      } />
      <Route path="/register" element={
        <AuthRedirect>
          <Register />
        </AuthRedirect>
      } />
      
      {/* Member Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/tasks" element={
        <ProtectedRoute>
          <Tasks />
        </ProtectedRoute>
      } />
      <Route path="/projects" element={
        <ProtectedRoute>
          <Projects />
        </ProtectedRoute>
      } />
      <Route path="/projects/:id" element={
        <ProtectedRoute>
          <ProjectDetails />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/team" element={
        <ProtectedRoute>
          <TeamManagement />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute requireAdmin={true}>
          <UserManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/projects" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminProjects />
        </ProtectedRoute>
      } />
      <Route path="/admin/tasks" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminTasks />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
