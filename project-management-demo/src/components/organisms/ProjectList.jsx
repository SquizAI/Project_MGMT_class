import React from 'react';
import ProjectCard from '../molecules/ProjectCard';

const ProjectList = ({ projects = [], taskCounts = {}, onDelete, isLoading = false }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Projects ({projects.length})
      </h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600">
            Get started by creating your first project
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              taskCount={taskCounts[project.id] || 0}
              onDelete={onDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
