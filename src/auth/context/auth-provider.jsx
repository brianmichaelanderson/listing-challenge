'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, MOCK_USER_DATA } from '../../lib/supabase';

/**
 * Auth Context
 * Simplified version of our real auth provider
 */
const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
});

/**
 * Auth Provider Component
 * Provides authentication state to the app
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkUserSession();
  }, []);

  /**
   * Check if user is authenticated
   */
  const checkUserSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (data?.session?.user) {
        setUser(data.session.user);
      } else {
        // For this challenge, always set mock user
        setUser(MOCK_USER_DATA);
      }
    } catch (error) {
      console.error('Auth error:', error);
      // Even on error, set mock user for challenge
      setUser(MOCK_USER_DATA);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}













