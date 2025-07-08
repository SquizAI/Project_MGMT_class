import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTask, deleteTask, getProject, updateTask } from '../../utils/supabaseClient';
import Layout from '../templates/Layout';
import Card from '../atoms/Card';
import Button from '../atoms/Button';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch task details
        const { data: taskData, error: taskError } = await getTask(id);
        if (taskError) throw new Error(taskError.message);
        
        if (!taskData || taskData.length === 0) {
          throw new Error('Task not found');
        }
        
        setTask(taskData[0]);
        
        // If task has a project, fetch project details
        if (taskData[0].project_id) {
          const { data: projectData, error: projectError } = await getProject(taskData[0].project_id);
          if (projectError) throw new Error(projectError.message);
          
          if (projectData && projectData.length > 0) {
            setProject(projectData[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching task data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      const { error: deleteError } = await deleteTask(id);
      if (deleteError) throw new Error(deleteError.message);
      
      // Redirect to tasks list or project detail
      if (task.project_id) {
        navigate(`/projects/${task.project_id}`);
      } else {
        navigate('/tasks');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const { error: updateError } = await updateTask(id, { status: newStatus });
      if (updateError) throw new Error(updateError.message);
      
      // Update local state
      setTask(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error('Error updating task status:', err);
      setError(err.message);
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

  // Status badge color mapping
  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-purple-100 text-purple-800',
    review: 'bg-orange-100 text-orange-800',
    done: 'bg-green-100 text-green-800'
  };

  // Priority badge color mapping
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  // Format status for display
  const formatStatus = (status) => {
    return status === 'in_progress' ? 'In Progress' : 
           status.charAt(0).toUpperCase() + status.slice(1);
  };

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

        {/* Task Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{task?.title}</h1>
            {project && (
              <Link to={`/projects/${project.id}`} className="text-blue-600 hover:text-blue-800">
                {project.name}
              </Link>
            )}
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Link to={`/tasks/${id}/edit`}>
              <Button variant="secondary">Edit Task</Button>
            </Link>
            <Button variant="danger" onClick={handleDeleteTask}>Delete Task</Button>
          </div>
        </div>

        {/* Task Details */}
        <Card className="mb-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {task?.description || 'No description provided'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Status</h3>
                <div className="flex flex-wrap gap-2">
                  {['todo', 'in_progress', 'review', 'done'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                        task?.status === status 
                          ? statusColors[status] + ' ring-2 ring-offset-2 ring-blue-500' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {formatStatus(status)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Priority</h3>
                <span 
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${priorityColors[task?.priority || 'medium']}`}
                >
                  {task?.priority?.charAt(0).toUpperCase() + task?.priority?.slice(1) || 'Medium'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Due Date</h3>
                <p className="text-gray-700">
                  {task?.due_date 
                    ? new Date(task.due_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) 
                    : 'No due date'}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Created</h3>
                <p className="text-gray-700">
                  {task?.created_at 
                    ? new Date(task.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) 
                    : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default TaskDetail;
