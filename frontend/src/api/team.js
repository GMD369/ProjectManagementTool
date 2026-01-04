import api from "./axios";

// Add team member to project
export const addTeamMember = async (projectId, userId) => {
  const response = await api.post(`/team/${projectId}/add`, { userId });
  return response.data;
};

// Remove team member from project
export const removeTeamMember = async (projectId, userId) => {
  const response = await api.post(`/team/${projectId}/remove`, { userId });
  return response.data;
};

// Get all team members for a project
export const getTeamMembers = async (projectId) => {
  const response = await api.get(`/team/${projectId}`);
  return response.data;
};
