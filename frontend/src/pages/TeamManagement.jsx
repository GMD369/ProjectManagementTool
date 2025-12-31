import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import {
  Users,
  Plus,
  Trash2,
  UserPlus,
  X,
  Mail,
  Shield,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { getTeamMembers, addTeamMember, removeTeamMember } from "../api/teams";
import { getAllProjects } from "../api/projects";
import { getUserFromToken, isProjectOwner, isAdmin } from "../utils/auth";

const TeamManagement = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userId, setUserId] = useState("");
  const currentUser = getUserFromToken();
  const isOwner = selectedProject ? isProjectOwner(selectedProject, currentUser?.id) : false;

  useEffect(() => {
    if (isAdmin()) {
      window.location.href = "/admin/dashboard";
      return;
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchTeamMembers(selectedProject._id);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      setError(null);
      const data = await getAllProjects();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProject(data[0]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async (projectId) => {
    try {
      setError(null);
      const data = await getTeamMembers(projectId);
      setTeamMembers(data);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setError("Failed to load team members");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError("Please enter a user ID");
      return;
    }

    try {
      setError(null);
      await addTeamMember(selectedProject._id, userId);
      setSuccess("Team member added successfully!");
      setUserId("");
      setShowAddModal(false);
      fetchTeamMembers(selectedProject._id);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error adding team member:", error);
      const errorMsg = error.response?.data?.message || "Failed to add team member";
      setError(errorMsg);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      try {
        setError(null);
        await removeTeamMember(selectedProject._id, memberId);
        setSuccess("Team member removed successfully!");
        fetchTeamMembers(selectedProject._id);
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error("Error removing team member:", error);
        const errorMsg = error.response?.data?.message || "Failed to remove team member";
        setError(errorMsg);
      }
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Team Management
              </h1>
              <p className="text-gray-600">Manage your project team members</p>
            </div>
            {selectedProject && isOwner && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
              >
                <UserPlus size={20} />
                Add Member
              </motion.button>
            )}
            {selectedProject && !isOwner && (
              <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                View Only - Only project owner can manage team
              </div>
            )}
          </div>

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

          {/* Project Selection */}
          {projects.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Project
              </label>
              <select
                value={selectedProject?._id || ""}
                onChange={(e) => {
                  const project = projects.find(p => p._id === e.target.value);
                  setSelectedProject(project);
                }}
                className="w-full max-w-md px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </motion.div>

        {/* Team Members List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : !selectedProject ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/50 rounded-xl"
          >
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No projects found. Create a project first.</p>
          </motion.div>
        ) : teamMembers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/50 rounded-xl"
          >
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No team members yet. Add your first member!</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {member.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{member.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Mail size={14} />
                        <span>{member.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {member.role && (
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={16} className="text-purple-600" />
                    <span className="text-sm text-gray-600 capitalize">{member.role}</span>
                  </div>
                )}

                {isOwner ? (
                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                ) : (
                  <div className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-center text-sm">
                    View Only
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowAddModal(false);
              setError(null);
              setUserId("");
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Add Team Member
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setError(null);
                    setUserId("");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
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

              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter user ID"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Note: The user must be registered in the system
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setError(null);
                      setUserId("");
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Add Member
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamManagement;
