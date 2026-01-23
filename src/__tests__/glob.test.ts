import { test } from "node:test";
import assert from "node:assert";
import { matchesGlob } from "../glob.js";

test("matchesGlob - ** matches across segments", () => {
  assert.strictEqual(matchesGlob("src/components/Button.tsx", "src/**/*.tsx"), true);
  assert.strictEqual(matchesGlob("src/utils/helpers/format.tsx", "src/**/*.tsx"), true);
  assert.strictEqual(matchesGlob("src/index.ts", "src/**/*.tsx"), false);
});

test("matchesGlob - * matches within segment", () => {
  assert.strictEqual(matchesGlob("test.ts", "*.ts"), true);
  assert.strictEqual(matchesGlob("index.ts", "*.ts"), true);
  assert.strictEqual(matchesGlob("src/test.ts", "*.ts"), false);
});

test("matchesGlob - ? matches single char", () => {
  assert.strictEqual(matchesGlob("a.ts", "?.ts"), true);
  assert.strictEqual(matchesGlob("ab.ts", "?.ts"), false);
});

test("matchesGlob - markdown files", () => {
  assert.strictEqual(matchesGlob("README.md", "**/*.md"), true);
  assert.strictEqual(matchesGlob("docs/guide.md", "**/*.md"), true);
  assert.strictEqual(matchesGlob("src/index.ts", "**/*.md"), false);
});

test("matchesGlob - exact path", () => {
  assert.strictEqual(matchesGlob("src/index.ts", "src/index.ts"), true);
  assert.strictEqual(matchesGlob("src/index.tsx", "src/index.ts"), false);
});
