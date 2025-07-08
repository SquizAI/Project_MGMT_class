import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getProject } from '../../utils/supabaseClient';

const AIAssistant = ({ onCreateTask }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projectContext, setProjectContext] = useState(null);
  const chatContainerRef = useRef(null);
  const { projectId } = useParams();
  const { user } = useAuth();

  // Fetch project details if projectId is available
  useEffect(() => {
    const loadProjectContext = async () => {
      if (projectId) {
        try {
          const project = await getProject(projectId);
          if (project) {
            setProjectContext({
              id: project.id,
              name: project.name,
              description: project.description,
              status: project.status,
              deadline: project.deadline
            });
          }
        } catch (error) {
          console.error("Error loading project context:", error);
        }
      }
    };

    loadProjectContext();
  }, [projectId]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    
    // Clear input
    setMessage('');
    setError(null);
    setIsLoading(true);
    
    try {
      // Call the Netlify function
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          projectContext: projectContext ? JSON.stringify(projectContext) : null,
          userId: user?.id
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const aiResponse = JSON.parse(data.response);
      
      // Add AI response to chat
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse.answer,
        taskSuggestion: aiResponse.taskSuggestion 
      }]);
      
      // If there's a task suggestion, offer to create it
      if (aiResponse.taskSuggestion && onCreateTask) {
        // Pass the task suggestion to the parent component
        onCreateTask(aiResponse.taskSuggestion);
      }
      
    } catch (err) {
      console.error('Error calling AI assistant:', err);
      setError('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[500px]">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="text-lg font-medium">AI Assistant</h3>
        {projectContext && (
          <p className="text-sm text-blue-100">
            Project: {projectContext.name}
          </p>
        )}
      </div>
      
      {/* Chat messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {/* Welcome message */}
        {chatHistory.length === 0 && (
          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
            <p className="text-gray-700">
              Hi there! I'm your project management assistant. How can I help you today?
            </p>
          </div>
        )}
        
        {/* Chat messages */}
        {chatHistory.map((msg, index) => (
          <div 
            key={index} 
            className={`${
              msg.role === 'user' 
                ? 'ml-auto bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700'
            } rounded-lg p-3 max-w-[80%]`}
          >
            <p>{msg.content}</p>
            
            {/* Task suggestion UI */}
            {msg.taskSuggestion && (
              <div className="mt-2 p-2 bg-white rounded border border-blue-200">
                <p className="font-medium text-blue-700">Task Suggestion:</p>
                <p className="text-sm">{msg.taskSuggestion.title}</p>
                <div className="flex justify-end mt-1">
                  <button 
                    onClick={() => onCreateTask(msg.taskSuggestion)}
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    Create Task
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded">
            {error}
          </div>
        )}
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="border-t p-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a question or describe a task..."
          className="flex-1 border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;
