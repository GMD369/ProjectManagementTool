import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Folder,
  ListChecks,
  Users,
  User,
  LogOut,
  Shield,
  UserCog,
  BarChart3
} from "lucide-react";
import { isAdmin } from "../utils/auth";

const Sidebar = () => {
  const navigate = useNavigate();
  const userIsAdmin = isAdmin();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <motion.aside 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="w-64 min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 shadow-2xl"
    >
      <div className="p-6 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        ProManage
      </div>

      <nav className="px-4 space-y-2">
        {userIsAdmin ? (
          <>
            {/* Admin Only Navigation */}
            <div className="pt-2 pb-2 px-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <Shield size={14} />
                <span>Admin Panel</span>
              </div>
            </div>
            <SidebarLink to="/admin/dashboard" icon={<BarChart3 />} label="Admin Dashboard" />
            <SidebarLink to="/admin/users" icon={<UserCog />} label="User Management" />
            <SidebarLink to="/admin/projects" icon={<Folder />} label="All Projects" />
            <SidebarLink to="/admin/tasks" icon={<ListChecks />} label="All Tasks" />
            <SidebarLink to="/profile" icon={<User />} label="Profile" />
          </>
        ) : (
          <>
            {/* Member Only Navigation */}
            <SidebarLink to="/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
            <SidebarLink to="/projects" icon={<Folder />} label="Projects" />
            <SidebarLink to="/tasks" icon={<ListChecks />} label="Tasks" />
            <SidebarLink to="/team" icon={<Users />} label="Team" />
            <SidebarLink to="/profile" icon={<User />} label="Profile" />
          </>
        )}
      </nav>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className="flex items-center gap-3 px-8 py-3 mx-4 mt-8 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </motion.button>
    </motion.aside>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
       ${isActive 
         ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
         : "hover:bg-gray-800 hover:translate-x-1"}`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export default Sidebar;
