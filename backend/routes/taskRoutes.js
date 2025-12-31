import express from "express";
import {
  createTask,
  getProjectTasks,
  getMyTasks,
  updateTask,
  updateTaskStatus,
  assignTask,
  deleteTask
} from "../controllers/taskController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTask);
router.get("/my-tasks", protect, getMyTasks);
router.get("/project/:projectId", protect, getProjectTasks);
router.put("/:id", protect, updateTask);
router.patch("/:id/status", protect, updateTaskStatus);
router.patch("/:id/assign", protect, assignTask);
router.delete("/:id", protect, deleteTask);

export default router;
