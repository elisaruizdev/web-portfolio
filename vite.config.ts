import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const isWin32 =
  (globalThis as unknown as { process?: { platform?: string } }).process?.platform === "win32";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Trivial (u otro Vite) suele ocupar 5173; el portfolio va en 5180
    port: 5180,
    strictPort: true,
    watch: {
      // Evita EBUSY en Windows cuando otro proceso toca archivos en public/
      usePolling: isWin32,
      ignored: ["**/.tmp-*/**"],
    },
  },
});
