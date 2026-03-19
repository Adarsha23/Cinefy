'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check login status on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/'; // Redirect to home on logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
