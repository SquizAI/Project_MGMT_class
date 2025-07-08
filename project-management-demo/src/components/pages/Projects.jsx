import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, deleteProject, getTasks } from '../../utils/supabaseClient';
import Layout from '../templates/Layout';
import Button from '../atoms/Button';
import ProjectList from '../organisms/ProjectList';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch projects
      const { data: projectsData, error: projectsError } = await getProjects();
      if (projectsError) throw new Error(projectsError.message);
      
      // Fetch tasks to count by project
      const { data: tasksData, error: tasksError } = await getTasks();
      if (tasksError) throw new Error(tasksError.message);
      
      // Calculate task counts by project
      const counts = {};
      if (tasksData) {
        tasksData.forEach(task => {
          if (task.project_id) {
            counts[task.project_id] = (counts[task.project_id] || 0) + 1;
          }
        });
      }
      
      setProjects(projectsData || []);
      setTaskCounts(counts);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      return;
    }
    
    try {
      const { error: deleteError } = await deleteProject(id);
      if (deleteError) throw new Error(deleteError.message);
      
      // Refresh projects list
      fetchData();
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err.message);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">Projects</h1>
          <Link to="/projects/new">
            <Button>New Project</Button>
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

        <ProjectList 
          projects={projects} 
          taskCounts={taskCounts}
          onDelete={handleDeleteProject}
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
};

export default Projects;
