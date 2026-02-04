import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const savedUser = localStorage.getItem('adminUser');

      if (token && savedUser) {
        const userData = JSON.parse(savedUser);
        // Verify user is Admin
        if (userData && userData.role === 'Admin') {
          setUser(userData);
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      console.log('🔄 Logging in with:', credentials.email);
      const response = await authAPI.login(credentials);
      
      console.log('📨 Full Response:', response.data);
      
      const { data: userData, token, message } = response.data;
      
      console.log('👤 User Data:', userData);
      console.log('🔑 Token:', token ? '✅ Present' : '❌ Missing');
      console.log('👮 Role:', userData?.role);

      // Verify user is Admin
      if (!userData) {
        console.error('❌ No user data in response');
        throw new Error('No user data received from server');
      }
      
      if (userData.role !== 'Admin') {
        console.error(`❌ User role is "${userData.role}", not "Admin"`);
        throw new Error('Only admin users can access this portal');
      }

      // Store token and user data
      localStorage.setItem('adminToken', token || '');
      localStorage.setItem('adminUser', JSON.stringify(userData));
      setUser(userData);
      
      console.log('✅ User stored in localStorage');
      console.log('✅ Auth state updated');

      toast.success(message || 'Login successful!');
      
      // Navigate after state is set
      console.log('🔀 Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/');
      }, 500);
      
    } catch (error) {
      console.error('❌ Login Error:', error);
      const message = error.response?.data?.message || error.message || 'Login failed';
      console.error('Error Message:', message);
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setUser(null);
      navigate('/login');
      toast.info('Logged out successfully');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user && user?.role === 'Admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
