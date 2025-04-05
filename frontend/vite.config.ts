import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    obfuscatorPlugin({
      options: {
        debugProtection: true,
      },
    }),
  ],
});
