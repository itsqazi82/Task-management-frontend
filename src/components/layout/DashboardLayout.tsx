import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  ListTodo, 
  Users, 
  LogOut,
  CheckSquare 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    const baseLinks = [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/tasks', icon: ListTodo, label: 'My Tasks' },
    ];

    if (user?.role === 'admin') {
      baseLinks.push({ to: '/users', icon: Users, label: 'Manage Users' });
      baseLinks.push({ to: '/all-tasks', icon: CheckSquare, label: 'All Tasks' });
    } else if (user?.role === 'manager') {
      baseLinks.push({ to: '/team-tasks', icon: CheckSquare, label: 'Team Tasks' });
    }

    return baseLinks;
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
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-sidebar-border px-6">
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-semibold text-sidebar-foreground">
              TaskManager
            </span>
          </div>

          {/* User Info */}
          <div className="border-b border-sidebar-border p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name}
                </p>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getRoleBadgeColor(user?.role || '')}`}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {getNavLinks().map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="border-t border-sidebar-border p-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
