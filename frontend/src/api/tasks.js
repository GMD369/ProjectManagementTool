import api from "./axios";

// Create a new task
export const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData);
  return response.data;
};

// Get all tasks for a specific project
export const getProjectTasks = async (projectId) => {
  const response = await api.get(`/tasks/project/${projectId}`);
  console.log("Project tasks response:", response.data);
  return Array.isArray(response.data) ? response.data : (response.data.data || response.data.tasks || []);
};

// Get tasks assigned to the logged-in user
export const getMyTasks = async () => {
  const response = await api.get("/tasks/my-tasks");
  console.log("API Response:", response);
  console.log("Tasks data:", response.data);
  // Handle both direct array and wrapped response
  return Array.isArray(response.data) ? response.data : (response.data.data || response.data.tasks || []);
};

// Update a task
export const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

// Update task status
export const updateTaskStatus = async (taskId, status) => {
  const response = await api.patch(`/tasks/${taskId}/status`, { status });
  return response.data;
};

// Assign task to a user
export const assignTask = async (taskId, userId) => {
  const response = await api.patch(`/tasks/${taskId}/assign`, { userId });
  return response.data;
};

// Delete a task
export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};
