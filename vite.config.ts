// Vite TanStack Start configuration
// Includes TanStack devtools, tanstackStart, viteReact, tailwindcss, tsConfigPaths, and Nitro SSR.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
