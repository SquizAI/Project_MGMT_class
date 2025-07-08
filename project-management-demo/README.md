# Project Management Demo

<div align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</div>

<p align="center">
  <img src="https://via.placeholder.com/800x400?text=Project+Management+Demo" alt="Project Management Demo" width="800" />
</p>

## 📋 Overview

A modern, responsive project management application built with React, Supabase, and Tailwind CSS. This application demonstrates best practices in web development, including atomic design principles, secure authentication, and serverless architecture.

The app allows users to create and manage projects and tasks, track progress, and collaborate effectively. It's designed to showcase advanced project management techniques while maintaining a clean, intuitive user interface.

## ✨ Features

- **User Authentication** - Secure login and registration with Supabase Auth
- **Project Management** - Create, update, and delete projects
- **Task Management** - Create tasks with priorities, due dates, and status tracking
- **Dashboard** - Visual overview of projects and tasks with progress metrics
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Row Level Security** - Data protection with Supabase RLS policies
- **Environment Variable Management** - Secure configuration for deployment

## 🛠️ Tech Stack

- **Frontend:**
  - React (with Hooks and Context API)
  - React Router for navigation
  - Tailwind CSS for styling
  - Atomic Design methodology for component structure

- **Backend:**
  - Supabase for database, authentication, and storage
  - Netlify Functions for serverless operations
  - Row Level Security for data protection

- **Deployment:**
  - Netlify for hosting and CI/CD
  - Environment variables for configuration

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account
- Netlify account (for deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SquizAI/Project_MGMT_class.git
   cd Project_MGMT_class/project-management-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=http://localhost:8888/.netlify/functions
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
project-management-demo/
├── public/                  # Static assets
├── src/
│   ├── components/          # React components using Atomic Design
│   │   ├── atoms/           # Basic building blocks (Button, Input, Card)
│   │   ├── molecules/       # Groups of atoms (TaskForm, ProjectCard)
│   │   ├── organisms/       # Groups of molecules (TaskList, ProjectList)
│   │   ├── templates/       # Page layouts (Layout)
│   │   └── pages/           # Full pages (Dashboard, Projects, Tasks)
│   ├── contexts/            # React contexts (AuthContext)
│   ├── utils/               # Utility functions
│   │   └── supabaseClient.js # Supabase client and CRUD operations
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles with Tailwind
├── netlify/
│   └── functions/           # Netlify serverless functions
├── .env                     # Environment variables (gitignored)
├── netlify.toml             # Netlify configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Project dependencies and scripts
```

## 🔒 Security

- Authentication is handled by Supabase Auth
- Row Level Security (RLS) policies protect data access
- Environment variables secure sensitive information
- HTTPS enforced for all communications

## 🚢 Deployment

### Deploying to Netlify

1. **Prepare your repository**
   - Ensure all environment variables are properly set up in `.env.example`
   - Make sure `.env` is in your `.gitignore` file
   - Commit all changes to your repository

2. **Connect to Netlify**
   - Log in to your Netlify account
   - Click "New site from Git"
   - Select your repository

3. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Show advanced" and add your environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Deploy the site**
   - Click "Deploy site"
   - Wait for the build to complete

5. **Set up continuous deployment**
   - Netlify will automatically deploy when changes are pushed to your main branch
   - You can configure branch deploys in the Netlify dashboard

### Environment Variables

For security, never commit your actual environment variables to the repository. Instead:

1. Use `.env.example` to document required variables
2. Set up environment variables in the Netlify dashboard
3. For local development, create a `.env` file (which is gitignored)

## 📝 Development Roadmap

- [x] Project setup with React and Vite
- [x] Supabase integration for backend
- [x] Authentication system
- [x] Atomic design component structure
- [x] Project and task management features
- [x] Dashboard with statistics
- [ ] Email notifications
- [ ] Team collaboration features
- [ ] Advanced reporting
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- [Supabase](https://supabase.io/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [React](https://reactjs.org/) for the frontend library
- [Netlify](https://www.netlify.com/) for hosting and serverless functions
