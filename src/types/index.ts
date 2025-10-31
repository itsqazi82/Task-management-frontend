export type UserRole = 'admin' | 'manager' | 'user';

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface User {
  _id: string;
  id: string;
  email: string;
  username: string;
  role: UserRole;
  managerId?: string | User;
  assignedUsers?: User[];
  createdAt: string;
  updatedAt?: string;
  __v?: number;
  password?: string;
}

export interface UsersResponse {
  users: User[];
  managers: User[];
}

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignedTo: string | { username: string; email: string };
  createdBy: string;
  creatorId?: { username: string; email: string };
  rating?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
