import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Import lovable-tagger conditionally to avoid issues in production builds
let componentTagger;
try {
  componentTagger = require("lovable-tagger").componentTagger;
} catch (error) {
  // Skip if not available
  componentTagger = () => null;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: true,
  },
}));
