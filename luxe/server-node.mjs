// Node.js entry point. The TanStack Start build emits a fetch-handler
// (dist/server/server.js). srvx adapts it onto a Node http server, with
// dist/client/ served as static assets in front of the SSR handler.
import { serve } from "srvx";
import { serveStatic } from "srvx/static";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import handler from "./dist/server/server.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT ?? 3000);
const hostname = process.env.HOSTNAME ?? "0.0.0.0";

serve({
  port,
  hostname,
  middleware: [serveStatic({ dir: join(__dirname, "dist/client") })],
  fetch: handler.fetch,
});

console.log(`[luxe] ready on http://${hostname}:${port}`);
