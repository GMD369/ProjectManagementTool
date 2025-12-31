import Project from "../models/Project.js";
import Task from "../models/Task.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;

    const project = await Project.create({
      title,
      description,
      owner: req.user.id,
      teamMembers: [req.user.id],
      startDate,
      endDate
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PROJECTS
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { teamMembers: req.user.id }
      ]
    })
      .populate("owner", "name email")
      .populate("teamMembers", "name email")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PROJECT BY ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("teamMembers", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user has access to this project
    const hasAccess = project.owner._id.toString() === req.user.id ||
      project.teamMembers.some(member => member._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get tasks for this project
    const tasks = await Task.find({ project: project._id })
      .populate("assignedTo", "name email");

    res.json({ project, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROJECT
export const updateProject = async (req, res) => {
  try {
    const { title, description, status, startDate, endDate } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can update project
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this project" });
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.status = status || project.status;
    project.startDate = startDate || project.startDate;
    project.endDate = endDate || project.endDate;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can delete project
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this project" });
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: req.params.id });

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project and associated tasks deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: GET ALL PROJECTS
export const adminGetAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({})
      .populate("owner", "name email")
      .populate("teamMembers", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: DELETE ANY PROJECT
export const adminDeleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: req.params.id });

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project and associated tasks deleted successfully by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
