import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  define:
    command === "build"
      ? {
          "import.meta.env.VITE_API_URL": JSON.stringify("/api/v1"),
        }
      : undefined,
}));
