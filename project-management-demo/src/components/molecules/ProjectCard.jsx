import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../atoms/Card';
import Button from '../atoms/Button';

const ProjectCard = ({ project, taskCount = 0, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card className="h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
          {taskCount} {taskCount === 1 ? 'Task' : 'Tasks'}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {project.description || 'No description provided'}
      </p>
      
      <div className="text-xs text-gray-500 mb-4">
        Created: {formatDate(project.created_at)}
      </div>
      
      <div className="flex justify-between mt-auto pt-2">
        <Link to={`/projects/${project.id}`}>
          <Button size="sm" variant="secondary">View Details</Button>
        </Link>
        <Button 
          size="sm" 
          variant="danger" 
          onClick={() => onDelete(project.id)}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default ProjectCard;
