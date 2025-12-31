import express from "express";
import {
  addTeamMember,
  removeTeamMember,
  getTeamMembers
} from "../controllers/teamController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:projectId/add", protect, addTeamMember);
router.post("/:projectId/remove", protect, removeTeamMember);
router.get("/:projectId", protect, getTeamMembers);

export default router;
