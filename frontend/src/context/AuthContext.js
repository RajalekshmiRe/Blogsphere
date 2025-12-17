// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Load user from API
  const loadUser = async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      setUser(res.data.data);
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post('/auth/login', {
        email,
        password
      });

      const { token, user: userData } = res.data;
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state IMMEDIATELY
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      const res = await axiosInstance.post('/auth/register', {
        name,
        email,
        password
      });

      const { token, user: userData } = res.data;
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state IMMEDIATELY
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};