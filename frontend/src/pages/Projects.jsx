import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import {
  Folder,
  Plus,
  Calendar,
  Users,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  Pause,
  Eye
} from "lucide-react";
import { getAllProjects, createProject, updateProject, deleteProject } from "../api/projects";
import { useNavigate } from "react-router-dom";
import { getUserFromToken, isProjectOwner, isAdmin } from "../utils/auth";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const currentUser = getUserFromToken();

  useEffect(() => {
    if (isAdmin()) {
      navigate("/admin/projects");
      return;
    }
    fetchProjects();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      setError(null);
      const data = await getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      setError(null);
      await createProject(projectData);
      setSuccess("Project created successfully!");
      fetchProjects();
      setShowCreateModal(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error creating project:", error);
      const errorMsg = error.response?.data?.message || "Failed to create project";
      setError(errorMsg);
    }
  };

  const handleUpdateProject = async (projectData) => {
    try {
      setError(null);
      await updateProject(selectedProject._id, projectData);
      setSuccess("Project updated successfully!");
      fetchProjects();
      setShowEditModal(false);
      setSelectedProject(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error updating project:", error);
      const errorMsg = error.response?.data?.message || "Failed to update project";
      setError(errorMsg);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure? This will delete the project and all its tasks!")) {
      try {
        setError(null);
        await deleteProject(projectId);
        setSuccess("Project and all tasks deleted successfully!");
        fetchProjects();
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error("Error deleting project:", error);
        setError("Failed to delete project");
      }
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filter === "all") return true;
    return project.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "planning": return <Clock className="text-gray-500" size={18} />;
      case "in-progress": return <Play className="text-blue-500" size={18} />;
      case "completed": return <CheckCircle2 className="text-green-500" size={18} />;
      case "on-hold": return <Pause className="text-orange-500" size={18} />;
      default: return <Clock className="text-gray-500" size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "planning": return "bg-gray-100 text-gray-700";
      case "in-progress": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-green-100 text-green-700";
      case "on-hold": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
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
              Projects
            </h1>
            <p className="text-gray-600">Manage your projects and track progress</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            New Project
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
          {["all", "planning", "in-progress", "completed", "on-hold"].map((status) => (
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

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/50 rounded-xl"
          >
            <Folder size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No projects found</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                index={index}
                onEdit={(project) => {
                  setSelectedProject(project);
                  setShowEditModal(true);
                }}
                onDelete={handleDeleteProject}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                currentUserId={currentUser?.id}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <ProjectModal
            onClose={() => {
              setShowCreateModal(false);
              setError(null);
            }}
            onSubmit={handleCreateProject}
            title="Create New Project"
            error={error}
          />
        )}
      </AnimatePresence>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {showEditModal && selectedProject && (
          <ProjectModal
            onClose={() => {
              setShowEditModal(false);
              setSelectedProject(null);
              setError(null);
            }}
            onSubmit={handleUpdateProject}
            title="Edit Project"
            initialData={selectedProject}
            error={error}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ProjectCard = ({ project, index, onEdit, onDelete, getStatusColor, getStatusIcon, currentUserId }) => {
  const isOwner = isProjectOwner(project, currentUserId);
  
  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
      </div>
      <Folder size={24} className="text-blue-500" />
    </div>

    <div className="flex items-center gap-2 mb-4">
      {getStatusIcon(project.status)}
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
        {project.status.replace("-", " ")}
      </span>
    </div>

    {project.owner && (
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <Users size={16} />
        <span>Owner: {project.owner.name} {isOwner && <span className="text-blue-600 font-semibold">(You)</span>}</span>
      </div>
    )}

    {project.teamMembers && project.teamMembers.length > 0 && (
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <Users size={16} />
        <span>{project.teamMembers.length} team member(s)</span>
      </div>
    )}

    {project.startDate && (
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Calendar size={16} />
        <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
      </div>
    )}

    {project.endDate && (
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Calendar size={16} />
        <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>
      </div>
    )}

    {/* Action Buttons */}
    {isOwner ? (
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(project)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Edit size={16} />
          Edit
        </button>
        <button
          onClick={() => onDelete(project._id)}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ) : (
      <div className="flex gap-2">
        <button
          disabled
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
        >
          <Eye size={16} />
          View Only
        </button>
      </div>
    )}

    {/* Project ID (for creating tasks) */}
    <div className="mt-4 pt-4 border-t border-gray-200">
      <p className="text-xs text-gray-500 mb-1">Project ID (for tasks):</p>
      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 break-all block">
        {project._id}
      </code>
    </div>
  </motion.div>
  );
};

const ProjectModal = ({ onClose, onSubmit, title, initialData = null, error = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: initialData?.status || "planning",
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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

export default Projects;
