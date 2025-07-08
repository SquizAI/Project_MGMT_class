import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProject, getTasks, deleteProject, deleteTask } from '../../utils/supabaseClient';
import Layout from '../templates/Layout';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import TaskList from '../organisms/TaskList';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch project details
      const { data: projectData, error: projectError } = await getProject(id);
      if (projectError) throw new Error(projectError.message);
      
      if (!projectData || projectData.length === 0) {
        throw new Error('Project not found');
      }
      
      // Fetch tasks for this project
      const { data: tasksData, error: tasksError } = await getTasks(id);
      if (tasksError) throw new Error(tasksError.message);
      
      setProject(projectData[0]);
      setTasks(tasksData || []);
    } catch (err) {
      console.error('Error fetching project data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      return;
    }
    
    try {
      const { error: deleteError } = await deleteProject(id);
      if (deleteError) throw new Error(deleteError.message);
      
      // Redirect to projects list
      navigate('/projects');
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      const { error: deleteError } = await deleteTask(taskId);
      if (deleteError) throw new Error(deleteError.message);
      
      // Refresh tasks list
      fetchData();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message);
    }
  };

  // Calculate task statistics
  const taskStats = tasks.reduce((stats, task) => {
    stats.total++;
    stats[task.status] = (stats[task.status] || 0) + 1;
    return stats;
  }, { total: 0, todo: 0, in_progress: 0, review: 0, done: 0 });

  const progressPercentage = taskStats.total > 0 
    ? Math.round((taskStats.done / taskStats.total) * 100) 
    : 0;

  if (isLoading && !project) {
    return (
      <Layout>
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !project) {
    return (
      <Layout>
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Project Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{project?.name}</h1>
            <p className="text-gray-600 mt-1">{project?.description || 'No description'}</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Link to={`/projects/${id}/edit`}>
              <Button variant="secondary">Edit Project</Button>
            </Link>
            <Button variant="danger" onClick={handleDeleteProject}>Delete Project</Button>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white">
            <div className="flex flex-col">
              <h3 className="text-lg font-medium text-gray-900 mb-1">Total Tasks</h3>
              <p className="text-3xl font-bold text-blue-600">{taskStats.total}</p>
            </div>
          </Card>
          
          <Card className="bg-white">
            <div className="flex flex-col">
              <h3 className="text-lg font-medium text-gray-900 mb-1">In Progress</h3>
              <p className="text-3xl font-bold text-purple-600">{taskStats.in_progress}</p>
            </div>
          </Card>
          
          <Card className="bg-white">
            <div className="flex flex-col">
              <h3 className="text-lg font-medium text-gray-900 mb-1">Completed</h3>
              <p className="text-3xl font-bold text-green-600">{taskStats.done}</p>
            </div>
          </Card>
          
          <Card className="bg-white">
            <div className="flex flex-col">
              <h3 className="text-lg font-medium text-gray-900 mb-1">Progress</h3>
              <div className="flex items-center">
                <p className="text-3xl font-bold text-blue-600">{progressPercentage}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tasks Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
            <Link 
              to="/tasks/new" 
              state={{ projectId: id }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Task
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <TaskList 
              tasks={tasks} 
              onDelete={handleDeleteTask}
              isLoading={false}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
