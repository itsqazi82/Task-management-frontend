export type UserRole = 'admin' | 'manager' | 'user';

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  managerId?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
