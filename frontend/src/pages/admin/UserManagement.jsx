import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  Users,
  Trash2,
  Shield,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { getAllUsers, deleteUser, updateUserRole } from "../../api/admin";
import { isAdmin } from "../../utils/auth";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/dashboard");
      return;
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setError(null);
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        setError(null);
        await deleteUser(userId);
        setSuccess("User deleted successfully!");
        fetchUsers();
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error("Error deleting user:", error);
        setError(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      setError(null);
      await updateUserRole(userId, newRole);
      setSuccess("User role updated successfully!");
      fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error updating role:", error);
      setError(error.response?.data?.message || "Failed to update role");
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
            User Management
          </h1>
          <p className="text-gray-600">Manage all system users and roles</p>
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
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/50 rounded-xl"
          >
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No users found</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Mail size={14} />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={16} className={user.role === "admin" ? "text-red-600" : "text-blue-600"} />
                  <span className={`text-sm font-semibold capitalize ${
                    user.role === "admin" ? "text-red-600" : "text-blue-600"
                  }`}>
                    {user.role}
                  </span>
                </div>

                {/* Created Date */}
                {user.createdAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar size={14} />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete User
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

export default UserManagement;
