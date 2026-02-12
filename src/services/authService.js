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

const STAFF_NOT_FOUND_MESSAGE = 'Wrong email or password. Please try again.';

const isStaffNotFoundError = (err) => {
  const msg = (err?.message || err?.details || '').toString().toLowerCase();
  return (
    msg.includes('does not exist') ||
    msg.includes('staff with id') ||
    msg.includes('user not found') ||
    err?.status === 404 ||
    (err?.status === 500 && msg.includes('does not exist'))
  );
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    const token = response?.data?.token || response?.token;
    const user = response?.data?.user || response?.user;

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      storeUser(user);
      return { ...response, token, user };
    }
    throw new Error(response?.error || response?.message || 'Login failed');
  } catch (err) {
    if (isStaffNotFoundError(err)) {
      throw new Error(STAFF_NOT_FOUND_MESSAGE);
    }
    throw new Error(err?.message || STAFF_NOT_FOUND_MESSAGE);
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
  } catch (err) {
    if (isStaffNotFoundError(err)) {
      logout();
      throw new Error(STAFF_NOT_FOUND_MESSAGE);
    }
    try {
      const response = await api.get('/api/staff/me');
      const user = response?.user || response?.data || response;
      if (user) {
        storeUser(user);
        return user;
      }
    } catch (meErr) {
      if (isStaffNotFoundError(meErr)) {
        logout();
        throw new Error(STAFF_NOT_FOUND_MESSAGE);
      }
    }
    return storedUser;
  }

  return storedUser;
};
