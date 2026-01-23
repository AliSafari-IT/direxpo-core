import { test } from "node:test";
import assert from "node:assert";
import { discoverFiles } from "../file-discoverer.js";
import { resolve } from "path";

test("discoverFiles - returns POSIX rel paths", async () => {
  const fixturePath = resolve("demo/fixtures/sample-project");
  const files = await discoverFiles({ targetPath: fixturePath });
  
  assert.ok(files.length > 0);
  files.forEach(file => {
    assert.ok(!file.includes("\\"), `File path should use forward slashes: ${file}`);
  });
});

test("discoverFiles - respects filter:glob with pattern", async () => {
  const fixturePath = resolve("demo/fixtures/sample-project");
  const files = await discoverFiles({
    targetPath: fixturePath,
    filter: "glob",
    pattern: "**/*.ts"
  });
  
  files.forEach(file => {
    assert.ok(file.endsWith(".ts"), `File should match pattern: ${file}`);
  });
});

test("discoverFiles - respects exclude patterns", async () => {
  const fixturePath = resolve("demo/fixtures/sample-project");
  const files = await discoverFiles({
    targetPath: fixturePath,
    exclude: ["*.log", "**/temp/**"]
  });
  
  files.forEach(file => {
    assert.ok(!file.endsWith(".log"), `Should exclude .log files: ${file}`);
    assert.ok(!file.includes("temp/"), `Should exclude temp directory: ${file}`);
  });
});

test("discoverFiles - filter:tsx includes ts/tsx/js/jsx", async () => {
  const fixturePath = resolve("demo/fixtures/sample-project");
  const files = await discoverFiles({
    targetPath: fixturePath,
    filter: "tsx"
  });
  
  files.forEach(file => {
    const ext = file.substring(file.lastIndexOf("."));
    assert.ok([".ts", ".tsx", ".js", ".jsx"].includes(ext), `File should be ts/tsx/js/jsx: ${file}`);
  });
});
