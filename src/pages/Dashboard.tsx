import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Clock, ListTodo, Users } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, getTasksByUser } = useTasks();

  const myTasks = user ? getTasksByUser(user.id) : [];
  const completedTasks = myTasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = myTasks.filter(t => t.status === 'in-progress').length;
  const pendingTasks = myTasks.filter(t => t.status === 'pending').length;

  const stats = [
    {
      title: 'Total Tasks',
      value: myTasks.length,
      icon: ListTodo,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckSquare,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: Users,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your tasks
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-full p-2 ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {user?.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Total Tasks in System: <span className="font-semibold text-foreground">{tasks.length}</span>
                </p>
                <p className="text-muted-foreground">
                  You have full access to manage users and all tasks in the system.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {user?.role === 'manager' && (
          <Card>
            <CardHeader>
              <CardTitle>Manager Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  You can manage your tasks and tasks assigned to your team members.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
