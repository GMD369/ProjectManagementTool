import api from "./axios";

// Get user profile
export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

// Update user profile
export const updateProfile = async (profileData) => {
  const response = await api.put("/users/profile", profileData);
  return response.data;
};
