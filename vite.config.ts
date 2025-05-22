import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    manifest: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        manifest: path.resolve(__dirname, 'manifest.json')
      },
      output: {
        entryFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            '@mui/material',
            '@mui/icons-material',
            'framer-motion'
          ],
          'auth': [
            './src/contexts/AuthContext.tsx',
            './src/services/auth.ts'
          ],
          'ai': [
            './src/services/ai.ts',
            './src/services/ocr.ts'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}) 