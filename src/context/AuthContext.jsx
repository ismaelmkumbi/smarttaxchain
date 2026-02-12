import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  login as loginService,
  logout as logoutService,
  getToken,
  getUserInfo,
} from 'src/services/authService';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const response = await loginService(email, password);
      setToken(response.token);
      setOpen(true);
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo);
        navigate('/dashboards/modern');
      } catch (userErr) {
        setToken(null);
        setUser(null);
        setError(userErr?.message || 'Wrong email or password. Please try again.');
        setOpen(true);
      }
    } catch (err) {
      setError(err?.message || 'Wrong email or password. Please try again.');
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = useCallback(() => {
    logoutService();
    setToken(null);
    setUser(null);
    navigate('/auth/login');
  }, [navigate]);

  useEffect(() => {
    if (token) {
      getUserInfo()
        .then(setUser)
        .catch(() => {
          logoutService();
          setToken(null);
          setUser(null);
          navigate('/auth/login');
        });
    }
  }, [token, navigate]);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login: handleLogin,
    logout: handleLogout,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <Snackbar open={open && !!error} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={open && !error} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
          Login successful!
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
