import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Isso libera o acesso externo (0.0.0.0)
    strictPort: true,
    port: 3000,
    watch: {
      usePolling: true, // Essencial para o Docker no Windows funcionar o Hot Reload
    }
  }
})