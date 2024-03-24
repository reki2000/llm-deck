import react from "@vitejs/plugin-react-swc"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer({ open: true, gzipSize: true, brotliSize: true })],
  define: {
    global: "window",
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          katex: ["katex"],
        },
      },
    },
  },
})
