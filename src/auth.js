export const users = new Map([
  ["admin-token", { id: "usr_admin", name: "Admin", role: "admin" }],
  ["manager-token", { id: "usr_manager", name: "Manager", role: "manager" }],
  ["viewer-token", { id: "usr_viewer", name: "Viewer", role: "viewer" }],
]);

const permissions = {
  admin: ["users:read", "reports:read", "reports:write"],
  manager: ["reports:read", "reports:write"],
  viewer: ["reports:read"],
};

export function authenticate(authorizationHeader) {
  if (!authorizationHeader?.startsWith("Bearer ")) return null;
  const token = authorizationHeader.slice("Bearer ".length);
  return users.get(token) ?? null;
}

export function can(user, permission) {
  if (!user) return false;
  return permissions[user.role]?.includes(permission) ?? false;
}

export function requirePermission(user, permission) {
  if (!user) {
    return { ok: false, statusCode: 401, error: "Authentication required" };
  }

  if (!can(user, permission)) {
    return { ok: false, statusCode: 403, error: "Permission denied" };
  }

  return { ok: true };
}
