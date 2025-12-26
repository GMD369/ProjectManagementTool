import React from "react";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import {
  Folder,
  ListChecks,
  Users,
  TrendingUp
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Dashboard
        </h1>

        {/* Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <DashboardCard
            title="Total Projects"
            value="8"
            icon={<Folder size={28} />}
          />
          <DashboardCard
            title="Total Tasks"
            value="42"
            icon={<ListChecks size={28} />}
          />
          <DashboardCard
            title="Team Members"
            value="12"
            icon={<Users size={28} />}
          />
          <DashboardCard
            title="Completed Tasks"
            value="30"
            icon={<TrendingUp size={28} />}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Recent Activity
          </h2>

          <ul className="space-y-3 text-gray-600 text-sm">
            <li>✔ Task “Design UI” marked as completed</li>
            <li>📁 New project “Website Redesign” created</li>
            <li>👤 New team member added</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
