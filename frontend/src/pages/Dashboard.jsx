import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import {
  Folder,
  ListChecks,
  Users,
  TrendingUp,
  CheckCircle,
  FolderPlus,
  UserPlus
} from "lucide-react";
import { getMyTasks } from "../api/tasks";
import { isAdmin } from "../utils/auth";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0
  });
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const data = await getMyTasks();
      setTasks(data);
      
      // Calculate stats
      setStats({
        totalTasks: data.length,
        completedTasks: data.filter(t => t.status === "completed").length,
        inProgressTasks: data.filter(t => t.status === "in-progress").length,
        todoTasks: data.filter(t => t.status === "todo").length
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (isAdmin()) {
      navigate("/admin/dashboard");
      return;
    }
    fetchTasks();
  }, [navigate]);

  return (
    <div className="flex bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <DashboardCard
            title="Total Tasks"
            value={stats.totalTasks.toString()}
            icon={<ListChecks size={28} />}
          />
          <DashboardCard
            title="To Do"
            value={stats.todoTasks.toString()}
            icon={<Folder size={28} />}
          />
          <DashboardCard
            title="In Progress"
            value={stats.inProgressTasks.toString()}
            icon={<TrendingUp size={28} />}
          />
          <DashboardCard
            title="Completed"
            value={stats.completedTasks.toString()}
            icon={<CheckCircle size={28} />}
          />
        </div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recent Tasks
          </h2>

          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks yet. Create your first task!</p>
          ) : (
            <ul className="space-y-4">
              {tasks.slice(0, 5).map((task, index) => (
                <ActivityItem 
                  key={task._id}
                  icon={
                    task.status === "completed" 
                      ? <CheckCircle className="text-green-500" size={20} />
                      : task.status === "in-progress"
                      ? <TrendingUp className="text-blue-500" size={20} />
                      : <ListChecks className="text-gray-500" size={20} />
                  }
                  text={task.title}
                  time={task.project?.title || "No project"}
                />
              ))}
            </ul>
          )}
        </motion.div>
      </main>
    </div>
  );
};

const ActivityItem = ({ icon, text, time }) => (
  <motion.li
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ x: 5 }}
    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
  >
    <div className="mt-1">{icon}</div>
    <div className="flex-1">
      <p className="text-gray-700 font-medium">{text}</p>
      <p className="text-gray-400 text-sm">{time}</p>
    </div>
  </motion.li>
);

export default Dashboard;
