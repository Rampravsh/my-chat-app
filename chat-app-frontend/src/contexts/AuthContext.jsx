import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Default to true

  useEffect(() => {
    // Check if user is already logged in (token and user info in localStorage)
    const storedName = localStorage.getItem('name');
    const token = localStorage.getItem('token');

    if (storedName && token) {
      try {
        const parsedUser = storedName;
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        // Clear invalid data
        authService.logout();
      }
    }
    setLoading(false); // Once check is complete, set loading to false
  }, []);

  const login = async (userData) => {
    // This part is critical: ensure authService.login returns user and token
    const data = await authService.login(userData); // backend should return { user, token }
    setUser(data.name); // Update user state with the returned user object
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData); // backend should return { user, token }
    setUser(data.name); // Update user state with the returned user object
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null); // Set user to null on logout
  };

  // isAuthenticated will be true if 'user' is not null
  const isAuthenticated = !!user; 

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated }}>
      {/* Render children only when loading is false */}
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};