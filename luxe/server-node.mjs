// Node.js entry point. The TanStack Start build emits a fetch-handler
// (dist/server/server.js). srvx adapts that handler onto a Node http server.
import { serve } from "srvx";
import handler from "./dist/server/server.js";

const port = Number(process.env.PORT ?? 3000);
const hostname = process.env.HOSTNAME ?? "0.0.0.0";

serve({
  fetch: handler.fetch,
  port,
  hostname,
});

console.log(`[luxe] ready on http://${hostname}:${port}`);
