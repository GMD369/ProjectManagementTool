import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import {
  User,
  Mail,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  Edit,
  X
} from "lucide-react";
import { getProfile, updateProfile } from "../api/users";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setError(null);
      const data = await getProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        email: data.email,
        password: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match if password is being updated
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setError(null);
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      // Only include password if it's being changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      const data = await updateProfile(updateData);
      setSuccess(data.message || "Profile updated successfully!");
      setProfile(data);
      setFormData({
        ...formData,
        password: "",
        confirmPassword: ""
      });
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMsg = error.response?.data?.message || "Failed to update profile";
      setError(errorMsg);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      email: profile.email,
      password: "",
      confirmPassword: ""
    });
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Loading profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">Manage your account information</p>
        </motion.div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
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
            className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2"
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}

        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200"
          >
            {/* Profile Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{profile?.name}</h2>
                  <p className="text-gray-500">{profile?.email}</p>
                  <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {profile?.role}
                  </span>
                </div>
              </div>
              {!isEditing && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  <Edit size={18} />
                  Edit Profile
                </motion.button>
              )}
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg px-4 focus-within:border-blue-500 transition-colors bg-white">
                    <User className="text-gray-400" size={20} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full p-3 outline-none bg-transparent disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg px-4 focus-within:border-blue-500 transition-colors bg-white">
                    <Mail className="text-gray-400" size={20} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full p-3 outline-none bg-transparent disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                </div>

                {/* Password Fields (only shown when editing) */}
                {isEditing && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password (optional)
                      </label>
                      <div className="flex items-center border-2 border-gray-200 rounded-lg px-4 focus-within:border-blue-500 transition-colors bg-white">
                        <Lock className="text-gray-400" size={20} />
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Leave blank to keep current password"
                          className="w-full p-3 outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="flex items-center border-2 border-gray-200 rounded-lg px-4 focus-within:border-blue-500 transition-colors bg-white">
                        <Lock className="text-gray-400" size={20} />
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="Confirm new password"
                          className="w-full p-3 outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCancel}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X size={18} />
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      <Save size={18} />
                      Save Changes
                    </motion.button>
                  </div>
                )}
              </div>
            </form>

            {/* Account Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>User ID:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">{profile?._id}</code>
                </div>
                <div className="flex justify-between">
                  <span>Account Created:</span>
                  <span>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span>{profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
