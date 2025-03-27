import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  base: '/SUKOON/',  // Adjust base path for GitHub Pages
  plugins: [react(), tsconfigPaths(), tailwindcss(), flowbiteReact()],
})