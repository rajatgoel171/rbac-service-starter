# RBAC Service Starter

A dependency-free Node.js REST API starter that demonstrates role-based access control, route guards, structured JSON responses, and testable authorization logic.

## Features

- Built with Node's native HTTP server
- Role-based permissions for admin, manager, and viewer users
- Token-based request identity for local demos
- Health, user listing, and report endpoints
- Unit tests for authorization behavior

## Run

```bash
npm test
npm start
```

Then try:

```bash
curl -H "Authorization: Bearer admin-token" http://localhost:3000/reports
curl -H "Authorization: Bearer viewer-token" http://localhost:3000/users
```


















## Random Update 1

- 2025-09-29: captured a repository-specific status note with no sequential date pattern.
- Documented work progress, validation, and operational context for rbac-service-starter.
