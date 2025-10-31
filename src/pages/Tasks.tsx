import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '@/types';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://task-management-backend-production-8391.up.railway.app/api/tasks/my-tasks', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data.tasks || []);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyTasks();
    }
  }, [user]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleSubmit = async (taskData: Partial<Task>) => {
    try {
      const token = localStorage.getItem('authToken');
      const method = editingTask ? 'PUT' : 'POST';
      const url = editingTask
        ? `http://task-management-backend-production-8391.up.railway.app/api/tasks/my-task/${editingTask._id}`
        : 'http://task-management-backend-production-8391.up.railway.app/api/tasks/my-task';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          dueDate: taskData.dueDate,
          priority: taskData.priority,
          status: taskData.status,
        }),
      });

      if (response.ok) {
        // Refresh tasks list
        const fetchResponse = await fetch('http://task-management-backend-production-8391.up.railway.app/api/tasks/my-tasks', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (fetchResponse.ok) {
          const data = await fetchResponse.json();
          setTasks(data.tasks || []);
        }
        setIsFormOpen(false);
        setEditingTask(undefined);
      } else {
        console.error(`Failed to ${editingTask ? 'update' : 'create'} task`);
      }
    } catch (error) {
      console.error(`Error ${editingTask ? 'updating' : 'creating'} task:`, error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://task-management-backend-production-8391.up.railway.app/api/tasks/my-task/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Refresh tasks list
        const fetchResponse = await fetch('http://task-management-backend-production-8391.up.railway.app/api/tasks/my-tasks', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (fetchResponse.ok) {
          const data = await fetchResponse.json();
          setTasks(data.tasks || []);
        }
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your assigned tasks
            </p>
          </div>
          <Button onClick={handleAddTask}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        )}

        <TaskForm
          task={editingTask}
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  );
};

export default Tasks;
