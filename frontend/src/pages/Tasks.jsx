import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { isAdmin } from "../utils/auth";
import {
  ListChecks,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Edit,
  Trash2,
  User,
  Calendar,
  Filter,
  X
} from "lucide-react";
import { getMyTasks, createTask, updateTask, updateTaskStatus, deleteTask } from "../api/tasks";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin()) {
      navigate("/admin/tasks");
      return;
    }
    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      setError(null);
      const data = await getMyTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      setError(null);
      await createTask(taskData);
      setSuccess("Task created successfully!");
      fetchTasks();
      setShowCreateModal(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error creating task:", error);
      const errorMsg = error.response?.data?.message || "Failed to create task. Make sure you have created a project first.";
      setError(errorMsg);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      setError(null);
      await updateTask(selectedTask._id, taskData);
      setSuccess("Task updated successfully!");
      fetchTasks();
      setShowEditModal(false);
      setSelectedTask(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error updating task:", error);
      const errorMsg = error.response?.data?.message || "Failed to update task";
      setError(errorMsg);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      setError(null);
      await updateTaskStatus(taskId, status);
      fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        setError(null);
        await deleteTask(taskId);
        setSuccess("Task deleted successfully!");
        fetchTasks();
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error("Error deleting task:", error);
        setError("Failed to delete task");
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
    <div className="flex bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              My Tasks
            </h1>
            <p className="text-gray-600">Manage and track your assigned tasks</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            New Task
          </motion.button>
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
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Tasks Grid */}
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
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                onEdit={(task) => {
                  setSelectedTask(task);
                  setShowEditModal(true);
                }}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
                getStatusColor={getStatusColor}
                getPriorityColor={getPriorityColor}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <TaskModal
            onClose={() => {
              setShowCreateModal(false);
              setError(null);
            }}
            onSubmit={handleCreateTask}
            title="Create New Task"
            error={error}
          />
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {showEditModal && selectedTask && (
          <TaskModal
            onClose={() => {
              setShowEditModal(false);
              setSelectedTask(null);
              setError(null);
            }}
            onSubmit={handleUpdateTask}
            title="Edit Task"
            initialData={selectedTask}
            error={error}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const TaskCard = ({ task, index, onEdit, onDelete, onStatusChange, getStatusColor, getPriorityColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5 }}
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
        {task.status.replace("-", " ")}
      </span>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)} bg-gray-50`}>
        {task.priority}
      </span>
    </div>

    {task.project && (
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <ListChecks size={16} />
        <span>{task.project.title}</span>
      </div>
    )}

    {task.dueDate && (
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <Calendar size={16} />
        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
      </div>
    )}

    {task.assignedTo && (
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <User size={16} />
        <span>{task.assignedTo.name}</span>
      </div>
    )}

    {/* Status Buttons */}
    <div className="flex gap-2 mb-3">
      {["todo", "in-progress", "completed"].map((status) => (
        <button
          key={status}
          onClick={() => onStatusChange(task._id, status)}
          className={`flex-1 px-2 py-1 text-xs rounded-lg transition-colors ${
            task.status === status
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {status.replace("-", " ")}
        </button>
      ))}
    </div>

    {/* Action Buttons */}
    <div className="flex gap-2">
      <button
        onClick={() => onEdit(task)}
        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <Edit size={16} />
        Edit
      </button>
      <button
        onClick={() => onDelete(task._id)}
        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </motion.div>
);

const TaskModal = ({ onClose, onSubmit, title, initialData = null, error = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    projectId: initialData?.project?._id || "",
    priority: initialData?.priority || "medium",
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : "",
    status: initialData?.status || "todo"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate projectId for new tasks
    if (!initialData && !formData.projectId) {
      alert("Please enter a Project ID. You need to create a project first or get the project ID from your projects.");
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              required
            />
          </div>

          {!initialData && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project ID"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Note: Create a project first or get the ID from existing projects
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Tasks;
