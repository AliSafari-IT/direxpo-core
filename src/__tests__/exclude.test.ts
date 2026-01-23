import { test } from "node:test";
import assert from "node:assert";
import { isExcluded, parseExclude } from "../exclude.js";

test("isExcluded - segment excludes", () => {
  assert.strictEqual(isExcluded("node_modules/foo", []), true);
  assert.strictEqual(isExcluded("src/node_modules/bar", []), true);
  assert.strictEqual(isExcluded(".git/config", []), true);
  assert.strictEqual(isExcluded("dist/index.js", []), true);
  assert.strictEqual(isExcluded("src/components/Button.tsx", []), false);
});

test("isExcluded - glob patterns with **", () => {
  assert.strictEqual(isExcluded("dist/index.js", ["**/dist/**"]), true);
  assert.strictEqual(isExcluded("src/dist/foo.js", ["**/dist/**"]), true);
  assert.strictEqual(isExcluded("src/components/dist.ts", ["**/dist/**"]), false);
});

test("isExcluded - glob patterns with *", () => {
  assert.strictEqual(isExcluded("test.log", ["*.log"]), true);
  assert.strictEqual(isExcluded("src/test.log", ["*.log"]), false);
  assert.strictEqual(isExcluded("error.log", ["*.log"]), true);
});

test("isExcluded - nested glob patterns", () => {
  assert.strictEqual(isExcluded("src/generated/types.ts", ["src/**/generated/**"]), true);
  assert.strictEqual(isExcluded("src/utils/generated/index.ts", ["src/**/generated/**"]), true);
  assert.strictEqual(isExcluded("src/components/Button.tsx", ["src/**/generated/**"]), false);
});

test("parseExclude - comma separated", () => {
  const result = parseExclude("node_modules,dist,.git");
  assert.deepStrictEqual(result, ["node_modules", "dist", ".git"]);
});

test("parseExclude - newline separated", () => {
  const result = parseExclude("node_modules\ndist\n.git");
  assert.deepStrictEqual(result, ["node_modules", "dist", ".git"]);
});

test("parseExclude - array input", () => {
  const result = parseExclude(["node_modules", "dist"]);
  assert.deepStrictEqual(result, ["node_modules", "dist"]);
});
