import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Login from "../pages/auth/Login";
import Home from "../pages/Home";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks";
import Projects from "../pages/Projects";
import Profile from "../pages/Profile";
import TeamManagement from "../pages/TeamManagement";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import AdminProjects from "../pages/admin/AdminProjects";
import AdminTasks from "../pages/admin/AdminTasks";

// Helper component to redirect authenticated users
const AuthRedirect = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => {
  return (
    <Routes>
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
       <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/tasks" element={<Tasks />} />
       <Route path="/projects" element={<Projects />} />
       <Route path="/profile" element={<Profile />} />
       <Route path="/team" element={<TeamManagement />} />
       
       {/* Admin Routes */}
       <Route path="/admin/dashboard" element={<AdminDashboard />} />
       <Route path="/admin/users" element={<UserManagement />} />
       <Route path="/admin/projects" element={<AdminProjects />} />
       <Route path="/admin/tasks" element={<AdminTasks />} />
    </Routes>
  );
};

export default AppRoutes;
