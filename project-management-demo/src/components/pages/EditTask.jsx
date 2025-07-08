import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTask, updateTask, getProjects } from '../../utils/supabaseClient';
import Layout from '../templates/Layout';
import Card from '../atoms/Card';
import TaskForm from '../molecules/TaskForm';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch task
        const { data: taskData, error: taskError } = await getTask(id);
        
        if (taskError) {
          throw new Error(taskError.message);
        }
        
        if (!taskData || taskData.length === 0) {
          throw new Error('Task not found');
        }
        
        // Fetch projects for dropdown
        const { data: projectsData, error: projectsError } = await getProjects();
        
        if (projectsError) {
          throw new Error(projectsError.message);
        }
        
        setTask(taskData[0]);
        setProjects(projectsData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await updateTask(id, formData);
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      // Redirect to the task list or project detail
      if (formData.project_id) {
        navigate(`/projects/${formData.project_id}`);
      } else {
        navigate('/tasks');
      }
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (isLoading && !task) {
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

  if (error && !task) {
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
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Task</h1>
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
          <TaskForm 
            initialData={task}
            projects={projects}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isEditing={true}
          />
        </Card>
      </div>
    </Layout>
  );
};

export default EditTask;
