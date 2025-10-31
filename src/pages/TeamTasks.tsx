import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users } from 'lucide-react';
import { Task, TaskStatus, User } from '@/types';
import { toast } from 'sonner';

const TeamTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'manager') {
      fetchTeamMembers();
      fetchTeamTasks();
    }
  }, [user]);

  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/admin/my-team', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Map _id to id for compatibility
        const mappedUsers = (data.users || []).map((user: any) => ({
          ...user,
          id: user._id,
        }));
        setTeamMembers(mappedUsers);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  };

  const fetchTeamTasks = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/tasks/my-team-tasks', {
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
      console.error('Failed to fetch team tasks:', error);
    } finally {
      setLoading(false);
    }
  };

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
        ? `http://localhost:5000/api/tasks/team-task/${editingTask._id}`
        : 'http://localhost:5000/api/tasks/team-task';

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
          assignedTo: taskData.assignedTo,
        }),
      });

      if (response.ok) {
        toast.success(`Team task ${editingTask ? 'updated' : 'created'} successfully`);
        setIsFormOpen(false);
        setEditingTask(undefined);
        fetchTeamTasks(); // Refresh the list
      } else {
        toast.error(`Failed to ${editingTask ? 'update' : 'create'} team task`);
      }
    } catch (error) {
      console.error(`Error ${editingTask ? 'updating' : 'creating'} team task:`, error);
      toast.error(`Error ${editingTask ? 'updating' : 'creating'} team task`);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/tasks/team-task/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Team task deleted successfully');
        fetchTeamTasks(); // Refresh the list
      } else {
        toast.error('Failed to delete team task');
      }
    } catch (error) {
      console.error('Error deleting team task:', error);
      toast.error('Error deleting team task');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-admin/10 text-admin border-admin/20';
      case 'manager':
        return 'bg-manager/10 text-manager border-manager/20';
      default:
        return 'bg-user/10 text-user border-user/20';
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Tasks</h1>
            <p className="text-muted-foreground mt-1">
              Manage tasks for your team members
            </p>
          </div>
          <Button onClick={handleAddTask}>
            <Plus className="mr-2 h-4 w-4" />
            New Team Task
          </Button>
        </div>

        {/* Team Members Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Users className="mr-2 h-5 w-5" />
            My Team ({teamMembers.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{member.username}</CardTitle>
                    <Badge className={getRoleBadgeColor(member.role)}>
                      {member.role}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Tasks Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Team Tasks</h2>
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
              />
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No team tasks found</p>
            </div>
          )}
        </div>

        <TaskForm
          task={editingTask}
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          teamMembers={teamMembers}
          isTeamTask={true}
        />
      </div>
    </DashboardLayout>
  );
};

export default TeamTasks;
