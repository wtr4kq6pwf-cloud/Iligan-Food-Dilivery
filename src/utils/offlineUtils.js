// utils/offlineUtils.js - Utility functions for offline functionality

/**
 * Check if the app is currently online
 */
export const isAppOnline = () => navigator.onLine;

/**
 * Store data locally when offline (IndexedDB wrapper)
 */
export const storeDataLocally = async (storeName, key, data) => {
  try {
    if ('indexedDB' in window) {
      const request = indexedDB.open('IliganFoodDB', 1);
      
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const putRequest = store.put(data, key);

          putRequest.onsuccess = () => {
            console.log(`✅ Data stored locally: ${storeName}/${key}`);
            resolve(true);
          };
          putRequest.onerror = () => reject(false);
        };
        request.onerror = () => reject(false);
      });
    }
    return false;
  } catch (error) {
    console.error('❌ Error storing data locally:', error);
    return false;
  }
};

/**
 * Retrieve data from local storage (IndexedDB)
 */
export const getDataLocally = async (storeName, key) => {
  try {
    if ('indexedDB' in window) {
      const request = indexedDB.open('IliganFoodDB', 1);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const getRequest = store.get(key);

          getRequest.onsuccess = () => {
            resolve(getRequest.result);
          };
          getRequest.onerror = () => reject(null);
        };
        request.onerror = () => reject(null);
      });
    }
    return null;
  } catch (error) {
    console.error('❌ Error retrieving data locally:', error);
    return null;
  }
};

/**
 * Clear all local data
 */
export const clearLocalData = async (storeName) => {
  try {
    if ('indexedDB' in window) {
      const request = indexedDB.open('IliganFoodDB', 1);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const clearRequest = store.clear();

          clearRequest.onsuccess = () => {
            console.log(`✅ Local data cleared: ${storeName}`);
            resolve(true);
          };
          clearRequest.onerror = () => reject(false);
        };
        request.onerror = () => reject(false);
      });
    }
    return false;
  } catch (error) {
    console.error('❌ Error clearing local data:', error);
    return false;
  }
};

/**
 * Sync offline changes when back online
 */
export const syncOfflineChanges = async () => {
  if (isAppOnline()) {
    console.log('🔄 Syncing offline changes...');
    // Add your sync logic here
    return true;
  }
  return false;
};
