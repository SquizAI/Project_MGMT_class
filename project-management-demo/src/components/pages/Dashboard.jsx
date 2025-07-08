import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, getTasks } from '../../utils/supabaseClient';
import Layout from '../templates/Layout';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import TaskList from '../organisms/TaskList';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch projects
        const { data: projectsData, error: projectsError } = await getProjects();
        if (projectsError) throw new Error(projectsError.message);
        
        // Fetch recent tasks
        const { data: tasksData, error: tasksError } = await getTasks();
        if (tasksError) throw new Error(tasksError.message);
        
        setProjects(projectsData || []);
        setTasks(tasksData || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get recent tasks (last 5)
  const recentTasks = tasks.slice(0, 5);

  // Count tasks by status
  const taskStatusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const statusLabels = {
    todo: 'To Do',
    in_progress: 'In Progress',
    review: 'Review',
    done: 'Done'
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">Dashboard</h1>
          <div className="flex space-x-3">
            <Link to="/projects/new">
              <Button>New Project</Button>
            </Link>
            <Link to="/tasks/new">
              <Button variant="secondary">New Task</Button>
            </Link>
          </div>
        </div>

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

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white">
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Total Projects</h3>
                  <p className="text-3xl font-bold text-blue-600">{projects.length}</p>
                </div>
              </Card>
              
              <Card className="bg-white">
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Total Tasks</h3>
                  <p className="text-3xl font-bold text-blue-600">{tasks.length}</p>
                </div>
              </Card>
              
              <Card className="bg-white">
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">In Progress</h3>
                  <p className="text-3xl font-bold text-purple-600">{taskStatusCounts.in_progress || 0}</p>
                </div>
              </Card>
              
              <Card className="bg-white">
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Completed</h3>
                  <p className="text-3xl font-bold text-green-600">{taskStatusCounts.done || 0}</p>
                </div>
              </Card>
            </div>

            {/* Task Status Breakdown */}
            <div className="mb-8">
              <Card title="Task Status">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(statusLabels).map(([status, label]) => (
                    <div key={status} className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
                      <div className="text-lg font-semibold">{label}</div>
                      <div className="text-2xl font-bold mt-2">{taskStatusCounts[status] || 0}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Recent Tasks */}
            <div className="mb-8">
              <Card 
                title="Recent Tasks" 
                footer={
                  <div className="text-right">
                    <Link to="/tasks" className="text-blue-600 hover:text-blue-800 font-medium">
                      View All Tasks
                    </Link>
                  </div>
                }
              >
                {recentTasks.length === 0 ? (
                  <p className="text-gray-500 py-4 text-center">No tasks found</p>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {recentTasks.map(task => (
                      <div key={task.id} className="py-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link to={`/tasks/${task.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                              {task.title}
                            </Link>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                              {task.description || 'No description'}
                            </p>
                          </div>
                          <span 
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              task.status === 'todo' ? 'bg-gray-100 text-gray-800' :
                              task.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                              task.status === 'review' ? 'bg-orange-100 text-orange-800' :
                              'bg-green-100 text-green-800'
                            }`}
                          >
                            {task.status === 'in_progress' ? 'In Progress' : 
                             task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Project Overview */}
            <div>
              <Card 
                title="Projects Overview" 
                footer={
                  <div className="text-right">
                    <Link to="/projects" className="text-blue-600 hover:text-blue-800 font-medium">
                      View All Projects
                    </Link>
                  </div>
                }
              >
                {projects.length === 0 ? (
                  <div className="py-4 text-center">
                    <p className="text-gray-500 mb-4">No projects found</p>
                    <Link to="/projects/new">
                      <Button>Create Your First Project</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {projects.slice(0, 5).map(project => (
                      <div key={project.id} className="py-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link to={`/projects/${project.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                              {project.name}
                            </Link>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                              {project.description || 'No description'}
                            </p>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {tasks.filter(task => task.project_id === project.id).length} Tasks
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
