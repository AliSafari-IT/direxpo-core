import {
  buildFolderTree,
  discoverFiles,
  generateTreeSection,
} from "@asafarim/direxpo-core";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

export interface DemoSection {
  title: string;
  summary: string;
  lines: string[];
}

export interface DemoOutput {
  sections: DemoSection[];
  fixtureDir: string;
}

function getFixtureDir(): string {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  return resolve(currentDir, "../fixtures/sample-project");
}

function formatList(title: string, items: string[]): DemoSection {
  return {
    title,
    summary: `Found ${items.length} items`,
    lines: [
      `Found ${items.length} item${items.length === 1 ? "" : "s"}:`,
      ...items.map((item) => `• ${item}`),
    ],
  };
}

export async function collectDemoOutput(): Promise<DemoOutput> {
  const fixtureDir = getFixtureDir();
  const sections: DemoSection[] = [];

  const allFiles = await discoverFiles({ targetPath: fixtureDir });
  sections.push(
    formatList("📁 Use Case 1: Discover All Files", allFiles),
  );

  const tsxFiles = await discoverFiles({
    targetPath: fixtureDir,
    filter: "tsx",
  });
  sections.push(
    formatList("📝 Use Case 2: Discover TypeScript/TSX Files", tsxFiles),
  );

  const cssFiles = await discoverFiles({
    targetPath: fixtureDir,
    filter: "css",
  });
  sections.push(
    formatList("🎨 Use Case 3: Discover CSS Files", cssFiles),
  );

  const mdFiles = await discoverFiles({
    targetPath: fixtureDir,
    filter: "md",
  });
  sections.push(
    formatList("📚 Use Case 4: Discover Markdown Files", mdFiles),
  );

  const jsonFiles = await discoverFiles({
    targetPath: fixtureDir,
    filter: "json",
  });
  sections.push(
    formatList("⚙️ Use Case 5: Discover JSON Files", jsonFiles),
  );

  const filesWithExclude = await discoverFiles({
    targetPath: fixtureDir,
    exclude: ["node_modules", "dist"],
  });
  sections.push(
    formatList("🚫 Use Case 6: Discover with Exclusions", filesWithExclude),
  );

  const treeMarkdown = generateTreeSection(allFiles, fixtureDir);
  sections.push({
    title: "🌳 Use Case 7: Generate Folder Tree",
    summary: "Markdown tree output",
    lines: treeMarkdown.split("\n"),
  });

  const treeNode = buildFolderTree(allFiles, fixtureDir);
  sections.push({
    title: "🔍 Use Case 8: Build Tree Structure",
    summary: "Tree structure as JSON",
    lines: JSON.stringify(treeNode, null, 2).split("\n"),
  });

  return {
    sections,
    fixtureDir,
  };
}
