import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  ListChecks,
  Users,
  User
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-gray-300">
      <div className="p-6 text-xl font-bold text-white">
        ProManage
      </div>

      <nav className="px-4 space-y-2">
        <SidebarLink to="/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
        <SidebarLink to="/projects" icon={<Folder />} label="Projects" />
        <SidebarLink to="/tasks" icon={<ListChecks />} label="Tasks" />
        <SidebarLink to="/team" icon={<Users />} label="Team" />
        <SidebarLink to="/profile" icon={<User />} label="Profile" />
      </nav>
    </aside>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-lg transition
       ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800"}`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export default Sidebar;
