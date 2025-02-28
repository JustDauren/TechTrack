import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkAuthState, login, logout, fetchUserProfile } from '../store/slices/authSlice';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Check if user is already logged in
    dispatch(checkAuthState());
  }, [dispatch]);

  // Login function
  const handleLogin = async (username: string, password: string) => {
    await dispatch(login({ username, password })).unwrap();
    await dispatch(fetchUserProfile()).unwrap();
  };

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};