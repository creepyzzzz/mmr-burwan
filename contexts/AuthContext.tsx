import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook export - must be before component export for Fast Refresh
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Component export
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check for existing session immediately
    const checkSession = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (mounted) {
          setUser(currentUser);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to get current user:', error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    // Check session first
    checkSession();

    // Listen to auth state changes (this will also trigger on initial load if session exists)
    const subscription = authService.onAuthStateChange(async (user) => {
      if (mounted) {
        setUser(user);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user } = await authService.login({ email, password });
      setUser(user);
      return user; // Return user so LoginPage can check role immediately
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string, phone?: string) => {
    setIsLoading(true);
    try {
      const result = await authService.register({ email, password, name, phone });
      // Check if email confirmation is needed
      if ('needsConfirmation' in result && result.needsConfirmation) {
        // Return the result so the page can handle the confirmation message
        return result;
      }
      // If session exists, user is logged in
      if ('user' in result) {
        setUser(result.user);
      }
      return result;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Named exports for Fast Refresh compatibility
export { useAuth, AuthProvider };
