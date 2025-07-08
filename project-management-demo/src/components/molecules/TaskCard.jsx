import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../atoms/Card';
import Button from '../atoms/Button';

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-purple-100 text-purple-800',
  review: 'bg-orange-100 text-orange-800',
  done: 'bg-green-100 text-green-800',
};

const TaskCard = ({ task, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card className="h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-900 truncate">{task.title}</h3>
        <div className="flex space-x-1">
          <span 
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityColors[task.priority] || priorityColors.medium}`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          <span 
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColors[task.status] || statusColors.todo}`}
          >
            {task.status === 'in_progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {task.description || 'No description provided'}
      </p>
      
      {task.due_date && (
        <div className="text-xs text-gray-500 mb-4">
          Due: {formatDate(task.due_date)}
        </div>
      )}
      
      <div className="flex justify-between mt-auto pt-2">
        <Link to={`/tasks/${task.id}`}>
          <Button size="sm" variant="secondary">View Details</Button>
        </Link>
        <Button 
          size="sm" 
          variant="danger" 
          onClick={() => onDelete(task.id)}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default TaskCard;
