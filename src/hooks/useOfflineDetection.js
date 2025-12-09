// hooks/useOfflineDetection.js
import { useState, useEffect } from 'react';

/**
 * Custom hook to detect and monitor online/offline status
 * Returns { isOnline: boolean }
 */
export const useOfflineDetection = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('✅ Network connection restored');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('⚠️ Network connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
};
