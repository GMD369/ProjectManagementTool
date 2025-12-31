import Task from "../models/Task.js";
import Project from "../models/Project.js";

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    // Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const hasAccess = project.owner.toString() === req.user.id ||
      project.teamMembers.includes(req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo,
      priority,
      dueDate
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("project", "title");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL TASKS FOR A PROJECT
export const getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET TASKS ASSIGNED TO USER
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate("project", "title")
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Verify user has access to the project
    const project = await Project.findById(task.project);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.teamMembers.includes(req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id)
      .populate("assignedTo", "name email")
      .populate("project", "title");

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TASK STATUS
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id)
      .populate("assignedTo", "name email")
      .populate("project", "title");

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ASSIGN TASK
export const assignTask = async (req, res) => {
  try {
    const { userId } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Verify the user to be assigned is a team member
    const project = await Project.findById(task.project);
    if (!project.teamMembers.includes(userId)) {
      return res.status(400).json({ message: "User is not a team member" });
    }

    task.assignedTo = userId;
    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id)
      .populate("assignedTo", "name email")
      .populate("project", "title");

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Verify user has access to the project
    const project = await Project.findById(task.project);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.teamMembers.includes(req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
