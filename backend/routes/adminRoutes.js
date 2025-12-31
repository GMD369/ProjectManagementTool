import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
  getAllUsers,
  deleteUser,
  updateUserRole
} from "../controllers/userController.js";
import {
  adminGetAllProjects,
  adminDeleteProject
} from "../controllers/projectController.js";
import {
  getDashboardStats,
  getAllTasks,
  deleteAnyTask
} from "../controllers/adminController.js";

const router = express.Router();

// Apply protect and adminOnly middleware to all admin routes
router.use(protect);
router.use(adminOnly);

// Dashboard
router.get("/dashboard", getDashboardStats);

// User Management
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", updateUserRole);

// Project Management
router.get("/projects", adminGetAllProjects);
router.delete("/projects/:id", adminDeleteProject);

// Task Management
router.get("/tasks", getAllTasks);
router.delete("/tasks/:id", deleteAnyTask);

export default router;
