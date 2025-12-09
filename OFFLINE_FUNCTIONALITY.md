# Iligan Food Hub - Offline Functionality Guide

## Overview

Your Iligan Food Hub app now has comprehensive **offline support** and **online functionality** to ensure users can access the landing page and browse content both when connected and disconnected from the internet.

---

## 🎯 What's New

### 1. **Enhanced Landing Page** (`LandingPage.jsx`)
- ✅ Online/Offline status indicator
- ✅ Responsive animations with offline awareness
- ✅ Dynamic button text ("Get Started Now!" vs "Browse Offline")
- ✅ Image loading with fallbacks
- ✅ Works perfectly offline

### 2. **Offline Detection Hook** (`useOfflineDetection.js`)
- ✅ Real-time network status monitoring
- ✅ Automatically detects online/offline transitions
- ✅ Lightweight and reusable

### 3. **Offline Indicator Component** (`OfflineIndicator.jsx`)
- ✅ Visual notification when offline
- ✅ Non-intrusive banner at the top of the app
- ✅ Disappears when online

### 4. **Enhanced Offline Page** (`public/offline.html`)
- ✅ Beautiful UI matching your brand (Orange #FF5722)
- ✅ Helpful tips for users
- ✅ Auto-reload when back online
- ✅ "Try Again" button for manual reload

### 5. **PWA Configuration** (`vite.config.js`)
- ✅ Service Worker auto-update
- ✅ Smart caching strategies:
  - **CacheFirst** for images (fast loading)
  - **NetworkFirst** for API calls (fresh data when available)
- ✅ Offline HTML fallback
- ✅ App manifest with shortcuts and categories

### 6. **Offline Utilities** (`utils/offlineUtils.js`)
- ✅ Local data storage (IndexedDB)
- ✅ Offline data synchronization
- ✅ Cache management functions

---

## 🔧 How It Works

### Online Mode
1. User visits the landing page
2. Status indicator shows "Online"
3. All features are fully functional
4. Service Worker caches assets in the background
5. Fresh data is fetched from Supabase

### Offline Mode
1. User loses internet connection
2. Online/Offline indicator turns red and shows "Offline"
3. User can still view the landing page
4. Previously cached data and assets remain available
5. Cannot perform online actions (sign up, order)
6. "Try Again" button in offline page helps reconnect

### Automatic Reconnection
- Service Worker detects when internet is restored
- Offline page auto-reloads automatically
- App seamlessly transitions back to online mode

---

## 📱 Browser Support

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox
- ✅ Safari (iOS 12+, macOS)
- ✅ Samsung Internet
- ✅ All modern browsers with Service Worker support

---

## 🚀 Building & Deployment

### Build for Production
```bash
npm run build
```

The build process will:
1. Generate an optimized Service Worker
2. Create a manifest.webmanifest
3. Bundle all assets for offline access

### Testing Offline Functionality

#### In Chrome DevTools:
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers**
4. Check "Offline" checkbox
5. Refresh the page
6. App should work offline!

#### Network Simulation:
1. Go to **Network** tab
2. Change "Throttling" to "Offline"
3. Test your app's offline behavior

---

## 📁 File Structure

```
src/
├── components/
│   ├── LandingPage.jsx           (✨ Enhanced with offline support)
│   ├── common/
│   │   └── OfflineIndicator.jsx  (🆕 Offline status banner)
│   └── ...
├── hooks/
│   ├── useOfflineDetection.js    (🆕 Network status hook)
│   └── ...
├── utils/
│   └── offlineUtils.js           (🆕 IndexedDB utilities)
├── App.jsx                        (Updated)
└── ...

public/
├── offline.html                   (✨ Enhanced offline page)
├── logo.png
├── motor.png
└── manifest.webmanifest

vite.config.js                     (✨ Enhanced PWA config)
```

---

## 🎨 UI/UX Features

### Landing Page Updates
- **Online Status Badge**: Top-left corner shows current status
- **Dynamic Button Text**: Changes based on online/offline state
- **Offline Warning**: Yellow banner notifies users
- **Smooth Animations**: Fade-in and slide-up effects

### Offline Page
- Branded UI with Iligan Food Hub colors
- Helpful offline tips
- Auto-reload on reconnection
- Mobile-friendly design

---

## 🔐 Security & Privacy

- All offline data stored locally (IndexedDB)
- No data sent to external servers without user consent
- Service Worker validates all requests
- API cache respects Supabase security

---

## ⚙️ Configuration

### Cache Strategies Explained

| Resource | Strategy | Duration | Reason |
|----------|----------|----------|--------|
| Images | CacheFirst | 30 days | Static content, rarely changes |
| Supabase API | NetworkFirst | 1 day | Need fresh data, fallback to cache |
| JSON/API | NetworkFirst | 1 day | Prioritize fresh data |

---

## 🐛 Troubleshooting

### Service Worker Not Caching?
1. Clear browser cache: **Ctrl+Shift+Delete**
2. Go to Settings > Privacy > Clear browsing data
3. Unregister old Service Workers: DevTools > Application > Service Workers > Unregister

### Offline Page Not Showing?
1. Check `vite.config.js` has `navigateFallback: '/offline.html'`
2. Verify `public/offline.html` exists
3. Rebuild with `npm run build`

### Data Not Syncing After Coming Online?
1. Check browser console for errors
2. Verify network connection is stable
3. Call `syncOfflineChanges()` from `offlineUtils.js`

---

## 🔄 Future Enhancements

Potential features to add:
- [ ] Queue offline orders and sync when online
- [ ] Download restaurant menus for offline browsing
- [ ] Background sync API for automatic uploads
- [ ] Offline user preferences storage
- [ ] Push notifications when back online

---

## 📝 Notes

- The landing page **always works offline** - this is the entry point for users
- Authentication requires internet (handled gracefully)
- Once authenticated online, users can browse cached restaurants offline
- Real-time updates (orders) require online connection
- PWA can be installed as a native app on mobile devices

---

## 🎉 You're All Set!

Your Iligan Food Hub app now has robust offline support. Users can:
- ✅ Access the landing page anytime
- ✅ Browse content when disconnected
- ✅ Get notified when offline
- ✅ Automatically reconnect when online
- ✅ Enjoy a seamless experience

Happy coding! 🚀
