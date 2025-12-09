// components/common/OfflineIndicator.jsx
import React from 'react';
import { useOfflineDetection } from '../../hooks/useOfflineDetection';

/**
 * Component that displays current online/offline status
 * Shows at the top of the page with appropriate styling
 */
const OfflineIndicator = () => {
  const { isOnline } = useOfflineDetection();

  if (isOnline) {
    return null; // Don't show when online
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-100 border-b-2 border-yellow-400 p-3 flex items-center justify-center gap-2 animate-slide-down">
      <span className="text-xl">⚠️</span>
      <span className="font-semibold text-yellow-800">
        You're offline - Some features may be limited
      </span>
      <span className="text-sm text-yellow-700 ml-auto">
        Reconnect to continue ordering
      </span>
    </div>
  );
};

export default OfflineIndicator;
