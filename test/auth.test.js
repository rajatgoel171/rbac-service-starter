import assert from "node:assert/strict";
import { test } from "node:test";
import { authenticate, can, requirePermission } from "../src/auth.js";

test("authenticates bearer tokens", () => {
  const user = authenticate("Bearer admin-token");
  assert.equal(user.role, "admin");
});

test("enforces role permissions", () => {
  const viewer = authenticate("Bearer viewer-token");
  const manager = authenticate("Bearer manager-token");

  assert.equal(can(viewer, "reports:read"), true);
  assert.equal(can(viewer, "reports:write"), false);
  assert.deepEqual(requirePermission(manager, "users:read"), {
    ok: false,
    statusCode: 403,
    error: "Permission denied",
  });
});
