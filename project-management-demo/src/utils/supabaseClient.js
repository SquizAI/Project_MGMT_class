import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user, error };
};

// Project helpers
export const getProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createProject = async (project) => {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select();
  return { data, error };
};

export const updateProject = async (id, updates) => {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date() })
    .eq('id', id)
    .select();
  return { data, error };
};

export const getProject = async (id) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

export const deleteProject = async (id) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  return { error };
};

// Task helpers
export const getTasks = async (projectId = null) => {
  let query = supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (projectId) {
    query = query.eq('project_id', projectId);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const createTask = async (task) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select();
  return { data, error };
};

export const updateTask = async (id, updates) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...updates, updated_at: new Date() })
    .eq('id', id)
    .select();
  return { data, error };
};

export const getTask = async (id) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

export const deleteTask = async (id) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  return { error };
};
