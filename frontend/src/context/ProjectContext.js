import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  fetchProjects, fetchProject, createProject,
  updateProject, deleteProject, addMember,
} from '../utils/api';
import toast from 'react-hot-toast';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchProjects();
      setProjects(res.data.projects);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProject = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await fetchProject(id);
      setCurrentProject(res.data.project);
      return res.data.project;
    } catch (err) {
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewProject = async (data) => {
    const res = await createProject(data);
    setProjects((prev) => [res.data.project, ...prev]);
    toast.success('Project created!');
    return res.data.project;
  };

  const updateExistingProject = async (id, data) => {
    const res = await updateProject(id, data);
    setProjects((prev) => prev.map((p) => (p._id === id ? res.data.project : p)));
    if (currentProject?._id === id) setCurrentProject(res.data.project);
    toast.success('Project updated!');
    return res.data.project;
  };

  const removeProject = async (id) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p._id !== id));
    toast.success('Project deleted');
  };

  const addProjectMember = async (id, data) => {
    const res = await addMember(id, data);
    if (currentProject?._id === id) setCurrentProject(res.data.project);
    toast.success('Member added!');
    return res.data.project;
  };

  return (
    <ProjectContext.Provider value={{
      projects, currentProject, loading,
      loadProjects, loadProject,
      createNewProject, updateExistingProject, removeProject, addProjectMember,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);
