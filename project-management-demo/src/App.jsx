import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Dashboard from './components/pages/Dashboard';
import Projects from './components/pages/Projects';
import ProjectDetail from './components/pages/ProjectDetail';
import NewProject from './components/pages/NewProject';
import EditProject from './components/pages/EditProject';
import Tasks from './components/pages/Tasks';
import TaskDetail from './components/pages/TaskDetail';
import NewTask from './components/pages/NewTask';
import EditTask from './components/pages/EditTask';
import Login from './components/pages/Login';
import Register from './components/pages/Register';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/projects" element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          } />
          
          <Route path="/projects/:id" element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          } />
          
          <Route path="/projects/new" element={
            <ProtectedRoute>
              <NewProject />
            </ProtectedRoute>
          } />
          
          <Route path="/projects/:id/edit" element={
            <ProtectedRoute>
              <EditProject />
            </ProtectedRoute>
          } />
          
          <Route path="/tasks" element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          } />
          
          <Route path="/tasks/:id" element={
            <ProtectedRoute>
              <TaskDetail />
            </ProtectedRoute>
          } />
          
          <Route path="/tasks/new" element={
            <ProtectedRoute>
              <NewTask />
            </ProtectedRoute>
          } />
          
          <Route path="/tasks/:id/edit" element={
            <ProtectedRoute>
              <EditTask />
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
