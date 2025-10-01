import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  build: {
    outDir: path.resolve('./public'),
    emptyOutDir: true,
    manifest: false,
    rollupOptions: {
      input: {
        app: path.resolve('./index.html'),
        main: path.resolve('./src/main.ts'),
      }
    }
  },
  resolve: {
    extensions: ['.vue', '.ts', '.js', '.html'],
    alias: {
      '@': path.resolve('./src'),
      '@src': path.resolve('./src'),
      '@styles': path.resolve('./styles'),
      '@assets': path.resolve('./assets'),
      '@shared': path.resolve('../shared'),
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8500,
    strictPort: true,
    proxy: {
      '/api': {
        target: `https://localhost:8525/public`,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/private-api': {
        target: `https://localhost:8525/private`,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/private-api/, ''),
      }
    }
  },
  plugins: [
    vue(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: './assets/',
          dest: '.'
        },
      ]
    })
  ],
});