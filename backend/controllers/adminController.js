import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

// ADMIN: GET DASHBOARD STATISTICS
export const getDashboardStats = async (req, res) => {
  try {
    // Count totals
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalTasks = await Task.countDocuments();

    // Task statistics by status
    const tasksByStatus = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Project statistics by status
    const projectsByStatus = await Project.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent users (last 5)
    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent projects (last 5)
    const recentProjects = await Project.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // Tasks by priority
    const tasksByPriority = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      }
    ]);

    // Users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totals: {
        users: totalUsers,
        projects: totalProjects,
        tasks: totalTasks
      },
      tasksByStatus,
      projectsByStatus,
      tasksByPriority,
      usersByRole,
      recent: {
        users: recentUsers,
        projects: recentProjects
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: GET ALL TASKS
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate("project", "title")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: DELETE ANY TASK
export const deleteAnyTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
