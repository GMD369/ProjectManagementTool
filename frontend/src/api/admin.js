import api from "./axios";

// Get admin dashboard statistics
export const getAdminDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

// User Management
export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.patch(`/admin/users/${userId}/role`, { role });
  return response.data;
};

// Project Management
export const adminGetAllProjects = async () => {
  const response = await api.get("/admin/projects");
  return response.data;
};

export const adminDeleteProject = async (projectId) => {
  const response = await api.delete(`/admin/projects/${projectId}`);
  return response.data;
};

// Task Management
export const adminGetAllTasks = async () => {
  const response = await api.get("/admin/tasks");
  return response.data;
};

export const adminDeleteTask = async (taskId) => {
  const response = await api.delete(`/admin/tasks/${taskId}`);
  return response.data;
};
