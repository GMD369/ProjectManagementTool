import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Filter to show only member users (exclude admins)
  const memberUsers = stats?.recent?.users?.filter(user => user.role !== 'admin') || [];
  
  // Filter to show only projects owned by members (not admins)
  const memberProjects = stats?.recent?.projects?.filter(project => project.owner?.role !== 'admin') || [];

  useEffect(() => {
    fetchDashboardStats();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchDashboardStats();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen flex items-center justify-center">
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50">
        {/* Header with Navigation */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-gray-600">Welcome back, {user?.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
            {/* Navigation Menu */}
            <nav className="flex gap-2">
              <Link
                to="/admin/dashboard"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-sm"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition border border-gray-200"
              >
                Users
              </Link>
              <Link
                to="/admin/projects"
                className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition border border-gray-200"
              >
                Projects
              </Link>
              <Link
                to="/admin/tasks"
                className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition border border-gray-200"
              >
                Tasks
              </Link>
            </nav>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.totals?.users || 0}
            icon="👥"
            bgColor="bg-blue-500"
          />
          <StatCard
            title="Total Projects"
            value={stats?.totals?.projects || 0}
            icon="📁"
            bgColor="bg-green-500"
          />
          <StatCard
            title="Total Tasks"
            value={stats?.totals?.tasks || 0}
            icon="✅"
            bgColor="bg-purple-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tasks by Status */}
          <ChartCard title="Tasks by Status">
            <div className="space-y-3">
              {stats?.tasksByStatus?.map((item, index) => (
                <ProgressBar
                  key={index}
                  label={item._id}
                  count={item.count}
                  total={stats?.totals?.tasks}
                  color={getStatusColor(item._id)}
                />
              ))}
            </div>
          </ChartCard>

          {/* Projects by Status */}
          <ChartCard title="Projects by Status">
            <div className="space-y-3">
              {stats?.projectsByStatus?.map((item, index) => (
                <ProgressBar
                  key={index}
                  label={item._id}
                  count={item.count}
                  total={stats?.totals?.projects}
                  color={getStatusColor(item._id)}
                />
              ))}
            </div>
          </ChartCard>

          {/* Tasks by Priority */}
          <ChartCard title="Tasks by Priority">
            <div className="space-y-3">
              {stats?.tasksByPriority?.map((item, index) => (
                <ProgressBar
                  key={index}
                  label={item._id}
                  count={item.count}
                  total={stats?.totals?.tasks}
                  color={getPriorityColor(item._id)}
                />
              ))}
            </div>
          </ChartCard>

          {/* User Distribution */}
          <ChartCard title="User Distribution">
            <div className="flex justify-around items-center h-full">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {stats?.usersByRole?.find(u => u._id === 'admin')?.count || 0}
                </div>
                <div className="text-sm text-gray-600 mt-2">Admins</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">
                  {stats?.usersByRole?.find(u => u._id === 'member')?.count || 0}
                </div>
                <div className="text-sm text-gray-600 mt-2">Members</div>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Members (Non-Admin Users)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {memberUsers.length > 0 ? memberUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No member users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Member Projects</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {memberProjects.length > 0 ? memberProjects.map((project) => (
                  <tr key={project._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.owner?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                      No member projects found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, bgColor }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`${bgColor} rounded-full p-4 text-white text-3xl`}>
        {icon}
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

const ProgressBar = ({ label, count, total, color }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700 capitalize">{label}</span>
        <span className="text-gray-600">{count}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Helper Functions
const getStatusColor = (status) => {
  const colors = {
    'todo': 'bg-gray-500',
    'planning': 'bg-yellow-500',
    'in-progress': 'bg-blue-500',
    'review': 'bg-purple-500',
    'completed': 'bg-green-500',
    'on-hold': 'bg-orange-500',
  };
  return colors[status] || 'bg-gray-500';
};

const getPriorityColor = (priority) => {
  const colors = {
    'low': 'bg-green-500',
    'medium': 'bg-yellow-500',
    'high': 'bg-orange-500',
    'urgent': 'bg-red-500',
  };
  return colors[priority] || 'bg-gray-500';
};

export default AdminDashboard;
