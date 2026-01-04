import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllProjects } from '../api/projects';
import { getMyTasks } from '../api/tasks';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsData, tasksData] = await Promise.all([
        getAllProjects(),
        getMyTasks()
      ]);
      setProjects(projectsData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header with Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Welcome, {user?.name}!
              </h1>
              <p className="mt-1 text-sm text-gray-600">Here's what's happening with your projects today</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Logout
            </button>
          </div>
          {/* Navigation Menu */}
          <nav className="flex gap-2">
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-sm"
            >
              Dashboard
            </Link>
            <Link
              to="/projects"
              className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition border border-gray-200"
            >
              Projects
            </Link>
            <Link
              to="/tasks"
              className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition border border-gray-200"
            >
              Tasks
            </Link>
            <Link
              to="/profile"
              className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition border border-gray-200"
            >
              Profile
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="My Projects" value={projects.length} color="indigo" icon="📁" />
          <StatCard title="My Tasks" value={taskStats.total} color="purple" icon="✓" />
          <StatCard title="In Progress" value={taskStats.inProgress} color="blue" icon="⏳" />
          <StatCard title="Completed" value={taskStats.completed} color="green" icon="✨" />
        </div>

        {/* Projects and Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* My Projects */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">My Projects</h2>
                <Link to="/projects" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold transition">
                  View all →
                </Link>
              </div>
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {projects.slice(0, 5).map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="block p-5 border border-gray-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50 hover:from-indigo-50 hover:to-purple-50 group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition">{project.title}</h3>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusBadge(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      {project.teamMembers?.length || 0} members
                    </span>
                  </div>
                </Link>
              ))}
              {projects.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📁</div>
                  <p className="text-gray-500">No projects yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Tasks</h2>
                <Link to="/tasks" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold transition">
                  View all →
                </Link>
              </div>
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {upcomingTasks.map((task) => {
                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
                return (
                  <div
                    key={task._id}
                    className={`p-5 border rounded-xl transition-all duration-200 ${
                      isOverdue 
                        ? 'border-red-300 bg-gradient-to-br from-red-50 to-orange-50 shadow-sm' 
                        : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-indigo-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-900">{task.title}</h3>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      {task.project?.title}
                    </div>
                    <div className={`text-xs font-semibold flex items-center ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                      {isOverdue && ' (Overdue!)'}
                    </div>
                  </div>
                );
              })}
              {upcomingTasks.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✓</div>
                  <p className="text-gray-500">No upcoming tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, icon }) => {
  const colors = {
    indigo: 'from-indigo-500 to-indigo-600',
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
  };

  const bgColors = {
    indigo: 'from-indigo-50 to-indigo-100',
    purple: 'from-purple-50 to-purple-100',
    blue: 'from-blue-50 to-blue-100',
    green: 'from-green-50 to-green-100',
  };

  return (
    <div className={`bg-gradient-to-br ${bgColors[color]} rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-4 shadow-lg`}>
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

const getStatusBadge = (status) => {
  const styles = {
    'planning': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    'in-progress': 'bg-blue-100 text-blue-800 border border-blue-200',
    'completed': 'bg-green-100 text-green-800 border border-green-200',
    'on-hold': 'bg-gray-100 text-gray-800 border border-gray-200'
  };
  return styles[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
};

const getPriorityBadge = (priority) => {
  const styles = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-orange-100 text-orange-800',
    'urgent': 'bg-red-100 text-red-800'
  };
  return styles[priority] || 'bg-gray-100 text-gray-800';
};

export default Dashboard;
