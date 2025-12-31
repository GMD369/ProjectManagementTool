import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  Users,
  Folder,
  ListChecks,
  TrendingUp,
  Activity,
  AlertCircle
} from "lucide-react";
import { getAdminDashboardStats } from "../../api/admin";
import { isAdmin } from "../../utils/auth";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    if (!isAdmin()) {
      navigate("/dashboard");
      return;
    }
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setError(null);
      const data = await getAdminDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">
          <p className="text-gray-500">Loading...</p>
        </main>
      </div>
    );
  }

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
            Admin Dashboard
          </h1>
          <p className="text-gray-600">System overview and statistics</p>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Users className="text-blue-600" size={32} />}
            title="Total Users"
            value={stats?.totals?.users || 0}
            color="blue"
          />
          <StatCard
            icon={<Folder className="text-purple-600" size={32} />}
            title="Total Projects"
            value={stats?.totals?.projects || 0}
            color="purple"
          />
          <StatCard
            icon={<ListChecks className="text-green-600" size={32} />}
            title="Total Tasks"
            value={stats?.totals?.tasks || 0}
            color="green"
          />
        </div>

        {/* Detailed Statistics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Tasks by Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity size={24} className="text-blue-600" />
              Tasks by Status
            </h3>
            <div className="space-y-3">
              {stats?.tasksByStatus?.map((item) => (
                <div key={item._id} className="flex justify-between items-center">
                  <span className="text-gray-700 capitalize">{item._id || "No Status"}</span>
                  <span className="font-bold text-blue-600">{item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tasks by Priority */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-purple-600" />
              Tasks by Priority
            </h3>
            <div className="space-y-3">
              {stats?.tasksByPriority?.map((item) => (
                <div key={item._id} className="flex justify-between items-center">
                  <span className="text-gray-700 capitalize">{item._id}</span>
                  <span className="font-bold text-purple-600">{item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Users by Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={24} className="text-green-600" />
              Users by Role
            </h3>
            <div className="space-y-3">
              {stats?.usersByRole?.map((item) => (
                <div key={item._id} className="flex justify-between items-center">
                  <span className="text-gray-700 capitalize">{item._id}</span>
                  <span className="font-bold text-green-600">{item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Projects by Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Folder size={24} className="text-orange-600" />
              Projects by Status
            </h3>
            <div className="space-y-3">
              {stats?.projectsByStatus?.map((item) => (
                <div key={item._id} className="flex justify-between items-center">
                  <span className="text-gray-700 capitalize">{item._id}</span>
                  <span className="font-bold text-orange-600">{item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Users</h3>
            <div className="space-y-3">
              {stats?.recent?.users?.map((user) => (
                <div key={user._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Projects</h3>
            <div className="space-y-3">
              {stats?.recent?.projects?.map((project) => (
                <div key={project._id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-800">{project.title}</p>
                  <p className="text-sm text-gray-500">
                    Owner: {project.owner?.name}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -5 }}
    className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
  >
    <div className="flex items-center justify-between mb-4">
      {icon}
      <span className={`text-3xl font-bold text-${color}-600`}>{value}</span>
    </div>
    <h3 className="text-gray-600 font-medium">{title}</h3>
  </motion.div>
);

export default AdminDashboard;
