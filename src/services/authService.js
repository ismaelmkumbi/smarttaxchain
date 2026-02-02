// src/services/authService.js
import api from './api';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

const storeUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const login = async (email, password) => {
  // Backend now uses email instead of username for login
  const response = await api.post('/api/auth/login', { email, password });
  
  // Handle nested response structure: response.data.token or response.token
  const token = response?.data?.token || response?.token;
  const user = response?.data?.user || response?.user;
  
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    storeUser(user);
    return {
      ...response,
      token, // Ensure token is at top level for compatibility
      user,
    };
  } else {
    throw new Error(response?.error || response?.message || 'Login failed');
  }
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Optionally, add user info fetch if backend supports it
export const register = async (userData) => {
  const { name, password, email, role, department } = userData;
  
  // Backend removed username field - email is automatically used as username
  if (!name || !password || !email || !role || !department) {
    throw new Error('All fields are required: name, password, email, role, department');
  }

  const response = await api.post('/api/auth/register', {
    name,
    password,
    email,
    role,
    department,
  });

  // Handle nested response structure
  const token = response?.data?.token || response?.token;
  const user = response?.data?.user || response?.user;
  const staff = response?.data?.staff || response?.staff;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    storeUser(user);
    return {
      ...response,
      token,
      user,
      staff,
    };
  } else {
    throw new Error(response?.error || response?.message || 'Registration failed');
  }
};

export const getUserInfo = async () => {
  const token = getToken();
  if (!token) return null;

  const storedUser = getStoredUser();
  if (!storedUser) return null;

  const fetchByStaffId = async () => {
    if (!storedUser.staffId) return null;
    const response = await api.get(`/api/staff/${storedUser.staffId}`);
    return response?.data || response;
  };

  try {
    const user = await fetchByStaffId();
    if (user) {
      storeUser(user);
      return user;
    }
  } catch {
    try {
      // Fallback for mock server which still uses /me
  const response = await api.get('/api/staff/me');
      const user = response?.user || response?.data || response;
      if (user) storeUser(user);
      return user || storedUser;
    } catch {
      return storedUser;
    }
  }

  return storedUser;
};
