// DEVELOPER_GUIDE.md - Code Examples & Integration Guide

# 👨‍💻 Developer Guide - Offline Features

## Quick Integration Examples

### 1. Use Offline Detection Hook

```jsx
import { useOfflineDetection } from './hooks/useOfflineDetection';

function MyComponent() {
  const { isOnline } = useOfflineDetection();

  return (
    <div>
      <p>Status: {isOnline ? '✅ Online' : '🔴 Offline'}</p>
      
      {!isOnline && (
        <div className="bg-yellow-100 p-4 rounded">
          Some features are limited offline
        </div>
      )}
    </div>
  );
}

export default MyComponent;
```

---

### 2. Add Offline Indicator to App

```jsx
import OfflineIndicator from './components/common/OfflineIndicator';

function App() {
  return (
    <>
      <OfflineIndicator />  {/* Shows yellow banner when offline */}
      {/* Rest of your app */}
    </>
  );
}
```

---

### 3. Store Data for Offline Access

```jsx
import { storeDataLocally, getDataLocally } from './utils/offlineUtils';

// Store restaurant data when fetched
async function fetchRestaurants() {
  try {
    const response = await fetch('/api/restaurants');
    const data = await response.json();
    
    // Save to IndexedDB
    await storeDataLocally('restaurants', 'list', data);
    
    return data;
  } catch (error) {
    // Fall back to cached data
    const cached = await getDataLocally('restaurants', 'list');
    return cached || [];
  }
}
```

---

### 4. Conditional Rendering Based on Online Status

```jsx
import { useOfflineDetection } from './hooks/useOfflineDetection';

function RestaurantListing() {
  const { isOnline } = useOfflineDetection();

  return (
    <div>
      {!isOnline && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          📌 Viewing cached restaurants. 
          <br />
          Connect to internet to see updates and place orders.
        </div>
      )}
      
      {/* Your restaurant list */}
    </div>
  );
}
```

---

### 5. Handle API Failures Gracefully

```jsx
async function fetchWithOfflineFallback(url, storeName) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    
    const data = await response.json();
    
    // Cache for offline use
    await storeDataLocally(storeName, 'data', data);
    
    return data;
  } catch (error) {
    console.warn('Fetch failed, using cache:', error);
    
    // Return cached data
    const cached = await getDataLocally(storeName, 'data');
    if (cached) return cached;
    
    // No cache available
    throw new Error('Data unavailable offline');
  }
}
```

---

### 6. Sync Data When Back Online

```jsx
import { isAppOnline, syncOfflineChanges } from './utils/offlineUtils';

useEffect(() => {
  const handleOnline = async () => {
    if (isAppOnline()) {
      console.log('Back online! Syncing changes...');
      await syncOfflineChanges();
      // Refresh data
      await fetchFreshData();
    }
  };

  window.addEventListener('online', handleOnline);
  return () => window.removeEventListener('online', handleOnline);
}, []);
```

---

### 7. Disable Features When Offline

```jsx
import { useOfflineDetection } from './hooks/useOfflineDetection';

function CheckoutButton() {
  const { isOnline } = useOfflineDetection();

  return (
    <button
      disabled={!isOnline}
      className={!isOnline ? 'opacity-50 cursor-not-allowed' : ''}
      onClick={handleCheckout}
    >
      {isOnline ? 'Place Order' : 'Offline - Cannot Order'}
    </button>
  );
}
```

---

### 8. Show Different Content Offline

```jsx
import { useOfflineDetection } from './hooks/useOfflineDetection';

function HomePage() {
  const { isOnline } = useOfflineDetection();

  if (!isOnline) {
    return (
      <div>
        <h2>Offline Mode</h2>
        <p>Here's what you can do without internet:</p>
        <ul>
          <li>✅ Browse cached restaurants</li>
          <li>✅ View menu items</li>
          <li>✅ Read order history</li>
          <li>❌ Place new orders</li>
          <li>❌ Track current orders</li>
        </ul>
      </div>
    );
  }

  return <NormalHomePage />;
}
```

---

## Hook API Reference

### useOfflineDetection()

```jsx
const { isOnline } = useOfflineDetection();
```

**Returns:**
- `isOnline` (boolean) - true if online, false if offline

**Example:**
```jsx
const { isOnline } = useOfflineDetection();
console.log(isOnline); // true or false
```

---

## Utility Functions API

### storeDataLocally(storeName, key, data)

Store data in IndexedDB for offline access.

```jsx
await storeDataLocally('restaurants', 'pizza-place', {
  id: 1,
  name: 'Pizza Palace',
  rating: 4.5
});
```

**Parameters:**
- `storeName` (string) - Name of the object store
- `key` (string) - Unique key for the data
- `data` (any) - Data to store

**Returns:** Promise<boolean>

---

### getDataLocally(storeName, key)

Retrieve data from IndexedDB.

```jsx
const restaurant = await getDataLocally('restaurants', 'pizza-place');
```

**Parameters:**
- `storeName` (string) - Name of the object store
- `key` (string) - Key of the data to retrieve

**Returns:** Promise<any | null>

---

### clearLocalData(storeName)

