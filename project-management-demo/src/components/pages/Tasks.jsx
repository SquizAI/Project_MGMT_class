import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, deleteTask, getProjects } from '../../utils/supabaseClient';
import Layout from '../templates/Layout';
import Button from '../atoms/Button';
import TaskList from '../organisms/TaskList';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState('all');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch projects for filtering
      const { data: projectsData, error: projectsError } = await getProjects();
      if (projectsError) throw new Error(projectsError.message);
      
      // Fetch tasks
      const { data: tasksData, error: tasksError } = await getTasks(
        selectedProject !== 'all' ? selectedProject : null
      );
      if (tasksError) throw new Error(tasksError.message);
      
      setProjects(projectsData || []);
      setTasks(tasksData || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedProject]);

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      const { error: deleteError } = await deleteTask(id);
      if (deleteError) throw new Error(deleteError.message);
      
      // Refresh tasks list
      fetchData();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">Tasks</h1>
          <Link to="/tasks/new">
            <Button>New Task</Button>
          </Link>
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

        {/* Project filter */}
        <div className="mb-6">
          <label htmlFor="project-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Project
          </label>
          <select
            id="project-filter"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="mt-1 block w-full md:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <TaskList 
          tasks={tasks} 
          onDelete={handleDeleteTask}
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
};

export default Tasks;
