import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Clock, ListTodo, Users } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    {
      title: 'Total Tasks',
      value: 0,
      icon: ListTodo,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'In Progress',
      value: 0,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Completed',
      value: 0,
      icon: CheckSquare,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Pending',
      value: 0,
      icon: Users,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/tasks/dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats([
            {
              title: 'Total Tasks',
              value: data['Total Tasks'] || 0,
              icon: ListTodo,
              color: 'text-primary',
              bgColor: 'bg-primary/10',
            },
            {
              title: 'In Progress',
              value: data['In Progress'] || 0,
              icon: Clock,
              color: 'text-warning',
              bgColor: 'bg-warning/10',
            },
            {
              title: 'Completed',
              value: data.Completed || 0,
              icon: CheckSquare,
              color: 'text-success',
              bgColor: 'bg-success/10',
            },
            {
              title: 'Pending',
              value: data.Pending || 0,
              icon: Users,
              color: 'text-muted-foreground',
              bgColor: 'bg-muted',
            },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.username}!
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
