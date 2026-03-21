import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  fetchTasks, createTask, updateTask, deleteTask, updateTaskStatus,
} from '../utils/api';
import toast from 'react-hot-toast';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTasks = useCallback(async (projectId) => {
    setLoading(true);
    try {
      const res = await fetchTasks(projectId);
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (data) => {
    const res = await createTask(data);
    setTasks((prev) => [...prev, res.data.task]);
    toast.success('Task created!');
    return res.data.task;
  };

  const editTask = async (id, data) => {
    const res = await updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data.task : t)));
    toast.success('Task updated!');
    return res.data.task;
  };

  const removeTask = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    toast.success('Task deleted');
  };

  const moveTask = async (id, status, order) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status, order } : t))
    );
    try {
      await updateTaskStatus(id, { status, order });
    } catch (err) {
      toast.error('Failed to move task');
      // Could revert here if needed
    }
  };

  const getTasksByStatus = (status) =>
    tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order);

  return (
    <TaskContext.Provider value={{
      tasks, loading,
      loadTasks, addTask, editTask, removeTask, moveTask, getTasksByStatus,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
