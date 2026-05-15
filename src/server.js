import http from "node:http";
import { authenticate, requirePermission } from "./auth.js";

const reports = [
  { id: "rep_001", title: "Latency report", status: "ready" },
  { id: "rep_002", title: "API usage report", status: "draft" },
];

export function createServer() {
  return http.createServer(async (request, response) => {
    const user = authenticate(request.headers.authorization);
    const url = new URL(request.url, "http://localhost");

    if (url.pathname === "/health") {
      return send(response, 200, { ok: true });
    }

    if (url.pathname === "/users") {
      const guard = requirePermission(user, "users:read");
      if (!guard.ok) return send(response, guard.statusCode, { error: guard.error });
      return send(response, 200, { users: [{ id: user.id, name: user.name, role: user.role }] });
    }

    if (url.pathname === "/reports" && request.method === "GET") {
      const guard = requirePermission(user, "reports:read");
      if (!guard.ok) return send(response, guard.statusCode, { error: guard.error });
      return send(response, 200, { reports });
    }

    if (url.pathname === "/reports" && request.method === "POST") {
      const guard = requirePermission(user, "reports:write");
      if (!guard.ok) return send(response, guard.statusCode, { error: guard.error });
      return send(response, 201, { id: `rep_${Date.now()}`, status: "created" });
    }

    return send(response, 404, { error: "Not found" });
  });
}

function send(response, statusCode, payload) {
  response.writeHead(statusCode, { "content-type": "application/json" });
  response.end(JSON.stringify(payload));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT ?? 3000);
  createServer().listen(port, () => {
    console.log(`RBAC service listening on http://localhost:${port}`);
  });
}
