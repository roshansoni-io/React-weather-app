import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimization: Split chunks for better caching and smaller entry files
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'charts': ['recharts'],
          'animations': ['framer-motion'],
          'icons': ['lucide-react']
        }
      }
    },
    // Minification and optimization
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Security: Remove console logs in production
        drop_debugger: true
      }
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600
  }
})
