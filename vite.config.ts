import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname as pathDirname, resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

const filename = fileURLToPath(import.meta.url);
const dirname = pathDirname(filename);

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'favicon-96x96.png', 'favicon.svg'],
      manifest: {
        name: 'News Trend Việt Nam',
        short_name: 'Topic Modeling',
        description: 'Ứng dụng phân tích và theo dõi xu hướng tin tức',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2196f3',
        icons: [
          {
            src: './web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: './web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        lang: 'vi'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,lottie}'],
        runtimeCaching: [
          {
            urlPattern: /.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.ngrok-free\.app/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    }),
  ],
  server: {
    port: 8501,
    watch: {
      usePolling: false,
      interval: 1000,
    },
  },
  resolve: {
    alias: {
      '@': resolve(dirname, './src'),
    },
  },
});