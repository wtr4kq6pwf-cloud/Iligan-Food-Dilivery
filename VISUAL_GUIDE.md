# 📱 Visual Guide - Offline Features

## Landing Page - Online Mode

```
┌─────────────────────────────────────┐
│  ✅ Online                          │  ← Status Badge
├─────────────────────────────────────┤
│                                     │
│          🚚                         │
│       (Moving animation)            │
│                                     │
│     Your Food, Fast!                │
│  The fastest way to get food...     │
│                                     │
│   [Get Started Now!]                │
│                                     │
└─────────────────────────────────────┘
```

## Landing Page - Offline Mode

```
┌─────────────────────────────────────┐
│  🔴 Offline                         │  ← Status Badge (Red)
├─────────────────────────────────────┤
│                                     │
│          🚚                         │
│       (Moving animation)            │
│                                     │
│     Your Food, Fast!                │
│  The fastest way to get food...     │
│                                     │
│  ⚠️ You're offline -               │  ← Warning Banner
│     Content may be limited          │
│                                     │
│   [Browse Offline]                  │  ← Changed button text
│                                     │
└─────────────────────────────────────┘
```

## Offline Page (When navigation fails offline)

```
┌─────────────────────────────────────┐
│                                     │
│        Iligan Food Hub              │
│          Logo Image                 │
│                                     │
│             📶                      │  ← Disconnected symbol
│                                     │
│      You're Offline                 │
│      Connection Lost                │
│                                     │
│  The app is temporarily unavailable │
│  while you're offline.              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ What you can do:            │   │
│  │ ✓ Check your connection     │   │
│  │ ✓ Try turning Wi-Fi on/off  │   │
│  │ ✓ Move closer to router     │   │
│  │ ✓ Check mobile data         │   │
│  └─────────────────────────────┘   │
│                                     │
│        [Try Again]                  │  ← Reload button
│                                     │
│    🔴 Offline Mode                  │
│                                     │
│   Once you're back online,          │
│   reload the page to continue.      │
└─────────────────────────────────────┘
```

## Status Indicator States

### Online
```
┌───────────────────┐
│ 🟢 Online         │  ← Green dot
└───────────────────┘
```

### Offline
```
┌───────────────────┐
│ 🔴 Offline        │  ← Red dot (pulsing)
└───────────────────┘
```

## Data Flow

### Online Mode
```
User Opens App
    ↓
Service Worker detects online
    ↓
Fetch fresh data from Supabase
    ↓
Cache assets in background
    ↓
Display app with status: ✅ Online
```

### Offline Mode
```
User Opens App (No Internet)
    ↓
Service Worker detects offline
    ↓
Serve cached assets
    ↓
Show offline.html for new routes
    ↓
Display app with status: 🔴 Offline
    ↓
Warn user about limited features
```

### Reconnection Flow
```
User Reconnects to Internet
    ↓
Service Worker detects online event
    ↓
offline.html auto-reloads
    ↓
App loads with fresh data
    ↓
Status changes to ✅ Online
    ↓
User can now order normally
```

## Component Hierarchy

```
App.jsx
├── OfflineIndicator
│   └── Shows only when offline
├── Header (hidden on landing)
│   └── Logo + Auth buttons
├── Main Content
│   ├── LandingPage (when not logged in)
│   │   └── Shows Online/Offline status
│   ├── RestaurantListing (when logged in)
│   ├── Cart
│   ├── Checkout
│   ├── OrderHistory
│   └── OrderTracking
└── Navigation Bar (hidden on landing)
    └── Shop | Basket | Orders
```

## Offline Detection Flow

```
┌─────────────────────┐
│ useOfflineDetection │
│      (Hook)         │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
    ↓             ↓
Online Event   Offline Event
    │             │
    └──────┬──────┘
           │
      Update State
           │
      Trigger Re-render
           │
    Update UI (badge, warnings)
```

## Caching Strategy

```
Request from Browser
    ↓
┌───────────────────┐
│ Is it online?     │
└───────┬───────────┘
        │
    Yes │   No
    ┌───┴────────────┐
    ↓                ↓
NetworkFirst      Cache
Strategy          Strategy
(API, JSON)       (Images,
    │             Static)
    │                │
    ├────────┬───────┘
    │        │
Try network  Serve from
    │        cache
    ├─────────┤
    │         │
Online?   No connection?
    │         │
   Yes       Yes
    │         │
Cache it   Fail gracefully
    │         │
    └────┬────┘
         │
    Return data
```

## Features at a Glance

| Feature | Online | Offline |
|---------|--------|---------|
| View Landing Page | ✅ | ✅ |
| Browse (Cached) Restaurants | ✅ | ⚠️ (cached) |
| See Online Status | ✅ | ✅ |
| Create Account | ✅ | ❌ |
| Browse Menus | ✅ | ⚠️ (cached) |
| Place Orders | ✅ | ❌ |
| View Order History | ✅ | ⚠️ (cached) |
| Track Order | ✅ | ❌ |

Legend: ✅ = Full support | ⚠️ = Limited/Cached | ❌ = Requires online

---

## Example Code Usage

### Check if Online
```jsx
const { isOnline } = useOfflineDetection();

if (!isOnline) {
  // Show limited features message
  return <OfflineWarning />;
}
```

### Show Offline Banner
```jsx
<OfflineIndicator />  // Only renders when offline
```

### Store Offline Data
```jsx
await storeDataLocally('cache', 'restaurants', data);
const cached = await getDataLocally('cache', 'restaurants');
```

---

This visual guide helps understand how your offline system works! 🎉
