import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  ListChecks,
  Trash2,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  Eye
} from "lucide-react";
import { adminGetAllTasks, adminDeleteTask } from "../../api/admin";
import { isAdmin } from "../../utils/auth";

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/dashboard");
      return;
    }
    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      setError(null);
      const data = await adminGetAllTasks();
      const tasksArray = data.tasks || data;
      setTasks(Array.isArray(tasksArray) ? tasksArray : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      try {
        setError(null);
        await adminDeleteTask(taskId);
        setSuccess("Task deleted successfully!");
        fetchTasks();
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error("Error deleting task:", error);
        setError(error.response?.data?.message || "Failed to delete task");
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "todo": return "bg-gray-100 text-gray-700";
      case "in-progress": return "bg-blue-100 text-blue-700";
      case "review": return "bg-purple-100 text-purple-700";
      case "completed": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low": return "text-gray-500";
      case "medium": return "text-yellow-500";
      case "high": return "text-orange-500";
      case "urgent": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="flex bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            All Tasks
          </h1>
          <p className="text-gray-600">Manage all tasks in the system</p>
        </motion.div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2"
            >
              <CheckCircle2 size={20} />
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2"
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "todo", "in-progress", "review", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === status
                  ? "bg-linear-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/50 rounded-xl"
          >
            <ListChecks size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No tasks found</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{task.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>
                  </div>
                  <AlertCircle size={20} className={getPriorityColor(task.priority)} />
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status?.replace("-", " ")}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)} bg-gray-50`}>
                    {task.priority}
                  </span>
                </div>

                {task.project && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <ListChecks size={16} />
                    <span>Project: {task.project.title}</span>
                  </div>
                )}

                {task.assignedTo && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <User size={16} />
                    <span>Assigned: {task.assignedTo.name}</span>
                  </div>
                )}

                {task.dueDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Calendar size={16} />
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminTasks;
