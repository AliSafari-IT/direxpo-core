import { test } from "node:test";
import assert from "node:assert";
import { resolveWithinRoot, toPosixRelPath } from "../path-utils.js";
import { resolve } from "path";

test("resolveWithinRoot - blocks traversal", () => {
  const root = resolve("/tmp/project");
  assert.strictEqual(resolveWithinRoot(root, "../outside"), null);
  assert.strictEqual(resolveWithinRoot(root, "../../etc/passwd"), null);
});

test("resolveWithinRoot - blocks null bytes", () => {
  const root = resolve("/tmp/project");
  assert.strictEqual(resolveWithinRoot(root, "file\0.txt"), null);
});

test("resolveWithinRoot - allows valid paths", () => {
  const root = resolve("/tmp/project");
  const result = resolveWithinRoot(root, "src/index.ts");
  assert.ok(result !== null);
  assert.ok(result!.includes("src"));
});

test("resolveWithinRoot - blocks outside root", () => {
  const root = resolve("/tmp/project");
  assert.strictEqual(resolveWithinRoot(root, "../../../etc"), null);
});

test("toPosixRelPath - converts backslashes", () => {
  assert.strictEqual(toPosixRelPath("src\\components\\Button.tsx"), "src/components/Button.tsx");
});

test("toPosixRelPath - removes leading ./", () => {
  assert.strictEqual(toPosixRelPath("./src/index.ts"), "src/index.ts");
});

test("toPosixRelPath - handles already posix paths", () => {
  assert.strictEqual(toPosixRelPath("src/index.ts"), "src/index.ts");
});
