import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  Folder,
  Trash2,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle2,
  Eye
} from "lucide-react";
import { adminGetAllProjects, adminDeleteProject } from "../../api/admin";
import { isAdmin } from "../../utils/auth";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/dashboard");
      return;
    }
    fetchProjects();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      setError(null);
      const data = await adminGetAllProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        setError(null);
        await adminDeleteProject(projectId);
        setSuccess("Project deleted successfully!");
        fetchProjects();
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error("Error deleting project:", error);
        setError(error.response?.data?.message || "Failed to delete project");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "planning": return "bg-blue-100 text-blue-700";
      case "active": return "bg-green-100 text-green-700";
      case "on-hold": return "bg-yellow-100 text-yellow-700";
      case "completed": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
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
            All Projects
          </h1>
          <p className="text-gray-600">Manage all projects in the system</p>
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

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
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
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status?.replace("-", " ")}
                  </span>
                </div>

                {project.owner && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Users size={16} />
                    <span>Owner: {project.owner.name}</span>
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

                <div className="flex gap-2">
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
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

export default AdminProjects;
