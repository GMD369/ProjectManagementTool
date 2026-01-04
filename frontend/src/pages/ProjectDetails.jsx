import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjectById, deleteProject } from '../api/projects';
import { getProjectTasks, createTask, updateTask, updateTaskStatus, deleteTask as deleteTaskApi } from '../api/tasks';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchProjectDetails = async () => {
    try {
      const data = await getProjectById(id);
      setProject(data.project);
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error fetching project details:', error);
      if (error.response?.status === 404 || error.response?.status === 403) {
        navigate('/projects');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleTaskMove = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTaskApi(taskId);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const isOwner = project.owner?._id === user?._id;
  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    completed: tasks.filter(t => t.status === 'completed')
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/projects" className="text-blue-600 hover:text-blue-700 text-sm">
              ← Back to Projects
            </Link>
            {isOwner && (
              <button
                onClick={() => setShowTaskModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + New Task
              </button>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
          <p className="mt-2 text-gray-600">{project.description}</p>
          <div className="mt-4 flex gap-4 text-sm text-gray-600">
            <span className={`px-3 py-1 rounded-full ${getStatusBadge(project.status)}`}>
              {project.status}
            </span>
            <span>Owner: {project.owner?.name}</span>
            <span>{project.teamMembers?.length || 0} member(s)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {['tasks', 'team', 'overview'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['todo', 'in-progress', 'completed'].map((status) => (
              <div key={status} className="bg-white rounded-lg shadow">
                <div className="px-4 py-3 border-b bg-gray-50">
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {status.replace('-', ' ')} ({tasksByStatus[status].length})
                  </h3>
                </div>
                <div className="p-4 space-y-3 min-h-[400px]">
                  {tasksByStatus[status].map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onMove={handleTaskMove}
                      onEdit={(task) => {
                        setEditingTask(task);
                        setShowTaskModal(true);
                      }}
                      onDelete={handleDeleteTask}
                      canEdit={isOwner || task.assignedTo?._id === user?._id}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Team Members</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">{project.owner?.name}</p>
                  <p className="text-sm text-gray-600">{project.owner?.email}</p>
                </div>
                <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">Owner</span>
              </div>
              {project.teamMembers?.map((member) => (
                <div key={member._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">Member</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Status:</span> {project.status}</div>
                  <div><span className="font-medium">Created:</span> {new Date(project.createdAt).toLocaleDateString()}</div>
                  {project.startDate && <div><span className="font-medium">Start:</span> {new Date(project.startDate).toLocaleDateString()}</div>}
                  {project.endDate && <div><span className="font-medium">End:</span> {new Date(project.endDate).toLocaleDateString()}</div>}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Task Statistics</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Total Tasks:</span> {tasks.length}</div>
                  <div><span className="font-medium">To Do:</span> {tasksByStatus.todo.length}</div>
                  <div><span className="font-medium">In Progress:</span> {tasksByStatus['in-progress'].length}</div>
                  <div><span className="font-medium">Completed:</span> {tasksByStatus.completed.length}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          projectId={id}
          task={editingTask}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSuccess={() => {
            setShowTaskModal(false);
            setEditingTask(null);
            fetchProjectDetails();
          }}
        />
      )}
    </div>
  );
};

const TaskCard = ({ task, onMove, onEdit, onDelete, canEdit }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900">{task.title}</h4>
        {canEdit && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="text-gray-400 hover:text-gray-600">
              ⋮
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg z-10 border">
                <button
                  onClick={() => {
                    onEdit(task);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(task._id);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-1 rounded-full ${getPriorityBadge(task.priority)}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</span>
        )}
      </div>
      {task.assignedTo && (
        <div className="mt-2 text-xs text-gray-600">
          Assigned to: {task.assignedTo.name}
        </div>
      )}
      {canEdit && task.status !== 'completed' && (
        <div className="mt-2 flex gap-2">
          {task.status === 'todo' && (
            <button
              onClick={() => onMove(task._id, 'in-progress')}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Start
            </button>
          )}
          {task.status === 'in-progress' && (
            <button
              onClick={() => onMove(task._id, 'completed')}
              className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const TaskModal = ({ projectId, task, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (task) {
        await updateTask(task._id, formData);
      } else {
        await createTask({ ...formData, projectId: projectId });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{task ? 'Edit Task' : 'Create Task'}</h2>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                required
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const getStatusBadge = (status) => {
  const styles = {
    'planning': 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'on-hold': 'bg-gray-100 text-gray-800'
  };
  return styles[status] || 'bg-gray-100 text-gray-800';
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

export default ProjectDetails;
