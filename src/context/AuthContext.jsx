import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/API/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const currentUser = authService.getCurrentUser();
      const hasToken = authService.isAuthenticated();

      if (currentUser && hasToken) {
        // For mock authentication, skip backend verification
        // In production, uncomment the verification below

        // Check if it's a mock token (starts with 'mock-jwt-token')
        const token = localStorage.getItem('authToken');
        if (token && token.startsWith('mock-jwt-token')) {
          // Mock token - trust it without verification
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          // Real token - verify with backend
          const { success } = await authService.verifyToken();
          if (success) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            // Token invalid - clear auth
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials);

      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        // Return user data for role-based redirect
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      const result = await authService.signup(userData);

      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  // Logout function
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