Clear all data from a specific store.

```jsx
await clearLocalData('restaurants');
```

**Parameters:**
- `storeName` (string) - Name of the object store to clear

**Returns:** Promise<boolean>

---

### isAppOnline()

Check current online status (utility function).

```jsx
if (isAppOnline()) {
  // Do something online
}
```

**Returns:** boolean

---

## PWA Configuration

### Caching Strategies Explained

**CacheFirst**
```javascript
{
  urlPattern: /\.(png|jpg|jpeg|svg)$/,
  handler: 'CacheFirst',
  options: {
    cacheName: 'images',
    expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 } // 30 days
  }
}
```
- ✅ Perfect for: Static images, icons, logos
- 🎯 Use when: Content rarely changes
- ⚡ Benefit: Instant loading from cache

**NetworkFirst**
```javascript
{
  urlPattern: /^https:\/\/.*\.supabase\.co/,
  handler: 'NetworkFirst',
  options: {
    cacheName: 'supabase',
    networkTimeoutSeconds: 5,
    expiration: { maxAgeSeconds: 60 * 60 * 24 } // 1 day
  }
}
```
- ✅ Perfect for: API calls, dynamic data
- 🎯 Use when: Fresh data is important
- ⚡ Benefit: Fastest when online, cached fallback offline

---

## Testing Offline Functionality

### Unit Test Example

```jsx
import { render, screen } from '@testing-library/react';
import { useOfflineDetection } from './hooks/useOfflineDetection';
import MyComponent from './components/MyComponent';

test('shows offline message when offline', () => {
  // Mock navigator.onLine
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: false,
  });

  render(<MyComponent />);
  
  expect(screen.getByText(/offline/i)).toBeInTheDocument();
});
```

### Integration Test Example

```jsx
test('syncs data when coming back online', async () => {
  const { rerender } = render(<App />);
  
  // Simulate going offline
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: false,
  });
  
  window.dispatchEvent(new Event('offline'));
  rerender(<App />);
  
  // Simulate coming back online
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: true,
  });
  
  window.dispatchEvent(new Event('online'));
  rerender(<App />);
  
  // Should sync and refresh
  await waitFor(() => {
    expect(screen.getByText(/syncing/i)).toBeInTheDocument();
  });
});
```

---

## Common Patterns

### Pattern 1: NetworkFirst with Fallback

```jsx
async function smartFetch(url, options = {}) {
  if (navigator.onLine) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Network error');
      return await response.json();
    } catch (error) {
      // Try cache on network error
      return await getDataLocally('api-cache', url);
    }
  } else {
    // Offline - return from cache only
    return await getDataLocally('api-cache', url);
  }
}
```

### Pattern 2: Progressive Enhancement

```jsx
function FeatureButton() {
  const { isOnline } = useOfflineDetection();

  if (!isOnline) {
    return <DisabledButton title="Feature requires internet" />;
  }

  return <EnabledButton onClick={handleClick} />;
}
```

### Pattern 3: Graceful Degradation

```jsx
async function loadRestaurants() {
  try {
    // Try to get fresh data
    const fresh = await fetch('/api/restaurants').then(r => r.json());
    // Save for offline use
    await storeDataLocally('data', 'restaurants', fresh);
    return fresh;
  } catch {
    // Fall back to cache
    const cached = await getDataLocally('data', 'restaurants');
    if (cached) return cached;
    
    // No cache - show empty state
    return null;
  }
}
```

---

## Debugging Tips

### Check Service Worker Status
```javascript
// In browser console
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then(registrations => console.log(registrations));
}
```

### Monitor Cache
```javascript
// In browser console
caches.keys().then(names => {
  names.forEach(name => {
    caches.open(name).then(cache => {
      cache.keys().then(requests => {
        console.log(`Cache: ${name}`, requests);
      });
    });
  });
});
```

### Check Online Status
```javascript
// In browser console
console.log('Online:', navigator.onLine);
window.addEventListener('online', () => console.log('Back online!'));
window.addEventListener('offline', () => console.log('Went offline!'));
```

---

## Best Practices

1. **Always use NetworkFirst for APIs** - Users want fresh data
2. **Use CacheFirst for assets** - Images and static files rarely change
3. **Show status to users** - Let them know when offline
4. **Handle errors gracefully** - Provide fallbacks and helpful messages
5. **Test offline thoroughly** - Use DevTools to simulate offline mode
6. **Monitor cache size** - Set reasonable `maxEntries` and `maxAgeSeconds`
7. **Validate cached data** - Check timestamps and freshness
8. **Plan sync strategy** - Queue changes for when online

---

## Troubleshooting

### Service Worker not updating?
```bash
# Hard refresh
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)

# Or clear cache:
DevTools > Application > Cache Storage > Delete all
```

### Offline page not showing?
- Check `vite.config.js` has `navigateFallback: '/offline.html'`
- Verify `public/offline.html` exists
- Rebuild: `npm run build`

### Data not caching?
- Check Network tab in DevTools
- Verify cache name in config matches
- Check cache size limits
- Monitor Service Worker console

---

Happy coding! 🚀
