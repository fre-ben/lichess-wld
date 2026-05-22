import react from "@vitejs/plugin-react";
import { defineConfig } from "wxt";

export default defineConfig({
  browser: "chrome",
  outDir: "dist",
  vite: () => ({
    plugins: [react()],
  }),
});
