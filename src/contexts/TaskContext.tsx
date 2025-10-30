import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskStatus } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByUser: (userId: string) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Mock initial tasks
const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Setup Project Repository',
    description: 'Initialize the project repository with proper structure',
    status: 'completed',
    dueDate: '2025-10-25',
    assignedTo: '3',
    createdBy: '2',
    createdAt: '2025-10-20T10:00:00Z',
    updatedAt: '2025-10-23T14:30:00Z',
  },
  {
    id: '2',
    title: 'Design System Implementation',
    description: 'Create a comprehensive design system with reusable components',
    status: 'in-progress',
    dueDate: '2025-11-05',
    assignedTo: '3',
    createdBy: '1',
    createdAt: '2025-10-22T09:00:00Z',
    updatedAt: '2025-10-28T11:00:00Z',
  },
  {
    id: '3',
    title: 'API Integration',
    description: 'Integrate backend APIs for task management',
    status: 'pending',
    dueDate: '2025-11-10',
    assignedTo: '2',
    createdBy: '1',
    createdAt: '2025-10-28T08:00:00Z',
    updatedAt: '2025-10-28T08:00:00Z',
  },
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Load tasks from localStorage or use initial tasks
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks(INITIAL_TASKS);
      localStorage.setItem('tasks', JSON.stringify(INITIAL_TASKS));
    }
  }, []);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    if (!user) return;

    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    toast.success('Task created successfully');
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    toast.success('Task updated successfully');
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    toast.success('Task deleted successfully');
  };

  const getTasksByUser = (userId: string) => {
    return tasks.filter(task => task.assignedTo === userId);
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, getTasksByUser }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
