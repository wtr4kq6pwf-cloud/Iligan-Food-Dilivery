// src/hooks/useOfflineAuth.js
import { useState, useEffect } from 'react';
import { isAppOnline } from '../utils/offlineUtils';

export const useOfflineAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('offlineUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const offlineLogin = async (email, password) => {
    setIsLoading(true);

    // Mock delay to simulate auth
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple validation (for testing only)
    if (email && password.length >= 6) {
      const userData = {
        id: 'offline-' + Date.now(),
        email,
        name: email.split('@')[0],
        isOfflineUser: true,
        loginTime: new Date().toISOString()
      };

      // Save to localStorage
      localStorage.setItem('offlineUser', JSON.stringify(userData));
      setUser(userData);
      setIsLoading(false);
      return { success: true, user: userData };
    }

    setIsLoading(false);
    return { success: false, error: 'Invalid credentials' };
  };

  const offlineLogout = () => {
    localStorage.removeItem('offlineUser');
    setUser(null);
  };

  return {
    user,
    isLoading,
    offlineLogin,
    offlineLogout,
    isOfflineMode: !isAppOnline()
  };
};