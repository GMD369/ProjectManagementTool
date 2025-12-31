import Project from "../models/Project.js";
import User from "../models/User.js";

// ADD TEAM MEMBER
export const addTeamMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can add team members
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only project owner can add team members" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already a team member
    if (project.teamMembers.includes(userId)) {
      return res.status(400).json({ message: "User is already a team member" });
    }

    project.teamMembers.push(userId);
    await project.save();

    const updatedProject = await Project.findById(req.params.projectId)
      .populate("teamMembers", "name email");

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE TEAM MEMBER
export const removeTeamMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can remove team members
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only project owner can remove team members" });
    }

    // Cannot remove the owner
    if (userId === project.owner.toString()) {
      return res.status(400).json({ message: "Cannot remove project owner" });
    }

    project.teamMembers = project.teamMembers.filter(
      member => member.toString() !== userId
    );
    await project.save();

    const updatedProject = await Project.findById(req.params.projectId)
      .populate("teamMembers", "name email");

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET TEAM MEMBERS
export const getTeamMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate("teamMembers", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user has access to this project
    const hasAccess = project.owner.toString() === req.user.id ||
      project.teamMembers.some(member => member._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(project.teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
