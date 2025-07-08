import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createTask, getProjects } from '../../utils/supabaseClient';
import Layout from '../templates/Layout';
import Card from '../atoms/Card';
import TaskForm from '../molecules/TaskForm';

const NewTask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);

  // Check if a project_id was passed in the location state
  const preselectedProjectId = location.state?.projectId || null;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error: fetchError } = await getProjects();
        
        if (fetchError) {
          throw new Error(fetchError.message);
        }
        
        setProjects(data || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
      } finally {
        setIsProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: createError } = await createTask(formData);
      
      if (createError) {
        throw new Error(createError.message);
      }
      
      // Redirect to the task detail page or back to the project
      if (formData.project_id) {
        navigate(`/projects/${formData.project_id}`);
      } else {
        navigate('/tasks');
      }
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Create New Task</h1>
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

        <Card>
          {isProjectsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <TaskForm 
              projects={projects}
              preselectedProjectId={preselectedProjectId}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default NewTask;
