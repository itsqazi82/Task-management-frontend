import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TaskContext';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '@/types';

const Tasks = () => {
  const { user } = useAuth();
  const { tasks, addTask, updateTask, deleteTask, getTasksByUser } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  const myTasks = user ? getTasksByUser(user.id) : [];

  const filteredTasks = myTasks.filter((task) => {
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

  const handleSubmit = (taskData: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask({
        ...taskData,
        assignedTo: user?.id || '',
      } as Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>);
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
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={deleteTask}
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
