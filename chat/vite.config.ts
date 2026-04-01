import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5180,
    proxy: {
      "/ws": {
        target: "ws://localhost:5181",
        ws: true,
      },
      "/api": {
        target: "http://localhost:5181",
      },
    },
  },
});
