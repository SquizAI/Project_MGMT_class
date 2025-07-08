// Netlify serverless function for OpenAI chat with structured responses
import OpenAI from 'openai';

// Define the response schema for structured outputs
const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    taskSuggestion: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        priority: { type: "string", enum: ["Low", "Medium", "High"] },
        estimatedHours: { type: "number" }
      },
      required: ["title", "description", "priority"]
    },
    answer: {
      type: "string",
      description: "A helpful response to the user's question"
    }
  },
  required: ["answer"]
};

export async function handler(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    // Parse the request body
    const { message, projectContext } = JSON.parse(event.body);
    
    // Validate required fields
    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is required" })
      };
    }
    
    console.log('Received message:', message);
    console.log('Project context:', projectContext);

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Create system message with context about the project management app
    const systemMessage = `You are an AI assistant for a project management application. 
    Help users manage their projects and tasks efficiently. 
    If the user's message implies creating a task, include a taskSuggestion in your response.
    ${projectContext ? `Current project context: ${projectContext}` : ''}`;

    // Call OpenAI API with instructions to return JSON
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `${systemMessage}\n\nYou MUST respond with a valid JSON object that follows this structure:\n{\n  "answer": "Your helpful response here",\n  "taskSuggestion": {\n    "title": "Task title if applicable",\n    "description": "Task description if applicable",\n    "priority": "Low|Medium|High"\n  }\n}\n\nThe taskSuggestion field is optional and should only be included if the user's message implies creating a task.`
        },
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" }
    });

    // Return the structured response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        response: response.choices[0].message.content
      })
    };
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Error processing your request",
        details: error.message
      })
    };
  }
}
