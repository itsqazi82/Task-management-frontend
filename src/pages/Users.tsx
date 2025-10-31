  import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, UserPlus, Edit, Trash2, UserCheck } from 'lucide-react';
import { User, UserRole, UsersResponse } from '@/types';
import { toast } from 'sonner';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' as UserRole,
  });
  const [assignData, setAssignData] = useState({
    userId: '',
    managerId: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://task-management-backend-production-8391.up.railway.app/api/admin/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: UsersResponse = await response.json();
        // Combine users and managers, ensuring no duplicates
        const allUsers = [...data.users, ...data.managers].filter((user, index, self) =>
          index === self.findIndex(u => u._id === user._id)
        );
        // Map _id to id for compatibility
        const mappedUsers = allUsers.map(user => ({
          ...user,
          id: user._id,
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://task-management-backend-production-8391.up.railway.app/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('User created successfully');
        setIsCreateDialogOpen(false);
        setFormData({
          username: '',
          email: '',
          password: '',
          role: 'user',
        });
        fetchUsers(); // Refresh the list
      } else {
        toast.error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error creating user');
    }
  };

  const handleAssignManager = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://task-management-backend-production-8391.up.railway.app/api/admin/assign-manager', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignData),
      });

      if (response.ok) {
        toast.success('Manager assigned successfully');
        setIsAssignDialogOpen(false);
        setAssignData({ userId: '', managerId: '' });
        fetchUsers(); // Refresh the list
      } else {
        toast.error('Failed to assign manager');
      }
    } catch (error) {
      console.error('Error assigning manager:', error);
      toast.error('Error assigning manager');
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://task-management-backend-production-8391.up.railway.app/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        toast.success('User updated successfully');
        fetchUsers(); // Refresh the list
      } else {
        toast.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://task-management-backend-production-8391.up.railway.app/api/admin/delete-user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('User deleted successfully');
        fetchUsers(); // Refresh the list
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
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
            <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage user accounts
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create User
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{user.username}</CardTitle>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.managerId && typeof user.managerId === 'object' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Manager: {user.managerId.username}
                  </p>
                )}
                {user.managerId && typeof user.managerId === 'string' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Manager: {users.find(u => u.id === user.managerId)?.username || 'Unknown'}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Created: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                {user.role === 'user' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsAssignDialogOpen(true);
                    }}
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Assign Manager
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {user.username}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Assign Manager Dialog */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Manager</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAssignManager} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="user">User</Label>
                <Select
                  value={assignData.userId}
                  onValueChange={(value) => setAssignData({ ...assignData, userId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.filter(u => u.role === 'user').map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="manager">Manager</Label>
                <Select
                  value={assignData.managerId}
                  onValueChange={(value) => setAssignData({ ...assignData, managerId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.filter(u => u.role === 'manager').map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                <UserCheck className="mr-2 h-4 w-4" />
                Assign Manager
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No users found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Users;
