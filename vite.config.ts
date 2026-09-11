import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: { port: 4173, strictPort: false },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          radix: [
            "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-select",
            "@radix-ui/react-tabs", "@radix-ui/react-popover", "@radix-ui/react-tooltip",
            "@radix-ui/react-accordion", "@radix-ui/react-checkbox", "@radix-ui/react-radio-group",
          ],
        },
      },
    },
  },
});
