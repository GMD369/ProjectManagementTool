// Decode JWT token to get user info
export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // JWT payload is the middle part (base64 encoded)
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Check if user is admin
export const isAdmin = () => {
  const user = getUserFromToken();
  return user?.role === "admin";
};

// Check if user is project owner
export const isProjectOwner = (project, userId) => {
  if (!project || !userId) return false;
  return project.owner?._id === userId || project.owner === userId;
};
