import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../../utils/supabaseClient';
import Layout from '../templates/Layout';
import Card from '../atoms/Card';
import ProjectForm from '../molecules/ProjectForm';

const NewProject = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: createError } = await createProject(formData);
      
      if (createError) {
        throw new Error(createError.message);
      }
      
      // Redirect to the project detail page
      navigate(`/projects/${data[0].id}`);
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Create New Project</h1>
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
          <ProjectForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </Card>
      </div>
    </Layout>
  );
};

export default NewProject;
