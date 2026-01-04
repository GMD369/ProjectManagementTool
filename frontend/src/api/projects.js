import api from "./axios";

// Create a new project
export const createProject = async (projectData) => {
  const response = await api.post("/projects", projectData);
  return response.data;
};

// Get all projects for the logged-in user
export const getAllProjects = async () => {
  const response = await api.get("/projects");
  console.log("Projects response:", response.data);
  return Array.isArray(response.data) ? response.data : (response.data.data || response.data.projects || []);
};

// Get a specific project by ID
export const getProjectById = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

// Update a project
export const updateProject = async (projectId, projectData) => {
  const response = await api.put(`/projects/${projectId}`, projectData);
  return response.data;
};

// Delete a project
export const deleteProject = async (projectId) => {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
};
