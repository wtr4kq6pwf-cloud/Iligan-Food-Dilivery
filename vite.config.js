import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      // Explicitly includes the offline page and standard assets
      includeAssets: ['favicon.ico', 'robots.txt', 'offline.html', 'logo.png', 'motor.png'], 
      workbox: {
        // Caches common assets (js, css, html, images)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'], 
        navigateFallback: '/offline.html',
        // Cache static assets for offline access
        runtimeCaching: [
          {
            // Cache images with CacheFirst strategy
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            // Cache Supabase API calls with NetworkFirst strategy
            urlPattern: /^https:\/\/.*\.supabase\.co/,
            handler: 'NetworkFirst',
            options: { 
              cacheName: 'supabase-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              }
            }
          },
          {
            // Cache JSON responses
            urlPattern: /^https:\/\/.*\.(json|graphql)/,
            handler: 'NetworkFirst',
            options: { 
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Iligan Food Hub',
        short_name: 'IliganFood',
        description: 'Fast and easy food delivery in Iligan City',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        theme_color: '#FF5722',
        background_color: '#ffffff',
        icons: [
          {
            src: '/logo.png', 
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        screenshots: [
          {
            src: '/logo.png',
            sizes: '540x720',
            type: 'image/png',
            form_factor: 'narrow'
          }
        ],
        categories: ['food', 'shopping'],
        shortcuts: [
          {
            name: 'Browse Restaurants',
            short_name: 'Shops',
            description: 'View local restaurants and food vendors',
            url: '/?page=products',
            icons: [{ src: '/logo.png', sizes: '192x192' }]
          },
          {
            name: 'Order History',
            short_name: 'Orders',
            description: 'Check your past orders',
            url: '/?page=history',
            icons: [{ src: '/logo.png', sizes: '192x192' }]
          }
        ]
      }
    }),
  ],
})