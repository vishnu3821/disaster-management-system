import { User } from '../contexts/AuthContext';

// Use production Railway URL or fallback to localhost for development
const API_BASE = (import.meta.env.VITE_API_URL as string) || 
  (import.meta.env.PROD ? 'https://disaster-management-system-production.up.railway.app/api' : 'http://localhost:5001/api');

type LoginResponse = { success: boolean; token: string; user: any };
type RegisterResponse = { success: boolean; token: string; user: any };

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const toClientUser = (raw: any): User => ({
  id: String(raw.id),
  name: raw.name,
  email: raw.email,
  role: raw.role,
  location: raw.location,
  phone: raw.phone,
  skills: raw.skills,
});

export const mockLogin = async (email: string, password: string): Promise<User> => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Invalid email or password');
  const data: LoginResponse = await res.json();
  localStorage.setItem('token', data.token);
  const user = toClientUser(data.user);
  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
};

export const mockRegister = async (
  name: string,
  email: string,
  password: string,
  role: 'user' | 'volunteer'
): Promise<User> => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Registration failed');
  }
  const data: RegisterResponse = await res.json();
  localStorage.setItem('token', data.token);
  const user = toClientUser(data.user);
  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
};

export const mockLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  return true;
};

export const mockDeleteUser = async (userId: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/auth/users/${userId}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
  if (!res.ok) throw new Error('Failed to delete user');
};

export const mockUpdateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
  const res = await fetch(`${API_BASE}/auth/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update user');
  const data = await res.json();
  return toClientUser(data.user);
};

export const mockGetAllUsers = async (): Promise<User[]> => {
  const res = await fetch(`${API_BASE}/auth/users`, {
    headers: { ...getAuthHeaders() }
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  const data = await res.json();
  return (data.users || []).map((u: any) => toClientUser(u));
};