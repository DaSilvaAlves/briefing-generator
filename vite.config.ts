import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configurado para a porta 5190 para evitar conflitos com o iamenu
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5190,
    strictPort: true,
  }
})
