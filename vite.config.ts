import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Production builds are served from GitHub Pages at /fair-tourism-website-redesign/.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/fair-tourism-website-redesign/' : '/',
  plugins: [react()],
}))
